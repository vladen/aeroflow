'use strict';

const
  defineProperty = Object.defineProperty
, defineProperties = Object.defineProperties
, floor = Math.floor
, maxInteger = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1
, now = Date.now
, toStringTag = Object.prototype.toString
, identity = value => value
, isArray = typeof Array.isArray === 'function'
  ? Array.isArray
  : (value => toStringTag.call(value) === '[object Array]')
, isDate = value => toStringTag.call(value) === '[object Date]'
, isError = value => toStringTag.call(value) === '[object Error]'
, isFunction = value => typeof value === 'function'
, isInteger = typeof Number.isInteger === 'function'
  ? Number.isInteger
  : value => typeof value === 'number' && isFinite(value) && floor(value) === value
, isNothing = value => value == null
, isNumber = value => typeof value === 'number' || toStringTag.call(value) === '[object Number]'
, isObject = value => value !== null && typeof value === 'object'
, isPromise = value => toStringTag.call(value) === '[object Promise]'
, isRegExp = value => toStringTag.call(value) === '[object RegExp]'
, isSomething = value => value != null
, isString = value => typeof value === 'string' || toStringTag.call(value) === '[object String]'
, noop = () => {}
, GENERATOR = 'generator'
, ITERATOR = typeof Symbol === 'function' ? Symbol.iterator : 'iterator'
;

function makeCallback(callback) {
  return isFunction(callback)
    ? callback
    : noop;
}

function makeContext(data) {
  let active = true, callbacks = [], context = (value) => {
    if (value !== undefined)
      if (value === false) {
        active = false;
        callbacks.forEach(callback => callback());
      }
      else if (isFunction(value)) active ? callbacks.push(value) : value();
    return active;
  };
  return defineProperties(context, {
    data: {value: data},
    spawn: {value: () => {
      let child = makeContext(data);
      context(child);
      return child;
    }}
  });
}

function makeDelayer(condition) {
  return isFunction(condition)
    ? condition
    : () => condition;
}

function makeExpirator(condition) {
  return isFunction(condition)
    ? condition
    : isNumber(condition)
      ? () => condition
      : () => maxInteger;
}

function makeJoiner(separator) {
  return isNothing(separator)
    ? ','
    : isFunction(separator)
      ? separator
      : '' + separator;
}

function makeLimiter(condition) {
  return isNumber(condition)
    ? (value, index) => index < condition
    : isFunction(condition)
      ? condition
      : () => true;
}

function makeMapper(mapping) {
  return isNothing(mapping)
    ? identity
    : isFunction(mapping)
      ? mapping
      : () => mapping;
}

function makePredicate(condition) {
  return isNothing(condition)
    ? isSomething
    : isFunction(condition)
      ? condition
      : isRegExp(condition)
        ? value => condition.test(value)
        : value => value === condition;
}

function throwError(error) {
  throw isError(error) ? error : new Error(error);
}

class Aeroflow {
  constructor(generator) {
    defineProperty(this, GENERATOR, {value: generator});
  }
  after(flow) {
    flow = aeroflow(flow);
    return new Aeroflow((next, done, context) => {
      let completed = false, happened = false, values = [];
      flow[GENERATOR](noop, happen, makeContext());
      this[GENERATOR](
        value => happened
            ? next(value)
            : values.push(value),
        error => {
          if (happened || !context()) done(error);
          else {
            completed = true;
            values.error = error;
          }
        },
        context);
      function happen() {
        if (!context()) return;
        happened = true;
        values.forEach(next);
        if (completed) done(values.error);
      }
    });
  }
  /*
    aeroflow.range().take(2).concat(2).dump().run();
    aeroflow.range().take(2).concat([2, 3]).dump().run();
    aeroflow.range().take(2).concat(() => [2, 3]).dump().run();
  */
  concat(...flows) {
    let queue = [this, ...flows];
    return new Aeroflow((next, done, context) => {
      !function proceed() {
        queue.length
          ? aeroflow(queue.shift())[GENERATOR](next, proceed, context)
          : done();
      }();
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
    aeroflow([1, 2, 3]).delay((value, index) => index * 500).dump().run();
  */
  delay(condition) {
    let delayer = makeDelayer(condition);
    return new Aeroflow((next, done, context) => {
      let completition = now(), index = 0;
      this[GENERATOR](
        value => {
          let delay = delayer(value, index++, context.data), estimation;
          if (isDate(delay)) {
            estimation = delay;
            delay = delay - now();
          }
          else estimation = now() + delay;
          if (completition < estimation) completition = estimation;
          setTimeout(() => next(value), delay < 0 ? 0 : delay);
        },
        error => {
          completition -= now();
          setTimeout(() => done(error), completition < 0 ? 0 : completition);
        },
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
        error ? logger(prefix + 'done', error) : logger(prefix + 'done');
        done(error);
      },
      context));
  }
  every(condition) {
    let predicate = makePredicate(condition);
    return new Aeroflow((next, done, context) => {
      let empty = true, result = true;
      context = context.spawn();
      this[GENERATOR](
        value => {
          empty = false;
          if (!predicate(value)) {
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
  filter(condition) {
    let predicate = makePredicate(predicate);
    return new Aeroflow((next, done, context) => {
      let index = 0;
      this[GENERATOR](
        value => predicate(value, index++, context.data)
          ? next(value)
          : false,
        done,
        context);
    });
  }
  first() {
    return new Aeroflow((next, done, context) => {
      context = context.spawn();
      this[GENERATOR](
        value => {
          next(value);
          context(false);
        },
        done,
        context);
    });
  }
  join(separator) {
    let joiner = makeJoiner(separator);
    return this.reduce((result, value) => result.length ? result + joiner() + value : value, '');
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
  map(mapping) {
    let mapper = makeMapper(mapping);
    return new Aeroflow((next, done, context) => {
      let index = 0;
      this[GENERATOR](
        value => next(mapper(value, index++, context.data)),
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
  memoize(expiration) {
    let cache, expirator = makeExpirator(expiration);
    return new Aeroflow((next, done, context) => {
      if (cache) {
        cache.forEach(next);
        done();
        return;
      }
      cache = [];
      this[GENERATOR](
        value => {
          cache.push(value);
          next(value);
        },
        error => {
          setTimeout(() => {
            cache = null;
          }, expirator(context.data));
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
  reduce(mapping, seed) {
    let reducer = makeMapper(mapping);
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
    let context = makeContext(data), nextCallback = makeCallback(next), doneCallback = makeCallback(done);
    setTimeout(
      () => this[GENERATOR](
        nextCallback,
        error => {
          context(false);
          error ? doneCallback(error) : doneCallback();
        },
        context),
      0);
    return this;
  }
  skip(condition) {
    let limiter = makeLimiter(condition);
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
  some(predicate) {
    predicate = makePredicate(predicate);
    return new Aeroflow((next, done, context) => {
      let result = false;
      context = context.spawn();
      this[GENERATOR](
        value => {
          if (predicate(value)) {
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
    aeroflow([4, 2, 5, 3, 1]).sort().dump().run();
  */
  sort(comparer) {
    let array = this.toArray();
    return new Aeroflow((next, done, context) => array[GENERATOR](
      values => values.length ? values.sort(comparer).forEach(next) : false,
      done,
      context));
  }
  /*
    aeroflow([1, 2, 3]).sum().dump().run();
  */
  sum() {
    return this.reduce((result, value) => result + value, 0);
  }
  take(condition) {
    let limiter = makeLimiter(condition);
    return new Aeroflow((next, done, context) => {
      let index = 0;
      context = context.spawn();
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
  toArray(mapping) {
    let mapper = makeMapper(mapping);
    return new Aeroflow((next, done, context) => {
      let index = 0, result = [];
      this[GENERATOR](
        value => result.push(mapper(value, index++, context.data)),
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
  toSet(mapping) {
    let mapper = makeMapper(mapping);
    return new Aeroflow((next, done, context) => {
      let index = 0, result = new Set;
      this[GENERATOR](
        value => result.add(mapper(value, index++, context.data)),
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
  toMap(keyMapping, valueMapping) {
    let keyMapper = makeMapper(keyMapping), valueMapper = makeMapper(valueMapping);
    return new Aeroflow((next, done, context) => {
      let index = 0, result = new Map;
      this[GENERATOR](
        value => result.set(
          keyMapper(value, index, context.data),
          valueMapper(value, index++, context.data)),
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
  if (isArray(source)) return new Aeroflow(
    (next, done, context) => {
      let index = -1;
      while (context() && ++index < source.length) next(source[index]);
      done();
    });
  if (isFunction(source)) return new Aeroflow(
    (next, done, context) => aeroflow(source())[GENERATOR](next, done, context));
  if (isPromise(source)) return new Aeroflow(
    (next, done, context) => source.then(
      value => aeroflow(value)[GENERATOR](next, done, context),
      error => {
        done(error);
        throwError(error);
      }));
  if (isObject(source) && ITERATOR in source) return new Aeroflow(
    (next, done, context) => {
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
function create(generator) {
  return new Aeroflow(isFunction(generator) 
    ? generator
    : (next, done) => done());
}
/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
function expand(generator, seed) {
  let expander = isFunction(generator)
    ? generator
    : identity;
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
      while(context()) next(Math.random());
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
  aeroflow.range().take(3).dump().run();
  aeroflow.range(-3).take(3).dump().run();
  aeroflow.range(1, 1).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, -2).dump().run();
*/
function range(start, end, step) {
  if (isNaN(end = +end)) end = maxInteger;
  if (isNaN(start = +start)) start = 0;
  if (isNaN(step = +step)) step = start < end ? 1 : -1;
  if (start === end) return just(start);
  return new Aeroflow((next, done, context) => {
    let i = start - step;
    if (start < end) while (context() && (i += step) <= end) next(i);
    else while (context() && (i += step) >= end) next(i);
    done();
  });
}
/*
  aeroflow.repeat().take(3).dump().run();
  aeroflow.repeat(() => new Date).delay(1000).take(3).dump().run();
*/
function repeat(repeater) {
  if (isFunction(repeater)) return new Aeroflow((next, done, context) => {
    !function proceed() {
      let result = context() && repeater(context.data);
      if (result === false) done();
      else aeroflow(result)[GENERATOR](
        next,
        error => {
          if (error) {
            done();
            throwError(error);
          }
          else if (context()) setTimeout(proceed, 0);
          else done();
        },
        context);
    }();
  });
  return new Aeroflow((next, done, context) => {
    while(context()) next(repeater);
    done();
  });
}

module.exports = defineProperties(aeroflow, {
  create: {value: create}
, empty: {value: new Aeroflow((next, done) => done())}
, expand: {value: expand}
, just: {value: just}
, random: {value: random}
, range: {value: range}
, repeat: {value: repeat}
});