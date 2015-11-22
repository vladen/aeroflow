'use strict';

if (typeof require === 'function') {
  global.aeroflow = require('./aeroflow.js');
  global.assert = require('chai').assert;
}

describe('aeroflow', function () {
  it('is a function', function () {
    return assert.isFunction(aeroflow);
  });

  it('returns instance of Aeroflow class', function () {
    return assert.typeOf(aeroflow(), 'Aeroflow');
  });

  it('creates flow emitting scalar value', function (done) {
    var expected = 'test';
    aeroflow(expected).run(function (value) {
      return assert.strictEqual(value, expected);
    }, function (error, count) {
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('returns existing flow as is, withouth wrapping it', function (done) {
    var expected = 'test';
    aeroflow(aeroflow(expected)).run(function (value) {
      return assert.strictEqual(value, expected);
    }, function (error, count) {
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('creates flow emitting array items', function (done) {
    var expected = ['a', 'b'];
    aeroflow(expected).run(function (value, index) {
      return assert.strictEqual(value, expected[index]);
    }, function (error, count) {
      assert.strictEqual(count, expected.length);
      done();
    });
  });

  it('creates flow emitting map entries', function (done) {
    var expected = [['a', 1], ['b', 2]];
    aeroflow(new Map(expected)).run(function (value, index) {
      return assert.includeMembers(value, expected[index]);
    }, function (error, count) {
      assert.strictEqual(count, expected.length);
      done();
    });
  });

  it('creates flow emitting set keys', function (done) {
    var expected = ['a', 'b'];
    aeroflow(new Set(expected)).run(function (value, index) {
      return assert.strictEqual(value, expected[index]);
    }, function (error, count) {
      assert.strictEqual(count, expected.length);
      done();
    });
  });

  it('creates flow emitting scalar value returned by function', function (done) {
    var expected = 'test';
    aeroflow(function () {
      return expected;
    }).run(function (value) {
      return assert.strictEqual(value, expected);
    }, function (error, count) {
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('creates flow emitting items of array returned by function', function (done) {
    var expected = ['a', 'b'];
    aeroflow(function () {
      return expected;
    }).run(function (value, index) {
      return assert.strictEqual(value, expected[index]);
    }, function (error, count) {
      assert.strictEqual(count, expected.length);
      done();
    });
  });

  it('creates flow emitting scalar value resolved by promise', function (done) {
    var expected = 'test';
    aeroflow(Promise.resolve(expected)).run(function (value) {
      return assert.strictEqual(value, expected);
    }, function (error, count) {
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('creates flow emitting items of array resolved by promise', function (done) {
    var expected = ['a', 'b'];
    aeroflow(Promise.resolve(expected)).run(function (value, index) {
      return assert.strictEqual(value, expected[index]);
    }, function (error, count) {
      assert.strictEqual(count, expected.length);
      done();
    });
  });

  it('creates flow emitting scalar value resolved by promise asynchronously', function (done) {
    var expected = 'test';
    aeroflow(new Promise(function (resolve) {
      return setTimeout(function () {
        return resolve(expected);
      });
    })).run(function (value) {
      return assert.strictEqual(value, expected);
    }, function (error, count) {
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('creates flow emitting items of array resolved by promise asynchronously', function (done) {
    var expected = ['a', 'b'];
    aeroflow(new Promise(function (resolve) {
      return setTimeout(function () {
        return resolve(expected);
      });
    })).run(function (value, index) {
      return assert.strictEqual(value, expected[index]);
    }, function (error, count) {
      assert.strictEqual(count, expected.length);
      done();
    });
  });

  it('creates flow emitting scalar value resolved by promise returned by function', function (done) {
    var expected = 'test';
    aeroflow(function () {
      return Promise.resolve(expected);
    }).run(function (value) {
      return assert.strictEqual(value, expected);
    }, function (error, count) {
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('creates flow emitting items of array resolved by promise returned by function', function (done) {
    var expected = ['a', 'b'];
    aeroflow(function () {
      return Promise.resolve(expected);
    }).run(function (value, index) {
      return assert.strictEqual(value, expected[index]);
    }, function (error, count) {
      assert.strictEqual(count, expected.length);
      done();
    });
  });

  it('creates flow emitting scalar value resolved by promise returned by function asynchronously', function (done) {
    var expected = 'test';
    aeroflow(function () {
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(expected);
        });
      });
    }).run(function (value) {
      return assert.strictEqual(value, expected);
    }, function (error, count) {
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('creates flow emitting items of array resolved by promise returned by function asynchronously', function (done) {
    var expected = ['a', 'b'];
    aeroflow(function () {
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(expected);
        });
      });
    }).run(function (value, index) {
      return assert.strictEqual(value, expected[index]);
    }, function (error, count) {
      assert.strictEqual(count, expected.length);
      done();
    });
  });

  describe('append', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.append);
    });

    it('appends several values to the flow', function (done) {
      var first = 0,
          second = 1,
          third = 2,
          expected = [first, second, third];
      aeroflow(first).append(second, third).run(function (value, index) {
        return assert.strictEqual(value, expected[index]);
      }, function (error, count) {
        assert.strictEqual(count, expected.length);
        done();
      });
    });

    it('appends several arrays to the flow', function (done) {
      var first = [0, 1],
          second = [2, 3],
          third = [4, 5],
          expected = [].concat(first, second, third);
      aeroflow(first).append(second, third).run(function (value, index) {
        return assert.strictEqual(value, expected[index]);
      }, function (error, count) {
        assert.strictEqual(count, expected.length);
        done();
      });
    });
  });

  describe('count', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.count);
    });

    it('returns zero for empty flow', function (done) {
      return aeroflow.empty.count().run(function (value) {
        return assert.strictEqual(value, 0);
      }, function (error, count) {
        assert.strictEqual(count, 1);
        done();
      });
    });

    it('returns number of emitted values for non-empty flow', function (done) {
      var expected = [1, 2, 3];
      aeroflow(expected).count().run(function (value) {
        return assert.strictEqual(value, expected.length);
      }, function (error, count) {
        assert.strictEqual(count, 1);
        done();
      });
    });
  });

  describe('empty', function () {
    it('is static property returning instance of Aeroflow class', function () {
      return assert.typeOf(aeroflow.empty, 'Aeroflow');
    });

    it('returns empty flow emitting done event only', function (done) {
      return aeroflow.empty.run(function (value) {
        return assert.ok(false);
      }, function (error, count) {
        assert.strictEqual(count, 0);
        done();
      });
    });
  });

  describe('expand', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.expand);
    });

    it('creates flow emitting geometric progression', function (done) {
      var expander = function expander(value) {
        return value * 2;
      },
          seed = 1,
          expected = [2, 4, 8];
      aeroflow.expand(expander, seed).take(expected.length).run(function (value, index) {
        return assert.strictEqual(value, expected[index]);
      }, function (error, count) {
        assert.strictEqual(count, expected.length);
        done();
      });
    });
  });

  describe('just', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.just);
    });

    it('creates flow emitting single function', function (done) {
      var expected = function expected() {};
      aeroflow.just(expected).run(function (value) {
        return assert.strictEqual(value, expected);
      }, function (error, count) {
        assert.strictEqual(count, 1);
        done();
      });
    });

    it('creates flow emitting single promise', function (done) {
      var expected = Promise.resolve();
      aeroflow.just(expected).run(function (value) {
        return assert.strictEqual(value, expected);
      }, function (error, count) {
        assert.strictEqual(count, 1);
        done();
      });
    });
  });

  describe('max', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.max);
    });

    it('emits done event only if flow is empty', function (done) {
      return aeroflow.empty.max().run(function (next) {
        return assert.ok(false);
      }, function (error, count) {
        assert.strictEqual(count, 0);
        done();
      });
    });

    it('emits valid result for non-empty flow', function (done) {
      var values = [1, 9, 2, 8, 3, 7, 4, 6, 5];
      aeroflow(values).max().run(function (value) {
        var _Math;

        return assert.strictEqual(value, (_Math = Math).max.apply(_Math, values));
      }, function (error, count) {
        assert.strictEqual(count, 1);
        done();
      });
    });
  });

  describe('random', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.random);
    });

    it('creates flow of random integers within a range', function (done) {
      var limit = 10,
          max = 10,
          min = 1;
      aeroflow.random(min, max).take(limit).run(function (value) {
        return assert.isTrue(Number.isInteger(value) && value >= min && value < max);
      }, function (error, count) {
        assert.strictEqual(count, limit);
        done();
      });
    });

    it('creates flow of random decimals within a range', function (done) {
      var limit = 10,
          max = 10.1,
          min = 1.1;
      aeroflow.random(min, max).take(10).run(function (value) {
        return assert.isTrue(!Number.isInteger(value) && value >= min && value < max);
      }, function (error, count) {
        assert.strictEqual(count, limit);
        done();
      });
    });
  });

  describe('range', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.range);
    });

    it('creates flow of ascending sequential integers starting from 0', function (done) {
      var limit = 10;
      aeroflow.range().take(limit).run(function (value, index) {
        return assert.strictEqual(value, index);
      }, function (error, count) {
        assert.strictEqual(count, limit);
        done();
      });
    });

    it('creates flow of ascending sequential integers within a range', function (done) {
      var start = 1,
          end = 9;
      aeroflow.range(start, end).run(function (value) {
        return assert.ok(Number.isInteger(value) && value >= start && value <= end);
      }, function (error, count) {
        assert.strictEqual(count, end - start + 1);
        done();
      });
    });

    it('creates flow of ascending sequential integers within a stepped range', function (done) {
      var start = 1,
          end = 9,
          step = 2;
      aeroflow.range(start, end, step).run(function (value) {
        return assert.isTrue(value >= start && value <= end && value % step === 1);
      }, function (error, count) {
        assert.strictEqual(count, Math.round((end - start + 1) / step));
        done();
      });
    });

    it('creates flow of descending sequential integers within a range', function (done) {
      var start = 9,
          end = 1;
      aeroflow.range(start, end).run(function (value) {
        return assert.isTrue(value <= start && value >= end);
      }, function (error, count) {
        assert.strictEqual(count, start - end + 1);
        done();
      });
    });

    it('creates flow of descending sequential integers within a stepped range', function (done) {
      var start = 9,
          end = 1,
          step = -2;
      aeroflow.range(start, end, step).run(function (value) {
        return assert.isTrue(value <= start && value >= end && value % step === 1);
      }, function (error, count) {
        assert.strictEqual(count, Math.round((start - end + 1) / -step));
        done();
      });
    });
  });

  describe('repeat', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.repeat);
    });

    it('creates flow emitting undefined values', function (done) {
      return aeroflow.repeat().take(1).run(function (value) {
        assert.isUndefined(value);
        done();
      });
    });

    it('creates flow emitting values returned by repeater function until repeater returns false', function (done) {
      var values = [1, 3, 5],
          repeater = function repeater(index) {
        return index < values.length && values[index];
      };
      aeroflow.repeat(repeater).run(function (value, index) {
        return assert.strictEqual(value, values[index]);
      }, function (error, count) {
        assert.strictEqual(count, values.length);
        done();
      });
    });
  });

  describe('skip', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.skip);
    });

    it('creates flow emitting "done" signal only', function (done) {
      return aeroflow(1, 2, 3, 4).skip().run(function () {
        return assert.ok(false);
      }, done);
    });

    it('creates flow skipping provided number of first values and emitting remaining values', function (done) {
      var values = [1, 2, 3, 4],
          skip = Math.floor(values.length / 2);
      aeroflow(values).skip(skip).run(function (value, index) {
        return assert.strictEqual(value, values[skip + index]);
      }, function (error, count) {
        assert.strictEqual(count, values.length - skip);
        done();
      });
    });

    it('creates flow skipping provided number of last values and emitting remaining values', function (done) {
      var values = [1, 2, 3, 4],
          skip = Math.floor(values.length / 2);
      aeroflow(values).skip(-skip).run(function (value, index) {
        return assert.strictEqual(value, values[index]);
      }, function (error, count) {
        assert.strictEqual(count, values.length - skip);
        done();
      });
    });

    it('creates flow skipping values while provided function returns true and emitting remaining values', function (done) {
      var values = [1, 2, 3, 4],
          skip = Math.floor(values.length / 2),
          limiter = function limiter(value, index) {
        return index < skip;
      };
      aeroflow(values).skip(limiter).run(function (value, index) {
        return assert.strictEqual(value, values[skip + index]);
      }, function (error, count) {
        assert.strictEqual(count, values.length - skip);
        done();
      });
    });
  });

  /*
  
    describe('share', () => {
      it('is instance method',
        () => assert.isFunction(aeroflow.empty.share));
      it('invokes emitter only once than shares results to subsequent run',
        done => {
          let invocations = 0
            , emitter = () => invocations++
            , onDone = () => {
                assert.strictEqual(invocations, 1);
                done();
              }
            , onNext = () => {}
            ;
          aeroflow(emitter).share().run().run(onNext, onDone);
      });
      it('invokes emitter only once than shares results to subsequent run until expires',
        done => {
          let expiration = 50
            , invocations = 0
            , emitter = () => invocations++
            , onDone1 = () => assert.strictEqual(invocations, 1)
            , onDone2 = () => {
                assert.strictEqual(invocations, 2);
                done();
              }
            , onNext = () => {}
            ;
          let flow = aeroflow(emitter).share(expiration).run(onNext, onDone1).run(onNext, onDone1);
          setTimeout(() => flow.run(onNext, onDone2), expiration);
      });
    });
  
    
  
    describe('sort', () => {
      it('is instance method',
        () => assert.isFunction(aeroflow.empty.sort));
      it('emits values sorted in ascending order when no parameters specified',
        done => {
          let values = [2, 1, 4, 3]
            , sorted = [...values].sort()
            , count = 0
            , onDone = () => {
                assert.strictEqual(count, values.length);
                done();
              }
            , onNext = value => assert.strictEqual(value, sorted[count++])
            ;
          aeroflow(values).sort().run(onNext, onDone);
        });
      it('emits values sorted in descending order when order parameter has value "desc"',
        done => {
          let values = [2, 1, 4, 3]
            , sorted = [...values].sort().reverse()
            , count = 0
            , onDone = () => {
                assert.strictEqual(count, values.length);
                done();
              }
            , onNext = value => assert.strictEqual(value, sorted[count++])
            ;
          aeroflow(values).sort('desc').run(onNext, onDone);
        });
      it('emits objects sorted in ascending order by multiple keys when key selectors specified',
        done => {
          let values = [
                {id: 2, name: 'a'},
                {id: 2, name: 'b'},
                {id: 1, name: 'b'},
                {id: 1, name: 'a'}
              ]
            , sorted = [...values].sort((left, right) =>
                left.id < right.id ? -1 : left.id > right.id ? 1 : left.name < right.name ? -1 : left.name > right.name ? 1 : 0)
            , count = 0
            , onDone = () => {
                assert.strictEqual(count, values.length);
                done();
              }
            , onNext = value => assert.strictEqual(value, sorted[count++])
            ;
          aeroflow(values).sort(value => value.id, value => value.name).run(onNext, onDone);
        });
      it('emits objects sorted in descending order by multiple keys when key selectors specified',
        done => {
          let values = [
                {id: 2, name: 'a'},
                {id: 2, name: 'b'},
                {id: 1, name: 'b'},
                {id: 1, name: 'a'}
              ]
            , sorted = [...values].sort((left, right) =>
                left.id < right.id ? 1 : left.id > right.id ? -1 : left.name < right.name ? 1 : left.name > right.name ? -1 : 0)
            , count = 0
            , onDone = () => {
                assert.strictEqual(count, values.length);
                done();
              }
            , onNext = value => assert.strictEqual(value, sorted[count++])
            ;
          aeroflow(values).sort('desc', value => value.id, value => value.name).run(onNext, onDone);
        });
    });
  
    describe('take', () => {
      it('is instance method',
        () => assert.isFunction(aeroflow.empty.take));
      it('emits all values if no parameters specified',
        done => {
          let values = [1, 2, 3, 4]
            , results = []
            , onDone = () => {
                assert.strictEqual(results.length, values.length);
                assert.includeMembers(results, values);
                done();
              }
            , onNext = value => results.push(value)
            ;
          aeroflow(values).take().run(onNext, onDone);
        });
      it('emits specified number of first values',
        done => {
          let values = [1, 2, 3, 4]
            , results = []
            , take = 2
            , onDone = () => {
                assert.strictEqual(results.length, take);
                assert.includeMembers(results, values.slice(0, take));
                done();
              }
            , onNext = value => results.push(value)
            ;
          aeroflow(values).take(take).run(onNext, onDone);
        });
      it('emits first values while specified function returns true',
        done => {
          let values = [1, 2, 3, 4]
            , results = []
            , take = 2
            , limiter = (value, index) => index < take
            , onDone = () => {
                assert.strictEqual(results.length, take);
                assert.includeMembers(results, values.slice(0, take));
                done();
              }
            , onNext = value => results.push(value)
            ;
          aeroflow(values).take(limiter).run(onNext, onDone);
        });
    });
  
    describe('tap', () => {
      it('is instance method',
        () => assert.isFunction(aeroflow.empty.tap));
      it('intercepts each emitted value',
        done => {
          let count = 0
            , callback = value => assert.strictEqual(value, count++)
            ;
          aeroflow.range().take(3).tap(callback).run(() => {}, done);
        });
    });
  
    describe('toMap', () => {
      it('is instance method', () =>
        assert.isFunction(aeroflow.empty.toMap));
      it('emits single map object containing flow values as both keys and values if no parameters specified',
        done => {
          let values = [1, 2, 3]
            , results = []
            , onDone = () => {
                assert.strictEqual(results.length, 1);
                let map = results[0];
                assert.typeOf(map, 'Map');
                assert.includeMembers(Array.from(map.keys()), values);
                assert.includeMembers(Array.from(map.values()), values);
                done();
              }
            , onNext = value => results.push(value)
            ;
          aeroflow(values).toMap().run(onNext, onDone);
        });
    });
  
    describe('unique', () => {
      it('is instance method',
        () => assert.isFunction(aeroflow.empty.unique));
      it('emits unique values only',
        done => {
          let unique = [1, 2, 3]
            , values = [...unique, ...unique]
            , results = []
            , onDone = () => {
                assert.strictEqual(results.length, unique.length);
                assert.includeMembers(unique, results);
                done();
              }
            , onNext = value => results.push(value)
            ;
          aeroflow(values).unique().run(onNext, onDone);
        });
    });
  
  */
});
