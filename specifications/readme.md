# TOC
   - [Aeroflow#toString](#aeroflowtostring)
     - [()](#aeroflowtostring-)
     - [(true)](#aeroflowtostring-true)
     - [(@string)](#aeroflowtostring-string)
     - [(@string, true)](#aeroflowtostring-string-true)
<a name=""></a>
 
<a name="aeroflowtostring"></a>
# Aeroflow#toString
is instance method.

```js
return assert.isFunction(aeroflow.empty.toString);
```

<a name="aeroflowtostring-"></a>
## ()
returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
```

emits a string.

```js
aeroflow.empty.toString().run(function (result) {
  return done(assert.isString(result));
});
```

emits empty string from an empty flow.

```js
aeroflow.empty.toString().run(function (result) {
  return done(assert.lengthOf(result, 0));
});
```

emits @string from a flow emitting single @string.

```js
var string = 'test';
aeroflow(string).toString().run(function (result) {
  return done(assert.strictEqual(result, string));
});
```

emits @number converted to string from a flow emitting single @number.

```js
var number = 42;
aeroflow(number).toString().run(function (result) {
  return done(assert.strictEqual(result, '' + number));
});
```

<a name="aeroflowtostring-true"></a>
## (true)
emits nothing from an empty flow.

```js
aeroflow.empty.toString(true).run(function (result) {
  return done(assert(false));
}, function (result) {
  return done();
});
```

<a name="aeroflowtostring-string"></a>
## (@string)
emits @strings concatenated via @string separator from a flow emitting @strings.

```js
var separator = ';',
    strings = ['a', 'b'];
aeroflow(strings).toString(separator).run(function (result) {
  return done(assert.strictEqual(result, strings.join(separator)));
});
```

<a name="aeroflowtostring-string-true"></a>
## (@string, true)
emits nothing from an empty flow.

```js
aeroflow.empty.toString(';', true).run(function (result) {
  return done(assert(false));
}, function (result) {
  return done();
});
```

