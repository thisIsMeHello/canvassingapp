"use strict";

const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  votingIntention: String,
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
});

//If set timestamps, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.

residentSchema.set("timestamps", true);

module.exports = mongoose.model("Resident", residentSchema);
