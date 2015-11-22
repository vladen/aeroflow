# ~ Aeroflow ~

Truly lazily computed reactive data flows with rich set of pure functional operators and async support.

Inspired by [Reactive Extensions](http://reactivex.io/) but much more simplier, compact and completely ES6 based.

> _Since ES6 support among existing browsers is not complete yet, this library requires [core-js](https://github.com/zloirock/core-js) standard library to work._

## Contents

  + [Installation](#installation)
  + [Usage](#usage)
  + [Building](#building)
  + [Linting](#linting)
  + [Testing](#testing)
  + [API Documentation](https://github.com/vladen/aeroflow/tree/master/doc)

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
