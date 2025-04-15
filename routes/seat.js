const express = require('express');
const seatController = require('../controllers/seat.Controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/:movieId', seatController.getSeatsByMovie);
router.post('/book', checkAuth.checkUserAuth,seatController.bookSeats);
router.get('/user/:userId', checkAuth.checkUserAuth,seatController.getBookedSeatsByUser);
module.exports = router;
