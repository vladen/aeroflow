'use strict';

import { AEROFLOW, CLASS, PROMISE, PROTOTYPE } from './symbols';
import { isFunction, isNothing, objectDefineProperties, objectCreate, noop } from './utilites';
import { Context } from './context';
import { customGenerator } from './emitters/custom';
import { emptyEmitter } from './emitters/empty';
import { expandGenerator } from './emitters/expand';
import { randomGenerator } from './emitters/random';
import { rangeGenerator } from './emitters/range';
import { repeatGenerator } from './emitters/repeat';
import { valueEmitter } from './emitters/value';
import { adapters } from './adapters';
import { emit } from './emit';
import { countOperator } from './operators/count';
import { delayOperator } from './operators/delay';
import { dumpOperator } from './operators/dump';
import { everyOperator } from './operators/every';
import { filterOperator } from './operators/filter';
import { joinOperator } from './operators/join';
import { mapOperator } from './operators/map';
import { maxOperator } from './operators/max';
import { reduceOperator } from './operators/reduce';
import { tapOperator } from './operators/tap';
import { timestampOperator } from './operators/timestamp';
import { toArrayOperator } from './operators/toArray';
import { toMapOperator } from './operators/toMap';
import { toSetOperator } from './operators/toSet';

class Aeroflow {
  constructor(emitter, source) {
    objectDefineProperties(this, {
      emitter: { value: emitter },
      source: { value: source }
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
  return aeroflow(this, ...sources);
}
function bind(source) {
  return new Aeroflow(this.emitter, source);
}
function chain(operator) {
  return new Aeroflow(operator(this.emitter), this.source);
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
export function delay(condition) {
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
  * aeroflow(1, 2, 3).dump('test ', console.info.bind(console)).run();
  * // test next 1
  * // test next 2
  * // test next 3
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
function join(separator, optional) {
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
  return aeroflow(...sources, this);
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
  const context = new Context(this.source, data), emitter = this.emitter;
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
const operators = objectCreate(null);
Aeroflow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  append: { configurable: true, value: append, writable: true },
  bind: { value: bind },
  chain: { value: chain },
  count: { configurable: true, value: count, writable: true },
  dump: { configurable: true, value: dump, writable: true },
  every: { configurable: true, value: every, writable: true },
  filter: { configurable: true, value: filter, writable: true },
  join: { configurable: true, value: join, writable: true },
  map: { configurable: true, value: map, writable: true },
  max: { configurable: true, value: max, writable: true },
  prepend: { configurable: true, value: prepend, writable: true },
  reduce: { configurable: true, value: reduce, writable: true },
  run: { value: run },
  tap: { configurable: true, value: tap, writable: true },
  timestamp: { configurable: true, value: timestamp, writable: true },
  toArray: { configurable: true, value: toArray, writable: true },
  toMap: { configurable: true, value: toMap, writable: true },
  toSet: { configurable: true, value: toSet, writable: true },
});

function prebind(emitter) {
  return (next, done, context) => {
    const source = context.source;
    if (isNothing(source)) emitter(next, done, context);
    else emit(source)(next, done, context);
  }
}

export default function aeroflow(...sources) {
  return new Aeroflow(prebind(emptyEmitter()), sources);
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
  return new Aeroflow(customGenerator(emitter));
}
function expand(expander, seed) {
  return new Aeroflow(expandGenerator(expander, seed))
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
  return new Aeroflow(valueAdapter(value));
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
  return new Aeroflow(randomGenerator(inclusiveMin, exclusiveMax));
}
/*
  aeroflow.range().take(3).dump().run();
  aeroflow.range(-3).take(3).dump().run();
  aeroflow.range(1, 1).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, -2).dump().run();
*/
function range(inclusiveStart, inclusiveEnd, step) {
  return new Aeroflow(rangeGenerator(inclusiveStart, inclusiveEnd, step));
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
  return new Aeroflow(repeatGenerator(value));
}
objectDefineProperties(aeroflow, {
  adapters: { get: () => adapters },
  create: { value: create },
  empty: { value: new Aeroflow(emptyEmitter()) },
  expand: { value: expand },
  just: { value: just },
  operators: { get: () => operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat }
});
