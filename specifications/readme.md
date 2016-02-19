# TOC
   - [aeroflow](#aeroflow)
     - [()](#aeroflow-)
     - [(@source:aeroflow)](#aeroflow-sourceaeroflow)
     - [(@source:array)](#aeroflow-sourcearray)
     - [(@source:date)](#aeroflow-sourcedate)
     - [(@source:error)](#aeroflow-sourceerror)
     - [(@source:function)](#aeroflow-sourcefunction)
     - [(@source:iterable)](#aeroflow-sourceiterable)
     - [(@source:null)](#aeroflow-sourcenull)
     - [(@source:promise)](#aeroflow-sourcepromise)
     - [(@source:string)](#aeroflow-sourcestring)
     - [(@source:undefined)](#aeroflow-sourceundefined)
     - [.empty](#aeroflow-empty)
     - [.expand](#aeroflow-expand)
       - [()](#aeroflow-expand-)
       - [(@expander:function)](#aeroflow-expand-expanderfunction)
       - [(@expander:function, @seed:any)](#aeroflow-expand-expanderfunction-seedany)
     - [.just](#aeroflow-just)
       - [()](#aeroflow-just-)
       - [(@value:array)](#aeroflow-just-valuearray)
       - [(@value:iterable)](#aeroflow-just-valueiterable)
     - [#average](#aeroflow-average)
       - [()](#aeroflow-average-)
     - [#catch](#aeroflow-catch)
       - [()](#aeroflow-catch-)
       - [(@alternate:function)](#aeroflow-catch-alternatefunction)
       - [(@alternate:!function)](#aeroflow-catch-alternatefunction)
     - [#coalesce](#aeroflow-coalesce)
       - [()](#aeroflow-coalesce-)
       - [(@alternate:function)](#aeroflow-coalesce-alternatefunction)
       - [(@alternate:!function)](#aeroflow-coalesce-alternatefunction)
     - [#count](#aeroflow-count)
       - [()](#aeroflow-count-)
     - [#distinct](#aeroflow-distinct)
       - [()](#aeroflow-distinct-)
       - [(true)](#aeroflow-distinct-true)
     - [#every](#aeroflow-every)
       - [()](#aeroflow-every-)
       - [(@condition:function)](#aeroflow-every-conditionfunction)
       - [(@condition:regex)](#aeroflow-every-conditionregex)
       - [(@condition:!function!regex)](#aeroflow-every-conditionfunctionregex)
     - [#filter](#aeroflow-filter)
       - [()](#aeroflow-filter-)
       - [(@condition:function)](#aeroflow-filter-conditionfunction)
       - [(@condition:regex)](#aeroflow-filter-conditionregex)
       - [(@condition:!function!regex)](#aeroflow-filter-conditionfunctionregex)
     - [#group](#aeroflow-group)
       - [()](#aeroflow-group-)
       - [(@selector:function)](#aeroflow-group-selectorfunction)
       - [(@selectors:array)](#aeroflow-group-selectorsarray)
     - [#map](#aeroflow-map)
       - [()](#aeroflow-map-)
       - [(@mapping:function)](#aeroflow-map-mappingfunction)
       - [(@mapping:!function)](#aeroflow-map-mappingfunction)
     - [#max](#aeroflow-max)
       - [()](#aeroflow-max-)
     - [#mean](#aeroflow-mean)
       - [()](#aeroflow-mean-)
     - [#min](#aeroflow-min)
       - [()](#aeroflow-min-)
     - [#reduce](#aeroflow-reduce)
       - [()](#aeroflow-reduce-)
       - [(@reducer:function)](#aeroflow-reduce-reducerfunction)
       - [(@reducer:function, @seed)](#aeroflow-reduce-reducerfunction-seed)
       - [(@reducer:!function)](#aeroflow-reduce-reducerfunction)
     - [#reverse](#aeroflow-reverse)
       - [()](#aeroflow-reverse-)
     - [#skip](#aeroflow-skip)
       - [()](#aeroflow-skip-)
       - [(@condition:function)](#aeroflow-skip-conditionfunction)
       - [(@condition:number)](#aeroflow-skip-conditionnumber)
       - [(@condition:!function!number)](#aeroflow-skip-conditionfunctionnumber)
     - [#slice](#aeroflow-slice)
       - [()](#aeroflow-slice-)
       - [(@start:number)](#aeroflow-slice-startnumber)
       - [(@start:!number)](#aeroflow-slice-startnumber)
       - [(@start:number, @end:number)](#aeroflow-slice-startnumber-endnumber)
       - [(@start:number, @end:!number)](#aeroflow-slice-startnumber-endnumber)
     - [#some](#aeroflow-some)
       - [()](#aeroflow-some-)
       - [(@condition:function)](#aeroflow-some-conditionfunction)
       - [(@condition:regex)](#aeroflow-some-conditionregex)
       - [(@condition:!function!regex)](#aeroflow-some-conditionfunctionregex)
     - [#sort](#aeroflow-sort)
       - [()](#aeroflow-sort-)
       - [(@comparer:string)](#aeroflow-sort-comparerstring)
       - [(@comparer:boolean)](#aeroflow-sort-comparerboolean)
       - [(@comparer:number)](#aeroflow-sort-comparernumber)
       - [(@comparer:function)](#aeroflow-sort-comparerfunction)
       - [(@comparers:array)](#aeroflow-sort-comparersarray)
     - [#sum](#aeroflow-sum)
       - [()](#aeroflow-sum-)
     - [#take](#aeroflow-take)
       - [()](#aeroflow-take-)
       - [(@condition:function)](#aeroflow-take-conditionfunction)
       - [(@condition:number)](#aeroflow-take-conditionnumber)
       - [(@condition:!function!number)](#aeroflow-take-conditionfunctionnumber)
     - [#tap](#aeroflow-tap)
       - [()](#aeroflow-tap-)
       - [(@callback:function)](#aeroflow-tap-callbackfunction)
       - [(@callback:!function)](#aeroflow-tap-callbackfunction)
     - [#toArray](#aeroflow-toarray)
       - [()](#aeroflow-toarray-)
     - [#toMap](#aeroflow-tomap)
       - [()](#aeroflow-tomap-)
       - [(@keySelector:function)](#aeroflow-tomap-keyselectorfunction)
       - [(@keySelector:!function)](#aeroflow-tomap-keyselectorfunction)
     - [#toSet](#aeroflow-toset)
       - [()](#aeroflow-toset-)
     - [#toString](#aeroflow-tostring)
       - [()](#aeroflow-tostring-)
       - [(@seperator:string)](#aeroflow-tostring-seperatorstring)
<a name=""></a>
 
<a name="aeroflow"></a>
# aeroflow
Is function.

```js
return assert.isFunction(aeroflow);
```

<a name="aeroflow-"></a>
## ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow(), 'Aeroflow');
```

Returns empty flow emitting "done" notification argumented with "true".

```js
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow().run(fail, done);
}));
```

<a name="aeroflow-sourceaeroflow"></a>
## (@source:aeroflow)
Returns flow emitting "done" notification argumented with "true" when @source is empty.

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow(aeroflow.empty).run(noop, done);
}));
```

Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and enumerated till end.

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow(aeroflow([1, 2])).run(noop, done);
}));
```

Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but not enumerated till end.

```js
return assert.eventually.isFalse(new Promise(function (done) {
  return aeroflow(aeroflow([1, 2]).take(1)).run(noop, done);
}));
```

Returns flow not emitting "next" notification when @source is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(aeroflow.empty).run(fail, done);
}));
```

Returns flow emitting several "next" notifications argumented with each subsequent item of @source.

```js
var source = [1, 2],
    results = [];
assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(aeroflow(source)).run(function (result, index) {
    results.push(result);
    if (index === source.length - 1) done(results);
  }, fail);
}), source);
```

<a name="aeroflow-sourcearray"></a>
## (@source:array)
Returns flow emitting "done" notification argumented with "true" when @source is empty.

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow([]).run(noop, done);
}));
```

Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and enumerated till end.

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow([1, 2]).run(noop, done);
}));
```

Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but not enumerated till end.

```js
return assert.eventually.isFalse(new Promise(function (done) {
  return aeroflow([1, 2]).take(1).run(noop, done);
}));
```

Returns flow not emitting "next" notification when @source is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow([]).run(fail, done);
}));
```

Returns flow emitting several "next" notifications argumented with each subsequent item of @source.

```js
var source = [1, 2],
    results = [];
assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(source).run(function (result, index) {
    results.push(result);
    if (index === source.length - 1) done(results);
  }, fail);
}), source);
```

<a name="aeroflow-sourcedate"></a>
## (@source:date)
Returns flow eventually emitting "done" notification argumented with "true".

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow(noop).run(noop, done);
}));
```

Returns flow emitting "next" notification argumented with @source.

```js
var source = new Date();
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(source).run(done, fail);
}), source);
```

<a name="aeroflow-sourceerror"></a>
## (@source:error)
Returns flow not emitting "next" notification.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).run(fail, done);
}));
```

Returns flow emitting "done" notification argumented with @source.

```js
var source = new Error('test');
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(source).run(fail, done);
}), source);
```

<a name="aeroflow-sourcefunction"></a>
## (@source:function)
Calls @source and passes context data as first argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(function (context) {
    return done(context);
  }).run(fail, fail, data);
}), data);
```

Returns flow eventually emitting "done" notification argumented with "true".

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow(noop).run(noop, done);
}));
```

Returns flow emitting "done" notification argumented with error thrown by @source.

```js
var error = new Error('test');
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(function () {
    throw error;
  }).run(fail, done);
}), error);
```

Returns flow emitting "next" notification argumented with result of @source invocation.

```js
var result = 42;
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(function () {
    return result;
  }).run(done, fail);
}), result);
```

<a name="aeroflow-sourceiterable"></a>
## (@source:iterable)
Returns empty flow emitting "done" notification argumented with "true" when source is empty.

```js
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow(new Set()).run(fail, done);
}));
```

Returns flow eventually emitting "done" notification argumented with "true" when source is not empty.

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow(new Set([1, 2])).run(noop, done);
}));
```

Returns flow not emitting "next" notification when source is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(new Set()).run(fail, done);
}));
```

Returns flow emitting several "next" notifications argumented with each subsequent item of @source.

```js
var source = [1, 2],
    results = [];
assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(new Set(source)).run(function (result, index) {
    results.push(result);
    if (index === source.length - 1) done(results);
  }, fail);
}), source);
```

<a name="aeroflow-sourcenull"></a>
## (@source:null)
Returns flow eventually emitting "done" notification argumented with "true".

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow(noop).run(noop, done);
}));
```

Returns flow emitting "next" notification with @source.

```js
var source = null;
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(source).run(done, fail);
}), source);
```

<a name="aeroflow-sourcepromise"></a>
## (@source:promise)
Returns flow eventually emitting "done" notification argumented with "true" when @source resolves.

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow(Promise.resolve()).run(noop, done);
}));
```

Returns flow emitting "done" notification argumented with error rejected by @source.

```js
var error = new Error('test'),
    source = Promise.reject(error);
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(source).run(fail, done);
}), error);
```

Returns flow emitting "next" notification argumented with result resolved by @source.

```js
var result = 42,
    source = Promise.resolve(result);
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(source).run(done, fail);
}), result);
```

<a name="aeroflow-sourcestring"></a>
## (@source:string)
Returns flow eventually emitting "done" notification argumented with "true".

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow('test').run(noop, done);
}));
```

Returns flow emitting "next" notification argumented with @source.

```js
var source = 'test';
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(source).run(done, fail);
}), source);
```

<a name="aeroflow-sourceundefined"></a>
## (@source:undefined)
Returns flow eventually emitting "done" notification argumented with "true".

```js
return assert.eventually.isTrue(new Promise(function (done) {
  return aeroflow(noop).run(noop, done);
}));
```

Returns flow emitting "next" notification argumented with @source.

```js
var source = undefined;
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(source).run(done, fail);
}), source);
```

<a name="aeroflow-empty"></a>
## .empty
Is static property.

```js
return assert.isDefined(aeroflow.empty);
```

Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty, 'Aeroflow');
```

Returns instance of Aeroflow emitting "done" notification with "true".

```js
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.empty.run(fail, done);
}));
```

Returns instance of Aeroflow not emitting "next" notification.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.run(fail, done);
}));
```

<a name="aeroflow-expand"></a>
## .expand
Is static method.

```js
return assert.isFunction(aeroflow.expand);
```

<a name="aeroflow-expand-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.expand(), 'Aeroflow');
```

<a name="aeroflow-expand-expanderfunction"></a>
### (@expander:function)
Calls @expander.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.expand(done).take(1).run(fail, fail);
}));
```

Passes undefined to @expander as first argument when no seed is specified.

```js
return assert.eventually.isUndefined(new Promise(function (done, fail) {
  return aeroflow.expand(done).take(1).run(fail, fail);
}));
```

Passes value returned by @expander to @expander as first argument on sybsequent iteration.

```js
var expectation = {};
var iteration = 0;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.expand(function (value) {
    return iteration++ ? done(value) : expectation;
  }).take(2).run(noop, fail);
}), expectation);
```

Passes zero-based index of iteration to @expander as second argument.

```js
var indices = [],
    expectation = [0, 1, 2, 3];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow.expand(function (_, index) {
    return indices.push(index);
  }).take(expectation.length).run(noop, function () {
    return done(indices);
  });
}), expectation);
```

Passes context data to @expander as third argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.expand(function (_, __, context) {
    return done(context);
  }).take(1).run(fail, fail, data);
}), data);
```

Emits "next" notification with value returned by @expander.

```js
var value = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.expand(function () {
    return value;
  }).take(1).run(done, fail);
}), value);
```

<a name="aeroflow-expand-expanderfunction-seedany"></a>
### (@expander:function, @seed:any)
Passes @seed to @expander as first argument.

```js
var seed = 42,
    expectation = seed;
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.expand(done, seed).take(1).run(fail, fail);
}), expectation);
```

<a name="aeroflow-just"></a>
## .just
Is static method.

```js
return assert.isFunction(aeroflow.just);
```

<a name="aeroflow-just-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.just(), 'Aeroflow');
```

Returns instance of Aeroflow emitting "next" notification with undefined.

```js
var expectation = undefined;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.just().run(done, fail);
}), expectation);
```

<a name="aeroflow-just-valuearray"></a>
### (@value:array)
Returns instance of Aeroflow emitting "next" notification with @value.

```js
var array = [1, 2, 3],
    expectation = array;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.just(array).run(done, fail);
}), expectation);
```

<a name="aeroflow-just-valueiterable"></a>
### (@value:iterable)
Returns instance of Aeroflow emitting "next" notification with @value.

```js
var iterable = new Set([1, 2, 3]),
    expectation = iterable;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.just(iterable).run(done, fail);
}), expectation);
```

<a name="aeroflow-average"></a>
## #average
Is instance method.

```js
return assert.isFunction(aeroflow.empty.average);
```

<a name="aeroflow-average-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
```

Emits "done" notification only when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.average().run(fail, done);
}));
```

Emits "next" notification parameterized with @value when flow emits single numeric @value.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).average().run(done, fail);
}), value);
```

Emits "next" notification parameterized with NaN when flow emits single not numeric @value.

```js
return assert.eventually.isNaN(new Promise(function (done, fail) {
  return aeroflow('test').average().run(done, fail);
}));
```

Emits "next" notification parameterized with average of @values when flow emits several numeric @values.

```js
var values = [1, 3, 2],
    average = values.reduce(function (sum, value) {
  return sum + value;
}, 0) / values.length;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).average().run(done, fail);
}), average);
```

Emits "next" notification parameterized with NaN when flow emits several not numeric @values.

```js
return assert.eventually.isNaN(new Promise(function (done, fail) {
  return aeroflow('a', 'b').average().run(done, fail);
}));
```

<a name="aeroflow-catch"></a>
## #catch
Is instance method.

```js
return assert.isFunction(aeroflow.empty.catch);
```

<a name="aeroflow-catch-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.catch(), 'Aeroflow');
```

Emits "done" notification only when flow is empty.

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

<a name="aeroflow-catch-alternatefunction"></a>
### (@alternate:function)
Does not call @alternative when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.catch(fail).run(fail, done);
}));
```

Does not call @alternate when flow does not emit error.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').catch(fail).run(done, fail);
}));
```

Calls @alternate when flow emits error.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).catch(done).run(fail, fail);
}));
```

Emits "next" notification with value returned by @alternate when flow emits error.

```js
var alternate = 'alternate';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).catch(function () {
    return alternate;
  }).run(done, fail);
}), alternate);
```

<a name="aeroflow-catch-alternatefunction"></a>
### (@alternate:!function)
Emits "next" notification with @alternate value instead of error emitted by flow.

```js
var alternate = 'alternate';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).catch(alternate).run(done, fail);
}), alternate);
```

<a name="aeroflow-coalesce"></a>
## #coalesce
Is instance method.

```js
return assert.isFunction(aeroflow.empty.coalesce);
```

<a name="aeroflow-coalesce-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.coalesce(), 'Aeroflow');
```

Emits "done" notification only when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.coalesce().run(fail, done);
}));
```

<a name="aeroflow-coalesce-alternatefunction"></a>
### (@alternate:function)
Does not call @alternate when flow is not empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').coalesce(fail).run(done, fail);
}));
```

Does not call @alternate when flow emits error.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).coalesce(fail).run(fail, done);
}));
```

Emits "next" notification with value returned by @alternate when flow is empty.

```js
var alternate = 'alternate';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.coalesce(function () {
    return alternate;
  }).run(done, fail);
}), alternate);
```

<a name="aeroflow-coalesce-alternatefunction"></a>
### (@alternate:!function)
Emits "next" notification with @alternate value when flow is empty.

```js
var alternate = 'alternate';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.coalesce(alternate).run(done, fail);
}), alternate);
```

<a name="aeroflow-count"></a>
## #count
Is instance method.

```js
return assert.isFunction(aeroflow.empty.count);
```

<a name="aeroflow-count-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
```

Emits 0 when flow is empty.

```js
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.count().run(done, fail);
}), 0);
```

Emits 1 when flow emits single @value.

```js
var expectation = 1;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(expectation).count().run(done, fail);
}), expectation);
```

Emits number of @values emitted by flow when flow emits several @values.

```js
var values = [1, 2, 3],
    expectation = values.length;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).count().run(done, fail);
}), expectation);
```

<a name="aeroflow-distinct"></a>
## #distinct
Is instance method.

```js
return assert.isFunction(aeroflow.empty.distinct);
```

<a name="aeroflow-distinct-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.distinct(), 'Aeroflow');
```

Emits nothing ("done" event only) when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.distinct().run(fail, done);
}));
```

Emits unique of @values when flow emits several numeric @values.

```js
var values = [1, 1, 2, 2, 3],
    expectation = Array.from(new Set(values));
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).distinct().toArray().run(done, fail);
}), expectation);
```

Emits unique of @values when flow emits several string @values.

```js
var values = ['a', 'a', 'b', 'b', 'c'],
    expectation = Array.from(new Set(values));
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).distinct().toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-distinct-true"></a>
### (true)
Emits first @value of each sub-sequence of identical @values (distinct until changed).

```js
var values = [1, 1, 2, 2, 1, 1],
    expectation = [1, 2, 1];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).distinct(true).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-every"></a>
## #every
Is instance method.

```js
return assert.isFunction(aeroflow.empty.every);
```

<a name="aeroflow-every-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.every(), 'Aeroflow');
```

Emits "true" when flow is empty.

```js
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.empty.every().run(done, fail);
}));
```

Emits "true" when all @values emitted by flow are truthy.

```js
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow(true, 1).every().run(done, fail);
}));
```

Emits "false" when at least one @value emitted by flow is falsey.

```js
return assert.eventually.isFalse(new Promise(function (done, fail) {
  return aeroflow(true, 0).every().run(done, fail);
}));
```

Emits single result when flow emits several @values.

```js
var expectation = 1;
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2, 3).every().count().run(done, fail);
}), expectation);
```

<a name="aeroflow-every-conditionfunction"></a>
### (@condition:function)
Emits "true" when all @values emitted by flow pass @condition test.

```js
var values = [2, 4],
    condition = function condition(item) {
  return item % 2 === 0;
},
    expectation = values.every(condition);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).every(condition).run(done, fail);
}), expectation);
```

Emits "false" when at least one @value emitted by flow does not pass @condition test.

```js
var values = [1, 4],
    condition = function condition(item) {
  return item % 2 === 0;
},
    expectation = values.every(condition);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).every(condition).run(done, fail);
}), expectation);
```

<a name="aeroflow-every-conditionregex"></a>
### (@condition:regex)
Emits "true" when all @values emitted by flow pass @condition test.

```js
var values = ['a', 'aa'],
    condition = /a/,
    expectation = values.every(function (value) {
  return condition.test(value);
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).every(condition).run(done, fail);
}), expectation);
```

Emits "false" when at least one @value emitted by flow does not pass @condition test.

```js
var values = ['a', 'bb'],
    condition = /a/,
    expectation = values.every(function (value) {
  return condition.test(value);
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).every(condition).run(done, fail);
}), expectation);
```

<a name="aeroflow-every-conditionfunctionregex"></a>
### (@condition:!function!regex)
Emits "true" when all @values emitted by flow equal @condition.

```js
var values = [1, 1],
    condition = 1,
    expectation = values.every(function (value) {
  return value === condition;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).every(condition).run(done, fail);
}), expectation);
```

Emits "false" when at least one @value emitted by flow does not equal @condition.

```js
var values = [1, 2],
    condition = 2,
    expectation = values.every(function (value) {
  return value === condition;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).every(condition).run(done, fail);
}), expectation);
```

<a name="aeroflow-filter"></a>
## #filter
Is instance method.

```js
return assert.isFunction(aeroflow.empty.filter);
```

<a name="aeroflow-filter-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.filter(), 'Aeroflow');
```

Emits nothing ("done" event only) when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.filter().run(fail, done);
}));
```

Emits only truthy of @values emitted by flow.

```js
var values = [false, true, 0, 1, undefined, null, 'test'],
    expectation = values.filter(function (value) {
  return value;
});
assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).filter().toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-filter-conditionfunction"></a>
### (@condition:function)
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

Passes @value emitted by flow to @condition as first argument.

```js
var value = 'test';
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).filter(done).run(fail, fail);
}), value);
```

Passes zero-based @index of iteration to @condition as second argument.

```js
var values = [1, 2, 3, 4],
    expectation = values.length - 1;
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(values).filter(function (_, index) {
    if (index === expectation) done();
  }).run(fail, fail);
}));
```

Passes context @data to @condition as third argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').filter(function (_, __, data) {
    return done(data);
  }).run(fail, fail, data);
}), data);
```

Emits only @values emitted by flow and passing @condition test.

```js
var values = [0, 1, 2, 3],
    condition = function condition(value) {
  return value > 1;
},
    expectation = values.filter(condition);
assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).filter(condition).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-filter-conditionregex"></a>
### (@condition:regex)
Emits only @values emitted by flow and passing @condition test.

```js
var values = ['a', 'b', 'aa', 'bb'],
    condition = /a/,
    expectation = values.filter(function (value) {
  return condition.test(value);
});
assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).filter(condition).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-filter-conditionfunctionregex"></a>
### (@condition:!function!regex)
Emits only @values emitted by flow and equal to @condition.

```js
var values = [1, 2, 3],
    condition = 2,
    expectation = values.filter(function (value) {
  return value === condition;
});
assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).filter(condition).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-group"></a>
## #group
Is instance method.

```js
return assert.isFunction(aeroflow.empty.group);
```

<a name="aeroflow-group-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.group(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.group().run(fail, done);
}));
```

<a name="aeroflow-group-selectorfunction"></a>
### (@selector:function)
Does not call @selector when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.group(fail).run(fail, done);
}));
```

Calls @selector when flow emits several values.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(1, 2).group(done).run(fail, fail);
}));
```

Emits error thrown by @selector.

```js
var error = new Error('test');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).group(function () {
    throw error;
  }).run(fail, done);
}), error);
```

Passes context data to @selector as third argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').group(function (_, __, data) {
    return done(data);
  }).run(fail, fail, data);
}), data);
```

Passes zero-based @index of iteration to @condition as second argument.

```js
var values = [1, 2, 3, 4],
    expectation = values.length - 1;
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(values).group(function (_, index) {
    if (index === expectation) done();
  }).run(fail, fail);
}));
```

Emits @values divided into groups by result of @selector.

```js
var values = [-1, 6, -3, 4],
    expectation = [[-1, -3], [6, 4]];
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  return aeroflow(values).group(function (value) {
    return value >= 0;
  }).map(function (group) {
    return group[1];
  }).toArray().run(done, fail);
}), expectation);
```

Emits @values divided into named groups by result of @selector.

```js
var values = [-1, 6, -3, 4],
    positive = 'positive',
    negative = 'positive';
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  return aeroflow(values).group(function (value) {
    return value >= 0 ? positive : negative;
  }).map(function (group) {
    return group[0];
  }).toArray().run(done, fail);
}), [positive, negative]);
```

<a name="aeroflow-group-selectorsarray"></a>
### (@selectors:array)
Emits nested named groups which divide @values by first predicate from @selectors.

```js
var values = [{ name: 'test1', sex: 'female' }, { name: 'test2', sex: 'male' }],
    expectation = [values[0].name, values[1].name],
    selectors = [function (value) {
  return value.name;
}, function (value) {
  return value.sex;
}];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  var _aeroflow;
  return (_aeroflow = aeroflow(values)).group.apply(_aeroflow, selectors).map(function (group) {
    return group[0];
  }).toArray().run(done, fail);
}), expectation);
```

Use maps to contain nested groups which divided @values by @selectors.

```js
var values = [{ name: 'test1', sex: 'female' }, { name: 'test2', sex: 'male' }],
    selectors = [function (value) {
  return value.name;
}, function (value) {
  return value.sex;
}];
return assert.eventually.typeOf(new Promise(function (done, fail) {
  var _aeroflow2;
  return (_aeroflow2 = aeroflow(values)).group.apply(_aeroflow2, selectors).toArray().map(function (group) {
    return group[0][1];
  }).run(done, fail);
}), 'Map');
```

Emits nested named groups which divide @values by second predicate from @selectors.

```js
var values = [{ name: 'test1', sex: 'female' }, { name: 'test2', sex: 'male' }],
    expectation = [[values[0].sex], [values[1].sex]],
    selectors = [function (value) {
  return value.name;
}, function (value) {
  return value.sex;
}];
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  var _aeroflow3;
  return (_aeroflow3 = aeroflow(values)).group.apply(_aeroflow3, selectors).map(function (group) {
    return Array.from(group[1].keys());
  }).toArray().run(done, fail);
}), expectation);
```

Emits @values on the root of nested groups.

```js
var values = [{ name: 'test1', sex: 'female' }, { name: 'test2', sex: 'male' }],
    selectors = [function (value) {
  return value.name;
}, function (value) {
  return value.sex;
}];
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  var _aeroflow4;
  return (_aeroflow4 = aeroflow(values)).group.apply(_aeroflow4, selectors).map(function (group) {
    return Array.from(group[1].values())[0][0];
  }).toArray().run(done, fail);
}), values);
```

<a name="aeroflow-map"></a>
## #map
Is instance method.

```js
return assert.isFunction(aeroflow.empty.map);
```

<a name="aeroflow-map-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.map(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.map().run(fail, done);
}));
```

Emits same @values when no arguments passed.

```js
var values = [1, 2];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).map().toArray().run(done, fail);
}), values);
```

<a name="aeroflow-map-mappingfunction"></a>
### (@mapping:function)
Does not call @mapping when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.map(fail).run(fail, done);
}));
```

Calls @mapping when flow emits several values.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(1, 2).map(done).run(fail, fail);
}));
```

Emits error thrown by @mapping.

```js
var error = new Error('test');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).map(function () {
    throw error;
  }).run(fail, done);
}), error);
```

Emits @values processed through @mapping.

```js
var values = [1, 2, 3],
    mapping = function mapping(item) {
  return item * 2;
},
    expectation = values.map(mapping);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).map(mapping).toArray().run(done, fail);
}), expectation);
```

Passes context data to @mapping as third argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').map(function (_, __, data) {
    return done(data);
  }).run(fail, fail, data);
}), data);
```

<a name="aeroflow-map-mappingfunction"></a>
### (@mapping:!function)
Emits @mapping value instead of every value in @values.

```js
var values = [1, 2],
    mapping = 'a',
    expectation = [mapping, mapping];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).map(mapping).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-max"></a>
## #max
Is instance method.

```js
assert.isFunction(aeroflow.empty.max);
```

<a name="aeroflow-max-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
```

Emits nothing ("done" event only) when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.max().run(fail, done);
}));
```

Emits @value when flow emits single numeric @value.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).max().run(done, fail);
}), value);
```

Emits @value when flow emits single string @value.

```js
var value = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).max().run(done, fail);
}), value);
```

Emits maximum of @values when flow emits several numeric @values.

```js
var _Math;
var values = [1, 3, 2],
    expectation = (_Math = Math).max.apply(_Math, values);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).max().run(done, fail);
}), expectation);
```

Emits maximum of @values when flow emits several string @values.

```js
var values = ['a', 'c', 'b'],
    expectation = values.reduce(function (max, value) {
  return value > max ? value : max;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).max().run(done, fail);
}), expectation);
```

<a name="aeroflow-mean"></a>
## #mean
Is instance method.

```js
return assert.isFunction(aeroflow.empty.mean);
```

<a name="aeroflow-mean-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.mean(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.mean().run(fail, done);
}));
```

Emits @value from flow emitting single numeric @value.

```js
var value = 42,
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).mean().run(done, fail);
}), expectation);
```

Emits mean value of @values from flow emitting several numeric @values.

```js
var values = [1, 3, 4, 5],
    expectation = 4;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).mean().run(done, fail);
}), expectation);
```

Emits @value from flow emitting single non-numeric @value.

```js
var value = 'a',
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).mean().run(done, fail);
}), expectation);
```

Emits mean value of @values from flow emitting several numeric @values.

```js
var values = ['a', 'd', 'f', 'm'],
    expectation = 'f';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).mean().run(done, fail);
}), expectation);
```

<a name="aeroflow-min"></a>
## #min
Is instance method.

```js
return assert.isFunction(aeroflow.empty.min);
```

<a name="aeroflow-min-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
```

Emits nothing ("done" event only) when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.min().run(fail, done);
}));
```

Emits @value when flow emits single numeric @value.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).min().run(done, fail);
}), value);
```

Emits @value when flow emits single string @value.

```js
var value = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).min().run(done, fail);
}), value);
```

Emits minimum of @values when flow emits several numeric @values.

```js
var _Math;
var values = [1, 3, 2],
    expectation = (_Math = Math).min.apply(_Math, values);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).min().run(done, fail);
}), expectation);
```

Emits minimum of @values when flow emits several string @values.

```js
var values = ['a', 'c', 'b'],
    expectation = values.reduce(function (min, value) {
  return value < min ? value : min;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).min().run(done, fail);
}), expectation);
```

<a name="aeroflow-reduce"></a>
## #reduce
Is instance method.

```js
return assert.isFunction(aeroflow.empty.reduce);
```

<a name="aeroflow-reduce-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow');
```

Emits nothing ("done" event only) when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reduce().run(fail, done);
}));
```

Emits first value emitted by flow when flow is not empty.

```js
var values = [1, 2];
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).reduce().run(done, fail);
}), values[0]);
```

<a name="aeroflow-reduce-reducerfunction"></a>
### (@reducer:function)
Does not call @reducer when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(fail).run(fail, done);
}));
```

Does not call @reducer when flow emits single @value.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(1).reduce(fail).run(done, fail);
}));
```

Calls @reducer when flow emits several v@alues.

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

Emits @value emitted by flow when flow emits single @value.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).reduce(function () {
    return 'test';
  }).run(done, fail);
}), value);
```

Emits @value returned by @reducer when flow emits several @values.

```js
var value = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2, 3).reduce(function () {
    return value;
  }).run(done, fail);
}), value);
```

Passes first and second @values emitted by flow to @reducer as first and second arguments on first iteration.

```js
var values = [1, 2];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).reduce(function (first, second) {
    return done([first, second]);
  }).run(fail, fail);
}), values);
```

Passes zero-based @index of iteration to @reducer as third argument.

```js
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(function (_, __, index) {
    return done(index);
  }).run(fail, fail);
}), 0);
```

Passes context @data to @reducer as forth argument.

```js
var expectation = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(function (_, __, ___, data) {
    return done(data);
  }).run(fail, fail, expectation);
}), expectation);
```

<a name="aeroflow-reduce-reducerfunction-seed"></a>
### (@reducer:function, @seed)
Emits @seed value when flow is empty.

```js
var seed = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(function () {}, seed).run(done, fail);
}), seed);
```

Passes @seed to @reducer as first argument on first iteration.

```js
var seed = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').reduce(done, seed).run(fail, fail);
}), seed);
```

<a name="aeroflow-reduce-reducerfunction"></a>
### (@reducer:!function)
Emits @reducer value when flow is empty.

```js
var reducer = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.reduce(reducer).run(done, fail);
}), reducer);
```

Emits @reducer value when flow is not empty.

```js
var reducer = 42;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).reduce(reducer).run(done, fail);
}), reducer);
```

<a name="aeroflow-reverse"></a>
## #reverse
Is instance method.

```js
return assert.isFunction(aeroflow.empty.reverse);
```

<a name="aeroflow-reverse-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.reverse(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.reverse().run(fail, done);
}));
```

Emits @value from flow emitting single numeric @value.

```js
var value = 42,
    expectation = value;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(value).reverse().run(done, fail);
}), expectation);
```

Emits reversed @values from flow emitting @values.

```js
var values = [1, 3],
    expectation = values.reverse();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).reverse().toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-skip"></a>
## #skip
Is instance method.

```js
return assert.isFunction(aeroflow.empty.skip);
```

<a name="aeroflow-skip-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.skip(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.skip().run(fail, done);
}));
```

Emits nothing when flow is not empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').skip().run(fail, done);
}));
```

<a name="aeroflow-skip-conditionfunction"></a>
### (@condition:function)
Emits @values until they not satisfies @condition .

```js
var values = [2, 4, 6, 3, 7],
    condition = function condition(value) {
  return value % 2 === 0;
},
    expectation = [3, 7];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).skip(condition).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-skip-conditionnumber"></a>
### (@condition:number)
Emits @values beginning with @condition position from the start.

```js
var values = [1, 2, 3],
    skip = 2,
    expectation = values.slice(skip);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).skip(skip).toArray().run(done, fail);
}), expectation);
```

Emits @values without @condition number of @values from the end.

```js
var values = [1, 2, 3],
    skip = 2,
    expectation = values.slice(0, values.length - skip);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).skip(-skip).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-skip-conditionfunctionnumber"></a>
### (@condition:!function!number)
Emits nothing when @condition is non-numeric.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').skip('test').run(fail, done);
}));
```

<a name="aeroflow-slice"></a>
## #slice
Is instance method.

```js
assert.isFunction(aeroflow.empty.slice);
```

<a name="aeroflow-slice-"></a>
### ()
Returns instance of Aeroflow.

```js
assert.typeOf(aeroflow.empty.slice(), 'Aeroflow');
```

Emits nothing ("done" event only) when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.slice().run(fail, done);
}));
```

Emits @values when flow emits several @values.

```js
var values = [1, 2];
assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).slice().toArray().run(done, fail);
}), values);
```

<a name="aeroflow-slice-startnumber"></a>
### (@start:number)
Emits @start number of @values from the start.

```js
var values = [1, 2, 3],
    slice = 2,
    expectation = values.slice(slice);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).slice(slice).toArray().run(done, fail);
}), expectation);
```

Emits @start number of @values from the end.

```js
var values = [1, 2, 3],
    slice = -2,
    expectation = values.slice(slice);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).slice(slice).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-slice-startnumber"></a>
### (@start:!number)
Emits @values when passed non-numerical @start.

```js
var values = [1, 2];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).slice('test').toArray().run(done, fail);
}), values);
```

<a name="aeroflow-slice-startnumber-endnumber"></a>
### (@start:number, @end:number)
Emits @values within @start and @end indexes from the start.

```js
var values = [1, 2, 3],
    slice = [1, 2],
    expectation = values.slice.apply(values, slice);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  var _aeroflow;
  return (_aeroflow = aeroflow(values)).slice.apply(_aeroflow, slice).toArray().run(done, fail);
}), expectation);
```

Emits @values within @start and @end indexes from the end.

```js
var values = [1, 2, 3],
    slice = [-2, -1],
    expectation = values.slice.apply(values, slice);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  var _aeroflow2;
  return (_aeroflow2 = aeroflow(values)).slice.apply(_aeroflow2, slice).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-slice-startnumber-endnumber"></a>
### (@start:number, @end:!number)
Emits @values from @start index till the end.

```js
var values = [1, 2],
    start = 1,
    expectation = values.slice(start);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).slice(start, 'test').toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-some"></a>
## #some
Is instance method.

```js
return assert.isFunction(aeroflow.empty.some);
```

<a name="aeroflow-some-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.some(), 'Aeroflow');
```

Emits "false" when flow is empty.

```js
return assert.eventually.isFalse(new Promise(function (done, fail) {
  return aeroflow.empty.some().run(done, fail);
}));
```

Emits "true" when at least one @value emitted by flow is truthy.

```js
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow(true, 0).some().run(done, fail);
}));
```

Emits "false" when all @value emitted by flow are falsey.

```js
return assert.eventually.isFalse(new Promise(function (done, fail) {
  return aeroflow(false, 0).some().run(done, fail);
}));
```

Emits single result when flow emits several values.

```js
var expectation = 1;
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2, 3).some().count().run(done, fail);
}), expectation);
```

<a name="aeroflow-some-conditionfunction"></a>
### (@condition:function)
Emits "true" when at least one @value emitted by flow passes @condition test.

```js
var values = [2, 1],
    condition = function condition(item) {
  return item % 2 === 0;
},
    expectation = values.some(condition);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).some(condition).run(done, fail);
}), expectation);
```

Emits "false" when no @values emitted by flow pass @condition test.

```js
var values = [3, 1],
    condition = function condition(item) {
  return item % 2 === 0;
},
    expectation = values.some(condition);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).some(condition).run(done, fail);
}), expectation);
```

<a name="aeroflow-some-conditionregex"></a>
### (@condition:regex)
Emits "true" when at least one @value emitted by flow passes @condition test.

```js
var values = ['a', 'b'],
    condition = /a/,
    expectation = values.some(function (value) {
  return condition.test(value);
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).some(condition).run(done, fail);
}), expectation);
```

Emits "false" when no @values emitted by flow pass @condition test.

```js
var values = ['a', 'b'],
    condition = /c/,
    expectation = values.some(function (value) {
  return condition.test(value);
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).some(condition).run(done, fail);
}), expectation);
```

<a name="aeroflow-some-conditionfunctionregex"></a>
### (@condition:!function!regex)
Emits "true" when at least one @value emitted by flow equals @condition.

```js
var values = [1, 2],
    condition = 1,
    expectation = values.some(function (value) {
  return value === condition;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).some(condition).run(done, fail);
}), expectation);
```

Emits "false" when no @values emitted by flow equal @condition.

```js
var values = [1, 2],
    condition = 3,
    expectation = values.some(function (value) {
  return value === condition;
});
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).some(condition).run(done, fail);
}), expectation);
```

<a name="aeroflow-sort"></a>
## #sort
Is instance method.

```js
return assert.isFunction(aeroflow.empty.sort);
```

<a name="aeroflow-sort-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.sort(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.sort().run(fail, done);
}));
```

Emits @values in ascending order when flow is not empty.

```js
var values = [6, 5, 3, 8],
    expectation = values.sort();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort().toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-sort-comparerstring"></a>
### (@comparer:string)
Emits @values in descending order when @comparer equal to desc.

```js
var values = ['a', 'c', 'f'],
    sort = 'desc',
    expectation = values.sort().reverse();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort(sort).toArray().run(done, fail);
}), expectation);
```

Emits @values in descending order when @comparer not equal to desc.

```js
var values = ['a', 'c', 'f'],
    sort = 'asc',
    expectation = values.sort();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort(sort).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-sort-comparerboolean"></a>
### (@comparer:boolean)
Emits @values in descending order when false passed.

```js
var values = [2, 7, 4],
    sort = false,
    expectation = values.sort().reverse();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort(sort).toArray().run(done, fail);
}), expectation);
```

Emits @values in descending order when true passed.

```js
var values = [4, 8, 1],
    sort = true,
    expectation = values.sort();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort(sort).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-sort-comparernumber"></a>
### (@comparer:number)
Emits @values in descending order when @comparer less than 0.

```js
var values = [2, 7, 4],
    sort = -1,
    expectation = values.sort().reverse();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort(sort).toArray().run(done, fail);
}), expectation);
```

Emits @values in descending order when @comparer greatest or equal to 0.

```js
var values = [4, 8, 1],
    sort = 1,
    expectation = values.sort();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort(sort).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-sort-comparerfunction"></a>
### (@comparer:function)
Emits @values sorted according by result of @comparer.

```js
var values = [4, 8, 1],
    comparer = function comparer(a, b) {
  return a - b;
},
    expectation = values.sort();
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort(comparer).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-sort-comparersarray"></a>
### (@comparers:array)
Emits @values sorted by applying @comparers in order.

```js
var values = [{ prop: 'test1' }, { prop: 'test2' }],
    comparers = [function (value) {
  return value.prop;
}, 'desc'],
    expectation = values.sort(function (value) {
  return value.prop;
}).reverse();
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  return aeroflow(values).sort(comparers).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-sum"></a>
## #sum
Is instance method.

```js
return assert.isFunction(aeroflow.empty.sum);
```

<a name="aeroflow-sum-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.sum(), 'Aeroflow');
```

Emits nothing ("done" event only) when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.sum().run(fail, done);
}));
```

Emits total sum of values when flow emits several numeric values.

```js
var values = [1, 3, 2],
    expectation = values.reduce(function (prev, curr) {
  return prev + curr;
}, 0);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).sum().run(done, fail);
}), expectation);
```

Emits NaN when flow emits single not numeric value.

```js
return assert.eventually.isNaN(new Promise(function (done, fail) {
  return aeroflow('q').sum().run(done, fail);
}));
```

Emits NaN when flow emits several not numeric values.

```js
return assert.eventually.isNaN(new Promise(function (done, fail) {
  return aeroflow('q', 'b').sum().run(done, fail);
}));
```

<a name="aeroflow-take"></a>
## #take
Is instance method.

```js
return assert.isFunction(aeroflow.empty.take);
```

<a name="aeroflow-take-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.take(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.take().run(fail, done);
}));
```

Emits nothing when flow is not empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').take().run(fail, done);
}));
```

<a name="aeroflow-take-conditionfunction"></a>
### (@condition:function)
Emits @values while they satisfies @condition .

```js
var values = [2, 4, 6, 3, 4],
    condition = function condition(value) {
  return value % 2 === 0;
},
    expectation = [2, 4, 6];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).take(condition).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-take-conditionnumber"></a>
### (@condition:number)
Emits @condition number of @values from the start.

```js
var values = [1, 2, 3],
    take = 2,
    expectation = values.slice(0, take);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).take(take).toArray().run(done, fail);
}), expectation);
```

Emits @condition number of @values from the end.

```js
var values = [1, 2, 3],
    take = -2,
    expectation = values.slice(take);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).take(take).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-take-conditionfunctionnumber"></a>
### (@condition:!function!number)
Emits all @values when @condition is non-numeric.

```js
var values = ['a', 'b', 'c'],
    take = 'a';
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).take(take).toArray().run(done, fail);
}), values);
```

<a name="aeroflow-tap"></a>
## #tap
Is instance method.

```js
return assert.isFunction(aeroflow.empty.tap);
```

<a name="aeroflow-tap-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.tap(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.tap().run(fail, done);
}));
```

<a name="aeroflow-tap-callbackfunction"></a>
### (@callback:function)
Does not call @callback when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.tap(fail).run(fail, done);
}));
```

Calls @callback when flow emits several values.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow(1, 2).tap(done).run(fail, fail);
}));
```

Emits error thrown by @callback.

```js
var error = new Error('test');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2).tap(function () {
    throw error;
  }).run(fail, done);
}), error);
```

Passes context data to @callback as third argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').tap(function (_, __, data) {
    return done(data);
  }).run(fail, fail, data);
}), data);
```

Emits immutable @values after tap @callback was applied.

```js
var values = [1, 2, 3];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).tap(function (item) {
    return item * 2;
  }).toArray().run(done, fail);
}), values);
```

<a name="aeroflow-tap-callbackfunction"></a>
### (@callback:!function)
Emits immutable @values after tap @callback was applied.

```js
var values = [1, 2, 3];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).tap(1).toArray().run(done, fail);
}), values);
```

<a name="aeroflow-toarray"></a>
## #toArray
Is instance method.

```js
return assert.isFunction(aeroflow.empty.toArray);
```

<a name="aeroflow-toarray-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow');
```

Emits "next" notification aergumented with array when flow is empty.

```js
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toArray(true).run(done, fail);
}), 'Array');
```

Emits "next" notification aergumented with empty array when flow is empty.

```js
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toArray(true).run(done, fail);
}), 0);
```

Emits array of @values when flow emits several @values.

```js
var values = [1, 2];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).toArray().run(done, fail);
}), values);
```

<a name="aeroflow-tomap"></a>
## #toMap
Is instance method.

```js
return assert.isFunction(aeroflow.empty.toMap);
```

<a name="aeroflow-tomap-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.toMap(), 'Aeroflow');
```

Emits "next" notification with map when flow is empty.

```js
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toMap(noop, noop, true).run(done, fail);
}), 'Map');
```

Emits "next" notification with empty map when flow is empty.

```js
return assert.eventually.propertyVal(new Promise(function (done, fail) {
  return aeroflow.empty.toMap(noop, noop, true).run(done, fail);
}), 'size', 0);
```

Emits map containing @values emitted by flow as keys.

```js
var values = [1, 2, 3];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).toMap().map(function (map) {
    return Array.from(map.keys());
  }).run(done, fail);
}), values);
```

Emits map containing @values emitted by flow as values.

```js
var values = [1, 2, 3];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).toMap().map(function (map) {
    return Array.from(map.values());
  }).run(done, fail);
}), values);
```

<a name="aeroflow-tomap-keyselectorfunction"></a>
### (@keySelector:function)
Emits map containing @keys returned by @keySelector.

```js
var values = [1, 2, 3],
    keyTransform = function keyTransform(key) {
  return key++;
},
    expectation = values.map(keyTransform);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).toMap(keyTransform).map(function (map) {
    return Array.from(map.keys());
  }).run(done, fail);
}), expectation);
```

Emits map containing values emitted by flow.

```js
var values = [1, 2, 3],
    keyTransform = function keyTransform(key) {
  return key++;
};
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).toMap(keyTransform).map(function (map) {
    return Array.from(map.values());
  }).run(done, fail);
}), values);
```

<a name="aeroflow-tomap-keyselectorfunction"></a>
### (@keySelector:!function)
Emits map containing single key.

```js
return assert.eventually.propertyVal(new Promise(function (done, fail) {
  return aeroflow(1, 2, 3).toMap('test').run(done, fail);
}), 'size', 1);
```

Emits map containing single key equal to @keySelector.

```js
var keySelector = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(1, 2, 3).toMap(keySelector).map(function (map) {
    return map.keys();
  }).flatten().run(done, fail);
}), keySelector);
```

Emits map containing single latest @value emitted by flow.

```js
var values = [1, 2, 3],
    expectation = values[values.length - 1];
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(values).toMap('test').map(function (map) {
    return map.values();
  }).flatten().run(done, fail);
}), expectation);
```

<a name="aeroflow-toset"></a>
## #toSet
Is instance method.

```js
assert.isFunction(aeroflow.empty.toSet);
```

<a name="aeroflow-toset-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow');
```

Emits "next" notification with set when flow is empty.

```js
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toSet(true).run(done, fail);
}), 'Set');
```

Emits "next" notification with empty set when flow is empty.

```js
return assert.eventually.propertyVal(new Promise(function (done, fail) {
  return aeroflow.empty.toSet(true).run(done, fail);
}), 'size', 0);
```

Emits "next" notification with set containing unique of @values when flow emits several @values.

```js
var values = [1, 2, 1, 3, 2, 3],
    expectation = Array.from(new Set(values));
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).toSet().map(function (set) {
    return Array.from(set);
  }).run(done, fail);
}), expectation);
```

<a name="aeroflow-tostring"></a>
## #toString
Is instance method.

```js
return assert.isFunction(aeroflow.empty.toString);
```

<a name="aeroflow-tostring-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
```

Emits "next" notification with string when flow is empty.

```js
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString().run(done, fail);
}), 'String');
```

Emits "next" notification with empty string when flow is empty.

```js
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString().run(done, fail);
}), 0);
```

Emits "next" notification with @string when flow emits single @string.

```js
var string = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(string).toString().run(done, fail);
}), string);
```

Emits "next" notification with @number converted to string when flow emits single @number.

```js
var number = 42,
    expectation = '' + number;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(number).toString().run(done, fail);
}), expectation);
```

Emits "next" notification with @strings concatenated via "," separator when flow emits several @strings.

```js
var strings = ['a', 'b'],
    expectation = strings.join(',');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(strings).toString().run(done, fail);
}), expectation);
```

Emits "next" notification with @numbers converted to strings and concatenated via "," separator when flow emits several @numbers.

```js
var numbers = [100, 500],
    expectation = numbers.join(',');
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(numbers).toString().run(done, fail);
}), expectation);
```

<a name="aeroflow-tostring-seperatorstring"></a>
### (@seperator:string)
Emits "next" notification with @strings concatenated via @seperator when flow emits several @strings.

```js
var separator = ';',
    strings = ['a', 'b'],
    expectation = strings.join(separator);
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(strings).toString(separator).run(done, fail);
}), expectation);
```

