'use strict';

const
  AEROFLOW = 'Aeroflow'
, EMITTER = Symbol('emitter')

, classof = Object.classof
, defineProperty = Object.defineProperty
, defineProperties = Object.defineProperties
, floor = Math.floor
, now = Date.now

, maxInteger = Number.MAX_SAFE_INTEGER

, identity = value => value
, isAeroflow = value => AEROFLOW === classof(value)
, isArray = value => 'Array' === classof(value)
, isDate = value => 'Date' === classof(value)
, isError = value => 'Error' === classof(value)
, isFunction = value => 'Function' === classof(value)
, isInteger = Number.isInteger
, isIterable = value => Object.isObject(value) && Symbol.iterator in value
, isNothing = value => value == null
, isNumber = value => 'Number' === classof(value)
, isPromise = value => 'Promise' === classof(value)
, isRegExp = value => 'RegExp' === classof(value)
, isSomething = value => null != value
, isString = value => 'String' === classof(value)
, noop = () => {}
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

function makeLimiter(limiter) {
  return isNumber(limiter)
    ? (_, index) => index < limiter
    : isFunction(limiter)
      ? limiter
      : () => true;
}

function makeMapper(mapper) {
  return isFunction(mapper)
    ? mapper
    : identity;
}

function makePredicate(predicate) {
  return isNothing(predicate)
    ? isSomething
    : isFunction(predicate)
      ? predicate
      : isRegExp(predicate)
        ? value => predicate.test(value)
        : value => value === predicate;
}

function throwError(error) {
  throw isError(error) ? error : new Error(error);
}

class Aeroflow {
  constructor(emitter) {
    defineProperties(this, {
      [EMITTER]: {value: emitter}
    , [Symbol.toStringTag]: {value: AEROFLOW}
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
      this[EMITTER](
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
    return new Aeroflow((next, done, context) => this[EMITTER](
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
      this[EMITTER](
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
      this[EMITTER](
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
      this[EMITTER](
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
      this[EMITTER](
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
  map(mapper) {
    mapper = makeMapper(mapper);
    return new Aeroflow((next, done, context) => {
      let index = 0;
      this[EMITTER](
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
    aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
  */
  mean() {
    let array = this.toArray();
    return new Aeroflow((next, done, context) => array[EMITTER](
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
  reduce(reducer, seed) {
    reducer = makeMapper(reducer);
    return new Aeroflow((next, done, context) => {
      let empty = true, index = 0, result;
      if (isSomething(seed)) {
        empty = false;
        result = seed;
      }
      this[EMITTER](
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
      Initiates source emitter to start produce values.
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
      () => this[EMITTER](
        next,
        error => {
          context(false);
          error ? done(error) : done();
        },
        context),
      0);
    return this;
  }
  /*
    var f = aeroflow.repeat(() => new Date).take(3).share(5000).delay(1000).dump();
    f.run(null, () => f.run(null, () => f.run())); 
  */
  share(expiration) {
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
      this[EMITTER](
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
  skip(condition) {
    if (isNothing(condition)) return new Aeroflow((next, done, context) => this[EMITTER](value => {}, done, context));
    let limiter = makeLimiter(condition);
    return new Aeroflow((next, done, context) => {
      let index = 0, limited = true;
      this[EMITTER](
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
      this[EMITTER](
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
    return new Aeroflow((next, done, context) => array[EMITTER](
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
      this[EMITTER](
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
        this[EMITTER](
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
      this[EMITTER](
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
    return new Aeroflow((next, done, context) => this[EMITTER](
      value => next({ timestamp: now(), value }),
      done,
      context));
  }
  /*
    aeroflow.repeat().take(3).toArray().dump().run();
  */
  toArray(mapper) {
    mapper = makeMapper(mapper);
    return new Aeroflow((next, done, context) => {
      let index = 0, result = [];
      this[EMITTER](
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
  toSet(mapper) {
    mapper = makeMapper(mapper);
    return new Aeroflow((next, done, context) => {
      let index = 0, result = new Set;
      this[EMITTER](
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
  toMap(keyMapper, valueMapper) {
    keyMapper = isFunction(keyMapper)
      ? keyMapper
      : value => isArray(value) && 2 === value.length
        ? value[0]
        : value;
    valueMapper = isFunction(valueMapper)
      ? valueMapper
      : value => isArray(value) && 2 === value.length
        ? value[1]
        : value;
    return new Aeroflow((next, done, context) => {
      let index = 0, result = new Map;
      this[EMITTER](
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
      this[EMITTER](
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
        ? aeroflow(queue.shift())[EMITTER](next, proceed, context)
        : done();
    }();
  });
}
/*
  
*/
function create(emitter) {
  return isFunction(emitter)
    ? new Aeroflow((next, done, context) => {
        let completed = false;
        emitter(
          value => {
            if (context()) next()
          },
          error => {
            if (!completed) {
              completed = true;
              done();
              context(false);
            }
          });
      })
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
    (next, done, context) => aeroflow(source())[EMITTER](next, done, context));
}
/*
  For internal use. Creates new aeroflow from iterable object.
*/
function fromIterable(source) {
  return new Aeroflow(
    (next, done, context) => {
      let iterator = source[Symbol.iterator]();
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
      value => aeroflow(value)[EMITTER](next, done, context),
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
            else aeroflow(result)[EMITTER](next, onDone, context);
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
  concat: {value: concat}
, create: {value: create}
, empty: {value: empty}
, expand: {value: expand}
, just: {value: just}
, random: {value: random}
, range: {value: range}
, repeat: {value: repeat}
});