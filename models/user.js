"use strict";

const mongoose = require("mongoose");

const streetSchema = new mongoose.Schema({
  streetName: { type: String, required: true },
  numRangeStart: { type: Number, required: true},
  numRangeEnd: { type: Number, required: true},
  inhabitants: { type: mongoose.Schema.Types.OjectId, ref: 'Person'}
});

//If set timestamps, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.

streetSchema.set("timestamps", true);

module.exports = mongoose.model("Street", streetSchema);
