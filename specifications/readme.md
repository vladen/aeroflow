# TOC
   - [aeroflow](#aeroflow)
     - [aeroflow()](#aeroflow-aeroflow)
     - [aeroflow(@source:aeroflow)](#aeroflow-aeroflowsourceaeroflow)
     - [aeroflow(@source:array)](#aeroflow-aeroflowsourcearray)
     - [aeroflow(@source:date)](#aeroflow-aeroflowsourcedate)
     - [aeroflow(@source:error)](#aeroflow-aeroflowsourceerror)
     - [aeroflow(@source:function)](#aeroflow-aeroflowsourcefunction)
     - [aeroflow(@source:iterable)](#aeroflow-aeroflowsourceiterable)
     - [aeroflow(@source:null)](#aeroflow-aeroflowsourcenull)
     - [aeroflow(@source:promise)](#aeroflow-aeroflowsourcepromise)
     - [aeroflow(@source:string)](#aeroflow-aeroflowsourcestring)
     - [aeroflow(@source:undefined)](#aeroflow-aeroflowsourceundefined)
   - [static members](#static-members)
     - [empty](#static-members-empty)
     - [expand](#static-members-expand)
       - [expand()](#static-members-expand-expand)
       - [expand(@expander:function)](#static-members-expand-expandexpanderfunction)
       - [expand(@expander:function, @seed:any)](#static-members-expand-expandexpanderfunction-seedany)
     - [just](#static-members-just)
       - [just()](#static-members-just-just)
       - [just(@array)](#static-members-just-justarray)
       - [just(@iterable)](#static-members-just-justiterable)
   - [instance members](#instance-members)
     - [average](#instance-members-average)
       - [average()](#instance-members-average-average)
     - [catch](#instance-members-catch)
       - [catch()](#instance-members-catch-catch)
       - [catch(@alternate:function)](#instance-members-catch-catchalternatefunction)
       - [catch(@alternate:!function)](#instance-members-catch-catchalternatefunction)
     - [coalesce](#instance-members-coalesce)
       - [coalesce()](#instance-members-coalesce-coalesce)
       - [coalesce(@alternate:function)](#instance-members-coalesce-coalescealternatefunction)
       - [catch(@alternate:!function)](#instance-members-coalesce-catchalternatefunction)
     - [count](#instance-members-count)
       - [count()](#instance-members-count-count)
     - [distinct](#instance-members-distinct)
       - [distinct()](#instance-members-distinct-distinct)
       - [distinct(true)](#instance-members-distinct-distincttrue)
     - [every](#instance-members-every)
       - [every()](#instance-members-every-every)
       - [every(@condition:function)](#instance-members-every-everyconditionfunction)
       - [every(@condition:regex)](#instance-members-every-everyconditionregex)
       - [every(@condition:!function!regex)](#instance-members-every-everyconditionfunctionregex)
     - [filter](#instance-members-filter)
       - [filter()](#instance-members-filter-filter)
       - [filter(@condition:function)](#instance-members-filter-filterconditionfunction)
       - [filter(@condition:regex)](#instance-members-filter-filterconditionregex)
       - [filter(@condition:!function!regex)](#instance-members-filter-filterconditionfunctionregex)
     - [max](#instance-members-max)
       - [max()](#instance-members-max-max)
     - [min](#instance-members-min)
       - [min()](#instance-members-min-min)
     - [reduce](#instance-members-reduce)
       - [reduce()](#instance-members-reduce-reduce)
       - [reduce(@reducer:function)](#instance-members-reduce-reducereducerfunction)
       - [reduce(@reducer:function, @seed)](#instance-members-reduce-reducereducerfunction-seed)
       - [reduce(@reducer:!function)](#instance-members-reduce-reducereducerfunction)
     - [some](#instance-members-some)
       - [some()](#instance-members-some-some)
       - [every(@condition:function)](#instance-members-some-everyconditionfunction)
       - [some(@condition:regex)](#instance-members-some-someconditionregex)
       - [some(@condition:!function!regex)](#instance-members-some-someconditionfunctionregex)
     - [take](#instance-members-take)
       - [take()](#instance-members-take-take)
       - [take(@condition:function)](#instance-members-take-takeconditionfunction)
       - [take(@condition:number)](#instance-members-take-takeconditionnumber)
       - [take(@condition:!function!number)](#instance-members-take-takeconditionfunctionnumber)
     - [skip](#instance-members-skip)
       - [skip()](#instance-members-skip-skip)
       - [skip(@condition:function)](#instance-members-skip-skipconditionfunction)
       - [skip(@condition:number)](#instance-members-skip-skipconditionnumber)
       - [skip(@condition:!function!number)](#instance-members-skip-skipconditionfunctionnumber)
     - [sort](#instance-members-sort)
       - [sort()](#instance-members-sort-sort)
       - [sort(@comparer:string)](#instance-members-sort-sortcomparerstring)
       - [sort(@comparer:boolean)](#instance-members-sort-sortcomparerboolean)
       - [sort(@comparer:number)](#instance-members-sort-sortcomparernumber)
       - [sort(@comparer:function)](#instance-members-sort-sortcomparerfunction)
       - [sort(@comparers:array)](#instance-members-sort-sortcomparersarray)
     - [slice](#instance-members-slice)
       - [slice()](#instance-members-slice-slice)
       - [slice(@start:number)](#instance-members-slice-slicestartnumber)
       - [slice(@start:!number)](#instance-members-slice-slicestartnumber)
       - [slice(@start:number, @end:number)](#instance-members-slice-slicestartnumber-endnumber)
       - [slice(@start:number, @end:!number)](#instance-members-slice-slicestartnumber-endnumber)
     - [sum](#instance-members-sum)
       - [sum()](#instance-members-sum-sum)
     - [toString](#instance-members-tostring)
       - [toString()](#instance-members-tostring-tostring)
       - [toString(true)](#instance-members-tostring-tostringtrue)
       - [toString(@string)](#instance-members-tostring-tostringstring)
       - [toString(@string, true)](#instance-members-tostring-tostringstring-true)
     - [map](#instance-members-map)
       - [map()](#instance-members-map-map)
       - [map(@mapping:function)](#instance-members-map-mapmappingfunction)
       - [map(@mapping:!function)](#instance-members-map-mapmappingfunction)
     - [mean](#instance-members-mean)
       - [mean()](#instance-members-mean-mean)
     - [reverse](#instance-members-reverse)
       - [reverse()](#instance-members-reverse-reverse)
     - [tap](#instance-members-tap)
       - [tap()](#instance-members-tap-tap)
       - [tap(@callback:function)](#instance-members-tap-tapcallbackfunction)
       - [tap(@callback:!function)](#instance-members-tap-tapcallbackfunction)
     - [group](#instance-members-group)
       - [group()](#instance-members-group-group)
       - [group(@selector:function)](#instance-members-group-groupselectorfunction)
       - [group(@selectors:array)](#instance-members-group-groupselectorsarray)
<a name=""></a>
 
<a name="aeroflow"></a>
# aeroflow
Is a function.

```js
return assert.isFunction(aeroflow);
```

<a name="aeroflow-aeroflow"></a>
## aeroflow()
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

<a name="aeroflow-aeroflowsourceaeroflow"></a>
## aeroflow(@source:aeroflow)
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
    results.push(value);
    if (index === source.length - 1) done(results);
  }, fail);
}), source);
```

<a name="aeroflow-aeroflowsourcearray"></a>
## aeroflow(@source:array)
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
    results.push(value);
    if (index === source.length - 1) done(results);
  }, fail);
}), source);
```

<a name="aeroflow-aeroflowsourcedate"></a>
## aeroflow(@source:date)
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

<a name="aeroflow-aeroflowsourceerror"></a>
## aeroflow(@source:error)
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

<a name="aeroflow-aeroflowsourcefunction"></a>
## aeroflow(@source:function)
Calls @source and passes context data as first argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(function (data) {
    return done(data);
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

<a name="aeroflow-aeroflowsourceiterable"></a>
## aeroflow(@source:iterable)
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
    results.push(value);
    if (index === source.length - 1) done(results);
  }, fail);
}), source);
```

<a name="aeroflow-aeroflowsourcenull"></a>
## aeroflow(@source:null)
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

<a name="aeroflow-aeroflowsourcepromise"></a>
## aeroflow(@source:promise)
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

<a name="aeroflow-aeroflowsourcestring"></a>
## aeroflow(@source:string)
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

<a name="aeroflow-aeroflowsourceundefined"></a>
## aeroflow(@source:undefined)
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

<a name="static-members"></a>
# static members
<a name="static-members-empty"></a>
## empty
Is static property.

```js
return assert.isDefined(aeroflow.empty);
```

Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty, 'Aeroflow');
```

Returns empty instance of Aeroflow emitting nothing ("done" event only).

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.run(fail, done);
}));
```

<a name="static-members-expand"></a>
## expand
Is static method.

```js
return assert.isFunction(aeroflow.expand);
```

<a name="static-members-expand-expand"></a>
### expand()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.expand(), 'Aeroflow');
```

<a name="static-members-expand-expandexpanderfunction"></a>
### expand(@expander:function)
Calls @expander.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.expand(done).take(1).run(fail, fail);
}));
```

Passes undefined to @expander as first argument because no seed is specified.

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
  }).take(2).run(noop$1, fail);
}), expectation);
```

Passes zero-based index of iteration to @expander as second argument.

```js
var indices = [],
    expectation = [0, 1, 2, 3];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow.expand(function (_, index) {
    return indices.push(index);
  }).take(expectation.length).run(noop$1, function () {
    return done(indices);
  });
}), expectation);
```

Passes context data to @expander as third argument.

```js
var data = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.expand(function (_, __, data) {
    return done(data);
  }).take(1).run(fail, fail, data);
}), data);
```

Emits value returned by @expander.

```js
var expectation = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.expand(function () {
    return expectation;
  }).take(1).run(done, fail);
}), expectation);
```

<a name="static-members-expand-expandexpanderfunction-seedany"></a>
### expand(@expander:function, @seed:any)
Passes @seed to @expander as first argument.

```js
var seed = 42,
    expectation = seed;
assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.expand(done, seed).take(1).run(fail, fail);
}), expectation);
```

<a name="static-members-just"></a>
## just
Is static method.

```js
return assert.isFunction(aeroflow.just);
```

<a name="static-members-just-just"></a>
### just()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.just(), 'Aeroflow');
```

Returns instance of Aeroflow emitting single undefined value.

```js
var expectation = undefined;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.just().run(done, fail);
}), expectation);
```

<a name="static-members-just-justarray"></a>
### just(@array)
Returns instance of Aeroflow emitting @array as is.

```js
var array = [1, 2, 3],
    expectation = array;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.just(array).run(done, fail);
}), expectation);
```

<a name="static-members-just-justiterable"></a>
### just(@iterable)
Returns instance of Aeroflow emitting @iterable as is.

```js
var iterable = new Set([1, 2, 3]),
    expectation = iterable;
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.just(iterable).run(done, fail);
}), expectation);
```

<a name="instance-members"></a>
# instance members
<a name="instance-members-average"></a>
## average
Is instance method.

```js
return assert.isFunction(aeroflow.empty.average);
```

<a name="instance-members-average-average"></a>
### average()
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

<a name="instance-members-catch"></a>
## catch
Is instance method.

```js
return assert.isFunction(aeroflow.empty.catch);
```

<a name="instance-members-catch-catch"></a>
### catch()
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

<a name="instance-members-catch-catchalternatefunction"></a>
### catch(@alternate:function)
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

<a name="instance-members-catch-catchalternatefunction"></a>
### catch(@alternate:!function)
Emits "next" notification with @alternate value instead of error emitted by flow.

```js
var alternate = 'alternate';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(new Error('test')).catch(alternate).run(done, fail);
}), alternate);
```

<a name="instance-members-coalesce"></a>
## coalesce
Is instance method.

```js
return assert.isFunction(aeroflow.empty.coalesce);
```

<a name="instance-members-coalesce-coalesce"></a>
### coalesce()
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

<a name="instance-members-coalesce-coalescealternatefunction"></a>
### coalesce(@alternate:function)
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

<a name="instance-members-coalesce-catchalternatefunction"></a>
### catch(@alternate:!function)
Emits "next" notification with @alternate value when flow is empty.

```js
var alternate = 'alternate';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.empty.coalesce(alternate).run(done, fail);
}), alternate);
```

<a name="instance-members-count"></a>
## count
Is instance method.

```js
return assert.isFunction(aeroflow.empty.count);
```

<a name="instance-members-count-count"></a>
### count()
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

<a name="instance-members-distinct"></a>
## distinct
Is instance method.

```js
return assert.isFunction(aeroflow.empty.distinct);
```

<a name="instance-members-distinct-distinct"></a>
### distinct()
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

<a name="instance-members-distinct-distincttrue"></a>
### distinct(true)
Emits first @value of each sub-sequence of identical @values (distinct until changed).

```js
var values = [1, 1, 2, 2, 1, 1],
    expectation = [1, 2, 1];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).distinct(true).toArray().run(done, fail);
}), expectation);
```

<a name="instance-members-every"></a>
## every
Is instance method.

```js
return assert.isFunction(aeroflow.empty.every);
```

<a name="instance-members-every-every"></a>
### every()
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

<a name="instance-members-every-everyconditionfunction"></a>
### every(@condition:function)
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

<a name="instance-members-every-everyconditionregex"></a>
### every(@condition:regex)
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

<a name="instance-members-every-everyconditionfunctionregex"></a>
### every(@condition:!function!regex)
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

<a name="instance-members-filter"></a>
## filter
Is instance method.

```js
return assert.isFunction(aeroflow.empty.filter);
```

<a name="instance-members-filter-filter"></a>
### filter()
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

<a name="instance-members-filter-filterconditionfunction"></a>
### filter(@condition:function)
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

<a name="instance-members-filter-filterconditionregex"></a>
### filter(@condition:regex)
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

<a name="instance-members-filter-filterconditionfunctionregex"></a>
### filter(@condition:!function!regex)
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

<a name="instance-members-max"></a>
## max
Is instance method.

```js
assert.isFunction(aeroflow.empty.max);
```

<a name="instance-members-max-max"></a>
### max()
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

<a name="instance-members-min"></a>
## min
Is instance method.

```js
return assert.isFunction(aeroflow.empty.min);
```

<a name="instance-members-min-min"></a>
### min()
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
var _Math2;
var values = [1, 3, 2],
    expectation = (_Math2 = Math).min.apply(_Math2, values);
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

<a name="instance-members-reduce"></a>
## reduce
Is instance method.

```js
return assert.isFunction(aeroflow.empty.reduce);
```

<a name="instance-members-reduce-reduce"></a>
### reduce()
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

<a name="instance-members-reduce-reducereducerfunction"></a>
### reduce(@reducer:function)
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

<a name="instance-members-reduce-reducereducerfunction-seed"></a>
### reduce(@reducer:function, @seed)
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

<a name="instance-members-reduce-reducereducerfunction"></a>
### reduce(@reducer:!function)
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

<a name="instance-members-some"></a>
## some
Is instance method.

```js
return assert.isFunction(aeroflow.empty.some);
```

<a name="instance-members-some-some"></a>
### some()
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

<a name="instance-members-some-everyconditionfunction"></a>
### every(@condition:function)
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

<a name="instance-members-some-someconditionregex"></a>
### some(@condition:regex)
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

<a name="instance-members-some-someconditionfunctionregex"></a>
### some(@condition:!function!regex)
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

<a name="instance-members-take"></a>
## take
Is instance method.

```js
return assert.isFunction(aeroflow.empty.take);
```

<a name="instance-members-take-take"></a>
### take()
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

<a name="instance-members-take-takeconditionfunction"></a>
### take(@condition:function)
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

<a name="instance-members-take-takeconditionnumber"></a>
### take(@condition:number)
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

<a name="instance-members-take-takeconditionfunctionnumber"></a>
### take(@condition:!function!number)
Emits all @values when @condition is non-numeric.

```js
var values = ['a', 'b', 'c'],
    take = 'a';
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).take(take).toArray().run(done, fail);
}), values);
```

<a name="instance-members-skip"></a>
## skip
Is instance method.

```js
return assert.isFunction(aeroflow.empty.skip);
```

<a name="instance-members-skip-skip"></a>
### skip()
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

<a name="instance-members-skip-skipconditionfunction"></a>
### skip(@condition:function)
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

<a name="instance-members-skip-skipconditionnumber"></a>
### skip(@condition:number)
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

<a name="instance-members-skip-skipconditionfunctionnumber"></a>
### skip(@condition:!function!number)
Emits nothing when @condition is non-numeric.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow('test').skip('test').run(fail, done);
}));
```

<a name="instance-members-sort"></a>
## sort
Is instance method.

```js
return assert.isFunction(aeroflow.empty.sort);
```

<a name="instance-members-sort-sort"></a>
### sort()
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

<a name="instance-members-sort-sortcomparerstring"></a>
### sort(@comparer:string)
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

<a name="instance-members-sort-sortcomparerboolean"></a>
### sort(@comparer:boolean)
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

<a name="instance-members-sort-sortcomparernumber"></a>
### sort(@comparer:number)
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

<a name="instance-members-sort-sortcomparerfunction"></a>
### sort(@comparer:function)
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

<a name="instance-members-sort-sortcomparersarray"></a>
### sort(@comparers:array)
Emits @values sorted by applying @comparers in order.

```js
var values = [{
  prop: 'test1'
}, {
  prop: 'test2'
}],
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

<a name="instance-members-slice"></a>
## slice
Is instance method.

```js
assert.isFunction(aeroflow.empty.slice);
```

<a name="instance-members-slice-slice"></a>
### slice()
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

<a name="instance-members-slice-slicestartnumber"></a>
### slice(@start:number)
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

<a name="instance-members-slice-slicestartnumber"></a>
### slice(@start:!number)
Emits @values when passed non-numerical @start.

```js
var values = [1, 2];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).slice('test').toArray().run(done, fail);
}), values);
```

<a name="instance-members-slice-slicestartnumber-endnumber"></a>
### slice(@start:number, @end:number)
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

<a name="instance-members-slice-slicestartnumber-endnumber"></a>
### slice(@start:number, @end:!number)
Emits @values from @start index till the end.

```js
var values = [1, 2],
    start = 1,
    expectation = values.slice(start);
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).slice(start, 'test').toArray().run(done, fail);
}), expectation);
```

<a name="instance-members-sum"></a>
## sum
Is instance method.

```js
return assert.isFunction(aeroflow.empty.sum);
```

<a name="instance-members-sum-sum"></a>
### sum()
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

<a name="instance-members-tostring"></a>
## toString
Is instance method.

```js
return assert.isFunction(aeroflow.empty.toString);
```

<a name="instance-members-tostring-tostring"></a>
### toString()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.toString().run(fail, done);
}));
```

Emits @string when flow emits single @string.

```js
var string = 'test';
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow(string).toString().run(done, fail);
}), string);
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

<a name="instance-members-tostring-tostringtrue"></a>
### toString(true)
Emits string when flow empty.

```js
return assert.eventually.typeOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(true).run(done, fail);
}), 'String');
```

Emits empty string when flow is empty.

```js
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(true).run(done, fail);
}), 0);
```

<a name="instance-members-tostring-tostringstring"></a>
### toString(@string)
Emits nothing ("done" event only) when flow is empty.

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

<a name="instance-members-tostring-tostringstring-true"></a>
### toString(@string, true)
Emits empty string when flow is empty.

```js
return assert.eventually.lengthOf(new Promise(function (done, fail) {
  return aeroflow.empty.toString(';', true).run(done, fail);
}), 0);
```

<a name="instance-members-map"></a>
## map
Is instance method.

```js
return assert.isFunction(aeroflow.empty.map);
```

<a name="instance-members-map-map"></a>
### map()
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

<a name="instance-members-map-mapmappingfunction"></a>
### map(@mapping:function)
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

<a name="instance-members-map-mapmappingfunction"></a>
### map(@mapping:!function)
Emits @mapping value instead of every value in @values.

```js
var values = [1, 2],
    mapping = 'a',
    expectation = [mapping, mapping];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).map(mapping).toArray().run(done, fail);
}), expectation);
```

<a name="instance-members-mean"></a>
## mean
Is instance method.

```js
return assert.isFunction(aeroflow.empty.mean);
```

<a name="instance-members-mean-mean"></a>
### mean()
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

<a name="instance-members-reverse"></a>
## reverse
Is instance method.

```js
return assert.isFunction(aeroflow.empty.reverse);
```

<a name="instance-members-reverse-reverse"></a>
### reverse()
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

<a name="instance-members-tap"></a>
## tap
Is instance method.

```js
return assert.isFunction(aeroflow.empty.tap);
```

<a name="instance-members-tap-tap"></a>
### tap()
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

<a name="instance-members-tap-tapcallbackfunction"></a>
### tap(@callback:function)
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

<a name="instance-members-tap-tapcallbackfunction"></a>
### tap(@callback:!function)
Emits immutable @values after tap @callback was applied.

```js
var values = [1, 2, 3];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow(values).tap(1).toArray().run(done, fail);
}), values);
```

<a name="instance-members-group"></a>
## group
Is instance method.

```js
return assert.isFunction(aeroflow.empty.group);
```

<a name="instance-members-group-group"></a>
### group()
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

<a name="instance-members-group-groupselectorfunction"></a>
### group(@selector:function)
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

<a name="instance-members-group-groupselectorsarray"></a>
### group(@selectors:array)
Emits nested named groups which divide @values by first predicate from @selectors.

```js
var values = [{
  name: 'test1',
  sex: 'female'
}, {
  name: 'test2',
  sex: 'male'
}],
    expectation = [values[0].name, values[1].name],
    selectors = [function (value) {
  return value.name;
}, function (value) {
  return value.sex;
}];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  var _aeroflow3;
  return (_aeroflow3 = aeroflow(values)).group.apply(_aeroflow3, selectors).map(function (group) {
    return group[0];
  }).toArray().run(done, fail);
}), expectation);
```

Use maps to contain nested groups which divided @values by @selectors.

```js
var values = [{
  name: 'test1',
  sex: 'female'
}, {
  name: 'test2',
  sex: 'male'
}],
    selectors = [function (value) {
  return value.name;
}, function (value) {
  return value.sex;
}];
return assert.eventually.typeOf(new Promise(function (done, fail) {
  var _aeroflow4;
  return (_aeroflow4 = aeroflow(values)).group.apply(_aeroflow4, selectors).toArray().map(function (group) {
    return group[0][1];
  }).run(done, fail);
}), 'Map');
```

Emits nested named groups which divide @values by second predicate from @selectors.

```js
var values = [{
  name: 'test1',
  sex: 'female'
}, {
  name: 'test2',
  sex: 'male'
}],
    expectation = [[values[0].sex], [values[1].sex]],
    selectors = [function (value) {
  return value.name;
}, function (value) {
  return value.sex;
}];
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  var _aeroflow5;
  return (_aeroflow5 = aeroflow(values)).group.apply(_aeroflow5, selectors).map(function (group) {
    return Array.from(group[1].keys());
  }).toArray().run(done, fail);
}), expectation);
```

Emits @values on the root of nested groups.

```js
var values = [{
  name: 'test1',
  sex: 'female'
}, {
  name: 'test2',
  sex: 'male'
}],
    selectors = [function (value) {
  return value.name;
}, function (value) {
  return value.sex;
}];
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  var _aeroflow6;
  return (_aeroflow6 = aeroflow(values)).group.apply(_aeroflow6, selectors).map(function (group) {
    return Array.from(group[1].values())[0][0];
  }).toArray().run(done, fail);
}), values);
```

