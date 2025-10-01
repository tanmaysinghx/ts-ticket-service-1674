import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import TicketService from '../services/ticketService.js';
import { sendSuccess, sendError } from '../utils/responseHelpers.js';

class TicketController {
    static async createTicket(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendError(res, 'Validation failed', errors.array(), 400);
        }
        try {
            const ticketData = req.body;
            const ticket = await TicketService.createTicket(ticketData);
            return sendSuccess(
                res,
                'Ticket created successfully',
                { ticket },
                201,
                undefined,
                undefined,
                { ticketId: ticket.ticketId, status: ticket.status }
            );
        } catch (err: any) {
            return sendError(res, err.message || 'Internal Server Error', [], err.statusCode || 500);
        }
    }

    static async assignTicket(req: Request, res: Response) {
        try {
            const { ticketId, newAssignedEmail } = req.params;
            const changedBy = (req.query.changedBy as string) || 'system';
            if (!ticketId || !newAssignedEmail) {
                return sendError(res, 'ticketId and newAssignedEmail parameters are required', [], 400);
            }
            const ticket = await TicketService.assignTicket(ticketId, newAssignedEmail, changedBy);
            return sendSuccess(res, `Ticket ${ticketId} assigned`, { ticket });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { ticketId, newStatus } = req.params;
            const changedByEmail = (req.query.changedBy as string) || 'system';
            if (!ticketId || !newStatus) {
                return sendError(res, 'ticketId and newStatus parameters are required', [], 400);
            }
            const ticket = await TicketService.updateStatus(ticketId, newStatus, changedByEmail);
            return sendSuccess(res, `Ticket ${ticketId} status updated`, { ticket });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async modifyTicket(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            if (!ticketId) {
                return sendError(res, 'ticketId parameter is required', [], 400);
            }
            const changes = req.body;
            const changedBy = req.body.changedBy || 'system';
            const updatedTicket = await TicketService.modifyTicket(ticketId, changes, changedBy);
            return sendSuccess(res, `Ticket ${ticketId} updated successfully`, { ticket: updatedTicket });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async addComments(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const { commenter, comment } = req.body;
            if (!commenter || !comment) {
                return sendError(res, 'Commenter and comment are required', [], 400);
            }
            const updatedTicket = await TicketService.addComment(ticketId, { commenter, comment });
            return sendSuccess(res, 'Comment added successfully', { ticket: updatedTicket });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getTicket(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            if (!ticketId) {
                return sendError(res, 'TicketId is required', [], 400);
            }
            const ticketData = await TicketService.getTicket(ticketId);
            return sendSuccess(res, 'Ticket data fetched', { ticket: ticketData });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getAllTickets(req: Request, res: Response) {
        try {
            const { status, priority, assignedToUser, reportedBy, assignedToTeam, assignedToGroup } = req.query;
            if (!status && !priority && !assignedToUser && !reportedBy && !assignedToTeam && !assignedToGroup) {
                return sendError(res, 'At least one query parameter is required for filtering', [], 400);
            }
            const filters: Record<string, any> = {};
            if (status) filters.status = status;
            if (priority) filters.priority = priority;
            if (assignedToUser) filters.assignedToUser = assignedToUser;
            if (reportedBy) filters.reportedBy = reportedBy;
            if (assignedToTeam) filters.assignedToTeam = assignedToTeam;
            if (assignedToGroup) filters.assignedToGroup = assignedToGroup;
            const tickets = await TicketService.getAllTickets(filters);
            return sendSuccess(res, 'Tickets fetched successfully', { tickets });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

    static async getTicketHistory(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            if (!ticketId) {
                return sendError(res, 'TicketId is required', [], 400);
            }
            const ticketHistory = await TicketService.getTicketHistory(ticketId);
            return sendSuccess(res, 'Ticket data fetched', { ticketHistory: ticketHistory });
        } catch (error: any) {
            return sendError(res, error.message);
        }
    }

}

export default TicketController;
