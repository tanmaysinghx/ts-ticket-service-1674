import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 100,
            validate: {
                validator: function (v) {
                    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 200
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 2000
        },
        status: {
            type: String,
            enum: ['CREATED', 'ASSIGNED', 'OPEN', 'RETEST', 'CLOSED', 'REOPENED', 'ONHOLD', 'DUPLICATE', 'INVALID'],
            default: 'CREATED'
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
            default: 'LOW'
        },
        assignedToGroup: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },
        assignedToTeam: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },
        assignedToUser: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },
        reportedBy: {
            type: String,
            trim: true,
            lowercase: true,
            required: true
        },
        tags: {
            type: [String],
            default: []
        },
        attachments: {
            type: [String],
            default: []
        },
        dueDate: {
            type: Date,
            default: null
        },
        comments: [
            {
                commenter: { type: String, trim: true, lowercase: true },
                comment: { type: String, trim: true },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        lastUpdatedBy: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },
        history: [
            {
                action: { type: String, required: true },
                fromValue: { type: String, default: null },
                toValue: { type: String, required: true },
                changedBy: { type: String, trim: true, lowercase: true, required: true },
                timestamp: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;