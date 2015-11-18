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

__static root method__
> _Create flow emitting scalar value_

```js
aeroflow('test').dump().run();
// next test
// done
```

> _Safe double wrap a flow_

```js
aeroflow(aeroflow('test')).dump().run();
// next test
// done
```

> _Create flow emitting values of an Array_

```js
aeroflow([1, 2]).dump().run();
// next 1
// next 2
// done
```

> _Create flow emitting entries of ES6 Map_

```js
aeroflow(new Map([['a', 1], ['b', 2]])).dump().run();
// next ['a', 1]
// next ['b', 2]
// done
```

> _Create flow emitting keys of ES6 Set_

```js
aeroflow(new Set(['a', 'b'])).dump().run();
// next a
// next b
// done
```

> _Create flow emitting sync function result_

```js
aeroflow(() => 'test').dump().run();
// next test
// done
```

> _Create flow emitting promise result_

```js
aeroflow(Promise.resolve('test')).dump().run();
// next test
// done
```

> _Create flow emitting async function result_

```js
aeroflow(() => new Promise(resolve => setTimeout(() => resolve('test'), 100))).dump().run();
// next test (after 100ms)
// done
```

> _Also multiple arguments of various types are accepted_

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

__static field__
> _Get empty flow emitting only "done" signal_

```js
flow.empty.dump().run();
// done
```

#### expand

__static method__
> _Generate infinite flow emitting sequence from unfolded scalar value_

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

__static method__
> _Create flow emitting the only passed value as is_

```js
aeroflow.just([1, 2]).dump().run();
// next [1, 2]
// done
aeroflow.just(() => 'test').dump().run();
// next function () => 'test'
// done
```

#### random

__static method__
> _Generate infinite flow emitting random decimal numbers_

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

#### range

__static method__
> _Generate flow emitting ascending sequential values within a range (including each boundary)_

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

#### count

__instance method__
> _Count the number of values emitted by this flow and emit only this value_

```js
aeroflow(['a', 'b', 'c']).count().dump().run();
// next 3
// done
```

#### max

__instance method__
> _Determine, and emit, the maximum value emitted by this flow_

```js
aeroflow(['a', 'b', 'c']).max().dump().run();
// next c
// done
```

#### mean

__instance method__
> _Find mean value from sequence emitted by this flow and emit the result_

```js
aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
// next 3
// done
```

#### min

__instance method__
> _Determine, and emit, the minimum value emitted by this flow_

```js
aeroflow([3, 1, 5]).min().dump().run();
// next 1
// done
```
#### reduce

__instance method__
> _Apply a function to each item emitted by this flow, sequentially, and emit the final result_

```js
aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
// next 64
// done
aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
// next a0b1c2
// done
```

#### sum

__instance method__
> _Calculate the sum of numbers emitted by this flow and emit the result_

```js
aeroflow([1, 2, 3]).sum().dump().run();
// next 6
// done
```

### Combination

#### concat
__instance method__
> _Emit the emissions from two or more flows without interleaving them_

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

__instance method__
> _Sorts values emitted by this flow and emit the sorted flow_

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

__instance method__
> _Caches values emitted by this flow for specified number of milliseconds_


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