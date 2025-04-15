// utils/generateSeats.js
const db = require('../config/db'); // ✅ Must match your db setup

const generateSeats = async (movieId) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const columns = 12;

  const seats = [];

  for (const row of rows) {
    for (let col = 1; col <= columns; col++) {
      const seatNumber = `${row}${col}`;
      seats.push([movieId, seatNumber, 'available']);
    }
  }

  try {
    db.query(
      "INSERT INTO seats (movie_id, seat_code, status) VALUES ?",
      [seats]
    );
    console.log(`✅ ${seats.length} seats inserted for movie ID: ${movieId}`);
  } catch (err) {
    console.error("❌ Error inserting seats:", err);
    throw err;
  }
};

module.exports = generateSeats;
