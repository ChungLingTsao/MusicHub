const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const trackRoutes = require('./api/routes/tracks');
const albumRoutes = require('./api/routes/albums');
const artistRoutes = require('./api/routes/artists');
const userRoutes = require('./api/routes/user');

/*mongoose.connect(
  "mongodb://Charles:" +
    process.env.MONGO_ATLAS_PW +
    "@charles-shard-00-00-a51s8.mongodb.net:27017,charles-shard-00-01-a51s8.mongodb.net:27017,charles-shard-00-02-a51s8.mongodb.net:27017/test?ssl=true&replicaSet=Charles-shard-0&authSource=admin&retryWrites=true",
    { useNewUrlParser: true }
);*/
mongoose.connect('mongodb://localhost:27017/MusicHub', { useNewUrlParser: true });
mongoose.Promise = global.Promise; // removes depreciation warning

// Produces terminal logs
app.use(morgan('dev'));

// Extracts JSON data and makes it readable
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Routes that handle requests
app.use('/tracks', trackRoutes);
app.use('/albums', albumRoutes);
app.use('/artists', artistRoutes);
app.use('/user', userRoutes);

// Route if a fitting route is not found
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Route if a internal service error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;
