const db = require('../config/db');

// Get all seats for a specific movie
const getSeatsByMovie = async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const [seats] = await db.query(
      "SELECT * FROM seats WHERE movie_id = ? ORDER BY seat_code",
      [movieId]
    );
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Book multiple seats at once
const bookSeats = async (req, res) => {
  const { user_id, movie_id, seats, price, showtime } = req.body;
  // seats = ['G7', 'G8']

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    for (let seat of seats) {
      const [result] = await connection.query(
        "SELECT * FROM seats WHERE movie_id = ? AND showtime = ? AND seat_code = ? FOR UPDATE",
        [movie_id, seat]
      );

      if (!result.length || result[0].status === 'taken') {
        await connection.rollback();
        return res.status(400).json({ message: `Seat ${seat} is already taken.` });
      }

      // Update seat status
      await connection.query(
        "UPDATE seats SET status = 'taken' WHERE movie_id = ? AND showtime = ? AND seat_code = ?",
        [movie_id, showtime ,seat]
      );

      // Create ticket
      const bookingCode = Math.random().toString(36).substring(2, 10).toUpperCase(); // Short booking code
      await connection.query(
        `INSERT INTO tickets (user_id, movie_id, seat_number, price, payment_status, booking_code, showtime)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, movie_id, seat, price, 'unpaid', bookingCode, showtime]
      );
    }

    await connection.commit();
    connection.release();

    res.status(201).json({ message: 'Seats booked successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all seats a user has booked
const getBookedSeatsByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [tickets] = await db.query(
      `SELECT t.id, t.movie_id, m.title AS movie_title, t.seat_number, t.showtime, t.payment_status, t.booking_code
       FROM tickets t
       JOIN movies m ON t.movie_id = m.id
       WHERE t.user_id = ?
       ORDER BY t.showtime DESC`,
      [userId]
    );
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSeatsByMovie,
  bookSeats,
  getBookedSeatsByUser
};
