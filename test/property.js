// 
// 'use strict';
//
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { app, runServer, closeServer } = require('../server.js');
// const { TEST_DATABASE_URL } = require('../config');
// const { TEST_PORT } = require('../config');
// const Property = require('../models/property.js');
// const faker = require('faker');
// const mongoose = require('mongoose');
//
// const expect = chai.expect;
//
// chai.use(chaiHttp);
//
// function seedPropertyData() {
//   console.info('seeding property data');
//   const propertyData = [];
//   for (let i=1; i<=10; i++) {
//     propertyData.push(generatePropertyData());
//   }
//   return Property.insertMany(propertyData);
// }
//
// function generatePropertyData() {
//   return {
//     propertyNum: 77,
//     apartment: 2,
//     street: "PropertyTest Ave"
//   }
// }
//
// function tearDownDb() {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// }

// function randomNumber(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }


// describe('canvassing-app api endpoints', function () {
//
//   before(function() {
//     return runServer(TEST_DATABASE_URL);
//   });
//
//   beforeEach(function() {
//     return seedPropertyData();
//   });
//
//   afterEach(function() {
//     return tearDownDb();
//   });
//
//   after(function() {
//     return closeServer();
//   });
//
//   describe('GET endpoint', function() {
//
//     it('should return all existing property records', function() {
//       let res;
//       return chai.request(app)
//         .get('/api/properties')
//         .then(function(_res) {
//           // so subsequent .then blocks can access response object
//           res = _res;
//           expect(res).to.have.status(200);
//           // otherwise our db seeding didn't work
//           expect(res.body.properties).to.have.length.of.at.least(1);
//           return Property.count();
//         })
//         .then(function(count) {
//           expect(res.body.properties).to.have.lengthOf(count);
//         });
//   });
//
//   describe('Post endpoint', function() {
//
//     it('should add a new property', function() {
//
//       let resProperty;
//
//       const newProperty = generatePropertyData();
//
//       return chai.request(app)
//         .post('/api/properties')
//         .send(newProperty)
//         .then(function(_res) {
//           let resProperty = _res;
//           expect(_res).to.have.status(201);
//           expect(_res).to.be.json;
//           expect(_res.body).to.be.a('object');
//           expect(_res.body).to.include.keys(
//             'prepertyNum', 'street');
//           expect(_res.body.id).to.not.be.null;
//           expect(_res.body.propertyNum).to.equal(newProperty.propertyNum);
//           expect(_res.body.street).to.equal(newProperty.street);
//
//           resProperty = _res.body;
//           return Property.findById(resStreet.id);
//         })
//         // .then(function(post) {
//         //   expect(resProperty.propertyNum).to.contain(newProperty.propertyNum);
//         //   expect(resProperty.propertyNum).to.equal(resProperty.propertyNum);
//         // });
//       });
//     });
//   });
//
//   describe('PUT endpoint', function() {
//
//     it('should update fields you send over', function() {
//       const updateData = {
//         propertyNum: 99,
//         street: 'The King\'s Road'
//       };
//
//       return Property
//         .findOne()
//         .then(function(Property) {
//           updateData.id = Property.id;
//
//           // make request then inspect it to make sure it reflects
//           // data we sent
//           return chai.request(app)
//             .put(`/api/properties/${Property.id}`)
//             .send(updateData);
//         })
//         .then(function(res) {
//           expect(res).to.have.status(204);
//
//           return Property.findById(updateData.id);
//         })
//         .then(function(Property) {
//           expect(Property.propertyNum).to.equal(updateData.propertyNum);
//           expect(Property.street).to.equal(updateData.street);
//         });
//     });
//   });

  // describe('DELETE endpoint', function() {
  //
  //   it('should delete a property by id', function() {
  //
  //     let property;
  //
  //     return Property
  //       .findOne()
  //       .then(function(foundProperty) {
  //         console.log("Property returned for deletion", foundProperty);
  //         property = foundProperty;
  //         return chai.request(app).delete(`/api/properties/${Property.id}`);
  //       })
  //       .then(function(res) {
  //         expect(res).to.have.status(204);
  //         return Property.findById(property.id);
  //       })
  //       .then(function(_Property) {
  //         expect(_Property.to.be.null;
  //       });
  //   });
  // });
//
// });
