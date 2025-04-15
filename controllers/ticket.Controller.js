const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const bookTickets = async (req, res) => {
  const { movie_id, seat_number, price, showtime } = req.body;
  const user_id = req.user?.id;

  if (!Array.isArray(seat_number) || seat_number.length === 0) {
    return res.status(400).json({ message: "seat_number must be an array." });
  }

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    for (const seat of seat_number) {
      
      const [result] = await connection.query(
        "SELECT * FROM tickets WHERE movie_id = ? AND seat_number = ? AND showtime = ?",
        [movie_id, seat, showtime]
      );

      if (result.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ message: `Seat ${seat} is already taken for this showtime.` });
      }

   
      const bookingCode = uuidv4().split("-")[0].toUpperCase();
      await connection.query(
        `INSERT INTO tickets (user_id, movie_id, seat_number, price, payment_status, booking_code, showtime)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, movie_id, seat, price, "unpaid", bookingCode, showtime]
      );

      await connection.query(
        `UPDATE seats SET status = 'taken' WHERE movie_id = ? AND seat_code = ?`,
        [movie_id, seat]
      );
      
    }

    

    await connection.commit();
    connection.release();
    res.status(201).json({ message: "Tickets booked successfully!" });
  } catch (err) {
    console.error("Error in bookTickets:", err);
    res.status(500).json({ error: err.message });
  }
};


const getTakenSeats = async (req, res) => {
  const { id } = req.params;
  const { showtime } = req.query;

  if (!showtime || isNaN(Date.parse(showtime))) {
    return res.status(400).json({ message: "Invalid or missing showtime." });
  }

  try {
    const [rows] = await db.query(
      "SELECT seat_number FROM tickets WHERE movie_id = ? AND showtime = ?",
      [id, showtime]
    );

    const takenSeats = rows.map((row) => row.seat_number);
    console.log("Taken seats from database:", takenSeats); 
    res.status(200).json({ takenSeats });
  } catch (error) {
    console.error("Error fetching taken seats:", error);
    res.status(500).json({ message: "Failed to fetch taken seats." });
  }
};
module.exports = {
  bookTickets,getTakenSeats
};