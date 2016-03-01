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
   - [.empty](#empty)
   - [.expand](#expand)
     - [()](#expand-)
     - [(@expander:function)](#expand-expanderfunction)
     - [(@expander:function, @seed)](#expand-expanderfunction-seed)
     - [(@expander:!function)](#expand-expanderfunction)
   - [.just](#just)
     - [()](#just-)
     - [(@value:aeroflow)](#just-valueaeroflow)
     - [(@value:array)](#just-valuearray)
     - [(@value:function)](#just-valuefunction)
     - [(@value:iterable)](#just-valueiterable)
     - [(@value:promise)](#just-valuepromise)
   - [#average](#average)
     - [()](#average-)
   - [#catch](#catch)
     - [()](#catch-)
     - [(@alternative:array)](#catch-alternativearray)
     - [(@alternative:function)](#catch-alternativefunction)
     - [(@alternative:string)](#catch-alternativestring)
   - [#coalesce](#coalesce)
     - [()](#coalesce-)
     - [(@alternative:array)](#coalesce-alternativearray)
     - [(@alternative:function)](#coalesce-alternativefunction)
     - [(@alternative:promise)](#coalesce-alternativepromise)
     - [(@alternative:string)](#coalesce-alternativestring)
   - [#count](#count)
     - [()](#count-)
   - [#every](#every)
     - [()](#every-)
     - [(@condition:function)](#every-conditionfunction)
     - [(@condition:regex)](#every-conditionregex)
     - [(@condition:string)](#every-conditionstring)
   - [#filter](#filter)
     - [()](#filter-)
     - [(@condition:function)](#filter-conditionfunction)
     - [(@condition:regex)](#filter-conditionregex)
     - [(@condition:number)](#filter-conditionnumber)
   - [#map](#map)
     - [()](#map-)
     - [(@mapper:function)](#map-mapperfunction)
     - [(@mapper:number)](#map-mappernumber)
   - [#max](#max)
     - [()](#max-)
   - [#mean](#mean)
     - [()](#mean-)
   - [#min](#min)
     - [()](#min-)
   - [#reduce](#reduce)
     - [()](#reduce-)
     - [(@reducer:function)](#reduce-reducerfunction)
     - [(@reducer:function, @seed:function)](#reduce-reducerfunction-seedfunction)
     - [(@reducer:function, @seed:number)](#reduce-reducerfunction-seednumber)
     - [(@reducer:string)](#reduce-reducerstring)
   - [#reverse](#reverse)
     - [()](#reverse-)
   - [#skip](#skip)
     - [()](#skip-)
     - [(false)](#skip-false)
     - [(true)](#skip-true)
     - [(@condition:function)](#skip-conditionfunction)
     - [(@condition:number)](#skip-conditionnumber)
   - [#some](#some)
     - [()](#some-)
     - [(@condition:function)](#some-conditionfunction)
     - [(@condition:regex)](#some-conditionregex)
     - [(@condition:string)](#some-conditionstring)
   - [#sum](#sum)
     - [()](#sum-)
   - [#take](#take)
     - [()](#take-)
     - [(false)](#take-false)
     - [(true)](#take-true)
     - [(@condition:function)](#take-conditionfunction)
     - [(@condition:number)](#take-conditionnumber)
   - [#toArray](#toarray)
     - [()](#toarray-)
   - [#toSet](#toset)
     - [()](#toset-)
   - [#toString](#tostring)
     - [()](#tostring-)
     - [(@seperator:string)](#tostring-seperatorstring)
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

<a name="empty"></a>
# .empty
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

<a name="expand"></a>
# .expand
Is static method.

```js
return execute(function (context) {
  return aeroflow.expand;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="expand-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.expand();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

<a name="expand-expanderfunction"></a>
## (@expander:function)
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

<a name="expand-expanderfunction-seed"></a>
## (@expander:function, @seed)
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

<a name="expand-expanderfunction"></a>
## (@expander:!function)
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

<a name="just"></a>
# .just
Is static method.

```js
return execute(function (context) {
  return aeroflow.just;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="just-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.just();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

<a name="just-valueaeroflow"></a>
## (@value:aeroflow)
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

<a name="just-valuearray"></a>
## (@value:array)
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

<a name="just-valuefunction"></a>
## (@value:function)
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

<a name="just-valueiterable"></a>
## (@value:iterable)
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

<a name="just-valuepromise"></a>
## (@value:promise)
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

<a name="average"></a>
# #average
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.average;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="average-"></a>
## ()
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

<a name="catch"></a>
# #catch
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.catch;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="catch-"></a>
## ()
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

<a name="catch-alternativearray"></a>
## (@alternative:array)
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

<a name="catch-alternativefunction"></a>
## (@alternative:function)
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

<a name="catch-alternativestring"></a>
## (@alternative:string)
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

<a name="coalesce"></a>
# #coalesce
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.coalesce;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="coalesce-"></a>
## ()
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

<a name="coalesce-alternativearray"></a>
## (@alternative:array)
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

<a name="coalesce-alternativefunction"></a>
## (@alternative:function)
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

<a name="coalesce-alternativepromise"></a>
## (@alternative:promise)
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

<a name="coalesce-alternativestring"></a>
## (@alternative:string)
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

<a name="count"></a>
# #count
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.count;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="count-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.count();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits single "next" with 0, then single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.count().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(0);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow is not empty, emits single "next" with number of values emitted by flow, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2, 3];
}, function (context) {
  return aeroflow(context.values).count().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.values.length);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits error, emits only single faulty "done".

```js
return execute(function (context) {
  return aeroflow(context.error).count().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
});
```

<a name="every"></a>
# #every
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.every;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="every-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.every();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits "next" with true, then single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.every().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several truthy values, emits "next" with true, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [true, 1, 'test'];
}, function (context) {
  return aeroflow(context.values).every().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits at least one falsey value, emits "next" with false, then single lazy "done".

```js
return execute(function (context) {
  return context.values = [true, 1, ''];
}, function (context) {
  return aeroflow(context.values).every().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="every-conditionfunction"></a>
## (@condition:function)
When flow is empty, does not call @condition.

```js
return execute(function (context) {
  return context.condition = context.spy();
}, function (context) {
  return aeroflow.empty.every(context.condition).run();
}, function (context) {
  return expect(context.condition).to.have.not.been.called;
});
```

When flow is not empty, calls @condition with each emitted value, index of value and context data until @condition returns falsey result.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy(function (_, index) {
    return index !== context.values.length - 1;
  });
}, function (context) {
  return aeroflow(context.values, 3).every(context.condition).run(context.data);
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
  });
});
```

When flow emits several values and all values pass the @condition test, emits single "next" with true, then single greedy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return value > 0;
  };
  context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).every(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values and at least one value does not pass the @condition test, emits single "next" with false, then single lazy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return value > 0;
  };
  context.values = [1, 0];
}, function (context) {
  return aeroflow(context.values).every(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="every-conditionregex"></a>
## (@condition:regex)
When flow emits several values and all values pass the @condition test, emits single "next" with true, then single greedy "done".

```js
return execute(function (context) {
  context.condition = /a/;
  context.values = ['a', 'aa'];
}, function (context) {
  return aeroflow(context.values).every(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values and at least one value does not pass the @condition test, emits single "next" with false, then single lazy "done".

```js
return execute(function (context) {
  context.condition = /a/;
  context.values = ['a', 'b'];
}, function (context) {
  return aeroflow(context.values).every(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="every-conditionstring"></a>
## (@condition:string)
When flow emits several values equal to @condition, emits single "next" with true, then single greedy "done".

```js
return execute(function (context) {
  context.condition = 1;
  context.values = [1, 1];
}, function (context) {
  return aeroflow(context.values).every(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values not equal to @condition, emits single "next" with false, then single lazy "done".

```js
return execute(function (context) {
  context.condition = 1;
  context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).every(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="filter"></a>
# #filter
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.filter;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="filter-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.filter();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.filter().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow is not empty, emits "next" for each truthy value, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [0, 1, false, true, '', 'test'];
}, function (context) {
  return aeroflow(context.values).filter().run(context.next, context.done);
}, function (context) {
  var filtered = context.values.filter(function (value) {
    return !!value;
  });
  expect(context.next).to.have.callCount(filtered.length);
  filtered.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="filter-conditionfunction"></a>
## (@condition:function)
When flow is empty, does not call @condition.

```js
return execute(function (context) {
  return context.condition = context.spy();
}, function (context) {
  return aeroflow.empty.filter(context.condition).run();
}, function (context) {
  return expect(context.condition).to.have.not.been.called;
});
```

When flow is not empty, calls @condition with each emitted value, index of value and context data.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy();
}, function (context) {
  return aeroflow(context.values).filter(context.condition).run(context.data);
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
  });
});
```

When flow is not empty, emits "next" for each value passing the @condition test, then single greedy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return 0 === value % 2;
  };
  context.values = [1, 2, 3];
}, function (context) {
  return aeroflow(context.values).filter(context.condition).run(context.next, context.done);
}, function (context) {
  var filtered = context.values.filter(context.condition);
  expect(context.next).to.have.callCount(filtered.length);
  filtered.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="filter-conditionregex"></a>
## (@condition:regex)
When flow is not empty, emits "next" for each value passing the @condition test, then single greedy "done".

```js
return execute(function (context) {
  context.condition = /b/;
  context.values = ['a', 'b', 'c'];
}, function (context) {
  return aeroflow(context.values).filter(context.condition).run(context.next, context.done);
}, function (context) {
  var filtered = context.values.filter(function (value) {
    return context.condition.test(value);
  });
  expect(context.next).to.have.callCount(filtered.length);
  filtered.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="filter-conditionnumber"></a>
## (@condition:number)
When flow is not empty, emits "next" for each value equal to @condition, then single greedy "done".

```js
return execute(function (context) {
  context.condition = 2;
  context.values = [1, 2, 3];
}, function (context) {
  return aeroflow(context.values).filter(context.condition).run(context.next, context.done);
}, function (context) {
  var filtered = context.values.filter(function (value) {
    return value === context.condition;
  });
  expect(context.next).to.have.callCount(filtered.length);
  filtered.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="map"></a>
# #map
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.map;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="map-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.map();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.map().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow is not empty, emits "next" for each emitted value, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).map().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="map-mapperfunction"></a>
## (@mapper:function)
When flow is empty, does not call @mapper.

```js
return execute(function (context) {
  return context.mapper = context.spy();
}, function (context) {
  return aeroflow.empty.map(context.mapper).run();
}, function (context) {
  return expect(context.mapper).to.have.not.been.called;
});
```

When flow is not empty, calls @mapper with each emitted value, index of value and context data.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.mapper = context.spy();
}, function (context) {
  return aeroflow(context.values).map(context.mapper).run(context.data);
}, function (context) {
  expect(context.mapper).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.mapper.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
  });
});
```

When flow is not empty, emits "next" for each emitted value with result returned by @mapper, then single greedy "done".

```js
return execute(function (context) {
  context.mapper = function (value) {
    return -value;
  };
  context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).map(context.mapper).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(context.mapper(value));
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="map-mappernumber"></a>
## (@mapper:number)
When flow is not empty, emits "next" for each emitted value with @mapper instead of value, then single greedy "done".

```js
return execute(function (context) {
  context.mapper = 42;
  context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).map(context.mapper).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (_, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(context.mapper);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="max"></a>
# #max
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.max;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="max-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.max();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.max().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several numeric values, emits single "next" with maximum emitted value, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 3, 2];
}, function (context) {
  return aeroflow(context.values).max().run(context.next, context.done);
}, function (context) {
  var _Math;
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith((_Math = Math).max.apply(_Math, _toConsumableArray(context.values)));
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several string values, emits single "next" with emitted value, then single greedy "done".

```js
return execute(function (context) {
  return context.values = ['a', 'c', 'b'];
}, function (context) {
  return aeroflow(context.values).max().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.values.reduce(function (max, value) {
    return value > max ? value : max;
  }));
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="mean"></a>
# #mean
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.mean;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="mean-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.mean();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.mean().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several numeric values, emits single "next" with mean emitted value, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 3, 2];
}, function (context) {
  return aeroflow(context.values).mean().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.values.sort()[Math.floor(context.values.length / 2)]);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="min"></a>
# #min
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.min;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="min-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.min();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.min().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several numeric values, emits single "next" with maximum emitted value, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 3, 2];
}, function (context) {
  return aeroflow(context.values).min().run(context.next, context.done);
}, function (context) {
  var _Math;
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith((_Math = Math).min.apply(_Math, _toConsumableArray(context.values)));
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several string values, emits single "next" with minnimum emitted value, then single greedy "done".

```js
return execute(function (context) {
  return context.values = ['a', 'c', 'b'];
}, function (context) {
  return aeroflow(context.values).min().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.values.reduce(function (min, value) {
    return value < min ? value : min;
  }));
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="reduce"></a>
# #reduce
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.reduce;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="reduce-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.reduce();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.reduce().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values, emits single "next" with first emitted value, then emits single greedy "done".

```js
return execute(function (context) {
  return context.value = 1;
}, function (context) {
  return aeroflow(context.value, 2).reduce().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="reduce-reducerfunction"></a>
## (@reducer:function)
When flow is empty, does not call @reducer.

```js
return execute(function (context) {
  return context.reducer = context.spy();
}, function (context) {
  return aeroflow.empty.reduce(context.reducer).run();
}, function (context) {
  return expect(context.reducer).to.have.not.been.called;
});
```

When flow emits single value, does not call @reducer.

```js
return execute(function (context) {
  return context.reducer = context.spy();
}, function (context) {
  return aeroflow(1).reduce(context.reducer).run();
}, function (context) {
  return expect(context.reducer).to.have.not.been.called;
});
```

When flow emits several values, calls @reducer with first emitted value, second emitted value, 0 and context data on first iteration.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.reducer = context.spy();
}, function (context) {
  return aeroflow(context.values).reduce(context.reducer).run(context.data);
}, function (context) {
  return expect(context.reducer).to.have.been.calledWithExactly(context.values[0], context.values[1], 0, context.data);
});
```

When flow is not empty, calls @reducer with result returned by @reducer on previous iteration, emitted value, index of value and context data on next iterations.

```js
return execute(function (context) {
  context.values = [1, 2, 3];
  context.reducer = context.spy(function (_, value) {
    return value;
  });
}, function (context) {
  return aeroflow(context.values).reduce(context.reducer).run(context.data);
}, function (context) {
  expect(context.reducer).to.have.callCount(context.values.length - 1);
  context.values.slice(0, -1).forEach(function (value, index) {
    return expect(context.reducer.getCall(index)).to.have.been.calledWithExactly(value, context.values[index + 1], index, context.data);
  });
});
```

When flow emits several values, emits single "next" with last value returned by @reducer, then emits single greedy "done".

```js
return execute(function (context) {
  context.value = 3;
  context.reducer = context.spy(function (_, value) {
    return value;
  });
}, function (context) {
  return aeroflow(1, 2, context.value).reduce(context.reducer).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="reduce-reducerfunction-seedfunction"></a>
## (@reducer:function, @seed:function)
When flow is not empty, calls @seed with context data, calls @reducer with result returned by @seed, first emitted value, 0 and context data on first iteration.

```js
return execute(function (context) {
  context.value = 42;
  context.seed = context.spy(function () {
    return context.value;
  });
  context.reducer = context.spy();
}, function (context) {
  return aeroflow(context.value).reduce(context.reducer, context.seed).run(context.data);
}, function (context) {
  expect(context.seed).to.have.been.calledWithExactly(context.data);
  expect(context.reducer).to.have.been.calledWithExactly(context.value, context.value, 0, context.data);
});
```

<a name="reduce-reducerfunction-seednumber"></a>
## (@reducer:function, @seed:number)
When flow is not empty, calls @reducer with @seed, first emitted value, 0 and context data on first iteration.

```js
return execute(function (context) {
  context.seed = 1;
  context.value = 2;
  context.reducer = context.spy();
}, function (context) {
  return aeroflow(context.value).reduce(context.reducer, context.seed).run(context.data);
}, function (context) {
  return expect(context.reducer).to.have.been.calledWithExactly(context.seed, context.value, 0, context.data);
});
```

<a name="reduce-reducerstring"></a>
## (@reducer:string)
When flow emits several values, emits single "next" with @reducer, then emits single greedy "done".

```js
return execute(function (context) {
  return context.reducer = 42;
}, function (context) {
  return aeroflow(1, 2).reduce(context.reducer).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.reducer);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="reverse"></a>
# #reverse
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.reverse;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="reverse-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.reverse();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.reverse().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow is not empty, emits "next" for each emitted value in reverse order, then emits single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2, 3];
}, function (context) {
  return aeroflow(context.values).reverse().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(context.values.length - index - 1)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="skip"></a>
# #skip
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.skip;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="skip-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.skip();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.skip().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow is not empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow(42).skip().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="skip-false"></a>
## (false)
When flow is not empty, emits "next" for each emitted value, then emits single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).skip(false).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="skip-true"></a>
## (true)
When flow is not empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow(42).skip(true).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="skip-conditionfunction"></a>
## (@condition:function)
When flow is empty, does not call @condition.

```js
return execute(function (context) {
  return context.condition = context.spy();
}, function (context) {
  return aeroflow.empty.skip(context.condition).run();
}, function (context) {
  return expect(context.condition).to.have.not.been.called;
});
```

When flow is not empty, calls @condition with each emitted value, index of value and context data while it returns truthy.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy(function (_, index) {
    return index < context.values.length - 1;
  });
}, function (context) {
  return aeroflow(context.values, 3).skip(context.condition).run(context.data);
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
  });
});
```

When flow emits several values, skips values while @condition returns truthy, then emits "next" for all remaining values, then emits single greedy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return value < 2;
  };
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).skip(context.condition).run(context.next, context.done);
}, function (context) {
  var index = context.values.findIndex(function (value) {
    return !context.condition(value);
  });
  expect(context.next).to.have.callCount(context.values.length - index);
  context.values.slice(index).forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="skip-conditionnumber"></a>
## (@condition:number)
When flow emits several values and @condition is positive, skips first @condition of values, then emits "next" for each remaining value, then emits single greedy "done".

```js
return execute(function (context) {
  context.condition = 2;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).skip(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length - context.condition);
  context.values.slice(context.condition).forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values and @condition is negative, emits "next" for each value except the last @condition ones, then emits single greedy "done".

```js
return execute(function (context) {
  context.condition = -2;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).skip(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length + context.condition);
  context.values.slice(0, -context.condition).forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="some"></a>
# #some
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.some;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="some-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.some();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits "next" with false, then single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.some().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several falsey values, emits "next" with false, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [false, 0, ''];
}, function (context) {
  return aeroflow(context.values).some().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits at least one truthy value, emits "next" with true, then single lazy "done".

```js
return execute(function (context) {
  return context.values = [false, 1, ''];
}, function (context) {
  return aeroflow(context.values).some().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="some-conditionfunction"></a>
## (@condition:function)
When flow is empty, does not call @condition.

```js
return execute(function (context) {
  return context.condition = context.spy();
}, function (context) {
  return aeroflow.empty.some(context.condition).run();
}, function (context) {
  return expect(context.condition).to.have.not.been.called;
});
```

When flow is not empty, calls @condition with each emitted value, index of value and context data until @condition returns truthy result.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy(function (_, index) {
    return index === context.values.length - 1;
  });
}, function (context) {
  return aeroflow(context.values, 3).some(context.condition).run(context.data);
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
  });
});
```

When flow emits several values and at least one value passes the @condition test, emits single "next" with true, then single lazy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return value > 0;
  };
  context.values = [0, 1];
}, function (context) {
  return aeroflow(context.values).some(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

When flow emits several values and no values pass the @condition test, emits single "next" with false, then single greedy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return value > 0;
  };
  context.values = [0, -1];
}, function (context) {
  return aeroflow(context.values).some(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="some-conditionregex"></a>
## (@condition:regex)
When flow emits several values and at least one value passes the @condition test, emits single "next" with true, then single lazy "done".

```js
return execute(function (context) {
  context.condition = /b/;
  context.values = ['a', 'b'];
}, function (context) {
  return aeroflow(context.values).some(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

When flow emits several values and no values pass the @condition test, emits single "next" with false, then single greedy "done".

```js
return execute(function (context) {
  context.condition = /b/;
  context.values = ['a', 'aa'];
}, function (context) {
  return aeroflow(context.values).some(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="some-conditionstring"></a>
## (@condition:string)
When flow emits at least one value equal to @condition, emits single "next" with true, then single lazy "done".

```js
return execute(function (context) {
  context.condition = 1;
  context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).some(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(true);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

When flow emits several values not equal to @condition, emits single "next" with false, then single greedy "done".

```js
return execute(function (context) {
  context.condition = 1;
  context.values = [2, 3];
}, function (context) {
  return aeroflow(context.values).some(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(false);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="sum"></a>
# #sum
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.sum;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="sum-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.sum();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.sum().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several numeric values, emits single "next" with sum of emitted values, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 3, 2];
}, function (context) {
  return aeroflow(context.values).sum().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.values.reduce(function (sum, value) {
    return sum + value;
  }, 0));
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits at least one not numeric value, emits single "next" with NaN, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 'test', 2];
}, function (context) {
  return aeroflow(context.values).sum().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(NaN);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="take"></a>
# #take
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.take;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="take-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.take();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.take().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow is not empty, emits "next" for each emitted value, then emits single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).take().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="take-false"></a>
## (false)
When flow is not empty, emits only single lazy "done".

```js
return execute(function (context) {
  return aeroflow('test').take(false).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="take-true"></a>
## (true)
When flow is not empty, emits "next" for each emitted value, then emits single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).take(true).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="take-conditionfunction"></a>
## (@condition:function)
When flow is empty, does not call @condition.

```js
return execute(function (context) {
  return context.condition = context.spy();
}, function (context) {
  return aeroflow.empty.take(context.condition).run();
}, function (context) {
  return expect(context.condition).to.have.not.been.called;
});
```

When flow is not empty, calls @condition with each emitted value, index of value and context data while it returns truthy.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy(function (_, index) {
    return index < context.values.length - 1;
  });
}, function (context) {
  return aeroflow(context.values, 3).take(context.condition).run(context.data);
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
  });
});
```

When flow emits several values, then emits "next" for each emitted value while @condition returns truthy and skips remaining values, then emits single lazy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return value < 3;
  };
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).take(context.condition).run(context.next, context.done);
}, function (context) {
  var index = context.values.findIndex(function (value) {
    return !context.condition(value);
  });
  expect(context.next).to.have.callCount(context.values.length - index);
  context.values.slice(0, index).forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="take-conditionnumber"></a>
## (@condition:number)
When flow emits several values and @condition is positive, emits "next" for each @condition of first values, then emits single lazy "done".

```js
return execute(function (context) {
  context.condition = 2;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).take(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.condition);
  context.values.slice(0, context.condition).forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

When flow emits several values and @condition is negative, skips several values and emits "next" for each of @condition last values, then single greedy "done".

```js
return execute(function (context) {
  context.condition = -2;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).take(context.condition).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(-context.condition);
  context.values.slice(-context.condition).forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="toarray"></a>
# #toArray
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.toArray;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="toarray-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.toArray();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits single "next" with empty array, then emits single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.toArray().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith([]);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow is not empty, emits single "next" with array containing all emitted values, then emits single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).toArray().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.values);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="toset"></a>
# #toSet
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.toSet;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="toset-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.toSet();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits single "next" with empty set, then single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.toSet().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(new Set());
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow is not empty, emits single "next" with set containing all unique emitted values, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 3, 5, 3, 1];
}, function (context) {
  return aeroflow(context.values).toSet().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(new Set(context.values));
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="tostring"></a>
# #toString
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.toString;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="tostring-"></a>
## ()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.toString();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits single "next" with empty string, then single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.toString().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith('');
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits single number, emits single "next" with emitted number converted to string, then single greedy "done".

```js
return execute(function (context) {
  return context.number = 42;
}, function (context) {
  return aeroflow(context.number).toString().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.number.toString());
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits single string, emits single "next" with emitted string, then single greedy "done".

```js
return execute(function (context) {
  return context.string = 'test';
}, function (context) {
  return aeroflow(context.string).toString().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.string);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several numbers, emits single "next" with emitted numbers converted to strings and concatenated via ",", then single greedy "done".

```js
return execute(function (context) {
  return context.numbers = [1, 2];
}, function (context) {
  return aeroflow(context.numbers).toString().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.numbers.join());
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several strings, emits single "next" with emitted strings concatenated via ",", then single greedy "done".

```js
return execute(function (context) {
  return context.strings = ['a', 'b'];
}, function (context) {
  return aeroflow(context.strings).toString().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.strings.join());
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="tostring-seperatorstring"></a>
## (@seperator:string)
When flow emits several strings, emits single "next" with emitted strings concatenated via @separator, then single greedy "done".

```js
return execute(function (context) {
  context.separator = ':';
  context.strings = ['a', 'b'];
}, function (context) {
  return aeroflow(context.strings).toString(context.separator).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.strings.join(context.separator));
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

