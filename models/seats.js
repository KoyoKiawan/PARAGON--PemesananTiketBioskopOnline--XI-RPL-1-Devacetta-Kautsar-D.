'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class seats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  seats.init({
    movies_id: {
      type:DataTypes.INTEGER,
      references:{
        model: 'showtimes',
        key: 'movie_id'
      }
    },
    seat_number: DataTypes.STRING,
    is_available: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  }, {
    sequelize,
    modelName: 'seats',
  });
  seats.associate = function(models) {
    seats.belongsTo(models.showtimes, { foreignKey: 'movie_id' });
    seats.hasOne(models.tickets, { foreignKey: 'seat_id' });
};

  return seats;
};