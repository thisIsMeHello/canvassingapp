'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.js');

//doesn't work with Heroku(has own method for setting env variables)
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, ()=> console.log("connected to mongoDB"))

app.use(express.static('public'));
app.use("/user", userRoutes);

  if (require.main === module) {
    app.listen(process.env.PORT || 3000, function () {
      console.info(`App listening on ${this.address().port}`);
    });
  }

module.exports = app;
