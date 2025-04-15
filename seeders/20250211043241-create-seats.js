'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const totalSeats = 10;
    const showtimeId = 1;

    rows.forEach(row => {
      for (let i = 1; i <= totalSeats; i++) {
        seats.push({
          seat_number: `${row}${i}`,
          showtime_id: showtimeId,
          is_available: false, 
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    return queryInterface.bulkInsert('seats', seats, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('seats', null, {});
  }
};
