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
     - [(...@sources)](#aeroflow-sources)
     - [.empty](#aeroflow-empty)
     - [.expand](#aeroflow-expand)
       - [()](#aeroflow-expand-)
       - [(@expander:function)](#aeroflow-expand-expanderfunction)
       - [(@expander:function, @seed)](#aeroflow-expand-expanderfunction-seed)
       - [(@expander:!function)](#aeroflow-expand-expanderfunction)
     - [.just](#aeroflow-just)
       - [()](#aeroflow-just-)
       - [(@value:aeroflow)](#aeroflow-just-valueaeroflow)
       - [(@value:array)](#aeroflow-just-valuearray)
       - [(@value:function)](#aeroflow-just-valuefunction)
       - [(@value:iterable)](#aeroflow-just-valueiterable)
       - [(@value:promise)](#aeroflow-just-valuepromise)
     - [#average](#aeroflow-average)
       - [()](#aeroflow-average-)
     - [#count](#aeroflow-count)
       - [()](#aeroflow-count-)
     - [#max](#aeroflow-max)
       - [()](#aeroflow-max-)
     - [#min](#aeroflow-min)
       - [()](#aeroflow-min-)
<a name=""></a>
 
<a name="aeroflow"></a>
# aeroflow
Is function.

```js
return execute(function (context) {}, /* arrange (optional) */
function (context) {
  return aeroflow;
}, /* act */
function (context) {
  return expect(context.result).to.be.a('function');
} /* assert */);
```

<a name="aeroflow-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Emits done(true, @context) notification.

```js
return execute(function (context) {
  return aeroflow().notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Does not emit next notification.

```js
return execute(function (context) {
  return aeroflow().notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

<a name="aeroflow-sourceaeroflow"></a>
## (@source:aeroflow)
Emits done(true, @context) notification when @source is empty.

```js
return execute(function (context) {
  return aeroflow(aeroflow.empty).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits done(true, @context) notification when @source is not empty and has been entirely enumerated.

```js
return execute(function (context) {
  return aeroflow(aeroflow([1, 2])).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits done(false, @context) notification when @source is not empty but has not been entirely enumerated.

```js
return execute(function (context) {
  return aeroflow(aeroflow([1, 2])).take(1).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(false, context);
});
```

Does not emit next notification when @source is empty.

```js
return execute(function (context) {
  return aeroflow(aeroflow.empty).notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

Emits several next(@value, @index, @context) notifications for each @value from @source.

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(aeroflow(context.values)).notify(context.spy).run(context);
}, function (context) {
  return context.values.forEach(function (value, index) {
    return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context);
  });
});
```

<a name="aeroflow-sourcearray"></a>
## (@source:array)
Emits done(true, @context) notification when @source is empty.

```js
return execute(function (context) {
  return aeroflow([]).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWith(true, context);
});
```

Emits done(true, @context) notification when @source is not empty and has been entirely enumerated.

```js
return execute(function (context) {
  return aeroflow([1, 2]).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits done(false, @context) notification when @source is not empty and has not been entirely enumerated.

```js
return execute(function (context) {
  return aeroflow([1, 2]).take(1).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(false, context);
});
```

Does not emit next notification when @source is empty.

```js
return execute(function (context) {
  return aeroflow([]).notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

Emits several next(@value, @index, @context) notifications for each subsequent @value from @source.

```js
return execute(function (context) {
  return context.source = [1, 2];
}, function (context) {
  return aeroflow(context.source).notify(context.spy).run(context);
}, function (context) {
  return context.source.forEach(function (value, index) {
    return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context);
  });
});
```

<a name="aeroflow-sourcedate"></a>
## (@source:date)
Emits done(true, @context) notification.

```js
return execute(function (context) {
  return context.source = new Date();
}, function (context) {
  return aeroflow(context.source).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits next(@source, 0, @context) notification.

```js
return execute(function (context) {
  return context.source = new Date();
}, function (context) {
  return aeroflow(context.source).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context);
});
```

<a name="aeroflow-sourceerror"></a>
## (@source:error)
Emits done(true, @context) notification.

```js
return execute(function (context) {
  return context.source = new Error('test');
}, function (context) {
  return aeroflow(context.source).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.source, context);
});
```

Does not emit next notification.

```js
return execute(function (context) {
  return aeroflow(new Error('test')).notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

<a name="aeroflow-sourcefunction"></a>
## (@source:function)
Calls @source(context data).

```js
return execute(function (context) {
  return context = 42;
}, function (context) {
  return aeroflow(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWith(context);
});
```

Emits done(true, @context) notification when @source does not throw.

```js
return execute(function (context) {
  return aeroflow(context.nop).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits done(@error, @context) notification when @source throws @error.

```js
return execute(function (context) {
  return context.error = new Error('test');
}, function (context) {
  return aeroflow(function () {
    throw context.error;
  }).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.error, context);
});
```

Emits next(@value, 0, @context) notification when @source returns @value.

```js
return execute(function (context) {
  return context.value = 42;
}, function (context) {
  return aeroflow(function () {
    return context.value;
  }).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
});
```

<a name="aeroflow-sourceiterable"></a>
## (@source:iterable)
Emits done(true, @context) notification when source is empty.

```js
return execute(function (context) {
  return aeroflow(new Set()).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits done(true, @context) notification when source is not empty and has been entirely enumerated.

```js
return execute(function (context) {
  return aeroflow(new Set([1, 2])).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits done(false, @context) notification when source is not empty but has not been entirely enumerated.

```js
return execute(function (context) {
  return aeroflow(new Set([1, 2])).take(1).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(false, context);
});
```

Does not emit next notification when source is empty.

```js
return execute(function (context) {
  return aeroflow(new Set()).notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

Emits several next(@value, @index, @context) notifications for each subsequent @value from @source.

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(new Set(context.values)).notify(context.spy).run(context);
}, function (context) {
  return context.values.forEach(function (value, index) {
    return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context);
  });
});
```

<a name="aeroflow-sourcenull"></a>
## (@source:null)
Emits done(true, @context) notification.

```js
return execute(function (context) {
  return aeroflow(null).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits next(@source, 0, @context) notification.

```js
return execute(function (context) {
  return context.source = null;
}, function (context) {
  return aeroflow(context.source).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context);
});
```

<a name="aeroflow-sourcepromise"></a>
## (@source:promise)
Emits done(true, @context) notification when @source resolves.

```js
return execute(function (context) {
  return aeroflow(Promise.resolve()).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits done(@error, @context) notification when @source rejects with @error.

```js
return execute(function (context) {
  return context.error = new Error('test');
}, function (context) {
  return aeroflow(Promise.reject(context.error)).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.error, context);
});
```

Emits next(@value, 0, @context) notification when @source resolves with @value.

```js
return execute(function (context) {
  return context.value = 42;
}, function (context) {
  return aeroflow(Promise.resolve(context.value)).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
});
```

Does not emit next notification when @source rejects.

```js
return execute(function (context) {
  return aeroflow(Promise.reject()).notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

<a name="aeroflow-sourcestring"></a>
## (@source:string)
Emits done(true, @context) notification.

```js
return execute(function (context) {
  return aeroflow('test').notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits next(@source, 0, @context) notification.

```js
return execute(function (context) {
  return context.source = 'test';
}, function (context) {
  return aeroflow(context.source).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWith(context.source, 0, context);
});
```

<a name="aeroflow-sourceundefined"></a>
## (@source:undefined)
Emits done(true, @context) notification.

```js
return execute(function (context) {
  return aeroflow(undefined).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits next(@source, 0, @context) notification.

```js
return execute(function (context) {
  return context.source = undefined;
}, function (context) {
  return aeroflow(context.source).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context);
});
```

<a name="aeroflow-sources"></a>
## (...@sources)
Emits serveral next(@value, @index, @context) notifications for each subsequent @value from @sources.

```js
return execute(function (context) {
  var values = context.values = [true, new Date(), null, 42, 'test', Symbol('test'), undefined];
  context.sources = [values[0], [values[1]], new Set([values[2], values[3]]), function () {
    return values[4];
  }, Promise.resolve(values[5]), new Promise(function (resolve) {
    return setTimeout(function () {
      return resolve(values[6]);
    });
  })];
}, function (context) {
  return aeroflow.apply(undefined, _toConsumableArray(context.sources)).notify(context.spy).run(context);
}, function (context) {
  return context.values.forEach(function (value, index) {
    return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context);
  });
});
```

<a name="aeroflow-empty"></a>
## .empty
Gets instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty;
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Emits done(true, @context) notification.

```js
return execute(function (context) {
  return aeroflow.empty.notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Does not emit next notification.

```js
return execute(function (context) {
  return aeroflow.empty.notify(context.spy).run();
}, function (context) {
  return expect(context.spy).not.to.have.been.called;
});
```

<a name="aeroflow-expand"></a>
## .expand
Is static method.

```js
return execute(function (context) {
  return aeroflow.expand;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-expand-"></a>
### ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.expand();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

<a name="aeroflow-expand-expanderfunction"></a>
### (@expander:function)
Calls @expander(undefined, 0, @context) at first iteration.

```js
return execute(function (context) {
  return aeroflow.expand(context.spy).take(1).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(undefined, 0, context);
});
```

Calls @expander(@value, @index, @context) at subsequent iterations with @value previously returned by @expander.

```js
return execute(function (context) {
  context.expander = function (value) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    context.spy.apply(context, [value].concat(args));
    return value ? value + 1 : 1;
  };
  context.iterations = 3;
}, function (context) {
  return aeroflow.expand(context.expander).take(context.iterations).run(context);
}, function (context) {
  return Array(context.iterations).fill(0).forEach(function (_, index) {
    return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(index || undefined, index, context);
  });
});
```

Emits done(@error, @context) notification with @error thrown by @expander.

```js
return execute(function (context) {
  context.error = new Error('test');
  context.expander = function () {
    throw context.error;
  };
}, function (context) {
  return aeroflow(context.expander).notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.error, context);
});
```

Emits next(@value, @index, @context) notification for each @value returned by @expander.

```js
return execute(function (context) {
  context.expander = function (value) {
    return value ? value + 1 : 1;
  };
  context.iterations = 3;
}, function (context) {
  return aeroflow.expand(context.expander).take(context.iterations).notify(context.spy).run(context);
}, function (context) {
  return Array(context.iterations).fill(0).forEach(function (_, index) {
    return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(index + 1, index, context);
  });
});
```

<a name="aeroflow-expand-expanderfunction-seed"></a>
### (@expander:function, @seed)
Calls @expander(@seed, 0, @context) at first iteration.

```js
return execute(function (context) {
  return context.seed = 'test';
}, function (context) {
  return aeroflow.expand(context.spy, context.seed).take(1).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.seed, 0, context);
});
```

<a name="aeroflow-expand-expanderfunction"></a>
### (@expander:!function)
Emits next(@expander, 0, @context) notification.

```js
return execute(function (context) {
  return context.expander = 'test';
}, function (context) {
  return aeroflow.expand(context.expander).take(1).notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.been.calledWith(context.expander);
});
```

<a name="aeroflow-just"></a>
## .just
Is static method.

```js
return execute(function (context) {
  return aeroflow.just;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-just-"></a>
### ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.just();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Emits done(true, @context) notification.

```js
return execute(function (context) {
  return aeroflow.just().notify(context.nop, context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(true, context);
});
```

Emits next(undefined, 0, @context) notification.

```js
return execute(function (context) {
  return aeroflow.just().notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(undefined, 0, context);
});
```

<a name="aeroflow-just-valueaeroflow"></a>
### (@value:aeroflow)
Emits next(@value, 0, @context) notification.

```js
return execute(function (context) {
  return context.value = aeroflow.empty;
}, function (context) {
  return aeroflow.just(context.value).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
});
```

<a name="aeroflow-just-valuearray"></a>
### (@value:array)
Emits next(@value, 0, @context) notification.

```js
return execute(function (context) {
  return context.value = [];
}, function (context) {
  return aeroflow.just(context.value).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
});
```

<a name="aeroflow-just-valuefunction"></a>
### (@value:function)
Emits next(@value, 0, @context) notification.

```js
return execute(function (context) {
  return context.value = Function();
}, function (context) {
  return aeroflow.just(context.value).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
});
```

<a name="aeroflow-just-valueiterable"></a>
### (@value:iterable)
Emits next(@value, 0, @context) notification.

```js
return execute(function (context) {
  return context.value = new Set();
}, function (context) {
  return aeroflow.just(context.value).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
});
```

<a name="aeroflow-just-valuepromise"></a>
### (@value:promise)
Emits next(@value, 0, @context) notification.

```js
return execute(function (context) {
  return context.value = Promise.resolve();
}, function (context) {
  return aeroflow.just(context.value).notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
});
```

<a name="aeroflow-average"></a>
## #average
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.average;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-average-"></a>
### ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.average();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Does not emit next notification when flow is empty.

```js
return execute(function (context) {
  return aeroflow.empty.average().notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

Emits next(@value, 0, @context) notification when flow emits single numeric @value.

```js
return execute(function (context) {
  return context.value = 42;
}, function (context) {
  return aeroflow(context.value).average().notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
});
```

Emits next(@average, 0, @context) notification with @average of serveral numeric values emitted by flow.

```js
return execute(function (context) {
  return context.values = [1, 2, 5];
}, function (context) {
  return aeroflow(context.values).average().notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(context.values.reduce(function (sum, value) {
    return sum + value;
  }, 0) / context.values.length, 0, context);
});
```

Emits next(NaN, 0, @context) notification when flow emits at least one value not convertible to numeric.

```js
return execute(function (context) {
  return context.values = [1, 'test', 2];
}, function (context) {
  return aeroflow(context.values).average().notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWithExactly(NaN, 0, context);
});
```

<a name="aeroflow-count"></a>
## #count
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.count;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-count-"></a>
### ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.count();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Emits next(0, 0, @context) notification when flow is empty.

```js
return execute(function (context) {
  return aeroflow.empty.count().notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWith(0, 0, context);
});
```

Emits next(@count, 0, @context) notification with @count of values emitted by flow.

```js
return execute(function (context) {
  return context.values = [1, 2, 3];
}, function (context) {
  return aeroflow(context.values).count().notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWith(context.values.length, 0, context);
});
```

<a name="aeroflow-max"></a>
## #max
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.max;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-max-"></a>
### ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.max();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Does not emit next notification when flow is empty.

```js
return execute(function (context) {
  return aeroflow.empty.max().notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

Emits next(@max, 0, @context) notification with @max as maximum value emitted by flow when flow emits numeric values.

```js
return execute(function (context) {
  return context.values = [1, 3, 2];
}, function (context) {
  return aeroflow(context.values).max().notify(context.spy).run(context);
}, function (context) {
  var _Math;
  return expect(context.spy).to.have.been.calledWithExactly((_Math = Math).max.apply(_Math, _toConsumableArray(context.values)), 0, context);
});
```

Emits next(@max, 0, @context) notification with @max as maximum value emitted by flow when flow emits string values.

```js
return execute(function (context) {
  return context.values = ['a', 'c', 'b'];
}, function (context) {
  return aeroflow(context.values).max().notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWith(context.values.reduce(function (max, value) {
    return value > max ? value : max;
  }), 0, context);
});
```

<a name="aeroflow-min"></a>
## #min
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.min;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-min-"></a>
### ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.min();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Does not emit next notification when flow is empty.

```js
return execute(function (context) {
  return aeroflow.empty.min().notify(context.spy).run();
}, function (context) {
  return expect(context.spy).to.have.not.been.called;
});
```

Emits next(@min, 0, @context) notification with @min as minimum value emitted by flow when flow emits numeric values.

```js
return execute(function (context) {
  return context.values = [1, 3, 2];
}, function (context) {
  return aeroflow(context.values).min().notify(context.spy).run(context);
}, function (context) {
  var _Math;
  return expect(context.spy).to.have.been.calledWithExactly((_Math = Math).min.apply(_Math, _toConsumableArray(context.values)), 0, context);
});
```

Emits next(@min, 0, @context) notification with @min as minimum value emitted by flow when flow emits string values.

```js
return execute(function (context) {
  return context.values = ['a', 'c', 'b'];
}, function (context) {
  return aeroflow(context.values).min().notify(context.spy).run(context);
}, function (context) {
  return expect(context.spy).to.have.been.calledWith(context.values.reduce(function (min, value) {
    return value < min ? value : min;
  }), 0, context);
});
```

