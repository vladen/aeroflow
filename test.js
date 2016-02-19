var chai = require("chai");
chai.use(require("chai-as-promised"));

require('./test/aeroflow.js')(require('./source/aeroflow.js'), chai.assert);
