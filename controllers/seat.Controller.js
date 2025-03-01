const validator = require('fastest-validator');
const models = require('../models');

const v = new validator();

// Validation schema for seats
const seatSchema = {
    showtime_id: { type: "number", integer: true, optional: false },
    seat_number: { type: "string", optional: false, max: "5" }
};

// Get available seats for a showtime
function getSeats(req, res) {
    const showtime_id = req.params.showtime_id;

    models.seats.findAll({ where: { showtime_id } })
        .then(seats => res.status(200).json(seats))
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

// Create a seat (Admin Only)
function createSeat(req, res) {
    const seat = {
        showtime_id: req.body.showtime_id,
        seat_number: req.body.seat_number,
        is_available: req.body.is_available ?? true
    };

    const validation = v.validate(seat, seatSchema);
    if (validation !== true) {
        return res.status(400).json({ message: "Validation failed", errors: validation });
    }

    models.seats.create(seat)
        .then(result => res.status(201).json({ message: "Seat created!", seat: result }))
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

function updateSeatAvailability(req, res) {
    const seatId = req.params.id;
    const { is_available } = req.body;

    models.seats.update({ is_available }, { where: { id: seatId } })
        .then(result => {
            if (result[0] === 0) {
                return res.status(404).json({ message: "Seat not found!" });
            }
            res.status(200).json({ message: "Seat updated successfully!" });
        })
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}
module.exports = {
    getSeats,
    createSeat,
    updateSeatAvailability
};
