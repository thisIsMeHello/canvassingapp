// "use strict";
//
// const { app }  = require("../server");
// console.log(app);
// const chai = require("chai");
// const chaiHttp = require("chai-http");
//
// // Clear the console before each run
// // process.stdout.write("\x1Bc\n");
//
// const expect = chai.expect;
//
// chai.use(chaiHttp);
//
//
// describe("Environment", () => {
//
//   it('NODE_ENV should be "test"', () => {
//     expect(process.env.NODE_ENV).to.equal("test");
//   });
//
// });
//
// describe("Basic Express setup", () => {
//
//   describe("Express static", () => {
//
//     it('GET request "/" should return the index page', () => {
//       return chai.request(app)
//         .get("/")
//         .then(function (res) {
//           expect(res).to.exist;
//           expect(res).to.have.status(200);
//           expect(res).to.be.html;
//         });
//     });
//
//   });
//
//   describe("404 handler", () => {
//
//     it("should respond with 404 when given a bad path", () => {
//       return chai.request(app)
//         .get("/bad/path")
//         .then(res => {
//           expect(res).to.have.status(404);
//         });
//     });
//
//   });
// });
