# ~ Aeroflow ~

Truly lazily computed reactive data flows with rich set of pure functional operators and async support.
Inspired by [Reactive Extensions](http://reactivex.io/) but much more simplier, compact and ES6 based.

## Contents
  + [Installation](#installation)
  + [Usage](#usage)
  + [Examples](#examples)
    - [creation](#creation)
    - [aggregation](#aggregation)

## Installation
```
$ npm i aeroflow
```
## Usage
```js
var aeroflow = require('aeroflow');
```

## Examples
### Creation
#### aeroflow (root static function)
Create flow emitting scalar value
```js
aeroflow('test').dump().run();
// next test
// done
```
Attepts to double wrap flows are safe
```js
aeroflow(aeroflow('test')).dump().run();
// next test
// done
```
Create flow emitting values of an Array
```js
aeroflow([1, 2]).dump().run();
// next 1
// next 2
// done
```
Create flow emitting entries of ES6 Map
```js
aeroflow(new Map([['a', 1], ['b', 2]])).dump().run();
// next ['a', 1]
// next ['b', 2]
// done
```
Create flow emitting keys of ES6 Set
```js
aeroflow(new Set(['a', 'b'])).dump().run();
// next a
// next b
// done
```
Create flow emitting sync function result
```js
aeroflow(() => 'test').dump().run();
// next test
// done
```
Create flow emitting promise result
```js
aeroflow(Promise.resolve('test')).dump().run();
// next test
// done
```
Create flow emitting async function result
```js
aeroflow(() => new Promise(resolve => setTimeout(() => resolve('test'), 100))).dump().run();
// next test (after 100ms)
// done
```
#### empty (static field)
Get empty flow emitting only "done" signal
```js
flow.empty.dump().run();
// done
```
#### expand (static function)
Generate infinite flow emitting sequence from unfolded scalar value
```js
aeroflow.expand(value => value * 2, 1).take(3).dump().run();
// next 2
// next 4
// next 8
// done
aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
// next Sun Nov 15 2015 14:33:12 GMT+...
// next Sun Nov 15 2015 14:34:12 GMT+...
// next Sun Nov 15 2015 14:35:12 GMT+...
// done
```
#### just (static function)
Create flow emitting the only passed value as is
```js
aeroflow.just([1, 2]).dump().run();
// next [1, 2]
// done
aeroflow.just(() => 'test').dump().run();
// next function () => 'test'
// done
```
#### random (static function)
Generate infinite flow emitting random decimal numbers
```js
aeroflow.random().take(3).dump().run();
// next 0.9801581127103418
// next 0.309208482503891
// next 0.2196122540626675
// done
```
Generate infinite flow emitting random decimal numbers within a range (not including upper boundary)
```js
aeroflow.random(1.1, 9.9).take(3).dump().run();
// next 5.97583004180342
// next 8.107265093177558
// next 1.796510285139084
// done
```
Generate infinite flow emitting random integer numbers within a range (not including upper boundary)
```js
aeroflow.random(1, 9).take(3).dump().run();
// next 5
// next 8
// next 1
// done
```
#### range (static function)
Generate flow emitting ascending sequential values within a range (including each boundary)
```js
aeroflow.range(1, 3).dump().run();
// next 1
// next 2
// next 3
// done
```
Generate flow emitting ascending sequential values within a range with step (including lower boundary and possibly upper)
```js
aeroflow.range(1, 5, 2).dump().run();
// next 1
// next 3
// next 5
// done
```
Generate flow emitting descending sequential values within a range (including each boundary)
```js
aeroflow.range(3, 1).dump().run();
// next 3
// next 2
// next 1
// done
```
Generate flow emitting stepped descending sequential values within a range with step (including lower boundary and possibly upper)
```js
aeroflow.range(6, 1, 2).dump().run();
// next 6
// next 4
// next 2
// done
```
### Aggregation
#### count (instance method)
Count the number of values emitted by this flow and emit only this value
```js
aeroflow(['a', 'b', 'c']).count().dump().run();
// next 3
// done
```
#### max (instance method)
Determine, and emit, the maximum value emitted by this flow
```js
aeroflow(['a', 'b', 'c']).max().dump().run();
// next c
// done
```
#### mean (instance method)
Find mean value from sequence emitted by this flow and emit the result
```js
aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
// next 3
// done
```
#### min (instance method)
Determine, and emit, the minimum value emitted by this flow
```js
aeroflow([3, 1, 5]).min().dump().run();
// next 1
// done
```
#### reduce (instance method)
Apply a function to each item emitted by this flow, sequentially, and emit the final result
```js
aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
// next 64
// done
aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
// next a0b1c2
// done
```
#### sum (instance method)
Calculate the sum of numbers emitted by this flow and emit the result
```js
aeroflow([1, 2, 3]).sum().dump().run();
// next 6
// done
```