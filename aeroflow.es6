/*
  aeroflow([1, 2, 3]).sum().dump().run()
  aeroflow.range(1, 10).skip(1).take(2).delay(500).dump().run()
  aeroflow.range(1, 10).delay(100).count().dump().run()
  aeroflow([1, 2, 3]).concat(aeroflow.repeat().delay(100).take(5)).dump().run()
  operators pending implementation:
    * buffer(count)
    * zip(thatFlow)
    * groupBy(keySelector, valueSelector)
    * scan(scanner, seed)
    * window(interval)
    * debounce(interval, mode)
    * throttle(interval)
    * at(index)
    * skip(-index) -> skipLast
    * skip(condition) -> skipWhile
    * take(-index) -> takeLast
    * take(condition) -> takeWhile
    * fork(selector, leftCallback, rightCallback)
    * merge(thatFlow)
    * after(interval/condition)
    * pause/resume
    * materialize
    * amb
    * avg, min, max
*/

'use strict';

const DISPOSER = Symbol('generator')
    , GENERATOR = Symbol('generator')
    , ITERATOR = Symbol.iterator
    , defineProperty = Object.defineProperty
    , floor = Math.floor
    , identity = value => value
    , isArray = value => Array.isArray(value)
    , isDate = value => value instanceof Date
    , isFunction = value => typeof value === 'function'
    , isInteger = Number.isInteger
    , isNothing = value => value == null
    , isNumber = value => typeof value === 'number' || value instanceof Number
    , isObject = value => typeof value === 'object' && value !== null
    , isPromise = value => value instanceof Promise
    , isSomething = value => value != null
    , isString = value => typeof value === 'string' || value instanceof String
    , maxInteger = Number.MAX_SAFE_INTEGER
    , noop = () => {}
    , now = Date.now
    , typeError = message => new TypeError(message)
    ;

class Aeroflow {
  constructor(generator, disposer) {
    defineProperty(this, GENERATOR, {value: generator});
    if (disposer) defineProperty(this, DISPOSER, {value: disposer});
  }
  /*
    aeroflow.repeat().take(3).concat(3).dump().run();
    aeroflow.repeat().take(3).concat(aeroflow.range(10, 12)).dump().run();
  */
  concat(that) {
    that = aeroflow(that);
    return new Aeroflow(() => {
      let end = false, iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => {
          next(value);
        },
        () => {
          if (end) done();
          else {
            end = true;
            iterator = that[GENERATOR]();
          }
        });
    });
  }
  /*
    aeroflow(['a', 'b', 'c']).count().dump().run();
  */
  count() {
    return this.reduce(count => count + 1, 0);
  }
  /*
    aeroflow([1, 2, 3]).delay(500).dump().run();
  */
  delay(interval) {
    return new Aeroflow(() => {
      let end = false, iterator = this[GENERATOR]();
      return (next, done) => new Promise(
        resolve => {
          if (!end) iterator(
            value => setTimeout(() => {
                next(value);
                resolve();
              }, interval),
            () => {
              end = true;
              setTimeout(() => {
                done();
                resolve();
              }, interval);
            });
        });
    });
  }
  /*
  Dumps 'next' and 'done' events of the current aeroflow
    to logger (console.log by default)
    with optiona prefix (empty string by default).
  Example:
    aeroflow.repeat().dump('a').take(10).dump('b', console.info.bind(console)).run();
  */
  dump(prefix, logger) {
    if (isFunction(prefix)) {
      logger = prefix;
      prefix = '';
    }
    else {
      if (isNothing(logger)) logger = console.log.bind(console);
      else if (!isFunction(logger)) throw typeError('Argument "logger" must be a function.');
      prefix = isNothing(prefix) ? '' : prefix + ' ';
    }
    return new Aeroflow(() => {
      let iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => {
          logger(prefix + 'next', value);
          next(value);
        },
        () => {
          logger(prefix + 'done');
          done();
        });
    });
  }
  every(predicate) {
    if (!isFunction(predicate)) predicate = isSomething;
    return new Aeroflow(() => {
      let end = false, iterator = this[GENERATOR]();
      return (next, done) => {
        if (!end) iterator(
          value => {
            if (!predicate(value)) {
              end = true;
              next(false);
              done();
            }
          },
          () => {
            if (!end) {
              next(true);
              done();
            }
          });
      }
    });
  }
  filter(predicate) {
    if (!isFunction(predicate)) predicate = isSomething;
    return new Aeroflow(() => {
      let index = 0, iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => {
          if (predicate(value, index++)) next(value);
        },
        done);
    });
  }
  first() {
    return new Aeroflow(() => {
      let end = false, iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => {
          if (!end) {
            end = true;
            next(value);
            done();
          }
        },
        () => {
          if (!end) done();
        });
    });
  }
  join(separator) {
    if (!isString(separator)) separator = ',';
    return this.reduce(
      (result, value) => result.length ? result + separator + value : value,
      '');
  }
  last() {
    return new Aeroflow(() => {
      let iterator = this[GENERATOR](), last;
      return (next, done) => iterator(
        value => {
          last = value;
        },
        () => {
          next(last);
          done();
        });
    });
  }
  map(transform) {
    if (isNothing(transform)) transform = identity;
    else if (!isFunction(transform)) throw typeError('Argument "transform" must be a function.');
    return new Aeroflow(() => {
      let index = 0, iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => next(transform(value, index++)),
        done);
    });
  }
  /*
    aeroflow(['a', 'b', 'c']).max().dump().run();
  */
  max(valueSelector) {
    return this.reduce((max, value) => value > max ? value : max);
  }
  /*
    var f = aeroflow.repeat(() => new Date).take(3).memoize(5000).delay(1000).dump();
    f.run(null, () => f.run(null, () => f.run())); 
  */
  memoize(expires) {
    if (isNothing(expires)) expires = 9e9;
    else if (isDate(expires)) expires = expires.valueOf();
    else if (isNaN(expires = +expires) || expires < 0) throw typeError('Argument "expires" must be a date or a positive number.');
    let cache;
    return new Aeroflow(() => {
      let iterator = this[GENERATOR](), values;
      if (cache) {
        values = cache;
        let index = -1;
        return (next, done) => ++index < values.length
          ? next(values[index])
          : done();
      }
      else {
        values = cache = [];
        setTimeout(() => cache = null, expires);
        return (next, done) => iterator(
          value => {
            values.push(value);
            next(value);
          },
          done);
      }
    });
  }
  /*
    aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
  */
  mean() {
    let array = this.toArray();
    return new Aeroflow(() => {
      let iterator = array[GENERATOR]();
      return (next, done) => iterator(
        values => {
          if (values.length) {
            values.sort();
            next(values[floor(values.length / 2)]);
          }
          else done();
        },
        done);
    });
  }
  /*
    aeroflow([3, 1, 5]).min().dump().run();
  */
  min(valueSelector) {
    return this.reduce((min, value) => value < min ? value : min);
  }
  /*
    aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
    aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
  */
  reduce(reducer, seed) {
    if (!isFunction(reducer)) reducer = noop;
    let seeded = arguments.length > 1;
    return new Aeroflow(() => {
      let index = 0, inited = false, iterator = this[GENERATOR](), result;
      if (seeded) {
        result = seed;
        inited = true;
      }
      else index = 1;
      return (next, done) => iterator(
        value => {
          if (inited) result = reducer(result, value, index++);
          else {
            result = value;
            inited = true;
          }
        },
        () => {
          if (inited) next(result);
          done();
        });
    });
  }
  /*
    Asynchronously runs current aeroflow.
      Initiates source generator to start produce values.
      Applies attached operators chain to each value.
      Every produced result is being passed to the optional "onNext" callback.
      After aeroflow completes, optional "onDone" callback is invoked.
      If no callbacks are specified, flows runs for its side-effects.
    Example:
      aeroflow(1).run(v => console.log('next', v), () => console.log('done'));
  */
  run(onNext, onDone) {
    if (isNothing(onNext)) onNext = noop;
    else if (!isFunction(onNext)) throw typeError('Argument "onNext" must be a function.');
    if (isNothing(onDone)) onDone = noop;
    else if (!isFunction(onDone)) throw typeError('Argument "onDone" must be a function.');
    let end = false, iterator = this[GENERATOR]();
    setTimeout(proceed, 0);
    return this;
    function proceed() {
      while (!end) {
        let result = iterator(
          onNext,
          () => {
            end = true;
            onDone();
          });
        if (isPromise(result)) {
          result.then(proceed);
          break;
        }
      }
    }
  }
  skip(count) {
    return new Aeroflow(() => {
      let counter = +count, iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => {
          if (--counter < 0) next(value);
        },
        done);
    });
  }
  some(predicate) {
    if (!isFunction(predicate)) predicate = isSomething;
    return new Aeroflow(() => {
      let end = false, iterator = this[GENERATOR]();
      return (next, done) => {
        if (!end) iterator(
          value => {
            if (predicate(value)) {
              end = true;
              next(true);
              done();
            }
          },
          () => {
            if (!end) {
              next(false);
              done();
            }
          });
      }
    });
  }
  /*
    aeroflow([1, 2, 3]).sum().dump().run();
  */
  sum(valueSelector) {
    return this.reduce((sum, value) => sum + value, 0);
  }
  take(count) {
    return new Aeroflow(() => {
      let counter = +count, iterator = this[GENERATOR]();
      return (next, done) => counter > 0
        ? iterator(
          value => counter-- > 0
            ? next(value)
            : done(),
          done)
        : done();
    });
  }
  tap(callback) {
    if (!isFunction(callback)) callback = noop;
    return new Aeroflow(() => {
      let index = 0, iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => {
          callback(value, index++);
          next(value);
        },
        done);
    });
  }
  /*
    aeroflow.repeat().take(3).delay(10).timedelta().dump().run();
  */
  timedelta() {
    return new Aeroflow(() => {
      let iterator = this[GENERATOR](), past = now();
      return (next, done) => iterator(
        value => {
          let current = now();
          next({timedelta: current - past, value});
          past = current;
        },
        done);
    });
  }
  /*
    aeroflow.repeat().take(3).delay(10).timestamp().dump().run();
  */
  timestamp() {
    return new Aeroflow(() => {
      let iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => next({timestamp: now(), value}),
        done);
    });
  }
  /*
    aeroflow.repeat().take(3).toArray().dump().run();
  */
  toArray() {
    return new Aeroflow(() => {
      let array = [], iterator = this[GENERATOR]();
      return (next, done) => iterator(
        value => array.push(value),
        () => {
          next(array);
          done();
        });
    });
  }
  /*
    aeroflow.repeat().take(3).toSet(v => 'key#' + v).dump().run();
  */
  toSet(keySelector) {
    if (isNothing(keySelector)) keySelector = identity;
    else if (!isFunction(keySelector)) throw typeError('Argument "keySelector" must be a function.');
    return new Aeroflow(() => {
      let iterator = this[GENERATOR](), set = new Set;
      return (next, done) => iterator(
        value => set.add(keySelector(value)),
        () => {
          next(set);
          done();
        });
    });
  }
  /*
    aeroflow.repeat().take(3).toMap(v => 'key#' + v, v => v * 10).dump().run();
  */
  toMap(keySelector, valueSelector) {
    if (isNothing(keySelector)) keySelector = identity;
    else if (!isFunction(keySelector)) throw typeError('Argument "keySelector" must be a function.');
    if (isNothing(valueSelector)) valueSelector = identity;
    else if (!isFunction(valueSelector)) throw typeError('Argument "valueSelector" must be a function.');
    return new Aeroflow(() => {
      let iterator = this[GENERATOR](), map = new Map;
      return (next, done) => iterator(
        value => map.set(keySelector(value), valueSelector(value)),
        () => {
          next(map);
          done();
        });
    });
  }
  /*
    aeroflow([1, 2, 2, 1]).unique().dump().run();
    todo: custom comparer support
  */
  unique() {
    return new Aeroflow(() => {
      let iterator = this[GENERATOR](), values = new Set;
      return (next, done) => iterator(
        value => {
          let size = values.size;
          values.add(value);
          if (size < values.size) next(value);
        },
        done);
    });
  }
}
/*
  aeroflow('test').dump().run();
  aeroflow(aeroflow('test')).dump().run();
  aeroflow([1, 2]).dump().run();
  aeroflow(new Map([['a', 1], ['b', 2]])).dump().run();
  aeroflow(new Set(['a', 'b'])).dump().run();
  aeroflow(() => 'test').dump().run();
  aeroflow(Promise.resolve('test')).dump().run();
  aeroflow(() => new Promise(resolve => setTimeout(() => resolve('test'), 100))).dump().run();
*/
function aeroflow(source) {
  if (source instanceof Aeroflow) return source;
  if (isArray(source)) return new Aeroflow(() => {
    let index = -1;
    return (next, done) => ++index < source.length 
      ? next(source[index])
      : done();
  });
  if (isFunction(source)) return new Aeroflow(() => (next, done) => {
    let result = source();
    if (isPromise(result)) return result.then(
      value => {
        next(value);
        done();
      },
      error => {
        done();
        throw error;
      });
    next(result);
    done();
  });
  if (isPromise(source)) return new Aeroflow(() => (next, done) => {
    return source.then(
      value => {
        next(value);
        done();
      },
      error => {
        done();
        throw error;
      });
  });
  if (isObject(source) && ITERATOR in source) return new Aeroflow(() => {
    let iterator = source[ITERATOR]();
    return (next, done) => {
      let result = iterator.next();
      if (result.done) done();
      else next(result.value);
    }
  });
  return aeroflow.just(source);
}
/*
  aeroflow.empty.dump().run();
*/
aeroflow.empty = new Aeroflow(() => (next, done) => done());
/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
aeroflow.expand = (expander, seed) => {
  if (isNothing(expander)) expander = identity;
  else if (!isFunction(expander)) throw typeError('Argument "expander" must be a function.')
  return new Aeroflow(() => {
    let value = seed;
    return (next, done) => next(value = expander(value));
  });
};
/*
  aeroflow.just([1, 2]).dump().run();
  aeroflow.just(() => 'test').dump().run();
*/
aeroflow.just = value => new Aeroflow(() => (next, done) => {
  next(value);
  done();
});
/*
  aeroflow.random().take(3).dump().run();
  aeroflow.random(0.1).take(3).dump().run();
  aeroflow.random(null, 0.1).take(3).dump().run();
  aeroflow.random(1, 9).take(3).dump().run();
*/
aeroflow.random = (min, max) => {
  if (isNothing(min)) {
    if (isNothing(max)) return new Aeroflow(() => (next, done) => next(Math.random()));
    else if (isNaN(max = +max)) throw typeError('Argument "max" must be a number');
    min = 0;
  }
  if (isNothing(max)) max = maxInteger;
  if (min >= max) throw new RangeError('Argument "min" must be greater then "max".');
  max -= min;
  let round = isInteger(min) && isInteger(max)
    ? floor
    : identity;
  return new Aeroflow(() => (next, done) => next(round(min + max * Math.random())));
};
/*
  aeroflow.range().dump().run();
  aeroflow.range(-3).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, 2).dump().run();
*/
aeroflow.range = (start, end, step) => {
  if (isNothing(step)) step = 1;
  else if (isNaN(step = +step) || step < 1) throw typeError('Argument "step" must be a positive number.');
  if (isNothing(start)) start = 0;
  else if (isNaN(start = +start)) throw typeError('Argument "start" must be a number.');
  if (isNothing(end)) end = 0;
  else if (isNaN(end = +end)) throw typeError('Argument "end" must be a number.');
  if (start <= end) return new Aeroflow(() => {
    let i = start - step;
    end -= step;
    return (next, done) => i <= end
      ? next(i += step)
      : done();
  });
  if (start >= end) return new Aeroflow(() => {
    let i = start + step;
    end += step;
    return (next, done) => i >= end
      ? next(i -= step)
      : done();
  });
  return aeroflow.empty;
};
/*
  aeroflow.repeat().take(3).dump().run();
  aeroflow.repeat(() => new Date).delay(1000).take(3).dump().run();
*/
aeroflow.repeat = (repeater) => {
  if (isNothing(repeater)) return new Aeroflow(() => {
    let index = 0;
    return (next, done) => next(index++);
  });
  if (isFunction(repeater)) return new Aeroflow(() => (next, done) => {
    let value = repeater();
    if (value === false) done();
    else if (isPromise(value)) value.then(next, done);
    else next(value);
  });
  throw typeError('Argument "repeater" must be a function.');
};

module.exports = aeroflow;