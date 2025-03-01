const express = require('express');
const showtimeController = require('../controllers/showtimes.Controller');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.post('/', checkAuth.checkAuth, showtimeController.createShowtime); // Admin only
router.get('/', checkAuth.checkUserAuth , showtimeController.getShowtimes);
router.get('/:movie_id',checkAuth.checkUserAuth , showtimeController.getShowtimesByMovie);

module.exports = router;
