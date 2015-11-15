# Aeroflow

Truly lazily computed reactive data flows with rich set of pure functional operators and async support.
Inspired by [Reactive Extensions](http://reactivex.io/) but much more simplier, compact and ES6 based.

## Contents
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
-- [Generation](#generation)

## Installation
```
$ npm i aeroflow
```
## Usage
```js
var aeroflow = require('aeroflow');
```

## Examples
### Generation

#### Create flow from scalar value
```js
aeroflow('test').dump().run();
// next test
// done
```
#### Attepts to double wrap flows are prevented
```js
aeroflow(aeroflow('test')).dump().run();
// next test
// done
```
#### Create flow from Array
```js
aeroflow([1, 2]).dump().run();
// next 1
// next 2
// done
```
#### Create flow from ES6 Map
```js
aeroflow(new Map([['a', 1], ['b', 2]])).dump().run();
// next ['a', 1]
// next ['b', 2]
// done
```
#### Create flow from ES6 Set
```js
aeroflow(new Set(['a', 'b'])).dump().run();
// next a
// next b
// done
```
#### Create single-item flow from sync function result
```js
aeroflow(() => 'test').dump().run();
// next test
// done
```
#### Create single-item flow from promise
```js
aeroflow(Promise.resolve('test')).dump().run();
// next test
// done
```
#### Create single-item flow from async function result
```js
aeroflow(() => new Promise(resolve => setTimeout(() => resolve('test'), 100))).dump().run();
// next test (after 100ms)
// done
```
#### Get empty flow
```js
flow.empty.dump().run();
// done
```
#### Generate infinite flow expanding/unfolding scalar value
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
#### Create single-item flow from passed value
```js
aeroflow.just([1, 2]).dump().run();
// next [1, 2]
// done
aeroflow.just(() => 'test').dump().run();
// next function () => 'test'
// done
```
#### Generate infinite flow of random decimal numbers
```js
aeroflow.random().take(3).dump().run();
// next 0.9801581127103418
// next 0.309208482503891
// next 0.2196122540626675
// done
```
#### Generate infinite flow of random decimal numbers within a range (not including upper boundary)
```js
aeroflow.random(1.1, 9.9).take(3).dump().run();
// next 5.97583004180342
// next 8.107265093177558
// next 1.796510285139084
// done
```
#### Generate infinite flow of random integer numbers within a range (not including upper boundary)
```js
aeroflow.random(1, 9).take(3).dump().run();
// next 5
// next 8
// next 1
// done
```
#### Generate flow of ascending sequential values within a range (including each boundary)
```js
aeroflow.range(1, 3).dump().run();
// next 1
// next 2
// next 3
// done
```
#### Generate flow of ascending sequential values within a range with step (including lower boundary and possibly upper)
```js
aeroflow.range(1, 5, 2).dump().run();
// next 1
// next 3
// next 5
// done
```
#### Generate flow of descending sequential values within a range (including each boundary)
```js
aeroflow.range(3, 1).dump().run();
// next 3
// next 2
// next 1
// done
```
#### Generate flow of stepped descending sequential values within a range with step (including lower boundary and possibly upper)
```js
aeroflow.range(6, 1, 2).dump().run();
// next 6
// next 4
// next 2
// done
```