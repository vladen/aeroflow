const aeroflow = require('./aeroflow.es6').default, assert = require('chai').assert;

describe('aeroflow', () => {
  it('is a function',
    () => assert.isFunction(aeroflow));
  it('returns an object',
    () => assert.isObject(aeroflow()));
  
});