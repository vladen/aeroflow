'use strict';

try {
  require('./modern/aeroflow.tests.js')(
    require('./modern')
  , require('chai').assert);
} catch(error) {
  require('./legacy/aeroflow.tests.js')(
    require('./legacy')
  , require('chai').assert);
}
