# TOC
   - [Aeroflow#average](#aeroflowaverage)
     - [()](#aeroflowaverage-)
   - [Aeroflow#count](#aeroflowcount)
     - [()](#aeroflowcount-)
   - [Aeroflow#max](#aeroflowmax)
     - [()](#aeroflowmax-)
   - [Aeroflow#min](#aeroflowmin)
     - [()](#aeroflowmin-)
   - [Aeroflow#toString](#aeroflowtostring)
     - [()](#aeroflowtostring-)
     - [(true)](#aeroflowtostring-true)
     - [(@string)](#aeroflowtostring-string)
     - [(@string, true)](#aeroflowtostring-string-true)
   - [Aeroflow#expand](#aeroflowexpand)
     - [()](#aeroflowexpand-)
     - [(@function)](#aeroflowexpand-function)
     - [(@!function)](#aeroflowexpand-function)
<a name=""></a>
 
<a name="aeroflowaverage"></a>
# Aeroflow#average
is instance method.

```js
assert.isFunction(aeroflow.empty.average);
```

<a name="aeroflowaverage-"></a>
## ()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
```

emits nothing from empty flow.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.average().run(fail, done);
}));
```

emits @value from flow emitting single @value.

```js
var expectation = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).average().run(done, fail);
}), expectation);
```

emits average from @values from flow emitting several numeric @values.

```js
var values = [1, 3, 2],
    expectation = values.reduce(function (sum, value) {
  return sum + value;
}, 0) / values.length;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).average().run(done, fail);
}), expectation);
```

<a name="aeroflowcount"></a>
# Aeroflow#count
is instance method.

```js
assert.isFunction(aeroflow.empty.count);
```

<a name="aeroflowcount-"></a>
## ()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
```

emits 0 from empty flow.

```js
var expectation = 0;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.count().run(done, fail);
}), expectation);
```

emits 1 from flow emitting single value.

```js
var expectation = 1;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).count().run(done, fail);
}), expectation);
```

emits number of @values from flow emitting several @values.

```js
var values = [1, 2, 3],
    expectation = values.length;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).count().run(done, fail);
}), expectation);
```

<a name="aeroflowmax"></a>
# Aeroflow#max
is instance method.

```js
assert.isFunction(aeroflow.empty.max);
```

<a name="aeroflowmax-"></a>
## ()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
```

emits nothing from empty flow.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.max().run(fail, done);
}));
```

emits @value from flow emitting single @value.

```js
var expectation = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).max().run(done, fail);
}), expectation);
```

emits maximum from @values from flow emitting several numeric @values.

```js
var _Math;
var values = [1, 3, 2],
    expectation = (_Math = Math).max.apply(_Math, values);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).max().run(done, fail);
}), expectation);
```

<a name="aeroflowmin"></a>
# Aeroflow#min
is instance method.

```js
assert.isFunction(aeroflow.empty.min);
```

<a name="aeroflowmin-"></a>
## ()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
```

emits nothing from empty flow.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.min().run(fail, done);
}));
```

emits @value from flow emitting single @value.

```js
var expectation = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).min().run(done, fail);
}), expectation);
```

emits maximum from @values from flow emitting several numeric @values.

```js
var _Math2;
var values = [1, 3, 2],
    expectation = (_Math2 = Math).min.apply(_Math2, values);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).min().run(done, fail);
}), expectation);
```

<a name="aeroflowtostring"></a>
# Aeroflow#toString
is instance method.

```js
assert.isFunction(aeroflow.empty.toString);
```

<a name="aeroflowtostring-"></a>
## ()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
```

emits nothing from empty flow.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toString().run(fail, done);
}));
```

emits @string from flow emitting single @string.

```js
var expectation = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).toString().run(done, fail);
}), expectation);
```

emits @number converted to string from flow emitting single @number.

```js
var number = 42,
    expectation = '' + number;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(number).toString().run(done, fail);
}), expectation);
```

emits @strings concatenated via "," separator from flow emitting several @strings.

```js
var strings = ['a', 'b'],
    expectation = strings.join(',');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(strings).toString().run(done, fail);
}), expectation);
```

emits @numbers converted to strings and concatenated via "," separator from flow emitting several @numbers.

```js
var numbers = [100, 500],
    expectation = numbers.join(',');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(numbers).toString().run(done, fail);
}), expectation);
```

<a name="aeroflowtostring-true"></a>
## (true)
emits empty string from empty flow.

```js
var expectation = 0;
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(true).run(done, fail);
}), expectation);
```

<a name="aeroflowtostring-string"></a>
## (@string)
emits nothing from empty flow.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toString(';').run(fail, done);
}));
```

emits @strings concatenated via @string separator from flow emitting several @strings.

```js
var separator = ';',
    strings = ['a', 'b'],
    expectation = strings.join(separator);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(strings).toString(separator).run(done, fail);
}), expectation);
```

<a name="aeroflowtostring-string-true"></a>
## (@string, true)
emits empty string from empty flow.

```js
var delimiter = ';',
    expectation = 0;
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(delimiter, true).run(done, fail);
}), expectation);
```

<a name="aeroflowexpand"></a>
# Aeroflow#expand
is static method.

```js
assert.isFunction(aeroflow.expand);
```

<a name="aeroflowexpand-"></a>
## ()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.expand(), 'Aeroflow');
```

