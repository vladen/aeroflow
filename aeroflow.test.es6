'use strict';

const aeroflow = require('./aeroflow.es6'), assert = require('chai').assert;

describe('aeroflow', () => {
  it('is a function',
    () => assert.isFunction(aeroflow));
  it('returns an object',
    () => assert.isObject(aeroflow()));
  it('creates flow from scalar value',
    done => {
      let count = 0, value = 'test';
      aeroflow(value).run(
        next => {
          count++;
          assert.strictEqual(next, value);
        },
        () => {
          assert.strictEqual(count, 1);
          done();
        });
    });
  it('does not wrap flow twice',
    () => {
      let flow = aeroflow('test');
      assert.strictEqual(aeroflow(flow), flow);
    });
  it('creates flow from array',
    done => {
      let count = 0, values = ['a', 'b'];
      aeroflow(values).run(
        next => assert.strictEqual(next, values[count++]),
        () => {
          assert.strictEqual(count, values.length);
          done();
        });
    });
  it('creates flow from map',
    done => {
      let count = 0, values = [['a', 1], ['b', 2]];
      aeroflow(new Map(values)).run(
        next => assert.includeMembers(next, values[count++]),
        () => {
          assert.strictEqual(count, values.length);
          done();
        });
    });
  it('creates flow from set',
    done => {
      let count = 0, values = ['a', 'b'];
      aeroflow(new Set(values)).run(
        next => assert.strictEqual(next, values[count++]),
        () => {
          assert.strictEqual(count, values.length);
          done();
        });
    });
  it('creates flow from sync function',
    done => {
      let count = 0, value = 'test';
      aeroflow(() => value).run(
        next => {
          count++;
          assert.strictEqual(next, value);
        },
        () => {
          assert.strictEqual(count, 1);
          done();
        });
    });
  it('creates flow from promise',
    done => {
      let count = 0, value = 'test';
      aeroflow(Promise.resolve(value)).run(
        next => {
          count++;
          assert.strictEqual(next, value);
        },
        () => {
          assert.strictEqual(count, 1);
          done();
        });
    });
  it('creates flow from async function',
    done => {
      let count = 0, value = 'test';
      aeroflow(() => new Promise(resolve => setTimeout(() => resolve(value), 10))).run(
        next => {
          count++;
          assert.strictEqual(next, value);
        },
        () => {
          assert.strictEqual(count, 1);
          done();
        });
    });

  describe('empty', () => {
    it('is static object',
      () => assert.isObject(aeroflow.empty));
    it('returns empty flow',
      done => {
        let count = 0;
        aeroflow.empty.run(
          next => count++,
          () => {
            assert.strictEqual(count, 0);
            done();
          });
    });
  });

  describe('expand', () => {
    it('is static function',
      () => assert.isFunction(aeroflow.expand));
    it('creates flow with geometric progression',
      done => {
        let count = 0, values = [2, 4, 8];
        aeroflow.expand(value => value * 2, 1).take(values.length).run(
          next => assert.strictEqual(next, values[count++]),
          () => {
            assert.strictEqual(count, values.length);
            done();
          });
    });
  });

  describe('just', () => {
    it('is static function',
      () => assert.isFunction(aeroflow.just));
    it('creates flow with single value',
      done => {
        let count = 0, value = [2, 4, 8];
        aeroflow.just(value).run(
          next => {
            count++;
            assert.strictEqual(next, value);
          },
          () => {
            assert.strictEqual(count, 1);
            done();
          });
    });
  });

  describe('random', () => {
    it('is static function',
      () => assert.isFunction(aeroflow.random));
    it('creates flow with random integer values within a range',
      done => {
        let count = 0, max = 10, min = 1;
        aeroflow.random(min, max).take(100).run(
          next => assert.isTrue(Number.isInteger(next) && next >= min && next < max),
          done);
    });
    it('creates flow with random decimal values within a range',
      done => {
        let count = 0, max = 10.1, min = 1.1;
        aeroflow.random(min, max).take(100).run(
          next => assert.isTrue(!Number.isInteger(next) && next >= min && next < max),
          done);
    });
  });

  describe('range', () => {
    it('is static function',
      () => assert.isFunction(aeroflow.range));
    it('creates flow with ascending sequential values within a range',
      done => {
        let count = 0, start = 1, end = 9;
        aeroflow.range(start, end).run(
          next => assert.isTrue(next >= start && next <= end),
          done);
    });
    it('creates flow with ascending sequential values within a stepped range',
      done => {
        let count = 0, start = 1, end = 9, step = 2;
        aeroflow.range(start, end, step).run(
          next => assert.isTrue(next >= start && next <= end && next % step === 1),
          done);
    });
    it('creates flow with descending sequential values within a range',
      done => {
        let count = 0, start = 9, end = 1;
        aeroflow.range(start, end).run(
          next => assert.isTrue(next <= start && next >= end),
          done);
    });
    it('creates flow with descending sequential values within a stepped range',
      done => {
        let count = 0, start = 9, end = 1, step = 2;
        aeroflow.range(start, end, step).run(
          next => assert.isTrue(next <= start && next >= end && next % step === 1),
          done);
    });
    it('throws if start argument is not a number',
      () => assert.throws(() => aeroflow.range({})));
    it('throws if end argument is not a number',
      () => assert.throws(() => aeroflow.range(1, {})));
    it('throws if step argument is not a number',
      () => assert.throws(() => aeroflow.range(1, 2, {})));
    it('throws if step argument is not a positive number',
      () => assert.throws(() => aeroflow.range(1, 2, -1)));
  });

  describe('repeat', () => {
    it('is static function',
      () => assert.isFunction(aeroflow.repeat));
    it('creates flow with ascending sequential values starting from 0',
      done => {
        let count = 0;
        aeroflow.repeat().take(100).run(
          next => assert.strictEqual(next, count++),
          done);
    });
    it('creates flow from values returned by repeater function until repeater returns false',
      done => {
        let count = 0, limit = 5;
        aeroflow.repeat(() => count < limit ? count : false).run(
          next => assert.strictEqual(next, count++),
          () => {
            assert .strictEqual(count, limit);
            done();
          });
    });
    it('throws if repeater is not a function',
      () => assert.throws(() => aeroflow.repeat(1)));
  });
});