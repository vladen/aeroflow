'use strict';

import staticMethodsTests from './staticMethods.js';
import factoryTests from './factory.js';
import instanceTests from './instance.js';

export default (aeroflow, assert) => {
    factoryTests(aeroflow, assert);
    staticMethodsTests(aeroflow, assert);
    instanceTests(aeroflow, assert);
};
