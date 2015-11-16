'use strict';

const aeroflow = require('./aeroflow.es6')
    , assert = require('chai').assert
    , noop = () => {};

describe('aeroflow', () => {
  it('is a function',
    () => assert.isFunction(aeroflow));
  it('returns an object',
    () => assert.isObject(aeroflow()));
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
    () => {
      let flow = aeroflow('test');
      assert.strictEqual(aeroflow(flow), flow);
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
  it('creates flow from function returning promise immediately resolving to scalar value',
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
  it('creates flow from function returning promise immediately resolving to array',
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
  it('creates flow from function returning promise eventually resolving to scalar value',
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
  it('creates flow from function returning promise eventually resolving to array',
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

  describe('after', () => {
    it('is instance method',
      () => assert.isFunction(aeroflow.empty.after));
    it('runs flow only after referenced flow completes',
      done => {
        let completed = false
          , referenced = aeroflow(1).tap(
              () => completed = true)
          , onDone = () => {
              assert.isTrue(completed);
              done();
            }
          , onNext = noop
          ;
        aeroflow.empty.after(referenced).run(onNext, onDone);
      });
    it('runs flow only after referenced promise resolves',
      done => {
        let completed = false
          , referenced = new Promise(
              resolve => setTimeout(() => resolve(completed = true), 0))
          , onDone = () => {
              assert.isTrue(completed);
              done();
            }
          , onNext = noop;
        aeroflow.empty.after(referenced).run(onNext, onDone);
      });
  });

  describe('concat', () => {
    it('is instance method',
      () => assert.isFunction(aeroflow.empty.concat));
    it('concatenates several flows into one',
      done => {
        let count = 0
          , values = [1, 2]
          , onDone = () => {
              assert.strictEqual(count, values.length * 3);
              done();
            }
          , onNext = next => count++
          ;
        aeroflow(values).concat(values, values).run(onNext, onDone);
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
    it('is static object',
      () => assert.isObject(aeroflow.empty));
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
          , value = noop
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
        let count = 0
          , max = 10
          , min = 1
          , onNext = next => assert.isTrue(Number.isInteger(next) && next >= min && next < max)
          ;
        aeroflow.random(min, max).take(10).run(onNext, done);
    });
    it('creates flow of random decimals within a range',
      done => {
        let count = 0
          , max = 10.1
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
          , onNext = next => assert.isTrue(next >= start && next <= end)
          ;
        aeroflow.range(start, end).run(onNext, done);
    });
    it('creates flow of ascending sequential integers within a stepped range',
      done => {
        let count = 0
          , start = 1
          , end = 9
          , step = 2
          , onNext = next => assert.isTrue(next >= start && next <= end && next % step === 1)
          ;
        aeroflow.range(start, end, step).run(onNext, done);
    });
    it('creates flow of descending sequential integers within a range',
      done => {
        let count = 0
          , start = 9
          , end = 1
          , onNext = next => assert.isTrue(next <= start && next >= end)
          ;
        aeroflow.range(start, end).run(onNext, done);
    });
    it('creates flow of descending sequential integers within a stepped range',
      done => {
        let count = 0
          , start = 9
          , end = 1
          , step = -2
          , onNext = next => assert.isTrue(next <= start && next >= end && next % step === 1)
          ;
        aeroflow.range(start, end, step).run(onNext, done);
    });
  });

  describe('repeat', () => {
    it('is static method',
      () => assert.isFunction(aeroflow.repeat));
    it('creates flow of undefined values',
      done => aeroflow.repeat().take(3).run(next => assert.isUndefined(next), done));
    it('creates flow enumerating values emitted by repeater function until repeater returns false',
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

  describe('tap', () => {
    it('is instance method',
      () => assert.isFunction(aeroflow.empty.tap));
    it('intercepts flow values',
      done => {
        let count = 0
          , callback = value => assert.strictEqual(value, count++)
          ;
        aeroflow.range().take(3).tap(callback).run(noop, done);
      });
  });
});