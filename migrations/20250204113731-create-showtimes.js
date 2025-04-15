// 'use strict';

// const { FOREIGNKEYS } = require('sequelize/lib/query-types');

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('showtimes', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       movie_id: {
//         allowNull: false,
//         type: Sequelize.INTEGER,
//         references:{
//           model: 'movies',
//           key: 'id'
//         }
//       },
//       date: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       time: {
//         allowNull: false,
//         type: Sequelize.TIME
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
//     await queryInterface.dropTable('showtimes');
//   }
// };