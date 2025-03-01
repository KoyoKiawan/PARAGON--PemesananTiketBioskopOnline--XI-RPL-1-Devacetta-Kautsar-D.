const express = require('express');
const app = express();
const bodyParser = require('body-parser');
/**
 * 
 */
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const adminRoutes = require('./routes/admin');
const seatRoutes = require('./routes/seat');
const showtimesRoutes = require('./routes/showtimes');
const ticketsRoutes = require('./routes/tickets');
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/movie', movieRoutes);
app.use('/seats',seatRoutes);
app.use('/showtimes', showtimesRoutes);
app.use('/tickets', ticketsRoutes);

module.exports = app;