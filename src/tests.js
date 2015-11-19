'use strict';

if (typeof require === 'function') {
  global.aeroflow = require('./aeroflow.js');
  global.assert = require('chai').assert;
}

describe('aeroflow', () => {
  it('is a function',
    () => assert.isFunction(aeroflow));
  it('returns instance of Aeroflow class',
    () => assert.typeOf(aeroflow(), 'Aeroflow'));
  it('creates flow from scalar value',
    done => {
      let count = 0
        , value = 'test'
        , onDone = () => {
            assert.strictEqual(count, 1);
            done();
          }
        , onNext = next => {
            count++;
            assert.strictEqual(next, value);
          }
        ;
      aeroflow(value).run(onNext, onDone);
    });
  it('does not wrap flow twice',
    done => {
      let count = 0
        , value = 'test'
        , onDone = () => {
            assert.strictEqual(count, 1);
            done();
          }
        , onNext = next => {
            count++;
            assert.strictEqual(next, value);
          }
        ;
      aeroflow(aeroflow(value)).run(onNext, onDone);
    });
  it('creates flow from array',
    done => {
      let count = 0
        , values = ['a', 'b']
        , onDone = () => {
            assert.strictEqual(count, values.length);
            done();
          }
        , onNext = next => assert.strictEqual(next, values[count++])
        ;
      aeroflow(values).run(onNext, onDone);
    });
  it('creates flow from map',
    done => {
      let count = 0
        , values = [['a', 1], ['b', 2]]
        , onDone = () => {
            assert.strictEqual(count, values.length);
            done();
          }
        , onNext = next => assert.includeMembers(next, values[count++])
        ;
      aeroflow(new Map(values)).run(onNext, onDone);
    });
  it('creates flow from set',
    done => {
      let count = 0
        , values = ['a', 'b']
        , onDone = () => {
            assert.strictEqual(count, values.length);
            done();
          }
        , onNext = next => assert.strictEqual(next, values[count++])
        ;
      aeroflow(new Set(values)).run(onNext, onDone);
    });
  it('creates flow from function returning scalar value',
    done => {
      let count = 0
        , value = 'test'
        , onDone = () => {
            assert.strictEqual(count, 1);
            done();
          }
        , onNext = next => {
            count++;
            assert.strictEqual(next, value);
          }
        ;
      aeroflow(() => value).run(onNext, onDone);
    });
  it('creates flow from function returning array',
    done => {
      let count = 0
        , values = ['a', 'b']
        , onDone = () => {
            assert.strictEqual(count, values.length);
            done();
          }
        , onNext = next => assert.strictEqual(next, values[count++])
        ;
      aeroflow(() => values).run(onNext, onDone);
    });
  it('creates flow from promise',
    done => {
      let count = 0
        , value = 'test'
        , onDone = () => {
            assert.strictEqual(count, 1);
            done();
          }
        , onNext = next => {
            count++;
            assert.strictEqual(next, value);
          }
        ;
      aeroflow(Promise.resolve(value)).run(onNext, onDone);
    });
  it('creates flow from function returning promise resolving to scalar value immediately',
    done => {
      let count = 0
        , value = 'test'
        , onDone = () => {
            assert.strictEqual(count, 1);
            done();
          }
        , onNext = next => {
            count++;
            assert.strictEqual(next, value);
          }
        ;
      aeroflow(() => Promise.resolve(value)).run(onNext, onDone);
    });
  it('creates flow from function returning promise resolving to array immediately',
    done => {
      let count = 0
        , values = ['a', 'b']
        , generator = () =>
            Promise.resolve(values)
        , onDone = () => {
            assert.strictEqual(count, values.length);
            done();
          }
        , onNext = next => assert.strictEqual(next, values[count++])
        ;
      aeroflow(generator).run(onNext, onDone);
    });
  it('creates flow from function returning promise resolving to scalar value eventually',
    done => {
      let count = 0
        , value = 'test'
        , generator = () => new Promise(
            resolve => setTimeout(() => resolve(value), 10))
        , onDone = () => {
            assert.strictEqual(count, 1);
            done();
          }
        , onNext = next => {
            count++;
            assert.strictEqual(next, value);
          }
        ;
      aeroflow(generator).run(onNext, onDone);
    });
  it('creates flow from function returning promise resolving to array eventually',
    done => {
      let count = 0
        , values = ['a', 'b']
        , generator = () => new Promise(
            resolve => setTimeout(() => resolve(values), 10))
        , onDone = () => {
            assert.strictEqual(count, values.length);
            done();
          }
        , onNext = next => assert.strictEqual(next, values[count++])
        ;
      aeroflow(generator).run(onNext, onDone);
    });

  describe('append', () => {
    it('is instance method',
      () => assert.isFunction(aeroflow.empty.append));
    it('append several values to the flow',
      done => {
        let count = 0
          , values = [1, 2, 3]
          , onDone = () => {
              assert.strictEqual(count, values.length);
              done();
            }
          , onNext = next => count++
          ;
        aeroflow(1).append(2, 3).run(onNext, onDone);
      });
    it('append several arrays to the flow',
      done => {
        let count = 0
          , times = 3
          , values = [1, 2]
          , onDone = () => {
              assert.strictEqual(count, values.length * times);
              done();
            }
          , onNext = next => count++
          ;
        aeroflow(values).append(...Array(times - 1).fill(values)).run(onNext, onDone);
      });
  });

  describe('count', () => {
    it('is instance method',
      () => assert.isFunction(aeroflow.empty.count));
    it('returns zero for empty flow',
      done => {
        let count
          , onDone = () => {
              assert.strictEqual(count, 0);
              done();
            }
          , onNext = next => count = next
          ;
        aeroflow.empty.count().run(onNext, onDone);
      });
    it('returns valid result for non-empty flow',
      done => {
        let count
          , values = Array(3)
          , onDone = () => {
              assert.strictEqual(count, values.length);
              done();
            }
          , onNext = next => count = next
          ;
        aeroflow(values).count().run(onNext, onDone);
      });
  });

  describe('empty', () => {
    it('is static property',
      () => assert.typeOf(aeroflow.empty, 'Aeroflow'));
    it('returns empty flow',
      done => {
        let count = 0
          , onDone = () => {
              assert.strictEqual(count, 0);
              done();
            }
          , onNext = next => count++
          ;
        aeroflow.empty.run(onNext, onDone);
    });
  });

  describe('expand', () => {
    it('is static method',
      () => assert.isFunction(aeroflow.expand));
    it('creates flow geometrically progressing integers',
      done => {
        let count = 0
          , expander = value => value * 2
          , seed = 1
          , values = [2, 4, 8]
          , onDone = () => {
              assert.strictEqual(count, values.length);
              done();
            }
          , onNext = next => assert.strictEqual(next, values[count++])
          ;
        aeroflow.expand(expander, seed).take(values.length).run(onNext, onDone);
    });
  });

  describe('just', () => {
    it('is static method',
      () => assert.isFunction(aeroflow.just));
    it('creates flow of single array value',
      done => {
        let count = 0
          , value = [2, 4, 8]
          , onDone = () => {
              assert.strictEqual(count, 1);
              done();
            }
          , onNext = next => {
              count++;
              assert.strictEqual(next, value);
            }
          ;
        aeroflow.just(value).run(onNext, onDone);
    });
    it('creates flow of single function value',
      done => {
        let count = 0
          , value = () => {}
          , onDone = () => {
              assert.strictEqual(count, 1);
              done();
            }
          , onNext = next => {
              count++;
              assert.strictEqual(next, value);
            }
          ;
        aeroflow.just(value).run(onNext, onDone);
    });
    it('creates flow of single promise value',
      done => {
        let count = 0
          , value = Promise.resolve(1)
          , onDone = () => {
              assert.strictEqual(count, 1);
              done();
            }
          , onNext = next => {
              count++;
              assert.strictEqual(next, value);
            }
          ;
        aeroflow.just(value).run(onNext, onDone);
    });
  });

  describe('max', () => {
    it('is instance method',
      () => assert.isFunction(aeroflow.empty.max));
    it('returns no results for empty flow',
      done => {
        let empty = true
          , onDone = () => {
              assert.isTrue(empty);
              done();
            }
          , onNext = next => empty = false
          ;
        aeroflow.empty.max().run(onNext, onDone);
      });
    it('returns valid result for non-empty flow',
      done => {
        let result
          , max = 9e9
          , values = [1, max, 2]
          , onDone = () => {
              assert.strictEqual(result, max);
              done();
            }
          , onNext = next => result = next
          ;
        aeroflow(values).max().run(onNext, onDone);
      });
  });

  describe('random', () => {
    it('is static method',
      () => assert.isFunction(aeroflow.random));
    it('creates flow of random integers within a range',
      done => {
        let max = 10
          , min = 1
          , onNext = next => assert.isTrue(Number.isInteger(next) && next >= min && next < max)
          ;
        aeroflow.random(min, max).take(10).run(onNext, done);
    });
    it('creates flow of random decimals within a range',
      done => {
        let max = 10.1
          , min = 1.1
          , onNext = next => assert.isTrue(!Number.isInteger(next) && next >= min && next < max)
          ;
        aeroflow.random(min, max).take(10).run(onNext, done);
    });
  });

  describe('range', () => {
    it('is static method',
      () => assert.isFunction(aeroflow.range));
    it('creates flow of ascending sequential integers starting from 0',
      done => {
        let count = 0
          , onNext = next => assert.strictEqual(next, count++)
          ;
        aeroflow.range().take(10).run(onNext, done);
    });
    it('creates flow of ascending sequential integers within a range',
      done => {
        let count = 0
          , start = 1
          , end = 9
          , onDone = () => {
              assert.strictEqual(count, end - start + 1);
              done();
            }
          , onNext = next => {
            count++;
              assert.isTrue(next >= start && next <= end);
            }
          ;
        aeroflow.range(start, end).run(onNext, onDone);
    });
    it('creates flow of ascending sequential integers within a stepped range',
      done => {
        let count = 0
          , start = 1
          , end = 9
          , step = 2
          , onDone = () => {
              assert.strictEqual(count, Math.round((end - start + 1) / step));
              done();
            }
          , onNext = next => {
              count++;
              assert.isTrue(next >= start && next <= end && next % step === 1);
            }
          ;
        aeroflow.range(start, end, step).run(onNext, onDone);
    });
    it('creates flow of descending sequential integers within a range',
      done => {
        let count = 0
          , start = 9
          , end = 1
          , onDone = () => {
              assert.strictEqual(count, start - end + 1);
              done();
            }
          , onNext = next => {
              count++;
              assert.isTrue(next <= start && next >= end);
            }
          ;
        aeroflow.range(start, end).run(onNext, onDone);
    });
    it('creates flow of descending sequential integers within a stepped range',
      done => {
        let count = 0
          , start = 9
          , end = 1
          , step = -2
          , onDone = () => {
              assert.strictEqual(count, Math.round((start - end + 1) / -step));
              done();
            }
          , onNext = next => {
              count++;
              assert.isTrue(next <= start && next >= end && next % step === 1);
            }
          ;
        aeroflow.range(start, end, step).run(onNext, onDone);
    });
  });

  describe('repeat', () => {
    it('is static method',
      () => assert.isFunction(aeroflow.repeat));
    it('creates flow emitting undefined values',
      done => aeroflow.repeat().take(1).run(next => assert.isUndefined(next), done));
    it('creates flow emitting values returned by repeater function until repeater returns false',
      done => {
        let count = 0
          , limit = 5
          , repeater = () => count < limit ? count : false
          , onDone = () => {
              assert.strictEqual(count, limit);
              done();
            }
          , onNext = next => assert.strictEqual(next, count++)
          ;
        aeroflow.repeat(repeater).run(onNext, onDone);
    });
  });

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

  describe('skip', () => {
    it('is instance method',
      () => assert.isFunction(aeroflow.empty.skip));
    it('skips all values and emits "done" signal only',
      done => {
        let values = [1, 2, 3, 4]
          , empty = true
          , onDone = () => {
              assert.isTrue(empty);
              done();
            }
          , onNext = () => empty = false
          ;
        aeroflow(values).skip().run(onNext, onDone);
      });
    it('skips specified number of values emits remaining values',
      done => {
        let values = [1, 2, 3, 4]
          , results = []
          , skip = 2
          , onDone = () => {
              assert.strictEqual(results.length, values.length - skip);
              assert.includeMembers(results, values.slice(skip));
              done();
            }
          , onNext = value => results.push(value)
          ;
        aeroflow(values).skip(skip).run(onNext, onDone);
      });
    it('skips while specified function returns true emits remaining values',
      done => {
        let values = [1, 2, 3, 4]
          , results = []
          , skip = 2
          , limiter = (value, index) => index < skip
          , onDone = () => {
              assert.strictEqual(results.length, values.length - skip);
              assert.includeMembers(results, values.slice(skip));
              done();
            }
          , onNext = value => results.push(value)
          ;
        aeroflow(values).skip(limiter).run(onNext, onDone);
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
    it('is instance method',
      () => assert.isFunction(aeroflow.empty.toMap));
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
});