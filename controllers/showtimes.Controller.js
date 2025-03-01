const validator = require('fastest-validator');
const models = require('../models');

const v = new validator();

// Validation schema for showtimes
const showtimeSchema = {
    movie_id: { type: "number", integer: true, optional: false },
    date: { type: "date", optional: false },
    time: { type: "string", optional: false, max: "10" }
};

// Get all showtimes
function getShowtimes(req, res) {
    models.showtimes.findAll()
        .then(showtimes => res.status(200).json(showtimes))
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

// Create a showtime (Admin Only)
function createShowtime(req, res) {
    const showtime = {
        movie_id: req.body.movie_id,
        date: new Date(req.body.date),
        time: req.body.time
    };

    const validation = v.validate(showtime, showtimeSchema);
    if (validation !== true) {
        return res.status(400).json({ message: "Validation failed", errors: validation });
    }

    models.showtimes.create(showtime)
        .then(result => res.status(201).json({ message: "Showtime created!", showtime: result }))
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

function getShowtimesByMovie(req, res) {
    const movieId = req.params.movie_id;

    models.showtimes.findAll({ where: { movie_id: movieId } })
        .then(showtimes => res.status(200).json(showtimes))
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

module.exports = {
    getShowtimes,
    createShowtime,
    getShowtimesByMovie
};
