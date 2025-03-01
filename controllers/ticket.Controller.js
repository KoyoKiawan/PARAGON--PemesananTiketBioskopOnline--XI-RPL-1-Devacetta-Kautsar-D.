const validator = require('fastest-validator');
const models = require('../models');
const { v4: uuidv4 } = require('uuid');

const v = new validator();


const ticketSchema = {
    user_id: { type: "number", integer: true, optional: false },
    showtime_id: { type: "number", integer: true, optional: false },
    seat_id: { type: "number", integer: true, optional: false },
    price: { type: "number", positive: true, optional: false }
};


function bookTicket(req, res) {
    const ticket = {
        user_id: req.body.user_id,
        showtime_id: req.body.showtime_id,
        seat_id: req.body.seat_id,
        price: req.body.price,
        payment_status: 'pending',
        booking_code: uuidv4()
    };

    const validation = v.validate(ticket, ticketSchema);
    if (validation !== true) {
        return res.status(400).json({ message: "Validation failed", errors: validation });
    }

    models.seats.findOne({ where: { id: ticket.seat_id, showtime_id: ticket.showtime_id, is_available: false } })
        .then(seat => {
            if (!seat) {
                return res.status(400).json({ message: "Seat is not available!" });
            }

            
            return models.tickets.create(ticket)
                .then(result => {
                    return models.seats.update({ is_available: true }, { where: { id: ticket.seat_id } })
                        .then(() => res.status(201).json({ message: "Ticket booked successfully!", ticket: result }))
                        .catch(error => res.status(500).json({ message: "Failed to update seat availability!", error }));
                });
        })
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

function cancelBooking(req, res) {
    const ticketId = req.params.id;

    models.tickets.findOne({ where: { id: ticketId } })
        .then(ticket => {
            if (!ticket) {
                return res.status(404).json({ message: "Ticket not found!" });
            }

            return models.tickets.update({ payment_status: "cancelled" }, { where: { id: ticketId } })
                .then(() => {
                    return models.seats.update({ is_available: false }, { where: { id: ticket.seat_id } })
                        .then(() => res.status(200).json({ message: "Booking cancelled successfully!" }))
                        .catch(error => res.status(500).json({ message: "Failed to update seat availability!", error }));
                });
        })
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}   
function getTickets(req, res) {
    const user_id = req.params.user_id;

    models.tickets.findAll({ where: { user_id } })
        .then(tickets => {
            if (tickets.length === 0) {
                return res.status(404).json({ message: "No tickets found!" });
            }
            res.status(200).json(tickets);
        })
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

module.exports = {
    bookTicket,
    cancelBooking,
    getTickets
};
