'use strict';

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
        EMITTER = Symbol('emitter'),
        classof = Object.classof,
        defineProperties = Object.defineProperties,
        floor = Math.floor,
        now = Date.now,
        maxInteger = Number.MAX_SAFE_INTEGER,
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
        isSomething = value => null != value,
        noop = () => {};

  function makeContext(data) {
    let active = true,
        callbacks = [],
        context = value => {
      if (value !== undefined) if (value === false) {
        active = false;
        callbacks.forEach(callback => callback());
      } else if (isFunction(value)) active ? callbacks.push(value) : value();
      return active;
    };

    return defineProperties(context, {
      data: {
        value: data
      },
      spawn: {
        value: () => {
          let child = makeContext(data);
          context(child);
          return child;
        }
      }
    });
  }

  function makeLimiter(limiter) {
    return isNumber(limiter) ? (value, index) => index < limiter : isFunction(limiter) ? limiter : () => true;
  }

  function makeMapper(mapper) {
    return isFunction(mapper) ? mapper : identity;
  }

  function makePredicate(predicate) {
    return isNothing(predicate) ? isSomething : isFunction(predicate) ? predicate : isRegExp(predicate) ? value => predicate.test(value) : value => value === predicate;
  }

  function throwError(error) {
    throw isError(error) ? error : new Error(error);
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

    concat(...flows) {
      return concat(this, ...flows);
    }

    count() {
      return this.reduce(result => result + 1, 0);
    }

    delay(condition) {
      let delayer = isFunction(condition) ? condition : () => condition;
      return new Aeroflow((next, done, context) => {
        let completition = now(),
            index = 0;
        this[EMITTER](value => {
          let delay = delayer(value, index++, context.data),
              estimation;

          if (isDate(delay)) {
            estimation = delay;
            delay = delay - now();
          } else estimation = now() + delay;

          if (completition < estimation) completition = estimation;
          delay < 0 ? setImmediate(() => next(value)) : setTimeout(() => next(value), delay);
        }, error => {
          completition -= now();
          completition < 0 ? setImmediate(() => done(error)) : setTimeout(() => done(error), completition);
        }, context);
      });
    }

    dump(prefix, logger) {
      if (isFunction(prefix)) {
        logger = prefix;
        prefix = '';
      } else {
        if (!isFunction(logger)) logger = console.log.bind(console);
        prefix = isNothing(prefix) ? '' : prefix + ' ';
      }

      return new Aeroflow((next, done, context) => this[EMITTER](value => {
        logger(prefix + 'next', value);
        next(value);
      }, error => {
        error ? logger(prefix + 'done', error) : logger(prefix + 'done');
        done(error);
      }, context));
    }

    every(condition) {
      let predicate = makePredicate(condition);
      return new Aeroflow((next, done, context) => {
        let empty = true,
            result = true;
        context = context.spawn();
        this[EMITTER](value => {
          empty = false;

          if (!predicate(value)) {
            result = false;
            context(false);
          }
        }, error => {
          next(result && !empty);
          done(error);
        }, context);
      });
    }

    filter(condition) {
      let predicate = makePredicate(predicate);
      return new Aeroflow((next, done, context) => {
        let index = 0;
        this[EMITTER](value => predicate(value, index++, context.data) ? next(value) : false, done, context);
      });
    }

    first() {
      return new Aeroflow((next, done, context) => {
        context = context.spawn();
        this[EMITTER](value => {
          next(value);
          context(false);
        }, done, context);
      });
    }

    join(separator) {
      let joiner = isNothing(separator) ? ',' : isFunction(separator) ? separator : '' + separator;
      return this.reduce((result, value) => result.length ? result + joiner() + value : value, '');
    }

    last() {
      return new Aeroflow((next, done, context) => {
        let empty = true,
            result;
        this[EMITTER](value => {
          empty = false;
          result = value;
        }, error => {
          if (!empty) next(result);
          done(error);
        }, context);
      });
    }

    map(mapper) {
      mapper = makeMapper(mapper);
      return new Aeroflow((next, done, context) => {
        let index = 0;
        this[EMITTER](value => next(mapper(value, index++, context.data)), done, context);
      });
    }

    max() {
      return this.reduce((max, value) => value > max ? value : max);
    }

    mean() {
      let array = this.toArray();
      return new Aeroflow((next, done, context) => array[EMITTER](values => {
        if (values.length) {
          values.sort();
          next(values[floor(values.length / 2)]);
        }
      }, done, context));
    }

    min(valueSelector) {
      return this.reduce((min, value) => value < min ? value : min);
    }

    reduce(reducer, seed) {
      reducer = makeMapper(reducer);
      return new Aeroflow((next, done, context) => {
        let empty = true,
            index = 0,
            result;

        if (isSomething(seed)) {
          empty = false;
          result = seed;
        }

        this[EMITTER](value => {
          if (empty) {
            empty = false;
            index++;
            result = value;
          } else result = reducer(result, value, index++, context.data);
        }, error => {
          if (!empty) next(result);
          done(error);
        }, context);
      });
    }

    run(next, done, data) {
      let context = makeContext(data);
      if (!isFunction(done)) done = noop;
      if (!isFunction(next)) next = noop;
      setImmediate(() => this[EMITTER](next, error => {
        context(false);
        error ? done(error) : done();
      }, context));
      return this;
    }

    share(expiration) {
      let cache,
          expirator = isFunction(expiration) ? expiration : isNumber(expiration) ? () => expiration : () => maxInteger;
      return new Aeroflow((next, done, context) => {
        if (cache) {
          cache.forEach(next);
          done();
          return;
        }

        cache = [];
        this[EMITTER](value => {
          cache.push(value);
          next(value);
        }, error => {
          setTimeout(() => {
            cache = null;
          }, expirator(context.data));
          done(error);
        }, context);
      });
    }

    skip(condition) {
      if (isNothing(condition)) return new Aeroflow((next, done, context) => this[EMITTER](value => {}, done, context));
      let limiter = makeLimiter(condition);
      return new Aeroflow((next, done, context) => {
        let index = 0,
            limited = true;
        this[EMITTER](value => {
          if (limited && !limiter(value, index++, context.data)) limited = false;
          if (!limited) next(value);
        }, done, context);
      });
    }

    some(predicate) {
      predicate = makePredicate(predicate);
      return new Aeroflow((next, done, context) => {
        let result = false;
        context = context.spawn();
        this[EMITTER](value => {
          if (predicate(value)) {
            result = true;
            context(false);
          }
        }, error => {
          next(result);
          done(error);
        }, context);
      });
    }

    sort(...comparers) {
      return sort(this, ...comparers);
    }

    sum() {
      return this.reduce((result, value) => result + value, 0);
    }

    take(condition) {
      if (isNothing(condition)) return this;
      let limiter = makeLimiter(condition);
      return new Aeroflow((next, done, context) => {
        let index = 0;
        context = context.spawn();
        this[EMITTER](value => limiter(value, index++, context.data) ? next(value) : context(false), done, context);
      });
    }

    tap(callback) {
      return isFunction(callback) ? new Aeroflow((next, done, context) => {
        let index = 0;
        this[EMITTER](value => {
          callback(value, index++, context.data);
          next(value);
        }, done, context);
      }) : this;
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
      mapper = makeMapper(mapper);
      return new Aeroflow((next, done, context) => {
        let index = 0,
            result = [];
        this[EMITTER](value => result.push(mapper(value, index++, context.data)), error => {
          next(result);
          done(error);
        }, context);
      });
    }

    toSet(mapper) {
      mapper = makeMapper(mapper);
      return new Aeroflow((next, done, context) => {
        let index = 0,
            result = new Set();
        this[EMITTER](value => result.add(mapper(value, index++, context.data)), error => {
          next(result);
          done(error);
        }, context);
      });
    }

    toMap(keyMapper, valueMapper) {
      keyMapper = isFunction(keyMapper) ? keyMapper : value => isArray(value) && 2 === value.length ? value[0] : value;
      valueMapper = isFunction(valueMapper) ? valueMapper : value => isArray(value) && 2 === value.length ? value[1] : value;
      return new Aeroflow((next, done, context) => {
        let index = 0,
            result = new Map();
        this[EMITTER](value => result.set(keyMapper(value, index, context.data), valueMapper(value, index++, context.data)), error => {
          next(result);
          done(error);
        }, context);
      });
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

  let empty = new Aeroflow((next, done) => done());

  function aeroflow(source) {
    if (isAeroflow(source)) return source;
    if (isArray(source)) return fromArray(source);
    if (isFunction(source)) return fromFunction(source);
    if (isPromise(source)) return fromPromise(source);
    if (isIterable(source)) return fromIterable(source);
    return aeroflow.just(source);
  }

  function concat(...flows) {
    let queue = [...flows];
    return new Aeroflow((next, done, context) => {
      !(function proceed() {
        queue.length ? aeroflow(queue.shift())[EMITTER](next, proceed, context) : done();
      })();
    });
  }

  function create(emitter) {
    return isFunction(emitter) ? new Aeroflow((next, done, context) => {
      let completed = false;
      emitter(value => {
        if (context()) next();
      }, error => {
        if (!completed) {
          completed = true;
          done();
          context(false);
        }
      });
    }) : empty;
  }

  function expand(callback, seed, limit) {
    limit = limit || maxInteger;
    let expander = isFunction(callback) ? callback : identity;
    return new Aeroflow((next, done, context) => {
      let counter = limit,
          index = 0,
          value = seed;

      while (0 < counter-- && context()) next(value = expander(value, index++, context.data));

      done();
    });
  }

  function fromArray(source) {
    return new Aeroflow((next, done, context) => {
      let index = -1;

      while (context() && ++index < source.length) next(source[index]);

      done();
    });
  }

  function fromFunction(source) {
    return new Aeroflow((next, done, context) => aeroflow(source())[EMITTER](next, done, context));
  }

  function fromIterable(source) {
    return new Aeroflow((next, done, context) => {
      let iterator = source[Symbol.iterator]();

      while (context()) {
        let result = iterator.next();
        if (result.done) break;else next(result.value);
      }

      done();
    });
  }

  function fromPromise(source) {
    return new Aeroflow((next, done, context) => source.then(value => aeroflow(value)[EMITTER](next, done, context), error => {
      done(error);
      throwError(error);
    }));
  }

  function just(value) {
    return new Aeroflow((next, done) => {
      next(value);
      done();
    });
  }

  function random(min, max, limit) {
    limit = limit || maxInteger;
    min = +min || 0;
    max = +max || 1;
    max -= min;
    return isInteger(min) && isInteger(max) ? new Aeroflow((next, done, context) => {
      let counter = limit;

      while (0 < counter-- && context()) next(floor(min + max * Math.random()));

      done();
    }) : new Aeroflow((next, done, context) => {
      let counter = limit;

      while (0 < counter-- && context()) next(min + max * Math.random());

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

  function repeat(repeater, limit) {
    limit = limit || maxInteger;
    return isFunction(repeater) ? new Aeroflow((next, done, context) => {
      let counter = limit;
      proceed();

      function onDone(error) {
        if (error) {
          done();
          throwError(error);
        } else if (counter && context()) setImmediate(proceed);else done();
      }

      function proceed() {
        if (0 < counter--) {
          let result = context() && repeater(context.data);
          if (result === false) done();else aeroflow(result)[EMITTER](next, onDone, context);
        } else done();
      }
    }) : new Aeroflow((next, done, context) => {
      let counter = limit;

      while (0 < counter-- && context()) next(repeater);

      done();
    });
  }

  function sort(flow, ...comparers) {
    comparers = comparers.filter(isFunction);

    switch (comparers.length) {
      case 0:
        return sortWithoutComparer(flow);

      case 1:
        return sortWithComparer(flow, comparers[0]);

      default:
        return sortWithComparers(flow, comparers);
    }
  }

  function sortWithComparer(flow, comparer) {
    let array = flow.toArray();
    return new Aeroflow((next, done, context) => array[EMITTER](values => values.length ? values.sort(comparer).forEach(next) : false, done, context));
  }

  function sortWithComparers(flow, ...comparers) {
    let array = flow.toArray(),
        comparer = comparers.reduce((previous, current) => (left, right) => {
      let result = previous(left, right);
      return result ? result : current(left, right);
    });
    return new Aeroflow((next, done, context) => array[EMITTER](values => values.length ? values.sort(comparer).forEach(next) : false, done, context));
  }

  function sortWithoutComparer(flow) {
    let array = flow.toArray();
    return new Aeroflow((next, done, context) => array[EMITTER](values => values.length ? values.sort().forEach(next) : false, done, context));
  }

  module.exports = defineProperties(aeroflow, {
    concat: {
      value: concat
    },
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
    },
    sort: {
      value: sort
    }
  });
});
