# TOC
   - [average](#average)
     - [aeroflow().average()](#average-aeroflowaverage)
   - [catch](#catch)
     - [aeroflow().catch()](#catch-aeroflowcatch)
     - [aeroflow().catch(@alternative:function)](#catch-aeroflowcatchalternativefunction)
     - [aeroflow().catch(@alternative:!function)](#catch-aeroflowcatchalternativefunction)
   - [count](#count)
     - [aeroflow().count()](#count-aeroflowcount)
   - [filter](#filter)
     - [aeroflow().filter()](#filter-aeroflowfilter)
     - [aeroflow().filter(@condition:function)](#filter-aeroflowfilterconditionfunction)
     - [aeroflow().filter(@condition:regex)](#filter-aeroflowfilterconditionregex)
     - [aeroflow().filter(@condition:!function!regex)](#filter-aeroflowfilterconditionfunctionregex)
   - [max](#max)
     - [aeroflow().max()](#max-aeroflowmax)
   - [min](#min)
     - [aeroflow().min()](#min-aeroflowmin)
   - [reduce](#reduce)
     - [aeroflow().reduce()](#reduce-aeroflowreduce)
     - [aeroflow().reduce(@reducer:function)](#reduce-aeroflowreducereducerfunction)
     - [aeroflow().reduce(@reducer:function, @seed:any)](#reduce-aeroflowreducereducerfunction-seedany)
     - [aeroflow().reduce(@reducer:function, @seed:any, true)](#reduce-aeroflowreducereducerfunction-seedany-true)
     - [aeroflow().reduce(@seed:!function)](#reduce-aeroflowreduceseedfunction)
   - [toArray](#toarray)
     - [aeroflow().toArray()](#toarray-aeroflowtoarray)
     - [aeroflow().toArray(true)](#toarray-aeroflowtoarraytrue)
   - [toSet](#toset)
     - [aeroflow().toSet()](#toset-aeroflowtoset)
     - [aeroflow().toSet(true)](#toset-aeroflowtosettrue)
   - [toString](#tostring)
     - [aeroflow().toString()](#tostring-aeroflowtostring)
     - [aeroflow().toString(true)](#tostring-aeroflowtostringtrue)
     - [aeroflow().toString(@string)](#tostring-aeroflowtostringstring)
     - [aeroflow().toString(@string, true)](#tostring-aeroflowtostringstring-true)
<a name=""></a>
 
<a name="average"></a>
# average
Is instance method.

```js
assert.isFunction(aeroflow.empty.average);
```

<a name="average-aeroflowaverage"></a>
## aeroflow().average()
Returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
```

Emits nothing from empty flow.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.average().run(fail, done);
}));
```

Emits @value from flow emitting single numeric @value.

```js
var value = 42,
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).average().run(done, fail);
}), expectation);
```

Emits NaN from flow emitting single non-numeric @value.

```js
var value = 'test';
return assert.eventually.isNaN(new Promise(function (done, fail) {
  return aeroflow(value).average().run(done, fail);
}));
```

Emits average from @values from flow emitting several numeric @values.

```js
var values = [1, 3, 2],
    expectation = values.reduce(function (sum, value) {
  return sum + value;
}, 0) / values.length;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).average().run(done, fail);
}), expectation);
```

Emits NaN from @values from flow emitting several non-numeric @values.

```js
var values = ['a', 'b'];
return assert.eventually.isNaN(new Promise(function (done, fail) {
  return aeroflow(values).average().run(done, fail);
}));
```

<a name="catch"></a>
# catch
Is instance method.

```js
return assert.isFunction(aeroflow.empty.catch);
```

<a name="catch-aeroflowcatch"></a>
## aeroflow().catch()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.catch(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.catch().run(fail, done);
}));
```

Supresses error emitted by flow.

```js
return assert.eventually.isBoolean(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).catch().run(fail, done);
}));
```

<a name="catch-aeroflowcatchalternativefunction"></a>
## aeroflow().catch(@alternative:function)
Does not call @alternative when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.catch(fail).run(fail, done);
}));
```

Does not call @alternative when flow does not emit error.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(1).catch(fail).run(done, fail);
}));
```

Calls @alternative when flow emits error.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(new Error('tests')).catch(done).run(fail, fail);
}));
```

Emits value returned by @alternative when flow emits error.

```js
var alternative = 'caught';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).catch(function () {
    return alternative;
  }).run(done, fail);
}), alternative);
```

<a name="catch-aeroflowcatchalternativefunction"></a>
## aeroflow().catch(@alternative:!function)
Emits @alternative value when flow emits error.

```js
var alternative = 'caught';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).catch(alternative).run(done, fail);
}), alternative);
```

<a name="count"></a>
# count
Is instance method.

```js
assert.isFunction(aeroflow.empty.count);
```

<a name="count-aeroflowcount"></a>
## aeroflow().count()
Returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
```

Emits 0 from empty flow.

```js
var expectation = 0;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.count().run(done, fail);
}), expectation);
```

Emits 1 from flow emitting single value.

```js
var expectation = 1;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).count().run(done, fail);
}), expectation);
```

Emits number of @values from flow emitting several @values.

```js
var values = [1, 2, 3],
    expectation = values.length;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).count().run(done, fail);
}), expectation);
```

<a name="filter"></a>
# filter
Is instance method.

```js
return assert.isFunction(aeroflow.empty.filter);
```

<a name="filter-aeroflowfilter"></a>
## aeroflow().filter()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.filter(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.filter().run(fail, done);
}));
```

Emits only truthy values.

```js
var values = [false, true, 0, 1, undefined, null, 'test'],
    expectation = values.filter(function (value) {
  return value;
});
assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).filter().toArray().run(done, fail);
}), expectation);
```

<a name="filter-aeroflowfilterconditionfunction"></a>
## aeroflow().filter(@condition:function)
Does not call @condition when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.filter(fail).run(fail, done);
}));
```

Calls @condition when flow is not empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').filter(done).run(fail, fail);
}));
```

Passes value emitted by flow to @condition as first argument.

```js
var value = 'test';
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).filter(done).run(fail, fail);
}), value);
```

Passes zero-based index of iteration to @condition as second argument.

```js
var values = [1, 2, 3, 4],
    expectation = values.length - 1;
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(values).filter(function (_, index) {
    if (index === expectation) done();
  }).run(fail, fail);
}));
```

Passes context data to @condition as third argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').filter(function (_, __, data) {
    return done(data);
  }).run(fail, fail, data);
}), data);
```

Emits only values passing @condition test.

```js
var values = [0, 1, 2, 3],
    condition = function condition(value) {
  return value > 1;
},
    expectation = values.filter(condition);
assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).filter(condition).toArray().run(done, fail);
}), expectation);
```

<a name="filter-aeroflowfilterconditionregex"></a>
## aeroflow().filter(@condition:regex)
Emits only values passing @condition test.

```js
var values = ['a', 'b', 'aa', 'bb'],
    condition = /a/,
    expectation = values.filter(function (value) {
  return condition.test(value);
});
assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).filter(condition).toArray().run(done, fail);
}), expectation);
```

<a name="filter-aeroflowfilterconditionfunctionregex"></a>
## aeroflow().filter(@condition:!function!regex)
Emits only values equal to @condition.

```js
var values = [1, 2, 3],
    condition = 2,
    expectation = values.filter(function (value) {
  return value === condition;
});
assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).filter(condition).toArray().run(done, fail);
}), expectation);
```

<a name="max"></a>
# max
Is instance method.

```js
assert.isFunction(aeroflow.empty.max);
```

<a name="max-aeroflowmax"></a>
## aeroflow().max()
Returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
```

Emits nothing from empty flow.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.max().run(fail, done);
}));
```

Emits @value from flow emitting single numeric @value.

```js
var value = 42,
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).max().run(done, fail);
}), expectation);
```

Emits @value from flow emitting single non-numeric @value.

```js
var value = 'test',
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).max().run(done, fail);
}), expectation);
```

Emits maximum of @values from flow emitting several numeric @values.

```js
var _Math;
var values = [1, 3, 2],
    expectation = (_Math = Math).max.apply(_Math, values);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).max().run(done, fail);
}), expectation);
```

Emits maximum of @values from flow emitting several non-numeric @values.

```js
var values = ['a', 'c', 'b'],
    expectation = values.reduce(function (max, value) {
  return value > max ? value : max;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).max().run(done, fail);
}), expectation);
```

<a name="min"></a>
# min
Is instance method.

```js
assert.isFunction(aeroflow.empty.min);
```

<a name="min-aeroflowmin"></a>
## aeroflow().min()
Returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
```

Emits nothing from empty flow.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.min().run(fail, done);
}));
```

Emits @value from flow emitting single @value.

```js
var value = 42,
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).min().run(done, fail);
}), expectation);
```

Emits @value from flow emitting single non-numeric @value.

```js
var value = 'test',
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).min().run(done, fail);
}), expectation);
```

Emits minimum of @values from flow emitting several numeric @values.

```js
var _Math2;
var values = [1, 3, 2],
    expectation = (_Math2 = Math).min.apply(_Math2, values);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).min().run(done, fail);
}), expectation);
```

Emits minimum of @values from flow emitting several non-numeric @values.

```js
var values = ['a', 'c', 'b'],
    expectation = values.reduce(function (min, value) {
  return value < min ? value : min;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).min().run(done, fail);
}), expectation);
```

<a name="reduce"></a>
# reduce
Is instance method.

```js
return assert.isFunction(aeroflow.empty.reduce);
```

<a name="reduce-aeroflowreduce"></a>
## aeroflow().reduce()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reduce().run(fail, done);
}));
```

Emits nothing when flow is not empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').reduce().run(fail, done);
}));
```

<a name="reduce-aeroflowreducereducerfunction"></a>
## aeroflow().reduce(@reducer:function)
Does not call @reducer when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(fail).run(fail, done);
}));
```

Does not call @reducer when flow emits single value.

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

Emits error thrown by @reducer.

```js
var error = new Error('test');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(function () {
    throw error;
  }).run(fail, done);
}), error);
```

Emits value emitted by flow when flow emits single value.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).reduce(function () {
    return 'test';
  }).run(done, fail);
}), value);
```

Emits value returned by @reducer when flow emits several values.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2, 3).reduce(function () {
    return value;
  }).run(done, fail);
}), value);
```

Passes first and second values emitted by flow to @reducer as first and second arguments on first iteration.

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

Passes zero-based index of iteration to @reducer as third argument.

```js
var values = [1, 2, 3, 4],
    expectation = values.length - 2;
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(values).reduce(function (_, __, index) {
    if (index === expectation) done();
  }).run(fail, fail);
}));
```

Passes context data to @reducer as forth argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(function (_, __, ___, data) {
    return done(data);
  }).run(fail, fail, data);
}), data);
```

<a name="reduce-aeroflowreducereducerfunction-seedany"></a>
## aeroflow().reduce(@reducer:function, @seed:any)
Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(function () {}, 42).run(fail, done);
}));
```

Passes @seed to @reducer as first argument on first iteration.

```js
var seed = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').reduce(done, seed).run(fail, fail);
}), seed);
```

<a name="reduce-aeroflowreducereducerfunction-seedany-true"></a>
## aeroflow().reduce(@reducer:function, @seed:any, true)
Emits @seed when flow is empty.

```js
var seed = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(function () {}, seed, true).run(done, fail);
}), seed);
```

<a name="reduce-aeroflowreduceseedfunction"></a>
## aeroflow().reduce(@seed:!function)
Emits @seed when flow is empty.

```js
var seed = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(seed).run(done, fail);
}), seed);
```

Emits @seed when flow is not empty.

```js
var seed = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(seed).run(done, fail);
}), seed);
```

<a name="toarray"></a>
# toArray
Is instance method.

```js
assert.isFunction(aeroflow.empty.toArray);
```

<a name="toarray-aeroflowtoarray"></a>
## aeroflow().toArray()
Returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toArray().run(fail, done);
}));
```

Emits array of @values when flow emits several @values.

```js
var values = [1, 2, 1, 3, 2, 3],
    expectation = values;
return assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).toArray().run(done, fail);
}), expectation);
```

<a name="toarray-aeroflowtoarraytrue"></a>
## aeroflow().toArray(true)
Emits an array when flow is empty.

```js
var expectation = 'Array';
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toArray(true).run(done, fail);
}), expectation);
```

Emits empty array from flow is empty.

```js
var expectation = 0;
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toArray(true).run(done, fail);
}), expectation);
```

<a name="toset"></a>
# toSet
Is instance method.

```js
assert.isFunction(aeroflow.empty.toSet);
```

<a name="toset-aeroflowtoset"></a>
## aeroflow().toSet()
Returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toSet().run(fail, done);
}));
```

Emits set of unique @values when flow emits several @values.

```js
var values = [1, 2, 1, 3, 2, 3],
    expectation = Array.from(new Set(values));
return assert.eventually.includeMembers(new Promise(function (done, fail) {
  return aeroflow(values).toSet().map(function (set) {
    return Array.from(set);
  }).run(done, fail);
}), expectation);
```

<a name="toset-aeroflowtosettrue"></a>
## aeroflow().toSet(true)
Emits a set when flow is empty.

```js
var expectation = 'Set';
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toSet(true).run(done, fail);
}), expectation);
```

Emits empty set when flow is empty.

```js
var expectation = 0;
return assert.eventually.propertyVal(new Promise(function (done, fail) {
  return aeroflow.empty.toSet(true).run(done, fail);
}), 'size', expectation);
```

<a name="tostring"></a>
# toString
Is instance method.

```js
assert.isFunction(aeroflow.empty.toString);
```

<a name="tostring-aeroflowtostring"></a>
## aeroflow().toString()
Returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toString().run(fail, done);
}));
```

Emits @string when flow emits single @string.

```js
var string = 'test',
    expectation = string;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(string).toString().run(done, fail);
}), expectation);
```

Emits @number converted to string when flow emits single @number.

```js
var number = 42,
    expectation = '' + number;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(number).toString().run(done, fail);
}), expectation);
```

Emits @strings concatenated via "," separator when flow emits several @strings.

```js
var strings = ['a', 'b'],
    expectation = strings.join(',');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(strings).toString().run(done, fail);
}), expectation);
```

Emits @numbers converted to strings and concatenated via "," separator when flow emits several @numbers.

```js
var numbers = [100, 500],
    expectation = numbers.join(',');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(numbers).toString().run(done, fail);
}), expectation);
```

<a name="tostring-aeroflowtostringtrue"></a>
## aeroflow().toString(true)
Emits string when flow empty.

```js
var expectation = 'String';
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(true).run(done, fail);
}), expectation);
```

Emits empty string when flow is empty.

```js
var expectation = 0;
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(true).run(done, fail);
}), expectation);
```

<a name="tostring-aeroflowtostringstring"></a>
## aeroflow().toString(@string)
Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toString(';').run(fail, done);
}));
```

Emits @strings concatenated via @string separator when flow emits several @strings.

```js
var separator = ';',
    strings = ['a', 'b'],
    expectation = strings.join(separator);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(strings).toString(separator).run(done, fail);
}), expectation);
```

<a name="tostring-aeroflowtostringstring-true"></a>
## aeroflow().toString(@string, true)
Emits empty string when flow is empty.

```js
var delimiter = ';',
    expectation = 0;
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(delimiter, true).run(done, fail);
}), expectation);
```

