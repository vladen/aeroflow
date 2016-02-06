'use strict';

import { AEROFLOW, CLASS, PROTOTYPE } from './symbols';
import {
  classOf, isError, isFunction, objectDefineProperties, primitives, noop, objectCreate, toError
} from './utilites';

import { Context } from './context';

import { emptyEmitter } from './emitters/empty';
import { scalarEmitter } from './emitters/scalar';
import { adapters } from './emitters/adapters';
import { adapterEmitter } from './emitters/adapter';
import { customEmitter } from './emitters/custom';
import { expandEmitter } from './emitters/expand';
import { randomEmitter } from './emitters/random';
import { rangeEmitter } from './emitters/range';
import { repeatEmitter } from './emitters/repeat';

import { averageOperator } from './operators/average';
import { catchOperator } from './operators/catch';
import { countOperator } from './operators/count';
import { delayOperator } from './operators/delay';
import { distinctOperator } from './operators/distinct';
import { dumpOperator } from './operators/dump';
import { everyOperator } from './operators/every';
import { filterOperator } from './operators/filter';
import { flattenOperator } from './operators/flatten';
import { groupOperator } from './operators/group';
import { joinOperator } from './operators/join';
import { mapOperator } from './operators/map';
import { maxOperator } from './operators/max';
import { meanOperator } from './operators/mean';
import { minOperator } from './operators/min';
import { reduceOperator } from './operators/reduce';
import { retryOperator } from './operators/retry';
import { reverseOperator } from './operators/reverse';
import { skipOperator } from './operators/skip';
import { sliceOperator } from './operators/slice';
import { someOperator } from './operators/some';
import { sortOperator } from './operators/sort';
import { sumOperator } from './operators/sum';
import { takeOperator } from './operators/take';
import { tapOperator } from './operators/tap';
import { toArrayOperator } from './operators/toArray';
import { toMapOperator } from './operators/toMap';
import { toSetOperator } from './operators/toSet';
import { toStringOperator } from './operators/toString';

/**
Aeroflow class.

@alias Aeroflow

@property {function} emitter
@property {array} sources
*/
class Aeroflow {
  constructor(emitter, sources) {
    objectDefineProperties(this, {
      emitter: { value: emitter },
      sources: { value: sources }
    });
  }
}
/**
Returns new flow emitting values from this flow first 
and then from all provided sources without interleaving them.

@alias Aeroflow#append

@param {...any} [sources] Data sources to append to this flow.

@return {Aeroflow}
New flow emitting all values emitted by this flow first
and then all provided values.

@example
aeroflow(1)
  .append(2, [3, 4], new Promise(resolve => setTimeout(() => resolve(5), 500)))
  .dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5 // after 500ms
// done
*/
function append(...sources) {
  return new Aeroflow(this.emitter, this.sources.concat(sources));
}
/**
@alias Aeroflow#average

@return {Aeroflow}

@example
aeroflow().average().dump().run();
// done true
aeroflow(1, 2, 6).average().dump().run();
// next 3
// done true
*/
function average() {
  return this.chain(averageOperator());
}
/**
@alias Aeroflow#bind

@param {any} [sources]

@return {Aeroflow}

@example
aeroflow().dump().bind(1, 2, 3).run();
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).dump().bind(4, 5, 6).run();
// next 4
// next 5
// next 6
// done true
*/
function bind(...sources) {
  return new Aeroflow(this.emitter, sources);
}
/**
@alias Aeroflow#catch

@param {any} [alternative]

@return {Aeroflow}

@example
aeroflow.error('error').catch().dump().run();
// done false
aeroflow.error('error').dump('before ').catch('success').dump('after ').run();
// before done Error: error(…)
// after next success
// after done true
*/
function catch_(alternative) {
  return this.chain(catchOperator(alternative));
}
/**
@alias Aeroflow#chain

@param {function} [operator]

@return {Aeroflow}
*/
function chain(operator) {
  return new Aeroflow(operator(this.emitter), this.sources);
}
/**
Counts the number of values emitted by this flow, returns new flow emitting only this value.

@alias Aeroflow#count

@param {boolean} [optional]

@return {Aeroflow}

@example
aeroflow().count().dump().run();
// next 0
// done
aeroflow('a', 'b', 'c').count().dump().run();
// next 3
// done
*/
function count(optional) {
  return this.chain(countOperator(optional));
}
/**
Returns new flow delaying emission of each value accordingly provided condition.

@alias Aeroflow#delay

@param {number|date|function} [interval]
The condition used to determine delay for each subsequent emission.
Number is threated as milliseconds interval (negative number is considered as 0).
Date is threated as is (date in past is considered as now).
Function is execute for each emitted value, with three arguments:
  value - The current value emitted by this flow
  index - The index of the current value
  context - The context object
The result of condition function will be converted nu number and used as milliseconds interval.

@return {Aeroflow}

@example:
aeroflow(1, 2).delay(500).dump().run();
// next 1 // after 500ms
// next 2 // after 500ms
// done true // after 500ms
aeroflow(1, 2).delay(new Date(Date.now() + 500)).dump().run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(1, 2).delay((value, index) => 500 + 500 * index).dump().run();
// next 1 // after 500ms
// next 2 // after 1000ms
// done true
aeroflow(1, 2).delay(value => { throw new Error }).dump().run();
// done Error(…)
// Uncaught Error
*/
function delay(interval) {
  return this.chain(delayOperator(interval));
}
/**
@alias Aeroflow#distinct

@param {boolean} untilChanged

@return {Aeroflow}

@example
aeroflow(1, 1, 2, 2, 1, 1).distinct().dump().run();
// next 1
// next 2
// done true
aeroflow(1, 1, 2, 2, 1, 1).distinct(true).dump().run();
// next 1
// next 2
// next 1
// done true
*/
function distinct(untilChanged) {
  return this.chain(distinctOperator(untilChanged));
}
/**
Dumps all events (next, done) emitted by this flow to the logger with optional prefix.

@alias Aeroflow#dump

@param {string} [prefix='']
A string prefix to prepend to each event name.

@param {function} [logger=console.log]
Function to execute for each event emitted, taking two arguments:
name - The name of event emitted by this flow prepended with prefix.
value - The value of event emitted by this flow.

@return {Aeroflow}

@example
aeroflow(1, 2).dump(console.info.bind(console)).run();
// next 1
// next 2
// done true
aeroflow(1, 2).dump('test ', console.info.bind(console)).run();
// test next 1
// test next 2
// test done true
aeroflow(1, 2).dump(event => { if (event === 'next') throw new Error }).dump().run();
// done Error(…)
// Uncaught Error
*/
function dump(prefix, logger) {
  return this.chain(dumpOperator(prefix, logger));
}
/**
Tests whether all values emitted by this flow pass the provided test.

@alias Aeroflow#every

@param {function|regexp|any} [predicate]
The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

@return {Aeroflow}
New flow emitting true if all emitted values pass the test; otherwise, false.

@example
aeroflow().every().dump().run();
// next true
// done true
aeroflow('a', 'b').every('a').dump().run();
// next false
// done false
aeroflow(1, 2).every(value => value > 0).dump().run();
// next true
// done true
aeroflow(1, 2).every(value => { throw new Error }).dump().run();
// done Error(…)
// Uncaught Error
*/
function every(condition) {
  return this.chain(everyOperator(condition));
}
/**
Filters values emitted by this flow with the provided test.

@alias Aeroflow#filter

@param {function|regexp|any} [predicate]
The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

@return {Aeroflow}
New flow emitting only values passing the provided test.

@example
aeroflow().filter().dump().run();
// done true
aeroflow(0, 1).filter().dump().run();
// next 1
// done true
aeroflow('a', 'b', 'a').filter('a').dump().run();
// next "a"
// next "a"
// done true
aeroflow('a', 'b', 'a').filter(/a/).dump().run();
// next "b"
// next "b"
// done true
aeroflow(1, 2, 3, 4, 5).filter(value => (value % 2) === 0).dump().run();
// next 2
// next 4
// done true
aeroflow(1, 2).filter(value => { throw new Error }).dump().run();
// done Error: (…)
// Uncaught Error
*/
function filter(condition) {
  return this.chain(filterOperator(condition)); 
}
/**
@alias Aeroflow#flatten

@param {number} [depth]

@return {Aeroflow}

@example
aeroflow([[1, 2]]).flatten().dump().run();
// next 1
// next 2
// done true
aeroflow(() => [[1], [2]]).flatten(1).dump().run();
// next [1]
// next [2]
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
  .flatten().dump().run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
  .flatten(1).dump().run();
// next [1, 2] // after 500ms
// done true
*/
function flatten(depth) {
  return this.chain(flattenOperator(depth));
}
/**
@alias Aeroflow#group

@param {function|any[]} [selectors]

@return {Aeroflow}

@example
aeroflow.range(1, 10).group(value => (value % 2) ? 'odd' : 'even').dump().run();
// next ["odd", Array[5]]
// next ["even", Array[5]]
// done true
aeroflow(
  { country: 'Belarus', city: 'Brest' },
  { country: 'Poland', city: 'Krakow' },
  { country: 'Belarus', city: 'Minsk' },
  { country: 'Belarus', city: 'Grodno' },
  { country: 'Poland', city: 'Lodz' }
).group(value => value.country, value => value.city).dump().run();
// next ["Belarus", {{"Brest" => Array[1]}, {"Minsk" => Array[1]}, {"Grodno" => Array[1]}}]
// next ["Poland", {{"Krakow" => Array[1]}, {"Lodz" => Array[1]}}]
// done
*/
function group(...selectors) {
  return this.chain(groupOperator(selectors));
}
/**
@alias Aeroflow#join

@param {any} right
@param {function} comparer

@return {Aeroflow}

@example
aeroflow().join().dump().run();
// done true
aeroflow(1, 2).join().dump().run();
// next [1, undefined]
// next [2, undefined]
aeroflow(1, 2).join(0).dump().run();
// next [1, 0]
// next [2, 0]
// done true
aeroflow('a','b').join(1, 2).dump().run();
// next ["a", 1]
// next ["a", 2]
// next ["b", 1]
// next ["b", 2]
aeroflow([
  { country: 'USA', capital: 'Washington' },
  { country: 'Russia', capital: 'Moskow' }
]).join([
  { country: 'USA', currency: 'US Dollar' },
  { country: 'Russia', currency: 'Russian Ruble' }
], (left, right) => left.country === right.country)
.map(result => (
  { country: result[0].country, capital: result[0].capital, currency: result[1].currency }
))
.dump().run();
// next Object {country: "USA", capital: "Washington", currency: "US Dollar"}
// next Object {country: "Russia", capital: "Moskow", currency: "Russian Ruble"}
// done true
*/
function join(right, comparer) {
  return this.chain(joinOperator(right, comparer));
}
/**
@alias Aeroflow#map

@param {function|any} [mapping]

@return {Aeroflow}

@example
aeroflow().map().dump().run();
// done true
aeroflow(1, 2).map().dump().run();
// next 1
// next 2
// done true
aeroflow(1, 2).map('test').dump().run();
// next test
// next test
// done true
aeroflow(1, 2).map(value => value * 10).dump().run();
// next 10
// next 20
// done true
*/
function map(mapping) {
  return this.chain(mapOperator(mapping));
}
/**
Determines the maximum value emitted by this flow.

@alias Aeroflow#max

@return {Aeroflow}
New flow emitting the maximum value only.

@example
aeroflow().max().dump().run();
// done true
aeroflow(3, 1, 2).max().dump().run();
// next 3
// done true
aeroflow('b', 'a', 'c').max().dump().run();
// next c
// done true
*/
function max() {
  return this.chain(maxOperator());
}
/**
Determines the mean value emitted by this flow.

@alias Aeroflow#mean

@return {Aeroflow}
New flow emitting the mean value only.

@example
aeroflow().mean().dump().run();
// done true
aeroflow(3, 1, 2).mean().dump().run();
// next 2
// done true
aeroflow('a', 'd', 'f', 'm').mean().dump().run();
// next f
// done true
*/
function mean() {
  return this.chain(meanOperator());
}
/**
Determines the minimum value emitted by this flow.

@alias Aeroflow#min

@return {Aeroflow}
New flow emitting the minimum value only.

@example
aeroflow().min().dump().run();
// done true
aeroflow(3, 1, 2).min().dump().run();
// next 1
// done true
aeroflow('b', 'a', 'c').min().dump().run();
// next a
// done true
*/
function min() {
  return this.chain(minOperator());
}
/**
Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.

@alias Aeroflow#prepend

@param {any[]} [sources]
Values to prepend to this flow.

@return {Aeroflow}

@example
aeroflow(1)
  .prepend(2, [3, 4], new Promise(resolve => setTimeout(() => resolve(5), 500)))
  .dump().run();
// next 2
// next 3
// next 4
// next 5 // after 500ms
// next 1
// done
*/
function prepend(...sources) {
  return new Aeroflow(this.emitter, sources.concat(this.sources));
}
/**
Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,
returns new flow emitting reduced value.

@alias Aeroflow#reduce

@param {function|any} reducer
Function to execute on each emitted value, taking four arguments:
  result - the value previously returned in the last invocation of the reducer, or seed, if supplied;
  value - the current value emitted by this flow;
  index - the index of the current value emitted by the flow;
  context.data.
  If is not a function, the returned flow will emit just reducer value.
@param {any} seed
Value to use as the first argument to the first call of the reducer.
@param {boolean} optional

@return {Aeroflow}

@example
aeroflow().reduce().dump().run();
// done false
aeroflow().reduce('test').dump().run();
// next test
// done true
aeroflow(2, 4, 8).reduce((product, value) => product * value, 1).dump().run();
// next 64
// done
aeroflow(['a', 'b', 'c'])
  .reduce((product, value, index) => product + value + index, '')
  .dump().run();
// next a0b1c2
// done
*/
function reduce(reducer, seed, optional) {
  return this.chain(reduceOperator(reducer, seed, optional));
}
/**
@alias Aeroflow#retry

@param {number} attempts

@return {Aeroflow}

@example
var attempt = 0; aeroflow(() => {
  if (attempt++ % 2) return 'success';
  else throw new Error('error');
}).dump('before ').retry().dump('after ').run();
// before done Error: error(…)
// before next success
// after next success
// before done true
// after done true
*/
function retry(attempts) {
  return this.chain(retryOperator(attempts));
}
/**
@alias Aeroflow#reverse

@return {Aeroflow}

@example
aeroflow().reverse().dump().run();
// done true
aeroflow(1, 2, 3).reverse().dump().run();
// next 3
// next 2
// next 1
// done true
*/
function reverse() {
  return this.chain(reverseOperator());
}
/**
Runs this flow asynchronously, initiating source to emit values,
applying declared operators to emitted values and invoking provided callbacks.
If no callbacks provided, runs this flow for its side-effects only.

@alias Aeroflow#run

@param {function} [next]
Callback to execute for each emitted value, taking two arguments: result, context.
Or EventEmitter object.
Or EventTarget object.
Or Observer object.
@param {function} [done]
Callback to execute as emission is complete, taking two arguments: result, context.
@param {function} [data]
Arbitrary value passed to each callback invoked by this flow as context.data.

@return {Aeroflow}

@example
aeroflow(1, 2, 3).run(
  result => console.log('next', result),
  result => console.log('done', result));
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).dump().run(() => false);
// next 1
// done false
aeroflow(Promise.reject('test')).dump().run();
// done Error: test(…)
// Uncaught Error
aeroflow(Promise.reject('test')).dump().run(() => {}, () => {});
// done Error: test(…)
window.addEventListener('next', event => console.log(event));
window.addEventListener('done', event => console.log(event));
aeroflow('test').run(window);
// CustomEvent {detail: "test", type: "next", ...
// CustomEvent {detail: "true", type: "done", ...
 */
function run(next, done, data) {
  if (isFunction(next)) {
    if (!isFunction(done)) {
      data = done;
      done = result => {
        if (isError(result)) throw result;
      };
    }
  }
  else if (primitives.has(classOf(next))) {
    data = next;
    next = noop;
    done = result => {
      if (isError(result)) throw result;
    };
  }
  else if (isFunction(next.dispatchEvent)) {
    const target = next;
    data = done;
    done = result => {
      target.dispatchEvent(new CustomEvent('done', { detail: result }));
      return true;
    };
    next = result => {
      target.dispatchEvent(new CustomEvent('next', { detail: result }));
      return true;
    };
  }
  else if (isFunction(next.emit)) {
    const emitter = next;
    data = done;
    done = result => {
      emitter.emit('done', result);
      return true;
    };
    next = result => {
      emitter.emit('next', result);
      return true;
    };
  }
  else if (isFunction(next.onNext) && isFunction(next.onError) && isFunction(next.onCompleted)) {
    const observer = next;
    data = done;
    done = result => {
      (isError(result) ? observer.onError : observer.onCompleted)(result);
      return true;
    };
    next = result => {
      observer.onNext(result);
      return true;
    };
  }
  const context = new Context(data, this);
  setImmediate(() => context.flow.emitter(
    result => false !== next(result, data),
    result => done(result, data),
    context));
  return this;
}
/**
Skips some of the values emitted by this flow,
returns flow emitting remaining values.

@alias Aeroflow#skip

@param {number|function|any} [condition] 
The number or predicate function used to determine how many values to skip.
  If omitted, returned flow skips all values emitting done event only.
  If zero, returned flow skips nothing.
  If positive number, returned flow skips this number of first emitted values.
  If negative number, returned flow skips this number of last emitted values.
  If function, returned flow skips emitted values while this function returns trythy value.

@return {Aeroflow}
New flow emitting remaining values.

@example
aeroflow(1, 2, 3).skip().dump().run();
// done true
aeroflow(1, 2, 3).skip(1).dump().run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).skip(-1).dump().run();
// next 1
// next 2
// done true
aeroflow(1, 2, 3).skip(value => value < 3).dump().run();
// next 3
// done true
  */
function skip(condition) {
  return this.chain(skipOperator(condition));
}
/**
@alias Aeroflow#slice

@param {number} [begin]
@param {number} [end]

@return {Aeroflow}

@example
aeroflow(1, 2, 3).slice().dump().run();
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1).dump().run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1, 2).dump().run();
// next 2
// done false
aeroflow(1, 2, 3).slice(-2).dump().run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(-3, -1).dump().run();
// next 1
// next 2
// done true
*/
function slice(begin, end) {
  return this.chain(sliceOperator(begin, end));
}
/**
Tests whether some value emitted by this flow passes the predicate test,
returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.

@alias Aeroflow#some

@param {function|regexp|any} [predicate]
The predicate function or regular expression object used to test each emitted value.
Or scalar value to compare emitted values with.
If omitted, truthy predicate is used.

@return {Aeroflow}
New flow that emits true or false.

@example
aeroflow().some().dump().run();
// next false
// done true
aeroflow(1, 2, 3).some(2).dump().run();
// next true
// done false
aeroflow(1, 2, 3).some(value => value % 2).dump().run();
// next true
// done false
aeroflow(1, 2, 3).some(value => { throw new Error }).dump().run();
// done Error(…)
// Uncaught Error
*/
function some(condition) {
  return this.chain(someOperator(condition));
}
/**
@alias Aeroflow#sort

@param {function|boolean|'desc'[]} [parameters]

@return {Aeroflow}

@return {Aeroflow}

@example
aeroflow(3, 1, 2).sort().dump().run();
// next 1
// next 2
// next 3
// done true
aeroflow(2, 1, 3).sort('desc').dump().run();
// next 3
// next 2
// next 1
// done true
aeroflow(
  { country: 'Belarus', city: 'Brest' },
  { country: 'Poland', city: 'Krakow' },
  { country: 'Belarus', city: 'Minsk' },
  { country: 'Belarus', city: 'Grodno' },
  { country: 'Poland', city: 'Lodz' }
).sort(value => value.country, value => value.city, 'desc').dump().run();
// next Object {country: "Belarus", city: "Minsk"}
// next Object {country: "Belarus", city: "Grodno"}
// next Object {country: "Belarus", city: "Brest"}
// next Object {country: "Poland", city: "Lodz"}
// next Object {country: "Poland", city: "Krakow"}
// done true
*/
function sort(...parameters) {
  return this.chain(sortOperator(parameters));
}
/**
@alias Aeroflow#sum

@return {Aeroflow}

@example
aeroflow().sum().dump().run();
// done true
aeroflow('test').sum().dump().run();
// next NaN
// done true
aeroflow(1, 2, 3).sum().dump().run();
// next 6
// done true
*/
function sum() {
  return this.chain(sumOperator());
}
/**
@alias Aeroflow#take

@param {function|number} [condition]

@return {Aeroflow}

@example
aeroflow(1, 2, 3).take().dump().run();
// done false
aeroflow(1, 2, 3).take(1).dump().run();
// next 1
// done false
aeroflow(1, 2, 3).take(-1).dump().run();
// next 3
// done true
*/
function take(condition) {
  return this.chain(takeOperator(condition));
}
/**
Executes provided callback once per each value emitted by this flow,
returns new tapped flow or this flow if no callback provided.

@alias Aeroflow#tap

@param {function} [callback]
Function to execute for each value emitted, taking three arguments:
  value emitted by this flow,
  index of the value,
  context object.

@return {Aeroflow}

@example
aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();
// value: 1 index: 0
// value: 2 index: 1
// value: 3 index: 2
*/
function tap(callback) {
  return this.chain(tapOperator(callback));
}
/**
Collects all values emitted by this flow to array, returns flow emitting this array.

@alias Aeroflow#toArray

@return {Aeroflow}
New flow that emits an array.

@example
aeroflow().toArray().dump().run();
// next []
// done true
aeroflow('test').toArray().dump().run();
// next ["test"]
// done true
aeroflow(1, 2, 3).toArray().dump().run();
// next [1, 2, 3]
// done true
*/
function toArray() {
  return this.chain(toArrayOperator());
}
/**
Collects all values emitted by this flow to ES6 map, returns flow emitting this map.

@alias Aeroflow#toMap

@param {function|any} [keyTransformation]
The mapping function used to transform each emitted value to map key.
Or scalar value to use as map key.
@param {function|any} [valueTransformation]
The mapping function used to transform each emitted value to map value,
Or scalar value to use as map value.

@return {Aeroflow}
New flow that emits a map.

@example
aeroflow().toMap().dump().run();
// next Map {}
// done true
aeroflow('test').toMap().dump().run();
// next Map {"test" => "test"}
done true
aeroflow(1, 2, 3).toMap(v => 'key' + v, true).dump().run();
// next Map {"key1" => true, "key2" => true, "key3" => true}
// done true
aeroflow(1, 2, 3).toMap(v => 'key' + v, v => 10 * v).dump().run();
// next Map {"key1" => 10, "key2" => 20, "key3" => 30}
// done true
*/
function toMap(keyTransformation, valueTransformation) {
   return this.chain(toMapOperator(keyTransformation, valueTransformation));
}
/**
Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

@alias Aeroflow#toSet

@return {Aeroflow}
New flow that emits a set.

@example
aeroflow().toSet().dump().run();
// next Set {}
// done true
aeroflow(1, 2, 3).toSet().dump().run();
// next Set {1, 2, 3}
// done true
*/
function toSet() {
  return this.chain(toSetOperator()); 
}
/**
@alias Aeroflow#toString

@param {string|function} [separator]
@param {boolean} [optional]

@example
aeroflow().toString().dump().run();
// next
// done true
aeroflow('test').toString().dump().run();
// next test
// done true
aeroflow(1, 2, 3).toString().dump().run();
// next 1,2,3
// done true
aeroflow(1, 2, 3).toString(';').dump().run();
// next 1;2;3
// done true
aeroflow(1, 2, 3).toString((value, index) => '-'.repeat(index + 1)).dump().run();
// next 1--2---3
// done true
*/
function toString(separator, optional) {
  return this.chain(toStringOperator(separator, optional)); 
}
const operators = objectCreate(Object[PROTOTYPE], {
  average: { value: average, writable: true },
  catch: { value: catch_, writable: true },
  count: { value: count, writable: true },
  delay: { value: delay, writable: true },
  distinct: { value: distinct, writable: true },
  dump: { value: dump, writable: true },
  every: { value: every, writable: true },
  filter: { value: filter, writable: true },
  flatten: { value: flatten, writable: true },
  group: { value: group, writable: true },
  join: { value: join, writable: true },
  map: { value: map, writable: true },
  max: { value: max, writable: true },
  mean: { value: mean, writable: true },
  min: { value: min, writable: true },
  reduce: { value: reduce, writable: true },
  retry: { value: retry, writable: true },
  reverse: { value: reverse, writable: true },
  skip: { value: skip, writable: true },
  slice: { value: slice, writable: true },
  some: { value: some, writable: true },
  sort: { value: sort, writable: true },
  sum: { value: sum, writable: true },
  take: { value: take, writable: true },
  tap: { value: tap, writable: true },
  toArray: { value: toArray, writable: true },
  toMap: { value: toMap, writable: true },
  toSet: { value: toSet, writable: true },
  toString: { value: toString, writable: true }
});
Aeroflow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  append: { value: append },
  bind: { value: bind },
  chain: { value: chain },
  prepend: { value: prepend },
  run: { value: run }
});

function emit(next, done, context) {
  const sources = context.flow.sources, limit = sources.length;
  let index = -1;
  !function proceed(result) {
    if (result !== true || ++index >= limit) done(result);
    else try {
      adapterEmitter(sources[index], true)(next, proceed, context);
    }
    catch (err) {
      done(err);
    }
  }(true);
}
/**
Creates new flow emitting values from all provided data sources in series.

@alias aeroflow

@param {any[]} sources
Data sources.

@return {Aeroflow}

@property {object} adapters
@property {operators} adapters

@example
aeroflow().dump().run();
// done true
aeroflow(
  1,
  [2, 3],
  new Set([4, 5]),
  () => 6,
  Promise.resolve(7),
  new Promise(resolve => setTimeout(() => resolve(8), 500))
).dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5
// next 6
// next 7
// next 8 // after 500ms
// done true
aeroflow(() => { throw new Error }).dump().run();
// done Error(…)
// Uncaught Error
aeroflow("test").dump().run();
// next test
// done true
aeroflow.adapters['String'] = aeroflow.adapters['Array'];
aeroflow("test").dump().run();
// next t
// next e
// next s
// next t
// done true
*/
export default function aeroflow(...sources) {
  return new Aeroflow(emit, sources);
}
/**
Creates programmatically controlled flow.

@alias aeroflow.create

@param {function|any} emitter
The emitter function taking three arguments:
next - the function emitting 'next' event,
done - the function emitting 'done' event,
context - the execution context.

@return {Aeroflow}
The new flow emitting values generated by emitter function.

@example
aeroflow.create((next, done, context) => {
  next(1);
  next(2);
  done();
}).dump().run();
// next 1
// next 2
// done true
*/
function create(emitter) {
  return new Aeroflow(customEmitter(emitter));
}
/**
@alias aeroflow.error

@param {string|error} [message]

@return {Aeroflow}

@example
aeroflow.error('test').run();
// Uncaught Error: test
*/
function error(message) {
  return new Aeroflow(emptyEmitter(toError(message)));
}
/**
@alias aeroflow.expand

@param {function} expander
@param {any} [seed]

@return {Aeroflow}

@example
aeroflow.expand(value => value * 2, 1).take(3).dump().run();
// next 2
// next 4
// next 8
// done false
*/
function expand(expander, seed) {
  return new Aeroflow(expandEmitter(expander, seed));
}
/**
Creates new flow emitting the provided value only.

@alias aeroflow.just

@param {any} value
The value to emit.

@return {Aeroflow}
The new flow emitting provided value.

@example
aeroflow.just([1, 2, 3]).dump().run();
// next [1, 2, 3]
// done
*/
function just(value) {
  return new Aeroflow(scalarEmitter(value));
}
/**
Creates new flow emitting infinite sequence of random numbers.

@alias aeroflow.random

@param {number} [minimum]
@param {number} [maximum]

@return {Aeroflow}
The new flow emitting random numbers.

@example
aeroflow.random().take(3).dump().run();
// next 0.07417976693250232
// next 0.5904422281309957
// next 0.792132444214075
// done false
aeroflow.random(1, 9).take(3).dump().run();
// next 7
// next 2
// next 8
// done false
aeroflow.random(1.1, 8.9).take(3).dump().run();
next 4.398837305698544
// next 2.287970747705549
// next 3.430788825778291
// done false
*/
function random(minimum, maximum) {
  return new Aeroflow(randomEmitter(minimum, maximum));
}
/**
@alias aeroflow.range

@param {number} [start]
@param {number} [end]
@param {number} [step]

@return {Aeroflow}

@example
aeroflow.range().take(3).dump().run();
// next 0
// next 1
// next 2
// done false
aeroflow.range(-3).take(3).dump().run();
// next -3
// next -2
// next -1
// done false
aeroflow.range(1, 1).dump().run();
// next 1
// done true
aeroflow.range(0, 5, 2).dump().run();
// next 0
// next 2
// next 4
// done true
aeroflow.range(5, 0, -2).dump().run();
// next 5
// next 3
// next 1
// done true
*/
function range(start, end, step) {
  return new Aeroflow(rangeEmitter(start, end, step));
}
/**
Creates flow repeating provided value.

@alias aeroflow.repeat

@param {function|any} [value]
Arbitrary static value to repeat;
or function providing dynamic values and invoked with two arguments:
  index - index of the value being emitted,
  data - contextual data.
@param {number|function} [interval]

@return {Aeroflow}
The new flow emitting repeated values.

@example
aeroflow.repeat(Math.random()).take(2).dump().run();
// next 0.7492001398932189
// next 0.7492001398932189
// done false
aeroflow.repeat(() => Math.random()).take(2).dump().run();
// next 0.46067174314521253
// next 0.7977648684754968
// done false
aeroflow.repeat(index => Math.pow(2, index)).take(3).dump().run();
// next 1
// next 2
// next 4
// done false
aeroflow.repeat('ping', 500).take(3).dump().run();
// next ping // after 500ms
// next ping // after 500ms
// next ping // after 500ms
// done false
aeroflow.repeat(index => index, index => 500 + 500 * index).take(3).dump().run();
// next ping // after 500ms
// next ping // after 1000ms
// next ping // after 1500ms
// done false
*/
function repeat(value, interval) {
  return new Aeroflow(repeatEmitter(value, interval));
}
objectDefineProperties(aeroflow, {
  adapters: { value: adapters },
  create: { value: create },
  empty: { enumerable: true, value: new Aeroflow(emptyEmitter(true)) },
  error: { value: error },
  expand: { value: expand },
  just: { value: just },
  operators: { value: operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat }
});
