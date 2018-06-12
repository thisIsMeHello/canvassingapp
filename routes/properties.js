"use strict";

const express = require("express");
const Property = require("../models/property");
const router = express.Router();

router.get('/', (req, res) => {
  Property
    .find()
    .then(properties => {
      res.json({
        properties
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.post("/", (req, res, next) => {
  const requiredFields = ["propertyNum", "apartment", "street"];
  const missingField = requiredFields.find(field  => !(field in req.body));
  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    //422 - unprocessable Entity
    err.status = 422;
    return next(err);
  }
  const { propertyNum, apartment, street } = req.body;

  Property
    .create({
      //es6 shortened version, replaces "propertyNum: propertyNum"
      propertyNum,
      apartment,
      street
    })
    .then(blogPost => res.status(201).json(blogPost))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.get('/:id', (req, res) => {
  Property
    .findById(req.params.id)
    .then(Property => {
      res.json({
      Property
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went very horribly awry' });
    });
});

router.delete('/:id', (req, res) => {
  Property
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['propertyNum', 'apartment'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
//getting success status 200
  Property
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

module.exports = router;
