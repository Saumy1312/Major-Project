const serverless = require('serverless-http');
const app = require('../app'); // your Express app

module.exports = serverless(app); // ✅ this is the required default export
