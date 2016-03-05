import { AEROFLOW, CLASS, CONTEXT, EMITTER, PROTOTYPE } from './symbols';
import { isDefined, isError, isFunction, noop, objectCreate, objectDefineProperty } from './utilites';
import { notifier } from './notifiers/index';

import {
  averageOperator,
  catchOperator,
  coalesceOperator,
  concatOperator,
  countOperator,
  delayOperator,
  distinctOperator,
  everyOperator,
  filterOperator,
  flattenOperator,
  groupOperator,
  mapOperator,
  maxOperator,
  meanOperator,
  minOperator,
  reduceOperator,
  replayOperator,
  retryOperator,
  reverseOperator,
  shareOperator,
  skipOperator,
  sliceOperator,
  someOperator,
  sortOperator,
  sumOperator,
  takeOperator,
  toArrayOperator,
  toMapOperator,
  toSetOperator,
  toStringOperator
} from './operators/index';

/**
@class

@property {function} emitter
@property {array} sources
*/
function Flow() { }

function defineOperator(defintion, operator) {
  defintion[operator.name[0] === '_' ? operator.name.substring(1) : operator.name] =
    { configurable: true, value: operator, writable: true };
  return defintion;
}

export const operators = objectCreate(Object[PROTOTYPE], [
  average,
  _catch,
  coalesce,
  concat,
  count,
  delay,
  distinct,
  every,
  filter,
  flatten,
  group,
  map,
  max,
  mean,
  min,
  notify,
  reduce,
  replay,
  retry,
  reverse,
  share,
  skip,
  slice,
  some,
  sort,
  sum,
  take,
  toArray,
  toMap,
  toSet,
  toString
].reduce(defineOperator, {}));

Flow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  chain: { value: chain },
  run: { value: run }
});

export default function instance(emitter) {
  return objectDefineProperty(new Flow, EMITTER, { value: emitter });
}

/**
@alias Flow#average

@return {Flow}

@example
aeroflow().average().notify(console).run();
// done true
aeroflow('test').average().notify(console).run();
// next NaN
// done true
aeroflow(1, 2, 6).average().notify(console).run();
// next 3
// done true
*/
function average() {
  return this.chain(averageOperator());
}

/**
Returns new flow suppressing error, emitted by this flow, or replacing it with alternative data source.

@alias Flow#catch

@param {function|any} [alternative]
Optional alternative data source to replace error, emitted by this flow.
If not passed, the emitted error is supressed.
If a function passed, it is called with two arguments:
1) the error, emitted by this flow,
2) context data (see {@link Flow#run} method documentation for additional information about context data).
The result, returned by this function, as well as any other value passed as alternative,
is adapted with suitable adapter from {@link aeroflow.adapters} registry and emitted to this flow.

@return {Flow}

@example
aeroflow(new Error('test')).catch().notify(console).run();
// done false
aeroflow(new Error('test')).dump('before ').catch('success').dump('after ').run();
// before done Error: test(…)
// after next success
// after done false
aeroflow(new Error('test')).catch([1, 2]).notify(console).run();
// next 1
// next 2
// done false
aeroflow(new Error('test')).catch(() => [1, 2]).notify(console).run();
// next 1
// next 2
// done false
aeroflow(new Error('test')).catch(() => [[1], [2]]).notify(console).run();
// next [1]
// next [2]
// done false
*/
function _catch(alternative) {
  return this.chain(catchOperator(alternative));
}

/**
@alias Flow#chain

@param {function} [operator]

@return {Flow}
*/
function chain(operator) {
  return instance(operator(this[EMITTER]), this.sources);
}

/**
Returns new flow emitting values from alternate data source when this flow is empty.

@alias Flow#coalesce

@param {any} [alternative]
Optional alternative data source to use when this flow is empty.
If not passed, this method does nothing.
If a function passed, it is called with one argument:
1) the context data (see {@link Flow#run} method documentation for additional information about context data).
The result, returned by this function, as well as any other value passed as alternative,
is adapted with suitable adapter from {@link aeroflow.adapters} registry and emitted to this flow.

@return {Flow}

@example
aeroflow.empty.coalesce().notify(console).run();
// done true
aeroflow.empty.coalesce([1, 2]).notify(console).run();
// next 1
// next 2
// done true
aeroflow.empty.coalesce(() => [1, 2]).notify(console).run();
// next 1
// next 2
// done true
aeroflow.empty.coalesce(() => [[1], [2]]).notify(console).run();
// next [1]
// next [2]
// done true
*/
function coalesce(alternative) {
  return this.chain(coalesceOperator(alternative));
}

/*
Returns new flow emitting values from this flow first 
and then from all provided sources in series.

@alias Flow#concat

@param {any} [sources]
Data sources to append to this flow.

@return {Flow}
New flow emitting all values emitted by this flow first
and then all provided values.

@example
aeroflow(1).concat(
  2,
  [3, 4],
  () => 5,
  Promise.resolve(6),
  new Promise(resolve => setTimeout(() => resolve(7), 500))
).notify(console).run();
// next 1
// next 2
// next 3
// next 4
// next 5
// next 6
// next 7 // after 500ms
// done
*/
function concat(...sources) {
  return this.chain(concatOperator(sources));
}


/**
Counts the number of values emitted by this flow, returns new flow emitting only this value.

@alias Flow#count

@return {Flow}

@example
aeroflow().count().notify(console).run();
// next 0
// done
aeroflow('a', 'b', 'c').count().notify(console).run();
// next 3
// done
*/
function count() {
  return this.chain(countOperator());
}

/**
Returns new flow delaying emission of each value accordingly provided condition.

@alias Flow#delay

@param {number|date|function} [interval]
The condition used to determine delay for each subsequent emission.
Number is threated as milliseconds interval (negative number is considered as 0).
Date is threated as is (date in past is considered as now).
Function is execute for each emitted value, with three arguments:
  value - The current value emitted by this flow
  index - The index of the current value
  context - The context object
The result of condition function will be converted to number and used as milliseconds interval.

@return {Flow}

@example:
aeroflow(1, 2).delay(500).notify(console).run();
// next 1 // after 500ms
// next 2 // after 500ms
// done true // after 500ms
aeroflow(1, 2).delay(new Date(Date.now() + 500)).notify(console).run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(1, 2).delay((value, index) => 500 + 500 * index).notify(console).run();
// next 1 // after 500ms
// next 2 // after 1000ms
// done true
aeroflow(1, 2).delay(value => { throw new Error }).notify(console).run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
*/
function delay(interval) {
  return this.chain(delayOperator(interval));
}

/**
@alias Flow#distinct

@param {boolean} untilChanged

@return {Flow}

@example
aeroflow(1, 1, 2, 2, 1, 1).distinct().notify(console).run();
// next 1
// next 2
// done true
aeroflow(1, 1, 2, 2, 1, 1).distinct(true).notify(console).run();
// next 1
// next 2
// next 1
// done true
*/
// TODO: distinct by selector
function distinct(untilChanged) {
  return this.chain(distinctOperator(untilChanged));
}

/**
Tests whether all values emitted by this flow pass the provided test.

@alias Flow#every

@param {function|regexp|any} [predicate]
The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

@return {Flow}
New flow emitting true if all emitted values pass the test; otherwise, false.

@example
aeroflow().every().notify(console).run();
// next true
// done true
aeroflow('a', 'b').every('a').notify(console).run();
// next false
// done false
aeroflow(1, 2).every(value => value > 0).notify(console).run();
// next true
// done true
aeroflow(1, 2).every(value => { throw new Error }).notify(console).run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
*/
function every(condition) {
  return this.chain(everyOperator(condition));
}

/**
Filters values emitted by this flow with the provided test.

@alias Flow#filter

@param {function|regexp|any} [predicate]
The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

@return {Flow}
New flow emitting only values passing the provided test.

@example
aeroflow().filter().notify(console).run();
// done true
aeroflow(0, 1).filter().notify(console).run();
// next 1
// done true
aeroflow('a', 'b', 'a').filter('a').notify(console).run();
// next "a"
// next "a"
// done true
aeroflow('a', 'b', 'a').filter(/a/).notify(console).run();
// next "b"
// next "b"
// done true
aeroflow(1, 2, 3, 4, 5).filter(value => (value % 2) === 0).notify(console).run();
// next 2
// next 4
// done true
aeroflow(1, 2).filter(value => { throw new Error }).notify(console).run();
// done Error: (…)
// Uncaught (in promise) Error: test(…)
*/
function filter(condition) {
  return this.chain(filterOperator(condition)); 
}

/**
@alias Flow#flatten

@param {number} [depth]

@return {Flow}

@example
aeroflow([[1, 2]]).flatten().notify(console).run();
// next 1
// next 2
// done true
aeroflow(() => [[1], [2]]).flatten(1).notify(console).run();
// next [1]
// next [2]
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
  .flatten().notify(console).run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
  .flatten(1).notify(console).run();
// next [1, 2] // after 500ms
// done true
*/
function flatten(depth) {
  return this.chain(flattenOperator(depth));
}

/**
@alias Flow#group

@param {function|any[]} [selectors]

@return {Flow}

@example
aeroflow.range(1, 10).group(value => (value % 2) ? 'odd' : 'even').notify(console).run();
// next ["odd", Array[5]]
// next ["even", Array[5]]
// done true
aeroflow(
  { country: 'Belarus', city: 'Brest' },
  { country: 'Poland', city: 'Krakow' },
  { country: 'Belarus', city: 'Minsk' },
  { country: 'Belarus', city: 'Grodno' },
  { country: 'Poland', city: 'Lodz' }
).group(value => value.country, value => value.city).notify(console).run();
// next ["Belarus", {{"Brest" => Array[1]}, {"Minsk" => Array[1]}, {"Grodno" => Array[1]}}]
// next ["Poland", {{"Krakow" => Array[1]}, {"Lodz" => Array[1]}}]
// done
*/
function group(...selectors) {
  return this.chain(groupOperator(selectors));
}

/*
@alias Flow#join

@param {any} right
@param {function} comparer

@return {Flow}

@example
aeroflow().join().notify(console).run();
// done true
aeroflow(1, 2).join().notify(console).run();
// next [1, undefined]
// next [2, undefined]
aeroflow(1, 2).join(0).notify(console).run();
// next [1, 0]
// next [2, 0]
// done true
aeroflow('a','b').join(1, 2).notify(console).run();
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
.notify(console).run();
// next Object {country: "USA", capital: "Washington", currency: "US Dollar"}
// next Object {country: "Russia", capital: "Moskow", currency: "Russian Ruble"}
// done true

function join(right, comparer) {
  return this.chain(joinOperator(right, comparer));
}
*/

/**
@alias Flow#map

@param {function|any} [mapper]

@return {Flow}

@example
aeroflow().map().notify(console).run();
// done true
aeroflow(1, 2).map().notify(console).run();
// next 1
// next 2
// done true
aeroflow(1, 2).map('test').notify(console).run();
// next test
// next test
// done true
aeroflow(1, 2).map(value => value * 10).notify(console).run();
// next 10
// next 20
// done true
*/
function map(mapper) {
  return this.chain(mapOperator(mapper));
}

/**
Determines the maximum value emitted by this flow.

@alias Flow#max

@return {Flow}
New flow emitting the maximum value only.

@example
aeroflow().max().notify(console).run();
// done true
aeroflow(1, 3, 2).max().notify(console).run();
// next 3
// done true
aeroflow('b', 'a', 'c').max().notify(console).run();
// next c
// done true
*/
function max() {
  return this.chain(maxOperator());
}

/**
Determines the mean value emitted by this flow.

@alias Flow#mean

@return {Flow}
New flow emitting the mean value only.

@example
aeroflow().mean().notify(console).run();
// done true
aeroflow(3, 1, 2).mean().notify(console).run();
// next 2
// done true
aeroflow('a', 'd', 'f', 'm').mean().notify(console).run();
// next f
// done true
*/
function mean() {
  return this.chain(meanOperator());
}

/**
Determines the minimum value emitted by this flow.

@alias Flow#min

@return {Flow}
New flow emitting the minimum value only.

@example
aeroflow().min().notify(console).run();
// done true
aeroflow(3, 1, 2).min().notify(console).run();
// next 1
// done true
aeroflow('b', 'a', 'c').min().notify(console).run();
// next a
// done true
*/
function min() {
  return this.chain(minOperator());
}

function notify(target, ...parameters) {
  return this.chain(notifier(target, parameters));
}

/**
Applies a function against an accumulator and each value emitted by this flow
to reduce it to a single value, returns new flow emitting the reduced value.

@alias Flow#reduce

@param {function|any} [reducer]
Function to execute on each emitted value, taking four arguments:
  result - the value previously returned in the last invocation of the reducer, or seed, if supplied;
  value - the current value emitted by this flow;
  index - the index of the current value emitted by the flow;
  data - the data bound to current execution context.
  If is not a function, the returned flow will emit just the reducer value.
@param {any|boolean} [accumulator]
Value to use as the first argument to the first call of the reducer.
When boolean value is passed and no value defined for the 'required' argument,
the 'seed' argument is considered to be omitted.
@param {boolean} [required=false]
True to emit reduced result always, even if this flow is empty.
False to emit only 'done' event for empty flow.

@return {Flow}
New flow emitting reduced result only or no result at all if this flow is empty
and the 'required' argument is false.

@example
aeroflow().reduce().notify(console).run();
// done false
aeroflow(1, 2).reduce().notify(console).run();
// done false
aeroflow().reduce('test').notify(console).run();
// next test
// done true
aeroflow().reduce((product, value) => product * value).notify(console).run();
// next undefined
// done true
aeroflow().reduce((product, value) => product * value, 1, true).notify(console).run();
// next 1
// done true
aeroflow(2, 4, 8).reduce((product, value) => product * value).notify(console).run();
// next 64
// done
aeroflow(2, 4, 8).reduce((product, value) => product * value, 2).notify(console).run();
// next 128
// done
aeroflow(['a', 'b', 'c'])
  .reduce((product, value, index) => product + value + index, '')
  .notify(console).run();
// next a0b1c2
// done
*/
function reduce(reducer, accumulator) {
  return this.chain(reduceOperator(reducer, accumulator, isDefined(accumulator)));
}

/**
@alias Flow#replay

@param {number|function} delay
@param {boolean} timing

@return {Flow}

@example
aeroflow(1, 2).replay(1000).take(4).notify(console).run();
// next 1
// next 2
// next 1 // after 1000ms
// next 2
// done false
aeroflow(1, 2).delay(500).replay(1000).take(4).notify(console).run();
// next 1
// next 2 // after 500ms
// next 1 // after 1000ms
// next 2
// done false
aeroflow(1, 2).delay(500).replay(1000, true).take(4).notify(console).run();
// next 1
// next 2 // after 500ms
// next 1 // after 1000ms
// next 2 // after 500ms
// done false
*/
function replay(interval, timing) {
  return this.chain(replayOperator(interval, timing));
}

/**
@alias Flow#retry

@param {number} attempts

@return {Flow}

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
@alias Flow#reverse

@return {Flow}

@example
aeroflow().reverse().notify(console).run();
// done true
aeroflow(1, 2, 3).reverse().notify(console).run();
// next 3
// next 2
// next 1
// done true
*/
function reverse() {
  return this.chain(reverseOperator());
}

/**
Runs this flow.

@alias Flow#run

@param {function|any} [next]
Optional callback called for each data value emitted by this flow with 3 arguments:
1) the emitted value,
2) zero-based index of emitted value,
3) context data.
When passed something other than function, it considered as context data.
@param {function|any} [done]
Optional callback called after this flow has finished emission of data with 2 arguments:
1) the error thrown within this flow
or boolean value indicating lazy (false) or eager (true) enumeration of data sources,
2) context data.
When passed something other than function, it considered as context data.

@return {Promise}
New promise,
resolving to the latest value emitted by this flow (for compatibility with ES7 await operator),
or rejecting to the error thrown within this flow.

@example
aeroflow('test').notify(console).run();
// next test
// done true
(async function() {
  var result = await aeroflow('test').notify(console).run();
  console.log(result);
})();
// test
aeroflow(Promise.reject('test')).run();
// Uncaught (in promise) Error: test(…)
*/
function run(next, done) {
  if (!isFunction(next)) done = next = noop;
  else if (!isFunction(done)) done = noop;
  if (!(CONTEXT in this)) objectDefineProperty(this, CONTEXT, { value: {} });
  return new Promise((resolve, reject) => {
    let index = 0, last;
    this[EMITTER](
      result => {
        last = result;
        return next(result, index++) !== false;
      },
      result => {
        done(result);
        isError(result)
          ? reject(result)
          : resolve(last);
      },
      this.context);
  });
}

function share() {
  return this.chain(shareOperator());
}

/**
Skips some of the values emitted by this flow,
returns flow emitting remaining values.

@alias Flow#skip

@param {number|function|any} [condition] 
The number or predicate function used to determine how many values to skip.
  If omitted, returned flow skips all values emitting done event only.
  If zero, returned flow skips nothing.
  If positive number, returned flow skips this number of first emitted values.
  If negative number, returned flow skips this number of last emitted values.
  If function, returned flow skips emitted values while this function returns trythy value.

@return {Flow}
New flow emitting remaining values.

@example
aeroflow(1, 2, 3).skip().notify(console).run();
// done true
aeroflow(1, 2, 3).skip(1).notify(console).run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).skip(-1).notify(console).run();
// next 1
// next 2
// done true
aeroflow(1, 2, 3).skip(value => value < 3).notify(console).run();
// next 3
// done true
  */
function skip(condition) {
  return this.chain(skipOperator(condition));
}

/**
@alias Flow#slice

@param {number} [begin]
@param {number} [end]

@return {Flow}

@example
aeroflow(1, 2, 3).slice().notify(console).run();
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1).notify(console).run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1, 2).notify(console).run();
// next 2
// done false
aeroflow(1, 2, 3).slice(-2).notify(console).run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(-3, -1).notify(console).run();
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

@alias Flow#some

@param {function|regexp|any} [predicate]
The predicate function or regular expression object used to test each emitted value.
Or scalar value to compare emitted values with.
If omitted, truthy predicate is used.

@return {Flow}
New flow that emits true or false.

@example
aeroflow().some().notify(console).run();
// next false
// done true
aeroflow(1, 2, 3).some(2).notify(console).run();
// next true
// done false
aeroflow(1, 2, 3).some(value => value % 2).notify(console).run();
// next true
// done false
aeroflow(1, 2, 3).some(value => { throw new Error }).notify(console).run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
*/
function some(condition) {
  return this.chain(someOperator(condition));
}

/**
@alias Flow#sort

@param {function|boolean|'desc'[]} [parameters]

@return {Flow}

@return {Flow}

@example
aeroflow(3, 1, 2).sort().notify(console).run();
// next 1
// next 2
// next 3
// done true
aeroflow(2, 1, 3).sort('desc').notify(console).run();
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
).sort(value => value.country, value => value.city, 'desc').notify(console).run();
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
@alias Flow#sum

@param {boolean} [required=false]

@return {Flow}

@example
aeroflow().sum().notify(console).run();
// done true
aeroflow('test').sum().notify(console).run();
// next NaN
// done true
aeroflow(1, 2, 3).sum().notify(console).run();
// next 6
// done true
*/
function sum() {
  return this.chain(sumOperator());
}

/**
@alias Flow#take

@param {function|number} [condition]

@return {Flow}

@example
aeroflow(1, 2, 3).take().notify(console).run();
// done false
aeroflow(1, 2, 3).take(1).notify(console).run();
// next 1
// done false
aeroflow(1, 2, 3).take(-1).notify(console).run();
// next 3
// done true
*/
function take(condition) {
  return this.chain(takeOperator(condition));
}

/**
Collects all values emitted by this flow to array, returns flow emitting this array.

@alias Flow#toArray

@return {Flow}
New flow emitting array containing all results emitted by this flow.

@example
aeroflow().toArray().notify(console).run();
// next []
// done true
aeroflow('test').toArray().notify(console).run();
// next ["test"]
// done true
aeroflow(1, 2, 3).toArray().notify(console).run();
// next [1, 2, 3]
// done true
*/
function toArray() {
  return this.chain(toArrayOperator());
}

/**
Collects all values emitted by this flow to ES6 map, returns flow emitting this map.

@alias Flow#toMap

@param {function|any} [keySelector]
The mapping function used to transform each emitted value to map key.
Or scalar value to use as map key.
@param {function|any} [valueSelector]
The mapping function used to transform each emitted value to map value,
Or scalar value to use as map value.

@return {Flow}
New flow emitting map containing all results emitted by this flow.

@example
aeroflow().toMap().notify(console).run();
// next Map {}
// done true
aeroflow('test').toMap().notify(console).run();
// next Map {"test" => "test"}
done true
aeroflow(1, 2, 3).toMap(v => 'key' + v, true).notify(console).run();
// next Map {"key1" => true, "key2" => true, "key3" => true}
// done true
aeroflow(1, 2, 3).toMap(v => 'key' + v, v => 10 * v).notify(console).run();
// next Map {"key1" => 10, "key2" => 20, "key3" => 30}
// done true
*/
function toMap(keySelector, valueSelector) {
   return this.chain(toMapOperator(keySelector, valueSelector));
}

/**
Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

@alias Flow#toSet

@return {Flow}
New flow emitting set containing all results emitted by this flow.

@example
aeroflow().toSet().notify(console).run();
// next Set {}
// done true
aeroflow(1, 2, 3).toSet().notify(console).run();
// next Set {1, 2, 3}
// done true
*/
function toSet() {
  return this.chain(toSetOperator()); 
}

/**
Returns new flow joining all values emitted by this flow into a string
and emitting this string.

@alias Flow#toString

@param {string|function|boolean} [separator]
Optional. Specifies a string to separate each value emitted by this flow.
The separator is converted to a string if necessary.
If omitted, the array elements are separated with a comma.
If separator is an empty string, all values are joined without any characters in between them.
If separator is a boolean value, it is used instead a second parameter of this method.

@return {Flow}
New flow emitting string representation of this flow.

@example
aeroflow().toString().notify(console).run();
// next
// done true
aeroflow('test').toString().notify(console).run();
// next test
// done true
aeroflow(1, 2, 3).toString().notify(console).run();
// next 1,2,3
// done true
aeroflow(1, 2, 3).toString(';').notify(console).run();
// next 1;2;3
// done true
aeroflow(1, 2, 3).toString((value, index) => '-'.repeat(index + 1)).notify(console).run();
// next 1--2---3
// done true
*/
/*eslint no-shadow: 0*/
function toString(separator) {
  return this.chain(toStringOperator(separator));
}
