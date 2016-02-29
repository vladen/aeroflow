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
     - [#catch](#aeroflow-catch)
       - [()](#aeroflow-catch-)
       - [(@alternative:array)](#aeroflow-catch-alternativearray)
       - [(@alternative:function)](#aeroflow-catch-alternativefunction)
       - [(@alternative:string)](#aeroflow-catch-alternativestring)
     - [#coalesce](#aeroflow-coalesce)
       - [()](#aeroflow-coalesce-)
       - [(@alternative:array)](#aeroflow-coalesce-alternativearray)
       - [(@alternative:function)](#aeroflow-coalesce-alternativefunction)
       - [(@alternative:promise)](#aeroflow-coalesce-alternativepromise)
       - [(@alternative:string)](#aeroflow-coalesce-alternativestring)
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

Emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflow-sourceaeroflow"></a>
## (@source:aeroflow)
When @source is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow(aeroflow.empty).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When @source is not empty, emits "next" for each serial value from @source, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(aeroflow(context.values)).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-sourcearray"></a>
## (@source:array)
When @source is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow([]).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When @source is not empty, emits "next" for each serial value from @source, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-sourcedate"></a>
## (@source:date)
Emits single "next" with @source, then single greedy "done".

```js
return execute(function (context) {
  return context.source = new Date();
}, function (context) {
  return aeroflow(context.source).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-sourceerror"></a>
## (@source:error)
Emits only single faulty "done" with @source.

```js
return execute(function (context) {
  return aeroflow(context.error).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
});
```

<a name="aeroflow-sourcefunction"></a>
## (@source:function)
Calls @source once with context data.

```js
return execute(function (context) {
  return context.source = context.spy();
}, function (context) {
  return aeroflow(context.source).run(context.data);
}, function (context) {
  expect(context.source).to.have.been.calledOnce;
  expect(context.source).to.have.been.calledWith(context.data);
});
```

When @source returns value, emits single "next" with value, then single greedy "done".

```js
return execute(function (context) {
  return aeroflow(function () {
    return context.data;
  }).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.data);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

When @source throws, emits only single faulty "done" with thrown error.

```js
return execute(function (context) {
  return aeroflow(context.fail).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
});
```

<a name="aeroflow-sourceiterable"></a>
## (@source:iterable)
When @source is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow(new Set()).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When @source is not empty, emits "next" for each serial value from @source, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(new Set(context.values)).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-sourcenull"></a>
## (@source:null)
Emits single "next" with @source, then single greedy "done".

```js
return execute(function (context) {
  return context.source = null;
}, function (context) {
  return aeroflow(context.source).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-sourcepromise"></a>
## (@source:promise)
When @source rejects, emits single faulty "done" with rejected error.

```js
return execute(function (context) {
  return aeroflow(Promise.reject(context.error)).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
});
```

When @source resolves, emits single "next" with resolved value, then single greedy "done".

```js
return execute(function (context) {
  return context.value = 42;
}, function (context) {
  return aeroflow(Promise.resolve(context.value)).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-sourcestring"></a>
## (@source:string)
Emits single "next" with @source, then single greedy "done".

```js
return execute(function (context) {
  return context.source = 'test';
}, function (context) {
  return aeroflow(context.source).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-sourceundefined"></a>
## (@source:undefined)
Emits single "next" with @source, then single greedy "done".

```js
return execute(function (context) {
  return context.source = undefined;
}, function (context) {
  return aeroflow(context.source).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-sources"></a>
## (...@sources)
Emits "next" with each serial value from @sources, then single greedy "done".

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
  return aeroflow.apply(undefined, _toConsumableArray(context.sources)).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
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

Emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
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
Calls @expander with undefined, 0  and context data on first iteration.

```js
return execute(function (context) {
  return context.expander = context.spy();
}, function (context) {
  return aeroflow.expand(context.expander).take(1).run(context.data);
}, function (context) {
  return expect(context.expander).to.have.been.calledWithExactly(undefined, 0, context.data);
});
```

Calls @expander with value previously returned by @expander, iteration index and context data on subsequent iterations.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.expander = context.spy(function (_, index) {
    return context.values[index];
  });
}, function (context) {
  return aeroflow.expand(context.expander).take(context.values.length + 1).run(context.data);
}, function (context) {
  return [undefined].concat(context.values).forEach(function (value, index) {
    return expect(context.expander.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
  });
});
```

If @expander throws, emits only single faulty "done" with thrown error.

```js
return execute(function (context) {
  return context.expander = context.fail;
}, function (context) {
  return aeroflow(context.expander).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
});
```

Emits "next" for each serial value returned by @expander, then not being infinite, lazy "done".

```js
return execute(function (context) {
  context.values = [1, 2, 3];
  context.expander = context.spy(function (_, index) {
    return context.values[index];
  });
}, function (context) {
  return aeroflow.expand(context.expander).take(context.values.length).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-expand-expanderfunction-seed"></a>
### (@expander:function, @seed)
Calls @expander with @seed on first iteration.

```js
return execute(function (context) {
  context.expander = context.spy();
  context.seed = 'test';
}, function (context) {
  return aeroflow.expand(context.expander, context.seed).take(1).run();
}, function (context) {
  return expect(context.expander).to.have.been.calledWith(context.seed);
});
```

<a name="aeroflow-expand-expanderfunction"></a>
### (@expander:!function)
Emits "next" with @expander.

```js
return execute(function (context) {
  return context.expander = 'test';
}, function (context) {
  return aeroflow.expand(context.expander).take(1).run(context.next);
}, function (context) {
  return expect(context.next).to.have.been.calledWith(context.expander);
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

<a name="aeroflow-just-valueaeroflow"></a>
### (@value:aeroflow)
Emits single "next" with @value, then single greedy "done".

```js
return execute(function (context) {
  return context.value = aeroflow.empty;
}, function (context) {
  return aeroflow.just(context.value).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-just-valuearray"></a>
### (@value:array)
Emits single "next" with @value, then single greedy "done".

```js
return execute(function (context) {
  return context.value = [42];
}, function (context) {
  return aeroflow.just(context.value).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-just-valuefunction"></a>
### (@value:function)
Emits single "next" with @value, then single greedy "done".

```js
return execute(function (context) {
  return context.value = Function();
}, function (context) {
  return aeroflow.just(context.value).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-just-valueiterable"></a>
### (@value:iterable)
Emits single "next" with @value, then single greedy "done".

```js
return execute(function (context) {
  return context.value = new Set();
}, function (context) {
  return aeroflow.just(context.value).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-just-valuepromise"></a>
### (@value:promise)
Emits single "next" with @value, then single greedy "done".

```js
return execute(function (context) {
  return context.value = Promise.resolve();
}, function (context) {
  return aeroflow.just(context.value).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
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

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.average().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits numeric values, emits single "next" with average of values, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2, 5];
}, function (context) {
  return aeroflow(context.values).average().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.values.reduce(function (sum, value) {
    return sum + value;
  }, 0) / context.values.length);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

When flow emits some not numeric values, emits single "next" with NaN, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 'test', 2];
}, function (context) {
  return aeroflow(context.values).average().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(NaN);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-catch"></a>
## #catch
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.catch;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-catch-"></a>
### ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.catch();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.catch().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits only error, supresses error and emits only single lazy "done".

```js
return execute(function (context) {
  return aeroflow(context.error).catch().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

When flow emits some values and then error, emits "next" for each serial value before error, then supresses error and emits single lazy "done" ignoring values emitted after error.

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values, context.error, context.values).catch().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-catch-alternativearray"></a>
### (@alternative:array)
When flow emits error, emits "next" for each serial value from @alternative, then single lazy "done".

```js
return execute(function (context) {
  return context.alternative = [1, 2];
}, function (context) {
  return aeroflow(context.error).catch(context.alternative).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.alternative.length);
  context.alternative.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-catch-alternativefunction"></a>
### (@alternative:function)
When flow is empty, does not call @alternative.

```js
return execute(function (context) {
  return context.alternative = context.spy();
}, function (context) {
  return aeroflow.empty.catch(context.alternative).run();
}, function (context) {
  return expect(context.alternative).not.to.have.been.called;
});
```

When flow does not emit error, does not call @alternative.

```js
return execute(function (context) {
  return context.alternative = context.spy();
}, function (context) {
  return aeroflow('test').catch(context.alternative).run();
}, function (context) {
  return expect(context.alternative).not.to.have.been.called;
});
```

When flow emits several values and then error, calls @alternative once with emitted error and context data, then emits "next" for each serial value from result returned by @alternative, then emits single lazy "done".

```js
return execute(function (context) {
  context.values = [1, 2];
  context.alternative = context.spy(context.values);
}, function (context) {
  return aeroflow(context.values, context.error).catch(context.alternative).run(context.next, context.done, context.data);
}, function (context) {
  expect(context.alternative).to.have.been.calledOnce;
  expect(context.alternative).to.have.been.calledWith(context.error, context.data);
  expect(context.next).to.have.callCount(context.values.length * 2);
  context.values.forEach(function (value, index) {
    expect(context.next.getCall(index)).to.have.been.calledWith(value);
    expect(context.next.getCall(index + context.values.length)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-catch-alternativestring"></a>
### (@alternative:string)
When flow emits error, emits "next" with @alternative, then single lazy "done".

```js
return execute(function (context) {
  return context.alternative = 'test';
}, function (context) {
  return aeroflow(context.error).catch(context.alternative).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.alternative);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-coalesce"></a>
## #coalesce
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.coalesce;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-coalesce-"></a>
### ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.coalesce();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.coalesce().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflow-coalesce-alternativearray"></a>
### (@alternative:array)
When flow is empty, emits "next" for each serial value from @alternative, then emits single greedy "done".

```js
return execute(function (context) {
  return context.alternative = [1, 2];
}, function (context) {
  return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.alternative.length);
  context.alternative.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-coalesce-alternativefunction"></a>
### (@alternative:function)
When flow is empty, calls @alternative once with context data, emits single "next" with value returned by @alternative, then emits single greedy "done".

```js
return execute(function (context) {
  context.values = [1, 2];
  context.alternative = context.spy(context.values);
}, function (context) {
  return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done, context.data);
}, function (context) {
  expect(context.alternative).to.have.been.calledOnce;
  expect(context.alternative).to.have.been.calledWith(context.data);
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

When flow emits error, does not call @alternative.

```js
return execute(function (context) {
  return context.alternative = context.spy();
}, function (context) {
  return aeroflow(context.error).coalesce(context.alternative).run();
}, function (context) {
  return expect(context.alternative).to.have.not.been.called;
});
```

When flow emits some values, does not call @alternative.

```js
return execute(function (context) {
  return context.alternative = context.spy();
}, function (context) {
  return aeroflow('test').coalesce(context.alternative).run();
}, function (context) {
  return expect(context.alternative).to.have.not.been.called;
});
```

<a name="aeroflow-coalesce-alternativepromise"></a>
### (@alternative:promise)
When flow is empty, emits single "next" with value resolved by @alternative, then emits single greedy "done".

```js
return execute(function (context) {
  context.value = 42;
  context.alternative = Promise.resolve(context.value);
}, function (context) {
  return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

<a name="aeroflow-coalesce-alternativestring"></a>
### (@alternative:string)
When flow is empty, emits single "next" with @alternative, then emits single greedy "done".

```js
return execute(function (context) {
  return context.alternative = 'test';
}, function (context) {
  return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.alternative);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
});
```

