'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class showtimes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  showtimes.init({
    movie_id: {
      type:DataTypes.INTEGER,
      references:{
        model: 'movies',
        key: 'id'
      }
    },
    date: DataTypes.DATE,
    time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'showtimes',
  });
  showtimes.associate = function(models) {
    showtimes.hasMany(models.seats, { foreignKey: 'showtime_id' });
    showtimes.hasMany(models.tickets, { foreignKey: 'showtime_id' });
};

  return showtimes;
};