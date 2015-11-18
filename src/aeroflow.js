'use strict';

const
  AEROFLOW = 'Aeroflow'
, EMITTER = Symbol('emitter')

, classof = Object.classof
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

, noop = () => {}
;

class Aeroflow {
  constructor(emitter) {
    defineProperties(this, {
      [EMITTER]: {value: emitter}
    , [Symbol.toStringTag]: {value: AEROFLOW}
    });
  }
  /*
    aeroflow(1).concat(2, 3, 4, 5).dump().run();
    aeroflow(1).concat([2, 3], [4, 5]).dump().run();
    aeroflow(1)
      .concat(
        () => new Promise(resolve => setTimeout(() => resolve([2, 3]), 400))
      , () => new Promise(resolve => setTimeout(() => resolve([4, 5]), 800)))
      .dump()
      .run();
  */
  concat(...flows) {
    return aeroflow(this, ...flows);
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
          delay < 0
            ? setImmediate(() => next(value)) 
            : setTimeout(() => next(value), delay);
        },
        error => {
          completition -= now();
          completition < 0
            ? setImmediate(() => done(error))
            : setTimeout(() => done(error), completition);
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
      context = context.make();
      this[EMITTER](
        value => {
          empty = false;
          if (!predicate(value)) {
            result = false;
            context.stop();
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
      context = context.make();
      this[EMITTER](
        value => {
          next(value);
          context.stop();
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
    let context = makeContext(this, data);
    if (!isFunction(done)) done = noop;
    if (!isFunction(next)) next = noop;
    setImmediate(
      () => this[EMITTER](
        value => next(value, context),
        error => {
          context.stop();
          done(error, context);
        },
        context));
    return this;
  }
  /*
    var i = 0;
    aeroflow.repeat(() => ++i).take(3).share(2000).delay(1000).dump().run(
      null
      , (error, context) => context.flow.run(
        null
        , (error, context) => context.flow.run()));
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
          setTimeout(() => { cache = null }, expirator(context.data));
          done(error);
        },
        context);
    });
  }
  skip(condition) {
    return new Aeroflow(isNothing(condition)
      ? emitEmpty()
      : isNumber(condition)
        ? (next, done, context) => {
            let index = 1;
            this[EMITTER](
              value => condition < index++ ? next(value) : false,
              done,
              context);
          }
        : isFunction(condition)
          ? (next, done, context) => {
              let index = 0, limited = true;
              this[EMITTER](
                value => {
                  if (limited && !condition(value, index++, context.data)) limited = false;
                  if (!limited) next(value);
                },
                done,
                context);
            }
          : condition
            ? emitEmpty()
            : this[EMITTER]
    );
  }
  some(predicate) {
    predicate = makePredicate(predicate);
    return new Aeroflow((next, done, context) => {
      let result = false;
      context = context.make();
      this[EMITTER](
        value => {
          if (predicate(value)) {
            result = true;
            context.stop();
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
  sort(order, ...comparers) {
    return sort(this, order, ...comparers);
  }
  /*
    aeroflow([1, 2, 3]).sum().dump().run();
  */
  sum() {
    return this.reduce((result, value) => result + value, 0);
  }
  take(condition) {
    return new Aeroflow(isNumber(condition)
      ? condition > 0
        ? (next, done, context) => {
            let index = 1;
            context = context.make();
            this[EMITTER](
              value => {
                next(value);
                if (condition <= index++) context.stop();
              },
              done,
              context);
          }
        : emitEmpty()
      : isFunction(condition)
        ? (next, done, context) => {
            let index = 0;
            context = context.make();
            this[EMITTER](
              value => condition(value, index++, context.data)
                ? next(value)
                : context.stop(),
              done,
              context);
          }
        : isNothing(condition) || condition 
          ? this[EMITTER]
          : emitEmpty()
    );
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
  aeroflow('test').dump().run();
  aeroflow(aeroflow('test')).dump().run();
  aeroflow([1, 2]).dump().run();
  aeroflow(new Map([['a', 1], ['b', 2]])).dump().run();
  aeroflow(new Set(['a', 'b'])).dump().run();
  aeroflow(() => 'test').dump().run();
  aeroflow(Promise.resolve('test')).dump().run();
  aeroflow(() => new Promise(resolve => setTimeout(() => resolve('test'), 100))).dump().run();

  aeroflow(1, [2, 3], new Set([4, 5]), Promise.resolve(7), new Promise(resolve => setTimeout(() => resolve(8), 500))).dump().run();
*/
function aeroflow(...sources) {
  return new Aeroflow(emit(...sources));
}
/*
  For internal use. Default value comparer.
*/
function compare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
/*
  aeroflow.create((next, done, context) => {
    next(1);
    next(new Promise(resolve => setTimeout(() => resolve(2), 500)));
    setTimeout(done, 1000);
  }).dump().run();
*/
function create(emitter, disposer) {
  return new Aeroflow(isFunction(emitter)
    ? (next, done, context) => {
        let completed = false;
        emitter(
          value => context() ? next() : false,
          error => {
            if (completed) return;
            completed = true;
            done();
            context.stop();
            if (isFunction(disposer)) disposer();
          },
          context);
      }
    : emitEmpty());
}

/*
  For internal use. Wraps sources with emitter function.
*/
function emit(...sources) {
  switch (sources.length) {
    case 0:
      return emitEmpty(); // todo: Aeroplan
    case 1:
      let source = sources[0];
      if (isAeroflow(source)) return source[EMITTER];
      if (isArray(source)) return emitArray(source);
      if (isFunction(source)) return emitFunction(source);
      if (isPromise(source)) return emitPromise(source);
      if (isIterable(source)) return emitIterable(source);
      return emitValue(source);
    default:
      return (next, done, context) => {
        let count = sources.length, index = -1;
        !function proceed() {
          ++index < count
            ? emit(sources[index])(next, proceed, context)
            : done();
        }();
      };
  }
}
/*
  For internal use. Wraps array with emitter function.
*/
function emitArray(source) {
  return (next, done, context) => {
    let index = -1;
    while (context() && ++index < source.length) next(source[index]);
    done();
  };
}
function emitEmpty() {
  return (next, done) => done();
}
/*
  For internal use. Wraps function with emitter function.
*/
function emitFunction(source) {
  return (next, done, context) => emit(source())(next, done, context);
}
/*
  For internal use. Wraps iterable object with emitter function.
*/
function emitIterable(source) {
  return (next, done, context) => {
    let iterator = source[Symbol.iterator]();
    while (context()) {
      let result = iterator.next();
      if (result.done) break;
      else next(result.value);
    }
    done();
  };
}
/*
  For internal use. Wraps promise with emitter function.
*/
function emitPromise(source) {
  return (next, done, context) => source.then(
    value => emit(value)(next, done, context),
    error => {
      done(error);
      throwError(error);
    });
}
/*
  For internal use. Wraps scalar value with emitter function.
*/
function emitValue(value) {
  return (next, done) => {
    next(value);
    done();
  };
}

/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
function expand(callback, seed, limit) {
  limit = limit || maxInteger;
  let expander = isFunction(callback) ? callback : identity;
  return new Aeroflow(isFunction(callback)
    ? (next, done, context) => {
        let counter = limit, index = 0, value = seed;
        while (0 < counter-- && context()) next(value = expander(value, index++, context.data));
        done();
      }
    : (next, done, context) => {
        let counter = limit;
        while (0 < counter-- && context()) next(seed);
        done();
      });
}
/*
  aeroflow.just([1, 2]).dump().run();
  aeroflow.just(() => 'test').dump().run();
*/
function just(value) {
  return new Aeroflow(emitValue(value));
}

function makeContext(flow, data) {
  let active = true
    , callbacks = []
    , care = callback => {
        if (isFunction(callback)) active ? callbacks.push(callback) : callback();
        return callback;
      }
    , context = () => active
    , make = () => care(makeContext(flow, data))
    , stop = () => {
        if (active) {
          active = false;
          callbacks.forEach(callback => callback());
        }
        return false;
      }
    ;
  return defineProperties(context, {
    care: {value: care}
  , data: {value: data}
  , flow: {value: flow}
  , make: {value: make}
  , stop: {value: stop}
  });
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
  return new Aeroflow(start === end
    ? emitValue(start)
    : (next, done, context) => {
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
  return new Aeroflow(isFunction(repeater)
    ? (next, done, context) => {
        let counter = limit;
        proceed();
        function onDone(error) {
          if (error) {
            done();
            throwError(error);
          }
          else if (counter && context()) setImmediate(proceed);
          else done();
        }
        function proceed() {
          if (0 < counter--) {
            let result = context() && repeater(context.data);
            if (result === false) done();
            else emit(result)(next, onDone, context);
          }
          else done();
        }
      }
    : (next, done, context) => {
        let counter = limit;
        while(0 < counter-- && context()) next(repeater);
        done();
      });
}
/*
  aeroflow([3, 2, 1]).sort().dump().run();
*/
function sort(flow, order, ...selectors) {
  if (isFunction(order)) {
    selectors.unshift(order);
    order = 1;
  }
  if(!selectors.every(isFunction)) throwError('Selector function expected.');
  switch (order) {
    case 'asc': case 1: case undefined: case null:
      order = 1;
      break;
    case 'desc': case -1:
      order = -1;
      break;
    default:
      order = order ? 1 : -1;
      break;
  }
  switch(selectors.length) {
    case 0: return sortWithoutComparer(flow, order);
    case 1: return sortWithComparer(flow, order, selectors[0]);
    default: return sortWithComparers(flow, order, ...selectors);
  }
}

function sortWithComparer(flow, order, selector) {
  let array = flow.toArray()
    , comparer = (left, right) => order * compare(selector(left), selector(right))
    ;
  return new Aeroflow((next, done, context) => array[EMITTER](
    values => values.sort(comparer).forEach(next),
    done,
    context));
}

function sortWithComparers(flow, order, ...selectors) {
  let array = flow.toArray()
    , count = selectors.length
    , comparer = (left, right) => {
        let index = -1;
        while (++index < count) {
          let selector = selectors[index]
            , result = order * compare(selector(left), selector(right));
          if (result) return result;
        }
        return 0;
      }
    ;
  return new Aeroflow((next, done, context) => array[EMITTER](
    values => values.sort(comparer).forEach(next),
    done,
    context));
}

function sortWithoutComparer(flow, order) {
  let array = flow.toArray();
  return new Aeroflow((next, done, context) => array[EMITTER](
    values => order === 1
      ? values.sort().forEach(next)
      : values.sort().reverse().forEach(next),
    done,
    context));
}

function throwError(error) {
  throw isError(error) ? error : new Error(error);
}

module.exports = defineProperties(aeroflow, {
  create: {value: create}
, empty: {value: new Aeroflow(emitEmpty())}
, expand: {value: expand}
, just: {value: just}
, random: {value: random}
, range: {value: range}
, repeat: {value: repeat}
});