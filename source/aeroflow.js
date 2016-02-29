import { AEROFLOW, CLASS, PROTOTYPE } from './symbols';

import { isDefined, isError, isFunction, noop, objectDefineProperties, objectCreate } from './utilites';

import { adapters } from './adapters/index';
import { valueAdapter } from './adapters/value';

import { notifiers } from './notifiers/index';

import { customGenerator } from './generators/custom';
import { emptyGenerator } from './generators/empty';
import { expandGenerator } from './generators/expand';
import { randomGenerator } from './generators/random';
import { rangeGenerator } from './generators/range';
import { repeatGenerator } from './generators/repeat';

import { averageOperator } from './operators/average';
import { catchOperator } from './operators/catch';
import { coalesceOperator } from './operators/coalesce';
import { countOperator } from './operators/count';
import { delayOperator } from './operators/delay';
import { distinctOperator } from './operators/distinct';
import { dumpOperator } from './operators/dump';
import { everyOperator } from './operators/every';
import { filterOperator } from './operators/filter';
import { flattenOperator } from './operators/flatten';
import { groupOperator } from './operators/group';
// import { joinOperator } from './operators/join';
import { mapOperator } from './operators/map';
import { maxOperator } from './operators/max';
import { meanOperator } from './operators/mean';
import { minOperator } from './operators/min';
import { notifyOperator } from './operators/notify';
import { reduceOperator } from './operators/reduce';
import { replayOperator } from './operators/replay';
import { retryOperator } from './operators/retry';
import { reverseOperator } from './operators/reverse';
import { skipOperator } from './operators/skip';
import { sliceOperator } from './operators/slice';
import { someOperator } from './operators/some';
import { sortOperator } from './operators/sort';
import { sumOperator } from './operators/sum';
import { takeOperator } from './operators/take';
import { toArrayOperator } from './operators/toArray';
import { toMapOperator } from './operators/toMap';
import { toSetOperator } from './operators/toSet';
import { toStringOperator } from './operators/toString';

/**
Creates new flow emitting values extracted from every provided data source in series.
If no data sources provided, creates empty flow emitting "done" event only.

@param {any} [sources]
Data sources to extract values from.

@return {Flow}

@property {Adapters} adapters
Mixed array/map of adapters for various types of data sources.
As a map matches the type of a data source to adapter function (e.g. Promise -> promiseAdapter).
As an array contains functions performing arbitrary (more complex than type matching) testing
of a data source (e.g. some iterable -> iterableAdapter).
When aeroflow adapts particular data source, direct type mapping is attempted first.
Then, if mapping attempt did not return an adapter function,
array is enumerated in reverse order, from last indexed adapter to first,
until a function is returned.
This returned function is used as adapter and called with single argument: the data source being adapted.
Expected that adapter function being called with data source returns an emitter function accepting 2 arguments:
next callback, done callback and execution context.
If no adapter function has been found, the data source is treated as scalar value and emitted as is.
See examples to find out how to create and register custom adapters.

@property {object} operators
Map of operators available for use with every flow.
See examples to find out how to create and register custom operators.

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
aeroflow(new Error('test')).dump().run();
// done Error: test(…)
// Uncaught (in promise) Error: test(…)
aeroflow(() => { throw new Error }).dump().run();
// done Error: test(…)
// Uncaught (in promise) Error: test(…)
aeroflow("test").dump().run();
// next test
// done true
aeroflow.adapters.use('String', aeroflow.adapters['Array']);
aeroflow("test").dump().run();
// next t
// next e
// next s
// next t
// done true
aeroflow.operators.test = function() {
  return this.chain(emitter => (next, done, context) => emitter(
    value => next('test:' + value),
    done,
    context));
}
aeroflow(42).test().dump().run();
// next test:42
// done true
*/
function aeroflow(...sources) {
  return new Flow((next, done, context) => {
    let index = -1;
    !function proceed(result) {
      if (result !== true || ++index >= context.sources.length) done(result);
      else try {
        const source = context.sources[index];
        let adapter = adapters.get(source);
        if (!adapter) adapter = valueAdapter(source);
        adapter(next, proceed, context);
      }
      catch (error) {
        done(error);
      }
    }(true);
  }, sources);
}

/**
Creates programmatically controlled flow.

@memberof aeroflow
@static

@param {function|any} emitter
The emitter function taking three arguments:
next - the function emitting 'next' event,
done - the function emitting 'done' event,
context - the execution context.

@return {Flow}
The new flow emitting values generated by emitter function.

@example
aeroflow.create((next, done, context) => {
  next('test');
  done();
}).dump().run();
// next test
// done true
aeroflow.create((next, done, context) => {
  window.addEventListener('click', next);
  return () => window.removeEventListener('click', next);
}).take(2).dump().run();
// next MouseEvent {...}
// next MouseEvent {...}
// done false
*/
function create(emitter) {
  return new Flow(customGenerator(emitter));
}

/**
@alias aeroflow.expand

@param {function} expander
@param {any} [seed]

@return {Flow}

@example
aeroflow.expand(value => value * 2, 1).take(3).dump().run();
// next 2
// next 4
// next 8
// done false
*/
function expand(expander, seed) {
  return new Flow(expandGenerator(expander, seed));
}

/**
Creates new flow emitting the provided value only.

@alias aeroflow.just
@alias aeroflow.return

@param {any} value
The value to emit.

@return {Flow}
The new flow emitting provided value.

@example
aeroflow.just([1, 2, 3]).dump().run();
// next [1, 2, 3]
// done
*/
// TODO: multiple arguments
function just(value) {
  return new Flow(valueAdapter(value));
}

/**
Creates new flow emitting infinite sequence of random numbers.

@alias aeroflow.random

@param {number} [minimum]
@param {number} [maximum]

@return {Flow}
The new flow emitting random numbers.

@example
aeroflow.random().take(2).dump().run();
// next 0.07417976693250232
// next 0.5904422281309957
// done false
aeroflow.random(1, 9).take(2).dump().run();
// next 7
// next 2
// done false
aeroflow.random(1.1, 8.9).take(2).dump().run();
// next 4.398837305698544
// next 2.287970747705549
// done false
*/
function random(minimum, maximum) {
  return new Flow(randomGenerator(minimum, maximum));
}

/**
@alias aeroflow.range

@param {number} [start]
@param {number} [end]
@param {number} [step]

@return {Flow}

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
  return new Flow(rangeGenerator(start, end, step));
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

@return {Flow}
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
  return new Flow(repeatGenerator(value, interval));
}

/**
@class

@property {function} emitter
@property {array} sources
*/
function Flow(emitter, sources) {
  objectDefineProperties(this, {
    emitter: { value: emitter },
    sources: { value: sources }
  });
}

/**
@alias Flow#average

@return {Flow}

@example
aeroflow().average().dump().run();
// done true
aeroflow('test').average().dump().run();
// next NaN
// done true
aeroflow(1, 2, 6).average().dump().run();
// next 3
// done true
*/
function average() {
  return this.chain(averageOperator());
}

/**
@alias Flow#bind

@param {any} [sources]

@return {Flow}

@example
aeroflow().dump().bind().run();
// done true
aeroflow().dump().bind(1, 2).run();
// next 1
// next 2
// done true
aeroflow(1, 2).dump().bind(4, 5).run();
// next 4
// next 5
// done true
*/
function bind(...sources) {
  return new Flow(this.emitter, sources);
}

/**
@alias Flow#catch
Returns new flow suppressing error, emitted by this flow, or replacing it with alternative data source.

@param {function|any} [alternative]
Optional alternative data source to replace error, emitted by this flow.
If not passed, the emitted error is supressed.
If a function passed, it is called with two arguments:
the error, emitted by this flow,
and context data (see {@link Flow#run} method for additional information about context data).
The result, returned by this function, as well as any other value passed as alternative,
is adapted with suitable adapter from {@link aeroflow.adapters} registry and emitted to this flow.

@return {Flow}

@example
aeroflow(new Error('test')).catch().dump().run();
// done false
aeroflow(new Error('test')).dump('before ').catch('success').dump('after ').run();
// before done Error: test(…)
// after next success
// after done false
aeroflow(new Error('test')).catch([1, 2]).dump().run();
// next 1
// next 2
// done false
aeroflow(new Error('test')).catch(() => [1, 2]).dump().run();
// next 1
// next 2
// done false
aeroflow(new Error('test')).catch(() => [[1], [2]]).dump().run();
// next [1]
// next [2]
// done false
*/
function catch_(alternative) {
  return this.chain(catchOperator(alternative));
}

/**
@alias Flow#chain

@param {function} [operator]

@return {Flow}
*/
function chain(operator) {
  return new Flow(operator(this.emitter), this.sources);
}

/**
Returns new flow emitting values from alternate data source when this flow is empty.

@alias Flow#coalesce

@param {any} [alternative]
Optional alternative data source to use when this flow is empty.
If not passed, this method does nothing.
If a function passed, it is called with one argument:
the context data (see {@link Flow#run} method for additional information about context data).
The result, returned by this function, as well as any other value passed as alternative,
is adapted with suitable adapter from {@link aeroflow.adapters} registry and emitted to this flow.

@return {Flow}

@example
aeroflow.empty.coalesce().dump().run();
// done true
aeroflow.empty.coalesce([1, 2]).dump().run();
// next 1
// next 2
// done true
aeroflow.empty.coalesce(() => [1, 2]).dump().run();
// next 1
// next 2
// done true
aeroflow.empty.coalesce(() => [[1], [2]]).dump().run();
// next [1]
// next [2]
// done true
*/
function coalesce(alternative) {
  return this.chain(coalesceOperator(alternative));
}

/**
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
).dump().run();
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
  return new Flow(this.emitter, this.sources.concat(sources));
}

/**
Counts the number of values emitted by this flow, returns new flow emitting only this value.

@alias Flow#count

@return {Flow}

@example
aeroflow().count().dump().run();
// next 0
// done
aeroflow('a', 'b', 'c').count().dump().run();
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

@alias Flow#dump

@param {string} [prefix='']
A string prefix to prepend to each event name.

@param {function} [logger=console.log]
Function to execute for each event emitted, taking two arguments:
name - The name of event emitted by this flow prepended with prefix.
value - The value of event emitted by this flow.

@return {Flow}

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
// Uncaught (in promise) Error: test(…)
*/
function dump(prefix, logger) {
  return this.chain(dumpOperator(prefix, logger));
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
@alias Flow#group

@param {function|any[]} [selectors]

@return {Flow}

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

/*
@alias Flow#join

@param {any} right
@param {function} comparer

@return {Flow}

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

function join(right, comparer) {
  return this.chain(joinOperator(right, comparer));
}
*/

/**
@alias Flow#map

@param {function|any} [mapper]

@return {Flow}

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
function map(mapper) {
  return this.chain(mapOperator(mapper));
}

/**
Determines the maximum value emitted by this flow.

@alias Flow#max

@return {Flow}
New flow emitting the maximum value only.

@example
aeroflow().max().dump().run();
// done true
aeroflow(1, 3, 2).max().dump().run();
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

@alias Flow#mean

@return {Flow}
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

@alias Flow#min

@return {Flow}
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

function notify(target, ...parameters) {
  return this.chain(notifyOperator(target, parameters));
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
aeroflow().reduce().dump().run();
// done false
aeroflow(1, 2).reduce().dump().run();
// done false
aeroflow().reduce('test').dump().run();
// next test
// done true
aeroflow().reduce((product, value) => product * value).dump().run();
// next undefined
// done true
aeroflow().reduce((product, value) => product * value, 1, true).dump().run();
// next 1
// done true
aeroflow(2, 4, 8).reduce((product, value) => product * value).dump().run();
// next 64
// done
aeroflow(2, 4, 8).reduce((product, value) => product * value, 2).dump().run();
// next 128
// done
aeroflow(['a', 'b', 'c'])
  .reduce((product, value, index) => product + value + index, '')
  .dump().run();
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
aeroflow(1, 2).replay(1000).take(4).dump().run();
// next 1
// next 2
// next 1 // after 1000ms
// next 2
// done false
aeroflow(1, 2).delay(500).replay(1000).take(4).dump().run();
// next 1
// next 2 // after 500ms
// next 1 // after 1000ms
// next 2
// done false
aeroflow(1, 2).delay(500).replay(1000, true).take(4).dump().run();
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
Runs this flow.

@alias Flow#run

@param {function|any} [next]
Optional callback called for each data value emitted by this flow with 3 arguments:
1) the emitted value,
2) zero-based index of emitted value,
3) context data.
When passed something other than a function, it considered as data.
@param {function|any} [done]
Optional callback called after this flow has finished emission of data with 2 arguments:
1) the error thrown within this flow
or boolean value indicating lazy (false) or eager (true) enumeration of data sources,
2) context data.
When passed something other than a function, it considered as data.
@param {any} [data]
Arbitrary value passed as context data to each callback invoked by this flow as the last argument.

@return {Promise}
New promise,
resolving to the latest value emitted by this flow (for compatibility with ES7 await operator),
or rejecting to the error thrown within this flow.

@example
aeroflow('test').dump().run();
// next test
// done true
(async function() {
  var result = await aeroflow('test').dump().run();
  console.log(result);
})();
// test
aeroflow('test').run(
  (result, data) => console.log('next', result, data),
  (result, data) => console.log('done', result, data),
  'data');
// next test data
// done true data
aeroflow(data => console.log('source:', data))
  .map((result, index, data) => console.log('map:', data))
  .filter((result, index, data) => console.log('filter:', data))
  .run('data');
// source: data
// map: data
// filter: data
// done true
aeroflow(Promise.reject('test')).run();
// Uncaught (in promise) Error: test(…)
*/
function run(next, done, data) {
  if (!isFunction(next)) {
    data = next;
    done = next = noop;
  }
  else if (!isFunction(done)) {
    data = done;
    done = noop;
  }
  return new Promise((resolve, reject) => {
    let last;
    this.emitter(
      result => {
        last = result;
        return next(result, data) !== false;
      },
      result => {
        done(result, data);
        isError(result)
          ? reject(result)
          : resolve(last);
      },
      objectDefineProperties({}, {
        data: { value: data },
        sources: { value: this.sources }
      }));
  });
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
@alias Flow#slice

@param {number} [begin]
@param {number} [end]

@return {Flow}

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

@alias Flow#some

@param {function|regexp|any} [predicate]
The predicate function or regular expression object used to test each emitted value.
Or scalar value to compare emitted values with.
If omitted, truthy predicate is used.

@return {Flow}
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
@alias Flow#sum

@param {boolean} [required=false]

@return {Flow}

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
@alias Flow#take

@param {function|number} [condition]

@return {Flow}

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
Collects all values emitted by this flow to array, returns flow emitting this array.

@alias Flow#toArray

@return {Flow}
New flow emitting array containing all results emitted by this flow.

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
function toMap(keySelector, valueSelector) {
   return this.chain(toMapOperator(keySelector, valueSelector));
}

/**
Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

@alias Flow#toSet

@return {Flow}
New flow emitting set containing all results emitted by this flow.

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
/*eslint no-shadow: 0*/
function toString(separator) {
  return this.chain(toStringOperator(separator));
}

const operators = objectCreate(Object[PROTOTYPE], {
  average: { value: average, writable: true },
  catch: { value: catch_, writable: true },
  coalesce: { value: coalesce, writable: true },
  count: { value: count, writable: true },
  delay: { value: delay, writable: true },
  distinct: { value: distinct, writable: true },
  dump: { value: dump, writable: true },
  every: { value: every, writable: true },
  filter: { value: filter, writable: true },
  flatten: { value: flatten, writable: true },
  group: { value: group, writable: true },
  // join: { value: join, writable: true },
  map: { value: map, writable: true },
  max: { value: max, writable: true },
  mean: { value: mean, writable: true },
  min: { value: min, writable: true },
  reduce: { value: reduce, writable: true },
  replay: { value: replay, writable: true },
  retry: { value: retry, writable: true },
  reverse: { value: reverse, writable: true },
  skip: { value: skip, writable: true },
  slice: { value: slice, writable: true },
  some: { value: some, writable: true },
  sort: { value: sort, writable: true },
  sum: { value: sum, writable: true },
  take: { value: take, writable: true },
  toArray: { value: toArray, writable: true },
  toMap: { value: toMap, writable: true },
  toSet: { value: toSet, writable: true },
  toString: { value: toString, writable: true }
});

Flow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  bind: { value: bind },
  chain: { value: chain },
  concat: { value: concat },
  notify: { value: notify },
  run: { value: run }
});

objectDefineProperties(aeroflow, {
  adapters: { value: adapters },
  create: { value: create },
  empty: { enumerable: true, value: new Flow(emptyGenerator(true)) },
  expand: { value: expand },
  just: { value: just },
  notifiers: { value: notifiers },
  operators: { value: operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat },
  return: { value: just }
});

export default aeroflow;
