(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTests = factory());
}(this, function () { 'use strict';

  var emptyTests = (aeroflow, assert) => describe('empty', () => {
    it('Is static property', () =>
      assert.isDefined(aeroflow.empty));

    describe('empty', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty, 'Aeroflow'));

      it('Returns instance of Aeroflow emitting nothing ("done" event only)', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.run(fail, done))));
    });
  });

  const noop = () => {};

  var expandTests = (aeroflow, assert) => describe('expand', () => {
    it('Is static method', () =>
      assert.isFunction(aeroflow.expand));

    describe('expand()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.expand(), 'Aeroflow'));
    });

    describe('expand(@expander:function)', () => {
      it('Calls @expander', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.expand(done).take(1).run(fail, fail))));

      it('Passes undefined to @expander as first argument because no seed is specified', () =>
        assert.eventually.isUndefined(new Promise((done, fail) =>
          aeroflow.expand(done).take(1).run(fail, fail))));

      it('Passes value returned by @expander to @expander again as first argument on next iteration', () => {
        const expectation = {};
        let iteration = 0;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow
            .expand(value => iteration++
                ? done(value)
                : expectation)
            .take(2)
            .run(noop, fail)),
          expectation);
      });

      it('Passes zero-based index of iteration to @expander as second argument', () => {
        const indices = [], expectation = [0, 1, 2, 3];
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow
            .expand((_, index) => indices.push(index))
            .take(expectation.length)
            .run(noop, () => done(indices))),
          expectation);
      });

      it('Passes context data to @expander as third argument', () => {
        const expectation = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow.expand((_, __, data) => done(data)).take(1).run(fail, fail, expectation)),
          expectation);
      });

      it('Emits value returned by @expander', () => {
        const expectation = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow.expand(() => expectation).take(1).run(done, fail)),
          expectation);
      });
    });

    describe('expand(@expander:function, @seed:any)', () => {
      it('Passes @seed to @expander as first argument', () => {
        const seed = 42, expectation = seed;
        assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow.expand(done, seed).take(1).run(fail, fail)),
          expectation);
      });
    });
  });

  var justTests = (aeroflow, assert) => describe('just', () => {
    it('Is static method', () =>
      assert.isFunction(aeroflow.just));

    describe('just()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.just(), 'Aeroflow'));

      it('Returns instance of Aeroflow emitting single undefined value', () => {
        const expectation = undefined;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow.just().run(done, fail)),
          expectation);
      });
    });

    describe('just(@array)', () => {
      it('Returns instance of Aeroflow emitting @array as is', () => {
        const array = [1, 2, 3], expectation = array;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow.just(array).run(done, fail)),
          expectation);
      });
    });

    describe('just(@iterable)', () => {
      it('Returns instance of Aeroflow emitting @iterable as is', () => {
        const iterable = new Set([1, 2, 3]), expectation = iterable;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow.just(iterable).run(done, fail)),
          expectation);
      });
    });
  });

  const tests$1 = [
    emptyTests,
    expandTests,
    justTests
  ];

  var staticMethodsTests = (aeroflow, assert) => describe('static members', () =>
    tests$1.forEach(test => test(aeroflow, assert)));

  var averageTests = (aeroflow, assert) => describe('average', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.average));

    describe('average()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.average(), 'Aeroflow'));

      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.average().run(fail, done))));

      it('Emits @value when flow emits single numeric @value', () => {
        const value = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).average().run(done, fail)),
          value);
      });

      it('Emits NaN when flow emits single not numeric @value', () =>
        assert.eventually.isNaN(new Promise((done, fail) =>
          aeroflow('test').average().run(done, fail))));

      it('Emits average of @values when flow emits several numeric @values', () => {
        const values = [1, 3, 2],
          expectation = values.reduce((sum, value) => sum + value, 0) / values.length;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).average().run(done, fail)),
          expectation);
      });

      it('Emits NaN when flow emits several not numeric @values', () =>
        assert.eventually.isNaN(new Promise((done, fail) => 
          aeroflow('a', 'b').average().run(done, fail))));
    });
  });

  var catchTests = (aeroflow, assert) => describe('catch', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.catch));

    describe('catch()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.catch(), 'Aeroflow'));

      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.catch().run(fail, done))));

      it('Supresses error emitted by flow', () =>
        assert.eventually.isBoolean(new Promise((done, fail) => 
          aeroflow(new Error('test')).catch().run(fail, done))));
    });

    describe('catch(@alternative:function)', () => {
      it('Does not call @alternative when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.catch(fail).run(fail, done))));

      it('Does not call @alternative when flow does not emit error', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(1).catch(fail).run(done, fail))));

      it('Calls @alternative when flow emits error', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(new Error('tests')).catch(done).run(fail, fail))));

      it('Emits value returned by @alternative when flow emits error', () => {
        const alternative = 'caught';
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(new Error('test')).catch(() => alternative).run(done, fail)),
          alternative);
      });
    });

    describe('catch(@alternative:!function)', () => {
      it('Emits @alternative value instead of error emitted by flow', () => {
        const alternative = 'caught';
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(new Error('test')).catch(alternative).run(done, fail)),
          alternative);
      });
    });
  });

  var countTests = (aeroflow, assert) => describe('count', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.count));

    describe('count()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.count(), 'Aeroflow'));

      it('Emits 0 when flow is empty', () =>
        assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow.empty.count().run(done, fail)),
          0));

      it('Emits 1 when flow emits single @value', () => {
        const expectation = 1;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(expectation).count().run(done, fail)),
          expectation);
      });

      it('Emits number of @values emitted by flow when flow emits several @values', () => {
        const values = [1, 2, 3], expectation = values.length;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).count().run(done, fail)),
          expectation);
      });
    });
  });

  var filterTests = (aeroflow, assert) => describe('filter', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.filter));

    describe('filter()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.filter(), 'Aeroflow'));

      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.filter().run(fail, done))));

      it('Emits only truthy of @values emitted by flow', () => {
        const values = [false, true, 0, 1, undefined, null, 'test'],
          expectation = values.filter(value => value);
        assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).filter().toArray().run(done, fail)),
          expectation);
      });
    });

    describe('filter(@condition:function)', () => {
      it('Does not call @condition when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.filter(fail).run(fail, done))));

      it('Calls @condition when flow is not empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow('test').filter(done).run(fail, fail))));

      it('Passes @value emitted by flow to @condition as first argument', () => {
        const value = 'test';
        assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).filter(done).run(fail, fail)),
          value);
      });

      it('Passes zero-based @index of iteration to @condition as second argument', () => {
        const values = [1, 2, 3, 4], expectation = values.length - 1;
        return assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(values).filter((_, index) => {
            if (index === expectation) done();
          }).run(fail, fail)));
      });

      it('Passes context @data to @condition as third argument', () => {
        const data = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow('test').filter((_, __, data) => done(data)).run(fail, fail, data)),
          data);
      });

      it('Emits only @values emitted by flow and passing @condition test', () => {
        const values = [0, 1, 2, 3], condition = value => value > 1,
          expectation = values.filter(condition);
        assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).filter(condition).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('filter(@condition:regex)', () => {
      it('Emits only @values emitted by flow and passing @condition test', () => {
        const values = ['a', 'b', 'aa', 'bb'], condition = /a/,
          expectation = values.filter(value => condition.test(value));
        assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).filter(condition).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('filter(@condition:!function!regex)', () => {
      it('Emits only @values emitted by flow and equal to @condition', () => {
        const values = [1, 2, 3], condition = 2,
          expectation = values.filter(value => value === condition);
        assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).filter(condition).toArray().run(done, fail)),
          expectation);
      });
    });
  });

  var maxTests = (aeroflow, assert) => describe('max', () => {
    it('Is instance method', () => {
      assert.isFunction(aeroflow.empty.max);
    });

    describe('max()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.max(), 'Aeroflow'));

      it('Emits nothing ("done" event only) when flow is empty', () => 
         assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.max().run(fail, done))));

      it('Emits @value when flow emits single numeric @value', () => {
        const value = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).max().run(done, fail)),
          value);
      });

      it('Emits @value when flow emits single string @value', () => {
        const value = 'test';
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).max().run(done, fail)),
          value);
      });

      it('Emits maximum of @values when flow emits several numeric @values', () => {
        const values = [1, 3, 2], expectation = Math.max(...values);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).max().run(done, fail)),
          expectation);
      });

      it('Emits maximum of @values when flow emits several string @values', () => {
        const values = ['a', 'c', 'b'],
          expectation = values.reduce((max, value) => value > max ? value : max);
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).max().run(done, fail)),
          expectation);
      });
    });
  });

  var minTests = (aeroflow, assert) => describe('min', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.min));

    describe('min()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.min(), 'Aeroflow'));

      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.min().run(fail, done))));

      it('Emits @value when flow emits single numeric @value', () => {
        const value = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).min().run(done, fail)),
          value);
      });

      it('Emits @value when flow emits single string @value', () => {
        const value = 'test';
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).min().run(done, fail)),
          value);
      });

      it('Emits minimum of @values when flow emits several numeric @values', () => {
        const values = [1, 3, 2], expectation = Math.min(...values);
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).min().run(done, fail)),
          expectation);
      });

      it('Emits minimum of @values when flow emits several string @values', () => {
        const values = ['a', 'c', 'b'], expectation = values.reduce((min, value) => value < min ? value : min);
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).min().run(done, fail)),
          expectation);
      });
    });
  });

  var reduceTests = (aeroflow, assert) => describe('reduce', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.reduce));

    describe('reduce()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow'));

      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.reduce().run(fail, done))));

      it('Emits nothing ("done" event only) when flow is not empty', () =>
        assert.isFulfilled(new Promise((done, fail) => 
          aeroflow('test').reduce().run(fail, done))));
    });

    describe('reduce(@reducer:function)', () => {
      it('Does not call @reducer when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.reduce(fail).run(fail, done))));

      it('Does not call @reducer when flow emits single @value', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(1).reduce(fail).run(done, fail))));

      it('Calls @reducer when flow emits several v@alues', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(1, 2).reduce(done).run(fail, fail))));

      it('Emits error thrown by @reducer', () => {
        const error = new Error('test');
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2).reduce(() => { throw error; }).run(fail, done)),
          error);
      });

      it('Emits @value emitted by flow when flow emits single @value', () => {
        const value = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).reduce(() => 'test').run(done, fail)),
          value);
      });

      it('Emits @value returned by @reducer when flow emits several @values', () => {
        const value = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2, 3).reduce(() => value).run(done, fail)),
          value);
      });

      it('Passes first and second @values emitted by flow to @reducer as first and second arguments on first iteration', () => {
        const values = [1, 2];
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).reduce((first, second) => done([first, second])).run(fail, fail)),
          values);
      });

      it('Passes zero-based @index of iteration to @reducer as third argument', () => {
        const expectation = 0;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2).reduce((_, __, index) => done(index)).run(fail, fail)),
          expectation);
      });

      it('Passes context @data to @reducer as forth argument', () => {
        const expectation = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2).reduce((_, __, ___, data) => done(data)).run(fail, fail, expectation)),
          expectation);
      });
    });

    describe('reduce(@reducer:function, @seed)', () => {
      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.reduce(() => {}, 42).run(fail, done))));

      it('Passes @seed to @reducer as first argument on first iteration', () => {
        const seed = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow('test').reduce(done, seed).run(fail, fail)),
          seed);
      });
    });

    describe('reduce(@reducer:function, @seed, true)', () => {
      it('Emits @seed value when flow is empty', () => {
        const seed = 'test';
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow.empty.reduce(() => {}, seed, true).run(done, fail)),
          seed);
      });
    });

    describe('reduce(@seed:!function)', () => {
      it('Emits @seed value when flow is empty', () => {
        const seed = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow.empty.reduce(seed).run(done, fail)),
          seed);
      });

      it('Emits @seed value when flow is not empty', () => {
        const seed = 42;
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(1, 2).reduce(seed).run(done, fail)),
          seed);
      });
    });
  });

  var toStringTests = (aeroflow, assert) => describe('toString', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.toString));

    describe('toString()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.toString(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) => 
          aeroflow.empty.toString().run(fail, done))));

      it('Emits @string when flow emits single @string', () => {
        const string = 'test';
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(string).toString().run(done, fail)),
          string);
      });

      it('Emits @number converted to string when flow emits single @number', () => {
        const number = 42, expectation = '' + number;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(number).toString().run(done, fail)),
          expectation);
      });

      it('Emits @strings concatenated via "," separator when flow emits several @strings', () => {
        const strings = ['a', 'b'], expectation = strings.join(',');
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(strings).toString().run(done, fail)),
          expectation);
      });

      it('Emits @numbers converted to strings and concatenated via "," separator when flow emits several @numbers', () => {
        const numbers = [100, 500], expectation = numbers.join(',');
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(numbers).toString().run(done, fail)),
          expectation);
      });
    });

    describe('toString(true)', () => {
      it('Emits string when flow empty', () =>
        assert.eventually.typeOf(new Promise((done, fail) =>
          aeroflow.empty.toString(true).run(done, fail)),
          'String'));

      it('Emits empty string when flow is empty', () =>
        assert.eventually.lengthOf(new Promise((done, fail) =>
          aeroflow.empty.toString(true).run(done, fail)),
          0));
    });

    describe('toString(@string)', () => {
      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.toString(';').run(fail, done))));

      it('Emits @strings concatenated via @string separator when flow emits several @strings', () => {
        const separator = ';', strings = ['a', 'b'], expectation = strings.join(separator);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(strings).toString(separator).run(done, fail)),
          expectation);
      });
    });

    describe('toString(@string, true)', () => {
      it('Emits empty string when flow is empty', () =>
        assert.eventually.lengthOf(new Promise((done, fail) =>
          aeroflow.empty.toString(';', true).run(done, fail)),
          0));
    });
  });

  var everyTests = (aeroflow, assert) => describe('every', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.every));

    describe('every()', () => {
      it('Returns instance of Aeroflow', () => 
        assert.typeOf(aeroflow.empty.every(), 'Aeroflow'));

      it('Emits "true" when flow is empty', () =>
        assert.eventually.isTrue(new Promise((done, fail) =>
          aeroflow.empty.every().run(done, fail))));

      it('Emits "true" when all @values emitted by flow are truthy', () =>
        assert.eventually.isTrue(new Promise((done, fail) =>
          aeroflow(true, 1).every().run(done, fail))));

      it('Emits "false" when at least one @value emitted by flow is falsey', () =>
        assert.eventually.isFalse(new Promise((done, fail) =>
          aeroflow(true, 0).every().run(done, fail))));

      it('Emits single result when flow emits several @values', () => {
        const expectation = 1;
        assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2, 3).every().count().run(done, fail)),
          expectation);
      });
    });

    describe('every(@condition:function)', () => {
      it('Emits "true" when all @values emitted by flow pass @condition test', () => {
        const values = [2, 4], condition = item => item % 2 === 0,
          expectation = values.every(condition);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).every(condition).run(done, fail)),
          expectation);
      });

      it('Emits "false" when at least one @value emitted by flow does not pass @condition test', () => {
        const values = [1, 4], condition = item => item % 2 === 0,
          expectation = values.every(condition);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).every(condition).run(done, fail)),
          expectation);
      });
    });

    describe('every(@condition:regex)', () => {
      it('Emits "true" when all @values emitted by flow pass @condition test', () => {
        const values = ['a', 'aa'], condition = /a/,
          expectation = values.every(value => condition.test(value));
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).every(condition).run(done, fail)),
          expectation);
      });

      it('Emits "false" when at least one @value emitted by flow does not pass @condition test', () => {
        const values = ['a', 'bb'], condition = /a/,
          expectation = values.every(value => condition.test(value));
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).every(condition).run(done, fail)),
          expectation);
      });
    });

    describe('every(@condition:!function!regex)', () => {
      it('Emits "true" when all @values emitted by flow equal @condition', () => {
        const values = [1, 1], condition = 1,
          expectation = values.every(value => value === condition);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).every(condition).run(done, fail)),
          expectation);
      });

      it('Emits "false" when at least one @value emitted by flow does not equal @condition', () => {
        const values = [1, 2], condition = 2,
          expectation = values.every(value => value === condition);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).every(condition).run(done, fail)),
          expectation);
      });
    });
  });

  var someTests = (aeroflow, assert) => describe('some', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.some));

    describe('some()', () => {
      it('Returns instance of Aeroflow', () => 
        assert.typeOf(aeroflow.empty.some(), 'Aeroflow'));

      it('Emits "false" when flow is empty', () =>
        assert.eventually.isFalse(new Promise((done, fail) =>
          aeroflow.empty.some().run(done, fail))));

      it('Emits "true" when at least one @value emitted by flow is truthy', () =>
        assert.eventually.isTrue(new Promise((done, fail) =>
          aeroflow(true, 0).some().run(done, fail))));

      it('Emits "false" when all @value emitted by flow are falsey', () =>
        assert.eventually.isFalse(new Promise((done, fail) =>
          aeroflow(false, 0).some().run(done, fail))));

      it('Emits single result when flow emits several values', () => {
        const expectation = 1;
        assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2, 3).some().count().run(done, fail)),
          expectation);
      });
    });

    describe('every(@condition:function)', () => {
      it('Emits "true" when at least one @value emitted by flow passes @condition test', () => {
        const values = [2, 1], condition = (item) => item % 2 === 0,
          expectation = values.some(condition);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).some(condition).run(done, fail)),
          expectation);
      });

      it('Emits "false" when no @values emitted by flow pass @condition test', () => {
        const values = [3, 1], condition = (item) => item % 2 === 0,
          expectation = values.some(condition);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).some(condition).run(done, fail)),
          expectation);
      });
    });

    describe('some(@condition:regex)', () => {
      it('Emits "true" when at least one @value emitted by flow passes @condition test', () => {
        const values = ['a', 'b'], condition = /a/,
          expectation = values.some(value => condition.test(value));
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).some(condition).run(done, fail)),
          expectation);
      });

      it('Emits "false" when no @values emitted by flow pass @condition test', () => {
        const values = ['a', 'b'], condition = /c/,
          expectation = values.some(value => condition.test(value));
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).some(condition).run(done, fail)),
          expectation);
      });
    });

    describe('some(@condition:!function!regex)', () => {
      it('Emits "true" when at least one @value emitted by flow equals @condition', () => {
        const values = [1, 2], condition = 1,
          expectation = values.some(value => value === condition);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).some(condition).run(done, fail)),
          expectation);
      });

      it('Emits "false" when no @values emitted by flow equal @condition', () => {
        const values = [1, 2], condition = 3,
          expectation = values.some(value => value === condition);
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).some(condition).run(done, fail)),
          expectation);
      });
    });
  });

  var distinctTests = (aeroflow, assert) => describe('distinct', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.distinct));

    describe('distinct()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.distinct(), 'Aeroflow'));

      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.distinct().run(fail, done))));

      it('Emits unique of @values when flow emits several numeric @values', () => {
        const values = [1, 1, 2, 2, 3], expectation = Array.from(new Set(values));
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).distinct().toArray().run(done, fail)),
          expectation);
      });

      it('Emits unique of @values when flow emits several string @values', () => {
        const values = ['a', 'a', 'b', 'b', 'c'], expectation = Array.from(new Set(values));
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).distinct().toArray().run(done, fail)),
          expectation);
      });
    });

    describe('distinct(true)', () => {
      it('Emits first @value of each sub-sequence of identical @values (distinct until changed)', () => {
        const values = [1, 1, 2, 2, 1, 1], expectation = [1, 2, 1];
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).distinct(true).toArray().run(done, fail)),
          expectation);
      });
    });
  });

  var takeTests = (aeroflow, assert) => describe('take', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.take));

    describe('take()', () => {
      it('Returns instance of Aeroflow', () => 
        assert.typeOf(aeroflow.empty.take(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.take().run(fail, done))));

      it('Emits nothing when flow is not empty', () =>
        assert.isFulfilled(new Promise((done, fail) => 
          aeroflow('test').take().run(fail, done))));
    });

    describe('take(@condition:function)', () => {
      it('Emits @values while they satisfies @condition ', () => {
        const values = [2, 4, 6, 3, 4], condition = (value) => value %2 === 0, expectation = [2, 4, 6];
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).take(condition).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('take(@condition:number)', () => {
      it('Emits @condition number of @values from the start', () => {
        const values = [1, 2, 3], take = 2, expectation = values.slice(0, take);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).take(take).toArray().run(done, fail)),
          expectation);
      });

      it('Emits @condition number of @values from the end', () => {
        const values = [1, 2, 3], take = -2, expectation = values.slice(take);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).take(take).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('take(@condition:!function!number)', () => {
      it('Emits all @values when @condition is non-numeric', () => {
        const values = ['a', 'b', 'c'], take = 'a';
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).take(take).toArray().run(done, fail)),
          values);
      });
    });
  });

  var skipTests = (aeroflow, assert) => describe('skip', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.skip));

    describe('skip()', () => {
      it('Returns instance of Aeroflow', () => 
        assert.typeOf(aeroflow.empty.skip(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.skip().run(fail, done))));

      it('Emits nothing when flow is not empty', () =>
        assert.isFulfilled(new Promise((done, fail) => 
          aeroflow('test').skip().run(fail, done))));
    });

    describe('skip(@condition:function)', () => {
      it('Emits @values until they not satisfies @condition ', () => {
        const values = [2, 4, 6, 3, 7], condition = (value) => value %2 === 0, expectation = [3, 7];
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).skip(condition).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('skip(@condition:number)', () => {
      it('Emits @values beginning with @condition position from the start', () => {
        const values = [1, 2, 3], skip = 2, expectation = values.slice(skip);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).skip(skip).toArray().run(done, fail)),
          expectation);
      });

      it('Emits @values without @condition number of @values from the end', () => {
        const values = [1, 2, 3], skip = 2, expectation = values.slice(0, values.length - skip);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).skip(-skip).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('skip(@condition:!function!number)', () => {
      it('Emits nothing when @condition is non-numeric', () => 
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow('test').skip('test').run(fail, done))));
    });
  });

  var sortTests = (aeroflow, assert) => describe('sort', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.sort));

    describe('sort()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.sort(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.sort().run(fail, done))));

      it('Emits @values in ascending order when flow is not empty', () => {
        const values = [6, 5, 3, 8], expectation = values.sort();
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).sort().toArray().run(done, fail)),
          expectation);
      });
    });

    describe('sort(@comparer:string)', () => {
      it('Emits @values in descending order when @comparer equal to desc', () => {
        const values = ['a', 'c', 'f'], sort = 'desc', expectation = values.sort().reverse();
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).sort(sort).toArray().run(done, fail)),
          expectation);
      });

      it('Emits @values in descending order when @comparer not equal to desc', () => {
        const values = ['a', 'c', 'f'], sort = 'asc', expectation = values.sort();
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).sort(sort).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('sort(@comparer:boolean)', () => {
      it('Emits @values in descending order when false passed', () => {
        const values = [2, 7, 4], sort = false, expectation = values.sort().reverse();
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).sort(sort).toArray().run(done, fail)),
          expectation);
      });

      it('Emits @values in descending order when true passed', () => {
        const values = [4, 8, 1], sort = true, expectation = values.sort();
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).sort(sort).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('sort(@comparer:number)', () => {
      it('Emits @values in descending order when @comparer less than 0', () => {
        const values = [2, 7, 4], sort = -1, expectation = values.sort().reverse();
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).sort(sort).toArray().run(done, fail)),
          expectation);
      });

      it('Emits @values in descending order when @comparer greatest or equal to 0', () => {
        const values = [4, 8, 1], sort = 1, expectation = values.sort();
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).sort(sort).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('sort(@comparer:function)', () => {
      it('Emits @values sorted according by result of @comparer', () => {
        const values = [4, 8, 1], comparer = (a, b) => a - b, expectation = values.sort();
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).sort(comparer).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('sort(@comparers:array)', () => {
      it('Emits @values sorted by applying @comparers in order', () => {
        const values = [{ prop: 'test1'}, { prop: 'test2'}], comparers = [(value) => value.prop, 'desc'],
          expectation = values.sort((value) => value.prop).reverse();
        return assert.eventually.sameDeepMembers(new Promise((done, fail) => 
          aeroflow(values).sort(comparers).toArray().run(done, fail)),
          expectation);
      });
    });
  });

  var sliceTests = (aeroflow, assert) => describe('slice', () => {
    it('Is instance method', () => {
      assert.isFunction(aeroflow.empty.slice);
    });

    describe('slice()', () => {
      it('Returns instance of Aeroflow', () => {
        assert.typeOf(aeroflow.empty.slice(), 'Aeroflow');
      });

      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.slice().run(fail, done))));

      it('Emits @values when flow emits several @values', () => {
        const values = [1, 2];
        assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).slice().toArray().run(done, fail)),
          values);
      });
    });

    describe('slice(@start:number)', () => {
      it('Emits @start number of @values from the start', () => {
        const values = [1, 2, 3], slice = 2, expectation = values.slice(slice);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).slice(slice).toArray().run(done, fail)),
          expectation);
      });

      it('Emits @start number of @values from the end', () => {
        const values = [1, 2, 3], slice = -2, expectation = values.slice(slice);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).slice(slice).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('slice(@start:!number)', () => {
      it('Emits @values when passed non-numerical @start', () => {
        const values = [1, 2];
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).slice('test').toArray().run(done, fail)),
          values);
      });
    });

    describe('slice(@start:number, @end:number)', () => {
      it('Emits @values within @start and @end indexes from the start', () => {
        const values = [1, 2, 3], slice = [1, 2], expectation = values.slice(...slice);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).slice(...slice).toArray().run(done, fail)),
          expectation);
      });

      it('Emits @values within @start and @end indexes from the end', () => {
        const values = [1, 2, 3], slice = [-2, -1], expectation = values.slice(...slice);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).slice(...slice).toArray().run(done, fail)),
          expectation);
      });
    });

    describe('slice(@start:number, @end:!number)', () => {
      it('Emits @values from @start index till the end', () => {
        const values = [1, 2], start = 1, expectation = values.slice(start);
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).slice(start, 'test').toArray().run(done, fail)),
          expectation);
      });
    });
  });

  var sumTests = (aeroflow, assert) => describe('sum', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.sum));

    describe('sum()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.sum(), 'Aeroflow'));

      it('Emits nothing ("done" event only) when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.sum().run(fail, done))));

      it('Emits total sum of values when flow emits several numeric values', () => {
        const values = [1, 3, 2], expectation = values.reduce((prev, curr) => prev + curr, 0);
        return assert.eventually.strictEqual(new Promise((done, fail) => 
          aeroflow(values).sum().run(done, fail)),
          expectation);
      });

      it('Emits NaN when flow emits single not numeric value', () =>
        assert.eventually.isNaN(new Promise((done, fail) => 
          aeroflow('q').sum().run(done, fail))));

      it('Emits NaN when flow emits several not numeric values', () =>
        assert.eventually.isNaN(new Promise((done, fail) => 
          aeroflow('q', 'b').sum().run(done, fail))));
    });
  });

  var mapTests = (aeroflow, assert) => describe('map', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.map));

    describe('map()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.map(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.map().run(fail, done))));

      it('Emits same @values when no arguments passed', () => {
        const values = [1, 2];
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).map().toArray().run(done, fail)),
          values);
      });
    });

    describe('map(@mapping:function)', () => {
      it('Does not call @mapping when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.map(fail).run(fail, done))));

      it('Calls @mapping when flow emits several values', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(1, 2).map(done).run(fail, fail))));

      it('Emits error thrown by @mapping', () => {
        const error = new Error('test');
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2).map(() => { throw error; }).run(fail, done)),
          error);
      });

      it('Emits @values processed through @mapping', () => {
        const values = [1, 2, 3], mapping = (item) => item * 2, expectation = values.map(mapping);
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).map(mapping).toArray().run(done, fail)),
          expectation);
      });

      it('Passes context data to @mapping as third argument', () => {
        const data = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow('test').map((_, __, data) => done(data)).run(fail, fail, data)),
          data);
      });
    });

    describe('map(@mapping:!function)', () => {
      it('Emits @mapping value instead of every value in @values', () => {
        const values = [1, 2], mapping = 'a', expectation = [mapping, mapping];
        return assert.eventually.sameMembers(new Promise((done, fail) => 
          aeroflow(values).map(mapping).toArray().run(done, fail)),
          expectation);
      });
    });
  });

  var meanTests = (aeroflow, assert) => describe('mean', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.mean));

    describe('mean()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.mean(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.mean().run(fail, done))));

      it('Emits @value from flow emitting single numeric @value', () => {
        const value = 42, expectation = value;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).mean().run(done, fail)),
          expectation);
      });

      it('Emits mean value of @values from flow emitting several numeric @values', () => {
        const values = [1, 3, 4, 5], expectation = 4;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).mean().run(done, fail)),
          expectation);
      });

      it('Emits @value from flow emitting single non-numeric @value', () => {
        const value = 'a', expectation = value;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).mean().run(done, fail)),
          expectation);
      });

      it('Emits mean value of @values from flow emitting several numeric @values', () => {
        const values = ['a', 'd', 'f', 'm'], expectation = 'f';
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(values).mean().run(done, fail)),
          expectation);
      });
    });
  });

  var tapTests = (aeroflow, assert) => describe('tap', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.tap));

    describe('tap()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.tap(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.tap().run(fail, done))));
    });

    describe('tap(@callback:function)', () => {
      it('Does not call @callback when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.tap(fail).run(fail, done))));

      it('Calls @callback when flow emits several values', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(1, 2).tap(done).run(fail, fail))));

      it('Emits error thrown by @callback', () => {
        const error = new Error('test');
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2).tap(() => { throw error; }).run(fail, done)),
          error);
      });

      it('Passes context data to @callback as third argument', () => {
        const data = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow('test').tap((_, __, data) => done(data)).run(fail, fail, data)),
          data);
      });

      it('Emits immutable @values after tap @callback was applied', () => {
        const values = [1, 2, 3];
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).tap((item) => item * 2).toArray().run(done, fail)),
          values);
      });
    });

    describe('tap(@callback:!function)', () => {
      it('Emits immutable @values after tap @callback was applied', () => {
        const values = [1, 2, 3];
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).tap(1).toArray().run(done, fail)),
          values);
      });
    });
  });

  var reverseTests = (aeroflow, assert) => describe('reverse', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.reverse));

    describe('reverse()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.reverse(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.reverse().run(fail, done))));

      it('Emits @value from flow emitting single numeric @value', () => {
        const value = 42, expectation = value;
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(value).reverse().run(done, fail)),
          expectation);
      });

      it('Emits reversed @values from flow emitting @values', () => {
        const values = [1, 3], expectation = values.reverse();
        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).reverse().toArray().run(done, fail)),
          expectation);
      });
    });
  });

  var groupTests = (aeroflow, assert) => describe('group', () => {
    it('Is instance method', () =>
      assert.isFunction(aeroflow.empty.group));

    describe('group()', () => {
      it('Returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.group(), 'Aeroflow'));

      it('Emits nothing when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.group().run(fail, done))));
    });

    describe('group(@selector:function)', () => {
      it('Does not call @selector when flow is empty', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow.empty.group(fail).run(fail, done))));

      it('Calls @selector when flow emits several values', () =>
        assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(1, 2).group(done).run(fail, fail))));

      it('Emits error thrown by @selector', () => {
        const error = new Error('test');
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow(1, 2).group(() => { throw error; }).run(fail, done)),
          error);
      });

      it('Passes context data to @selector as third argument', () => {
        const data = {};
        return assert.eventually.strictEqual(new Promise((done, fail) =>
          aeroflow('test').group((_, __, data) => done(data)).run(fail, fail, data)),
          data);
      });

      it('Passes zero-based @index of iteration to @condition as second argument', () => {
        const values = [1, 2, 3, 4], expectation = values.length - 1;
        return assert.isFulfilled(new Promise((done, fail) =>
          aeroflow(values).group((_, index) => {
            if (index === expectation) done();
          }).run(fail, fail)));
      });

      it('Emits @values divided into groups by result of @selector', () => {
        const values = [-1, 6, -3, 4],
          expectation = [[-1, -3], [6, 4]];

        return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
          aeroflow(values).group(value => value >= 0).map(group => group[1]).toArray().run(done, fail)),
          expectation);
      });

      it('Emits @values divided into named groups by result of @selector', () => {
        const values = [-1, 6, -3, 4], positive = 'positive', negative = 'positive';

        return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
          aeroflow(values).group(value => value >= 0 ? positive : negative).map(group => group[0]).toArray().run(done, fail)),
          [positive, negative]);
      });
    });

    // describe('group(@selector:!function)', () => {
    //   it('Emits group with @selector name contains @values', () => {
    //     const values = [1, 2], name = 'integers', expectation = [name, values];
    //     return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
    //       aeroflow(values).group(name).run(done, fail)),
    //       expectation);
    //   });
    // });

    describe('group(@selectors:array)', () => {
      it('Emits nested named groups divided @values by @selectors', () => {
        const values  = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
          expectation = [values[0].name, values[1].name],
          selectors = [(value) => value.name, (value) => value.sex];

        return assert.eventually.sameMembers(new Promise((done, fail) =>
          aeroflow(values).group(...selectors).map(group => group[0]).toArray().run(done, fail)),
          expectation);
      });

      it('Use maps to contain nested groups which divided @values by @selectors', () => {
        const values  = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
          selectors = [(value) => value.name, (value) => value.sex];

        return assert.eventually.typeOf(new Promise((done, fail) =>
          aeroflow(values).group(...selectors).toArray().map(group => group[0][1]).run(done, fail)),
          'Map');
      });

      it('Emits nested named groups divided @values by @selectors 1', () => {
        // const values  = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
        //   expectation = [values[0].name, values[1].name],
        //   selectors = [(value) => value.name, (value) => value.sex];

        // return assert.eventually.sameMembers(new Promise((done, fail) =>
        //   aeroflow(values).group(...selectors).map(group => group[1].keys()).toArray().run(done, fail)),
        //   expectation);
      });

    });
  });

  const tests$2 = [
    averageTests,
    catchTests,
    countTests,
    distinctTests,
    everyTests,
    filterTests,
    maxTests,
    minTests,
    reduceTests,
    someTests,
    takeTests,
    skipTests,
    sortTests,
    sliceTests,
    sumTests,
    toStringTests,
    mapTests,
    meanTests,
    reverseTests,
    tapTests,
    groupTests
  ];

  var instanceMethodsTests = (aeroflow, assert) => describe('instance members', () =>
    tests$2.forEach(test => test(aeroflow, assert)));

  const tests = [
    staticMethodsTests,
    instanceMethodsTests
  ];

  var aeroflow = (aeroflow, assert) =>
    tests.forEach(test => test(aeroflow, assert));

  return aeroflow;

}));