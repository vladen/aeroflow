import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import aeroflow from './source/aeroflow.js';
import aeroflowTests from './tests/aeroflow.js';

aeroflowTests(aeroflow, chai.expect, sinon);
