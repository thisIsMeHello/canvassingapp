"use strict";

const express = require("express");
const Street = require("../models/street");
const router = express.Router();

router.get('/', (req, res) => {
  Street
    .find()
    .then(streets => {
      res.json({
        streets
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.post("/", (req, res, next) => {
  const requiredFields = ["streetName", "numRangeStart", "numRangeEnd"];
  const missingField = requiredFields.find(field  => !(field in req.body));
  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    //422 - unprocessable Entity
    err.status = 422;
    return next(err);
  }
  const {streetName, numRangeStart, numRangeEnd } = req.body;

  Street
    .create({
      //es6 shortened version, replaces "streetName: streetName"
      streetName,
      // postCode,
      numRangeStart,
      numRangeEnd
    })
    .then(street => res.status(201).json(street))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.get('/:id', (req, res) => {
  Street
    .findById(req.params.id)
    .then(street => {
      res.json({
      street
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went very horribly awry' });
    });
});

router.delete('/:id', (req, res) => {
  Street
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.put('/:id', (req, res) => {
  // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
  //   res.status(400).json({
  //     error: 'Request path id and request body id values must match'
  //   });
  // }

  const updated = {};
  const updateableFields = ['streetName', 'postCode', 'numRangeStart', 'numRangeEnd'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
//getting success status 200
  Street
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

module.exports = router;
