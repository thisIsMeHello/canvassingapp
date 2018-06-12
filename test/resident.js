'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server.js');
const { TEST_DATABASE_URL } = require('../config');
const { TEST_PORT } = require('../config');
const Property = require('../models/property.js');
const Street = require('../models/street.js');
const Resident = require('../models/resident.js');
const mongoose = require('mongoose');

const expect = chai.expect;

chai.use(chaiHttp);

function seedResidentData() {
  console.info('seeding resident data');
  const residentData = [];
  for (let i=1; i<=10; i++) {
    residentData.push(generateResidentData());
  }
  return Resident.insertMany(residentData);
}

function generateResidentData() {
  return {
    "firstName": "Dave",
    "surname": "Biggles",
    // "street": { type: mongoose.Schema.Types.ObjectId, ref: 'Street' },
    "votingIntention": "Labour",
    "property": mongoose.Types.ObjectId(5)
  }
}

function seedPropertyData() {
  console.info('seeding property data');
  const propertyData = [];
  for (let i=1; i<=10; i++) {
    propertyData.push(generatePropertyData(i));
  }
  return Property.insertMany(propertyData);
}

function generatePropertyData(i) {
  return {
    "_id": mongoose.Types.ObjectId(i),
    "propertyNum": 77,
    "apartment": 3,
    // "street": { type: mongoose.Schema.Types.ObjectId, ref: 'Street' },
    "street": mongoose.Types.ObjectId(5)
  }
}

function seedStreetData() {
  console.info('seeding street data');
  const streetData = [];
  for (let i=1; i<=10; i++) {
    streetData.push(generateStreetData(i));
  }
  return Street.insertMany(streetData);
  console.log("Is this working?", streetData);
}

function generateStreetData(i) {
  return {
    "_id": mongoose.Types.ObjectId(i),
    "streetName": "Marcus Street",
    "postCode": "SE22 8TH",
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
    seedStreetData();
    seedPropertyData();
    return seedResidentData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {

    it('should return all existing resident records', function() {
      let res;
      return chai.request(app)
        .get('/api/residents')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.properties).to.have.length.of.at.least(1);
          return Resident.count();
        })
        .then(function(count) {
          expect(res.body.residents).to.have.lengthOf(count);
        });
    });
  });

});
