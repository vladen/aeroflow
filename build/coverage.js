var chai = require("chai");
chai.use(require("chai-as-promised"));

require('./legacy/aeroflow.tests.js')(require('./legacy'), chai.assert);
