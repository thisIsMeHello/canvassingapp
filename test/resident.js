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
          expect(res.body.residents).to.have.length.of.at.least(1);
          return Resident.count();
        })
        .then(function(count) {
          expect(res.body.residents).to.have.lengthOf(count);
        });
    });
  });

  it('should return residents with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let resResident;
      return chai.request(app)
        .get('/api/residents')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.residents).to.be.a('array');
          expect(res.body.residents).to.have.length.of.at.least(1);

          res.body.residents.forEach(function(resident) {
            expect(resident).to.be.a('object');
            expect(resident).to.include.keys(
              'firstName', 'surname', 'votingIntention');
          });
          resResident = res.body.residents[0];
          return Resident.findById(resResident._id);
        })
        .then(function(resident) {
          expect(resResident.firstName).to.equal(resident.firstName);
          expect(resResident.surname).to.equal(resident.surname);
          expect(resResident.votingIntention).to.equal(resident.votingIntention);
          //expect(resProperty.street).to.equal(property.street);
          //expect(resProperty.created).to.equal(post.created);
        });
  });

  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the restaurant we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new resident', function() {

      let resResident;

      const newResident = generateResidentData();

      return chai.request(app)
        .post('/api/residents')
        .send(newResident)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'firstName', 'surname', 'votingIntention');
          expect(res.body.firstName).to.equal(newResident.firstName)
          // cause Mongo should have created id on insertion
          expect(res.body._id).to.not.be.null;
          expect(res.body.surname).to.equal(newResident.surname);
          expect(res.body.votingIntention).to.equal(newResident.votingIntention);

          resResident = res.body;
          return Resident.findById(res.body._id);
        })
        .then(function(resident) {
          // expect(resProperty._id).to.equal(property._id.toHexString());
          expect(resResident.firstName).to.equal(resident.firstName);

          // expect(resProperty.apartment).to.equal(property.apartment);
          // expect(resProperty.street).to.equal(property.street );
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        firstName: "John",
        surname: "Robinson"
      };

      return Resident
        .findOne()
        .then(function(resident) {
          updateData._id = resident._id;

          return chai.request(app)
            .put(`/api/residents/${resident._id}`)
            .send(updateData);
        })
        .then(function(res) {

          expect(res).to.have.status(204);

          return Resident.findById(updateData._id);
        })
        .then(function(resident) {
          expect(resident.apartment).to.equal(updateData.apartment);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete a resident by id', function() {

      let resident;

      return Resident
        .findOne()
        .then(function(foundResident) {
          resident = foundResident;
          return chai.request(app).delete(`/api/residents/${resident.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          return Resident.findById(resident.id);
        })
        .then(function(_Resident) {
          expect(_Resident).to.be.null;
        });
    });
  });

});
