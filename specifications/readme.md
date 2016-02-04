# TOC
   - [aeroflow](#aeroflow)
     - [#empty](#aeroflow-empty)
     - [#expand()](#aeroflow-expand)
     - [#expand(@function)](#aeroflow-expandfunction)
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
<a name=""></a>
 
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

