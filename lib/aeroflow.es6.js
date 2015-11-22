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
  const CLASS_AEROFLOW = 'Aeroflow',
        CLASS_ARRAY = 'Array',
        CLASS_DATE = 'Date',
        CLASS_ERROR = 'Error',
        CLASS_FUNCTION = 'Function',
        CLASS_NUMBER = 'Number',
        CLASS_PROMISE = 'Promise',
        CLASS_REG_EXP = 'RegExp',
        SYMBOL_CLASS = Symbol('class'),
        SYMBOL_EMITTER = Symbol('emitter'),
        SYMBOL_TO_STRING_TAG = Symbol.toStringTag;
  const classof = Object.classof,
        defineProperties = Object.defineProperties,
        floor = Math.floor,
        isInteger = Number.isInteger,
        maxInteger = Number.MAX_SAFE_INTEGER,
        now = Date.now;

  const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0,
        constant = value => () => value,
        identity = value => value,
        isDate = value => CLASS_DATE === classof(value),
        isError = value => CLASS_ERROR === classof(value),
        isFunction = value => CLASS_FUNCTION === classof(value),
        isNothing = value => value == null,
        isNumber = value => CLASS_NUMBER === classof(value),
        isPromise = value => CLASS_PROMISE === classof(value),
        isRegExp = value => CLASS_REG_EXP === classof(value),
        noop = () => {},
        throwError = error => {
    throw isError(error) ? error : new Error(error);
  };

  let empty;

  class Aeroflow {
    constructor(emitter) {
      defineProperties(this, {
        [SYMBOL_EMITTER]: {
          value: emitter
        },
        [SYMBOL_TO_STRING_TAG]: {
          value: CLASS_AEROFLOW
        }
      });
    }

    append(...sources) {
      return aeroflow(this, ...sources);
    }

    count() {
      return new Aeroflow(reduce(this[SYMBOL_EMITTER], result => result + 1, 0));
    }

    delay(condition) {
      return new Aeroflow(isFunction(condition) ? delayExtended(this[SYMBOL_EMITTER], condition) : isDate(condition) ? delayExtended(this[SYMBOL_EMITTER], () => Math.max(condition - new Date(), 0)) : delay(this[SYMBOL_EMITTER], Math.max(+condition || 0, 0)));
    }

    dump(prefix, logger) {
      let arity = arguments.length,
          emitter = this[SYMBOL_EMITTER];
      return new Aeroflow(arity === 0 ? dumpToConsole(emitter, '') : arity === 1 ? isFunction(prefix) ? dump(emitter, '', prefix) : dumpToConsole(emitter, '') : isFunction(logger) ? isNothing(prefix) ? dump(emitter, '', logger) : dump(emitter, prefix, logger) : dumpToConsole(emitter, prefix));
    }

    every(predicate) {
      return new Aeroflow(every(this[SYMBOL_EMITTER], isNothing(predicate) ? value => !!value : isFunction(predicate) ? predicate : isRegExp(predicate) ? value => predicate.test(value) : value => value === predicate));
    }

    filter(predicate) {
      return new Aeroflow(filter(this[SYMBOL_EMITTER], isNothing(predicate) ? value => !!value : isFunction(predicate) ? predicate : isRegExp(predicate) ? value => predicate.test(value) : value => value === predicate));
    }

    join(separator) {
      return new Aeroflow(join(this[SYMBOL_EMITTER], arguments.length ? isFunction(separator) ? separator : () => '' + separator : () => ','));
    }

    map(mapper) {
      return arguments.length ? new Aeroflow(map(this[SYMBOL_EMITTER], isFunction(mapper) ? mapper : () => mapper)) : this;
    }

    max() {
      return new Aeroflow(reduceAlong(this[SYMBOL_EMITTER], (max, value) => value > max ? value : max));
    }

    mean() {
      return new Aeroflow((next, done, context) => toArray(this[SYMBOL_EMITTER])(values => {
        if (!values.length) return;
        values.sort();
        next(values[floor(values.length / 2)]);
      }, done, context));
    }

    min() {
      return new Aeroflow(reduceAlong(this[SYMBOL_EMITTER], (min, value) => value < min ? value : min));
    }

    prepend(...sources) {
      return aeroflow(...sources, this);
    }

    reduce(reducer, seed) {
      switch (arguments.length) {
        case 0:
          return empty;

        case 1:
          return isFunction(reducer) ? new Aeroflow(reduceAlong(this[SYMBOL_EMITTER], reducer)) : just(reducer);

        default:
          return isFunction(reducer) ? new Aeroflow(reduce(this[SYMBOL_EMITTER], reducer, seed)) : just(reducer);
      }
    }

    run(next, done, data) {
      setImmediate(() => run(this[SYMBOL_EMITTER], isFunction(next) ? next : noop, isFunction(done) ? done : noop, createContext(this, data)));
      return this;
    }

    skip(condition) {
      return arguments.length ? isNumber(condition) ? condition === 0 ? this : new Aeroflow(condition > 0 ? skipFirst(this[SYMBOL_EMITTER], condition) : skipLast(this[SYMBOL_EMITTER], condition)) : isFunction(condition) ? new Aeroflow(skipWhile(this[SYMBOL_EMITTER], condition)) : condition ? new Aeroflow(skipAll(this[SYMBOL_EMITTER])) : this : new Aeroflow(skipAll(this[SYMBOL_EMITTER]));
    }

    some(predicate) {
      return some(this[SYMBOL_EMITTER], arguments.length ? isFunction(predicate) ? predicate : isRegExp(predicate) ? value => predicate.test(value) : value => value === predicate : value => !!value);
    }

    sum() {
      return reduce(this[SYMBOL_EMITTER], (result, value) => result + value, 0);
    }

    take(condition) {
      return arguments.length ? isNumber(condition) ? condition === 0 ? empty : new Aeroflow(condition > 0 ? takeFirst(this[SYMBOL_EMITTER], condition) : takeLast(this[SYMBOL_EMITTER], condition)) : isFunction(condition) ? new Aeroflow(takeWhile(this[SYMBOL_EMITTER], condition)) : condition ? this : empty : this;
    }

    tap(callback) {
      return isFunction(callback) ? tap(this[SYMBOL_EMITTER], callback) : this;
    }

    timestamp() {
      return new Aeroflow(timestamp(this[SYMBOL_EMITTER]));
    }

    toArray(mapper) {
      return new Aeroflow(arguments.length ? isFunction(mapper) ? toArrayExtended(this[SYMBOL_EMITTER], mapper) : toArrayExtended(this[SYMBOL_EMITTER], constant(mapper)) : toArray(this[SYMBOL_EMITTER]));
    }

    toMap(keyMapper, valueMapper) {
      let arity = arguments.length,
          emitter = this[SYMBOL_EMITTER];
      return new Aeroflow(arity === 0 ? toMap(emitter) : toMapExtended(emitter, isFunction(keyMapper) ? keyMapper : constant(keyMapper), arity === 1 ? identity : isFunction(valueMapper) ? keyMapper : constant(valueMapper)));
    }

    toSet(mapper) {
      let emitter = this[SYMBOL_EMITTER];
      return new Aeroflow(arguments.length === 0 ? toSet(emitter) : toSetExtended(emitter, isFunction(mapper) ? mapper : constant(mapper)));
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

        switch (classof(source)) {
          case CLASS_AEROFLOW:
            return source[SYMBOL_EMITTER];

          case CLASS_ARRAY:
            return emitArray(source);

          case CLASS_FUNCTION:
            return emitFunction(source);

          case CLASS_PROMISE:
            return emitPromise(source);

          default:
            return Object.isObject(source) && Symbol.iterator in source ? emitIterable(source) : emitJust(source);
        }

        break;

      default:
        return (next, done, context) => {
          let limit = sources.length,
              index = -1,
              proceed = () => {
            ++index < limit ? emit(sources[index])(next, proceed, context) : done();
          };

          proceed();
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
    return (next, done) => {
      done();
      return true;
    };
  }

  function emitFunction(source) {
    return (next, done, context) => emit(source(context.data))(next, done, context);
  }

  function emitIterable(source) {
    return (next, done, context) => {
      let iteration,
          iterator = source[Symbol.iterator]();

      while (context() && !(iteration = iterator.next()).done) next(iteration.value);

      done();
    };
  }

  function emitJust(value) {
    return (next, done) => {
      let result = next(value);
      done();
      return result;
    };
  }

  function emitPromise(source) {
    return (next, done, context) => source.then(value => emit(value)(next, done, context), error => {
      done(error);
      throwError(error);
    });
  }

  function expand(expander, seed) {
    return new Aeroflow(isFunction(expander) ? (next, done, context) => {
      let index = 0,
          value = seed;

      while (context()) next(value = expander(value, index++, context.data));

      done();
    } : repeatStatic(expander));
  }

  function just(value) {
    return new Aeroflow(emitJust(value));
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

  function range(inclusiveStart, inclusiveEnd, step) {
    inclusiveEnd = +inclusiveEnd || maxInteger;
    inclusiveStart = +inclusiveStart || 0;
    step = +step || (inclusiveStart < inclusiveEnd ? 1 : -1);
    return inclusiveStart === inclusiveEnd ? just(inclusiveStart) : new Aeroflow((next, done, context) => {
      let i = inclusiveStart - step;
      if (inclusiveStart < inclusiveEnd) while (context() && (i += step) <= inclusiveEnd) next(i);else while (context() && (i += step) >= inclusiveEnd) next(i);
      done();
    });
  }

  function repeat(value) {
    return new Aeroflow(isFunction(value) ? repeatDynamic(value) : repeatStatic(value));
  }

  function repeatDynamic(repeater) {
    return (next, done, context) => {
      let index = 0,
          result;

      while (context() && false !== (result = repeater(index++, context.data))) next(result);

      done();
    };
  }

  function repeatStatic(value) {
    return (next, done, context) => {
      while (context()) next(value);

      done();
    };
  }

  function delay(emitter, interval) {
    return (next, done, context) => emitter(value => new Promise(resolve => setTimeout(() => resolve(next(value)), interval)), error => new Promise(resolve => setTimeout(() => resolve(done(error)), interval)), context);
  }

  function delayExtended(emitter, selector) {
    return (next, done, context) => {
      let completition = now(),
          index = 0;
      emitter(value => {
        let interval = selector(value, index++, context.data),
            estimation;

        if (isDate(interval)) {
          estimation = interval;
          interval = interval - now();
        } else estimation = now() + interval;

        if (completition < estimation) completition = estimation;
        return new Promise(resolve => setTimeout(() => resolve(next(value)), Math.max(interval, 0)));
      }, error => {
        completition -= now();
        return new Promise(resolve => setTimeout(() => resolve(done(error)), Math.max(completition, 0)));
      }, context);
    };
  }

  function dump(emitter, prefix, logger) {
    return (next, done, context) => emitter(value => {
      logger(prefix + 'next', value);
      next(value);
    }, error => {
      error ? logger(prefix + 'done', error) : logger(prefix + 'done');
      done(error);
    }, context);
  }

  function dumpToConsole(emitter, prefix) {
    return (next, done, context) => emitter(value => {
      console.log(prefix + 'next', value);
      next(value);
    }, error => {
      error ? console.error(prefix + 'done', error) : console.log(prefix + 'done');
      done(error);
    }, context);
  }

  function every(emitter, predicate) {
    return (next, done, context) => {
      let idle = true,
          result = true;
      context = context.spawn();
      emitter(value => {
        idle = false;
        if (!predicate(value)) return;
        result = false;
        context.end();
      }, error => {
        next(result && !idle);
        done(error);
      }, context);
    };
  }

  function filter(emitter, predicate) {
    return (next, done, context) => {
      let index = 0;
      emitter(value => predicate(value, index++, context.data) ? next(value) : true, done, context);
    };
  }

  function join(emitter, joiner) {
    return reduceOptional(emitter, (result, value, index, data) => result.length ? result + joiner(value, index, data) + value : value, '');
  }

  function map(emitter, mapper) {
    return (next, done, context) => {
      let index = 0;
      emitter(value => next(mapper(value, index++, context.data)), done, context);
    };
  }

  function reduce(emitter, reducer, seed) {
    return (next, done, context) => {
      let index = 0,
          result = seed;
      emitter(value => result = reducer(result, value, index++, context.data), error => {
        next(result);
        done(error);
      }, context);
    };
  }

  function reduceAlong(emitter, reducer) {
    return (next, done, context) => {
      let idle = true,
          index = 1,
          result;
      emitter(value => {
        if (idle) {
          idle = false;
          result = value;
        } else result = reducer(result, value, index++, context.data);
      }, error => {
        if (!idle) next(result);
        done(error);
      }, context);
    };
  }

  function reduceOptional(emitter, reducer, seed) {
    return (next, done, context) => {
      let idle = true,
          index = 0,
          result = seed;
      emitter(value => {
        idle = false;
        result = reducer(result, value, index++, context.data);
      }, error => {
        if (!idle) next(result);
        done(error);
      }, context);
    };
  }

  function run(emitter, next, done, context) {
    let index = 0;
    emitter(value => next(value, index++, context), error => {
      context.end();
      done(error, index, context);
    }, context);
  }

  function skipAll(emitter) {
    return (next, done, context) => emitter(noop, done, context);
  }

  function skipFirst(emitter, count) {
    return (next, done, context) => {
      let index = -1;
      emitter(value => ++index < count ? false : next(value), done, context);
    };
  }

  function skipLast(emitter, count) {
    return (next, done, context) => toArray(emitter)(value => {
      for (let index = 0, limit = value.length - count; index < limit; index++) next(value[index]);
    }, done, context);
  }

  function skipWhile(emitter, predicate) {
    return (next, done, context) => {
      let index = 0,
          skipping = true;
      emitter(value => {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        if (!skipping) next(value);
      }, done, context);
    };
  }

  function some(emitter, predicate) {
    return (next, done, context) => {
      let result = false;
      context = context.spawn();
      emitter(value => {
        if (!predicate(value)) return;
        result = true;
        context.end();
      }, error => {
        next(result);
        done(error);
      }, context);
    };
  }

  function takeFirst(emitter, count) {
    return (next, done, context) => {
      let index = 1;
      context = context.spawn();
      emitter(value => {
        next(value);
        if (count <= index++) context.end();
      }, done, context);
    };
  }

  function takeLast(emitter, count) {
    return (next, done, context) => toArray(emitter)(value => {
      let limit = value.length,
          index = Math.max(length - 1 - count, 0);

      while (index < limit) next(value[index++]);
    }, done, context);
  }

  function takeWhile(emitter, predicate) {
    return (next, done, context) => {
      let index = 0;
      context = context.spawn();
      emitter(value => predicate(value, index++, context.data) ? next(value) : context.end(), done, context);
    };
  }

  function tap(emitter, callback) {
    return (next, done, context) => {
      let index = 0;
      emitter(value => {
        callback(value, index++, context.data);
        return next(value);
      }, done, context);
    };
  }

  function timestamp(emitter) {
    return new Aeroflow((next, done, context) => {
      let past = now();
      emitter(value => {
        let current = now();
        next({
          timedelta: current - past,
          timestamp: now,
          value
        });
        past = current;
      }, done, context);
    });
  }

  function toArray(emitter) {
    return (next, done, context) => {
      let result = [];
      emitter(value => result.push(value), error => {
        next(result);
        done(error);
      }, context);
    };
  }

  function toArrayExtended(emitter, mapper) {
    return (next, done, context) => {
      let index = 0,
          result = [];
      emitter(value => result.push(mapper(value, index++, context.data)), error => {
        next(result);
        done(error);
      }, context);
    };
  }

  function toMap(emitter) {
    return (next, done, context) => {
      let result = new Map();
      emitter(value => result.set(value, value), error => {
        next(result);
        done(error);
      }, context);
    };
  }

  function toMapExtended(emitter, keyMapper, valueMapper) {
    return (next, done, context) => {
      let index = 0,
          result = new Map();
      emitter(value => result.set(keyMapper(value, index++, context.data), valueMapper(value, index++, context.data)), error => {
        next(result);
        done(error);
      }, context);
    };
  }

  function toSet(emitter) {
    return (next, done, context) => {
      let result = new Set();
      emitter(value => result.add(value), error => {
        next(result);
        done(error);
      }, context);
    };
  }

  function toSetExtended(emitter, mapper) {
    return (next, done, context) => {
      let index = 0,
          result = new Set();
      emitter(value => result.add(mapper(value, index++, context.data)), error => {
        next(result);
        done(error);
      }, context);
    };
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
