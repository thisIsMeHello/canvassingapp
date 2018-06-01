"use strict";

const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  propertyNum: { type: Number, required: true },
  apartment: { type: Number};
  street: { type: mongoose.Schema.Types.OjectId, ref: 'Street' }
});

//If set timestamps, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.

propertySchema.set("timestamps", true);

module.exports = mongoose.model("Property", propertySchema);
