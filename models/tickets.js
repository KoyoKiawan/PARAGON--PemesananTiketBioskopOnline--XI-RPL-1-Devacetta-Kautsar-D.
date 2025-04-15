'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tickets.init({
    user_id: DataTypes.INTEGER,
    movies_id: DataTypes.INTEGER,
    seat_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    payment_status: DataTypes.ENUM('pending', 'paid', 'cancelled'),
    booking_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tickets',
  });
  tickets.associate = function(models) {
    tickets.belongsTo(models.seats, { foreignKey: 'seat_id' });
    tickets.belongsTo(models.movies, { foreignKey: 'movies_id' });
};

  return tickets;
  
};