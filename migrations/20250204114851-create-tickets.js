'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        references:{
          model: 'users',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      showtime_id: {
        allowNull: false,
        references:{
          model: 'showtimes',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      seat_id: {
        allowNull: false,
        references:{
          model: 'seats',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2)
      },
      payment_status: {
        allowNull: false,
        type: Sequelize.ENUM('pending', 'paid','cancelled')
      },
      booking_code: {
        allowNull: false,
        type: Sequelize.STRING,
        unique:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tickets');
  }
};