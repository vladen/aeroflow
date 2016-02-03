
## Classes

<dl>
<dt><a href="#Aeroflow">Aeroflow</a></dt>
<dd><p>Aeroflow class.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#aeroflow">aeroflow(sources)</a></dt>
<dd><p>Creates new flow emitting values from all provided data sources.</p>
</dd>
<dt><a href="#toString">toString()</a></dt>
<dd></dd>
</dl>

<a name="Aeroflow"></a>
## Aeroflow
Aeroflow class.

**Kind**: global class  
**Access:** public  

* [Aeroflow](#Aeroflow)
    * [.append([...sources])](#Aeroflow+append) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.bind()](#Aeroflow+bind)
    * [.count()](#Aeroflow+count)
    * [.delay([interval])](#Aeroflow+delay)
    * [.dump([prefix], [logger])](#Aeroflow+dump)
    * [.every([predicate])](#Aeroflow+every) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.filter([predicate])](#Aeroflow+filter) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.max()](#Aeroflow+max) ⇒
    * [.mean()](#Aeroflow+mean) ⇒
    * [.min()](#Aeroflow+min) ⇒
    * [.prepend([...sources])](#Aeroflow+prepend)
    * [.reduce(reducer, initial)](#Aeroflow+reduce)
    * [.reverse()](#Aeroflow+reverse)
    * [.run([next], [done], [data])](#Aeroflow+run)
    * [.skip([condition])](#Aeroflow+skip) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.some([predicate])](#Aeroflow+some) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.tap([callback])](#Aeroflow+tap)
    * [.toArray()](#Aeroflow+toArray) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.toMap([keyTransformation], [valueTransformation])](#Aeroflow+toMap) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.toSet()](#Aeroflow+toSet) ⇒ <code>[Aeroflow](#Aeroflow)</code>

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
<a name="Aeroflow+bind"></a>
### aeroflow.bind()
**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**

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
<a name="Aeroflow+count"></a>
### aeroflow.count()
Counts the number of values emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**

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
### aeroflow.delay([interval])
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
**Params**
- [interval] <code>number</code> | <code>date</code> | <code>function</code> - The condition used to determine delay for each subsequent emission.
Number is threated as milliseconds interval (negative number is considered as 0).
Date is threated as is (date in past is considered as now).
Function is execute for each emitted value, with three arguments:
  value - The current value emitted by this flow
  index - The index of the current value
  context - The context object
The result of condition function will be converted nu number and used as milliseconds interval.

<a name="Aeroflow+dump"></a>
### aeroflow.dump([prefix], [logger])
Dumps all events (next, done) emitted by this flow to the logger with optional prefix.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [prefix] <code>string</code> <code> = &quot;&#x27;&#x27;&quot;</code> - A string prefix to prepend to each event name.
- [logger] <code>function</code> <code> = console.log</code> - Function to execute for each event emitted, taking two arguments:
name - The name of event emitted by this flow prepended with prefix.
value - The value of event emitted by this flow.

**Example**  
```js
aeroflow(1, 2).dump('test ', console.info.bind(console)).run();
// test next 1
// test next 2
// test done true
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
```
<a name="Aeroflow+max"></a>
### aeroflow.max() ⇒
Determines the maximum value emitted by this flow.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: New flow emitting the maximum value only.  
**Params**

**Example**  
```js
aeroflow([1, 3, 2]).max().dump().run();
// next 3
// done
```
<a name="Aeroflow+mean"></a>
### aeroflow.mean() ⇒
Determines the mean value emitted by this flow.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: New flow emitting the mean value only.  
**Params**

**Example**  
```js
aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
// next 3
// done
```
<a name="Aeroflow+min"></a>
### aeroflow.min() ⇒
Determines the minimum value emitted by this flow.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: New flow emitting the minimum value only.  
**Params**

**Example**  
```js
aeroflow([2, 1, 3]).min().dump().run();
// next 1
// done
```
<a name="Aeroflow+prepend"></a>
### aeroflow.prepend([...sources])
Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [...sources] <code>any</code> - Values to concatenate with this flow.

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
### aeroflow.reduce(reducer, initial)
Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,
returns new flow emitting reduced value.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- reducer <code>function</code> | <code>any</code> - Function to execute on each emitted value, taking four arguments:
  result - the value previously returned in the last invocation of the reducer, or seed, if supplied
  value - the current value emitted by this flow
  index - the index of the current value emitted by the flow
  context.data.
  If is not a function, a flow emitting just reducer value will be returned.
- initial <code>any</code> - Value to use as the first argument to the first call of the reducer.

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
### aeroflow.reverse()
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
### aeroflow.run([next], [done], [data])
Runs this flow asynchronously, initiating source to emit values,
applying declared operators to emitted values and invoking provided callbacks.
If no callbacks provided, runs this flow for its side-effects only.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Params**
- [next] <code>function</code> - Callback to execute for each emitted value, taking two arguments: value, context.
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
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - new flow emitting remaining values.  
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
<a name="Aeroflow+some"></a>
### aeroflow.some([predicate]) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Tests whether some value emitted by this flow passes the predicate test,
returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.

**Kind**: instance method of <code>[Aeroflow](#Aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - New flow that emits true or false.  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression object used to test each emitted value,
  or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.

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
```
<a name="Aeroflow+tap"></a>
### aeroflow.tap([callback])
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
- [keyTransformation] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map key,
  or scalar value to use as map key.
- [valueTransformation] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map value,
  or scalar value to use as map value.

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
<a name="aeroflow"></a>
## aeroflow(sources)
Creates new flow emitting values from all provided data sources.

**Kind**: global function  
**Params**
- sources <code>any</code> - Data sources.

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
```

* [aeroflow(sources)](#aeroflow)
    * [.create(emitter)](#aeroflow.create) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.error()](#aeroflow.error)
    * [.expand()](#aeroflow.expand)
    * [.just(value)](#aeroflow.just) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.random()](#aeroflow.random) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.range()](#aeroflow.range)
    * [.repeat(value)](#aeroflow.repeat) ⇒ <code>[Aeroflow](#Aeroflow)</code>
    * [.timer()](#aeroflow.timer)

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
### aeroflow.error()
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**

**Example**  
```js
aeroflow.error('test').run();
// Uncaught Error: test
```
<a name="aeroflow.expand"></a>
### aeroflow.expand()
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**

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
### aeroflow.random() ⇒ <code>[Aeroflow](#Aeroflow)</code>
Creates new flow emitting infinite sequence of random numbers.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - The new flow emitting random numbers.  
**Params**

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
### aeroflow.range()
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**

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
### aeroflow.repeat(value) ⇒ <code>[Aeroflow](#Aeroflow)</code>
Creates flow repeating provided value.

**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Returns**: <code>[Aeroflow](#Aeroflow)</code> - The new flow emitting repeated values.  
**Params**
- value <code>function</code> | <code>any</code> - Arbitrary static value to repeat;
or function providing dynamic values and invoked with two arguments:
index - index of the value being emitted,
 data - contextual data.

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
```
<a name="aeroflow.timer"></a>
### aeroflow.timer()
**Kind**: static method of <code>[aeroflow](#aeroflow)</code>  
**Params**

**Example**  
```js
aeroflow.timer().take(3).dump().run();
// next Wed Feb 03 2016 02:35:45 ... // after 1s
// next Wed Feb 03 2016 02:35:46 ... // after 2s
// next Wed Feb 03 2016 02:35:47 ... // after 2s
// done false
aeroflow.timer(index => 500 + index * 500).take(3).dump().run();
// next Wed Feb 03 2016 02:37:36 ... // after 500ms
// next Wed Feb 03 2016 02:37:37 ... // after 1000ms
// next Wed Feb 03 2016 02:37:38 ... // after 1500ms
// done false
```
<a name="toString"></a>
## toString()
**Kind**: global function  
**Params**

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
