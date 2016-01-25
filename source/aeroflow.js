'use strict';

import {
  AEROFLOW, ARRAY, BOOLEAN, CLASS, DATE, FUNCTION, ITERATOR, NUMBER, PROMISE, PROTOTYPE, REGEXP, SYMBOL
} from './symbols';
import { classOf, isFunction, isNothing, objectDefineProperties, objectCreate, noop } from './utilites';
import { arrayEmitter } from './emitters/array';
import { emptyEmitter } from './emitters/empty';
import { functionEmitter } from './emitters/function';
import { promiseEmitter } from './emitters/promise';
import { valueEmitter } from './emitters/value';
import { customEmitter } from './emitters/custom';
import { expandEmitter } from './emitters/expand';
import { randomEmitter } from './emitters/random';
import { rangeEmitter } from './emitters/range';
import { repeatEmitter } from './emitters/repeat';
import { countOperator } from './operators/count';
import { delayOperator } from './operators/delay';
import { dumpOperator } from './operators/dump';
import { everyOperator } from './operators/every';
import { filterOperator } from './operators/filter';
import { joinOperator } from './operators/join';
import { mapOperator } from './operators/map';
import { maxOperator } from './operators/max';
import { meanOperator } from './operators/mean';
import { minOperator } from './operators/min';
import { reduceOperator } from './operators/reduce';
import { skipOperator } from './operators/skip';
import { someOperator } from './operators/some';
import { sumOperator } from './operators/sum';
import { takeOperator } from './operators/take';
import { tapOperator } from './operators/tap';
import { timestampOperator } from './operators/timestamp';
import { toArrayOperator } from './operators/toArray';
import { toMapOperator } from './operators/toMap';
import { toSetOperator } from './operators/toSet';
import { Context } from './context';

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
  if (!isFunction(done)) done = noop;
  if (!isFunction(next)) next = noop;
  const context = new Context(this, data), emitter = this.emitter;
  setImmediate(() => {
    let index = 0;
    emitter(
      value => {
        next(value, index++, context);
      },
      error => {
        context.done();
        done(error, index, context);
      },
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
const operators = objectCreate(null, {
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
  if (isFunction(adapter)) return adapter(source);
  switch (sourceClass) {
    case BOOLEAN:
    case NUMBER:
    case SYMBOL:
      return valueEmitter(source);
    default: 
      const iterate = source[ITERATOR];
      if (isFunction(iterate)) return (next, done, context) => {
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
    if (!error && context.active && ++index < limit) adapt(sources[index])(next, proceed, context);
    else done(error);
  }();
}

export default function aeroflow(...sources) {
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
function random(inclusiveMin, exclusiveMax) {
  return new Aeroflow(randomEmitter(inclusiveMin, exclusiveMax));
}
/*
  aeroflow.range().take(3).dump().run();
  aeroflow.range(-3).take(3).dump().run();
  aeroflow.range(1, 1).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, -2).dump().run();
*/
function range(inclusiveStart, inclusiveEnd, step) {
  return new Aeroflow(rangeEmitter(inclusiveStart, inclusiveEnd, step));
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
objectDefineProperties(aeroflow, {
  adapters: { get: () => adapters },
  create: { value: create },
  empty: { enumerable: true, value: new Aeroflow(emptyEmitter()) },
  expand: { value: expand },
  just: { value: just },
  operators: { get: () => operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat }
});
