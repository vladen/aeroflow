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
     - [#min()](#aeroflow-min)
     - [#skip()](#aeroflow-skip)
     - [#skip(@Number)](#aeroflow-skipnumber)
     - [#skip(@Function)](#aeroflow-skipfunction)
     - [#tap()](#aeroflow-tap)
     - [#tap(@Function)](#aeroflow-tapfunction)
     - [#toArray()](#aeroflow-toarray)
     - [#toMap()](#aeroflow-tomap)
     - [#toSet()](#aeroflow-toset)
     - [#distinct()](#aeroflow-distinct)
     - [#distinct(@Boolean)](#aeroflow-distinctboolean)
     - [#average()](#aeroflow-average)
     - [#count()](#aeroflow-count)
     - [#sum()](#aeroflow-sum)
     - [#bind()](#aeroflow-bind)
     - [#bind(@sources)](#aeroflow-bindsources)
     - [#concat()](#aeroflow-concat)
     - [#concat(@sources)](#aeroflow-concatsources)
     - [#every()](#aeroflow-every)
     - [#every(@Function)](#aeroflow-everyfunction)
     - [#every(@RegExp)](#aeroflow-everyregexp)
     - [#every(@Primitive)](#aeroflow-everyprimitive)
     - [#some()](#aeroflow-some)
     - [#some(@Function)](#aeroflow-somefunction)
     - [#some(@RegExp)](#aeroflow-someregexp)
     - [#some(@Primitive)](#aeroflow-someprimitive)
     - [#mean()](#aeroflow-mean)
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
var invoked = false;
aeroflow.empty.run(function (value) {
    return invoked = true;
});
setImmediate(function () {
    return done(assert.isFalse(invoked));
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
var invoked = false;
aeroflow.just().run(function (value) {
    return invoked = true;
});
setImmediate(function () {
    assert.isTrue(invoked);
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
var invoked = false;
aeroflow().max().run(function (value) {
    return invoked = true;
});
setImmediate(function () {
    return done(assert.isFalse(invoked));
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

<a name="aeroflow-min"></a>
## #min()
is instance method.

```js
return assert.isFunction(aeroflow.empty.min);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().min(), 'Aeroflow');
```

does not invoke if empty flow.

```js
var invoked = false;
aeroflow.empty.min().run(function (value) {
    return invoked = true;
});
setImmediate(function () {
    return done(assert.isFalse(invoked));
});
```

emitting valid result for non-empty flow.

```js
var _Math2;
var values = [1, 9, 2, 8, 3, 7, 4, 6, 5],
    expected = (_Math2 = Math).min.apply(_Math2, values),
    actual = undefined;
aeroflow(values).min().run(function (value) {
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
var invoked = false;
aeroflow([1, 2, 3, 4]).skip().run(function (value) {
    return invoked = true;
});
setImmediate(function () {
    return done(assert.isFalse(invoked));
});
```

<a name="aeroflow-skipnumber"></a>
## #skip(@Number)
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().skip(1), 'Aeroflow');
```

skips provided number of values from start.

```js
var values = [1, 2, 3, 4],
    skip = 2,
    actual = [];
aeroflow(values).skip(skip).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    return done(assert.sameMembers(actual, values.slice(skip)));
});
```

emitting values skipped provided number of values from end.

```js
var values = [1, 2, 3, 4],
    skip = 2,
    actual = [];
aeroflow(values).skip(-skip).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    return done(assert.sameMembers(actual, values.slice(0, skip)));
});
```

<a name="aeroflow-skipfunction"></a>
## #skip(@Function)
emitting remained values when provided function returns false.

```js
var values = [1, 2, 3, 4],
    skip = Math.floor(values.length / 2),
    limiter = function limiter(value, index) {
    return index < skip;
},
    actual = [];
aeroflow(values).skip(limiter).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    return done(assert.sameMembers(actual, values.slice(skip)));
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
return assert.typeOf(aeroflow().tap(), 'Aeroflow');
```

<a name="aeroflow-tapfunction"></a>
## #tap(@Function)
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

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().toArray(), 'Aeroflow');
```

emitting empty Array if empty flow.

```js
var actual = undefined;
aeroflow().toArray().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    assert.isArray(actual);
    assert.strictEqual(actual.length, 0);
    done();
});
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

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().toMap(), 'Aeroflow');
```

emitting empty Map if empty flow.

```js
var actual = undefined;
aeroflow().toMap().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    assert.typeOf(actual, 'Map');
    assert.strictEqual(actual.size, 0);
    done();
});
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

<a name="aeroflow-toset"></a>
## #toSet()
is instance method.

```js
return assert.isFunction(aeroflow.empty.toSet);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().toSet(), 'Aeroflow');
```

emitting empty Set if empty flow.

```js
var actual = undefined;
aeroflow().toSet().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    assert.typeOf(actual, 'Set');
    assert.strictEqual(actual.size, 0);
    done();
});
```

emitting single set containing all values.

```js
var expected = [0, 1, 2, 3],
    actual = undefined;
aeroflow.apply(undefined, expected.concat(expected)).toSet().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    assert.typeOf(actual, 'Set');
    assert.sameMembers(Array.from(actual.keys()), expected);
    assert.sameMembers(Array.from(actual.values()), expected);
    done();
});
```

<a name="aeroflow-distinct"></a>
## #distinct()
is instance method.

```js
return assert.isFunction(aeroflow.empty.distinct);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().distinct(), 'Aeroflow');
```

emitting only unique values in sources with a same type.

```js
var values = [1, 1, 1, 2, 2],
    expected = [1, 2],
    actual = [];
aeroflow.apply(undefined, values).distinct().run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    assert.strictEqual(actual.length, expected.length);
    assert.sameMembers(actual, expected);
    done();
});
```

emitting only unique values in sources with different types.

```js
var values = ['a', 'b', 1, new Date(), 2],
    actual = [];
aeroflow.apply(undefined, values).distinct().run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    assert.strictEqual(actual.length, values.length);
    assert.sameMembers(actual, values);
    done();
});
```

emitting only unique values if passed like one source.

```js
var values = [1, 1, 1, 2, 2],
    expected = [1, 2],
    actual = [];
aeroflow(values).distinct().run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    assert.strictEqual(actual.length, expected.length);
    assert.sameMembers(actual, expected);
    done();
});
```

<a name="aeroflow-distinctboolean"></a>
## #distinct(@Boolean)
emitting unique values until it changed if true passed.

```js
var values = [1, 1, 1, 2, 2, 1, 1],
    expected = [1, 2, 1],
    actual = [];
aeroflow.apply(undefined, values).distinct(true).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    assert.strictEqual(actual.length, expected.length);
    assert.sameMembers(actual, expected);
    done();
});
```

emitting unique values until it changed if false passed.

```js
var values = [1, 1, 1, 2, 2, 1, 1],
    expected = [1, 2],
    actual = [];
aeroflow.apply(undefined, values).distinct(false).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    assert.strictEqual(actual.length, expected.length);
    assert.sameMembers(actual, expected);
    done();
});
```

<a name="aeroflow-average"></a>
## #average()
is instance method.

```js
return assert.isFunction(aeroflow.empty.average);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().average(), 'Aeroflow');
```

does not invoke if empty flow.

```js
var invoked = false;
aeroflow().average().run(function (value) {
    return invoked = true;
});
setImmediate(function () {
    return done(assert.isFalse(invoked));
});
```

emitting average value of array.

```js
var values = [1, 4, 7, 8],
    expected = values.reduce(function (sum, next) {
    return sum + next;
}, 0) / values.length,
    actual = undefined;
aeroflow(values).average().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-count"></a>
## #count()
is instance method.

```js
return assert.isFunction(aeroflow.empty.count);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().count(), 'Aeroflow');
```

emitting 0 if empty flow.

```js
var actual = undefined;
aeroflow.empty.count().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, 0));
});
```

emitting the number of values in flow.

```js
var values = [[1, 2], new Map(), function () {}, 'a'],
    expected = values.length,
    actual = undefined;
aeroflow.apply(undefined, values).count().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-sum"></a>
## #sum()
is instance method.

```js
return assert.isFunction(aeroflow.empty.sum);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().sum(), 'Aeroflow');
```

does not invoke if empty flow.

```js
var invoked = false;
aeroflow.empty.sum().run(function (value) {
    return invoked = true;
});
setImmediate(function () {
    return done(assert.isFalse(invoked));
});
```

emitting NaN if not integer passed.

```js
var values = [],
    actual = false;
aeroflow('test').sum().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.isNotNumber(true));
});
```

emitting sum of integer values.

```js
var values = [1, 4, 7, 8],
    expected = values.reduce(function (sum, next) {
    return sum + next;
}, 0),
    actual = undefined;
aeroflow.apply(undefined, values).sum().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-bind"></a>
## #bind()
is instance method.

```js
return assert.isFunction(aeroflow.empty.bind);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().bind(), 'Aeroflow');
```

does not invoke if no arguments passed.

```js
var invoked = false;
aeroflow(1, 2).bind().run(function (value) {
    return invoked = true;
});
setImmediate(function () {
    return done(assert.isFalse(invoked));
});
```

<a name="aeroflow-bindsources"></a>
## #bind(@sources)
emitting binded values.

```js
var _aeroflow;
var initialSources = [1, 2, 3],
    bindedSources = [7, 8],
    actual = [];
(_aeroflow = aeroflow.apply(undefined, initialSources)).bind.apply(_aeroflow, bindedSources).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    return done(assert.sameMembers(actual, bindedSources));
});
```

<a name="aeroflow-concat"></a>
## #concat()
is instance method.

```js
return assert.isFunction(aeroflow.empty.concat);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().concat(), 'Aeroflow');
```

emitting same values if no arguments passed.

```js
var sources = [1, 2],
    actual = [];
aeroflow(sources).concat().run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    return done(assert.sameMembers(actual, sources));
});
```

<a name="aeroflow-concatsources"></a>
## #concat(@sources)
emitting initial values with concatenated as one flow.

```js
var sources = ['a', 1, new Date()],
    additional = [3, 4],
    actual = [];
aeroflow.apply(undefined, sources).concat(additional).run(function (value) {
    return actual.push(value);
});
setImmediate(function () {
    return done(assert.sameMembers(actual, sources.concat(additional)));
});
```

<a name="aeroflow-every"></a>
## #every()
is instance method.

```js
return assert.isFunction(aeroflow.empty.every);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().every(), 'Aeroflow');
```

emitting true if no arguments passed.

```js
var actual = undefined;
aeroflow(1, 2).every().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.isTrue(actual));
});
```

<a name="aeroflow-everyfunction"></a>
## #every(@Function)
emitting a result of matching provided function to all sources.

```js
var sources = [2, 4, 6, 8, 12, 14],
    isEven = function isEven(value) {
    return value % 2 === 0;
},
    expected = sources.every(isEven),
    actual = undefined;
aeroflow(sources).every(isEven).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-everyregexp"></a>
## #every(@RegExp)
emitting a result of matching provided RegExp to all sources.

```js
var sources = ['a', 'b', '6'],
    reqexp = /^([a-z0-9])$/,
    expected = sources.every(function (item) {
    return reqexp.test(item);
}),
    actual = undefined;
aeroflow(sources).every(reqexp).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-everyprimitive"></a>
## #every(@Primitive)
emitting result whether all sources equal to passed string.

```js
var values = ['a', 'a'],
    every = values[0],
    expected = values.every(function (i) {
    return i === every;
}),
    actual = undefined;
aeroflow(values).every(every).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

emitting result whether all sources equal to passed integer.

```js
var values = [0, 1, 2, 3],
    every = values[0],
    expected = values.every(function (i) {
    return i === every;
}),
    actual = undefined;
aeroflow(values).every(every).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-some"></a>
## #some()
is instance method.

```js
return assert.isFunction(aeroflow.empty.some);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().some(), 'Aeroflow');
```

emitting true if no arguments passed.

```js
var actual = undefined;
aeroflow(1, 2).some().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.isTrue(actual));
});
```

<a name="aeroflow-somefunction"></a>
## #some(@Function)
emitting result if at least one source matches to provided function.

```js
var sources = [3, 4, 5, 6],
    isEven = function isEven(value) {
    return value % 2 === 0;
},
    expected = sources.filter(isEven).length !== 0,
    actual = undefined;
aeroflow(sources).some(isEven).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-someregexp"></a>
## #some(@RegExp)
emitting result if at least one source matches to provided ReqExp.

```js
var sources = ['*', 2, '6'],
    reqexp = /^([a-z0-9])$/,
    expected = sources.filter(function (item) {
    return reqexp.test(item);
}).length !== 0,
    actual = undefined;
aeroflow(sources).some(reqexp).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-someprimitive"></a>
## #some(@Primitive)
emitting result whether at least one source equal to passed string.

```js
var values = ['a', 'b'],
    some = values[0],
    expected = values.indexOf(some) >= 0,
    actual = undefined;
aeroflow.apply(undefined, values).some(some).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

emitting result whether at least one source equal to passed integer.

```js
var values = [0, 1, 2, 3],
    some = values[0],
    expected = values.indexOf(some) >= 0,
    actual = undefined;
aeroflow(values).some(some).run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

<a name="aeroflow-mean"></a>
## #mean()
is instance method.

```js
return assert.isFunction(aeroflow.empty.mean);
```

returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow().mean(), 'Aeroflow');
```

emitting mean value of flow with integers.

```js
var sources = [3, 4, 6, 7],
    expected = 6,
    actual = undefined;
aeroflow.apply(undefined, sources).mean().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

emitting mean value of flow with strings.

```js
var sources = ['a', 'b', 'c'],
    expected = 'b',
    actual = undefined;
aeroflow.apply(undefined, sources).mean().run(function (value) {
    return actual = value;
});
setImmediate(function () {
    return done(assert.strictEqual(actual, expected));
});
```

