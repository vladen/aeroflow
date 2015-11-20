<a name="module_aeroflow"></a>
## aeroflow
Lazily computed async reactive data flow.

**Author:** Denis Vlassenko <denis_vlassenko@epam.com>  

* [aeroflow](#module_aeroflow)
  * _inner_
    * [~Aeroflow](#module_aeroflow..Aeroflow)
      * [`.append([...sources])`](#module_aeroflow..Aeroflow+append) ⇒ <code>Aeroflow</code>
      * [`.count()`](#module_aeroflow..Aeroflow+count)
      * [`.delay([condition])`](#module_aeroflow..Aeroflow+delay)
      * [`.dump([prefix], [logger])`](#module_aeroflow..Aeroflow+dump)
      * [`.every([predicate])`](#module_aeroflow..Aeroflow+every) ⇒ <code>Aeroflow</code>
      * [`.filter([predicate])`](#module_aeroflow..Aeroflow+filter)
      * [`.max()`](#module_aeroflow..Aeroflow+max)
      * [`.mean()`](#module_aeroflow..Aeroflow+mean)
      * [`.min()`](#module_aeroflow..Aeroflow+min)
      * [`.prepend([...sources])`](#module_aeroflow..Aeroflow+prepend)
      * [`.reduce(reducer, initial)`](#module_aeroflow..Aeroflow+reduce)
      * [`.run([next], [done], [data])`](#module_aeroflow..Aeroflow+run)
      * [`.skip([condition])`](#module_aeroflow..Aeroflow+skip) ⇒ <code>Aeroflow</code>
      * [`.some([predicate])`](#module_aeroflow..Aeroflow+some) ⇒ <code>Aeroflow</code>
      * [`.tap([callback])`](#module_aeroflow..Aeroflow+tap)
      * [`.toArray([mapper])`](#module_aeroflow..Aeroflow+toArray) ⇒ <code>Aeroflow</code>
      * [`.toMap([keyMapper], [valueMapper])`](#module_aeroflow..Aeroflow+toMap) ⇒ <code>Aeroflow</code>
      * [`.toSet([mapper])`](#module_aeroflow..Aeroflow+toSet) ⇒ <code>Aeroflow</code>
  * _static_
    * [`.aeroflow([...sources])`](#module_aeroflow.aeroflow)
    * [`.create(emitter)`](#module_aeroflow.create)
    * [`.empty`](#module_aeroflow.empty)
    * [`.just(value)`](#module_aeroflow.just)
    * [`.random()`](#module_aeroflow.random)
    * [`.repeat(repeater)`](#module_aeroflow.repeat) ⇒ <code>Aeroflow</code>

<a name="module_aeroflow..Aeroflow"></a>
### aeroflow~Aeroflow
Class

**Kind**: inner class of <code>[aeroflow](#module_aeroflow)</code>  

  * [~Aeroflow](#module_aeroflow..Aeroflow)
    * [`.append([...sources])`](#module_aeroflow..Aeroflow+append) ⇒ <code>Aeroflow</code>
    * [`.count()`](#module_aeroflow..Aeroflow+count)
    * [`.delay([condition])`](#module_aeroflow..Aeroflow+delay)
    * [`.dump([prefix], [logger])`](#module_aeroflow..Aeroflow+dump)
    * [`.every([predicate])`](#module_aeroflow..Aeroflow+every) ⇒ <code>Aeroflow</code>
    * [`.filter([predicate])`](#module_aeroflow..Aeroflow+filter)
    * [`.max()`](#module_aeroflow..Aeroflow+max)
    * [`.mean()`](#module_aeroflow..Aeroflow+mean)
    * [`.min()`](#module_aeroflow..Aeroflow+min)
    * [`.prepend([...sources])`](#module_aeroflow..Aeroflow+prepend)
    * [`.reduce(reducer, initial)`](#module_aeroflow..Aeroflow+reduce)
    * [`.run([next], [done], [data])`](#module_aeroflow..Aeroflow+run)
    * [`.skip([condition])`](#module_aeroflow..Aeroflow+skip) ⇒ <code>Aeroflow</code>
    * [`.some([predicate])`](#module_aeroflow..Aeroflow+some) ⇒ <code>Aeroflow</code>
    * [`.tap([callback])`](#module_aeroflow..Aeroflow+tap)
    * [`.toArray([mapper])`](#module_aeroflow..Aeroflow+toArray) ⇒ <code>Aeroflow</code>
    * [`.toMap([keyMapper], [valueMapper])`](#module_aeroflow..Aeroflow+toMap) ⇒ <code>Aeroflow</code>
    * [`.toSet([mapper])`](#module_aeroflow..Aeroflow+toSet) ⇒ <code>Aeroflow</code>

<a name="module_aeroflow..Aeroflow+append"></a>
#### `aeroflow.append([...sources])` ⇒ <code>Aeroflow</code>
Returns new flow emitting values from this flow first and then from all provided sources without interleaving them.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - new flow.  
**Access:** public  
**Params**
- [...sources] <code>any</code> - Value sources to append to this flow.

**Example**  
```js
aeroflow(1).concat(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();// next 1// next 2// next 3// next 4// next 5// next 6 // after 500ms// done
```
<a name="module_aeroflow..Aeroflow+count"></a>
#### `aeroflow.count()`
Counts the number of values emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example**  
```js
aeroflow(['a', 'b', 'c']).count().dump().run();// next 3// done
```
<a name="module_aeroflow..Aeroflow+delay"></a>
#### `aeroflow.delay([condition])`
Returns new flow delaying emission of each value accordingly provided condition.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example:**: aeroflow(1).delay(500).dump().run();// next 1 // after 500ms// doneaeroflow(1, 2).delay(new Date + 500).dump().run();// next 1 // after 500ms// next 2// doneaeroflow([1, 2, 3]).delay((value, index) => index * 500).dump().run();// next 1// next 2 // after 500ms// next 3 // after 1000ms// done  
**Params**
- [condition] <code>number</code> | <code>date</code> | <code>function</code> - The condition used to determine delay for each subsequent emission.  Number is threated as milliseconds interval (negative number is considered as 0).  Date is threated as is (date in past is considered as now).  Function is execute for each emitted value, with three arguments:    value - The current value emitted by this flow    index - The index of the current value    context - The context object  The result of condition function will be converted nu number and used as milliseconds interval.

<a name="module_aeroflow..Aeroflow+dump"></a>
#### `aeroflow.dump([prefix], [logger])`
Dumps each 'next' and final 'done' events emitted by this flow to the `logger` with optional prefix.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [prefix] <code>string</code> <code> = &quot;&#x27;&#x27;&quot;</code> - A string prefix prepended to each event name.
- [logger] <code>function</code> <code> = console.log</code> - Function to execute for each event emitted, taking two arguments:  event - The name of event emitted prepended with prefix (next or done).  value - The value (next event) or error (done event) emitted by this flow.

**Example**  
```js
aeroflow(1, 2, 3).dump('test ', console.info.bind(console)).run();// test next 1// test next 2// test next 3// test done
```
<a name="module_aeroflow..Aeroflow+every"></a>
#### `aeroflow.every([predicate])` ⇒ <code>Aeroflow</code>
Tests whether all values emitted by this flow pass the predicate test, returns flow emitting true if the predicate returns true for all emitted values; otherwise, false.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits true or false.  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression object used to test each emitted value,  or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.

**Example**  
```js
aeroflow(1).every().dump().run();// next true// doneaeroflow.range(1, 3).every(2).dump().run();// next false// doneaeroflow.range(1, 3).every(value => value % 2).dump().run();// next false// done
```
<a name="module_aeroflow..Aeroflow+filter"></a>
#### `aeroflow.filter([predicate])`
Returns new from emitting inly values that pass the test implemented by the provided predicate.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The test applied to each emitted value.

**Example**  
```js
aeroflow(0, 1).filter().dump().run();// next 1// doneaeroflow('a', 'b', 'a').filter(/a/).dump().run();// next "a"// next "a"// doneaeroflow('a', 'b', 'b').filter('b').dump().run();// next "b"// next "b"// done
```
<a name="module_aeroflow..Aeroflow+max"></a>
#### `aeroflow.max()`
Determines the maximum value emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example**  
```js
aeroflow([1, 2, 3]).max().dump().run();// next 3// done
```
<a name="module_aeroflow..Aeroflow+mean"></a>
#### `aeroflow.mean()`
Determines the mean value emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example**  
```js
aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();// next 3// done
```
<a name="module_aeroflow..Aeroflow+min"></a>
#### `aeroflow.min()`
Determine the minimum value emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example**  
```js
aeroflow([1, 2, 3]).min().dump().run();// next 1// done
```
<a name="module_aeroflow..Aeroflow+prepend"></a>
#### `aeroflow.prepend([...sources])`
Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [...sources] <code>any</code> - Values to concatenate with this flow.

**Example**  
```js
aeroflow(1).prepend(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();// next 2// next 3// next 4// next 5// next 6 // after 500ms// next 1// done
```
<a name="module_aeroflow..Aeroflow+reduce"></a>
#### `aeroflow.reduce(reducer, initial)`
Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,returns new flow emitting reduced value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- reducer <code>function</code> | <code>any</code> - Function to execute on each emitted value, taking four arguments:  result - the value previously returned in the last invocation of the reducer, or seed, if supplied  value - the current value emitted by this flow  index - the index of the current value emitted by the flow  context.data.  If is not a function, a flow emitting just reducer value will be returned.
- initial <code>any</code> - Value to use as the first argument to the first call of the reducer.

**Example**  
```js
aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
```
<a name="module_aeroflow..Aeroflow+run"></a>
#### `aeroflow.run([next], [done], [data])`
Runs this flow asynchronously, initiating source to emit values,applying declared operators to emitted values and invoking provided callbacks.If no callbacks provided, runs this flow for its side-effects only.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [next] <code>function</code> - Callback to execute for each emitted value, taking two arguments: value, context.
- [done] <code>function</code> - Callback to execute as emission is complete, taking two arguments: error, context.
- [data] <code>function</code> - Arbitrary value passed to each callback invoked by this flow as context.data argument.

**Example**  
```js
aeroflow.range(1, 3).run(  value => console.log('next', value), error => console.log('done', error));// next 1// next 2// next 3// done undefined
```
<a name="module_aeroflow..Aeroflow+skip"></a>
#### `aeroflow.skip([condition])` ⇒ <code>Aeroflow</code>
Skips some of the values emitted by this flow,  returns flow emitting remaining values.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - new flow emitting remaining values.  
**Params**
- [condition] <code>number</code> | <code>function</code> | <code>any</code> - The number or predicate function used to determine how many values to skip.  If omitted, returned flow skips all values emitting done event only.  If zero, returned flow skips nothing.  If positive number, returned flow skips this number of first emitted values.  If negative number, returned flow skips this number of last emitted values.  If function, returned flow skips emitted values while this function returns trythy value.

**Example**  
```js
aeroflow([1, 2, 3]).skip().dump().run();// doneaeroflow([1, 2, 3]).skip(1).dump().run();// next 2// next 3// doneaeroflow([1, 2, 3]).skip(-1).dump().run();// next 1// next 2// doneaeroflow([1, 2, 3]).some(value => value < 3).dump().run();// next 3// done
```
<a name="module_aeroflow..Aeroflow+some"></a>
#### `aeroflow.some([predicate])` ⇒ <code>Aeroflow</code>
Tests whether some value emitted by this flow passes the predicate test,  returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits true or false.  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression object used to test each emitted value,  or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.

**Example**  
```js
aeroflow(0).some().dump().run();// next false// doneaeroflow.range(1, 3).some(2).dump().run();// next true// doneaeroflow.range(1, 3).some(value => value % 2).dump().run();// next true// done
```
<a name="module_aeroflow..Aeroflow+tap"></a>
#### `aeroflow.tap([callback])`
Executes provided callback once per each value emitted by this flow,returns new tapped flow or this flow if no callback provided.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [callback] <code>function</code> - Function to execute for each value emitted, taking three arguments:  value emitted by this flow,  index of the value,  context object.

**Example**  
```js
aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();// value: 1 index: 0// value: 2 index: 1// value: 3 index: 2
```
<a name="module_aeroflow..Aeroflow+toArray"></a>
#### `aeroflow.toArray([mapper])` ⇒ <code>Aeroflow</code>
Collects all values emitted by this flow to array, returns flow emitting this array.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits array.  
**Params**
- [mapper] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value,  or scalar value to fill array with ignoring source values.

**Example**  
```js
aeroflow.range(1, 3).toArray().dump().run();// next [1, 2, 3]// done
```
<a name="module_aeroflow..Aeroflow+toMap"></a>
#### `aeroflow.toMap([keyMapper], [valueMapper])` ⇒ <code>Aeroflow</code>
Collects all values emitted by this flow to ES6 map, returns flow emitting this map.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits map.  
**Params**
- [keyMapper] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map key,  or scalar value to use as map key.
- [valueMapper] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map value,  or scalar value to use as map value.

**Example**  
```js
aeroflow.range(1, 3).toMap(v => 'key' + v, true).dump().run();// next Map {"key1" => true, "key2" => true, "key3" => true}// doneaeroflow.range(1, 3).toMap(v => 'key' + v, v => v * 10).dump().run();// next Map {"key1" => 10, "key2" => 20, "key3" => 30}// done
```
<a name="module_aeroflow..Aeroflow+toSet"></a>
#### `aeroflow.toSet([mapper])` ⇒ <code>Aeroflow</code>
Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits set.  
**Params**
- [mapper] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to key,  or scalar value to use as key.

**Example**  
```js
aeroflow.range(1, 3).toSet().dump().run();// next Set {1, 2, 3}// doneaeroflow.range(1, 3).toSet(v => 'key' + v).dump().run();// next Set {"key1", "key2", "key3"}// done
```
<a name="module_aeroflow.aeroflow"></a>
### `aeroflow.aeroflow([...sources])`
Creates new flow emitting values from arbitrary sources.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Params**
- [...sources] <code>any</code>

**Example**  
```js
aeroflow(1, [2, 3], Promise.resolve(4), () => new Promise(resolve => setTimeout(() => resolve(5), 100)), new Set([6, 7])).dump().run();// next 1// next 2// next 3// next 4// next 5 // after 100ms// next 6// next 7// done
```
<a name="module_aeroflow.create"></a>
### `aeroflow.create(emitter)`
Creates programmatically controlled flow.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Params**
- emitter <code>function</code> | <code>any</code> - The emitter function taking three arguments:  next - the function emitting 'next' event,  done - the function emitting 'done' event,  context - current execution context.

**Example**  
```js
aeroflow.create((next, done, context) => {  next(1);  next(new Promise(resolve => setTimeout(() => resolve(2), 500)));  setTimeout(done, 1000);}).dump().run();// next 1 // after 500ms// next 2 // after 1000ms// done
```
<a name="module_aeroflow.empty"></a>
### `aeroflow.empty`
Returns static empty flow emitting done event only.

**Kind**: static property of <code>[aeroflow](#module_aeroflow)</code>  
**Example**  
```js
aeroflow.empty.dump().run();// done
```
<a name="module_aeroflow.just"></a>
### `aeroflow.just(value)`
Returns new flow emitting the provided value only.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Params**
- value <code>any</code> - The value to emit.

**Example**  
```js
aeroflow.just('test').dump().run();// next "test"// doneaeroflow.just(() => 'test').dump().run();// next "test"// done
```
<a name="module_aeroflow.random"></a>
### `aeroflow.random()`
Returns new flow emitting random numbers.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Params**

**Example**  
```js
aeroflow.random().take(3).dump().run();aeroflow.random(0.1).take(3).dump().run();aeroflow.random(null, 0.1).take(3).dump().run();aeroflow.random(1, 9).take(3).dump().run();
```
<a name="module_aeroflow.repeat"></a>
### `aeroflow.repeat(repeater)` ⇒ <code>Aeroflow</code>
Creates flow of repeting values.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - new flow.  
**Params**
- repeater <code>function</code> | <code>any</code> - Arbitrary scalar value to repeat; or function invoked repeatedly with two arguments:   index - index of the value being emitted,  data - contextual data.

**Example**  
```js
aeroflow.repeat(new Date().getSeconds(), 3).dump().run();// next 1// next 1// next 1// doneaeroflow.repeat(() => new Date().getSeconds(), 3).delay((value, index) => index * 1000).dump().run();// next 1// next 2// next 3// doneaeroflow.repeat(index => Math.pow(2, index), 3).dump().run();// next 1// next 2// next 4// done
```
