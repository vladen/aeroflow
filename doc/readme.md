<a name="module_aeroflow"></a>
## aeroflow
Lazily computed async reactive data flow.


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
aeroflow(1).concat(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
```
<a name="module_aeroflow..Aeroflow+count"></a>
#### `aeroflow.count()`
Counts the number of values emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example**  
```js
aeroflow(['a', 'b', 'c']).count().dump().run();
```
<a name="module_aeroflow..Aeroflow+delay"></a>
#### `aeroflow.delay([condition])`
Returns new flow delaying emission of each value accordingly provided condition.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example:**: aeroflow(1).delay(500).dump().run();
**Params**
- [condition] <code>number</code> | <code>date</code> | <code>function</code> - The condition used to determine delay for each subsequent emission.

<a name="module_aeroflow..Aeroflow+dump"></a>
#### `aeroflow.dump([prefix], [logger])`
Dumps each 'next' and final 'done' events emitted by this flow to the `logger` with optional prefix.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [prefix] <code>string</code> <code> = &quot;&#x27;&#x27;&quot;</code> - A string prefix prepended to each event name.
- [logger] <code>function</code> <code> = console.log</code> - Function to execute for each event emitted, taking two arguments:

**Example**  
```js
aeroflow(1, 2, 3).dump('test ', console.info.bind(console)).run();
```
<a name="module_aeroflow..Aeroflow+every"></a>
#### `aeroflow.every([predicate])` ⇒ <code>Aeroflow</code>
Tests whether all values emitted by this flow pass the predicate test, returns flow emitting true if the predicate returns true for all emitted values; otherwise, false.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits true or false.  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression object used to test each emitted value,

**Example**  
```js
aeroflow(1).every().dump().run();
```
<a name="module_aeroflow..Aeroflow+filter"></a>
#### `aeroflow.filter([predicate])`
Returns new from emitting inly values that pass the test implemented by the provided predicate.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The test applied to each emitted value.

**Example**  
```js
aeroflow(0, 1).filter().dump().run();
```
<a name="module_aeroflow..Aeroflow+max"></a>
#### `aeroflow.max()`
Determines the maximum value emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example**  
```js
aeroflow([1, 2, 3]).max().dump().run();
```
<a name="module_aeroflow..Aeroflow+mean"></a>
#### `aeroflow.mean()`
Determines the mean value emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example**  
```js
aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
```
<a name="module_aeroflow..Aeroflow+min"></a>
#### `aeroflow.min()`
Determine the minimum value emitted by this flow, returns new flow emitting only this value.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Example**  
```js
aeroflow([1, 2, 3]).min().dump().run();
```
<a name="module_aeroflow..Aeroflow+prepend"></a>
#### `aeroflow.prepend([...sources])`
Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [...sources] <code>any</code> - Values to concatenate with this flow.

**Example**  
```js
aeroflow(1).prepend(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
```
<a name="module_aeroflow..Aeroflow+reduce"></a>
#### `aeroflow.reduce(reducer, initial)`
Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- reducer <code>function</code> | <code>any</code> - Function to execute on each emitted value, taking four arguments:
- initial <code>any</code> - Value to use as the first argument to the first call of the reducer.

**Example**  
```js
aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
```
<a name="module_aeroflow..Aeroflow+run"></a>
#### `aeroflow.run([next], [done], [data])`
Runs this flow asynchronously, initiating source to emit values,

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [next] <code>function</code> - Callback to execute for each emitted value, taking two arguments: value, context.
- [done] <code>function</code> - Callback to execute as emission is complete, taking two arguments: error, context.
- [data] <code>function</code> - Arbitrary value passed to each callback invoked by this flow as context.data argument.

**Example**  
```js
aeroflow.range(1, 3).run(
```
<a name="module_aeroflow..Aeroflow+skip"></a>
#### `aeroflow.skip([condition])` ⇒ <code>Aeroflow</code>
Skips some of the values emitted by this flow,

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - new flow emitting remaining values.  
**Params**
- [condition] <code>number</code> | <code>function</code> | <code>any</code> - The number or predicate function used to determine how many values to skip.

**Example**  
```js
aeroflow([1, 2, 3]).skip().dump().run();
```
<a name="module_aeroflow..Aeroflow+some"></a>
#### `aeroflow.some([predicate])` ⇒ <code>Aeroflow</code>
Tests whether some value emitted by this flow passes the predicate test,

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits true or false.  
**Params**
- [predicate] <code>function</code> | <code>regexp</code> | <code>any</code> - The predicate function or regular expression object used to test each emitted value,

**Example**  
```js
aeroflow(0).some().dump().run();
```
<a name="module_aeroflow..Aeroflow+tap"></a>
#### `aeroflow.tap([callback])`
Executes provided callback once per each value emitted by this flow,

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Params**
- [callback] <code>function</code> - Function to execute for each value emitted, taking three arguments:

**Example**  
```js
aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();
```
<a name="module_aeroflow..Aeroflow+toArray"></a>
#### `aeroflow.toArray([mapper])` ⇒ <code>Aeroflow</code>
Collects all values emitted by this flow to array, returns flow emitting this array.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits array.  
**Params**
- [mapper] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value,

**Example**  
```js
aeroflow.range(1, 3).toArray().dump().run();
```
<a name="module_aeroflow..Aeroflow+toMap"></a>
#### `aeroflow.toMap([keyMapper], [valueMapper])` ⇒ <code>Aeroflow</code>
Collects all values emitted by this flow to ES6 map, returns flow emitting this map.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits map.  
**Params**
- [keyMapper] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map key,
- [valueMapper] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to map value,

**Example**  
```js
aeroflow.range(1, 3).toMap(v => 'key' + v, true).dump().run();
```
<a name="module_aeroflow..Aeroflow+toSet"></a>
#### `aeroflow.toSet([mapper])` ⇒ <code>Aeroflow</code>
Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

**Kind**: instance method of <code>[Aeroflow](#module_aeroflow..Aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - New flow that emits set.  
**Params**
- [mapper] <code>function</code> | <code>any</code> - The mapping function used to transform each emitted value to key,

**Example**  
```js
aeroflow.range(1, 3).toSet().dump().run();
```
<a name="module_aeroflow.aeroflow"></a>
### `aeroflow.aeroflow([...sources])`
Creates new flow emitting values from arbitrary sources.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Params**
- [...sources] <code>any</code>

**Example**  
```js
aeroflow(1, [2, 3], Promise.resolve(4), () => new Promise(resolve => setTimeout(() => resolve(5), 100)), new Set([6, 7])).dump().run();
```
<a name="module_aeroflow.create"></a>
### `aeroflow.create(emitter)`
Creates programmatically controlled flow.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Params**
- emitter <code>function</code> | <code>any</code> - The emitter function taking three arguments:

**Example**  
```js
aeroflow.create((next, done, context) => {
```
<a name="module_aeroflow.empty"></a>
### `aeroflow.empty`
Returns static empty flow emitting done event only.

**Kind**: static property of <code>[aeroflow](#module_aeroflow)</code>  
**Example**  
```js
aeroflow.empty.dump().run();
```
<a name="module_aeroflow.just"></a>
### `aeroflow.just(value)`
Returns new flow emitting the provided value only.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Params**
- value <code>any</code> - The value to emit.

**Example**  
```js
aeroflow.just('test').dump().run();
```
<a name="module_aeroflow.random"></a>
### `aeroflow.random()`
Returns new flow emitting random numbers.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Params**

**Example**  
```js
aeroflow.random().take(3).dump().run();
```
<a name="module_aeroflow.repeat"></a>
### `aeroflow.repeat(repeater)` ⇒ <code>Aeroflow</code>
Creates flow of repeting values.

**Kind**: static method of <code>[aeroflow](#module_aeroflow)</code>  
**Returns**: <code>Aeroflow</code> - new flow.  
**Params**
- repeater <code>function</code> | <code>any</code> - Arbitrary scalar value to repeat; or function invoked repeatedly with two arguments: 

**Example**  
```js
aeroflow.repeat(new Date().getSeconds(), 3).dump().run();
```