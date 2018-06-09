'use strict';

require("dotenv").config();

const express = require('express');
const streetsRouter = require("./routes/streets");
const propertiesRouter = require("./routes/properties");
const residentsRouter = require("./routes/residents");
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));

app.use("/api/streets", streetsRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/residents", residentsRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    console.log("about to connect to Mongo")
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      console.log("Connected to mongo")
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
