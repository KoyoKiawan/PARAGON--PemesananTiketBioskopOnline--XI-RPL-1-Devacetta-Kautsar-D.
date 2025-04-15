const validator = require('fastest-validator');
const models = require('../models');

const v = new validator();


const showtimeSchema = {
    movie_id: { type: "number", integer: true, optional: false },
    time: { type: "string", optional: false, max: 10 }
};

function getShowtimes(req, res) {
    models.showtimes.findAll()
        .then(showtimes => res.status(200).json(showtimes))
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

function createShowtime(req, res) {
    const showtime = {
        movie_id: req.body.movie_id,
        time: req.body.time
    };

    if (isNaN(Date.parse(req.body.date))) {
        return res.status(400).json({ message: "Invalid date format!" });
    }
    showtime.date = new Date(req.body.date);

    const validation = v.validate(showtime, showtimeSchema);
    if (validation !== true) {
        return res.status(400).json({ message: "Validation failed", errors: validation });
    }

    models.showtimes.findOne({ where: { movie_id: showtime.movie_id, date: showtime.date, time: showtime.time } })
        .then(existingShowtime => {
            if (existingShowtime) {
                return res.status(409).json({ message: "Showtime already exists!" });
            }
            return models.showtimes.create(showtime);
        })
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
