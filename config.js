'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/canvassing-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-canvassing-app';
exports.PORT = process.env.PORT || 8080;
