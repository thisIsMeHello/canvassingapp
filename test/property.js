'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server.js');
const { TEST_DATABASE_URL } = require('../config');
const { TEST_PORT } = require('../config');
const Property = require('../models/property.js');
const Street = require('../models/street.js');
const mongoose = require('mongoose');

const expect = chai.expect;

chai.use(chaiHttp);

function seedPropertyData() {
  console.info('seeding property data');
  const propertyData = [];
  for (let i=1; i<=10; i++) {
    propertyData.push(generatePropertyData());
  }
  return Property.insertMany(propertyData);
}

function generatePropertyData() {
  return {
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
  console.log(streetData);
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
    return seedPropertyData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {

    it('should return all existing property records', function() {
      let res;
      return chai.request(app)
        .get('/api/properties')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.properties).to.have.length.of.at.least(1);
          return Property.count();
        })
        .then(function(count) {
          expect(res.body.properties).to.have.lengthOf(count);
        });
    });
  });

  it('should return posts with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let resProperty;
      return chai.request(app)
        .get('/api/properties')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.properties).to.be.a('array');
          expect(res.body.properties).to.have.length.of.at.least(1);

          res.body.properties.forEach(function(property) {
            expect(property).to.be.a('object');
            expect(property).to.include.keys(
              'propertyNum', 'apartment', 'street');
          });
          resProperty = res.body.properties[0];
          return Property.findById(resProperty._id);
        })
        .then(function(property) {
          console.log("property response", JSON.stringify(property), JSON.stringify(resProperty));
          expect(resProperty.propertyNum).to.equal(property.propertyNum);
          expect(resProperty.apartment).to.equal(property.apartment);
          //expect(resProperty.street).to.equal(property.street);
          //expect(resProperty.created).to.equal(post.created);
        });
  });

  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the restaurant we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new property', function() {

      let resProperty;

      const newProperty = generatePropertyData();

      return chai.request(app)
        .post('/api/properties')
        .send(newProperty)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'propertyNum', 'apartment', 'street');
          expect(res.body.propertyNum).to.equal(newProperty.propertyNum)
          // cause Mongo should have created id on insertion
          expect(res.body._id).to.not.be.null;
          expect(res.body.apartment).to.equal(newProperty.apartment);
          expect(res.body.street).to.equal(newProperty.street.toHexString() );

          resProperty = res.body;
          return Property.findById(res.body.id);
        })
        .then(function(property) {
          expect(resProperty._id).to.equal(property._id);
          expect(resProperty.propertyNum).to.contain(property.propertyNum);
          expect(resProperty.apartment).to.equal(property.apartment);
          expect(resProperty.street).to.equal(property.street );
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        street: 'Marcus Street',
        apartment: 99
      };

      return Property
        .findOne()
        .then(function(Property) {
          updateData.id = Property.id;

          return chai.request(app)
            .put(`/api/properties/${Property.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Property.findById(updateData.id);
        })
        .then(function(Property) {
          expect(Propert.street).to.equal(updateData.street);
          expect(Propert.apartment).to.equal(updateData.apartment);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete a property by id', function() {

      let property;

      return Property
        .findOne()
        .then(function(foundProperty) {
          property = foundProperty;
          return chai.request(app).delete(`/api/properties/${property.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Property.findById(property.id);
        })
        .then(function(_Property) {
          expect(_Property).to.be.null;
        });
    });
  });

});
