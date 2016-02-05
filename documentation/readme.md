
## Classes

<dl>
<dt><a href="#Aeroflow">Aeroflow</a></dt>
<dd><p>Aeroflow class.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#aeroflow">aeroflow(sources)</a> ⇒ <code><a href="#Aeroflow">Aeroflow</a></code></dt>
<dd><p>Creates new flow emitting values from all provided data sources.</p>
</dd>
</dl>

<a name="Aeroflow"></a>
## Aeroflow
Aeroflow class.

**Kind**: global class  
**Properties**

- emitter <code>function</code>  
- sources <code>array</code>  


* [Aeroflow](#Aeroflow)
    * [.append([...sources])](#Aeroflow+append) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.average()](#Aeroflow+average) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.bind([...sources])](#Aeroflow+bind) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.catch([alternative])](#Aeroflow+catch) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.chain([operator])](#Aeroflow+chain) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.count([optional])](#Aeroflow+count) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.delay([interval])](#Aeroflow+delay) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.distinct(untilChanged)](#Aeroflow+distinct) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.dump([prefix], [logger])](#Aeroflow+dump) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.every([predicate])](#Aeroflow+every) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.filter([predicate])](#Aeroflow+filter) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.flatten([depth])](#Aeroflow+flatten) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.join(right, comparer)](#Aeroflow+join) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.map([mapping])](#Aeroflow+map) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.max()](#Aeroflow+max) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.mean()](#Aeroflow+mean) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.min()](#Aeroflow+min) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.prepend([...sources])](#Aeroflow+prepend) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.reduce(reducer, seed, optional)](#Aeroflow+reduce) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.reverse(attempts)](#Aeroflow+reverse) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.reverse()](#Aeroflow+reverse) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.run([next], [done], [data])](#Aeroflow+run) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.skip([condition])](#Aeroflow+skip) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.slice([begin], [end])](#Aeroflow+slice) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.some([predicate])](#Aeroflow+some) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.sort([...parameters])](#Aeroflow+sort) ⇒ <code>[Aeroflow](#Aeroflow)</code> &#124; <code>[Aeroflow](#Aeroflow)</code>
    * [.tap([callback])](#Aeroflow+tap) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.toArray()](#Aeroflow+toArray) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.toMap([keyTransformation], [valueTransformation])](#Aeroflow+toMap) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.toSet()](#Aeroflow+toSet) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.toString([separator], [optional])](#Aeroflow+toString)

<a name="Aeroflow+append"></a>
### aeroflow.append([...sources]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Returns new flow emitting values from this flow first 
and then from all provided sources without interleaving them.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow emitting all values emitted by this flow first
and then all provided values.  
**Params**
- [...sources] <code>any</code> - Data sources to append to this flow.

**Example**  
```js
aeroflow(1).append(2, [3, 4], new Promise(resolve => setTimeout(() => resolve(5), 500))).dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5 // after 500ms
// done
```
<a name="Aeroflow+average"></a>
### aeroflow.average() ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**

**Example**  
```js
aeroflow(1, 2, 3).average().dump().run();
// next 2
// done true
aeroflow().average().dump().run();
// done true
```
<a name="Aeroflow+bind"></a>
### aeroflow.bind([...sources]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [...sources] <code>any</code>

**Example**  
```js
aeroflow().dump().bind(1, 2, 3).run();
// next 1
// next 2
// next 3
// done true
aeroflow([1, 2, 3]).dump().bind([4, 5, 6]).run();
// next 4
// next 5
// next 6
// done true
```
<a name="Aeroflow+catch"></a>
### aeroflow.catch([alternative]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [alternative] <code>any</code>

**Example**  
```js
aeroflow.error('error').catch().dump().run();
// done false
aeroflow.error('error').dump('before ').catch('success').dump('after ').run();
// before done Error: error(…)
// after next success
// after done true
```
<a name="Aeroflow+chain"></a>
### aeroflow.chain([operator]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [operator] <code>function</code>

<a name="Aeroflow+count"></a>
### aeroflow.count([optional]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Counts the number of values emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [optional] <code>boolean</code>

**Example**  
```js
aeroflow().count().dump().run();
// next 0
// done
aeroflow(['a', 'b', 'c']).count().dump().run();
// next 3
// done
```
<a name="Aeroflow+delay"></a>
### aeroflow.delay([interval]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Returns new flow delaying emission of each value accordingly provided condition.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Example:**: aeroflow(1, 2).delay(500).dump().run();
// next 1 // after 500ms
// next 2 // after 500ms
// done true // after 500ms
aeroflow(1, 2).delay(new Date(Date.now() + 500)).dump().run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(1, 2).delay((value, index) => 500 + 500 * index).dump().run();
// next 1 // after 500ms
// next 2 // after 1500ms
// done true
aeroflow(1, 2).delay(value => { throw new Error }).dump().run();
// done Error(…)
// Uncaught Error  
**Params**
- [interval] <code>number</code> | <code>date</code> | <code>function</code> - The condition used to determine delay for each subsequent emission.
Number is threated as milliseconds interval (negative number is considered as 0).
Date is threated as is (date in past is considered as now).
Function is execute for each emitted value, with three arguments:
  value - The current value emitted by this flow
  index - The index of the current value
  context - The context object
The result of condition function will be converted nu number and used as milliseconds interval.

<a name="Aeroflow+distinct"></a>
### aeroflow.distinct(untilChanged) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- untilChanged <code>boolean</code>

**Example**  
```js
aeroflow(1, 1, 2, 2, 1, 1).distinct().dump().run();
// next 1
// next 2
// done true
aeroflow(1, 1, 2, 2, 1, 1).distinct(true).dump().run();
// next 1
// next 2
// next 1
// done true
```
<a name="Aeroflow+dump"></a>
### aeroflow.dump([prefix], [logger]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Dumps all events (next, done) emitted by this flow to the logger with optional prefix.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [prefix] <code>string</code> <code> = &quot;&#x27;&#x27;&quot;</code> - A string prefix to prepend to each event name.
- [logger] <code>function</code> <code> = console.log</code> - Function to execute for each event emitted, taking two arguments:
name - The name of event emitted by this flow prepended with prefix.
value - The value of event emitted by this flow.

**Example**  
```js
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
```
<a name="Aeroflow+every"></a>
### aeroflow.every([predicate]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Tests whether all values emitted by this flow pass the provided test.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow emitting true if all emitted values pass the test; otherwise, false.  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

**Example**  
```js
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
```
<a name="Aeroflow+filter"></a>
### aeroflow.filter([predicate]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Filters values emitted by this flow with the provided test.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow emitting only values passing the provided test.  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

**Example**  
```js
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
```
<a name="Aeroflow+flatten"></a>
### aeroflow.flatten([depth]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [depth] <code>number</code>

**Example**  
```js
aeroflow([[1, 2]]).flatten().dump().run();
// next 1
// next 2
// done true
aeroflow(() => [[1], [2]]).flatten(1).dump().run();
// next [1]
// next [2]
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500))).flatten().dump().run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500))).flatten(1).dump().run();
// next [1, 2]
// done true
```
<a name="Aeroflow+join"></a>
### aeroflow.join(right, comparer) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- right <code>any</code>
- comparer <code>function</code>

**Example**  
```js
aeroflow(['a','b']).join([1, 2]).dump().run();
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
```
<a name="Aeroflow+map"></a>
### aeroflow.map([mapping]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [mapping] <code>function</code> | <code>any</code>

**Example**  
```js
aeroflow(1, 2).map('test').dump().run();
// next test
// next test
// done true
aeroflow(1, 2).map(value => value * 10).dump().run();
// next 10
// next 20
// done true
```
<a name="Aeroflow+max"></a>
### aeroflow.max() ⇒ <code>[Aeroflow](#Aeroflow)</code>
Determines the maximum value emitted by this flow.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow emitting the maximum value only.  
**Params**

**Example**  
```js
aeroflow(1, 3, 2).max().dump().run();
// next 3
// done
```
<a name="Aeroflow+mean"></a>
### aeroflow.mean() ⇒ <code>[Aeroflow](#Aeroflow)</code>
Determines the mean value emitted by this flow.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow emitting the mean value only.  
**Params**

**Example**  
```js
aeroflow(1, 1, 2, 3, 5, 7, 9).mean().dump().run();
// next 3
// done
```
<a name="Aeroflow+min"></a>
### aeroflow.min() ⇒ <code>[Aeroflow](#Aeroflow)</code>
Determines the minimum value emitted by this flow.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow emitting the minimum value only.  
**Params**

**Example**  
```js
aeroflow(2, 1, 3).min().dump().run();
// next 1
// done
```
<a name="Aeroflow+prepend"></a>
### aeroflow.prepend([...sources]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [...sources] <code>Array.&lt;any&gt;</code> - Values to prepend to this flow.

**Example**  
```js
aeroflow(1).prepend(2, [3, 4], new Promise(resolve => setTimeout(() => resolve(5), 500))).dump().run();
// next 2
// next 3
// next 4
// next 5 // after 500ms
// next 1
// done
```
<a name="Aeroflow+reduce"></a>
### aeroflow.reduce(reducer, seed, optional) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,
returns new flow emitting reduced value.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- reducer <code>function</code> | <code>any</code> - Function to execute on each emitted value, taking four arguments:
  result - the value previously returned in the last invocation of the reducer, or seed, if supplied;
  value - the current value emitted by this flow;
  index - the index of the current value emitted by the flow;
  context.data.
  If is not a function, the returned flow will emit just reducer value.
- seed <code>any</code> - Value to use as the first argument to the first call of the reducer.
- optional <code>boolean</code>

**Example**  
```js
aeroflow([2, 4, 8]).reduce((product, value) => product value, 1).dump().run();
// next 64
// done
aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
// next a0b1c2
// done
```
<a name="Aeroflow+reverse"></a>
### aeroflow.reverse(attempts) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- attempts <code>number</code>

**Example**  
```js
var attempt = 0; aeroflow(() => {
  if (attempt++ % 2) return 'success';
  else throw new Error('error');
}).dump('before ').retry().dump('after ').run();
// before done Error: error(…)
// before next success
// after next success
// before done true
// after done true
```
<a name="Aeroflow+reverse"></a>
### aeroflow.reverse() ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**

**Example**  
```js
aeroflow(1, 2, 3).reverse().dump().run()
// next 3
// next 2
// next 1
// done
aeroflow.range(1, 3).reverse().dump().run()
// next 3
// next 2
// next 1
// done
```
<a name="Aeroflow+run"></a>
### aeroflow.run([next], [done], [data]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Runs this flow asynchronously, initiating source to emit values,
applying declared operators to emitted values and invoking provided callbacks.
If no callbacks provided, runs this flow for its side-effects only.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [next] <code>function</code> - Callback to execute for each emitted value, taking two arguments: value, context.
Or EventEmitter object.
Or EventTarget object.
Or Observer object.
- [done] <code>function</code> - Callback to execute as emission is complete, taking two arguments: error, context.
- [data] <code>function</code> - Arbitrary value passed to each callback invoked by this flow as context.data.

**Example**  
```js
aeroflow(1, 2, 3).run(value => console.log('next', value), error => console.log('done', error));
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).dump().run(() => false);
// next 1
// done false
aeroflow(Promise.reject('test')).dump().run();
// done Error: test(…)
// Unhandled promise rejection Error: test(…)
aeroflow(Promise.reject('test')).dump().run(() => {}, () => {});
// done Error: test(…)
```
<a name="Aeroflow+skip"></a>
### aeroflow.skip([condition]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Skips some of the values emitted by this flow,
returns flow emitting remaining values.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow emitting remaining values.  
**Params**
- [condition] <code>number</code> | <code>function</code> | <code>any</code> - The number or predicate function used to determine how many values to skip.
  If omitted, returned flow skips all values emitting done event only.
  If zero, returned flow skips nothing.
  If positive number, returned flow skips this number of first emitted values.
  If negative number, returned flow skips this number of last emitted values.
  If function, returned flow skips emitted values while this function returns trythy value.

**Example**  
```js
aeroflow([1, 2, 3]).skip().dump().run();
// done
aeroflow([1, 2, 3]).skip(1).dump().run();
// next 2
// next 3
// done
aeroflow([1, 2, 3]).skip(-1).dump().run();
// next 1
// next 2
// done
aeroflow([1, 2, 3]).skip(value => value < 3).dump().run();
// next 3
// done
```
<a name="Aeroflow+slice"></a>
### aeroflow.slice([begin], [end]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [begin] <code>number</code>
- [end] <code>number</code>

**Example**  
```js
aeroflow(1, 2, 3).slice(1).dump().run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1, 1).dump().run();
// next 2
// done false
aeroflow(1, 2, 3).slice(-3, -1).dump().run();
// next 1
// next 2
// done true
```
<a name="Aeroflow+some"></a>
### aeroflow.some([predicate]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Tests whether some value emitted by this flow passes the predicate test,
returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow that emits true or false.  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression object used to test each emitted value.
Or scalar value to compare emitted values with.
If omitted, truthy predicate is used.

**Example**  
```js
aeroflow(0).some().dump().run();
// next false
// done
aeroflow.range(1, 3).some(2).dump().run();
// next true
// done
aeroflow.range(1, 3).some(value => value % 2).dump().run();
// next true
// done
aeroflow(1, 2).some(value => { throw new Error }).dump().run();
// done Error(…)
// Uncaught Error
```
<a name="Aeroflow+sort"></a>
### aeroflow.sort([...parameters]) ⇒ <code>[Aeroflow](#Aeroflow)</code> &#124; <code>[Aeroflow](#Aeroflow)</code>
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [...parameters] <code>function</code> | <code>boolean</code> | <code>Array.&lt;&#x27;desc&#x27;&gt;</code>

**Example**  
```js
aeroflow(3, 2, 1).sort().dump().run();
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).sort('desc').dump().run();
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
```
<a name="Aeroflow+tap"></a>
### aeroflow.tap([callback]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Executes provided callback once per each value emitted by this flow,
returns new tapped flow or this flow if no callback provided.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [callback] <code>function</code> - Function to execute for each value emitted, taking three arguments:
  value emitted by this flow,
  index of the value,
  context object.

**Example**  
```js
aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();
// value: 1 index: 0
// value: 2 index: 1
// value: 3 index: 2
```
<a name="Aeroflow+toArray"></a>
### aeroflow.toArray() ⇒ <code>[Aeroflow](#Aeroflow)</code>
Collects all values emitted by this flow to array, returns flow emitting this array.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow that emits an array.  
**Params**

**Example**  
```js
aeroflow(1, 2, 3).toArray().dump().run();
// next [1, 2, 3]
// done
```
<a name="Aeroflow+toMap"></a>
### aeroflow.toMap([keyTransformation], [valueTransformation]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Collects all values emitted by this flow to ES6 map, returns flow emitting this map.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow that emits a map.  
**Params**
- [keyTransformation] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map key.
Or scalar value to use as map key.
- [valueTransformation] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map value,
Or scalar value to use as map value.

**Example**  
```js
aeroflow(1, 2, 3).toMap(v => 'key' + v, true).dump().run();
// next Map {"key1" => true, "key2" => true, "key3" => true}
// done
aeroflow(1, 2, 3).toMap(v => 'key' + v, v => v 10).dump().run();
// next Map {"key1" => 10, "key2" => 20, "key3" => 30}
// done
```
<a name="Aeroflow+toSet"></a>
### aeroflow.toSet() ⇒ <code>[Aeroflow](#Aeroflow)</code>
Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow that emits a set.  
**Params**

**Example**  
```js
aeroflow(1, 2, 3).toSet().dump().run();
// next Set {1, 2, 3}
// done true
```
<a name="Aeroflow+toString"></a>
### aeroflow.toString([separator], [optional])
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [separator] <code>string</code> | <code>function</code>
- [optional] <code>boolean</code>

**Example**  
```js
aeroflow(1, 2, 3).toString().dump().run();
// next 1,2,3
// done true
aeroflow(1, 2, 3).toString(';').dump().run();
// next 1;2;3
// done true
aeroflow(1, 2, 3).toString((value, index) => '-'.repeat(index + 1)).dump().run();
// next 1--2---3
// done true
```
<a name="aeroflow"></a>
## aeroflow(sources) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Creates new flow emitting values from all provided data sources.

**Kind**: global function  
**Params**
- sources <code>Array.&lt;any&gt;</code> - Data sources.

**Example**  
```js
aeroflow().dump().run();
// done true
aeroflow(1, [2, 3], () => 4, new Promise(resolve => setTimeout(() => resolve(5), 500)))).dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5 // after 500ms
// done true
aeroflow(() => { throw new Error }).dump().run();
// done Error(…)
// Uncaught Error
```

* [aeroflow(sources)](#aeroflow) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.create(emitter)](#aeroflow.create) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.error([message])](#aeroflow.error) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.expand(expander, [seed])](#aeroflow.expand) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.just(value)](#aeroflow.just) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.random([minimum], [maximum])](#aeroflow.random) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.range([start], [end], [step])](#aeroflow.range) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.repeat([value], [interval])](#aeroflow.repeat) ⇒ <code>[Aeroflow](#Aeroflow)</code>

<a name="aeroflow.create"></a>
### aeroflow.create(emitter) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Creates programmatically controlled flow.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - The new flow emitting values generated by emitter function.  
**Params**
- emitter <code>function</code> | <code>any</code> - The emitter function taking three arguments:
next - the function emitting 'next' event,
done - the function emitting 'done' event,
context - the execution context.

**Example**  
```js
aeroflow.create((next, done, context) => {
  next(1);
  next(2);
  done();
}).dump().run();
// next 1
// next 2
// done true
```
<a name="aeroflow.error"></a>
### aeroflow.error([message]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**
- [message] <code>string</code> | <code>error</code>

**Example**  
```js
aeroflow.error('test').run();
// Uncaught Error: test
```
<a name="aeroflow.expand"></a>
### aeroflow.expand(expander, [seed]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**
- expander <code>function</code>
- [seed] <code>any</code>

**Example**  
```js
aeroflow.expand(value => value * 2, 1).take(3).dump().run();
// next 2
// next 4
// next 8
// done false
```
<a name="aeroflow.just"></a>
### aeroflow.just(value) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Creates new flow emitting the provided value only.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - The new flow emitting provided value.  
**Params**
- value <code>any</code> - The value to emit.

**Example**  
```js
aeroflow.just([1, 2, 3]).dump().run();
// next [1, 2, 3]
// done
```
<a name="aeroflow.random"></a>
### aeroflow.random([minimum], [maximum]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Creates new flow emitting infinite sequence of random numbers.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - The new flow emitting random numbers.  
**Params**
- [minimum] <code>number</code>
- [maximum] <code>number</code>

**Example**  
```js
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
```
<a name="aeroflow.range"></a>
### aeroflow.range([start], [end], [step]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**
- [start] <code>number</code>
- [end] <code>number</code>
- [step] <code>number</code>

**Example**  
```js
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
```
<a name="aeroflow.repeat"></a>
### aeroflow.repeat([value], [interval]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Creates flow repeating provided value.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - The new flow emitting repeated values.  
**Params**
- [value] <code>function</code> | <code>any</code> - Arbitrary static value to repeat;
or function providing dynamic values and invoked with two arguments:
  index - index of the value being emitted,
  data - contextual data.
- [interval] <code>number</code> | <code>function</code>

**Example**  
```js
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
```
