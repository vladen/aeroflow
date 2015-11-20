/**
  * Lazily computed async reactive data flow.
  * @module aeroflow
  */

'use strict'

/*
  -------------
    constants
  -------------
*/

;

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.aeroflow = mod.exports;
  }
})(this, function (module) {
  const AEROFLOW = 'Aeroflow',
        EMITTER = Symbol('emitter');
  const classof = Object.classof,
        defineProperties = Object.defineProperties,
        floor = Math.floor,
        maxInteger = Number.MAX_SAFE_INTEGER,
        now = Date.now;

  const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0,
        constant = value => () => value,
        identity = value => value,
        isAeroflow = value => AEROFLOW === classof(value),
        isArray = value => 'Array' === classof(value),
        isDate = value => 'Date' === classof(value),
        isError = value => 'Error' === classof(value),
        isFunction = value => 'Function' === classof(value),
        isInteger = Number.isInteger,
        isIterable = value => Object.isObject(value) && Symbol.iterator in value,
        isNothing = value => value == null,
        isNumber = value => 'Number' === classof(value),
        isPromise = value => 'Promise' === classof(value),
        isRegExp = value => 'RegExp' === classof(value),
        noop = () => {},
        throwError = error => {
    throw isError(error) ? error : new Error(error);
  };

  let empty;

  function createContext(flow, data) {
    let active = true,
        callbacks = [],
        context = () => active,
        end = () => {
      if (active) {
        active = false;
        callbacks.forEach(callback => callback());
      }

      return false;
    },
        onend = callback => {
      if (isFunction(callback)) active ? callbacks.push(callback) : callback();
      return callback;
    },
        spawn = () => onend(createContext(flow, data));

    return defineProperties(context, {
      data: {
        value: data
      },
      flow: {
        value: flow
      },
      end: {
        value: end
      },
      onend: {
        value: onend
      },
      spawn: {
        value: spawn
      }
    });
  }

  function emit(...sources) {
    switch (sources.length) {
      case 0:
        return emitEmpty();

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
          let limit = sources.length,
              index = -1;
          !(function proceed() {
            ++index < limit ? emit(sources[index])(next, proceed, context) : done();
          })();
        };
    }
  }

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

  function emitFunction(source) {
    return (next, done, context) => emit(source())(next, done, context);
  }

  function emitIterable(source) {
    return (next, done, context) => {
      let iterator = source[Symbol.iterator]();

      while (context()) {
        let result = iterator.next();
        if (result.done) break;else next(result.value);
      }

      done();
    };
  }

  function emitPromise(source) {
    return (next, done, context) => source.then(value => emit(value)(next, done, context), error => {
      done(error);
      throwError(error);
    });
  }

  function emitValue(value) {
    return (next, done) => {
      next(value);
      done();
    };
  }

  class Aeroflow {
    constructor(emitter) {
      defineProperties(this, {
        [EMITTER]: {
          value: emitter
        },
        [Symbol.toStringTag]: {
          value: AEROFLOW
        }
      });
    }

    append(...sources) {
      return aeroflow(this, ...sources);
    }

    count() {
      return reduce(this, result => result + 1, 0);
    }

    delay(condition) {
      return isFunction(condition) ? delayExtended(this, condition) : isDate(condition) ? delayExtended(this, () => condition - new Date()) : delay(this, +condition || 0);
    }

    dump(prefix, logger) {
      switch (arguments.length) {
        case 0:
          return dumpToConsole(this, '');

        case 1:
          return isFunction(prefix) ? dump(this, '', prefix) : dumpToConsole(this, '');

        default:
          return isFunction(logger) ? isNothing(prefix) ? dump(this, '', logger) : dump(this, prefix, logger) : dumpToConsole(this, prefix);
      }
    }

    every(predicate) {
      return every(this, isNothing(predicate) ? value => !!value : isFunction(predicate) ? predicate : isRegExp(predicate) ? value => predicate.test(value) : value => value === predicate);
    }

    filter(predicate) {
      return filter(this, isNothing(predicate) ? value => !!value : isFunction(predicate) ? predicate : isRegExp(predicate) ? value => predicate.test(value) : value => value === predicate);
    }

    join(separator) {
      return join(this, arguments.length ? isFunction(separator) ? separator : () => '' + separator : () => ',');
    }

    map(mapper) {
      return arguments.length ? map(this, isFunction(mapper) ? mapper : () => mapper) : this;
    }

    max() {
      return reduceAlong(this, (max, value) => value > max ? value : max);
    }

    mean() {
      let array = toArray(this);
      return new Aeroflow((next, done, context) => array[EMITTER](values => {
        if (!values.length) return;
        values.sort();
        next(values[floor(values.length / 2)]);
      }, done, context));
    }

    min() {
      return reduceAlong(this, (min, value) => value < min ? value : min);
    }

    prepend(...sources) {
      return aeroflow(...sources, this);
    }

    reduce(reducer, seed) {
      switch (arguments.length) {
        case 0:
          return empty;

        case 1:
          return isFunction(reducer) ? reduceAlong(this, reducer) : just(reducer);

        default:
          return isFunction(reducer) ? reduce(this, reducer, seed) : just(reducer);
      }
    }

    run(next, done, data) {
      setImmediate(() => run(this, isFunction(next) ? next : noop, isFunction(done) ? done : noop, createContext(this, data)));
      return this;
    }

    share(expiration) {
      return arguments.length ? isFunction(expiration) ? shareExtended(this, expiration) : isNumber(expiration) ? expiration <= 0 ? this : shareExtended(this, () => expiration) : expiration ? share(this) : this : share(this);
    }

    skip(condition) {
      return arguments.length ? isNumber(condition) ? condition === 0 ? this : condition > 0 ? skipFirst(this, condition) : skipLast(this, condition) : isFunction(condition) ? skipWhile(this, condition) : condition ? skipAll(this) : this : skipAll(this);
    }

    some(predicate) {
      return some(this, arguments.length ? isFunction(predicate) ? predicate : isRegExp(predicate) ? value => predicate.test(value) : value => value === predicate : value => !!value);
    }

    sort(order, ...comparers) {
      return sort(this, order, ...comparers);
    }

    sum() {
      return reduce(this, (result, value) => result + value, 0);
    }

    take(condition) {
      return arguments.length ? isNumber(condition) ? condition === 0 ? empty : condition > 0 ? takeFirst(this, condition) : takeLast(this, condition) : isFunction(condition) ? takeWhile(this, condition) : condition ? this : empty : this;
    }

    tap(callback) {
      return isFunction(callback) ? tap(this, callback) : this;
    }

    timedelta() {
      return new Aeroflow((next, done, context) => {
        let past = now();
        this[EMITTER](value => {
          let current = now();
          next({
            timedelta: current - past,
            value
          });
          past = current;
        }, done, context);
      });
    }

    timestamp() {
      return new Aeroflow((next, done, context) => this[EMITTER](value => next({
        timestamp: now(),
        value
      }), done, context));
    }

    toArray(mapper) {
      return arguments.length ? isFunction(mapper) ? toArrayExtended(this, mapper) : toArrayExtended(this, constant(mapper)) : toArray(this);
    }

    toMap(keyMapper, valueMapper) {
      switch (arguments.length) {
        case 0:
          return toMap(this);

        case 1:
          return toMapExtended(this, isFunction(keyMapper) ? keyMapper : constant(keyMapper), identity);

        default:
          return toMapExtended(this, isFunction(keyMapper) ? keyMapper : constant(keyMapper), isFunction(valueMapper) ? keyMapper : constant(valueMapper));
      }
    }

    toSet(mapper) {
      return arguments.length ? isFunction(mapper) ? toSetExtended(this, mapper) : toSetExtended(this, constant(mapper)) : toSet(this);
    }

    unique() {
      return new Aeroflow((next, done, context) => {
        let values = new Set();
        this[EMITTER](value => {
          let size = values.size;
          values.add(value);
          if (size < values.size) next(value);
        }, done, context);
      });
    }

  }

  function aeroflow(...sources) {
    return new Aeroflow(emit(...sources));
  }

  empty = new Aeroflow(emitEmpty());

  function create(emitter) {
    return arguments.length ? isFunction(emitter) ? new Aeroflow((next, done, context) => {
      let completed = false;
      context.onend(emitter(value => context() ? next() : false, error => {
        if (completed) return;
        completed = true;
        done();
        context.end();
      }, context));
    }) : just(emitter) : empty;
  }

  function expand(expander, seed) {
    return isFunction(expander) ? new Aeroflow((next, done, context) => {
      let index = 0,
          value = seed;

      while (context()) next(value = expander(value, index++, context.data));

      done();
    }) : repeatStatic(expander);
  }

  function just(value) {
    return new Aeroflow(emitValue(value));
  }

  function random(inclusiveMin, exclusiveMax) {
    inclusiveMin = +inclusiveMin || 0;
    exclusiveMax = +exclusiveMax || 1;
    exclusiveMax -= inclusiveMin;
    let generator = isInteger(inclusiveMin) && isInteger(exclusiveMax) ? () => floor(inclusiveMin + exclusiveMax * Math.random()) : () => inclusiveMin + exclusiveMax * Math.random();
    return new Aeroflow((next, done, context) => {
      while (context()) next(generator());

      done();
    });
  }

  function range(start, end, step) {
    end = +end || maxInteger;
    start = +start || 0;
    step = +step || (start < end ? 1 : -1);
    return start === end ? just(start) : new Aeroflow((next, done, context) => {
      let i = start - step;
      if (start < end) while (context() && (i += step) <= end) next(i);else while (context() && (i += step) >= end) next(i);
      done();
    });
  }

  function repeat(value) {
    return isFunction(value) ? repeatDynamic(value) : repeatStatic(value);
  }

  function repeatDynamic(repeater) {
    return new Aeroflow((next, done, context) => {
      let index = 0;
      proceed();

      function complete(error) {
        if (error) {
          done();
          throwError(error);
        } else if (context()) setImmediate(proceed);else done();
      }

      function proceed() {
        let result = context() && repeater(index, context.data);
        if (result === false) done();else emit(result)(next, complete, context);
      }
    });
  }

  function repeatStatic(value) {
    return new Aeroflow((next, done, context) => {
      while (context()) next(value);

      done();
    });
  }

  function delay(flow, interval) {
    return new Aeroflow((next, done, context) => flow[EMITTER](value => setTimeout(() => next(value), Math.max(interval, 0)), error => setTimeout(() => done(error), Math.max(interval, 0)), context));
  }

  function delayExtended(flow, selector) {
    return new Aeroflow((next, done, context) => {
      let completition = now(),
          index = 0;
      flow[EMITTER](value => {
        let interval = selector(value, index++, context.data),
            estimation;

        if (isDate(interval)) {
          estimation = interval;
          interval = interval - now();
        } else estimation = now() + interval;

        if (completition < estimation) completition = estimation;
        interval < 0 ? setImmediate(() => next(value)) : setTimeout(() => next(value), interval);
      }, error => {
        completition -= now();
        completition < 0 ? setImmediate(() => done(error)) : setTimeout(() => done(error), completition);
      }, context);
    });
  }

  function dump(flow, prefix, logger) {
    return new Aeroflow((next, done, context) => flow[EMITTER](value => {
      logger(prefix + 'next', value);
      next(value);
    }, error => {
      error ? logger(prefix + 'done', error) : logger(prefix + 'done');
      done(error);
    }, context));
  }

  function dumpToConsole(flow, prefix) {
    return new Aeroflow((next, done, context) => flow[EMITTER](value => {
      console.log(prefix + 'next', value);
      next(value);
    }, error => {
      error ? console.error(prefix + 'done', error) : console.log(prefix + 'done');
      done(error);
    }, context));
  }

  function every(predicate) {
    return new Aeroflow((next, done, context) => {
      let idle = true,
          result = true;
      context = context.spawn();
      this[EMITTER](value => {
        idle = false;
        if (!predicate(value)) return;
        result = false;
        context.end();
      }, error => {
        next(result && !idle);
        done(error);
      }, context);
    });
  }

  function filter(flow, predicate) {
    return new Aeroflow((next, done, context) => {
      let index = 0;
      flow[EMITTER](value => predicate(value, index++, context.data) ? next(value) : false, done, context);
    });
  }

  function join(flow, joiner) {
    return reduceOptional(flow, (result, value, index, data) => result.length ? result + joiner(value, index, data) + value : value, '');
  }

  function map(flow, mapper) {
    return new Aeroflow((next, done, context) => {
      let index = 0;
      flow[EMITTER](value => next(mapper(value, index++, context.data)), done, context);
    });
  }

  function reduce(flow, reducer, seed) {
    return new Aeroflow((next, done, context) => {
      let index = 0,
          result = seed;
      flow[EMITTER](value => result = reducer(result, value, index++, context.data), error => {
        next(result);
        done(error);
      }, context);
    });
  }

  function reduceAlong(flow, reducer) {
    return new Aeroflow((next, done, context) => {
      let idle = true,
          index = 0,
          result;
      flow[EMITTER](value => {
        if (empty) {
          idle = false;
          index++;
          result = value;
        } else result = reducer(result, value, index++, context.data);
      }, error => {
        if (!idle) next(result);
        done(error);
      }, context);
    });
  }

  function reduceOptional(flow, reducer, seed) {
    return new Aeroflow((next, done, context) => {
      let idle = true,
          index = 0,
          result = seed;
      flow[EMITTER](value => {
        idle = false;
        result = reducer(result, value, index++, context.data);
      }, error => {
        if (!idle) next(result);
        done(error);
      }, context);
    });
  }

  function run(flow, next, done, context) {
    flow[EMITTER](value => next(value, context), error => {
      context.end();
      done(error, context);
    }, context);
  }

  function share(flow) {
    let cache = [],
        cached = false;
    return new Aeroflow((next, done, context) => {
      if (cached) {
        cache.forEach(next);
        done();
      } else flow[EMITTER](value => {
        cache.push(value);
        next(value);
      }, error => {
        cached = true;
        done(error);
      }, context);
    });
  }

  function shareExtended(flow, selector) {
    let cache = [],
        cached = false;
    return new Aeroflow((next, done, context) => {
      if (cached) {
        cache.forEach(next);
        done();
      } else flow[EMITTER](value => {
        cache.push(value);
        next(value);
      }, error => {
        setTimeout(() => {
          cache = [];
          cached = false;
        }, selector(context.data));
        done(error);
      }, context);
    });
  }

  function skipAll(flow) {
    return new Aeroflow((next, done, context) => flow[EMITTER](noop, done, context));
  }

  function skipFirst(flow, count) {
    return new Aeroflow((next, done, context) => {
      let index = -1;
      flow[EMITTER](value => ++index < count ? false : next(value), done, context);
    });
  }

  function skipLast(flow, count) {
    let array = toArray(flow);
    return new Aeroflow((next, done, context) => array[EMITTER](value => {
      for (let index = 0, limit = value.length - count; index < limit; index++) next(value[index]);
    }, done, context));
  }

  function skipWhile(flow, predicate) {
    return new Aeroflow((next, done, context) => {
      let index = 0,
          skipping = true;
      flow[EMITTER](value => {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        if (!skipping) next(value);
      }, done, context);
    });
  }

  function some(flow, predicate) {
    return new Aeroflow((next, done, context) => {
      let result = false;
      context = context.spawn();
      flow[EMITTER](value => {
        if (!predicate(value)) return;
        result = true;
        context.end();
      }, error => {
        next(result);
        done(error);
      }, context);
    });
  }

  function sort(flow, order, ...selectors) {
    if (isFunction(order)) {
      selectors.unshift(order);
      order = 1;
    }

    if (!selectors.every(isFunction)) throwError('Selector function expected.');

    switch (order) {
      case 'asc':
      case 1:
      case undefined:
      case null:
        order = 1;
        break;

      case 'desc':
      case -1:
        order = -1;
        break;

      default:
        order = order ? 1 : -1;
        break;
    }

    switch (selectors.length) {
      case 0:
        return sortStandard(flow, order);

      case 1:
        return sortWithSelector(flow, order, selectors[0]);

      default:
        return sortWithSelectors(flow, order, ...selectors);
    }
  }

  function sortStandard(flow, order) {
    let array = toArray(flow);
    return new Aeroflow((next, done, context) => array[EMITTER](values => order === 1 ? values.sort().forEach(next) : values.sort().reverse().forEach(next), done, context));
  }

  function sortWithSelector(flow, order, selector) {
    let array = toArray(flow),
        comparer = (left, right) => order * compare(selector(left), selector(right));

    return new Aeroflow((next, done, context) => array[EMITTER](values => values.sort(comparer).forEach(next), done, context));
  }

  function sortWithSelectors(flow, order, ...selectors) {
    let array = toArray(flow),
        count = selectors.length,
        comparer = (left, right) => {
      let index = -1;

      while (++index < count) {
        let selector = selectors[index],
            result = order * compare(selector(left), selector(right));
        if (result) return result;
      }

      return 0;
    };

    return new Aeroflow((next, done, context) => array[EMITTER](values => values.sort(comparer).forEach(next), done, context));
  }

  function takeFirst(flow, count) {
    return new Aeroflow((next, done, context) => {
      let index = 1;
      context = context.spawn();
      flow[EMITTER](value => {
        next(value);
        if (count <= index++) context.end();
      }, done, context);
    });
  }

  function takeLast(flow, count) {
    let array = toArray(flow);
    return new Aeroflow((next, done, context) => {
      array[EMITTER](value => {
        let limit = value.length,
            index = Math.max(length - 1 - count, 0);

        while (index < limit) next(value[index++]);
      }, done, context);
    });
  }

  function takeWhile(flow, predicate) {
    return new Aeroflow((next, done, context) => {
      let index = 0;
      context = context.spawn();
      flow[EMITTER](value => predicate(value, index++, context.data) ? next(value) : context.end(), done, context);
    });
  }

  function tap(flow, callback) {
    return new Aeroflow((next, done, context) => {
      let index = 0;
      flow[EMITTER](value => {
        callback(value, index++, context.data);
        next(value);
      }, done, context);
    });
  }

  function toArray(flow) {
    return new Aeroflow((next, done, context) => {
      let result = [];
      flow[EMITTER](value => result.push(value), error => {
        next(result);
        done(error);
      }, context);
    });
  }

  function toArrayExtended(flow, mapper) {
    return new Aeroflow((next, done, context) => {
      let index = 0,
          result = [];
      flow[EMITTER](value => result.push(mapper(value, index++, context.data)), error => {
        next(result);
        done(error);
      }, context);
    });
  }

  function toMap(flow) {
    return new Aeroflow((next, done, context) => {
      let result = new Map();
      flow[EMITTER](value => result.set(value, value), error => {
        next(result);
        done(error);
      }, context);
    });
  }

  function toMapExtended(flow, keyMapper, valueMapper) {
    return new Aeroflow((next, done, context) => {
      let index = 0,
          result = new Map();
      flow[EMITTER](value => result.set(keyMapper(value, index++, context.data), valueMapper(value, index++, context.data)), error => {
        next(result);
        done(error);
      }, context);
    });
  }

  function toSet(flow) {
    return new Aeroflow((next, done, context) => {
      let result = new Set();
      flow[EMITTER](value => result.add(value), error => {
        next(result);
        done(error);
      }, context);
    });
  }

  function toSetExtended(flow, mapper) {
    return new Aeroflow((next, done, context) => {
      let index = 0,
          result = new Set();
      flow[EMITTER](value => result.add(mapper(value, index++, context.data)), error => {
        next(result);
        done(error);
      }, context);
    });
  }

  module.exports = defineProperties(aeroflow, {
    create: {
      value: create
    },
    empty: {
      value: empty
    },
    expand: {
      value: expand
    },
    just: {
      value: just
    },
    random: {
      value: random
    },
    range: {
      value: range
    },
    repeat: {
      value: repeat
    }
  });
});
