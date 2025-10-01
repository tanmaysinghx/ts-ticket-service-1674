import { Router } from 'express';
import TicketController from '../controllers/ticketController.js';
import ticketValidator from '../validators/ticketValidator.js';

const router = Router();

router.post('/create-ticket', ticketValidator, TicketController.createTicket);

router.get('/assign-ticket/:ticketId/:newAssignedEmail', TicketController.assignTicket);

router.get('/update-status/:ticketId/:newStatus', TicketController.updateStatus);

router.post('/add-comments/:ticketId', TicketController.addComments);

router.post('/modify-ticket/:ticketId', TicketController.modifyTicket);

router.get("/get-ticket/:ticketId", TicketController.getTicket);

router.get("/get-all-tickets", TicketController.getAllTickets);

router.get("/get-ticket-history/:ticketId", TicketController.getTicketHistory);

export default router;