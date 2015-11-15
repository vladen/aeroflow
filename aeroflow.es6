/*
  todo:
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
    * amb
    * avg
*/

'use strict';

const
  GENERATOR = Symbol('generator')
, ITERATOR = Symbol.iterator
, PARAMETERS = Symbol('parameters')
, defineProperty = Object.defineProperty
, defineProperties = Object.defineProperties
, floor = Math.floor
, identity = value => value
, isArray = value => Array.isArray(value)
, isDate = value => value instanceof Date
, isError = value => value instanceof Error
, isFunction = value => typeof value === 'function'
, isInteger = Number.isInteger
, isNothing = value => value == null
, isNumber = value => typeof value === 'number' || value instanceof Number
, isObject = value => typeof value === 'object' && value !== null
, isPromise = value => value instanceof Promise
, isRegExp = value => value instanceof RegExp
, isSomething = value => value != null
, isString = value => typeof value === 'string' || value instanceof String
, maxInteger = Number.MAX_SAFE_INTEGER
, noop = () => {}
, now = Date.now
;

class Aeroflow {
  constructor(generator) {
    defineProperty(this, GENERATOR, {value: generator});
  }
  /*
    aeroflow.repeat().take(3).concat(3).dump().run();
    aeroflow.repeat().take(3).concat(aeroflow.range(10, 12)).dump().run();
  */
  concat(...flows) {
    let queue = [this, ...flows];
    return new Aeroflow((next, done, context) => {
      let proceed = () => queue.length
          ? aeroflow(queue.shift())[GENERATOR](next, proceed, context)
          : done();
    });
  }
  /*
    aeroflow(['a', 'b', 'c']).count().dump().run();
  */
  count() {
    return this.reduce(result => result + 1, 0);
  }
  /*
    aeroflow([1, 2, 3]).delay(500).dump().run();
  */
  delay(condition) {
    let delayer = isFunction(condition)
      ? condition
      : () => condition;
    return new Aeroflow((next, done, context) => {
      let completition = Date.now(), index = 0;
      this[GENERATOR](
        value => {
          let delay = +delayer(value, index++, context.data);
          if (isNaN(delay)) delay = 0;
          let estimation = Date.now() + delay;
          if (completition < estimation) completition = estimation;
          setTimeout(() => next(value), current);
        },
        error => setTimeout(() => done(error), Math.max(completition - Date.now(), 0)),
        context);
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
      if (!isFunction(logger)) logger = console.log.bind(console);
      prefix = isNothing(prefix) ? '' : prefix + ' ';
    }
    return new Aeroflow((next, done, context) => this[GENERATOR](
      value => {
        logger(prefix + 'next', value);
        next(value);
      },
      error => {
        logger(prefix + 'done', error);
        done(error);
      },
      context));
  }
  every(predicate) {
    let tester = toTester(predicate);
    return new Aeroflow((next, done, context) => {
      let empty = true, result = true;
      this[GENERATOR](
        value => {
          empty = false;
          if (!tester(value)) {
            result = false;
            context(false);
          }
        },
        error => {
          next(result && !empty);
          done(error);
        },
        context);
    });
  }
  filter(predicate) {
    if (!isFunction(predicate)) predicate = isSomething;
    return new Aeroflow((next, done, context) => {
      let index = 0;
      this[GENERATOR](
        value => predicate(value, index++) ? next(value) : false,
        done,
        context);
    });
  }
  first() {
    return new Aeroflow((next, done, context) => this[GENERATOR](
      value => {
        next(value);
        context(false);
      },
      done,
      context));
  }
  join(separator) {
    if (isNothing(separator)) separator = ',';
    else if (!isString(separator)) separator = '' + separator;
    return this.reduce(
      (result, value) => result.length ? result + separator + value : value,
      '');
  }
  last() {
    return new Aeroflow((next, done, context) => {
      let empty = true, result;
      this[GENERATOR](
        value => {
          empty = false;
          result = value;
        },
        error => {
          if (!empty) next(result);
          done(error);
        },
        context);
    });
  }
  map(condition) {
    let transformer = isFunction(condition)
      ? condition
      : identity;
    return new Aeroflow((next, done, context) => {
      let index = 0;
      this[GENERATOR](
        value => next(transformer(value, index++)),
        done,
        context);
    });
  }
  /*
    aeroflow(['a', 'b', 'c']).max().dump().run();
  */
  max() {
    return this.reduce((max, value) => value > max ? value : max);
  }
  /*
    var f = aeroflow.repeat(() => new Date).take(3).memoize(5000).delay(1000).dump();
    f.run(null, () => f.run(null, () => f.run())); 
  */
  memoize(condition) {
    let cache, expirator = isFunction(condition)
      ? condition
      : isNumber(condition)
        ? () => condition
        : () => maxInteger;
    return new Aeroflow((next, done, context) => {
      if (cache) {
        cache.forEach(next);
        done();
        return;
      }
      let cache = [];
      this[GENERATOR](
        value => {
          cache.push(value);
          next(value);
        },
        error => {
          setTimeout(() => cache = null, expirator(context.data));
          done(error);
        },
        context);
    });
  }
  /*
    aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
  */
  mean() {
    let array = this.toArray();
    return new Aeroflow((next, done, context) => array[GENERATOR](
      values => {
        if (values.length) {
          values.sort();
          next(values[floor(values.length / 2)]);
        }
      },
      done,
      context));
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
  reduce(callback, seed) {
    let reducer = isFunction(callback)
      ? callback
      : identity;
    return new Aeroflow((next, done, context) => {
      let empty = true, index = 0, result;
      if (isSomething(seed)) {
        empty = false;
        result = seed;
      }
      this[GENERATOR](
        value => {
          if (empty) {
            empty = false;
            index++;
            result = value;
          }
          else result = reducer(result, value, index++, context.data);
        },
        error => {
          if (!empty) next(result);
          done(error);
        },
        context);
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
  run(next, done, data) {
    let active = true, callbacks = [], context = value => {
      if (value !== undefined) {
        if (value === false) active = false;
        else if (isFunction(value)) active ? callback.push(value) : value();
      }
      return active;
    };
    let nextCallback = toCallback(next), doneCallback = isFunction(done);
    context.data = data;
    setTimeout(
      () => this[GENERATOR](
        nextCallback,
        error => {
          active = false;
          callbacks.forEach(callback => callback());
          doneCallback(error);
        },
        context),
      0);
    return this;
  }
  skip(condition) {
    let limiter = toLimiter(condition);
    return new Aeroflow((next, done, context) => {
      let index = 0, limited = true;
      this[GENERATOR](
        value => {
          if (limited && !limiter(value, index++, context.data)) limited = false;
          if (!limited) next(value);
        },
        done,
        context);
    });
  }
  some(condition) {
    let tester = toTester(condition);
    return new Aeroflow((next, done, context) => {
      let result = false;
      this[GENERATOR](
        value => {
          if (tester(value)) {
            result = true;
            context(false);
          }
        },
        error => {
          next(result);
          done(error);
        },
        context);
    });
  }
  /*
    aeroflow([1, 2, 3]).sum().dump().run();
  */
  sum() {
    return this.reduce((result, value) => result + value, 0);
  }
  take(condition) {
    let limiter = toLimiter(condition);
    return new Aeroflow((next, done, context) => {
      let index = 0;
      this[GENERATOR](
        value => limiter(value, index++, context.data)
          ? next(value)
          : context(false),
        done,
        context);
    });
  }
  tap(callback) {
    return isFunction(callback)
      ? new Aeroflow((next, done, context) => {
        let index = 0;
        this[GENERATOR](
          value => {
            callback(value, index++, context.data);
            next(value);
          },
          done,
          context);
      })
      : this;
  }
  /*
    aeroflow.repeat().take(3).delay(10).timedelta().dump().run();
  */
  timedelta() {
    return new Aeroflow((next, done, context) => {
      let past = now();
      this[GENERATOR](
        value => {
          let current = now();
          next({ timedelta: current - past, value });
          past = current;
        },
        done,
        context);
    });
  }
  /*
    aeroflow.repeat().take(3).delay(10).timestamp().dump().run();
  */
  timestamp() {
    return new Aeroflow((next, done, context) => this[GENERATOR](
      value => next({ timestamp: now(), value }),
      done,
      context));
  }
  /*
    aeroflow.repeat().take(3).toArray().dump().run();
  */
  toArray(values) {
    let selector = toSelector(values);
    return new Aeroflow((next, done, context) => {
      let index = 0, result = [];
      this[GENERATOR](
        value => result.push(selector(value, index++, context.data)),
        error => {
          next(result);
          done(error);
        },
        context);
    });
  }
  /*
    aeroflow.repeat().take(3).toSet(v => 'key#' + v).dump().run();
  */
  toSet(keys) {
    let selector = toSelector(keys);
    return new Aeroflow((next, done, context) => {
      let index = 0, result = new Set;
      this[GENERATOR](
        value => result.add(selector(value, index++, context.data)),
        error => {
          next(result);
          done(error);
        },
        context);
    });
  }
  /*
    aeroflow.repeat().take(3).toMap(v => 'key#' + v, v => v * 10).dump().run();
  */
  toMap(keys, values) {
    let keySelector = toSelector(keys), valueSelector = toSelector(values);
    return new Aeroflow((next, done, context) => {
      let index = 0, result = new Map;
      this[GENERATOR](
        value => result.set(
          keySelector(value, index, context.data),
          valueSelector(value, index++, context.data)),
        error => {
          next(result);
          done(error);
        },
        context);
    });
  }
  /*
    aeroflow([1, 2, 2, 1]).unique().dump().run();
    todo: custom comparer support
  */
  unique() {
    return new Aeroflow((next, done, context) => {
      let values = new Set;
      this[GENERATOR](
        value => {
          let size = values.size;
          values.add(value);
          if (size < values.size) next(value);
        },
        done,
        context);
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
  if (isArray(source)) return new Aeroflow((next, done, context) => {
    let index = -1;
    while (context.busy && ++index < source.length) next(source[index]);
    done();
  });
  if (isFunction(source)) return new Aeroflow((next, done, context) => {
    let result = source();
    if (isPromise(result)) result.then(
      value => aeroflow(value)[GENERATOR](next, done, context),
      error => {
        done(error);
        throwError(error);
      });
    else {
      next(result);
      done();
    }
  });
  if (isPromise(source)) return new Aeroflow((next, done, context) => source.then(
    value => aeroflow(value)[GENERATOR](next, done, context),
    error => {
      done(error);
      throwError(error);
    }));
  if (isObject(source) && ITERATOR in source) return new Aeroflow((next, done, context) => {
    let iterator = source[ITERATOR]();
    while (context()) {
      let result = iterator.next();
      if (result.done) break;
      else next(result.value);
    }
    done();
  });
  return aeroflow.just(source);
}
/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
function expand(expander, seed) {
  if (isNothing(expander)) expander = identity;
  else if (!isFunction(expander)) throwError('Argument "expander" must be a function.')
  return new Aeroflow((next, done, context) => {
    let index = 0, value = seed;
    while (context()) next(value = expander(value, index++, context.data));
    done();
  });
}
/*
  aeroflow.just([1, 2]).dump().run();
  aeroflow.just(() => 'test').dump().run();
*/
function just(value) {
  return new Aeroflow((next, done) => {
    next(value);
    done();
  });
}
/*
  aeroflow.random().take(3).dump().run();
  aeroflow.random(0.1).take(3).dump().run();
  aeroflow.random(null, 0.1).take(3).dump().run();
  aeroflow.random(1, 9).take(3).dump().run();
*/
function random(min, max) {
  if (isNothing(min)) {
    if (isNothing(max)) return new Aeroflow((next, done, context) => {
      while(context.busy) next(Math.random());
      done();
    });
    else if (isNaN(max = +max)) throwError('Argument "max" must be a number');
    min = 0;
  }
  if (isNothing(max)) max = maxInteger;
  if (min >= max) throwError('Argument "min" must be greater then "max".');
  max -= min;
  let round = isInteger(min) && isInteger(max) ? floor : identity;
  return new Aeroflow((next, done, context) => {
    while(context()) next(round(min + max * Math.random()));
    done();
  });
}
/*
  aeroflow.range().dump().run();
  aeroflow.range(-3).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, 2).dump().run();
*/
function range(start, end, step) {
  if (isNothing(step)) step = 1;
  else if (isNaN(step = +step) || step < 1) throwError('Argument "step" must be a positive number.');
  if (isNothing(start)) start = 0;
  else if (isNaN(start = +start)) throwError('Argument "start" must be a number.');
  if (isNothing(end)) end = maxInteger;
  else if (isNaN(end = +end)) throwError('Argument "end" must be a number.');
  if (start <= end) return new Aeroflow((next, done, context) => {
    let i = start - step;
    while (context() && (i += step) <= end) next(i);
    done();
  });
  return new Aeroflow((next, done, context) => {
    let i = start + step;
    while (context() && (i -= step) >= end) next(i);
    done();
  });
}
/*
  aeroflow.repeat().take(3).dump().run();
  aeroflow.repeat(() => new Date).delay(1000).take(3).dump().run();
*/
function repeat(repeater) {
  if (isNothing(repeater)) return new Aeroflow((next, done, context) => {
    while(context()) next();
    done();
  });
  if (isFunction(repeater)) return new Aeroflow((next, done, context) => {
    !function proceed() {
      while(context()) {
        let result = repeater(context.data);
        if (result === false) break;
        if (!isPromise(result)) {
          next(result);
          continue;
        }
        return result.then(
          value => {
            next(value);
            proceed();
          },
          error => {
            done();
            throwError(error);
          });
      }
      done();
    }();
  });
  throwError('Argument "repeater" must be a function.');
}

function throwError(error) {
  throw isError(error) ? error : new Error(error);
}

function toCallback(callback) {
  return isFunction(callback)
    ? callback
    : noop;
}

function toLimiter(limiter) {
  return isNumber(limiter)
    ? (value, index) => index < limiter
    : isFunction(limiter)
      ? limiter
      : () => true;
}

function toSelector(selector) {
  return isNothing(selector)
    ? identity
    : isFunction(selector)
      ? selector
      : () => selector;
}

function toTester(tester) {
  return isNothing(tester)
    ? isSomething
    : isFunction(tester)
      ? tester
      : isRegExp(tester)
        ? value => tester.test(value)
        : value => value === tester;
}

module.exports = defineProperties(aeroflow, {
  empty: {value: new Aeroflow((next, done) => done())}
, expand: {value: expand}
, just: {value: just}
, random: {value: random}
, range: {value: range}
, repeat: {value: repeat}
});