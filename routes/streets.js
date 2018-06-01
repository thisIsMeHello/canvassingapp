"use strict";

const express = require("express");
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const Street = require("../models/street");

const router = express.Router();

router.post("/", (req, res, next) => {
  const requiredFields = ["streetName", "numRangeStart", "numRangeEnd"];
  const missingField = requiredFields.find(field  => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }



})

module.exports = router;
