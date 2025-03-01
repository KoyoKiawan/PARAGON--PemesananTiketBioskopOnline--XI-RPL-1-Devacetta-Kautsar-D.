const express = require('express');
const ticketController = require('../controllers/ticket.Controller');
const checkAuth  = require('../middleware/check-auth'); // Import middleware
const router = express.Router();

router.post('/', checkAuth.checkUserAuth , ticketController.bookTicket); // Users must be logged in to book tickets
router.get('/:user_id', checkAuth.checkUserAuth , ticketController.getTickets); // Users must be logged in to view tickets
router.delete('/:id', checkAuth.checkUserAuth , ticketController.cancelBooking); // Users must be logged in to cancel tickets

module.exports = router;
