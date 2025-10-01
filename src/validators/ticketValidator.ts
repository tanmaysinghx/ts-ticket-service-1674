import { body } from 'express-validator';

const ticketValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('title')
    .isString()
    .withMessage('Title must be a string')
    .bail() // stop if not a string
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),

  body('description')
    .isString()
    .withMessage('Description must be a string')
    .bail()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Description must be between 5 and 2000 characters'),

  body('status')
    .optional()
    .isIn(['CREATED', 'ASSIGNED', 'OPEN', 'RETEST', 'CLOSED', 'REOPENED', 'ONHOLD', 'DUPLICATE', 'INVALID'])
    .withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority value'),

  body('assignedToGroup').optional().isString().trim(),
  body('assignedToTeam').optional().isString().trim(),
  body('assignedToUser').optional().isString().trim(),

  body('reportedBy')
    .isEmail()
    .withMessage('Valid reportedBy email is required'),

  body('tags').optional().isArray(),
  body('tags.*').optional().isString(),

  body('attachments').optional().isArray(),
  body('attachments.*').optional().isString(),

  body('dueDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid dueDate format'),

  body('comments').optional().isArray(),
  body('comments.*.commenter').optional().isString(),
  body('comments.*.comment').optional().isString(),
];

export default ticketValidator;