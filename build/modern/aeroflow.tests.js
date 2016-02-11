(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTests = factory());
}(this, function () { 'use strict';

  var averageOperatorTests = (aeroflow, assert) => describe('Aeroflow#average', () => {
    it('is instance method', () => {
      assert.isFunction(aeroflow.empty.average);
    });

    describe('()', () => {
      it('returns instance of Aeroflow', () => {
        assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
      });

      it('emits nothing from empty flow', () => {
        return assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.average().run(fail, done)));
      });

      it('emits @value from flow emitting single numeric @value', () => {
        const value = 42, expectation = value;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(expectation).average().run(done, fail)),
          expectation);
      });

      it('emits NaN from flow emitting single non-numeric @value', () => {
        const value = 'test';
        return assert.eventually.isNaN(new Promise((done, fail) =>
          aeroflow(value).average().run(done, fail)));
      });

      it('emits average from @values from flow emitting several numeric @values', () => {
        const values = [1, 3, 2], expectation = values.reduce((sum, value) => sum + value, 0) / values.length;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).average().run(done, fail)),
          expectation);
      });

      it('emits NaN from @values from flow emitting several non-numeric @values', () => {
        const values = ['a', 'b'];
        return assert.eventually.isNaN(new Promise((done, fail) => 
          aeroflow(values).average().run(done, fail)));
      });
    });

  });

  var countOperatorTests = (aeroflow, assert) => describe('Aeroflow#count', () => {
    it('is instance method', () => {
      assert.isFunction(aeroflow.empty.count);
    });

    describe('()', () => {
      it('returns instance of Aeroflow', () => {
        assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
      });

      it('emits 0 from empty flow', () => {
        const expectation = 0;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow.empty.count().run(done, fail)),
          expectation);
      });

      it('emits 1 from flow emitting single value', () => {
        const expectation = 1;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(expectation).count().run(done, fail)),
          expectation);
      });

      it('emits number of @values from flow emitting several @values', () => {
        const values = [1, 2, 3], expectation = values.length;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).count().run(done, fail)),
          expectation);
      });
    });

  });

  var maxOperatorTests = (aeroflow, assert) => describe('Aeroflow#max', () => {
    it('is instance method', () => {
      assert.isFunction(aeroflow.empty.max);
    });

    describe('()', () => {
      it('returns instance of Aeroflow', () => {
        assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
      });

      it('emits nothing from empty flow', () => {
        return assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.max().run(fail, done)));
      });

      it('emits @value from flow emitting single numeric @value', () => {
        const value = 42, expectation = value;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).max().run(done, fail)),
          expectation);
      });

      it('emits @value from flow emitting single non-numeric @value', () => {
        const value = 'test', expectation = value;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).max().run(done, fail)),
          expectation);
      });

      it('emits maximum of @values from flow emitting several numeric @values', () => {
        const values = [1, 3, 2], expectation = Math.max(...values);
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).max().run(done, fail)),
          expectation);
      });

      it('emits maximum of @values from flow emitting several non-numeric @values', () => {
        const values = ['a', 'c', 'b'], expectation = values.reduce((max, value) => value > max ? value : max);
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).max().run(done, fail)),
          expectation);
      });
    });

  });

  var minOperatorTests = (aeroflow, assert) => describe('Aeroflow#min', () => {
    it('is instance method', () => {
      assert.isFunction(aeroflow.empty.min);
    });

    describe('()', () => {
      it('returns instance of Aeroflow', () => {
        assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
      });

      it('emits nothing from empty flow', () => {
        return assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.min().run(fail, done)));
      });

      it('emits @value from flow emitting single @value', () => {
        const value = 42, expectation = value;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).min().run(done, fail)),
          expectation);
      });

      it('emits @value from flow emitting single non-numeric @value', () => {
        const value = 'test', expectation = value;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).min().run(done, fail)),
          expectation);
      });

      it('emits minimum of @values from flow emitting several numeric @values', () => {
        const values = [1, 3, 2], expectation = Math.min(...values);
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).min().run(done, fail)),
          expectation);
      });

      it('emits minimum of @values from flow emitting several non-numeric @values', () => {
        const values = ['a', 'c', 'b'], expectation = values.reduce((min, value) => value < min ? value : min);
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).min().run(done, fail)),
          expectation);
      });
    });

  });

  var reduceOperatorTests = (aeroflow, assert) => describe('Aeroflow#reduce', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.reduce));

    describe('()', () => {
      it('returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow'));

      it('emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.reduce().run(fail, done))));

      it('emits nothing when flow is not empty', () =>
        assert.isFulfilled(new Promise((done, fail) => 
          aeroflow('test').reduce().run(fail, done))));
    });

    describe('(@reducer:function)', () => {
      it('does not call @reducer when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.reduce(fail).run(fail, done))));

      it('does not call @reducer when flow emits single value', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(1).reduce(fail).run(done, fail))));

      it('calls @reducer when flow emits serveral values', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(1, 2).reduce(done).run(fail, fail))));

      it('emits error thrown by @reducer', () => {
        const error = new Error('test');
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2).reduce(() => { throw error; }).run(fail, done)),
          error);
      });

      it('emits value emitted by flow when flow emits single value', () => {
        const value = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).reduce(() => 'test').run(done, fail)),
          value);
      });

      it('emits value returned by @reducer when flow emits several values', () => {
        const value = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2, 3).reduce(() => value).run(done, fail)),
          value);
      });

      it('passes first and second values emitted by flow to @reducer as first and second arguments on first iteration', () => {
        const values = [1, 2];
        return assert.eventually.includeMembers(new Promise((done, fail) =>
          aeroflow(values).reduce((...args) => done(args)).run(fail, fail)),
          values);
      });

      it('passes zero-based index of iteration to @reducer as third argument', () => {
        const values = [1, 2, 3, 4];
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).reduce((_, __, index) => index).run(done, fail)),
          values.length - 2);
      });

      it('passes context data to @function as forth argument', () => {
        const data = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2).reduce((_, __, ___, data) => done(data)).run(fail, fail, data)),
          data);
      });
    });

    describe('(@reducer:function, @seed:any)', () => {
      it('emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.reduce(() => {}, 42).run(fail, done))));

      it('passes @seed to @reducer as first argument on first iteration', () => {
        const seed = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow('test').reduce(done, seed).run(fail, fail)),
          seed);
      });
    });

    describe('(@reducer:function, @seed:any, true)', () => {
      it('emits @seed when flow is empty', () => {
        const seed = 'test';
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow.empty.reduce(() => {}, seed, true).run(done, fail)),
          seed);
      });
    });

    describe('(@seed:!function)', () => {
      it('emits @seed when flow is empty', () => {
        const seed = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow.empty.reduce(seed).run(done, fail)),
          seed);
      });

      it('emits @seed when flow is not empty', () => {
        const seed = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(1, 2).reduce(seed).run(done, fail)),
          seed);
      });
    });

  });

  var toArrayOperatorTests = (aeroflow, assert) => describe('Aeroflow#toArray', () => {
    it('is instance method', () => {
      assert.isFunction(aeroflow.empty.toArray);
    });

    describe('()', () => {
      it('returns instance of Aeroflow', () => {
        assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow');
      });

      it('emits nothing when flow is empty', () => {
        return assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.toArray().run(fail, done)));
      });

      it('emits array of @values when flow emits several @values', () => {
        const values = [1, 2, 1, 3, 2, 3], expectation = values;
        return assert.eventually.includeMembers(new Promise((done, fail) => 
          aeroflow(values).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('(true)', () => {
      it('emits an array when flow is empty', () => {
        const expectation = 'Array';
        return assert.eventually.typeOf(new Promise((done, fail) =>
          aeroflow.empty.toArray(true).run(done, fail)),
          expectation);
      });
      it('emits empty array from flow is empty', () => {
        const expectation = 0;
        return assert.eventually.lengthOf(new Promise((done, fail) =>
          aeroflow.empty.toArray(true).run(done, fail)),
          expectation);
      });
    });
  });

  var toSetOperatorTests = (aeroflow, assert) => describe('Aeroflow#toSet', () => {
    it('is instance method', () => {
      assert.isFunction(aeroflow.empty.toSet);
    });

    describe('()', () => {
      it('returns instance of Aeroflow', () => {
        assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow');
      });

      it('emits nothing when flow is empty', () => {
        return assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.toSet().run(fail, done)));
      });

      it('emits set of unique @values when flow emits several @values', () => {
        const values = [1, 2, 1, 3, 2, 3], expectation = Array.from(new Set(values));
        return assert.eventually.includeMembers(new Promise((done, fail) => 
          aeroflow(values).toSet().map(set => Array.from(set)).run(done, fail)),
          expectation);
      });
    });

    describe('(true)', () => {
      it('emits a set when flow is empty', () => {
        const expectation = 'Set';
        return assert.eventually.typeOf(new Promise((done, fail) =>
          aeroflow.empty.toSet(true).run(done, fail)),
          expectation);
      });
      it('emits empty set when flow is empty', () => {
        const expectation = 0;
        return assert.eventually.propertyVal(new Promise((done, fail) =>
          aeroflow.empty.toSet(true).run(done, fail)),
          'size',
          expectation);
      });
    });
  });

  var toStringOperatorTests = (aeroflow, assert) => describe('Aeroflow#toString', () => {
    it('is instance method', () => {
      assert.isFunction(aeroflow.empty.toString);
    });

    describe('()', () => {
      it('returns instance of Aeroflow', () => {
        assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
      });

      it('emits nothing when flow is empty', () => {
        return assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.toString().run(fail, done)));
      });

      it('emits @string when flow emits single @string', () => {
        const string = 'test', expectation = string;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(string).toString().run(done, fail)),
          expectation);
      });

      it('emits @number converted to string when flow emits single @number', () => {
        const number = 42, expectation = '' + number;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(number).toString().run(done, fail)),
          expectation);
      });

      it('emits @strings concatenated via "," separator when flow emits several @strings', () => {
        const strings = ['a', 'b'], expectation = strings.join(',');
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(strings).toString().run(done, fail)),
          expectation);
      });

      it('emits @numbers converted to strings and concatenated via "," separator when flow emits several @numbers', () => {
        const numbers = [100, 500], expectation = numbers.join(',');
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(numbers).toString().run(done, fail)),
          expectation);
      });
    });

    describe('(true)', () => {
      it('emits string when flow empty', () => {
        const expectation = 'String';
        return assert.eventually.typeOf(new Promise((done, fail) =>
          aeroflow.empty.toString(true).run(done, fail)),
          expectation);
      });
      it('emits empty string when flow is empty', () => {
        const expectation = 0;
        return assert.eventually.lengthOf(new Promise((done, fail) =>
          aeroflow.empty.toString(true).run(done, fail)),
          expectation);
      });
    });

    describe('(@string)', () => {
      it('emits nothing when flow is empty', () => {
        return assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.toString(';').run(fail, done)));
      });

      it('emits @strings concatenated via @string separator when flow emits several @strings', () => {
        const separator = ';', strings = ['a', 'b'], expectation = strings.join(separator);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(strings).toString(separator).run(done, fail)),
          expectation);
      });
    });

    describe('(@string, true)', () => {
      it('emits empty string when flow is empty', () => {
        const delimiter = ';', expectation = 0;
        return assert.eventually.lengthOf(new Promise((done, fail) =>
          aeroflow.empty.toString(delimiter, true).run(done, fail)),
          expectation);
      });
    });
  });

  const tests = [
    // factoryTests,
    // staticMethodsTests,
    // instanceTests,
    averageOperatorTests,
    countOperatorTests,
    maxOperatorTests,
    minOperatorTests,
    reduceOperatorTests,
    toArrayOperatorTests,
    toSetOperatorTests,
    toStringOperatorTests
  ];

  var aeroflow = (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));

  return aeroflow;

}));