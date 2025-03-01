const express = require('express');
const seatController = require('../controllers/seat.Controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/:showtime_id',checkAuth.checkUserAuth, seatController.getSeats);
router.patch('/:id',checkAuth.checkUserAuth, seatController.updateSeatAvailability);
router.post('/', checkAuth.checkAuth, seatController.createSeat);

module.exports = router;
