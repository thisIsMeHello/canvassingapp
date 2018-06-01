'use strict';

require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const app = express();
app.use(express.static('public'));

  if (require.main === module) {
    app.listen(process.env.PORT || 3000, function () {
      console.info(`App listening on ${this.address().port}`);
    });
  }

module.exports = app;
