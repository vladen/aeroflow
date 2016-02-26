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
       - [(@value:aeroflow)](#aeroflow-just-valueaeroflow)
       - [(@value:array)](#aeroflow-just-valuearray)
       - [(@value:function)](#aeroflow-just-valuefunction)
       - [(@value:iterable)](#aeroflow-just-valueiterable)
<<<<<<< HEAD
       - [(@value:promise)](#aeroflow-just-valuepromise)
=======
     - [.random](#aeroflow-random)
       - [()](#aeroflow-random-)
       - [(@start:number)](#aeroflow-random-startnumber)
       - [(@start:!number)](#aeroflow-random-startnumber)
       - [(@start, @end:number)](#aeroflow-random-start-endnumber)
       - [(@start, @end:!number)](#aeroflow-random-start-endnumber)
     - [.repeat](#aeroflow-repeat)
       - [()](#aeroflow-repeat-)
       - [(@repeater:function)](#aeroflow-repeat-repeaterfunction)
       - [(@repeater:!function)](#aeroflow-repeat-repeaterfunction)
       - [(@repeater, @interval:number)](#aeroflow-repeat-repeater-intervalnumber)
       - [(@repeater, @interval:!number)](#aeroflow-repeat-repeater-intervalnumber)
>>>>>>> juliamaksimchik/master
     - [#average](#aeroflow-average)
       - [()](#aeroflow-average-)
     - [#catch](#aeroflow-catch)
       - [()](#aeroflow-catch-)
<<<<<<< HEAD
       - [(@alternative:function)](#aeroflow-catch-alternativefunction)
       - [(@alternative:!function)](#aeroflow-catch-alternativefunction)
=======
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
     - [#join](#aeroflow-join)
       - [()](#aeroflow-join-)
       - [(@joiner:any)](#aeroflow-join-joinerany)
       - [(@joiner:any, @comparer:function)](#aeroflow-join-joinerany-comparerfunction)
       - [(@joiner:any, @comparer:!function)](#aeroflow-join-joinerany-comparerfunction)
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
>>>>>>> juliamaksimchik/master
<a name=""></a>
 
<a name="aeroflow"></a>
# aeroflow
Is function.

```js
return exec(noop, /* arrange */
function () {
  return aeroflow;
}, /* act */
function (result) {
  return chai.expect(result).to.be.a('function');
} /* assert */);
```

<a name="aeroflow-"></a>
## ()
Returns instance of Aeroflow.

```js
return exec(noop, function () {
  return aeroflow();
}, function (result) {
  return chai.expect(result).to.be.an('Aeroflow');
});
```

Returns empty flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow().notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns empty flow not emitting "next" notification.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow().notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

<a name="aeroflow-sourceaeroflow"></a>
## (@source:aeroflow)
Returns flow emitting "done" notification argumented with "true" when @source is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(aeroflow.empty).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(aeroflow([1, 2])).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "done" notification argumented with "false" when @source is not empty but has not been entirely enumerated.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(aeroflow([1, 2])).take(1).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(false);
});
```

Returns flow not emitting "next" notification when @source is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(aeroflow.empty).notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

Returns flow emitting several "next" notifications argumented with subsequent items from @source.

```js
return exec(function () {
  return { source: [1, 2], spy: chai.spy() };
}, function (ctx) {
  return aeroflow(aeroflow(ctx.source)).notify(ctx.spy).run();
}, function (ctx) {
  var _chai$expect$to$have$;
  return (_chai$expect$to$have$ = chai.expect(ctx.spy).to.have.been.called).with.apply(_chai$expect$to$have$, _toConsumableArray(ctx.source));
});
```

<a name="aeroflow-sourcearray"></a>
## (@source:array)
Returns flow emitting "done" notification argumented with "true" when @source is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow([]).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow([1, 2]).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "done" notification argumented with "false" when @source is not empty and has not been entirely enumerated.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow([1, 2]).take(1).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(false);
});
```

Returns flow not emitting "next" notification when @source is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow([]).notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

Returns flow emitting several "next" notifications argumented with subsequent items from @source.

```js
return exec(function () {
  return { source: [1, 2], spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(ctx.spy).run();
}, function (ctx) {
  var _chai$expect$to$have$2;
  return (_chai$expect$to$have$2 = chai.expect(ctx.spy).to.have.been.called).with.apply(_chai$expect$to$have$2, _toConsumableArray(ctx.source));
});
```

<a name="aeroflow-sourcedate"></a>
## (@source:date)
Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(new Date()).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "next" notification argumented with @source.

```js
return exec(function () {
  return { source: new Date(), spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.source);
});
```

<a name="aeroflow-sourceerror"></a>
## (@source:error)
Returns flow emitting "done" notification argumented with @source.

```js
return exec(function () {
  return { source: new Error('test'), spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(noop, ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.source);
});
```

Returns flow not emitting "next" notification.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(new Error('test')).notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

<a name="aeroflow-sourcefunction"></a>
## (@source:function)
Calls @source and passes ctx data as first argument.

```js
return exec(function () {
  return { data: {}, source: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).run(ctx.data);
}, function (ctx) {
  return chai.expect(ctx.source).to.have.been.called.with(ctx.data);
});
```

Returns flow emitting "done" notification argumented with "true" when @source does not throw.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(noop).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "done" notification argumented with error thrown by @source.

```js
return exec(function () {
  return { error: new Error('test'), spy: chai.spy() };
}, function (ctx) {
  return aeroflow(function () {
    throw ctx.error;
  }).notify(noop, ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.error);
});
```

Returns flow emitting "next" notification argumented with value returned by @source.

```js
return exec(function () {
  return { value: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow(function () {
    return ctx.value;
  }).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.value);
});
```

<a name="aeroflow-sourceiterable"></a>
## (@source:iterable)
Returns empty flow emitting "done" notification argumented with "true" when source is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(new Set()).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "done" notification argumented with "true" when source is not empty and has been entirely enumerated.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(new Set([1, 2])).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "done" notification argumented with "false" when source is not empty but has not been entirely enumerated.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(new Set([1, 2])).take(1).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(false);
});
```

Returns flow not emitting "next" notification when source is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(new Set()).notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

Returns flow emitting several "next" notifications argumented with subsequent items from @source.

```js
return exec(function () {
  return { source: [1, 2], spy: chai.spy() };
}, function (ctx) {
  return aeroflow(new Set(ctx.source)).notify(ctx.spy).run();
}, function (ctx) {
  var _chai$expect$to$have$3;
  return (_chai$expect$to$have$3 = chai.expect(ctx.spy).to.have.been.called).with.apply(_chai$expect$to$have$3, _toConsumableArray(ctx.source));
});
```

<a name="aeroflow-sourcenull"></a>
## (@source:null)
Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(null).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "next" notification argumented with @source.

```js
return exec(function () {
  return { source: null, spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.source);
});
```

<a name="aeroflow-sourcepromise"></a>
## (@source:promise)
Returns flow emitting "done" notification argumented with "true" when @source resolves.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(Promise.resolve()).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "done" notification argumented with rejection error when @source rejects.

```js
return exec(function () {
  return { error: new Error('test'), spy: chai.spy() };
}, function (ctx) {
  return aeroflow(Promise.reject(ctx.error)).notify(noop, ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.error);
});
```

Returns flow emitting "next" notification argumented with result resolved by @source.

```js
return exec(function () {
  return { result: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow(Promise.resolve(ctx.result)).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.source);
});
```

<a name="aeroflow-sourcestring"></a>
## (@source:string)
Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow('test').notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "next" notification argumented with @source.

```js
return exec(function () {
  return { source: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.source).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.source);
});
```

<a name="aeroflow-sourceundefined"></a>
## (@source:undefined)
Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(undefined).notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "next" notification argumented with @source.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(undefined).notify(function (arg) {
    return spy(typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
  }, noop).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with('undefined');
});
```

<a name="aeroflow-empty"></a>
## .empty
Gets instance of Aeroflow.

```js
return exec(noop, function () {
  return aeroflow.empty;
}, function (result) {
  return chai.expect(result).to.be.an('Aeroflow');
});
```

Gets flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.empty.notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Gets flow not emitting "next" notification.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.empty.notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

<a name="aeroflow-expand"></a>
## .expand
Is static method.

```js
return exec(noop, function () {
  return aeroflow.expand;
}, function (result) {
  return chai.expect(result).to.be.a('function');
});
```

<a name="aeroflow-expand-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(noop, function () {
  return aeroflow.expand();
}, function (result) {
  return chai.expect(result).to.be.an('Aeroflow');
});
```

<a name="aeroflow-expand-expanderfunction"></a>
### (@expander:function)
Calls @expander.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.expand(spy).take(1).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called();
});
```

Passes undefined to @expander as first argument when no seed has been specified.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.expand(function (arg) {
    return spy(typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
  }).take(1).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with('undefined');
});
```

<<<<<<< HEAD
Passes result returned by @expander to @expander as first argument on sybsequent iteration.
=======
Passes value returned by @expander to @expander as first argument on subsequent iteration.
>>>>>>> juliamaksimchik/master

```js
return exec(function () {
  var result = {};
  return { result: result, spy: chai.spy(function () {
      return result;
    }) };
}, function (ctx) {
  return aeroflow.expand(function (result) {
    return ctx.spy(result);
  }).take(2).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.result);
});
```

Passes zero-based index of iteration to @expander as second argument.

```js
return exec(function () {
  return { limit: 3, spy: chai.spy() };
}, function (ctx) {
  return aeroflow.expand(function (_, index) {
    return ctx.spy(index);
  }).take(ctx.limit).run();
}, function (ctx) {
  return Array(ctx.limit).fill(0).forEach(function (_, i) {
    return chai.expect(ctx.spy).to.have.been.called.with(i);
  });
});
```

Passes context data to @expander as third argument.

```js
return exec(function () {
  return { data: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow.expand(function (_, __, data) {
    return ctx.spy(data);
  }).take(1).run(ctx.data);
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.data);
});
```

Emits "next" notification with value returned by @expander.

```js
return exec(function () {
  return { result: {}, spy: chai.spy() };
}, function (ctx) {
  return aeroflow.expand(function () {
    return ctx.result;
  }).take(1).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.result);
});
```

<a name="aeroflow-expand-expanderfunction-seedany"></a>
### (@expander:function, @seed:any)
Passes @seed to @expander as first argument at first iteration.

```js
return exec(function () {
  return { seed: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow.expand(function (seed) {
    return ctx.spy(seed);
  }, ctx.seed).take(1).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.seed);
});
```

<a name="aeroflow-just"></a>
## .just
Is static method.

```js
return exec(noop, function () {
  return aeroflow.just;
}, function (result) {
  return chai.expect(result).to.be.a('function');
});
```

<a name="aeroflow-just-"></a>
### ()
Returns instance of Aeroflow.

```js
<<<<<<< HEAD
return exec(noop, function () {
  return aeroflow.just();
}, function (result) {
  return chai.expect(result).to.be.an('Aeroflow');
});
=======
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

<a name="aeroflow-random"></a>
## .random
Is static method.

```js
return assert.isFunction(aeroflow.random);
```

<a name="aeroflow-random-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.random(), 'Aeroflow');
```

Emits random values decimals within 0 and 1.

```js
var count = 10,
    expectation = function expectation(value) {
  return !Number.isInteger(value) && value >= 0 && value <= 1;
};
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.random().take(count).every(expectation).run(done, fail);
}));
```

<a name="aeroflow-random-startnumber"></a>
### (@start:number)
Emits random demical values less than @start if @start.

```js
var start = 2,
    count = 10,
    expectation = function expectation(value) {
  return !Number.isInteger(value) && value <= start;
};
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.random(start).take(count).every(expectation).run(done, fail);
}));
```

<a name="aeroflow-random-startnumber"></a>
### (@start:!number)
Emits random decimals values within 0 and 1.

```js
var start = 'test',
    count = 10,
    expectation = function expectation(value) {
  return !Number.isInteger(value) && value >= 0 && value <= 1;
};
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.random(start).take(count).every(expectation).run(done, fail);
}));
```

<a name="aeroflow-random-start-endnumber"></a>
### (@start, @end:number)
Emits random integer values within @start and @end if @start and @end is integer.

```js
var start = 10,
    end = 20,
    count = 10,
    expectation = function expectation(value) {
  return Number.isInteger(value) && value >= start && value <= end;
};
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.random(start, end).take(count).every(expectation).run(done, fail);
}));
```

Emits random demical values within @start and @end if @start or @end is demical.

```js
var start = 1,
    end = 2.3,
    count = 10,
    expectation = function expectation(value) {
  return !Number.isInteger(value) && value >= start && value <= end;
};
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.random(start, end).take(count).every(expectation).run(done, fail);
}));
```

<a name="aeroflow-random-start-endnumber"></a>
### (@start, @end:!number)
Emits random demical values less than @start if @start.

```js
var start = 2,
    end = 'test',
    count = 10,
    expectation = function expectation(value) {
  return !Number.isInteger(value) && value <= start;
};
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.random(start, end).take(count).every(expectation).run(done, fail);
}));
```

<a name="aeroflow-repeat"></a>
## .repeat
Is static method.

```js
return assert.isFunction(aeroflow.repeat);
```

<a name="aeroflow-repeat-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.repeat(), 'Aeroflow');
```

Emits undefined @values if no params passed.

```js
return assert.eventually.isUndefined(new Promise(function (done, fail) {
  return aeroflow.repeat().take(1).run(done, fail);
}));
```

<a name="aeroflow-repeat-repeaterfunction"></a>
### (@repeater:function)
Calls @repeater.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.repeat(done).take(1).run(fail, fail);
}));
```

Emits @value returned by @repeater.

```js
var value = 'a';
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.repeat(value).take(5).every(value).run(done, fail);
}));
```

Emits geometric progression recalculating @repeater each time.

```js
var expectation = [0, 2, 4, 6];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow.repeat(function (index) {
    return index * 2;
  }).take(expectation.length).toArray().run(done, fail);
}), expectation);
```

Passes zero-based @index of iteration to @repeater as first argument.

```js
var values = [0, 1, 2, 3, 4];
return assert.eventually.sameMembers(new Promise(function (done, fail) {
  return aeroflow.repeat(function (index) {
    return index;
  }).take(values.length).toArray().run(done, fail);
}), values);
```

<a name="aeroflow-repeat-repeaterfunction"></a>
### (@repeater:!function)
Emits @repeater value if @repeater is not function.

```js
var value = 'a';
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.repeat(value).take(5).every(value).run(done, fail);
}));
```

<a name="aeroflow-repeat-repeater-intervalnumber"></a>
### (@repeater, @interval:number)
Emits value of @repeater each @interval ms.

```js
var interval = 10,
    take = 3,
    actual = [];
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow.repeat(function () {
    return actual.push('test');
  }, interval).take(take).count().run(done, fail);
}), take);
```

<a name="aeroflow-repeat-repeater-intervalnumber"></a>
### (@repeater, @interval:!number)
Emits value of @repeater each 1000 ms.

```js
var take = 1,
    actualTime = new Date().getSeconds();
return assert.eventually.isTrue(new Promise(function (done, fail) {
  return aeroflow.repeat(function () {
    return new Date().getSeconds();
  }, 'tests').take(take).every(function (val) {
    return val - actualTime >= 1;
  }).run(done, fail);
}));
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
>>>>>>> juliamaksimchik/master
```

Returns flow emitting "done" notification argumented with "true".

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.just().notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

Returns flow emitting "next" notification argumented with undefined.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.just().notify(function (result) {
    return spy(typeof result === 'undefined' ? 'undefined' : _typeof(result));
  }).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with('undefined');
});
```

<a name="aeroflow-just-valueaeroflow"></a>
### (@value:aeroflow)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: aeroflow.empty, spy: chai.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.value);
});
```

<a name="aeroflow-just-valuearray"></a>
### (@value:array)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: [], spy: chai.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.value);
});
```

<a name="aeroflow-just-valuefunction"></a>
### (@value:function)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: noop, spy: chai.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.value);
});
```

<a name="aeroflow-just-valueiterable"></a>
### (@value:iterable)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: new Set(), spy: chai.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.value);
});
```

<a name="aeroflow-just-valuepromise"></a>
### (@value:promise)
Returns flow emitting "next" notification argumented with @value.

```js
return exec(function () {
  return { value: Promise.resolve, spy: chai.spy() };
}, function (ctx) {
  return aeroflow.just(ctx.value).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.value);
});
```

<a name="aeroflow-average"></a>
## #average
Is instance method.

```js
return exec(noop, function () {
  return aeroflow.empty.average;
}, function (result) {
  return chai.expect(result).to.be.a('function');
});
```

<a name="aeroflow-average-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(noop, function () {
  return aeroflow.empty.average();
}, function (result) {
  return chai.expect(result).to.be.an('Aeroflow');
});
```

Does not emit "next" notification when flow is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.empty.average().notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

Emits "next" notification argumented with @value when flow emits single numeric @value.

```js
return exec(function () {
  return { value: 42, spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.value).average().notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.value);
});
```

Emits "next" notification argumented with NaN when flow emits single not numeric @value.

```js
return exec(function () {
  return { value: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.value).average().notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(NaN);
});
```

Emits "next" notification argumented with average of @values when flow emits several numeric @values.

```js
return exec(function () {
  return { values: [1, 2, 5], spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.values).average().notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.values.reduce(function (sum, value) {
    return sum + value;
  }, 0) / ctx.values.length);
});
```

Emits "next" notification argumented with NaN when flow emits several not numeric @values.

```js
return exec(function () {
  return { values: ['a', 'b'], spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.value).average().notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(NaN);
});
```

<a name="aeroflow-catch"></a>
## #catch
Is instance method.

```js
return exec(noop, function () {
  return aeroflow.empty.catch;
}, function (result) {
  return chai.expect(result).to.be.a('function');
});
```

<a name="aeroflow-catch-"></a>
### ()
Returns instance of Aeroflow.

```js
return exec(noop, function () {
  return aeroflow.empty.catch();
}, function (result) {
  return chai.expect(result).to.be.an('Aeroflow');
});
```

Does not emit "next" notification when flow is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.empty.catch().notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

Does not emit "next" notification when flow emits single error.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(new Error('test')).catch().notify(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

Emits "done" notification argumented with "true" when emits error.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow(new Error('test')).catch().notify(noop, spy).run();
}, function (spy) {
  return chai.expect(spy).to.have.been.called.with(true);
});
```

<a name="aeroflow-catch-alternativefunction"></a>
### (@alternative:function)
Does not call @alternative when flow is empty.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow.empty.catch(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

Does not call @alternative when flow does not emit error.

```js
return exec(function () {
  return chai.spy();
}, function (spy) {
  return aeroflow('test').catch(spy).run();
}, function (spy) {
  return chai.expect(spy).not.to.have.been.called();
});
```

Calls @alternative and passes error as first argument when flow emits error.

```js
return exec(function () {
  return { error: new Error('test'), spy: chai.spy() };
}, function (ctx) {
  return aeroflow(ctx.error).catch(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.error);
});
```

Calls @alternative and passes context data as second argument when flow emits error.

```js
return exec(function () {
  return { data: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow(new Error('test')).catch(function (_, data) {
    return ctx.spy(data);
  }).run(ctx.data);
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.data);
});
```

Emits "next" notification argumented with value returned by @alternative when flow emits error.

```js
return exec(function () {
  return { value: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow(new Error('test')).catch(function () {
    return ctx.value;
  }).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.value);
});
```

<a name="aeroflow-catch-alternativefunction"></a>
### (@alternative:!function)
Emits "next" notification argumented with @alternative when flow emits error.

```js
<<<<<<< HEAD
return exec(function () {
  return { alternative: 'test', spy: chai.spy() };
}, function (ctx) {
  return aeroflow(new Error('test')).catch(ctx.alternative).notify(ctx.spy).run();
}, function (ctx) {
  return chai.expect(ctx.spy).to.have.been.called.with(ctx.alternative);
});
=======
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
var expectation = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').filter(function (_, __, data) {
    return done(data);
  }).run(fail, fail, expectation);
}), expectation);
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
var expectation = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').group(function (_, __, data) {
    return done(data);
  }).run(fail, fail, expectation);
}), expectation);
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

<a name="aeroflow-join"></a>
## #join
Is instance method.

```js
return assert.isFunction(aeroflow.empty.join);
```

<a name="aeroflow-join-"></a>
### ()
Returns instance of Aeroflow.

```js
return assert.typeOf(aeroflow.empty.join(), 'Aeroflow');
```

Emits nothing when flow is empty.

```js
return assert.isFulfilled(new Promise(function (done, fail) {
  return aeroflow.empty.join().run(fail, done);
}));
```

Emits @values from flow concatenated with undefined when flow is not empty.

```js
var values = [1, 2],
    expectation = [[1, undefined], [2, undefined]];
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  aeroflow(values).join().toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-join-joinerany"></a>
### (@joiner:any)
Emits nested arrays with @values concatenated with @joiner values by one to one.

```js
var values = [1, 2],
    joiner = [3, 4],
    expectation = [[1, 3], [1, 4], [2, 3], [2, 4]];
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  aeroflow(values).join(joiner).toArray().run(done, fail);
}), expectation);
```

<a name="aeroflow-join-joinerany-comparerfunction"></a>
### (@joiner:any, @comparer:function)
Emits nested arrays with @values concatenated with @joiner through @comparer function.

```js
var values = [{ a: 'test', b: 'tests' }],
    joiner = [{ a: 'test', c: 'tests3' }],
    comparer = function comparer(left, right) {
  return left.a === right.a;
},
    expectation = [].concat(values, joiner);
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  aeroflow(values).join(joiner, comparer).toArray().map(function (res) {
    return res[0];
  }).run(done, fail);
}), expectation);
```

<a name="aeroflow-join-joinerany-comparerfunction"></a>
### (@joiner:any, @comparer:!function)
Emits nested arrays with @values concatenated with @joiner values by one to one ignored @comparer.

```js
var values = [1, 2],
    joiner = 3,
    comparer = 'test',
    expectation = [[1, 3], [2, 3]];
return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
  aeroflow(values).join(joiner, comparer).toArray().run(done, fail);
}), expectation);
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
var expectation = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').map(function (_, __, data) {
    return done(data);
  }).run(fail, fail, expectation);
}), expectation);
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
var expectation = {};
return assert.eventually.strictEqual(new Promise(function (done, fail) {
  return aeroflow('test').tap(function (_, __, data) {
    return done(data);
  }).run(fail, fail, expectation);
}), expectation);
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
>>>>>>> juliamaksimchik/master
```

