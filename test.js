import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import aeroflow from './source/index';
import aeroflowTests from './tests/index';

aeroflowTests(aeroflow, chai.expect, sinon);
