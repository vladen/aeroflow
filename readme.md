# Aeroflow

Truly lazily computed reactive data flows with rich set of pure functional operators and async support.

## Installation
```
$ npm i aeroflow
```
```
var flow = require('aeroflow');
```

## Creation

```
// empty
flow.empty.dump().run();
// from array
flow([1, 2]).dump().run();
// from ES6 Set
flow(new Set(['a', 'b'])).dump().run();
// from ES6 Map
flow(new Map([['a', 1], ['b', 2]])).dump().run();
// from sync generator function
flow(() => 1).dump().run();
// from async generator function
flow(() => new Promise(resolve => setTimeout(() => resolve(new Date), 100))).dump().run();

// numeric range
flow.range().dump().run();
flow.range(-3).dump().run();
flow.range(0, 5, 2).dump().run();
flow.range(5, 0, 2).dump().run();

// random numbers
flow.random().take(3).dump().run();
flow.random(0.1).take(3).dump().run();
flow.random(null, 0.1).take(3).dump().run();
flow.random(1, 9).take(3).dump().run();

// endless sequences
flow.repeat().take(3).dump().run();
flow.repeat(() => new Date).delay(1000).take(3).dump().run();

// unfold
flow.expand(v => v * 2, 1).take(5).dump().run();
flow.expand(v => new Date(+v + 1000 * 60), new Date).take(5).dump().run();
```