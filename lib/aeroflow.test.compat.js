'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  it('creates flow from scalar value', function (done) {
    var count = 0,
        value = 'test',
        onDone = function onDone() {
      assert.strictEqual(count, 1);
      done();
    },
        onNext = function onNext(next) {
      count++;
      assert.strictEqual(next, value);
    };
    aeroflow(value).run(onNext, onDone);
  });
  it('does not wrap flow twice', function (done) {
    var count = 0,
        value = 'test',
        onDone = function onDone() {
      assert.strictEqual(count, 1);
      done();
    },
        onNext = function onNext(next) {
      count++;
      assert.strictEqual(next, value);
    };
    aeroflow(aeroflow(value)).run(onNext, onDone);
  });
  it('creates flow from array', function (done) {
    var count = 0,
        values = ['a', 'b'],
        onDone = function onDone() {
      assert.strictEqual(count, values.length);
      done();
    },
        onNext = function onNext(next) {
      return assert.strictEqual(next, values[count++]);
    };
    aeroflow(values).run(onNext, onDone);
  });
  it('creates flow from map', function (done) {
    var count = 0,
        values = [['a', 1], ['b', 2]],
        onDone = function onDone() {
      assert.strictEqual(count, values.length);
      done();
    },
        onNext = function onNext(next) {
      return assert.includeMembers(next, values[count++]);
    };
    aeroflow(new Map(values)).run(onNext, onDone);
  });
  it('creates flow from set', function (done) {
    var count = 0,
        values = ['a', 'b'],
        onDone = function onDone() {
      assert.strictEqual(count, values.length);
      done();
    },
        onNext = function onNext(next) {
      return assert.strictEqual(next, values[count++]);
    };
    aeroflow(new Set(values)).run(onNext, onDone);
  });
  it('creates flow from function returning scalar value', function (done) {
    var count = 0,
        value = 'test',
        onDone = function onDone() {
      assert.strictEqual(count, 1);
      done();
    },
        onNext = function onNext(next) {
      count++;
      assert.strictEqual(next, value);
    };
    aeroflow(function () {
      return value;
    }).run(onNext, onDone);
  });
  it('creates flow from function returning array', function (done) {
    var count = 0,
        values = ['a', 'b'],
        onDone = function onDone() {
      assert.strictEqual(count, values.length);
      done();
    },
        onNext = function onNext(next) {
      return assert.strictEqual(next, values[count++]);
    };
    aeroflow(function () {
      return values;
    }).run(onNext, onDone);
  });
  it('creates flow from promise', function (done) {
    var count = 0,
        value = 'test',
        onDone = function onDone() {
      assert.strictEqual(count, 1);
      done();
    },
        onNext = function onNext(next) {
      count++;
      assert.strictEqual(next, value);
    };
    aeroflow(Promise.resolve(value)).run(onNext, onDone);
  });
  it('creates flow from function returning promise resolving to scalar value immediately', function (done) {
    var count = 0,
        value = 'test',
        onDone = function onDone() {
      assert.strictEqual(count, 1);
      done();
    },
        onNext = function onNext(next) {
      count++;
      assert.strictEqual(next, value);
    };
    aeroflow(function () {
      return Promise.resolve(value);
    }).run(onNext, onDone);
  });
  it('creates flow from function returning promise resolving to array immediately', function (done) {
    var count = 0,
        values = ['a', 'b'],
        generator = function generator() {
      return Promise.resolve(values);
    },
        onDone = function onDone() {
      assert.strictEqual(count, values.length);
      done();
    },
        onNext = function onNext(next) {
      return assert.strictEqual(next, values[count++]);
    };
    aeroflow(generator).run(onNext, onDone);
  });
  it('creates flow from function returning promise resolving to scalar value eventually', function (done) {
    var count = 0,
        value = 'test',
        generator = function generator() {
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(value);
        }, 10);
      });
    },
        onDone = function onDone() {
      assert.strictEqual(count, 1);
      done();
    },
        onNext = function onNext(next) {
      count++;
      assert.strictEqual(next, value);
    };
    aeroflow(generator).run(onNext, onDone);
  });
  it('creates flow from function returning promise resolving to array eventually', function (done) {
    var count = 0,
        values = ['a', 'b'],
        generator = function generator() {
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(values);
        }, 10);
      });
    },
        onDone = function onDone() {
      assert.strictEqual(count, values.length);
      done();
    },
        onNext = function onNext(next) {
      return assert.strictEqual(next, values[count++]);
    };
    aeroflow(generator).run(onNext, onDone);
  });

  describe('concat', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.concat);
    });
    it('concatenates several values into one flow', function (done) {
      var count = 0,
          values = [1, 2, 3],
          onDone = function onDone() {
        assert.strictEqual(count, values.length);
        done();
      },
          onNext = function onNext(next) {
        return count++;
      };
      aeroflow(1).concat(2, 3).run(onNext, onDone);
    });
    it('concatenates several arrays into one flow', function (done) {
      var _aeroflow;

      var count = 0,
          times = 3,
          values = [1, 2],
          onDone = function onDone() {
        assert.strictEqual(count, values.length * times);
        done();
      },
          onNext = function onNext(next) {
        return count++;
      };
      (_aeroflow = aeroflow(values)).concat.apply(_aeroflow, _toConsumableArray(Array(times - 1).fill(values))).run(onNext, onDone);
    });
  });

  describe('count', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.count);
    });
    it('returns zero for empty flow', function (done) {
      var count = undefined,
          onDone = function onDone() {
        assert.strictEqual(count, 0);
        done();
      },
          onNext = function onNext(next) {
        return count = next;
      };
      aeroflow.empty.count().run(onNext, onDone);
    });
    it('returns valid result for non-empty flow', function (done) {
      var count = undefined,
          values = Array(3),
          onDone = function onDone() {
        assert.strictEqual(count, values.length);
        done();
      },
          onNext = function onNext(next) {
        return count = next;
      };
      aeroflow(values).count().run(onNext, onDone);
    });
  });

  describe('empty', function () {
    it('is static property', function () {
      return assert.typeOf(aeroflow.empty, 'Aeroflow');
    });
    it('returns empty flow', function (done) {
      var count = 0,
          onDone = function onDone() {
        assert.strictEqual(count, 0);
        done();
      },
          onNext = function onNext(next) {
        return count++;
      };
      aeroflow.empty.run(onNext, onDone);
    });
  });

  describe('expand', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.expand);
    });
    it('creates flow geometrically progressing integers', function (done) {
      var count = 0,
          expander = function expander(value) {
        return value * 2;
      },
          seed = 1,
          values = [2, 4, 8],
          onDone = function onDone() {
        assert.strictEqual(count, values.length);
        done();
      },
          onNext = function onNext(next) {
        return assert.strictEqual(next, values[count++]);
      };
      aeroflow.expand(expander, seed).take(values.length).run(onNext, onDone);
    });
  });

  describe('first', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.first);
    });
    it('emits first value only', function (done) {
      var values = [1, 2, 3],
          results = [],
          onDone = function onDone() {
        assert.strictEqual(results.length, 1);
        assert.include(results, values[0]);
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).first().run(onNext, onDone);
    });
  });

  describe('just', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.just);
    });
    it('creates flow of single array value', function (done) {
      var count = 0,
          value = [2, 4, 8],
          onDone = function onDone() {
        assert.strictEqual(count, 1);
        done();
      },
          onNext = function onNext(next) {
        count++;
        assert.strictEqual(next, value);
      };
      aeroflow.just(value).run(onNext, onDone);
    });
    it('creates flow of single function value', function (done) {
      var count = 0,
          value = function value() {},
          onDone = function onDone() {
        assert.strictEqual(count, 1);
        done();
      },
          onNext = function onNext(next) {
        count++;
        assert.strictEqual(next, value);
      };
      aeroflow.just(value).run(onNext, onDone);
    });
    it('creates flow of single promise value', function (done) {
      var count = 0,
          value = Promise.resolve(1),
          onDone = function onDone() {
        assert.strictEqual(count, 1);
        done();
      },
          onNext = function onNext(next) {
        count++;
        assert.strictEqual(next, value);
      };
      aeroflow.just(value).run(onNext, onDone);
    });
  });

  describe('last', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.last);
    });
    it('emits last value only', function (done) {
      var values = [1, 2, 3],
          results = [],
          onDone = function onDone() {
        assert.strictEqual(results.length, 1);
        assert.include(results, values[values.length - 1]);
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).last().run(onNext, onDone);
    });
  });

  describe('max', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.max);
    });
    it('returns no results for empty flow', function (done) {
      var empty = true,
          onDone = function onDone() {
        assert.isTrue(empty);
        done();
      },
          onNext = function onNext(next) {
        return empty = false;
      };
      aeroflow.empty.max().run(onNext, onDone);
    });
    it('returns valid result for non-empty flow', function (done) {
      var result = undefined,
          max = 9e9,
          values = [1, max, 2],
          onDone = function onDone() {
        assert.strictEqual(result, max);
        done();
      },
          onNext = function onNext(next) {
        return result = next;
      };
      aeroflow(values).max().run(onNext, onDone);
    });
  });

  describe('random', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.random);
    });
    it('creates flow of random integers within a range', function (done) {
      var max = 10,
          min = 1,
          onNext = function onNext(next) {
        return assert.isTrue(Number.isInteger(next) && next >= min && next < max);
      };
      aeroflow.random(min, max).take(10).run(onNext, done);
    });
    it('creates flow of random decimals within a range', function (done) {
      var max = 10.1,
          min = 1.1,
          onNext = function onNext(next) {
        return assert.isTrue(!Number.isInteger(next) && next >= min && next < max);
      };
      aeroflow.random(min, max).take(10).run(onNext, done);
    });
  });

  describe('range', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.range);
    });
    it('creates flow of ascending sequential integers starting from 0', function (done) {
      var count = 0,
          onNext = function onNext(next) {
        return assert.strictEqual(next, count++);
      };
      aeroflow.range().take(10).run(onNext, done);
    });
    it('creates flow of ascending sequential integers within a range', function (done) {
      var count = 0,
          start = 1,
          end = 9,
          onDone = function onDone() {
        assert.strictEqual(count, end - start + 1);
        done();
      },
          onNext = function onNext(next) {
        count++;
        assert.isTrue(next >= start && next <= end);
      };
      aeroflow.range(start, end).run(onNext, onDone);
    });
    it('creates flow of ascending sequential integers within a stepped range', function (done) {
      var count = 0,
          start = 1,
          end = 9,
          step = 2,
          onDone = function onDone() {
        assert.strictEqual(count, Math.round((end - start + 1) / step));
        done();
      },
          onNext = function onNext(next) {
        count++;
        assert.isTrue(next >= start && next <= end && next % step === 1);
      };
      aeroflow.range(start, end, step).run(onNext, onDone);
    });
    it('creates flow of descending sequential integers within a range', function (done) {
      var count = 0,
          start = 9,
          end = 1,
          onDone = function onDone() {
        assert.strictEqual(count, start - end + 1);
        done();
      },
          onNext = function onNext(next) {
        count++;
        assert.isTrue(next <= start && next >= end);
      };
      aeroflow.range(start, end).run(onNext, onDone);
    });
    it('creates flow of descending sequential integers within a stepped range', function (done) {
      var count = 0,
          start = 9,
          end = 1,
          step = -2,
          onDone = function onDone() {
        assert.strictEqual(count, Math.round((start - end + 1) / -step));
        done();
      },
          onNext = function onNext(next) {
        count++;
        assert.isTrue(next <= start && next >= end && next % step === 1);
      };
      aeroflow.range(start, end, step).run(onNext, onDone);
    });
  });

  describe('repeat', function () {
    it('is static method', function () {
      return assert.isFunction(aeroflow.repeat);
    });
    it('creates flow emitting specified limit of undefined values', function (done) {
      return aeroflow.repeat().take(3).run(function (next) {
        return assert.isUndefined(next);
      }, done);
    });
    it('creates flow emitting values returned by repeater function until repeater returns false', function (done) {
      var count = 0,
          limit = 5,
          repeater = function repeater() {
        return count < limit ? count : false;
      },
          onDone = function onDone() {
        assert.strictEqual(count, limit);
        done();
      },
          onNext = function onNext(next) {
        return assert.strictEqual(next, count++);
      };
      aeroflow.repeat(repeater).run(onNext, onDone);
    });
  });

  describe('share', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.share);
    });
    it('invokes emitter only once than shares results to subsequent run', function (done) {
      var invocations = 0,
          emitter = function emitter() {
        return invocations++;
      },
          onDone = function onDone() {
        assert.strictEqual(invocations, 1);
        done();
      },
          onNext = function onNext() {};
      aeroflow(emitter).share().run().run(onNext, onDone);
    });
    it('invokes emitter only once than shares results to subsequent run until expires', function (done) {
      var expiration = 50,
          invocations = 0,
          emitter = function emitter() {
        return invocations++;
      },
          onDone1 = function onDone1() {
        return assert.strictEqual(invocations, 1);
      },
          onDone2 = function onDone2() {
        assert.strictEqual(invocations, 2);
        done();
      },
          onNext = function onNext() {};
      var flow = aeroflow(emitter).share(expiration).run(onNext, onDone1).run(onNext, onDone1);
      setTimeout(function () {
        return flow.run(onNext, onDone2);
      }, expiration);
    });
  });

  describe('skip', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.skip);
    });
    it('skips all values and emits "done" signal only', function (done) {
      var values = [1, 2, 3, 4],
          empty = true,
          onDone = function onDone() {
        assert.isTrue(empty);
        done();
      },
          onNext = function onNext() {
        return empty = false;
      };
      aeroflow(values).skip().run(onNext, onDone);
    });
    it('skips specified number of values emits remaining values', function (done) {
      var values = [1, 2, 3, 4],
          results = [],
          skip = 2,
          onDone = function onDone() {
        assert.strictEqual(results.length, values.length - skip);
        assert.includeMembers(results, values.slice(skip));
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).skip(skip).run(onNext, onDone);
    });
    it('skips while specified function returns true emits remaining values', function (done) {
      var values = [1, 2, 3, 4],
          results = [],
          skip = 2,
          limiter = function limiter(value, index) {
        return index < skip;
      },
          onDone = function onDone() {
        assert.strictEqual(results.length, values.length - skip);
        assert.includeMembers(results, values.slice(skip));
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).skip(limiter).run(onNext, onDone);
    });
  });

  describe('sort', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.sort);
    });
    it('emits values sorted in ascending order when no parameters specified', function (done) {
      var values = [2, 1, 4, 3],
          sorted = [].concat(values).sort(),
          count = 0,
          onDone = function onDone() {
        assert.strictEqual(count, values.length);
        done();
      },
          onNext = function onNext(value) {
        return assert.strictEqual(value, sorted[count++]);
      };
      aeroflow(values).sort().run(onNext, onDone);
    });
    it('emits values sorted in descending order when order parameter has value "desc"', function (done) {
      var values = [2, 1, 4, 3],
          sorted = [].concat(values).sort().reverse(),
          count = 0,
          onDone = function onDone() {
        assert.strictEqual(count, values.length);
        done();
      },
          onNext = function onNext(value) {
        return assert.strictEqual(value, sorted[count++]);
      };
      aeroflow(values).sort('desc').run(onNext, onDone);
    });
    it('emits objects sorted in ascending order by multiple keys when key selectors specified', function (done) {
      var values = [{ id: 2, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'b' }, { id: 1, name: 'a' }],
          sorted = [].concat(values).sort(function (left, right) {
        return left.id < right.id ? -1 : left.id > right.id ? 1 : left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
      }),
          count = 0,
          onDone = function onDone() {
        assert.strictEqual(count, values.length);
        done();
      },
          onNext = function onNext(value) {
        return assert.strictEqual(value, sorted[count++]);
      };
      aeroflow(values).sort(function (value) {
        return value.id;
      }, function (value) {
        return value.name;
      }).run(onNext, onDone);
    });
    it('emits objects sorted in descending order by multiple keys when key selectors specified', function (done) {
      var values = [{ id: 2, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'b' }, { id: 1, name: 'a' }],
          sorted = [].concat(values).sort(function (left, right) {
        return left.id < right.id ? 1 : left.id > right.id ? -1 : left.name < right.name ? 1 : left.name > right.name ? -1 : 0;
      }),
          count = 0,
          onDone = function onDone() {
        assert.strictEqual(count, values.length);
        done();
      },
          onNext = function onNext(value) {
        return assert.strictEqual(value, sorted[count++]);
      };
      aeroflow(values).sort('desc', function (value) {
        return value.id;
      }, function (value) {
        return value.name;
      }).run(onNext, onDone);
    });
  });

  describe('take', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.take);
    });
    it('emits all values if no parameters specified', function (done) {
      var values = [1, 2, 3, 4],
          results = [],
          onDone = function onDone() {
        assert.strictEqual(results.length, values.length);
        assert.includeMembers(results, values);
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).take().run(onNext, onDone);
    });
    it('emits specified number of first values', function (done) {
      var values = [1, 2, 3, 4],
          results = [],
          take = 2,
          onDone = function onDone() {
        assert.strictEqual(results.length, take);
        assert.includeMembers(results, values.slice(0, take));
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).take(take).run(onNext, onDone);
    });
    it('emits first values while specified function returns true', function (done) {
      var values = [1, 2, 3, 4],
          results = [],
          take = 2,
          limiter = function limiter(value, index) {
        return index < take;
      },
          onDone = function onDone() {
        assert.strictEqual(results.length, take);
        assert.includeMembers(results, values.slice(0, take));
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).take(limiter).run(onNext, onDone);
    });
  });

  describe('tap', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.tap);
    });
    it('intercepts each emitted value', function (done) {
      var count = 0,
          callback = function callback(value) {
        return assert.strictEqual(value, count++);
      };
      aeroflow.range().take(3).tap(callback).run(function () {}, done);
    });
  });

  describe('toMap', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.toMap);
    });
    it('emits single map object containing flow values as both keys and values if no parameters specified', function (done) {
      var values = [1, 2, 3],
          results = [],
          onDone = function onDone() {
        assert.strictEqual(results.length, 1);
        var map = results[0];
        assert.typeOf(map, 'Map');
        assert.includeMembers(Array.from(map.keys()), values);
        assert.includeMembers(Array.from(map.values()), values);
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).toMap().run(onNext, onDone);
    });
  });

  describe('unique', function () {
    it('is instance method', function () {
      return assert.isFunction(aeroflow.empty.unique);
    });
    it('emits unique values only', function (done) {
      var unique = [1, 2, 3],
          values = [].concat(unique, unique),
          results = [],
          onDone = function onDone() {
        assert.strictEqual(results.length, unique.length);
        assert.includeMembers(unique, results);
        done();
      },
          onNext = function onNext(value) {
        return results.push(value);
      };
      aeroflow(values).unique().run(onNext, onDone);
    });
  });
});
