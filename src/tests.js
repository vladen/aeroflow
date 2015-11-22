'use strict';

if (typeof require === 'function') {
  global.aeroflow = require('./aeroflow.js');
  global.assert = require('chai').assert;
}

describe('aeroflow', () => {
  it('is a function', () =>
    assert.isFunction(aeroflow));

  it('returns instance of Aeroflow class', () =>
    assert.typeOf(aeroflow(), 'Aeroflow'));

  it('creates flow emitting scalar value', done => {
    let expected = 'test';
    aeroflow(expected).run(
      value =>
        assert.strictEqual(value, expected),
      (error, count) => {
        assert.strictEqual(count, 1);
        done();
      });
  });

  it('returns existing flow as is, withouth wrapping it', done => {
    let expected = 'test';
    aeroflow(aeroflow(expected)).run(
      value =>
        assert.strictEqual(value, expected),
      (error, count) => {
        assert.strictEqual(count, 1);
        done();
      });
  });

  it('creates flow emitting array items', done => {
    let expected = ['a', 'b'];
    aeroflow(expected).run(
      (value, index) =>
        assert.strictEqual(value, expected[index]),
      (error, count) => {
        assert.strictEqual(count, expected.length);
        done();
      });
  });

  it('creates flow emitting map entries', done => {
    let expected = [['a', 1], ['b', 2]];
    aeroflow(new Map(expected)).run(
      (value, index) =>
        assert.includeMembers(value, expected[index]),
      (error, count) => {
        assert.strictEqual(count, expected.length);
        done();
      });
  });

  it('creates flow emitting set keys', done => {
    let expected = ['a', 'b'];
    aeroflow(new Set(expected)).run(
      (value, index) =>
        assert.strictEqual(value, expected[index]),
      (error, count) => {
        assert.strictEqual(count, expected.length);
        done();
      });
  });

  it('creates flow emitting scalar value returned by function', done => {
    let expected = 'test';
    aeroflow(() => expected).run(
      value =>
        assert.strictEqual(value, expected),
      (error, count) => {
        assert.strictEqual(count, 1);
        done();
      });
  });

  it('creates flow emitting items of array returned by function', done => {
    let expected = ['a', 'b'];
    aeroflow(() => expected).run(
      (value, index) =>
        assert.strictEqual(value, expected[index]),
      (error, count) => {
        assert.strictEqual(count, expected.length);
        done();
      });
  });

  it('creates flow emitting scalar value resolved by promise', done => {
    let expected = 'test';
    aeroflow(Promise.resolve(expected)).run(
      value =>
        assert.strictEqual(value, expected),
      (error, count) => {
        assert.strictEqual(count, 1);
        done();
      });
  });

  it('creates flow emitting items of array resolved by promise', done => {
    let expected = ['a', 'b'];
    aeroflow(Promise.resolve(expected)).run(
      (value, index) =>
        assert.strictEqual(value, expected[index]),
      (error, count) => {
        assert.strictEqual(count, expected.length);
        done();
      });
  });

  it('creates flow emitting scalar value resolved by promise asynchronously', done => {
    let expected = 'test';
    aeroflow(new Promise(resolve => setTimeout(() => resolve(expected)))).run(
      value =>
        assert.strictEqual(value, expected),
      (error, count) => {
        assert.strictEqual(count, 1);
        done();
      });
  });

  it('creates flow emitting items of array resolved by promise asynchronously', done => {
    let expected = ['a', 'b'];
    aeroflow(new Promise(resolve => setTimeout(() => resolve(expected)))).run(
      (value, index) =>
        assert.strictEqual(value, expected[index]),
      (error, count) => {
        assert.strictEqual(count, expected.length);
        done();
      });
  });

  it('creates flow emitting scalar value resolved by promise returned by function', done => {
    let expected = 'test';
    aeroflow(() => Promise.resolve(expected)).run(
      value =>
        assert.strictEqual(value, expected),
      (error, count) => {
        assert.strictEqual(count, 1);
        done();
      });
  });

  it('creates flow emitting items of array resolved by promise returned by function', done => {
    let expected = ['a', 'b'];
    aeroflow(() => Promise.resolve(expected)).run(
      (value, index) =>
        assert.strictEqual(value, expected[index]),
      (error, count) => {
        assert.strictEqual(count, expected.length);
        done();
      });
  });

  it('creates flow emitting scalar value resolved by promise returned by function asynchronously', done => {
    let expected = 'test';
    aeroflow(() => new Promise(resolve => setTimeout(() => resolve(expected)))).run(
      value =>
        assert.strictEqual(value, expected),
      (error, count) => {
        assert.strictEqual(count, 1);
        done();
      });
  });

  it('creates flow emitting items of array resolved by promise returned by function asynchronously', done => {
    let expected = ['a', 'b'];
    aeroflow(() => new Promise(resolve => setTimeout(() => resolve(expected)))).run(
      (value, index) =>
        assert.strictEqual(value, expected[index]),
      (error, count) => {
        assert.strictEqual(count, expected.length);
        done();
      });
  });

  describe('append', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.append));

    it('appends several values to the flow', done => {
      let first = 0, second = 1, third = 2, expected = [first, second, third];
      aeroflow(first).append(second, third).run(
        (value, index) =>
          assert.strictEqual(value, expected[index]),
        (error, count) => {
          assert.strictEqual(count, expected.length);
          done();
        });
    });

    it('appends several arrays to the flow', done => {
      let first = [0, 1], second = [2, 3], third = [4, 5], expected = [...first, ...second, ...third];
      aeroflow(first).append(second, third).run(
        (value, index) =>
          assert.strictEqual(value, expected[index]),
        (error, count) => {
          assert.strictEqual(count, expected.length);
          done();
        });
    });
  });

  describe('count', () => {
    it('is instance method', () => 
      assert.isFunction(aeroflow.empty.count));

    it('returns zero for empty flow', done => 
      aeroflow.empty.count().run(
        value =>
          assert.strictEqual(value, 0),
        (error, count) => {
          assert.strictEqual(count, 1);
          done();
        }));

    it('returns number of emitted values for non-empty flow', done => {
      let expected = [1, 2, 3];
      aeroflow(expected).count().run(
        value =>
          assert.strictEqual(value, expected.length),
        (error, count) => {
          assert.strictEqual(count, 1);
          done();
        });
    });
  });

  describe('empty', () => {
    it('is static property returning instance of Aeroflow class', () => 
      assert.typeOf(aeroflow.empty, 'Aeroflow'));

    it('returns empty flow emitting done event only', done => 
      aeroflow.empty.run(
        value =>
          assert.ok(false),
        (error, count) => {
          assert.strictEqual(count, 0);
          done();
        }));
  });

  describe('expand', () => {
    it('is static method', () => 
      assert.isFunction(aeroflow.expand));

    it('creates flow emitting geometric progression', done => {
        let expander = value => value * 2, seed = 1, expected = [2, 4, 8];
        aeroflow.expand(expander, seed).take(expected.length).run(
          (value, index) =>
            assert.strictEqual(value, expected[index]),
          (error, count) => {
            assert.strictEqual(count, expected.length);
            done();
          });
    });
  });

  describe('just', () => {
    it('is static method', () =>
      assert.isFunction(aeroflow.just));

    it('creates flow emitting single function', done => {
      let expected = () => {};
      aeroflow.just(expected).run(
        value =>
          assert.strictEqual(value, expected),
        (error, count) => {
          assert.strictEqual(count, 1);
          done();
        });
    });

    it('creates flow emitting single promise', done => {
        let expected = Promise.resolve();
        aeroflow.just(expected).run(
          value =>
            assert.strictEqual(value, expected),
          (error, count) => {
            assert.strictEqual(count, 1);
            done();
          });
    });
  });

  describe('max', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.max));

    it('emits done event only if flow is empty', done =>
      aeroflow.empty.max().run(
        next =>
          assert.ok(false),
        (error, count) => {
          assert.strictEqual(count, 0);
          done();
        }));

    it('emits valid result for non-empty flow', done => {
      let values = [1, 9, 2, 8, 3, 7, 4, 6, 5];
      aeroflow(values).max().run(
        value =>
          assert.strictEqual(value, Math.max(...values)),
        (error, count) => {
          assert.strictEqual(count, 1);
          done();
        });
    });
  });

  describe('random', () => {
    it('is static method', () =>
      assert.isFunction(aeroflow.random));

    it('creates flow of random integers within a range', done => {
        let limit = 10, max = 10, min = 1;
        aeroflow.random(min, max).take(limit).run(
          value =>
            assert.isTrue(Number.isInteger(value) && value >= min && value < max),
          (error, count) => {
            assert.strictEqual(count, limit);
            done();
          });
    });

    it('creates flow of random decimals within a range',
      done => {
        let limit = 10, max = 10.1, min = 1.1;
        aeroflow.random(min, max).take(10).run(
          value =>
            assert.isTrue(!Number.isInteger(value) && value >= min && value < max),
          (error, count) => {
            assert.strictEqual(count, limit);
            done();
          });
    });
  });

  describe('range', () => {
    it('is static method', () =>
      assert.isFunction(aeroflow.range));

    it('creates flow of ascending sequential integers starting from 0', done => {
      let limit = 10;
      aeroflow.range().take(limit).run(
        (value, index) =>
          assert.strictEqual(value, index),
        (error, count) => {
          assert.strictEqual(count, limit);
          done();
        });
    });

    it('creates flow of ascending sequential integers within a range',
      done => {
        let start = 1, end = 9;
        aeroflow.range(start, end).run(
          value =>
            assert.ok(Number.isInteger(value) && value >= start && value <= end),
          (error, count) => {
            assert.strictEqual(count, end - start + 1);
            done();
          });
    });

    it('creates flow of ascending sequential integers within a stepped range', done => {
      let start = 1, end = 9, step = 2;
      aeroflow.range(start, end, step).run(
        value =>
          assert.isTrue(value >= start && value <= end && value % step === 1),
        (error, count) => {
          assert.strictEqual(count, Math.round((end - start + 1) / step));
          done();
        });
    });

    it('creates flow of descending sequential integers within a range', done => {
      let start = 9, end = 1;
      aeroflow.range(start, end).run(
        value =>
          assert.isTrue(value <= start && value >= end),
        (error, count) => {
          assert.strictEqual(count, start - end + 1);
          done();
        });
    });

    it('creates flow of descending sequential integers within a stepped range', done => {
      let start = 9, end = 1, step = -2;
      aeroflow.range(start, end, step).run(
        value =>
          assert.isTrue(value <= start && value >= end && value % step === 1),
        (error, count) => {
          assert.strictEqual(count, Math.round((start - end + 1) / -step));
          done();
        });
    });
  });

  describe('repeat', () => {
    it('is static method', () =>
      assert.isFunction(aeroflow.repeat));

    it('creates flow emitting undefined values', done =>
      aeroflow.repeat().take(1).run(value => {
        assert.isUndefined(value);
        done();
      }));

    it('creates flow emitting values returned by repeater function until repeater returns false', done => {
      let values = [1, 3, 5], repeater = index => index < values.length && values[index];
      aeroflow.repeat(repeater).run(
        (value, index) =>
          assert.strictEqual(value, values[index]),
        (error, count) => {
          assert.strictEqual(count, values.length);
          done();
        });
    });
  });

  describe('skip', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.skip));

    it('creates flow emitting "done" signal only', done =>
      aeroflow(1, 2, 3, 4).skip().run(
        () =>
          assert.ok(false),
        done));

    it('creates flow skipping provided number of first values and emitting remaining values', done => {
      let values = [1, 2, 3, 4], skip = Math.floor(values.length / 2);
      aeroflow(values).skip(skip).run(
        (value, index) =>
          assert.strictEqual(value, values[skip + index]),
        (error, count) => {
          assert.strictEqual(count, values.length - skip);
          done();
        });
    });

    it('creates flow skipping provided number of last values and emitting remaining values', done => {
      let values = [1, 2, 3, 4], skip = Math.floor(values.length / 2);
      aeroflow(values).skip(-skip).run(
        (value, index) =>
          assert.strictEqual(value, values[index]),
        (error, count) => {
          assert.strictEqual(count, values.length - skip);
          done();
        });
    });

    it('creates flow skipping values while provided function returns true and emitting remaining values', done => {
      let values = [1, 2, 3, 4], skip = Math.floor(values.length / 2), limiter = (value, index) => index < skip;
      aeroflow(values).skip(limiter).run(
        (value, index) =>
          assert.strictEqual(value, values[skip + index]),
        (error, count) => {
          assert.strictEqual(count, values.length - skip);
          done();
        });
    });
  });

describe('take', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.take));

    it('creates flow emitting all values if no parameter provided', done => {
      let values = [1, 2, 3, 4];
      aeroflow(values).take().run(
        (value, index) =>
          assert.strictEqual(value, values[index]),
        (error, count) => {
          assert.strictEqual(count, values.length);
          done();
        });
    });

    it('creates flow emitting provided number of first values', done => {
      let values = [1, 2, 3, 4], take = Math.floor(values.length / 2);
      aeroflow(values).take(take).run(
        (value, index) =>
          assert.strictEqual(value, values[index]),
        (error, count) => {
          assert.strictEqual(count, take);
          done();
        });
    });

    it('creates flow emitting values while specified function returns true', done => {
      let values = [1, 2, 3, 4], take = Math.floor(values.length / 2), limiter = (value, index) => index < take;
      aeroflow(values).take(limiter).run(
        (value, index) =>
          assert.strictEqual(value, values[index]),
        (error, count) => {
          assert.strictEqual(count, take);
          done();
        });
    });
  });

  describe('tap', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.tap));

    it('intercepts each emitted value', done => {
      let invocations = 0, limit = 3;
      aeroflow.range().take(limit).tap((value, index) => {
        invocations++;
        assert.strictEqual(value, index);
      }).run(
        () => {},
        () => {
          assert.strictEqual(invocations, limit);
          done();
        });
    });
  });

  describe('toArray', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.toArray));

    it('creates flow emitting single array containing all values', done =>{
      let values = [1, 2, 3];
      aeroflow(...values).toArray().run(
        value => {
          assert.includeMembers(value, values);
          done();
        });
    });
  });

  describe('toMap', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.toMap));

    it('creates flow emiting single map containing all values', done => {
      let values = [1, 2, 3];
      aeroflow(values).toMap().run(
        value => {
          assert.typeOf(value, 'Map');
          assert.includeMembers(Array.from(value.keys()), values);
          assert.includeMembers(Array.from(value.values()), values);
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