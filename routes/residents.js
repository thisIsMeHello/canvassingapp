"use strict";

const express = require("express");
const Resident = require("../models/resident");
const router = express.Router();

router.get('/', (req, res) => {
  Resident
    .find()
    .then(residents => {
      res.json({
        residents
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.post("/", (req, res, next) => {
  const requiredFields = ["firstName", "surname", "votingIntention", "property"];
  const missingField = requiredFields.find(field  => !(field in req.body));
  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    //422 - unprocessable Entity
    err.status = 422;
    return next(err);
  }
  const {firstName, surname, votingIntention, property } = req.body;

  Resident
    .create({
      //es6 shortened version, replaces "firstName: firstName"
      firstName,
      surname,
      votingIntention,
      property
    })
    .then(blogPost => res.status(201).json(blogPost))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
})

router.get('/:id', (req, res) => {
  Resident
    .findById(req.params.id)
    .then(resident => {
      res.json({
      resident
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went very horribly awry' });
    });
});

router.delete('/:id', (req, res) => {
  Resident
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
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['firstName', 'surname', 'votingIntention', 'property'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
//getting success status 200
  Resident
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

module.exports = router;
