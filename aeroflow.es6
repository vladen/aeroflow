'use strict';

const
  AEROFLOW = 'Aeroflow'

, FUNCTION_TYPE = 'function'
, NUMBER_TYPE = 'number'
, OBJECT_TYPE = 'object'
, STRING_TYPE = 'object'

, classTag = className => `[object ${className}]`
, ARRAY_TAG = classTag('Array')
, DATE_TAG = classTag('Date')
, ERROR_TAG = classTag('Error')
, NUMBER_TAG = classTag('Number')
, PROMISE_TAG = classTag('Promise')
, REGEXP_TAG = classTag('RegExp')
, STRING_TAG = classTag('String')

, defineProperty = Object.defineProperty
, defineProperties = Object.defineProperties
, floor = Math.floor
, now = Date.now

, hasSymbols = FUNCTION_TYPE === typeof Symbol
, maxInteger = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1

, identity = value => value
, noop = () => {}
, toStringTag = Object.prototype.toString

, GENERATOR = (hasSymbols ? Symbol : identity)('generator')
, ITERATOR = hasSymbols ? Symbol.iterator : 'iterator'
, TO_STRING_TAG = hasSymbols ? Symbol.toStringTag : 'toStringTag'

, isArray = typeof Array.isArray === 'function'
  ? Array.isArray
  : (value => ARRAY_TAG === toStringTag.call(value))
, isDate = value => DATE_TAG === toStringTag.call(value)
, isError = value => ERROR_TAG === toStringTag.call(value)
, isFunction = value => FUNCTION_TYPE === typeof value
, isInteger = FUNCTION_TYPE === typeof Number.isInteger
  ? Number.isInteger
  : value => NUMBER_TYPE === typeof value && isFinite(value) && value === floor(value)
, isNothing = value => value == null
, isNumber = value => NUMBER_TAG === toStringTag.call(value)
, isObject = value => OBJECT_TYPE === typeof value && null !== value
, isPromise = value => PROMISE_TAG === toStringTag.call(value)
, isRegExp = value => REGEXP_TAG === toStringTag.call(value)
, isSomething = value => null != value
, isString = value => STRING_TAG === toStringTag.call(value)

, isAeroflow = value => isObject(value) && AEROFLOW === value[TO_STRING_TAG]
, isIterable = value => isObject(value) && ITERATOR in value
;

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
    defineProperties(this, {
      [GENERATOR]: {value: generator}
    , [TO_STRING_TAG]: {value: AEROFLOW}
    });
  }
  /*
    aeroflow.range().take(2).concat(2).dump().run();
    aeroflow.range().take(2).concat([2, 3]).dump().run();
    aeroflow.range().take(2).concat(() => [2, 3]).dump().run();
  */
  concat(...flows) {
    return concat(this, ...flows);
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
    let delayer = isFunction(condition)
      ? condition
      : () => condition;
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
    let joiner = isNothing(separator)
      ? ','
      : isFunction(separator)
        ? separator
        : '' + separator;
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
    let cache
      , expirator = isFunction(expiration)
        ? expiration
        : isNumber(expiration)
          ? () => expiration
          : () => maxInteger
      ;
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
    let context = makeContext(data);
    if (!isFunction(done)) done = noop;
    if (!isFunction(next)) next = noop;
    setTimeout(
      () => this[GENERATOR](
        next,
        error => {
          context(false);
          error ? done(error) : done();
        },
        context),
      0);
    return this;
  }
  skip(condition) {
    if (isNothing(condition)) return new Aeroflow((next, done, context) => this[GENERATOR](value => {}, done, context));
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
    if (isNothing(condition)) return this;
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
  aeroflow.empty.dump().run();
*/
let empty = new Aeroflow((next, done) => done());
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
  if (isAeroflow(source)) return source;
  if (isArray(source)) return fromArray(source);
  if (isFunction(source)) return fromFunction(source);
  if (isPromise(source)) return fromPromise(source);
  if (isIterable(source)) return fromIterable(source);
  return aeroflow.just(source);
}
/*
  aeroflow.concat(1, 2, 3).dump().run();
  aeroflow.concat(1, [2, 3]).dump().run();
  aeroflow.concat(1, () => [2, 3]).dump().run();
*/
function concat(...flows) {
  let queue = [...flows];
  return new Aeroflow((next, done, context) => {
    !function proceed() {
      queue.length
        ? aeroflow(queue.shift())[GENERATOR](next, proceed, context)
        : done();
    }();
  });
}
/*
  
*/
function create(generator) {
  return isFunction(generator)
    ? new Aeroflow(generator)
    : empty;
}

/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
function expand(callback, seed, limit) {
  limit = limit || maxInteger;
  let expander = isFunction(callback) ? callback : identity;
  return new Aeroflow((next, done, context) => {
    let counter = limit, index = 0, value = seed;
    while (0 < counter-- && context()) next(value = expander(value, index++, context.data));
    done();
  });
}
/*
  For internal use. Creates new aeroflow from array.
*/
function fromArray(source) {
  return new Aeroflow(
    (next, done, context) => {
      let index = -1;
      while (context() && ++index < source.length) next(source[index]);
      done();
    });
}
/*
  For internal use. Creates new aeroflow from function.
*/
function fromFunction(source) {
  return new Aeroflow(
    (next, done, context) => aeroflow(source())[GENERATOR](next, done, context));
}
/*
  For internal use. Creates new aeroflow from iterable object.
*/
function fromIterable(source) {
  return new Aeroflow(
    (next, done, context) => {
      let iterator = source[ITERATOR]();
      while (context()) {
        let result = iterator.next();
        if (result.done) break;
        else next(result.value);
      }
      done();
    });
}
/*
  For internal use. Creates new aeroflow from promise.
*/
function fromPromise(source) {
  return new Aeroflow(
    (next, done, context) => source.then(
      value => aeroflow(value)[GENERATOR](next, done, context),
      error => {
        done(error);
        throwError(error);
      }));
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
function random(min, max, limit) {
  limit = limit || maxInteger;
  min = +min || 0;
  max = +max || 1;
  max -= min;
  return isInteger(min) && isInteger(max)
    ? new Aeroflow((next, done, context) => {
        let counter = limit;
        while(0 < counter-- && context()) next(floor(min + max * Math.random()));
        done();
      })
    : new Aeroflow((next, done, context) => {
        let counter = limit;
        while(0 < counter-- && context()) next(min + max * Math.random());
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
  end = +end || maxInteger;
  start = +start || 0;
  step = +step || (start < end ? 1 : -1);
  return start === end
    ? just(start)
    : new Aeroflow((next, done, context) => {
        let i = start - step;
        if (start < end) while (context() && (i += step) <= end) next(i);
        else while (context() && (i += step) >= end) next(i);
        done();
      });
}
/*
  aeroflow.repeat().take(3).dump().run();
  aeroflow.repeat(() => new Date, 3).delay(1000).dump().run();
*/
function repeat(repeater, limit) {
  limit = limit || maxInteger;
  return isFunction(repeater)
    ? new Aeroflow((next, done, context) => {
        let counter = limit;
        proceed();
        function onDone(error) {
          if (error) {
            done();
            throwError(error);
          }
          else if (counter && context()) setTimeout(proceed, 0);
          else done();
        }
        function proceed() {
          if (0 < counter--) {
            let result = context() && repeater(context.data);
            if (result === false) done();
            else aeroflow(result)[GENERATOR](next, onDone, context);
          }
          else done();
        }
      })
    : new Aeroflow((next, done, context) => {
        let counter = limit;
        while(0 < counter-- && context()) next(repeater);
        done();
      });
}

module.exports = defineProperties(aeroflow, {
  create: {value: create}
, empty: {value: empty}
, expand: {value: expand}
, just: {value: just}
, random: {value: random}
, range: {value: range}
, repeat: {value: repeat}
});