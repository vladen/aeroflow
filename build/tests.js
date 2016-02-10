'use strict';

var chai = require("chai");
chai.use(require("chai-as-promised"));

try {
  require('./modern/aeroflow.tests.js')(
    require('./modern')
  , chai.assert);
} catch(error) {
  require('./legacy/aeroflow.tests.js')(
    require('./legacy')
  , chai.assert);
}
