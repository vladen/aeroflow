# TOC
   - [aeroflow](#aeroflow)
     - [aeroflow()](#aeroflow-aeroflow)
       - [#sources](#aeroflow-aeroflow-sources)
       - [#emitter](#aeroflow-aeroflow-emitter)
     - [aeroflow(@Array)](#aeroflow-aeroflowarray)
       - [@Array](#aeroflow-aeroflowarray-array)
     - [aeroflow(@Map)](#aeroflow-aeroflowmap)
       - [@Map](#aeroflow-aeroflowmap-map)
     - [aerflow(@Set)](#aeroflow-aerflowset)
       - [@Set](#aeroflow-aerflowset-set)
     - [aeroflow(@Function)](#aeroflow-aeroflowfunction)
       - [@Function](#aeroflow-aeroflowfunction-function)
     - [Aeroflow(@Promise)](#aeroflow-aeroflowpromise)
       - [@Promise](#aeroflow-aeroflowpromise-promise)
     - [#empty](#aeroflow-empty)
     - [#expand()](#aeroflow-expand)
     - [#expand(@function)](#aeroflow-expandfunction)
       - [@function](#aeroflow-expandfunction-function)
     - [#just()](#aeroflow-just)
     - [#just(@*)](#aeroflow-just)
       - [@function](#aeroflow-just-function)
       - [@Promise](#aeroflow-just-promise)
     - [#random()](#aeroflow-random)
     - [#random(@Number, @Number)](#aeroflow-randomnumber-number)
       - [@Number, @Number](#aeroflow-randomnumber-number-number-number)
     - [#range()](#aeroflow-range)
     - [#range(@Number, @Number, @Number)](#aeroflow-rangenumber-number-number)
       - [@Number](#aeroflow-rangenumber-number-number-number)
       - [@Number, @Number](#aeroflow-rangenumber-number-number-number-number)
       - [@Number, @Number, @Number](#aeroflow-rangenumber-number-number-number-number-number)
     - [#repeat()](#aeroflow-repeat)
     - [#repeat(@function)](#aeroflow-repeatfunction)
       - [@function](#aeroflow-repeatfunction-function)
   - [Aeroflow](#aeroflow)
     - [#max()](#aeroflow-max)
     - [#skip()](#aeroflow-skip)
     - [#skip(@Number)](#aeroflow-skipnumber)
       - [@Number](#aeroflow-skipnumber-number)
         - [skipps provided number of values from start](#aeroflow-skipnumber-number-skipps-provided-number-of-values-from-start)
     - [#skip(@Function)](#aeroflow-skipfunction)
       - [@Function](#aeroflow-skipfunction-function)
     - [#tap()](#aeroflow-tap)
     - [#tap(@Function)](#aeroflow-tapfunction)
       - [@Function](#aeroflow-tapfunction-function)
     - [#toArray()](#aeroflow-toarray)
     - [#toMap()](#aeroflow-tomap)
<a name=""></a>
 
<a name="aeroflow"></a>
# aeroflow
<a name="aeroflow-aeroflow"></a>
## aeroflow()
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow(), 'Aeroflow');
```

<a name="aeroflow-aeroflow-sources"></a>
### #sources
is initially empty array.

```js
assert.strictEqual(aeroflow().sources.length, 0);
```

<a name="aeroflow-aeroflow-emitter"></a>
### #emitter
is function.

```js
assert.isFunction(aeroflow().emitter);
```

<a name="aeroflow-aeroflowarray"></a>
## aeroflow(@Array)
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow([1, 2]), 'Aeroflow');
```

<a name="aeroflow-aeroflowarray-array"></a>
### @Array
emitting array items.

```js
var expected = ['str', new Date(), {}, 2],
    actual = [];
aeroflow(expected).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    return done(assert.sameMembers(actual, expected));
});
```

<a name="aeroflow-aeroflowmap"></a>
## aeroflow(@Map)
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow(new Map([[1, 2], [2, 1]])), 'Aeroflow');
```

<a name="aeroflow-aeroflowmap-map"></a>
### @Map
emitting map entries.

```js
var expected = [['a', 1], ['b', 2]],
    actual = [];
aeroflow(new Map(expected)).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    expected.forEach(function (item, index) {
        return assert.sameMembers(actual[index], expected[index]);
    });
    done();
});
```

<a name="aeroflow-aerflowset"></a>
## aerflow(@Set)
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow(new Set([1, 2])), 'Aeroflow');
```

<a name="aeroflow-aerflowset-set"></a>
### @Set
emitting set keys.

```js
var expected = ['a', 'b'],
    actual = [];
aeroflow(new Set(expected)).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    return done(assert.sameMembers(actual, expected));
});
```

<a name="aeroflow-aeroflowfunction"></a>
## aeroflow(@Function)
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow(function () {
    return true;
}), 'Aeroflow');
```

<a name="aeroflow-aeroflowfunction-function"></a>
### @Function
emitting scalar value returned by function.

```js
var expected = 'test tester',
    actual = undefined;
aeroflow(function () {
    return expected;
}).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-aeroflowpromise"></a>
## Aeroflow(@Promise)
returns instance of Aeroflow.

```js
assert.typeOf(aeroflow(Promise.resolve({})), 'Aeroflow');
```

<a name="aeroflow-aeroflowpromise-promise"></a>
### @Promise
emitting array resolved by promise.

```js
var expected = ['a', 'b'],
    actual = undefined;
aeroflow(Promise.resolve(expected)).run(function (value) {
    return assert.strictEqual(value, expected);
}, function () {
    return done();
});
```

<a name="aeroflow"></a>
# aeroflow
is function.

```js
return assert.isFunction(aeroflow);
```

<a name="aeroflow-empty"></a>
## #empty
is static property returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty, 'Aeroflow');
```

emitting empty flow.

```js
var result = undefined;
aeroflow.empty.run(function (value) {
    return result = value;
});
setImmediate(function () {
    return done(assert.isUndefined(result));
});
```

<a name="aeroflow-expand"></a>
## #expand()
is static method.

```js
return assert.isFunction(aeroflow.expand);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.expand(), 'Aeroflow');
```

<a name="aeroflow-expandfunction"></a>
## #expand(@function)
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.expand(function () {
    return true;
}, 1), 'Aeroflow');
```

<a name="aeroflow-expandfunction-function"></a>
### @function
emitting geometric progression.

```js
var expander = function expander(value) {
    return value * 2;
},
    actual = [],
    seed = 1,
    expected = [2, 4, 8],
    index = 0;
aeroflow.expand(expander, seed).take(expected.length).run(function (value) {
    actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, index) {
        return assert.strictEqual(item, expected[index]);
    });
    done();
});
```

<a name="aeroflow-just"></a>
## #just()
is static method.

```js
return assert.isFunction(aeroflow.just);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.just(), 'Aeroflow');
```

emitting empty flow.

```js
var actual = undefined;
aeroflow.just().run(function (value) {
    return value = actual;
});
setImmediate(function () {
    assert.isUndefined(actual);
    done();
});
```

<a name="aeroflow-just"></a>
## #just(@*)
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.just(function () {
    return true;
}), 'Aeroflow');
```

<a name="aeroflow-just-function"></a>
### @function
emitting single function.

```js
var expected = function expected() {},
    actual = undefined;
aeroflow.just(expected).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-just-promise"></a>
### @Promise
emitting single promise.

```js
var expected = Promise.resolve([1, 2, 3]),
    actual = undefined;
aeroflow.just(expected).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-random"></a>
## #random()
is static method.

```js
return assert.isFunction(aeroflow.random);
```

emitting random decimals within 0 and 1.

```js
var actual = [];
aeroflow.random().take(10).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item) {
        return assert.isTrue(!Number.isInteger(item) && item >= 0 && item < 1);
    });
    done();
});
```

<a name="aeroflow-randomnumber-number"></a>
## #random(@Number, @Number)
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.random(0, 1), 'Aeroflow');
```

<a name="aeroflow-randomnumber-number-number-number"></a>
### @Number, @Number
emitting random integers within a range.

```js
var limit = 10,
    max = 10,
    min = 1,
    actual = [];
aeroflow.random(min, max).take(limit).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item) {
        return assert.isTrue(Number.isInteger(item) && item >= min && item < max);
    });
    done();
});
```

emitting random decimals within a range.

```js
var limit = 10,
    max = 10.1,
    min = 1.1,
    actual = [];
aeroflow.random(min, max).take(limit).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item) {
        return assert.isTrue(!Number.isInteger(item) && item >= min && item < max);
    });
    done();
});
```

<a name="aeroflow-range"></a>
## #range()
is static method.

```js
return assert.isFunction(aeroflow.range);
```

emitting ascending sequential starting from 0.

```js
var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    actual = [];
aeroflow.range().take(10).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, index) {
        return assert.strictEqual(item, expected[index]);
    });
    done();
});
```

<a name="aeroflow-rangenumber-number-number"></a>
## #range(@Number, @Number, @Number)
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.random(0, 1), 'Aeroflow');
```

<a name="aeroflow-rangenumber-number-number-number"></a>
### @Number
emitting ascending sequential starting from passed number.

```js
var expected = [5, 6, 7, 8],
    actual = [];
aeroflow.range(expected[0]).take(4).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, index) {
        return assert.strictEqual(item, expected[index]);
    });
    done();
});
```

<a name="aeroflow-rangenumber-number-number-number-number"></a>
### @Number, @Number
emitting ascending sequential integers within a range.

```js
var expected = [5, 6, 7, 8],
    start = expected[0],
    end = expected[expected.length - 1],
    actual = [];
aeroflow.range(start, end).take(4).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, index) {
        return assert.strictEqual(item, expected[index]);
    });
    done();
});
```

emitting descending sequential integers within a range.

```js
var expected = [8, 7, 6, 5],
    start = expected[0],
    end = expected[expected.length - 1],
    actual = [];
aeroflow.range(start, end).take(4).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, index) {
        return assert.strictEqual(item, expected[index]);
    });
    done();
});
```

<a name="aeroflow-rangenumber-number-number-number-number-number"></a>
### @Number, @Number, @Number
emitting ascending sequential integers within a stepped range.

```js
var expected = [0, 2, 4, 6],
    start = expected[0],
    end = expected[expected.length - 1],
    step = 2,
    actual = [];
aeroflow.range(start, end, step).take(10).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, index) {
        return assert.strictEqual(item, expected[index]);
    });
    done();
});
```

emitting descending sequential integers within a stepped range.

```js
var expected = [6, 4, 2, 0],
    start = expected[0],
    end = expected[expected.length - 1],
    step = -2,
    actual = [];
aeroflow.range(start, end, step).take(10).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, index) {
        return assert.strictEqual(item, expected[index]);
    });
    done();
});
```

<a name="aeroflow-repeat"></a>
## #repeat()
is static method.

```js
return assert.isFunction(aeroflow.repeat);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.repeat(), 'Aeroflow');
```

<a name="aeroflow-repeatfunction"></a>
## #repeat(@function)
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.repeat(function () {
    return true;
}), 'Aeroflow');
```

<a name="aeroflow-repeatfunction-function"></a>
### @function
emitting geometric progression.

```js
var repeater = function repeater(index) {
    return index * 2;
},
    expected = [0, 2, 4, 6, 8],
    actual = [];
aeroflow.repeat(repeater).take(expected.length).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, index) {
        return assert.strictEqual(item, expected[index]);
    });
    done();
});
```

<a name="aeroflow"></a>
# Aeroflow
<a name="aeroflow-max"></a>
## #max()
is instance method.

```js
return assert.isFunction(aeroflow.empty.max);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().max(), 'Aeroflow');
```

emitting undefined if empty flow.

```js
var actual = undefined;
aeroflow().max().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.isUndefined(actual));
});
```

emitting valid result for non-empty flow.

```js
var _Math;
var values = [1, 9, 2, 8, 3, 7, 4, 6, 5],
    expected = (_Math = Math).max.apply(_Math, values),
    actual = undefined;
aeroflow(values).max().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-skip"></a>
## #skip()
is instance method.

```js
return assert.isFunction(aeroflow.empty.skip);
```

emitting undefined if called without param.

```js
var actual = undefined;
aeroflow([1, 2, 3, 4]).skip().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.isUndefined(actual));
});
```

<a name="aeroflow-skipnumber"></a>
## #skip(@Number)
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow([1, 2, 3, 4]).skip(), 'Aeroflow');
```

<a name="aeroflow-skipnumber-number"></a>
### @Number
emitting values skipped provided number of values from end.

```js
var values = [1, 2, 3, 4],
    skip = 2,
    actual = [];
aeroflow(values).skip(-skip).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, i) {
        return assert.strictEqual(item, values[i]);
    });
    done();
});
```

<a name="aeroflow-skipnumber-number-skipps-provided-number-of-values-from-start"></a>
#### skipps provided number of values from start
values passed as single source.

```js
var values = [1, 2, 3, 4],
    skip = 2,
    actual = [];
aeroflow(values).skip(skip).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, i) {
        return assert.strictEqual(item, values[skip + i]);
    });
    done();
});
```

values passed as separate sources.

```js
var expected = [1, 2, 3, 4],
    skip = 2,
    actual = [];
aeroflow(1, 2, 3, 4).skip(skip).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, i) {
        return assert.strictEqual(item, values[skip + i]);
    });
    done();
});
```

<a name="aeroflow-skipfunction"></a>
## #skip(@Function)
<a name="aeroflow-skipfunction-function"></a>
### @Function
emitting remained values when provided function returns false.

```js
var values = [1, 2, 3, 4],
    skip = Math.floor(values.length / 2),
    limiter = function limiter(value, index) {
    return index < skip;
},
    actual = [];
aeroflow(values).skip(skip).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    actual.forEach(function (item, i) {
        return assert.strictEqual(item, values[skip + i]);
    });
    done();
});
```

<a name="aeroflow-tap"></a>
## #tap()
is instance method.

```js
return assert.isFunction(aeroflow.empty.tap);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow([1, 2, 3, 4]).tap(), 'Aeroflow');
```

<a name="aeroflow-tapfunction"></a>
## #tap(@Function)
<a name="aeroflow-tapfunction-function"></a>
### @Function
intercepts each emitted value.

```js
var expected = [0, 1, 2],
    actual = [];
aeroflow(expected).tap(function (value) {
    return actual.push(value);
}).run();
setImmediate(function () {
    actual.forEach(function (item, i) {
        return assert.strictEqual(item, expected[i]);
    });
    done();
});
```

<a name="aeroflow-toarray"></a>
## #toArray()
is instance method.

```js
return assert.isFunction(aeroflow.empty.toArray);
```

emitting single array containing all values.

```js
var expected = [1, 2, 3],
    actual = undefined;
aeroflow.apply(undefined, expected).toArray().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    assert.isArray(actual);
    assert.sameMembers(actual, expected);
    done();
});
```

<a name="aeroflow-tomap"></a>
## #toMap()
is instance method.

```js
return assert.isFunction(aeroflow.empty.toMap);
```

emitting single map containing all values.

```js
var expected = [1, 2, 3],
    actual = undefined;
aeroflow.apply(undefined, expected).toMap().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    assert.typeOf(actual, 'Map');
    assert.includeMembers(Array.from(actual.keys()), expected);
    assert.includeMembers(Array.from(actual.values()), expected);
    done();
});
```

