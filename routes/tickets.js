const express = require('express');
const ticketController = require('../controllers/ticket.Controller');
const checkAuth  = require('../middleware/check-auth'); // Import middleware
const router = express.Router();
const db = require("../config/db");

router.post('/book', checkAuth.checkUserAuth,ticketController.bookTickets);
router.get("/seats/:id", ticketController.getTakenSeats);
module.exports = router;
