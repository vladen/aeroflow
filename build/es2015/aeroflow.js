const AEROFLOW = 'Aeroflow';
const ARRAY = 'Array';
const BOOLEAN = 'Boolean';
const CLASS = Symbol.toStringTag;
const DATE = 'Date';
const FUNCTION = 'Function';
const ITERATOR = Symbol.iterator;
const NUMBER = 'Number';
const PROMISE = 'Promise';
const PROTOTYPE = 'prototype';
const REGEXP = 'RegExp';
const SYMBOL = 'Symbol';
const UNDEFINED = 'Undefined';

const dateNow = Date.now;
const mathFloor = Math.floor;
const mathRandom = Math.random;
const mathMax = Math.max;
const maxInteger = Number.MAX_SAFE_INTEGER;
const objectCreate = Object.create;
const objectDefineProperties = Object.defineProperties;
const objectToString = Object.prototype.toString;

const constant = value => () => value;
const identity = value => value;
const noop = () => {};

const classOf = value => objectToString.call(value).slice(8, -1);
const classIs = className => value => classOf(value) === className;

const isDate = classIs(DATE);
const isFunction$1 = classIs(FUNCTION);
const isInteger = Number.isInteger;
const isNothing = value => value == null;
const isNumber = classIs(NUMBER);

const toNumber = (value, def) => {
  if (!isNumber(value)) {
    value = +value;
    if (isNaN(value)) return def;
  }
  return value;
};

function arrayEmitter(source) {
  return (next, done, context) => {
    let index = -1;
    while (++index < source.length && next(source[index]));
    done();
  };
}

function emptyEmitter() {
  return (next, done) => done();
}

function functionEmitter(source) {
  return (next, done, context) => {
    try {
      next(source(context.data));
      return done();
    }
  	catch(error) {
    	return done(error);
    }
  };
}

function promiseEmitter(source) {
  return (next, done, context) => source.then(
    value => {
      next(value);
      done();
    },
    done);
}

function valueEmitter(value) {
  return (next, done) => {
    next(value);
    done();
  };
}

function finalize(finalizer) {
  if (isFunction$1(finalizer)) finalizer();
}

function customEmitter(emitter) {
  return arguments.length
    ? isFunction$1(emitter)
      ? (next, done, context) => {
          let complete = false, finalizer;
          try {
            finalizer = emitter(
              value => {
                if (complete) return false;
                if (next(value)) return true;
                complete = true;
                done();
              },
              error => {
                if (complete) return;
                complete = true;
                done(error);
              },
              context);
          }
          catch(error) {
            if (complete) {
              finalize(finalizer);
              throw error;
            }
            complete = true;
            done();
          }
          finalize(finalizer);
        }
      : valueEmitter(emitter)
    : emptyEmitter();
}

function expandEmitter(expanding, seed) {
  const expander = isFunction$1(expanding)
    ? expanding
    : constant(expanding);
  return (next, done, context) => {
    let index = 0, value = seed;
    while (next(expander(value, index++, context.data)));
    done();
  };
}

function randomDecimalEmitter(min, max) {
  return (next, done) => {
    while (next(min + max * mathRandom()));
    done();
  };
}

function randomIntegerEmitter(min, max) { 
  return (next, done) => {
    while (next(mathFloor(min + max * mathRandom())));
    done();
  };
}

function randomEmitter(min, max) {
  max = toNumber(max, 1);
  min = toNumber(min, 0);
  max -= min;
  return isInteger(min) && isInteger(max)
    ? randomIntegerEmitter(min, max)
    : randomDecimalEmitter(min, max);
}

function rangeEmitter(start, end, step) {
  end = toNumber(end, maxInteger);
  start = toNumber(start, 0);
  if (start === end) return valueEmitter(start);
  if (start < end) {
    step = toNumber(step, 1);
    if (step < 1) return valueEmitter(start);
    return (next, done, context) => {
      let value = start;
      while (next(value) && (value += step) <= end);
      done();
    };
  }
  step = toNumber(step, -1);
  if (step > -1) return valueEmitter(start);
  return (next, done, context) => {
    let value = start;
    while (next(value) && (value += step) >= end);
    done();
  };
}

function repeatDynamicEmitter(repeater) {
  return (next, done, context) => {
    let index = 0;
    try {
      while (next(repeater(index++, context.data)));
      done();
    }
    catch(error) {
      done(error);
    }
  };
}

function repeatStaticEmitter(value) {
  return (next, done, context) => {
    while (next(value));
    done();
  };
}

function repeatEmitter(value) {
  return isFunction(value)
    ? repeatDynamicEmitter(value)
    : repeatStaticEmitter(value);
}

function timerEmitter(interval) {
  interval = +interval;
  return isNaN(interval) 
    ? emptyEmitter()
    : (next, done, context) => {
        const timer = setInterval(
          () => {
            if (!next(new Date)) {
              clearInterval(timer);
              done();
            }
          },
          interval);
      };
}

function reduceAlongOperator(reducer) {
  return emitter => (next, done, context) => {
    let idle = true, index = 1, result;
    emitter(
      value => {
        if (idle) {
          idle = false;
          result = value;
        }
        else result = reducer(result, value, index++, context.data);
        return true;
      },
      error => {
        if (isNothing(error) && !idle) next(result);
        return done(error);
      },
      context);
  };
}

function reduceGeneralOperator(reducer, seed) {
  return emitter => (next, done, context) => {
    let index = 0, result = seed;
    emitter(
      value => {
        result = reducer(result, value, index++, context.data)
        return true;
      },
      error => {
        if (isNothing(error)) next(result);
        return done(error);
      },
      context);
  };
}

function reduceOptionalOperator(reducer, seed) {
  return emitter => (next, done, context) => {
    let idle = true, index = 0, result = seed;
    emitter(
      value => {
        idle = false;
        result = reducer(result, value, index++, context.data);
        return true;
      },
      error => {
        if (isNothing(error) && !idle) next(result);
        return done(error);
      },
      context);
  };
}

function reduceOperator(reducer, seed, optional) {
  const arity = arguments.length;
  if (!arity || !isFunction$1(reducer)) return () => emptyEmitter();
  switch (arity) {
    case 1: return reduceAlongOperator(reducer);
    case 2: return reduceGeneralOperator(reducer, seed);
    default:
      return isFunction$1(reducer)
        ? optional
          ? reduceOptionalOperator(reducer, seed)
          : reduceGeneralOperator(reducer, seed)
        : () => valueEmitter(reducer)
  }
}

function countOperator(optional) {
  return (optional ? reduceOptionalOperator : reduceGeneralOperator)(
  	result => result + 1,
  	0);
}

function delayDynamicOperator(selector) {
  return emitter => (next, done, context) => {
    let completition = dateNow(), index = 0;
    emitter(
      value => {
        let interval = selector(value, index++, context.data), estimation;
        if (isDate(interval)) {
          estimation = interval;
          interval = interval - dateNow();
        }
        // todo: convert interval to number
        else estimation = dateNow() + interval;
        if (completition < estimation) completition = estimation + 1;
        setTimeout(() => next(value), mathMax(interval, 0));
        return true;
      },
      error => {
        completition -= dateNow();
        setTimeout(() => done(error), mathMax(completition, 0));
        return true;
      },
      context);
  };
}

function delayStaticOperator(interval) {
  return emitter => (next, done, context) => emitter(
    value => setTimeout(() => next(value), interval),
    error => setTimeout(() => done(error), interval),
    context);
}

function delayOperator(condition) {
  switch (classOf(condition)) {
    case DATE:
      return delayDynamicOperator(() => mathMax(condition - new Date, 0));
    case FUNCTION:
      return delayDynamicOperator(condition);
    default:
      return delayStaticOperator(mathMax(+condition || 0, 0));
  }
}

function dumpToConsoleOperator(prefix) {
  return emitter => (next, done, context) => emitter(
    value => {
      console.log(prefix + 'next', value);
      return next(value);
    },
    error => {
      error
        ? console.error(prefix + 'done', error)
        : console.log(prefix + 'done');
      return done(error);
    },
    context);
}

function dumpToLoggerOperator(prefix, logger) {
  return emitter => (next, done, context) => emitter(
    value => {
      logger(prefix + 'next', value);
      return next(value);
    },
    error => {
      error
        ? logger(prefix + 'done', error)
        : logger(prefix + 'done');
      return done(error);
    },
    context);
}

function dumpOperator(prefix, logger) {
  return isFunction$1(prefix)
    ? dumpToLoggerOperator('', prefix)
    : isFunction$1(logger)
      ? dumpToLoggerOperator(prefix, logger)
      : isNothing(prefix)
        ? dumpToConsoleOperator('')
        : dumpToConsoleOperator(prefix);
}

function everyOperator(condition) {
  let predicate;
  switch (classOf(condition)) {
    case FUNCTION:
      predicate = condition;
      break;
    case REGEXP:
      predicate = value => condition.test(value);
      break;
    case UNDEFINED:
      predicate = value => !!value;
      break;
    default:
      predicate = value => value === condition;
      break;
  }
  return emitter => (next, done, context) => {
    let idle = true, result = true;
    context = context.spawn();
    emitter(
      value => {
        idle = false;
        if (predicate(value)) return true;
        return result = false;
      },
      error => {
        if (isNothing(error)) next(result && !idle);
        return done(error);
      },
      context);
  };
}

function filterOperator(condition) {
  let predicate;
  switch (classOf(condition)) {
    case FUNCTION:
      predicate = condition;
      break;
    case REGEXP:
      predicate = value => condition.test(value);
      break;
    case UNDEFINED:
      predicate = value => !!value;
      break;
    default:
      predicate = value => value === condition
      break;
  }
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => !predicate(value, index++, context.data) || next(value),
      done,
      context);
  };
}

function joinOperator(separator, optional) {
  const joiner = isFunction$1(separator)
    ? separator
    : isNothing(separator)
      ? constant(',')
      : constant(separator);
  return (optional ? reduceOptionalOperator : reduceGeneralOperator)(
    (result, value, index, data) => result.length
      ? result + joiner(value, index, data) + value 
      : value,
    '');
}

function mapOperator(mapping) {
  if (isNothing(mapping)) return identity;
  const mapper = isFunction$1(mapping)
    ? mapping
    : constant(mapping);
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => next(mapper(value, index++, context.data)),
      done,
      context);
  };
}

function maxOperator () {
  return reduceAlongOperator(
    (maximum, value) => value > maximum ? value : maximum);
}

function toArrayOperator() {
  return emitter => (next, done, context) => {
    const result = [];
    emitter(
      value => {
        result.push(value)
        return true;
      },
      error => {
        if (isNothing(error)) next(result);
        return done(error);
      },
      context);
  };
}

function meanOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    values => {
      if (!values.length) return;
      values.sort();
      next(values[mathFloor(values.length / 2)]);
    },
    done,
    context);
}

function minOperator() {
  return reduceAlongOperator(
    (minimum, value) => value < minimum ? value : minimum);
}

function reverseOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    value => {
      for (let index = value.length; index--;) next(value[index]);
      return false;
    },
    done,
    context);
}

function skipAllOperator() {
  return emitter => (next, done, context) => emitter(noop, done, context);
}

function skipFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = -1;
    emitter(
      value => ++index < count || next(value),
      done,
      context);
  };
}

function skipLastOperator(count) {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    values => {
      const limit = mathMax(values.length - count, 0);
      let index = -1;
      while (++index < limit && next(values[index]));
      done();
    },
    done,
    context);
}

function skipWhileOperator(predicate) {
  return emitter => (next, done, context) => {
    let index = 0, skipping = true;
    emitter(
      value => {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        return skipping || next(value);
      },
      done,
      context);
  };
}

function skipOperator(condition) {
  switch (classOf(condition)) {
    case NUMBER: return condition > 0
      ? skipFirstOperator(condition)
      : condition < 0
        ? skipLastOperator(-condition)
        : identity;
    case FUNCTION: return skipWhileOperator(condition);
    default: return condition
      ? skipAllOperator()
      : identity;
  }
}

function someOperator(condition) {
  let predicate;
  switch (classOf(condition)) {
    case FUNCTION:
      predicate = condition;
      break;
    case REGEXP:
      predicate = value => condition.test(value);
      break;
    case UNDEFINED:
      predicate = value => !!value;
      break;
    default:
      predicate = value => value === condition;
      break;
  }
  return emitter => (next, done, context) => {
    let result = false;
    context = context.spawn();
    emitter(
      value => {
        if (!predicate(value)) return true;
        result = true;
        return false;
      },
      error => {
        if (isNothing(error)) next(result);
        return done(error);
      },
      context);
  };
}

function sumOperator() {
  return emitter => reduceGeneralOperator((result, value) => result + value, 0);
}

function takeFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = -1;
    emitter(
      value => ++index < count && next(value),
      done,
      context);
  };
}

function takeLastOperator(count) {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    values => {
      const limit = values.length;
      let index = mathMax(limit - count - 1, 0);
      while (++index < limit && next(values[index]));
      done();
    }, 
    done,
    context);
}

function takeWhileOperator(predicate) {
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => predicate(value, index++, context.data) && next(value),
      done,
      context);
  };
}

function takeOperator(condition) {
  switch (classOf(condition)) {
    case NUMBER: return condition > 0
      ? takeFirstOperator(condition)
      : condition < 0
        ? takeLastOperator(-condition)
        : emptyEmitter();
    case FUNCTION: return takeWhileOperator(condition);
    default: return condition
      ? identity
      : emptyEmitter();
  }
}

function tapOperator(callback) {
  return emitter => isFunction$1(callback)
    ? (next, done, context) => {
      let index = 0;
      emitter(
        value => {
          callback(value, index++, context.data);
          return next(value);
        },
        done,
        context);
    }
    : emitter;
}

function timestampOperator() {
  return emitter => (next, done, context) => {
    let past = dateNow();
    emitter(
      value => {
        let current = dateNow(), result = next({
          timedelta: current - past,
          timestamp: dateNow,
          value
        });
        past = current;
        return result;
      },
      done,
      context);
  };
}

function toMapOperator(keyTransformation, valueTransformation) {
  const keyTransformer = isNothing(keyTransformation)
    ? identity
    : isFunction$1(keyTransformation)
      ? keyTransformation
      : constant(keyTransformation);
  const valueTransformer = isNothing(valueTransformation)
    ? identity
    : isFunction$1(valueTransformation)
      ? valueTransformation
      : constant(valueTransformation);
  return emitter=> (next, done, context) => {
    let index = 0, result = new Map;
    emitter(
      value => {
        result.set(
          keyTransformer(value, index++, context.data),
          valueTransformer(value, index++, context.data));
        return true;
      },
      error => {
        if (isNothing(error)) next(result);
        return done(error);
      },
      context);
  };
}

function toSetOperator() {
  return emitter => (next, done, context) => {
    let result = new Set;
    emitter(
      value => {
        result.add(value);
        return true;
      },
      error => {
        if (isNothing(error)) next(result);
        return done(error);
      },
      context);
  };
}

class Aeroflow {
  constructor(emitter, sources) {
    objectDefineProperties(this, {
      emitter: { value: emitter },
      sources: { value: sources }
    });
  }
}
/**
* Returns new flow emitting values from this flow first and then from all provided sources without interleaving them.
* @public @instance @alias Aeroflow@append
* @param {...any} [sources] The value sources to append to this flow.
* @return {Aeroflow} new flow.
* @example
* aeroflow(1).append(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
* // next 1
* // next 2
* // next 3
* // next 4
* // next 5
* // next 6 // after 500ms
* // done
*/
function append(...sources) {
  return new Aeroflow(this.emitter, this.sources.concat(sources));
}
function bind(...sources) {
  return new Aeroflow(this.emitter, sources);
}
function chain(operator) {
  return new Aeroflow(operator(this.emitter), this.sources);
}
/**
* Counts the number of values emitted by this flow, returns new flow emitting only this value.
*
* @example
* aeroflow(['a', 'b', 'c']).count().dump().run();
* // next 3
* // done
*/
function count(optional) {
  return this.chain(countOperator(optional));
}
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
  * aeroflow(1, 2).delay(new Date(Date.now() + 500)).dump().run();
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
  return this.chain(delayOperator(condition));
}
/**
  * Dumps all events emitted by this flow to the `logger` with optional prefix.
  *
  * @param {string} [prefix=''] A string prefix prepended to each event name.
  * @param {function} [logger=console.log] Function to execute for each event emitted, taking two arguments:
  *   event - The name of event emitted prepended with prefix (next or done).
  *   value - The value (next event) or error (done event) emitted by this flow.
  *
  * @example
  * aeroflow(1, 2).dump('test ', console.info.bind(console)).run();
  * // next 1
  * // next 2
  * // done
  * aeroflow(1, 2).dump('test ', console.info.bind(console)).run();
  * // test next 1
  * // test next 2
  * // test done
  */
function dump(prefix, logger) {
  return this.chain(dumpOperator(prefix, logger));
}
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
function every(condition) {
  return this.chain(everyOperator(condition));
}
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
function filter(condition) {
  return this.chain(filterOperator(condition)); 
}
function join(condition, optional) {
  return this.chain(joinOperator(condition, optional)); 
}
function map(mapping) {
  return this.chain(mapOperator(mapping)); 
}
/**
  * Determines the maximum value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 2, 3]).max().dump().run();
  * // next 3
  * // done
  */
function max() {
  return this.chain(maxOperator());
}
/**
  * Determines the mean value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
  * // next 3
  * // done
  */
function mean() {
  return this.chain(meanOperator());
}
/**
  * Determine the minimum value emitted by this flow, returns new flow emitting only this value.
  *
  * @example
  * aeroflow([1, 2, 3]).min().dump().run();
  * // next 1
  * // done
  */
function min() {
  return this.chain(minOperator());
}
/**
* Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.
* @public @instance @alias Aeroflow@prepend
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
  return new Aeroflow(this.emitter, sources.concat(this.sources));
}
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
function reduce(reducer, seed, optional) {
  return this.chain(reduceOperator(reducer, seed, optional));
}
function reverse() {
  return this.chain(reverseOperator());
}
/**
 * Runs this flow asynchronously, initiating source to emit values,
 * applying declared operators to emitted values and invoking provided callbacks.
 * If no callbacks provided, runs this flow for its side-effects only.
 * @public @instance @alias Aeroflow@run
 * @param {function} [next] Callback to execute for each emitted value, taking two arguments: value, context.
 * @param {function} [done] Callback to execute as emission is complete, taking two arguments: error, context.
 * @param {function} [data] Arbitrary value passed to each callback invoked by this flow as context.data.
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
  if (!isFunction$1(done)) done = noop;
  if (!isFunction$1(next)) next = noop;
  const context = objectDefineProperties({}, {
    data: { value: data },
    flow: { value: this }
  });
  setImmediate(() => {
    context.flow.emitter(
      value => false !== next(value, data),
      error => done(error, data),
      context);
  });
  return this;
}
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
  return this.chain(skipOperator(condition));
}
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
function some(condition) {
  return this.chain(someOperator(condition));
}
/*
  aeroflow([1, 2, 3]).sum().dump().run();
*/
function sum() {
  return this.chain(sumOperator());
}
function take(condition) {
  return this.chain(takeOperator(condition));
}
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
  return this.chain(tapOperator(callback));
}
/*
  aeroflow.repeat().take(3).delay(10).timestamp().dump().run();
*/
function timestamp() {
  return this.chain(timestampOperator());
}
/**
  * Collects all values emitted by this flow to array, returns flow emitting this array.
  *
  * @returns {Aeroflow} New flow that emits an array.
  *
  * @example
  * aeroflow.range(1, 3).toArray().dump().run();
  * // next [1, 2, 3]
  * // done
  */
function toArray() {
  return this.chain(toArrayOperator());
}
/**
  * Collects all values emitted by this flow to ES6 map, returns flow emitting this map.
  *
  * @param {function|any} [keyTransformation] The mapping function used to transform each emitted value to map key,
  *   or scalar value to use as map key.
  * @param {function|any} [valueTransformation] The mapping function used to transform each emitted value to map value,
  *   or scalar value to use as map value.
  * @returns {Aeroflow} New flow that emits a map.
  *
  * @example
  * aeroflow.range(1, 3).toMap(v => 'key' + v, true).dump().run();
  * // next Map {"key1" => true, "key2" => true, "key3" => true}
  * // done
  * aeroflow.range(1, 3).toMap(v => 'key' + v, v => v * 10).dump().run();
  * // next Map {"key1" => 10, "key2" => 20, "key3" => 30}
  * // done
  */
function toMap(keyTransformation, valueTransformation) {
   return this.chain(toMapOperator(keyTransformation, valueTransformation));
}
/**
  * Collects all values emitted by this flow to ES6 set, returns flow emitting this set.
  *
  * @returns {Aeroflow} New flow that emits a set.
  *
  * @example
  * aeroflow.range(1, 3).toSet().dump().run();
  * // next Set {1, 2, 3}
  * // done
  */
function toSet() {
  return this.chain(toSetOperator()); 
}
const operators = objectCreate(Object[PROTOTYPE], {
  count: { value: count, writable: true },
  delay: { value: delay, writable: true },
  dump: { value: dump, writable: true },
  every: { value: every, writable: true },
  filter: { value: filter, writable: true },
  join: { value: join, writable: true },
  map: { value: map, writable: true },
  max: { value: max, writable: true },
  mean: { value: mean, writable: true },
  min: { value: min, writable: true },
  reduce: { value: reduce, writable: true },
  reverse: { value: reverse, writable: true },
  skip: { value: skip, writable: true },
  some: { value: some, writable: true },
  sum: { value: sum, writable: true },
  take: { value: take, writable: true },
  tap: { value: tap, writable: true },
  timestamp: { value: timestamp, writable: true },
  toArray: { value: toArray, writable: true },
  toMap: { value: toMap, writable: true },
  toSet: { value: toSet, writable: true }
});
Aeroflow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  append: { value: append },
  bind: { value: bind },
  chain: { value: chain },
  prepend: { value: prepend },
  run: { value: run }
});

const adapters = objectCreate(null, {
  [ARRAY]: { value: arrayEmitter, writable: true },
  [BOOLEAN]: { value: valueEmitter, writable: true },
  [DATE]: { value: valueEmitter, writable: true },
  [FUNCTION]: { value: functionEmitter, writable: true },
  [NUMBER]: { value: valueEmitter, writable: true },
  [PROMISE]: { value: promiseEmitter, writable: true },
  [REGEXP]: { value: valueEmitter, writable: true }
});

function adapt(source) {
  if (isNothing(source)) return valueEmitter(source);
  const sourceClass = classOf(source);
  if (sourceClass === AEROFLOW) return source.emitter;
  let adapter = adapters[sourceClass];
  if (isFunction$1(adapter)) return adapter(source);
  switch (sourceClass) {
    case BOOLEAN:
    case NUMBER:
    case SYMBOL:
      return valueEmitter(source);
    default: 
      const iterate = source[ITERATOR];
      if (isFunction$1(iterate)) return (next, done, context) => {
        const iterator = iterate();
        while (context.active) {
          let iteration = iterator.next();
          if (iteration.done) break;
          next(iteration.value);
        }
        done();
      };
      return valueEmitter(source);
  }
}

function emit(next, done, context) {
  const sources = context.flow.sources;
  let limit = sources.length, index = -1;
  !function proceed(error) {
    if (isNothing(error) && ++index < limit)
      adapt(sources[index])(next, proceed, context);
    else done(error);
  }();
}

function aeroflow(...sources) {
  return new Aeroflow(emit, sources);
}
/**
  * Creates programmatically controlled flow.
  * @static
  * @alias aeroflow.create
  * @param {function|any} emitter The emitter function taking three arguments:
  *   next - the function emitting 'next' event,
  *   done - the function emitting 'done' event,
  *   context - current execution context.
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
function create(emitter) {
  return new Aeroflow(customEmitter(emitter));
}
function expand(expander, seed) {
  return new Aeroflow(expandEmitter(expander, seed))
}
/**
  * Returns new flow emitting the provided value only.
  * @static
  * @alias aeroflow.just
  * @param {any} value The value to emit.
  * @example
  * aeroflow.just('test').dump().run();
  * // next "test"
  * // done
  * aeroflow.just(() => 'test').dump().run();
  * // next "test"
  * // done
  */
function just(value) {
  return new Aeroflow(valueEmitter(value));
}
/**
  * Returns new flow emitting random numbers.
  * @static
  * @alias aeroflow.random
  * @example
  * aeroflow.random().take(3).dump().run();
  * aeroflow.random(0.1).take(3).dump().run();
  * aeroflow.random(null, 0.1).take(3).dump().run();
  * aeroflow.random(1, 9).take(3).dump().run();
  */
function random(min, max) {
  return new Aeroflow(randomEmitter(min, max));
}
/*
  aeroflow.range().take(3).dump().run();
  aeroflow.range(-3).take(3).dump().run();
  aeroflow.range(1, 1).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, -2).dump().run();
*/
function range(start, end, step) {
  return new Aeroflow(rangeEmitter(start, end, step));
}
/**
  * Creates flow of repeting values.
  * @static
  * @alias.aeroflow.repeat
  * @param {function|any} repeater Arbitrary scalar value to repeat; or function invoked repeatedly with two arguments: 
  *   index - index of the value being emitted,
  *   data - contextual data.
  * @returns {Aeroflow} new flow.
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
function repeat(value) {
  return new Aeroflow(repeatEmitter(value));
}
function timer(interval) {
  return new Aeroflow(timerEmitter(interval));
}
objectDefineProperties(aeroflow, {
  adapters: { get: () => adapters },
  create: { value: create },
  empty: { enumerable: true, value: new Aeroflow(emptyEmitter()) },
  expand: { value: expand },
  just: { value: just },
  operators: { get: () => operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat },
  timer: { value: timer }
});

export default aeroflow;