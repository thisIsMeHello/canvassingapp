'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server.js');
const { TEST_DATABASE_URL } = require('../config');
const { TEST_PORT } = require('../config');
const Street = require('../models/street.js');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

chai.use(chaiHttp);

function seedStreetData() {
  console.info('seeding street data');
  const streetData = [];
  for (let i=1; i<=10; i++) {
    streetData.push(generateStreetData());
  }
  return Street.insertMany(streetData);
}

function generateStreetData() {
  return {
    "streetName": "Marcus Street",
    "numRangeStart": 1,
    "numRangeEnd": 200,
  }
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('canvassing-app api endpoints', function () {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedStreetData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {

    it('should return all existing street records', function() {
      let res;
      return chai.request(app)
        .get('/api/streets')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.streets).to.have.length.of.at.least(1);
          return Street.count();
        })
        .then(function(count) {
          expect(res.body.streets).to.have.lengthOf(count);
        });
  });

  describe('Post endpoint', function() {

    it('should add a new street', function() {

      let resStreet;

      const newStreet = generateStreetData();

      return chai.request(app)
        .post('/api/streets')
        .send(newStreet)
        .then(function(_res) {
          let resStreet = _res;
          expect(_res).to.have.status(201);
          expect(_res).to.be.json;
          expect(_res.body).to.be.a('object');
          expect(_res.body).to.include.keys(
            'streetName', 'numRangeStart', 'numRangeEnd');
          expect(_res.body.id).to.not.be.null;
          expect(_res.body.streetName).to.equal(newStreet.streetName);
          // expect(_res.body.postCode).to.equal(newStreet.postCode);
          expect(_res.body.numRangeStart).to.equal(newStreet.numRangeStart);
          expect(_res.body.numRangeEnd).to.equal(newStreet.numRangeEnd);

          resStreet = _res.body;
          return Street.findById(resStreet.id);
        })
      });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        streetName: 'Chepstow Villas'
      };

      return Street
        .findOne()
        .then(function(Street) {
          updateData.id = Street.id;
          return chai.request(app)
            .put(`/api/streets/${Street.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Street.findById(updateData.id);
        })
        .then(function(Street) {
          expect(Street.streetName).to.equal(updateData.streetName);
          // expect(Street.postCode).to.equal(updateData.postCode);
        });
    });
  });

  describe('DELETE endpoint', function() {

    it('should delete a street by id', function() {

      let id;

      return Street
        .findOne()
        .then(function(street) {
          id = street._id;
          return chai.request(app).delete(`/api/streets/${street._id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          return Street.findById(id);
        })
        .then(function(street) {
          expect(street).to.be.null;
        });
    });
  });

});
