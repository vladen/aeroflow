# ~ Aeroflow ~

Truly lazily computed reactive data flows with rich set of pure functional operators and async support.

Inspired by [Reactive Extensions](http://reactivex.io/) but much more simplier, compact and completely ES6 based.

> _Since existing browsers still do not support ES6 completely, this library requires [core-js](https://github.com/zloirock/core-js) standard library to work._

## Contents

  + [Installation](#installation)
  + [Usage](#usage)
  + [Building](#building)
  + [Linting](#linting)
  + [Testing](#testing)
  + [Api](#api)
    - [creation](#creation)
    - [aggregation](#aggregation)
    - [combination](#combination)
    - [organization](#organization)
    - [optimization](#optimization)

## Installation

```
$ npm i core-js
$ npm i aeroflow
```

## Usage

```js
require('core-js');
var aeroflow = require('aeroflow');
```

## Building

```
$ npm install
$ npm run build
```

Produces set of files on the 'lib' folder:

* aeroflow.js - ES5 version of library for legacy browser or nodejs
* aeroflow.min.js - minified ES5 version of library for any browser
* aeroflow.es6.js - ES6 version of library for both modern browser and nodejs environments
* tests.js - ES5 version of tests legacy browser or nodejs
* tests.es6.js - ES6 version of tests for both modern browser and nodejs environments

Other options:

```
$ npm run compile               # without minification
$ npm run compile-flow          # ES6 library only
$ npm run compile-flow-compat   # ES5 library compatible only
$ npm run compile-test          # ES6 tests only
$ npm run compile-test-compat   # ES5 tests only
```

## Linting

```
$ npm run lint                  # lint both library and tests
$ npm run lint-flow             # lint library only
$ npm run lint-test             # lint tests only
```

## Testing

```
$ npm run test
```
Additional options:

* open index.es6.html page in any modern browser
* open index.html page in any legacy browser

> _Be sure to serve this pages from web server, not file system!_


## API

### Creation

#### aeroflow

[static root method]

__Create flow emitting scalar value__

```js
aeroflow('test').dump().run();
// next test
// done
```

__Safe double wrap a flow__

```js
aeroflow(aeroflow('test')).dump().run();
// next test
// done
```

__Create flow emitting values of an Array__

```js
aeroflow([1, 2]).dump().run();
// next 1
// next 2
// done
```

__Create flow emitting entries of ES6 Map__

```js
aeroflow(new Map([['a', 1], ['b', 2]])).dump().run();
// next ['a', 1]
// next ['b', 2]
// done
```

__Create flow emitting keys of ES6 Set__

```js
aeroflow(new Set(['a', 'b'])).dump().run();
// next a
// next b
// done
```

__Create flow emitting sync function result__

```js
aeroflow(() => 'test').dump().run();
// next test
// done
```

__Create flow emitting promise result__

```js
aeroflow(Promise.resolve('test')).dump().run();
// next test
// done
```

__Create flow emitting async function result__

```js
aeroflow(() => new Promise(resolve => setTimeout(() => resolve('test'), 100))).dump().run();
// next test (after 100ms)
// done
```

__Also multiple arguments of various types are accepted__

```js
aeroflow(1, [2, 3], new Set([4, 5]), Promise.resolve(7), new Promise(resolve => setTimeout(() => resolve(8), 500))).dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5
// next 7
// next 8
// done
```

#### empty

[static field]

__Get empty flow emitting only "done" signal__

```js
flow.empty.dump().run();
// done
```

#### expand

[static method]

__Generate infinite flow emitting sequence from unfolded scalar value__

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

#### just

[static method]

__Create flow emitting the only passed value as is__

```js
aeroflow.just([1, 2]).dump().run();
// next [1, 2]
// done
aeroflow.just(() => 'test').dump().run();
// next function () => 'test'
// done
```

#### random

[static method]

__Generate infinite flow emitting random decimal numbers__

```js
aeroflow.random().take(3).dump().run();
// next 0.9801581127103418
// next 0.309208482503891
// next 0.2196122540626675
// done
```

__Generate infinite flow emitting random decimal numbers within a range (not including upper boundary)__

```js
aeroflow.random(1.1, 9.9).take(3).dump().run();
// next 5.97583004180342
// next 8.107265093177558
// next 1.796510285139084
// done
```

__Generate infinite flow emitting random integer numbers within a range (not including upper boundary)__

```js
aeroflow.random(1, 9).take(3).dump().run();
// next 5
// next 8
// next 1
// done
```

#### range

[static method]

__Generate flow emitting ascending sequential values within a range (including each boundary)__

```js
aeroflow.range(1, 3).dump().run();
// next 1
// next 2
// next 3
// done
```

__Generate flow emitting ascending sequential values within a range with step (including lower boundary and possibly upper)__

```js
aeroflow.range(1, 5, 2).dump().run();
// next 1
// next 3
// next 5
// done
```

__Generate flow emitting descending sequential values within a range (including each boundary)__

```js
aeroflow.range(3, 1).dump().run();
// next 3
// next 2
// next 1
// done
```

__Generate flow emitting stepped descending sequential values within a range with step (including lower boundary and possibly upper)__

```js
aeroflow.range(6, 1, 2).dump().run();
// next 6
// next 4
// next 2
// done
```

### Aggregation

#### count

[instance method]

__Count the number of values emitted by this flow and emit only this value__

```js
aeroflow(['a', 'b', 'c']).count().dump().run();
// next 3
// done
```

#### max

[instance method]

__Determine, and emit, the maximum value emitted by this flow__

```js
aeroflow(['a', 'b', 'c']).max().dump().run();
// next c
// done
```

#### mean

[instance method]

__Find mean value from sequence emitted by this flow and emit the result__

```js
aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
// next 3
// done
```

#### min

[instance method]

__Determine, and emit, the minimum value emitted by this flow__

```js
aeroflow([3, 1, 5]).min().dump().run();
// next 1
// done
```
#### reduce

[instance method]

__Apply a function to each item emitted by this flow, sequentially, and emit the final result__

```js
aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
// next 64
// done
aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
// next a0b1c2
// done
```

#### sum

[instance method]

__Calculate the sum of numbers emitted by this flow and emit the result__

```js
aeroflow([1, 2, 3]).sum().dump().run();
// next 6
// done
```

### Combination

#### concat

[instance method]

__Emit the emissions from two or more flows without interleaving them__

```js
aeroflow(1).concat(2, 3, 4, 5).dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5
// done
aeroflow(1).concat([2, 3], [4, 5]).dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5
// done
aeroflow(1)
  .concat(
    () => new Promise(resolve => setTimeout(() => resolve([2, 3]), 400))
  , () => new Promise(resolve => setTimeout(() => resolve([4, 5]), 800)))
  .dump()
  .run();
// next 1
// next 2 // after 400ms
// next 3
// next 4 // after 800ms
// next 5
// done
```
### Organization

#### sort

[instance method]

__Sorts values emitted by this flow and emit the sorted flow__

```js
aeroflow([2, 1, 4, 3]).sort().dump().run(); // or .sort('asc') or .sort(-1) or .sort(false)
// next 1
// next 2
// next 3
// next 4
// done
aeroflow([2, 1, 4, 3]).sort('desc').dump().run(); // or .sort(-1) or .sort(false)
// next 4
// next 3
// next 2
// next 1
// done
aeroflow([
  {id: 2, name: 'a'},
  {id: 2, name: 'b'},
  {id: 1, name: 'b'},
  {id: 1, name: 'a'}
]).sort(value => value.id, value => value.name).dump().run();
// next Object {id: 1, name: "a"}
// next Object {id: 1, name: "b"}
// next Object {id: 2, name: "a"}
// next Object {id: 2, name: "b"}
// done
aeroflow([
  {id: 2, name: 'a'},
  {id: 2, name: 'b'},
  {id: 1, name: 'b'},
  {id: 1, name: 'a'}
]).sort('desc', value => value.id, value => value.name).dump().run();
// next Object {id: 2, name: "b"}
// next Object {id: 2, name: "a"}
// next Object {id: 1, name: "b"}
// next Object {id: 1, name: "a"}
// done
```

### Optimization

#### share

[instance method]

__Caches values emitted by this flow for specified number of milliseconds__

```js
var i = 0;
aeroflow.repeat(() => ++i).take(3).share(2000).delay(1000).dump().run(
  null
  , (error, context) => context.flow.run(
    null
    , (error, context) => context.flow.run()));
// next 1
// next 2
// next 3
// done
// next 1
// next 2
// next 3
// done
// next 4
// next 5
// next 6
// done

```