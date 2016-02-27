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

Emits only single "done".

```js
return execute(function (context) {
  return aeroflow().notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.next).to.have.not.been.called;
});
```

<a name="aeroflow-sourceaeroflow"></a>
## (@source:aeroflow)
When @source is empty, emits only single "done".

```js
return execute(function (context) {
  return aeroflow(aeroflow.empty).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.next).to.have.not.been.called;
});
```

When @source is not empty, emits "next" for each value from @source, then single "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(aeroflow(context.values)).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
});
```

<a name="aeroflow-sourcearray"></a>
## (@source:array)
When @source is empty, emits only single "done".

```js
return execute(function (context) {
  return aeroflow([]).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.next).to.have.not.been.called;
});
```

When @source is not empty, emits "next" for each value from @source, then "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledAfter(context.next);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
});
```

<a name="aeroflow-sourcedate"></a>
## (@source:date)
Emits single "next" with @source, then single "done".

```js
return execute(function (context) {
  return context.source = new Date();
}, function (context) {
  return aeroflow(context.source).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
});
```

<a name="aeroflow-sourceerror"></a>
## (@source:error)
Emits only single "done" with @source.

```js
return execute(function (context) {
  return aeroflow(context.error).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
  expect(context.next).to.have.not.been.called;
});
```

<a name="aeroflow-sourcefunction"></a>
## (@source:function)
Calls @source once with context data.

```js
return execute(function (context) {
  return aeroflow(context.fake).run(context.data);
}, function (context) {
  expect(context.fake).to.have.been.calledOnce;
  expect(context.fake).to.have.been.calledWith(context.data);
});
```

When @source returns value, emits single "next" with value, then single "done".

```js
return execute(function (context) {
  return aeroflow(function () {
    return context.data;
  }).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.data);
});
```

When @source throws, emits only single "done" with error.

```js
return execute(function (context) {
  return aeroflow(context.fail).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
  expect(context.next).to.have.not.been.called;
});
```

<a name="aeroflow-sourceiterable"></a>
## (@source:iterable)
When @source is empty, emits only single "done".

```js
return execute(function (context) {
  return aeroflow(new Set()).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.next).to.have.not.been.called;
});
```

When @source is not empty, emits "next" for each value from @source, then single "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(new Set(context.values)).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
});
```

<a name="aeroflow-sourcenull"></a>
## (@source:null)
Emits single "next" with @source, then single "done".

```js
return execute(function (context) {
  return context.source = null;
}, function (context) {
  return aeroflow(context.source).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
});
```

<a name="aeroflow-sourcepromise"></a>
## (@source:promise)
When @source rejects, emits single "done" with rejected error.

```js
return execute(function (context) {
  return aeroflow(Promise.reject(context.error)).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
  expect(context.next).to.have.not.been.called;
});
```

When @source resolves, emits single "next" with resolved value, then single "done".

```js
return execute(function (context) {
  return context.value = 42;
}, function (context) {
  return aeroflow(Promise.resolve(context.value)).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
});
```

<a name="aeroflow-sourcestring"></a>
## (@source:string)
Emits single "next" with @source, then single "done".

```js
return execute(function (context) {
  return context.source = 'test';
}, function (context) {
  return aeroflow(context.source).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
});
```

<a name="aeroflow-sourceundefined"></a>
## (@source:undefined)
Emits single "next" with @source, then single "done".

```js
return execute(function (context) {
  return context.source = undefined;
}, function (context) {
  return aeroflow(context.source).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
});
```

<a name="aeroflow-sources"></a>
## (...@sources)
Emits "next" for each value from @sources, then single "done".

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
  return aeroflow.apply(undefined, _toConsumableArray(context.sources)).notify(context.next, context.done).run();
}, function (context) {
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledAfter(context.next);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
});
```

