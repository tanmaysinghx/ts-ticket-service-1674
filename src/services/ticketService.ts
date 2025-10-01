import TicketSchema from "../models/ticketSchema.js";

interface ITicketData {
    email: string;
    title: string;
    description: string;
    status?: string;
    priority?: string;
    assignedTo?: string | null;
    reportedBy: string;
    tags?: string[];
    attachments?: string[];
    dueDate?: Date | null;
    comments?: Array<{ commenter: string; comment: string }>;
    createdByIp?: string;
    lastUpdatedBy?: string | null;
    ticketId?: string;
}

interface IComment {
    commenter: string;
    comment: string;
}

async function generateTicketId(): Promise<string> {
    const lastTicket = await TicketSchema.findOne({})
        .sort({ createdAt: -1 })
        .select('ticketId')
        .lean()
        .exec();

    if (!lastTicket || !lastTicket.ticketId) {
        return 'TCKT000001';
    }

    const lastIdNum = parseInt(lastTicket.ticketId.replace('TCKT', ''), 10);
    const nextIdNum = lastIdNum + 1;
    return `TCKT${nextIdNum.toString().padStart(6, '0')}`;
}

class TicketService {
    static async createTicket(ticketData: ITicketData) {
        ticketData.ticketId = await generateTicketId();
        const newTicket = new TicketSchema(ticketData);
        newTicket.history = newTicket.history || [];
        newTicket.history.push({
            action: 'CREATED',
            fromValue: null,
            toValue: newTicket.assignedToUser || 'unassigned',
            changedBy: newTicket.reportedBy,
            timestamp: new Date()
        });

        await newTicket.save();
        return newTicket;
    }

    static async assignTicket(ticketId: string, newAssignedEmail: string, changedBy: string) {
        const ticket = await TicketSchema.findOne({ ticketId });
        if (!ticket) throw new Error('Ticket not found');
        const oldAssignedToUser = ticket.assignedToUser || null;
        ticket.assignedToUser = newAssignedEmail;
        ticket.history.push({
            action: 'ASSIGNMENT_CHANGED',
            fromValue: oldAssignedToUser,
            toValue: newAssignedEmail,
            changedBy,
            timestamp: new Date()
        });
        await ticket.save();
        return ticket;
    }

    static async updateStatus(ticketId: string, newStatus: string, changedBy: string) {
        const ticket = await TicketSchema.findOne({ ticketId });
        if (!ticket) throw new Error('Ticket not found');
        const allowedStatuses = [
            "CREATED", "ASSIGNED", "OPEN", "RETEST", "CLOSED", "REOPENED", "ONHOLD", "DUPLICATE", "INVALID"
        ] as const;
        if (newStatus && newStatus !== ticket.status) {
            if (!allowedStatuses.includes(newStatus as typeof allowedStatuses[number])) {
                throw new Error(`Invalid status value: ${newStatus}`);
            }
            ticket.history.push({
                action: 'STATUS_CHANGED',
                fromValue: ticket.status,
                toValue: newStatus,
                changedBy,
                timestamp: new Date()
            });
            ticket.status = newStatus as typeof allowedStatuses[number];
        }
        await ticket.save();
        return ticket;
    }

    static async modifyTicket(ticketId: string, changes: any, changedBy: string) {
        const ticket = await TicketSchema.findOne({ ticketId });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        const allowedKeys: Array<keyof ITicketData> = [
            "email", "title", "description", "status", "priority", "assignedTo", "reportedBy", "tags", "attachments", "dueDate", "comments", "createdByIp", "lastUpdatedBy", "ticketId"
        ];
        for (const key of Object.keys(changes)) {
            if (key === 'changedBy') continue;
            if (!allowedKeys.includes(key as keyof ITicketData)) continue;
            const oldValue = (ticket as any)[key];
            const newValue = changes[key];
            if (newValue !== undefined && newValue !== oldValue) {
                if (key === 'comments' && Array.isArray(newValue)) {
                    for (const comment of newValue) {
                        ticket.comments.push(comment);
                    }
                    ticket.history.push({
                        action: 'UPDATED_COMMENTS',
                        fromValue: `${(oldValue as any[]).length} comments`,
                        toValue: `${ticket.comments.length} comments`,
                        changedBy,
                        timestamp: new Date()
                    });
                } else {
                    (ticket as any)[key] = newValue;
                    ticket.history.push({
                        action: `UPDATED_${key.toUpperCase()}`,
                        fromValue: oldValue != null ? oldValue.toString() : null,
                        toValue: newValue != null ? newValue.toString() : null,
                        changedBy,
                        timestamp: new Date()
                    });
                }
            }
            await ticket.save();
            return ticket;
        }
    }

    static async addComment(ticketId: string, commentData: IComment) {
        const ticket = await TicketSchema.findOne({ ticketId });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.comments.push({
            commenter: commentData.commenter,
            comment: commentData.comment,
            createdAt: new Date()
        });
        ticket.history.push({
            action: 'COMMENT_ADDED',
            fromValue: null,
            toValue: `Comment added by ${commentData.commenter}`,
            changedBy: commentData.commenter,
            timestamp: new Date()
        });
        await ticket.save();
        return ticket;
    }

    static async getTicket(ticketId: string) {
        const ticket = await TicketSchema.findOne({ ticketId });
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        return ticket;
    }
}

export default TicketService;
