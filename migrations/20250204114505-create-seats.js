// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('seats', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       showtime_id: {
//         allowNull: false,
//         references:{
//           model: 'showtimes',
//           key: 'id'
//         },
//         type: Sequelize.INTEGER
//       },
//       seat_number: {
//         allowNull: false,
//         type: Sequelize.STRING
//       },
//       is_available: {
//         allowNull: false,
//         default: true,
//         type: Sequelize.BOOLEAN
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('seats');
//   }
// };