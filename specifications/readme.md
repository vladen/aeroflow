# TOC
   - [Aeroflow#average](#aeroflowaverage)
     - [()](#aeroflowaverage-)
   - [Aeroflow#count](#aeroflowcount)
     - [()](#aeroflowcount-)
   - [Aeroflow#max](#aeroflowmax)
     - [()](#aeroflowmax-)
   - [Aeroflow#min](#aeroflowmin)
     - [()](#aeroflowmin-)
   - [Aeroflow#reduce](#aeroflowreduce)
     - [()](#aeroflowreduce-)
     - [(@reducer:function)](#aeroflowreduce-reducerfunction)
     - [(@reducer:function, @seed:any)](#aeroflowreduce-reducerfunction-seedany)
     - [(@reducer:function, @seed:any, true)](#aeroflowreduce-reducerfunction-seedany-true)
     - [(@seed:!function)](#aeroflowreduce-seedfunction)
   - [Aeroflow#toArray](#aeroflowtoarray)
     - [()](#aeroflowtoarray-)
     - [(true)](#aeroflowtoarray-true)
   - [Aeroflow#toSet](#aeroflowtoset)
     - [()](#aeroflowtoset-)
     - [(true)](#aeroflowtoset-true)
   - [Aeroflow#toString](#aeroflowtostring)
     - [()](#aeroflowtostring-)
     - [(true)](#aeroflowtostring-true)
     - [(@string)](#aeroflowtostring-string)
     - [(@string, true)](#aeroflowtostring-string-true)
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

emits @value from flow emitting single numeric @value.

```js
var value = 42,
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).average().run(done, fail);
}), expectation);
```

emits NaN from flow emitting single non-numeric @value.

```js
var value = 'test';
return assert.eventually.isNaN(new Promise(function (done, fail) {
  return aeroflow(value).average().run(done, fail);
}));
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

emits NaN from @values from flow emitting several non-numeric @values.

```js
var values = ['a', 'b'];
return assert.eventually.isNaN(new Promise(function (done, fail) {
  return aeroflow(values).average().run(done, fail);
}));
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

emits @value from flow emitting single numeric @value.

```js
var value = 42,
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).max().run(done, fail);
}), expectation);
```

emits @value from flow emitting single non-numeric @value.

```js
var value = 'test',
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).max().run(done, fail);
}), expectation);
```

emits maximum of @values from flow emitting several numeric @values.

```js
var _Math;
var values = [1, 3, 2],
    expectation = (_Math = Math).max.apply(_Math, values);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).max().run(done, fail);
}), expectation);
```

emits maximum of @values from flow emitting several non-numeric @values.

```js
var values = ['a', 'c', 'b'],
    expectation = values.reduce(function (max, value) {
  return value > max ? value : max;
});
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
var value = 42,
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).min().run(done, fail);
}), expectation);
```

emits @value from flow emitting single non-numeric @value.

```js
var value = 'test',
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).min().run(done, fail);
}), expectation);
```

emits minimum of @values from flow emitting several numeric @values.

```js
var _Math2;
var values = [1, 3, 2],
    expectation = (_Math2 = Math).min.apply(_Math2, values);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).min().run(done, fail);
}), expectation);
```

emits minimum of @values from flow emitting several non-numeric @values.

```js
var values = ['a', 'c', 'b'],
    expectation = values.reduce(function (min, value) {
  return value < min ? value : min;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).min().run(done, fail);
}), expectation);
```

<a name="aeroflowreduce"></a>
# Aeroflow#reduce
is instance method.

```js
return assert.isFunction(aeroflow.empty.reduce);
```

<a name="aeroflowreduce-"></a>
## ()
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow');
```

emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reduce().run(fail, done);
}));
```

emits nothing when flow is not empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').reduce().run(fail, done);
}));
```

<a name="aeroflowreduce-reducerfunction"></a>
## (@reducer:function)
does not call @reducer when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(fail).run(fail, done);
}));
```

does not call @reducer when flow emits single value.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(1).reduce(fail).run(done, fail);
}));
```

calls @reducer when flow emits serveral values.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(done).run(fail, fail);
}));
```

emits value emitted by flow when flow emits single value.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).reduce(function () {
    return 'test';
  }).run(done, fail);
}), value);
```

emits value returned by @reducer when flow emits several values.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2, 3).reduce(function () {
    return value;
  }).run(done, fail);
}), value);
```

passes first and second values emitted by flow to @reducer as first and second arguments on first iteration.

```js
var values = [1, 2];
return assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).reduce(function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return done(args);
  }).run(fail, fail);
}), values);
```

passes zero-based index of iteration to @reducer as third argument.

```js
var values = [1, 2, 3, 4];
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).reduce(function (_, __, index) {
    return index;
  }).run(done, fail);
}), values.length - 2);
```

passes context data to @function as forth argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(function (_, __, ___, data) {
    return done(data);
  }).run(fail, fail, data);
}), data);
```

<a name="aeroflowreduce-reducerfunction-seedany"></a>
## (@reducer:function, @seed:any)
emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(function () {}, 42).run(fail, done);
}));
```

passes @seed to @reducer as first argument on first iteration.

```js
var seed = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').reduce(done, seed).run(fail, fail);
}), seed);
```

<a name="aeroflowreduce-reducerfunction-seedany-true"></a>
## (@reducer:function, @seed:any, true)
emits @seed when flow is empty.

```js
var seed = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(function () {}, seed, true).run(done, fail);
}), seed);
```

<a name="aeroflowreduce-seedfunction"></a>
## (@seed:!function)
emits @seed when flow is empty.

```js
var seed = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(seed).run(done, fail);
}), seed);
```

emits @seed when flow is not empty.

```js
var seed = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(seed).run(done, fail);
}), seed);
```

<a name="aeroflowtoarray"></a>
# Aeroflow#toArray
is instance method.

```js
assert.isFunction(aeroflow.empty.toArray);
```

<a name="aeroflowtoarray-"></a>
## ()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow');
```

emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toArray().run(fail, done);
}));
```

emits array of @values when flow emits several @values.

```js
var values = [1, 2, 1, 3, 2, 3],
    expectation = values;
return assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflowtoarray-true"></a>
## (true)
emits an array when flow is empty.

```js
var expectation = 'Array';
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toArray(true).run(done, fail);
}), expectation);
```

emits empty array from flow is empty.

```js
var expectation = 0;
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toArray(true).run(done, fail);
}), expectation);
```

<a name="aeroflowtoset"></a>
# Aeroflow#toSet
is instance method.

```js
assert.isFunction(aeroflow.empty.toSet);
```

<a name="aeroflowtoset-"></a>
## ()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow');
```

emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toSet().run(fail, done);
}));
```

emits set of unique @values when flow emits several @values.

```js
var values = [1, 2, 1, 3, 2, 3],
    expectation = Array.from(new Set(values));
return assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).toSet().map(function (set) {
    return Array.from(set);
  }).run(done, fail);
}), expectation);
```

<a name="aeroflowtoset-true"></a>
## (true)
emits a set when flow is empty.

```js
var expectation = 'Set';
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toSet(true).run(done, fail);
}), expectation);
```

emits empty set when flow is empty.

```js
var expectation = 0;
return assert.eventually.propertyVal(new Promise(function (done, fail) {
  return aeroflow.empty.toSet(true).run(done, fail);
}), 'size', expectation);
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

emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toString().run(fail, done);
}));
```

emits @string when flow emits single @string.

```js
var string = 'test',
    expectation = string;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(string).toString().run(done, fail);
}), expectation);
```

emits @number converted to string when flow emits single @number.

```js
var number = 42,
    expectation = '' + number;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(number).toString().run(done, fail);
}), expectation);
```

emits @strings concatenated via "," separator when flow emits several @strings.

```js
var strings = ['a', 'b'],
    expectation = strings.join(',');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(strings).toString().run(done, fail);
}), expectation);
```

emits @numbers converted to strings and concatenated via "," separator when flow emits several @numbers.

```js
var numbers = [100, 500],
    expectation = numbers.join(',');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(numbers).toString().run(done, fail);
}), expectation);
```

<a name="aeroflowtostring-true"></a>
## (true)
emits string when flow empty.

```js
var expectation = 'String';
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(true).run(done, fail);
}), expectation);
```

emits empty string when flow is empty.

```js
var expectation = 0;
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(true).run(done, fail);
}), expectation);
```

<a name="aeroflowtostring-string"></a>
## (@string)
emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toString(';').run(fail, done);
}));
```

emits @strings concatenated via @string separator when flow emits several @strings.

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
emits empty string when flow is empty.

```js
var delimiter = ';',
    expectation = 0;
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(delimiter, true).run(done, fail);
}), expectation);
```

