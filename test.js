import chai from 'chai';
import spies from 'chai-spies';

chai.use(spies);

import aeroflow from './source/aeroflow.js';
import aeroflowTests from './tests/aeroflow.js';

aeroflowTests(aeroflow, chai);
