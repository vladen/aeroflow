'use strict';

import { AEROFLOW, ARRAY, CLASS, EMITTER, FUNCTION, ITERATOR, PROMISE, PROTOTYPE } from './symbols';
import {
  classOf, isFunction, objectDefineProperties, objectDefineProperty, objectCreate, noop
} from './utilites';
import { arrayEmitter } from './emitters/array';
import { countOperator } from './operators/count';
import { customEmitter } from './emitters/custom';
import { delayOperator } from './operators/delay';
import { dumpOperator } from './operators/dump';
import { emptyEmitter } from './emitters/empty';
import { expandEmitter } from './emitters/expand';
import { functionEmitter } from './emitters/function';
import { iterableEmitter } from './emitters/iterable';
import { promiseEmitter } from './emitters/promise';
import { randomEmitter } from './emitters/random';
import { rangeEmitter } from './emitters/range';
import { repeatEmitter } from './emitters/repeat';
import { valueEmitter } from './emitters/value';
import { reduceOperator } from './operators/reduce';
import { Context } from './context';

class Aeroflow {
  constructor(emitter) {
    objectDefineProperty(this, EMITTER, { value: emitter });
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
function chain(operator) {
  return new Aeroflow(operator(this[EMITTER]));
}
/**
* Counts the number of values emitted by this flow, returns new flow emitting only this value.
*
* @example
* aeroflow(['a', 'b', 'c']).count().dump().run();
* // next 3
* // done
*/
function count() {
  return this.chain(countOperator());
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
  return dumpOperator(prefix, logger);
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
const operators = objectCreate(null);
Aeroflow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  append: { configurable: true, value: append, writable: true },
  chain: { value: chain },
  count: { configurable: true, value: count, writable: true },
  dump: { configurable: true, value: dump, writable: true },
  prepend: { configurable: true, value: prepend, writable: true },
  reduce: { configurable: true, value: reduce, writable: true },
  run: { value: run }
});

const adapters = objectCreate(null, {
  [ARRAY]: { configurable: true, value: arrayEmitter, writable: true },
  [FUNCTION]: { configurable: true, value: functionEmitter, writable: true },
  [PROMISE]: { configurable: true, value: promiseEmitter, writable: true }
});

function emit(...sources) {
  switch (sources.length) {
    case 0: return emptyEmitter();
    case 1:
      const source = sources[0], sourceClass = classOf(source);
      if (sourceClass === AEROFLOW) return source[EMITTER];
      const adapter = adapters[sourceClass];
      if (isFunction(adapter)) return adapter(source);
      if (source && ITERATOR in source) return iterableEmitter(source);
      return valueEmitter(source);
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

export default function aeroflow(...sources) {
  return new Aeroflow(emit(...sources));
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
  return new Aeroflow(just(value));
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
  empty: { value: new Aeroflow(emptyEmitter()) },
  expand: { value: expand },
  just: { value: just },
  operators: { get: () => operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat }
});
