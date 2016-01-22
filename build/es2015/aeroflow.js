/**
* Returns new flow emitting values from this flow first and then from all provided sources without interleaving them.
* @alias Aeroflow#append
* @public @instance
*
* @param {...any} [sources] Value sources to append to this flow.
* @return {Aeroflow} new flow.
*
* @example
* aeroflow(1).concat(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
* // next 1
* // next 2
* // next 3
* // next 4
* // next 5
* // next 6 // after 500ms
* // done
*/
function append(...sources) {
  return aeroflow(this, ...sources);
}

const emptyEmitter = () => (next, done) => done();
const empty = flow(emptyEmitter());

// Returns function emitting single value.
const justEmitter = value => (next, done) => {
  next(value);
  done();
};

/**
  * Returns new flow emitting the provided value only.
  * @static
  * 
  * @param {any} value The value to emit.
  *
  * @example
  * aeroflow.just('test').dump().run();
  * // next "test"
  * // done
  * aeroflow.just(() => 'test').dump().run();
  * // next "test"
  * // done
  */
const just = value => flow(justEmitter(value));

const AEROFLOW = 'Aeroflow';
const ARRAY = 'Array';
const CLASS = Symbol.toStringTag;
const DATE = 'Date';
const EMITTER = Symbol('emitter');
const FUNCTION = 'Function';
const ITERATOR = Symbol.iterator;
const NUMBER = 'Number';
const PROMISE = 'Promise';
const PROTOTYPE = 'prototype';
const REGEXP = 'RegExp';

const classOf = value => Object.prototype.toString.call(value).slice(8, -1);
const classIs = className => value => classOf(value) === className;
const constant = value => () => value;
const dateNow = Date.now;
const identity = value => value;
const isDate = classIs(DATE);
const isFunction = classIs(FUNCTION);
const isInteger = Number.isInteger;
const isNothing = value => value == null;
const isNumber = classIs(NUMBER);
const isObject = Object.isObject;
const isRegExp = classIs(REGEXP);
const mathFloor = Math.floor;
const mathRandom = Math.random;
const maxInteger = Number.MAX_SAFE_INTEGER;
const mathMax = Math.max;
const noop = () => {};
const objectDefineProperties = Object.defineProperties;
const objectDefineProperty = Object.defineProperty;

const reduceEmitter = (emitter, reducer, seed) => (next, done, context) => {
  let index = 0, result = seed;
  emitter(
    value => result = reducer(result, value, index++, context.data),
    error => {
      next(result);
      done(error);
    },
    context);
};

const reduceAlongEmitter = (emitter, reducer) => (next, done, context) => {
  let idle = true, index = 1, result;
  emitter(
    value => {
      if (idle) {
        idle = false;
        result = value;
      }
      else result = reducer(result, value, index++, context.data);
    },
    error => {
      if (!idle) next(result);
      done(error);
    },
    context);
};

const reduceOptionalEmitter = (emitter, reducer, seed) => (next, done, context) => {
  let idle = true, index = 0, result = seed;
  emitter(
    value => {
      idle = false;
      result = reducer(result, value, index++, context.data);
    },
    error => {
      if (!idle) next(result);
      done(error);
    },
    context);
};

/**
* Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,
* returns new flow emitting reduced value.
*
* @param {function|any} reducer Function to execute on each emitted value, taking four arguments:
*   result - the value previously returned in the last invocation of the reducer, or seed, if supplied
*   value - the current value emitted by this flow
*   index - the index of the current value emitted by the flow
*   context.data.
*   If is not a function, a flow emitting just reducer value will be returned.
* @param {any} initial Value to use as the first argument to the first call of the reducer.
*
* @example
* aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
* aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
*/
function reduce(reducer, seed) {
  switch (arguments.length) {
    case 0:
      return empty;
    case 1:
      return isFunction(reducer)
        ? flow(reduceAlongEmitter(this[EMITTER], reducer))
        : just(reducer)
    default:
      return isFunction(reducer)
        ? flow(reduceEmitter(this[EMITTER], reducer, seed))
        : just(reducer)
  }
}

const countEmitter = emitter => reduceEmitter(emitter, result => result + 1, 0);

/**
* Counts the number of values emitted by this flow, returns new flow emitting only this value.
*
* @example
* aeroflow(['a', 'b', 'c']).count().dump().run();
* // next 3
* // done
*/
function count() {
  return flow(countEmitter(this[EMITTER]));
}

const delayEmitter = (emitter, interval) => (next, done, context) => emitter(
  value => new Promise(resolve =>
    setTimeout(
      () => resolve(next(value)),
      interval)),
  error => new Promise(resolve =>
    setTimeout(
      () => resolve(done(error)),
      interval)),
  context);

const delayDynamicEmitter = (emitter, selector) => (next, done, context) => {
  let completition = dateNow(), index = 0;
  emitter(
    value => {
      let interval = selector(value, index++, context.data), estimation;
      if (isDate(interval)) {
        estimation = interval;
        interval = interval - dateNow();
      }
      else estimation = dateNow() + interval;
      if (completition < estimation)
        completition = estimation;
      return new Promise(resolve => setTimeout(
        () => resolve(next(value)),
        mathMax(interval, 0)));
    },
    error => {
      completition -= dateNow();
      return new Promise(resolve => setTimeout(
        () => resolve(done(error)),
        mathMax(completition, 0)));
    },
    context);
};

/**
  * Returns new flow delaying emission of each value accordingly provided condition.
  *
  * @param {number|date|function} [condition] The condition used to determine delay for each subsequent emission.
  *   Number is threated as milliseconds interval (negative number is considered as 0).
  *   Date is threated as is (date in past is considered as now).
  *   Function is execute for each emitted value, with three arguments:
  *     value - The current value emitted by this flow
  *     index - The index of the current value
  *     context - The context object
  *   The result of condition function will be converted nu number and used as milliseconds interval.
  *
  * @example:
  * aeroflow(1).delay(500).dump().run();
  * // next 1 // after 500ms
  * // done
  * aeroflow(1, 2).delay(new Date + 500).dump().run();
  * // next 1 // after 500ms
  * // next 2
  * // done
  * aeroflow([1, 2, 3]).delay((value, index) => index * 500).dump().run();
  * // next 1
  * // next 2 // after 500ms
  * // next 3 // after 1000ms
  * // done
  */
function delay(condition) {
  return flow(isFunction(condition)
    ? delayDynamicEmitter(
        this[EMITTER],
        condition)
    : isDate(condition)
      ? delayDynamicEmitter(
          this[EMITTER],
          () => mathMax(condition - new Date, 0))
      : delayEmitter(
          this[EMITTER],
          mathMax(+condition || 0, 0)));
}

const dumpToConsoleEmitter = (emitter, prefix) => (next, done, context) => emitter(
  value => {
    console.log(prefix + 'next', value);
    next(value);
  },
  error => {
    error
      ? console.error(prefix + 'done', error)
      : console.log(prefix + 'done');
    done(error);
  },
  context);

const dumpToLoggerEmitter = (emitter, prefix, logger) => (next, done, context) => emitter(
  value => {
    logger(prefix + 'next', value);
    next(value);
  },
  error => {
    error
      ? logger(prefix + 'done', error)
      : logger(prefix + 'done');
    done(error);
  },
  context);

/**
  * Dumps all events emitted by this flow to the `logger` with optional prefix.
  *
  * @param {string} [prefix=''] A string prefix prepended to each event name.
  * @param {function} [logger=console.log] Function to execute for each event emitted, taking two arguments:
  *   event - The name of event emitted prepended with prefix (next or done).
  *   value - The value (next event) or error (done event) emitted by this flow.
  *
  * @example
  * aeroflow(1, 2, 3).dump('test ', console.info.bind(console)).run();
  * // test next 1
  * // test next 2
  * // test next 3
  * // test done
  */
function dump(prefix, logger) {
  return flow(arguments.length === 0
    ? dumpToConsoleEmitter(
        this[EMITTER],
        '')
    : arguments.length === 1
      ? isFunction(prefix)
        ? dumpToLoggerEmitter(
            this[EMITTER],
            '',
            prefix)
        : dumpToConsoleEmitter(
            this[EMITTER],
            '')
      : isFunction(logger)
        ? isNothing(prefix)
          ? dumpToLoggerEmitter(
              this[EMITTER],
              '',
              logger)
          : dumpToLoggerEmitter(
              this[EMITTER],
              prefix,
              logger)
        : dumpToConsoleEmitter(
            this[EMITTER],
            prefix));
}

const everyEmitter = (emitter, predicate) => (next, done, context) => {
  let idle = true, result = true;
  context = context.spawn();
  emitter(
    value => {
      idle = false;
      if (!predicate(value))
        return;
      result = false;
      context.done();
    },
    error => {
      next(result && !idle);
      done(error);
    },
    context);
};

/**
  * Tests whether all values emitted by this flow pass the predicate test, returns flow emitting true if the predicate returns true for all emitted values; otherwise, false.
  *
  * @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
  *   or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.
  * @returns {Aeroflow} New flow that emits true or false.
  *
  * @example
  * aeroflow(1).every().dump().run();
  * // next true
  * // done
  * aeroflow.range(1, 3).every(2).dump().run();
  * // next false
  * // done
  * aeroflow.range(1, 3).every(value => value % 2).dump().run();
  * // next false
  * // done
  */
function every(predicate) {
  return flow(everyEmitter(
    this[EMITTER],
    isNothing(predicate)
      ? value => !!value
      : isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate));
}

const filterEmitter = (emitter, predicate) => (next, done, context) => {
  let index = 0;
  emitter(
    value => predicate(value, index++, context.data)
      ? next(value)
      : true,
    done,
    context);
};

/**
  * Returns new from emitting inly values that pass the test implemented by the provided predicate.
  *
  * @param {function|regexp|any} [predicate] The test applied to each emitted value.
  *
  * @example
  * aeroflow(0, 1).filter().dump().run();
  * // next 1
  * // done
  * aeroflow('a', 'b', 'a').filter(/a/).dump().run();
  * // next "a"
  * // next "a"
  * // done
  * aeroflow('a', 'b', 'b').filter('b').dump().run();
  * // next "b"
  * // next "b"
  * // done
  */
function filter(predicate) {
  return flow(filterEmitter(
    this[EMITTER],
    isNothing(predicate)
      ? value => !!value
      : isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate));
}

const joinEmitter = (emitter, joiner) => reduceOptionalEmitter(
  emitter,
  (result, value, index, data) => result.length
    ? result + joiner(value, index, data) + value 
    : value,
  '');

function join(separator) {
  return flow(joinEmitter(
    this[EMITTER],
    arguments.length
    ? isFunction(separator)
      ? separator
      : () => '' + separator
    : () => ','));
}

const mapEmitter = (emitter, mapper) => (next, done, context) => {
  let index = 0;
  emitter(
    value => next(mapper(value, index++, context.data)),
    done,
    context);
}

function map(mapper) {
  return arguments.length
    ? flow(mapEmitter(
        this[EMITTER],
        isFunction(mapper)
          ? mapper
          : constant(mapper)))
    : this;
}

const maxEmitter = emitter => reduceAlongEmitter(
  emitter,
  (maximum, value) => value > maximum ? value : maximum);

/**
  * Determines the maximum value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 2, 3]).max().dump().run();
  * // next 3
  * // done
  */
function max() {
  return flow(maxEmitter(this[EMITTER]));
}

const minEmitter = emitter => reduceAlongEmitter(
  emitter,
  (minimum, value) => value < minimum ? value : minimum);

/**
  * Determine the minimum value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 2, 3]).min().dump().run();
  * // next 1
  * // done
  */
function min() {
  return flow(minEmitter(this[EMITTER]));
}

/**
* Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.
* @param {...any} [sources] Values to concatenate with this flow.
* @example
* aeroflow(1).prepend(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
* // next 2
* // next 3
* // next 4
* // next 5
* // next 6 // after 500ms
* // next 1
* // done
*/
function prepend(...sources) {
  return aeroflow(...sources, this);
}

const CALLBACKS = Symbol('callbacks');
const COMPLETED = Symbol('completed');

class Context {
  constructor(flow, data) {
    objectDefineProperties(this, {
      [CALLBACKS]: { value: [] },
      data: { value: data },
      flow: { value: flow }
    });
  }
  get active() {
    return !this[COMPLETED];
  }
  done() {
    if (this[COMPLETED]) return false;
    objectDefineProperty(this[COMPLETED], { value: true});
    const callbacks = this[CALLBACKS];
    callbacks.forEach(callback => callback());
    this[CALLBACKS].length = 0;
    return true;
  }
  spawn() {
    if (this[COMPLETED]) return;
    const context = new Context(this.flow, this.data);
    this[CALLBACKS].push(() => context.done());
    return context;
  }
  track(callback) {
    if (!isFunction(callback)) return;
    if (this[COMPLETED]) callback();
    else this[CALLBACKS].push(callback);
  }
}

/**
 * Runs this flow asynchronously, initiating source to emit values,
 * applying declared operators to emitted values and invoking provided callbacks.
 * If no callbacks provided, runs this flow for its side-effects only.
 *
 * @param {function} [next] Callback to execute for each emitted value, taking two arguments: value, context.
 * @param {function} [done] Callback to execute as emission is complete, taking two arguments: error, context.
 * @param {function} [data] Arbitrary value passed to each callback invoked by this flow as context.data.
 *
 * @example
 * aeroflow.range(1, 3).run(
 *   value => console.log('next', value),
 *   error => console.log('done', error));
 * // next 1
 * // next 2
 * // next 3
 * // done undefined
 */
function run(next, done, data) {
  if (!isFunction(done)) done = noop;
  if (!isFunction(next)) next = noop;
  const context = new Context(this, data), emitter = this[EMITTER];
  setImmediate(() => {
    let index = 0;
    emitter(
      value => next(value, index++, context),
      error => {
        context.done();
        done(error, index, context);
      },
      context);
  });
  return this;
}

const toArrayEmitter = emitter => (next, done, context) => {
  let result = [];
  emitter(
    value => result.push(value),
    error => {
      next(result);
      done(error);
    },
    context);
};

const toArrayTransformingEmitter = (emitter, transformer) => (next, done, context) => {
  let index = 0, result = [];
  emitter(
    value => result.push(transformer(value, index++, context.data)),
    error => {
      next(result);
      done(error);
    },
    context);
};

/**
  * Collects all values emitted by this flow to array, returns flow emitting this array.
  *
  * @param {function|any} [transformer] The mapping function used to transform each emitted value,
  *   or scalar value to fill array with ignoring source values.
  * @returns {Aeroflow} New flow that emits array.
  *
  * @example
  * aeroflow.range(1, 3).toArray().dump().run();
  * // next [1, 2, 3]
  * // done
  */
function toArray(transformer) {
  return flow(arguments.length
    ? isFunction(transformer)
      ? toArrayTransformingEmitter(
          this[EMITTER],
          transformer)
      : toArrayTransformingEmitter(
          this[EMITTER],
          constant(transformer))
    : toArrayEmitter(this[EMITTER]));
}

const skipAllEmitter = emitter => (next, done, context) => emitter(noop, done, context);

const skipFirstEmitter = (emitter, count) => (next, done, context) => {
  let index = -1;
  emitter(
    value => ++index < count
      ? false
      : next(value),
    done,
    context);
};

const skipLastEmitter = (emitter, count) => (next, done, context) => toArrayEmitter(emitter)(
  value => {
    for (let index = -1, limit = value.length - count; ++index < limit;)
      next(value[index]);
  },
  done,
  context);

const skipWhileEmitter = (emitter, predicate) => (next, done, context) => {
  let index = 0, skipping = true;
  emitter(
    value => {
      if (skipping && !predicate(value, index++, context.data))
        skipping = false;
      if (!skipping)
        next(value);
    },
    done,
    context);
};

/**
  * Skips some of the values emitted by this flow,
  *   returns flow emitting remaining values.
  *
  * @param {number|function|any} [condition] The number or predicate function used to determine how many values to skip.
  *   If omitted, returned flow skips all values emitting done event only.
  *   If zero, returned flow skips nothing.
  *   If positive number, returned flow skips this number of first emitted values.
  *   If negative number, returned flow skips this number of last emitted values.
  *   If function, returned flow skips emitted values while this function returns trythy value.
  * @returns {Aeroflow} new flow emitting remaining values.
  *
  * @example
  * aeroflow([1, 2, 3]).skip().dump().run();
  * // done
  * aeroflow([1, 2, 3]).skip(1).dump().run();
  * // next 2
  * // next 3
  * // done
  * aeroflow([1, 2, 3]).skip(-1).dump().run();
  * // next 1
  * // next 2
  * // done
  * aeroflow([1, 2, 3]).some(value => value < 3).dump().run();
  * // next 3
  * // done
  */
function skip(condition) {
  return arguments.length
    ? isNumber(condition)
      ? condition === 0
        ? this
        : flow(condition > 0
          ? skipFirstEmitter(
              this[EMITTER],
              condition)
          : skipLastEmitter(
              this[EMITTER],
              -condition))
      : isFunction(condition)
        ? flow(skipWhileEmitter(
            this[EMITTER],
            condition))
        : condition
          ? flow(skipAllEmitter(this[EMITTER]))
          : this
    : flow(skipAllEmitter(this[EMITTER]));
}

const someEmitter = (emitter, predicate) => (next, done, context) => {
  let result = false;
  context = context.spawn();
  emitter(
    value => {
      if (!predicate(value))
        return;
      result = true;
      context.done();
    },
    error => {
      next(result);
      done(error);
    },
    context);
};

/**
* Tests whether some value emitted by this flow passes the predicate test,
  *   returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.
  *
  * @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
  *   or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.
  * @returns {Aeroflow} New flow that emits true or false.
  *
  * @example
  * aeroflow(0).some().dump().run();
  * // next false
  * // done
  * aeroflow.range(1, 3).some(2).dump().run();
  * // next true
  * // done
  * aeroflow.range(1, 3).some(value => value % 2).dump().run();
  * // next true
  * // done
  */
function some(predicate) {
  return flow(someEmitter(
    this[EMITTER],
    arguments.length
      ? isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate
      : value => !!value));
}

const sumEmitter = emitter => reduceEmitter(
  emitter,
  (result, value) => result + value, 0);

/*
  aeroflow([1, 2, 3]).sum().dump().run();
*/
function sum() {
  return flow(sumEmitter(this[EMITTER]));
}

const takeFirstEmitter = (emitter, count) => (next, done, context) => {
  let index = 1;
  context = context.spawn();
  emitter(
    value => {
      next(value);
      if (count <= index++) context.done();
    },
    done,
    context);
};

const takeLastEmitter = (emitter, count) => (next, done, context) => toArrayEmitter(emitter)(
  value => {
    const limit = value.length;
    let index = mathMax(limit - 1 - count, 0);
    while (index < limit)
      next(value[index++]);
  },
  done,
  context);

const takeWhileEmitter = (emitter, predicate) => (next, done, context) => {
  let index = 0;
  context = context.spawn();
  emitter(
    value => predicate(value, index++, context.data)
      ? next(value)
      : context.done(),
    done,
    context);
};

function take(condition) {
  return arguments.length
    ? isNumber(condition)
      ? condition === 0
        ? empty
        : flow(condition > 0
          ? takeFirstEmitter(
              this[EMITTER],
              condition)
          : takeLastEmitter(
              this[EMITTER],
              condition))
      : isFunction(condition)
        ? flow(takeWhileEmitter(
            this[EMITTER],
            condition))
        : condition
          ? this
          : empty
    : this;
}

const tapEmitter = (emitter, callback) => (next, done, context) => {
  let index = 0;
  emitter(
    value => {
      callback(value, index++, context.data);
      return next(value);
    },
    done,
    context);
};

/**
  * Executes provided callback once per each value emitted by this flow,
  * returns new tapped flow or this flow if no callback provided.
  *
  * @param {function} [callback] Function to execute for each value emitted, taking three arguments:
  *   value emitted by this flow,
  *   index of the value,
  *   context object.
  *
  * @example
  * aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();
  * // value: 1 index: 0
  * // value: 2 index: 1
  * // value: 3 index: 2
  */
function tap(callback) {
  return isFunction(callback)
    ? flow(tapEmitter(this[EMITTER], callback))
    : this;
}

const timestampEmitter = emitter => (next, done, context) => {
  let past = dateNow();
  emitter(
    value => {
      let current = dateNow();
      next({
        timedelta: current - past,
        timestamp: dateNow,
        value
      });
      past = current;
    },
    done,
    context);
};

/*
  aeroflow.repeat().take(3).delay(10).timestamp().dump().run();
*/
function timestamp() {
  return flow(timestampEmitter(this[EMITTER]));
}

const toMapEmitter = emitter => (next, done, context) => {
  let result = new Map;
  emitter(
    value => result.set(value, value),
    error => {
      next(result);
      done(error);
    },
    context);
};

const toMapTransformingEmitter = (emitter, keyTransformer, valueTransformer) => (next, done, context) => {
  let index = 0, result = new Map;
  emitter(
    value => result.set(
      keyTransformer(value, index++, context.data),
      valueTransformer(value, index++, context.data)),
    error => {
      next(result);
      done(error);
    },
    context);
};

/**
  * Collects all values emitted by this flow to ES6 map, returns flow emitting this map.
  *
  * @param {function|any} [keyTransformer] The mapping function used to transform each emitted value to map key,
  *   or scalar value to use as map key.
  * @param {function|any} [valueTransformer] The mapping function used to transform each emitted value to map value,
  *   or scalar value to use as map value.
  * @returns {Aeroflow} New flow that emits map.
  *
  * @example
  * aeroflow.range(1, 3).toMap(v => 'key' + v, true).dump().run();
  * // next Map {"key1" => true, "key2" => true, "key3" => true}
  * // done
  * aeroflow.range(1, 3).toMap(v => 'key' + v, v => v * 10).dump().run();
  * // next Map {"key1" => 10, "key2" => 20, "key3" => 30}
  * // done
  */
function toMap(keyTransformer, valueTransformer) {
  return flow(arguments.length === 0
    ? toMapEmitter(this[EMITTER])
    : toMapTransformingEmitter(
        this[EMITTER],
        isFunction(keyTransformer)
          ? keyTransformer
          : constant(keyTransformer),
        arguments.length === 1
          ? identity
          : isFunction(valueTransformer)
            ? keyTransformer
            : constant(valueTransformer)));
}

const toSetEmitter = emitter => (next, done, context) => {
  let result = new Set;
  emitter(
    value =>
      result.add(value),
    error => {
      next(result);
      done(error);
    },
    context);
};

const toSetTransformingEmitter = (emitter, transformer) => (next, done, context) => {
  let index = 0, result = new Set;
  emitter(
    value =>
      result.add(transformer(value, index++, context.data)),
    error => {
      next(result);
      done(error);
    },
    context);
};

/**
  * Collects all values emitted by this flow to ES6 set, returns flow emitting this set.
  *
  * @param {function|any} [transformer] The mapping function used to transform each emitted value to key,
  *   or scalar value to use as key.
  * @returns {Aeroflow} New flow that emits set.
  *
  * @example
  * aeroflow.range(1, 3).toSet().dump().run();
  * // next Set {1, 2, 3}
  * // done
  * aeroflow.range(1, 3).toSet(v => 'key' + v).dump().run();
  * // next Set {"key1", "key2", "key3"}
  * // done
  */
function toSet(transformer) {
  return flow(arguments.length === 0
    ? toSetEmitter(this[EMITTER])
    : toSetTransformingEmitter(
        this[EMITTER],
        isFunction(transformer)
        ? transformer
        : constant(transformer)));
}

function Aeroflow(emitter) {
  objectDefineProperty(this, EMITTER, { value: emitter });
}
objectDefineProperties(Aeroflow[PROTOTYPE], {
  [CLASS]: { value: AEROFLOW },
  append: { value: append },
  count: { value: count },
  delay: { value: delay },
  dump: { value: dump },
  every: { value: every },
  filter: { value: filter },
  join: { value: join },
  map: { value: map },
  max: { value: max },
  min: { value: min },
  prepend: { value: prepend },
  reduce: { value: reduce },
  run: { value: run },
  skip: { value: skip },
  some: { value: some },
  sum: { value: sum },
  take: { value: take },
  tap: { value: tap },
  timestamp: { value: timestamp },
  toArray: { value: toArray },
  toMap: { value: toMap },
  toSet: { value: toSet }
});
function flow(emitter) {
  return new Aeroflow(emitter);
}

/**
  * Creates programmatically controlled flow.
  * @static
  *
  * @param {function|any} emitter The emitter function taking three arguments:
  *   next - the function emitting 'next' event,
  *   done - the function emitting 'done' event,
  *   context - current execution context.
  *
  * @example
  * aeroflow.create((next, done, context) => {
  *   next(1);
  *   next(new Promise(resolve => setTimeout(() => resolve(2), 500)));
  *   setTimeout(done, 1000);
  * }).dump().run();
  * // next 1 // after 500ms
  * // next 2 // after 1000ms
  * // done
  */
const create = emitter => arguments.length
  ? isFunction(emitter)
    ? flow((next, done, context) => {
        context.track(emitter(
          value => {
            if (context.active) next();
          },
          error => {
            if (!context.active) return;
            done();
            context.done();
          },
          context));
      })
    : just(emitter)
  : empty;

const repeatEmitter = value => (next, done, context) => {
  while(context.active)
    next(value);
  done();
};

const repeatDynamicEmitter = repeater => (next, done, context) => {
  let index = 0, result;
  while (context.active && false !== (result = repeater(index++, context.data)))
    next(result);
  done();
};

/**
  * Creates flow of repeting values.
  * @static
  *
  * @param {function|any} repeater Arbitrary scalar value to repeat; or function invoked repeatedly with two arguments: 
  *   index - index of the value being emitted,
  *   data - contextual data.
  * @returns {Aeroflow} new flow.
  *
  * @example
  * aeroflow.repeat(new Date().getSeconds(), 3).dump().run();
  * // next 1
  * // next 1
  * // next 1
  * // done
  * aeroflow.repeat(() => new Date().getSeconds(), 3).delay((value, index) => index * 1000).dump().run();
  * // next 1
  * // next 2
  * // next 3
  * // done
  * aeroflow.repeat(index => Math.pow(2, index), 3).dump().run();
  * // next 1
  * // next 2
  * // next 4
  * // done
  */
const repeat = value => flow(isFunction(value)
  ? repeatDynamicEmitter(value)
  : repeatEmitter(value));

const expandEmitter = (expander, seed) => (next, done, context) => {
  let index = 0, value = seed;
  while (context.active)
    next(value = expander(value, index++, context.data));
  done();
};

/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
const expand = (expander, seed) => flow(isFunction(expander)
  ? expandEmitter(expander, seed)
  : repeatEmitter(expander));

const randomEmitter = (inclusiveMin, exclusiveMax) => (next, done, context) => {
  while(context.active)
    next(inclusiveMin + exclusiveMax * mathRandom());
  done();
};

const randomIntegerEmitter = (inclusiveMin, exclusiveMax) => (next, done, context) => {
  while(context.active)
    next(mathFloor(inclusiveMin + exclusiveMax * mathRandom()));
  done();
};

/**
  * Returns new flow emitting random numbers.
  * @static
  *
  * @example
  * aeroflow.random().take(3).dump().run();
  * aeroflow.random(0.1).take(3).dump().run();
  * aeroflow.random(null, 0.1).take(3).dump().run();
  * aeroflow.random(1, 9).take(3).dump().run();
  */
const random = (inclusiveMin, exclusiveMax) => {
  inclusiveMin = +inclusiveMin || 0;
  exclusiveMax = +exclusiveMax || 1;
  exclusiveMax -= inclusiveMin;
  return flow(isInteger(inclusiveMin) && isInteger(exclusiveMax)
    ? randomIntegerEmitter(inclusiveMin, exclusiveMax)
    : randomEmitter(inclusiveMin, exclusiveMax));
};

const rangeEmitter = (inclusiveStart, inclusiveEnd, step) => (next, done, context) => {
  let i = inclusiveStart - step;
  if (inclusiveStart < inclusiveEnd)
    while (context.active && (i += step) <= inclusiveEnd)
      next(i);
  else
    while (context.active && (i += step) >= inclusiveEnd)
      next(i);
  done();
};

/*
  aeroflow.range().take(3).dump().run();
  aeroflow.range(-3).take(3).dump().run();
  aeroflow.range(1, 1).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, -2).dump().run();
*/
const range = (inclusiveStart, inclusiveEnd, step) => {
  inclusiveEnd = +inclusiveEnd || maxInteger;
  inclusiveStart = +inclusiveStart || 0;
  step = +step || (inclusiveStart < inclusiveEnd ? 1 : -1);
  return inclusiveStart === inclusiveEnd
    ? just(inclusiveStart)
    : flow(rangeEmitter(inclusiveStart, inclusiveEnd, step));
};

const aeroflowEmitter = source => source[EMITTER];

const arrayEmitter = source => (next, done, context) => {
  let index = -1;
  while (context.active && ++index < source.length)
    next(source[index]);
  done();
};

const functionEmitter = source => (next, done, context) => emit(source(context.data))(next, done, context);

const promiseEmitter = source => (next, done, context) => source.then(
  value => emit(value)(next, done, context),
  error => done(error));

const emitters = new Map(
  [AEROFLOW, aeroflowEmitter],
  [ARRAY, arrayEmitter],
  [FUNCTION, functionEmitter],
  [PROMISE, promiseEmitter]
);

function emit(...sources) {
  switch (sources.length) {
    case 0:
      return emptyEmitter(); // todo: Aeroplan
    case 1:
      const
        source = sources[0],
        emitter = emitters[classOf(source)];
      if (isFunction(emitter))
        return emitter(source);
      if (isObject(source) && ITERATOR in source)
        return (next, done, context) => {
          const iterator = source[ITERATOR]();
          let iteration;
          while (context.active && !(iteration = iterator.next()).done)
            next(iteration.value);
          done();
        };
      return justEmitter(source);
    default:
      return (next, done, context) => {
        let index = -1;
        const limit = sources.length, proceed = () => context.active && ++index < limit
          ? emit(sources[index])(next, proceed, context)
          : done();
        proceed();
      };
  }
}
function aeroflow(...sources) {
  return flow(emit(...sources));
}
// todo: Aerobus.Channel, Aerobus.Section
objectDefineProperties(aeroflow, {
  create: { value: create },
  emitters: { value: emitters },
  empty: { value: empty },
  expand: { value: expand },
  just: { value: just },
  operators: { value: Aeroflow[PROTOTYPE] },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat }
});

export default aeroflow;