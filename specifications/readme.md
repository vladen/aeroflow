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
     - [aeroflow(...@sources)](#aeroflow-aeroflowsources)
   - [aeroflow.empty](#aeroflowempty)
   - [aeroflow.adapters](#aeroflowadapters)
     - [aeroflow.adapters.get](#aeroflowadapters-aeroflowadaptersget)
       - [aeroflow.adapters.get(@source:array)](#aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourcearray)
       - [aeroflow.adapters.get(@source:iterable)](#aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourceiterable)
       - [aeroflow.adapters.get(@source:function)](#aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourcefunction)
       - [aeroflow.adapters.get(@source:promise)](#aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourcepromise)
     - [aeroflow.adapters.use](#aeroflowadapters-aeroflowadaptersuse)
       - [aeroflow.adapters.use(@adapter:function)](#aeroflowadapters-aeroflowadaptersuse-aeroflowadaptersuseadapterfunction)
       - [aeroflow.adapters.use(@class:string, @adapter:function)](#aeroflowadapters-aeroflowadaptersuse-aeroflowadaptersuseclassstring-adapterfunction)
   - [aeroflow.notifiers](#aeroflownotifiers)
     - [aeroflow.adapters.get](#aeroflownotifiers-aeroflowadaptersget)
     - [aeroflow.adapters.use](#aeroflownotifiers-aeroflowadaptersuse)
   - [aeroflow.operators](#aeroflowoperators)
   - [aeroflow.expand](#aeroflowexpand)
     - [aeroflow.expand()](#aeroflowexpand-aeroflowexpand)
     - [aeroflow.expand(@expander:function)](#aeroflowexpand-aeroflowexpandexpanderfunction)
     - [aeroflow.expand(@expander:function, @seed)](#aeroflowexpand-aeroflowexpandexpanderfunction-seed)
     - [aeroflow.expand(@expander:string)](#aeroflowexpand-aeroflowexpandexpanderstring)
   - [aeroflow.just](#aeroflowjust)
     - [aeroflow.just()](#aeroflowjust-aeroflowjust)
     - [aeroflow.just(@value:aeroflow)](#aeroflowjust-aeroflowjustvalueaeroflow)
     - [aeroflow.just(@value:array)](#aeroflowjust-aeroflowjustvaluearray)
     - [aeroflow.just(@value:function)](#aeroflowjust-aeroflowjustvaluefunction)
     - [aeroflow.just(@value:iterable)](#aeroflowjust-aeroflowjustvalueiterable)
     - [aeroflow.just(@value:promise)](#aeroflowjust-aeroflowjustvaluepromise)
   - [aeroflow.random](#aeroflowrandom)
     - [aeroflow.random()](#aeroflowrandom-aeroflowrandom)
     - [aeroflow.random(@maximum:number)](#aeroflowrandom-aeroflowrandommaximumnumber)
     - [aeroflow.random(@minimum:number, @maximum:number)](#aeroflowrandom-aeroflowrandomminimumnumber-maximumnumber)
   - [aeroflow.range](#aeroflowrange)
     - [aeroflow.range()](#aeroflowrange-aeroflowrange)
     - [aeroflow.range(@start)](#aeroflowrange-aeroflowrangestart)
     - [aeroflow.range(@start, @end)](#aeroflowrange-aeroflowrangestart-end)
   - [aeroflow.repeat](#aeroflowrepeat)
     - [aeroflow.repeat()](#aeroflowrepeat-aeroflowrepeat)
     - [aeroflow.repeat(@repeater:function)](#aeroflowrepeat-aeroflowrepeatrepeaterfunction)
     - [aeroflow.repeat(@repeater:function, @delayer:function)](#aeroflowrepeat-aeroflowrepeatrepeaterfunction-delayerfunction)
     - [(@repeater:string)](#aeroflowrepeat-repeaterstring)
   - [aeroflow().average](#aeroflowaverage)
     - [aeroflow().average()](#aeroflowaverage-aeroflowaverage)
   - [aeroflow().catch](#aeroflowcatch)
     - [aeroflow().catch()](#aeroflowcatch-aeroflowcatch)
     - [aeroflow().catch(@alternative:array)](#aeroflowcatch-aeroflowcatchalternativearray)
     - [aeroflow().catch(@alternative:function)](#aeroflowcatch-aeroflowcatchalternativefunction)
     - [aeroflow().catch(@alternative:string)](#aeroflowcatch-aeroflowcatchalternativestring)
   - [aeroflow().coalesce](#aeroflowcoalesce)
     - [aeroflow().coalesce()](#aeroflowcoalesce-aeroflowcoalesce)
     - [aeroflow().coalesce(@alternative:array)](#aeroflowcoalesce-aeroflowcoalescealternativearray)
     - [aeroflow().coalesce(@alternative:function)](#aeroflowcoalesce-aeroflowcoalescealternativefunction)
     - [aeroflow().coalesce(@alternative:promise)](#aeroflowcoalesce-aeroflowcoalescealternativepromise)
     - [aeroflow().coalesce(@alternative:string)](#aeroflowcoalesce-aeroflowcoalescealternativestring)
   - [aeroflow().count](#aeroflowcount)
     - [aeroflow().count()](#aeroflowcount-aeroflowcount)
   - [aeroflow().distinct](#aeroflowdistinct)
     - [aeroflow().distinct()](#aeroflowdistinct-aeroflowdistinct)
     - [aeroflow().distinct(true)](#aeroflowdistinct-aeroflowdistincttrue)
   - [aeroflow().every](#aeroflowevery)
     - [aeroflow().every()](#aeroflowevery-aeroflowevery)
     - [aeroflow().every(@condition:function)](#aeroflowevery-aerofloweveryconditionfunction)
     - [aeroflow().every(@condition:regex)](#aeroflowevery-aerofloweveryconditionregex)
     - [aeroflow().every(@condition:string)](#aeroflowevery-aerofloweveryconditionstring)
   - [aeroflow().filter](#aeroflowfilter)
     - [aeroflow().filter()](#aeroflowfilter-aeroflowfilter)
     - [aeroflow().filter(@condition:function)](#aeroflowfilter-aeroflowfilterconditionfunction)
     - [aeroflow().filter(@condition:regex)](#aeroflowfilter-aeroflowfilterconditionregex)
     - [aeroflow().filter(@condition:number)](#aeroflowfilter-aeroflowfilterconditionnumber)
   - [aeroflow().map](#aeroflowmap)
     - [aeroflow().map()](#aeroflowmap-aeroflowmap)
     - [aeroflow().map(@mapper:function)](#aeroflowmap-aeroflowmapmapperfunction)
     - [aeroflow().map(@mapper:number)](#aeroflowmap-aeroflowmapmappernumber)
   - [aeroflow().max](#aeroflowmax)
     - [aeroflow().max()](#aeroflowmax-aeroflowmax)
   - [aeroflow().mean](#aeroflowmean)
     - [aeroflow().mean()](#aeroflowmean-aeroflowmean)
   - [aeroflow().min](#aeroflowmin)
     - [aeroflow().min()](#aeroflowmin-aeroflowmin)
   - [aeroflow().reduce](#aeroflowreduce)
     - [aeroflow().reduce()](#aeroflowreduce-aeroflowreduce)
     - [aeroflow().reduce(@reducer:function)](#aeroflowreduce-aeroflowreducereducerfunction)
     - [aeroflow().reduce(@reducer:function, @seed:function)](#aeroflowreduce-aeroflowreducereducerfunction-seedfunction)
     - [aeroflow().reduce(@reducer:function, @seed:number)](#aeroflowreduce-aeroflowreducereducerfunction-seednumber)
     - [aeroflow().reduce(@reducer:string)](#aeroflowreduce-aeroflowreducereducerstring)
   - [aeroflow().reverse](#aeroflowreverse)
     - [aeroflow().reverse()](#aeroflowreverse-aeroflowreverse)
   - [aeroflow().skip](#aeroflowskip)
     - [aeroflow().skip()](#aeroflowskip-aeroflowskip)
     - [aeroflow().skip(false)](#aeroflowskip-aeroflowskipfalse)
     - [aeroflow().skip(true)](#aeroflowskip-aeroflowskiptrue)
     - [aeroflow().skip(@condition:function)](#aeroflowskip-aeroflowskipconditionfunction)
     - [aeroflow().skip(@condition:number)](#aeroflowskip-aeroflowskipconditionnumber)
   - [aeroflow().slice](#aeroflowslice)
     - [aeroflow().slice()](#aeroflowslice-aeroflowslice)
     - [aeroflow().slice(@begin:number)](#aeroflowslice-aeroflowslicebeginnumber)
     - [aeroflow().slice(@begin:number, @end:number)](#aeroflowslice-aeroflowslicebeginnumber-endnumber)
   - [aeroflow().some](#aeroflowsome)
     - [aeroflow().some()](#aeroflowsome-aeroflowsome)
     - [aeroflow().some(@condition:function)](#aeroflowsome-aeroflowsomeconditionfunction)
     - [aeroflow().some(@condition:regex)](#aeroflowsome-aeroflowsomeconditionregex)
     - [aeroflow().some(@condition:string)](#aeroflowsome-aeroflowsomeconditionstring)
   - [aeroflow().sum](#aeroflowsum)
     - [aeroflow().sum()](#aeroflowsum-aeroflowsum)
   - [aeroflow().take](#aeroflowtake)
     - [aeroflow().take()](#aeroflowtake-aeroflowtake)
     - [aeroflow().take(false)](#aeroflowtake-aeroflowtakefalse)
     - [aeroflow().take(true)](#aeroflowtake-aeroflowtaketrue)
     - [aeroflow().take(@condition:function)](#aeroflowtake-aeroflowtakeconditionfunction)
     - [aeroflow().take(@condition:number)](#aeroflowtake-aeroflowtakeconditionnumber)
   - [aeroflow().toArray](#aeroflowtoarray)
     - [aeroflow().toArray()](#aeroflowtoarray-aeroflowtoarray)
   - [aeroflow().toSet](#aeroflowtoset)
     - [aeroflow().toSet()](#aeroflowtoset-aeroflowtoset)
   - [aeroflow().toString](#aeroflowtostring)
     - [aeroflow().toString()](#aeroflowtostring-aeroflowtostring)
     - [aeroflow().toString(@seperator:string)](#aeroflowtostring-aeroflowtostringseperatorstring)
<a name=""></a>
 
<a name="aeroflow"></a>
# aeroflow
Is function.

```js
return execute(
/* arrange (optional) */
function (context) {},
/* act */
function (context) {
  return aeroflow;
},
/* assert */
function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflow-aeroflow"></a>
## aeroflow()
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

<a name="aeroflow-aeroflowsourceaeroflow"></a>
## aeroflow(@source:aeroflow)
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

When @source is not empty, emits "next" for each value from @source, then single greedy "done".

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

<a name="aeroflow-aeroflowsourcearray"></a>
## aeroflow(@source:array)
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

When @source is not empty, emits "next" for each value from @source, then single greedy "done".

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

<a name="aeroflow-aeroflowsourcedate"></a>
## aeroflow(@source:date)
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

<a name="aeroflow-aeroflowsourceerror"></a>
## aeroflow(@source:error)
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

<a name="aeroflow-aeroflowsourcefunction"></a>
## aeroflow(@source:function)
Calls @source once.

```js
return execute(function (context) {
  return context.source = context.spy();
}, function (context) {
  return aeroflow(context.source).run();
}, function (context) {
  return expect(context.source).to.have.been.calledOnce;
});
```

If @source returns value, emits single "next" with returned value, then single greedy "done".

```js
return execute(function (context) {
  context.value = 42;
  context.source = function () {
    return context.value;
  };
}, function (context) {
  return aeroflow(context.source).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

If @source throws, emits only single faulty "done" with thrown error.

```js
return execute(function (context) {
  return aeroflow(context.fail).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(context.error);
});
```

<a name="aeroflow-aeroflowsourceiterable"></a>
## aeroflow(@source:iterable)
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

When @source is not empty, emits "next" for each value from @source, then single greedy "done".

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
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflow-aeroflowsourcenull"></a>
## aeroflow(@source:null)
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

<a name="aeroflow-aeroflowsourcepromise"></a>
## aeroflow(@source:promise)
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
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflow-aeroflowsourcestring"></a>
## aeroflow(@source:string)
Emits single "next" with @source, then single greedy "done".

```js
return execute(function (context) {
  return context.source = 'test';
}, function (context) {
  return aeroflow(context.source).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflow-aeroflowsourceundefined"></a>
## aeroflow(@source:undefined)
Emits single "next" with @source, then single greedy "done".

```js
return execute(function (context) {
  return context.source = undefined;
}, function (context) {
  return aeroflow(context.source).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.source);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflow-aeroflowsources"></a>
## aeroflow(...@sources)
Emits "next" with each value from @sources, then single greedy "done".

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
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowempty"></a>
# aeroflow.empty
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
  expect(context.done).to.have.been.calledWithExactly(true);
});
```

<a name="aeroflowadapters"></a>
# aeroflow.adapters
Is static property.

```js
return execute(function (context) {
  return aeroflow.adapters;
}, function (context) {
  return expect(context.result).to.exist;
});
```

<a name="aeroflowadapters-aeroflowadaptersget"></a>
## aeroflow.adapters.get
Is function.

```js
return execute(function (context) {
  return aeroflow.adapters.get;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

Contains indexed iterable adapter.

```js
return execute(function (context) {
  return aeroflow.adapters[0];
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

Contains mapped array adapter.

```js
return execute(function (context) {
  return aeroflow.adapters['Array'];
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

Contains mapped error adapter.

```js
return execute(function (context) {
  return aeroflow.adapters['Error'];
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

Contains mapped function adapter.

```js
return execute(function (context) {
  return aeroflow.adapters['Function'];
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

Contains mapped promise adapter.

```js
return execute(function (context) {
  return aeroflow.adapters['Promise'];
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourcearray"></a>
### aeroflow.adapters.get(@source:array)
Does not resolve adapter function.

```js
return execute(function (context) {
  return aeroflow.adapters.get();
}, function (context) {
  return expect(context.result).to.not.exist;
});
```

<a name="aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourcearray"></a>
### aeroflow.adapters.get(@source:array)
Resolves adapter function for @source.

```js
return execute(function (context) {
  return aeroflow.adapters.get([]);
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourceiterable"></a>
### aeroflow.adapters.get(@source:iterable)
Resolves adapter function for @source.

```js
return execute(function (context) {
  return aeroflow.adapters.get(new Set());
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourcefunction"></a>
### aeroflow.adapters.get(@source:function)
Resolves adapter function for @source.

```js
return execute(function (context) {
  return aeroflow.adapters.get(Function());
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowadapters-aeroflowadaptersget-aeroflowadaptersgetsourcepromise"></a>
### aeroflow.adapters.get(@source:promise)
Resolves adapter function for @source.

```js
return execute(function (context) {
  return aeroflow.adapters.get(Promise.resolve());
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowadapters-aeroflowadaptersuse"></a>
## aeroflow.adapters.use
Is function.

```js
return execute(function (context) {
  return aeroflow.adapters.get;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowadapters-aeroflowadaptersuse-aeroflowadaptersuseadapterfunction"></a>
### aeroflow.adapters.use(@adapter:function)
Registers indexed @adapter and calls it with source when resolves adapter for not mapped class.

```js
return execute(function (context) {
  context.adapter = context.spy();
  context.source = {};
}, function (context) {
  aeroflow.adapters.use(context.adapter);
  aeroflow.adapters.get(context.source);
}, function (context) {
  expect(context.adapter).to.have.been.called;
  expect(context.adapter).to.have.been.calledWith(context.source);
});
```

<a name="aeroflowadapters-aeroflowadaptersuse-aeroflowadaptersuseclassstring-adapterfunction"></a>
### aeroflow.adapters.use(@class:string, @adapter:function)
Registers mapped @adapter and calls it with @source when resolves adapter for instance of @class.

```js
return execute(function (context) {
  context.adapter = context.spy();
  context.class = 'test';
  context.source = _defineProperty({}, Symbol.toStringTag, context.class);
}, function (context) {
  aeroflow.adapters.use(context.class, context.adapter);
  aeroflow.adapters.get(context.source);
}, function (context) {
  expect(context.adapter).to.have.been.called;
  expect(context.adapter).to.have.been.calledWith(context.source);
});
```

<a name="aeroflownotifiers"></a>
# aeroflow.notifiers
Is static property.

```js
return execute(function (context) {
  return aeroflow.notifiers;
}, function (context) {
  return expect(context.result).to.exist;
});
```

<a name="aeroflownotifiers-aeroflowadaptersget"></a>
## aeroflow.adapters.get
Is function.

```js
return execute(function (context) {
  return aeroflow.adapters.get;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflownotifiers-aeroflowadaptersuse"></a>
## aeroflow.adapters.use
Is function.

```js
return execute(function (context) {
  return aeroflow.adapters.use;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowoperators"></a>
# aeroflow.operators
Is static property.

```js
return execute(function (context) {
  return aeroflow.operators;
}, function (context) {
  return expect(context.result).to.exist;
});
```

Registers new operator and exposes it as method of aeroflow instance.

```js
return execute(function (context) {
  return context.operator = Function();
}, function (context) {
  aeroflow.operators.test = context.operator;
  return aeroflow.empty.test;
}, function (context) {
  return expect(context.result).to.equal(context.operator);
});
```

When new operator is chained, calls builder function returned by it once with emitter function.

```js
return execute(function (context) {
  context.builder = context.spy();
  context.operator = function () {
    return this.chain(context.builder);
  };
}, function (context) {
  aeroflow.operators.test = context.operator;
  return aeroflow.empty.test();
}, function (context) {
  expect(context.builder).to.have.been.called;
  expect(context.builder.getCall(0).args[0]).to.be.a('function');
});
```

<a name="aeroflowexpand"></a>
# aeroflow.expand
Is static method.

```js
return execute(function (context) {
  return aeroflow.expand;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowexpand-aeroflowexpand"></a>
## aeroflow.expand()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.expand();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

<a name="aeroflowexpand-aeroflowexpandexpanderfunction"></a>
## aeroflow.expand(@expander:function)
Calls @expander with undefined and 0 on first iteration.

```js
return execute(function (context) {
  return context.expander = context.spy();
}, function (context) {
  return aeroflow.expand(context.expander).take(1).run();
}, function (context) {
  return expect(context.expander).to.have.been.calledWith(undefined);
});
```

Calls @expander with value previously returned by @expander, iteration index on subsequent iterations.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.expander = context.spy(function (_, index) {
    return context.values[index];
  });
}, function (context) {
  return aeroflow.expand(context.expander).take(context.values.length + 1).run();
}, function (context) {
  return [undefined].concat(context.values).forEach(function (value, index) {
    return expect(context.expander.getCall(index)).to.have.been.calledWith(value);
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

Emits "next" for each value returned by @expander, then, being limited, lazy "done".

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

<a name="aeroflowexpand-aeroflowexpandexpanderfunction-seed"></a>
## aeroflow.expand(@expander:function, @seed)
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

<a name="aeroflowexpand-aeroflowexpandexpanderstring"></a>
## aeroflow.expand(@expander:string)
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

<a name="aeroflowjust"></a>
# aeroflow.just
Is static method.

```js
return execute(function (context) {
  return aeroflow.just;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowjust-aeroflowjust"></a>
## aeroflow.just()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.just();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Emits single "next" with undefined, then single greedy "done".

```js
return execute(function (context) {
  return aeroflow.just().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(undefined);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowjust-aeroflowjustvalueaeroflow"></a>
## aeroflow.just(@value:aeroflow)
Emits single "next" with @value, then single greedy "done".

```js
return execute(function (context) {
  return context.value = aeroflow.empty;
}, function (context) {
  return aeroflow.just(context.value).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowjust-aeroflowjustvaluearray"></a>
## aeroflow.just(@value:array)
Emits single "next" with @value, then single greedy "done".

```js
return execute(function (context) {
  return context.value = [42];
}, function (context) {
  return aeroflow.just(context.value).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.been.calledOnce;
  expect(context.next).to.have.been.calledWith(context.value);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowjust-aeroflowjustvaluefunction"></a>
## aeroflow.just(@value:function)
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

<a name="aeroflowjust-aeroflowjustvalueiterable"></a>
## aeroflow.just(@value:iterable)
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

<a name="aeroflowjust-aeroflowjustvaluepromise"></a>
## aeroflow.just(@value:promise)
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

<a name="aeroflowrandom"></a>
# aeroflow.random
Is static method.

```js
return execute(function (context) {
  return aeroflow.random;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowrandom-aeroflowrandom"></a>
## aeroflow.random()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.random();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Emits "next" with each random value in the range [0, 1), then single lazy "done".

```js
return execute(function (context) {
  return context.limit = 5;
}, function (context) {
  return aeroflow.random().take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  var results = new Set(Array(context.limit).fill().map(function (_, index) {
    return context.next.getCall(index).args[0];
  }));
  expect(results).to.have.property('size', context.limit);
  results.forEach(function (value) {
    return expect(value).to.be.within(0, 1);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowrandom-aeroflowrandommaximumnumber"></a>
## aeroflow.random(@maximum:number)
Emits "next" with each random value in the range [0, @maximum), then single lazy "done".

```js
return execute(function (context) {
  context.limit = 5;
  context.maximum = 9;
}, function (context) {
  return aeroflow.random(context.maximum).take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  var results = new Set(Array(context.limit).fill().map(function (_, index) {
    return context.next.getCall(index).args[0];
  }));
  expect(results.size).to.be.above(1);
  results.forEach(function (value) {
    return expect(value).to.be.within(0, context.maximum);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowrandom-aeroflowrandomminimumnumber-maximumnumber"></a>
## aeroflow.random(@minimum:number, @maximum:number)
Emits "next" with each random value in the range [@minimum, @maximum), then single lazy "done".

```js
return execute(function (context) {
  context.limit = 5;
  context.minimum = 1;
  context.maximum = 9;
}, function (context) {
  return aeroflow.random(context.minimum, context.maximum).take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  var results = new Set(Array(context.limit).fill().map(function (_, index) {
    return context.next.getCall(index).args[0];
  }));
  expect(results.size).to.be.above(1);
  results.forEach(function (value) {
    return expect(value).to.be.within(context.minimum, context.maximum);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowrange"></a>
# aeroflow.range
Is static method.

```js
return execute(function (context) {
  return aeroflow.range;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowrange-aeroflowrange"></a>
## aeroflow.range()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.range();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Infinitely emits "next" for each integer from 0, then single lazy "done".

```js
return execute(function (context) {
  return context.limit = 3;
}, function (context) {
  return aeroflow.range().take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  Array(context.limit).fill().forEach(function (_, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(index);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowrange-aeroflowrangestart"></a>
## aeroflow.range(@start)
Infinitely emits "next" for each integer from @start, then single lazy "done".

```js
return execute(function (context) {
  context.limit = 3;
  context.start = -3;
}, function (context) {
  return aeroflow.range(context.start).take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  Array(context.limit).fill().forEach(function (_, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(context.start + index);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowrange-aeroflowrangestart-end"></a>
## aeroflow.range(@start, @end)
When @start equal @end, emits single "next" with @start, then single greedy "done".

```js
return execute(function (context) {
  context.end = 42;
  context.start = context.end;
}, function (context) {
  return aeroflow.range(context.start, context.end).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(1);
  expect(context.next).to.have.been.calledWith(context.start);
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When @start less than @end, emits "next" for each integer up from @start to @end inclusively, then single greedy "done".

```js
return execute(function (context) {
  context.end = 3;
  context.start = -3;
}, function (context) {
  return aeroflow.range(context.start, context.end).run(context.next, context.done);
}, function (context) {
  var count = context.end - context.start + 1;
  expect(context.next).to.have.callCount(count);
  Array(count).fill().forEach(function (_, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(context.start + index);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When @end less than @start, emits "next" for each integer down from @start to @end inclusively, then single greedy "done".

```js
return execute(function (context) {
  context.end = -3;
  context.start = 3;
}, function (context) {
  return aeroflow.range(context.start, context.end).run(context.next, context.done);
}, function (context) {
  var count = context.start - context.end + 1;
  expect(context.next).to.have.callCount(count);
  Array(count).fill().forEach(function (_, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(context.start - index);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowrepeat"></a>
# aeroflow.repeat
Is static method.

```js
return execute(function (context) {
  return aeroflow.repeat;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowrepeat-aeroflowrepeat"></a>
## aeroflow.repeat()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.repeat();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

Infinitely emits "next" with undefined, then single lazy "done".

```js
return execute(function (context) {
  return context.limit = 3;
}, function (context) {
  return aeroflow.repeat().take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  Array(context.limit).fill().forEach(function (_, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(undefined);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowrepeat-aeroflowrepeatrepeaterfunction"></a>
## aeroflow.repeat(@repeater:function)
Calls @repeater with index of current iteration.

```js
return execute(function (context) {
  context.limit = 3;
  context.repeater = context.spy();
}, function (context) {
  return aeroflow.repeat(context.repeater).take(context.limit).run();
}, function (context) {
  expect(context.repeater).to.have.callCount(context.limit);
  Array(context.limit).fill(undefined).forEach(function (_, index) {
    return expect(context.repeater.getCall(index)).to.have.been.calledWith(index);
  });
});
```

Infinitely emits "next" with each value returned by @repeater, then single lazy "done".

```js
return execute(function (context) {
  context.limit = 3;
  context.repeater = function (index) {
    return index;
  };
}, function (context) {
  return aeroflow.repeat(context.repeater).take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  Array(context.limit).fill().forEach(function (_, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(index);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowrepeat-aeroflowrepeatrepeaterfunction-delayerfunction"></a>
## aeroflow.repeat(@repeater:function, @delayer:function)
Calls @repeater and @delayer with index of iteration.

```js
return execute(function (context) {
  context.limit = 3;
  context.delayer = context.spy(function () {
    return 0;
  });
  context.repeater = context.spy();
}, function (context) {
  return aeroflow.repeat(context.repeater, context.delayer).take(context.limit).run();
}, function (context) {
  expect(context.delayer).to.have.callCount(context.limit);
  expect(context.repeater).to.have.callCount(context.limit);
  Array(context.limit).fill(undefined).forEach(function (_, index) {
    expect(context.delayer.getCall(index)).to.have.been.calledWith(index);
    expect(context.repeater.getCall(index)).to.have.been.calledWith(index);
  });
});
```

Infinitely emits "next" with each value returned by @repeater delayed to the number of milliseconds returned by @delayer, then single lazy "done".

```js
return execute(function (context) {
  context.delay = 25;
  context.limit = 3;
  context.delayer = function (index) {
    return index * context.delay;
  };
  context.repeater = function (index) {
    return { date: new Date(), index: index };
  };
}, function (context) {
  return aeroflow.repeat(context.repeater, context.delayer).take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  var results = Array(context.limit).fill().map(function (_, index) {
    return context.next.getCall(index).args[0];
  });
  results.forEach(function (result, index) {
    return expect(result.index).to.equal(index);
  });
  results.reduce(function (prev, next) {
    expect(next.date - prev.date).to.be.not.below(context.delay);
    return next;
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowrepeat-repeaterstring"></a>
## (@repeater:string)
Infinitely eits "next" with @repeater value, then single lazy "done".

```js
return execute(function (context) {
  context.limit = 3;
  context.repeater = 42;
}, function (context) {
  return aeroflow.repeat(context.repeater).take(context.limit).run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.callCount(context.limit);
  Array(context.limit).fill().forEach(function (_, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(context.repeater);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowaverage"></a>
# aeroflow().average
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.average;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowaverage-aeroflowaverage"></a>
## aeroflow().average()
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

<a name="aeroflowcatch"></a>
# aeroflow().catch
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.catch;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowcatch-aeroflowcatch"></a>
## aeroflow().catch()
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

When flow emits some values and then error, emits "next" for each value before error, then supresses error and emits single lazy "done" ignoring values emitted after error.

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

<a name="aeroflowcatch-aeroflowcatchalternativearray"></a>
## aeroflow().catch(@alternative:array)
When flow emits error, emits "next" for each value from @alternative, then single lazy "done".

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

<a name="aeroflowcatch-aeroflowcatchalternativefunction"></a>
## aeroflow().catch(@alternative:function)
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

When flow emits several values and then error, calls @alternative once with emitted error, then emits "next" for each value from result returned by @alternative, then emits single lazy "done".

```js
return execute(function (context) {
  context.values = [1, 2];
  context.alternative = context.spy(context.values);
}, function (context) {
  return aeroflow(context.values, context.error).catch(context.alternative).run(context.next, context.done);
}, function (context) {
  expect(context.alternative).to.have.been.calledOnce;
  expect(context.alternative).to.have.been.calledWithExactly(context.error);
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

<a name="aeroflowcatch-aeroflowcatchalternativestring"></a>
## aeroflow().catch(@alternative:string)
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

<a name="aeroflowcoalesce"></a>
# aeroflow().coalesce
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.coalesce;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowcoalesce-aeroflowcoalesce"></a>
## aeroflow().coalesce()
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

<a name="aeroflowcoalesce-aeroflowcoalescealternativearray"></a>
## aeroflow().coalesce(@alternative:array)
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

<a name="aeroflowcoalesce-aeroflowcoalescealternativefunction"></a>
## aeroflow().coalesce(@alternative:function)
When flow is empty, calls @alternative once, emits single "next" with value returned by @alternative, then emits single greedy "done".

```js
return execute(function (context) {
  context.values = [1, 2];
  context.alternative = context.spy(context.values);
}, function (context) {
  return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
}, function (context) {
  expect(context.alternative).to.have.been.calledOnce;
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

<a name="aeroflowcoalesce-aeroflowcoalescealternativepromise"></a>
## aeroflow().coalesce(@alternative:promise)
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

<a name="aeroflowcoalesce-aeroflowcoalescealternativestring"></a>
## aeroflow().coalesce(@alternative:string)
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

<a name="aeroflowcount"></a>
# aeroflow().count
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.count;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowcount-aeroflowcount"></a>
## aeroflow().count()
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

When flow is not empty, emits single "next" with count of values, then single greedy "done".

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

<a name="aeroflowdistinct"></a>
# aeroflow().distinct
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.distinct;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowdistinct-aeroflowdistinct"></a>
## aeroflow().distinct()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.distinct();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.distinct().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values, emits "next" for each unique value, then emits single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2, 1];
}, function (context) {
  return aeroflow(context.values).distinct().run(context.next, context.done);
}, function (context) {
  var unique = context.values.reduce(function (array, value) {
    if (! ~array.indexOf(value)) array.push(value);
    return array;
  }, []);
  expect(context.next).to.have.callCount(unique.length);
  unique.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowdistinct-aeroflowdistincttrue"></a>
## aeroflow().distinct(true)
When flow emits several values, emits "next" for each unique and first-non repeating value, then emits single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 1, 2, 2];
}, function (context) {
  return aeroflow(context.values).distinct().run(context.next, context.done);
}, function (context) {
  var last = undefined;
  var unique = context.values.reduce(function (array, value) {
    if (value !== last) array.push(last = value);
    return array;
  }, []);
  expect(context.next).to.have.callCount(unique.length);
  unique.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowevery"></a>
# aeroflow().every
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.every;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowevery-aeroflowevery"></a>
## aeroflow().every()
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

<a name="aeroflowevery-aerofloweveryconditionfunction"></a>
## aeroflow().every(@condition:function)
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

When flow is not empty, calls @condition with each emitted value and its index until @condition returns falsey result.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy(function (_, index) {
    return index !== context.values.length - 1;
  });
}, function (context) {
  return aeroflow(context.values, 3).every(context.condition).run();
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWith(value, index);
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

<a name="aeroflowevery-aerofloweveryconditionregex"></a>
## aeroflow().every(@condition:regex)
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

<a name="aeroflowevery-aerofloweveryconditionstring"></a>
## aeroflow().every(@condition:string)
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

<a name="aeroflowfilter"></a>
# aeroflow().filter
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.filter;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowfilter-aeroflowfilter"></a>
## aeroflow().filter()
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

When flow emits several values, emits "next" for each truthy value, then single greedy "done".

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

<a name="aeroflowfilter-aeroflowfilterconditionfunction"></a>
## aeroflow().filter(@condition:function)
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

When flow is not empty, calls @condition with each emitted value and its index.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy();
}, function (context) {
  return aeroflow(context.values).filter(context.condition).run();
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index);
  });
});
```

When flow emits several values, emits "next" for each value passed the @condition test, then single greedy "done".

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

<a name="aeroflowfilter-aeroflowfilterconditionregex"></a>
## aeroflow().filter(@condition:regex)
When flow emits several values, emits "next" for each value passed the @condition test, then single greedy "done".

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

<a name="aeroflowfilter-aeroflowfilterconditionnumber"></a>
## aeroflow().filter(@condition:number)
When flow emits several values, emits "next" for each value equal to @condition, then single greedy "done".

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

<a name="aeroflowmap"></a>
# aeroflow().map
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.map;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowmap-aeroflowmap"></a>
## aeroflow().map()
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

When flow is not empty, emits "next" for each value, then single greedy "done".

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

<a name="aeroflowmap-aeroflowmapmapperfunction"></a>
## aeroflow().map(@mapper:function)
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

When flow emits several values, calls @mapper for each value with value and its index.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.mapper = context.spy();
}, function (context) {
  return aeroflow(context.values).map(context.mapper).run();
}, function (context) {
  expect(context.mapper).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.mapper.getCall(index)).to.have.been.calledWithExactly(value, index);
  });
});
```

When flow is not empty, emits "next" for each value with result returned by @mapper, then single greedy "done".

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

<a name="aeroflowmap-aeroflowmapmappernumber"></a>
## aeroflow().map(@mapper:number)
When flow is not empty, emits "next" for each value with @mapper, then single greedy "done".

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

<a name="aeroflowmax"></a>
# aeroflow().max
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.max;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowmax-aeroflowmax"></a>
## aeroflow().max()
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

<a name="aeroflowmean"></a>
# aeroflow().mean
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.mean;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowmean-aeroflowmean"></a>
## aeroflow().mean()
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

<a name="aeroflowmin"></a>
# aeroflow().min
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.min;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowmin-aeroflowmin"></a>
## aeroflow().min()
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

<a name="aeroflowreduce"></a>
# aeroflow().reduce
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.reduce;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowreduce-aeroflowreduce"></a>
## aeroflow().reduce()
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

<a name="aeroflowreduce-aeroflowreducereducerfunction"></a>
## aeroflow().reduce(@reducer:function)
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

When flow emits several values, calls @reducer with first emitted value, second emitted value and 0 on first iteration.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.reducer = context.spy();
}, function (context) {
  return aeroflow(context.values).reduce(context.reducer).run();
}, function (context) {
  return expect(context.reducer).to.have.been.calledWithExactly(context.values[0], context.values[1], 0);
});
```

When flow is not empty, calls @reducer with result returned by @reducer on previous iteration, emitted value and iteration index on next iterations.

```js
return execute(function (context) {
  context.values = [1, 2, 3];
  context.reducer = context.spy(function (_, value) {
    return value;
  });
}, function (context) {
  return aeroflow(context.values).reduce(context.reducer).run();
}, function (context) {
  expect(context.reducer).to.have.callCount(context.values.length - 1);
  context.values.slice(0, -1).forEach(function (value, index) {
    return expect(context.reducer.getCall(index)).to.have.been.calledWithExactly(value, context.values[index + 1], index);
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

<a name="aeroflowreduce-aeroflowreducereducerfunction-seedfunction"></a>
## aeroflow().reduce(@reducer:function, @seed:function)
When flow is not empty, calls @seed with context data, calls @reducer with result returned by @seed, first emitted value and 0 on first iteration.

```js
return execute(function (context) {
  context.value = 42;
  context.seed = context.spy(function () {
    return context.value;
  });
  context.reducer = context.spy();
}, function (context) {
  return aeroflow(context.value).reduce(context.reducer, context.seed).run();
}, function (context) {
  expect(context.seed).to.have.been.called;
  expect(context.reducer).to.have.been.calledWithExactly(context.value, context.value, 0);
});
```

<a name="aeroflowreduce-aeroflowreducereducerfunction-seednumber"></a>
## aeroflow().reduce(@reducer:function, @seed:number)
When flow is not empty, calls @reducer with @seed, first emitted value and 0 on first iteration.

```js
return execute(function (context) {
  context.seed = 1;
  context.value = 2;
  context.reducer = context.spy();
}, function (context) {
  return aeroflow(context.value).reduce(context.reducer, context.seed).run();
}, function (context) {
  return expect(context.reducer).to.have.been.calledWithExactly(context.seed, context.value, 0);
});
```

<a name="aeroflowreduce-aeroflowreducereducerstring"></a>
## aeroflow().reduce(@reducer:string)
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

<a name="aeroflowreverse"></a>
# aeroflow().reverse
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.reverse;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowreverse-aeroflowreverse"></a>
## aeroflow().reverse()
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

<a name="aeroflowskip"></a>
# aeroflow().skip
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.skip;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowskip-aeroflowskip"></a>
## aeroflow().skip()
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

<a name="aeroflowskip-aeroflowskipfalse"></a>
## aeroflow().skip(false)
When flow emits several values, emits "next" for each value, then emits single greedy "done".

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

<a name="aeroflowskip-aeroflowskiptrue"></a>
## aeroflow().skip(true)
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

<a name="aeroflowskip-aeroflowskipconditionfunction"></a>
## aeroflow().skip(@condition:function)
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

When flow emits several values, calls @condition for each value and its index until it returns falsey.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy(function (_, index) {
    return index < context.values.length - 1;
  });
}, function (context) {
  return aeroflow(context.values, 3).skip(context.condition).run();
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index);
  });
});
```

When flow emits several values, skips values until @condition returns falsey, then emits "next" for all remaining values, then emits single greedy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return value < 2;
  };
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).skip(context.condition).run(context.next, context.done);
}, function (context) {
  var position = context.values.findIndex(function (value) {
    return !context.condition(value);
  });
  expect(context.next).to.have.callCount(context.values.length - position);
  context.values.slice(position).forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowskip-aeroflowskipconditionnumber"></a>
## aeroflow().skip(@condition:number)
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

<a name="aeroflowslice"></a>
# aeroflow().slice
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.slice;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowslice-aeroflowslice"></a>
## aeroflow().slice()
Returns instance of Aeroflow.

```js
return execute(function (context) {
  return aeroflow.empty.slice();
}, function (context) {
  return expect(context.result).to.be.an('Aeroflow');
});
```

When flow is empty, emits only single greedy "done".

```js
return execute(function (context) {
  return aeroflow.empty.slice().run(context.next, context.done);
}, function (context) {
  expect(context.next).to.have.not.been.called;
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values, emits "next" for each value, then single greedy "done".

```js
return execute(function (context) {
  return context.values = [1, 2];
}, function (context) {
  return aeroflow(context.values).slice().run(context.next, context.done);
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

<a name="aeroflowslice-aeroflowslicebeginnumber"></a>
## aeroflow().slice(@begin:number)
When flow emits several values and @begin is positive, emits "next" for each of values starting from @begin, then emits single greedy "done".

```js
return execute(function (context) {
  context.begin = 1;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).slice(context.begin).run(context.next, context.done);
}, function (context) {
  var sliced = context.values.slice(context.begin);
  expect(context.next).to.have.callCount(sliced.length);
  sliced.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values and @begin is negative, emits "next" for each of values starting from reversed @begin, then emits single greedy "done".

```js
return execute(function (context) {
  context.begin = -2;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).slice(context.begin).run(context.next, context.done);
}, function (context) {
  var sliced = context.values.slice(context.begin);
  expect(context.next).to.have.callCount(sliced.length);
  sliced.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowslice-aeroflowslicebeginnumber-endnumber"></a>
## aeroflow().slice(@begin:number, @end:number)
When flow emits several values and both @start and @end are positive, emits "next" for each of values between @begin and @end, then emits single lazy "done".

```js
return execute(function (context) {
  context.begin = 1;
  context.end = 3;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done);
}, function (context) {
  var sliced = context.values.slice(context.begin, context.end);
  expect(context.next).to.have.callCount(sliced.length);
  sliced.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

When flow emits several values and @begin is positive but @end is negative, emits "next" for each of values between @begin and reversed @end, then emits single greedy "done".

```js
return execute(function (context) {
  context.begin = 1;
  context.end = -1;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done);
}, function (context) {
  var sliced = context.values.slice(context.begin, context.end);
  expect(context.next).to.have.callCount(sliced.length);
  sliced.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values and @begin is negative but @end is positive, emits "next" for each of values between reversed @begin and @end, then emits single greedy "done".

```js
return execute(function (context) {
  context.begin = -3;
  context.end = 3;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done);
}, function (context) {
  var sliced = context.values.slice(context.begin, context.end);
  expect(context.next).to.have.callCount(sliced.length);
  sliced.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

When flow emits several values and both @start and @end are negative, emits "next" for each of values between reversed @begin and reversed @end, then emits single greedy "done".

```js
return execute(function (context) {
  context.begin = -3;
  context.end = -1;
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done);
}, function (context) {
  var sliced = context.values.slice(context.begin, context.end);
  expect(context.next).to.have.callCount(sliced.length);
  sliced.forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(true);
});
```

<a name="aeroflowsome"></a>
# aeroflow().some
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.some;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowsome-aeroflowsome"></a>
## aeroflow().some()
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

<a name="aeroflowsome-aeroflowsomeconditionfunction"></a>
## aeroflow().some(@condition:function)
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

When flow is not empty, calls @condition with each emitted value and its index until @condition returns truthy result.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy(function (_, index) {
    return index === context.values.length - 1;
  });
}, function (context) {
  return aeroflow(context.values, 3).some(context.condition).run();
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index);
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

<a name="aeroflowsome-aeroflowsomeconditionregex"></a>
## aeroflow().some(@condition:regex)
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

<a name="aeroflowsome-aeroflowsomeconditionstring"></a>
## aeroflow().some(@condition:string)
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

<a name="aeroflowsum"></a>
# aeroflow().sum
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.sum;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowsum-aeroflowsum"></a>
## aeroflow().sum()
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

<a name="aeroflowtake"></a>
# aeroflow().take
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.take;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowtake-aeroflowtake"></a>
## aeroflow().take()
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

When flow emits several values, emits "next" for each value, then emits single greedy "done".

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

<a name="aeroflowtake-aeroflowtakefalse"></a>
## aeroflow().take(false)
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

<a name="aeroflowtake-aeroflowtaketrue"></a>
## aeroflow().take(true)
When flow emits several values, emits "next" for each value, then emits single greedy "done".

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

<a name="aeroflowtake-aeroflowtakeconditionfunction"></a>
## aeroflow().take(@condition:function)
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

When flow emits several values, calls @condition for each value with value and its index until it returns falsey.

```js
return execute(function (context) {
  context.values = [1, 2];
  context.condition = context.spy(function (_, index) {
    return index < context.values.length - 1;
  });
}, function (context) {
  return aeroflow(context.values, 3).take(context.condition).run();
}, function (context) {
  expect(context.condition).to.have.callCount(context.values.length);
  context.values.forEach(function (value, index) {
    return expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index);
  });
});
```

When flow emits several values, then emits "next" for each value until @condition returns falsey and skips remaining values, then emits single lazy "done".

```js
return execute(function (context) {
  context.condition = function (value) {
    return value < 3;
  };
  context.values = [1, 2, 3, 4];
}, function (context) {
  return aeroflow(context.values).take(context.condition).run(context.next, context.done);
}, function (context) {
  var position = context.values.findIndex(function (value) {
    return !context.condition(value);
  });
  expect(context.next).to.have.callCount(context.values.length - position);
  context.values.slice(0, position).forEach(function (value, index) {
    return expect(context.next.getCall(index)).to.have.been.calledWith(value);
  });
  expect(context.done).to.have.been.calledAfter(context.next);
  expect(context.done).to.have.been.calledOnce;
  expect(context.done).to.have.been.calledWith(false);
});
```

<a name="aeroflowtake-aeroflowtakeconditionnumber"></a>
## aeroflow().take(@condition:number)
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

<a name="aeroflowtoarray"></a>
# aeroflow().toArray
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.toArray;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowtoarray-aeroflowtoarray"></a>
## aeroflow().toArray()
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

When flow emits several values, emits single "next" with array containing all values, then emits single greedy "done".

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

<a name="aeroflowtoset"></a>
# aeroflow().toSet
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.toSet;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowtoset-aeroflowtoset"></a>
## aeroflow().toSet()
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

When flow emits several values, emits single "next" with set containing all unique values, then single greedy "done".

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

<a name="aeroflowtostring"></a>
# aeroflow().toString
Is instance method.

```js
return execute(function (context) {
  return aeroflow.empty.toString;
}, function (context) {
  return expect(context.result).to.be.a('function');
});
```

<a name="aeroflowtostring-aeroflowtostring"></a>
## aeroflow().toString()
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

When flow emits single number, emits single "next" with number converted to string, then single greedy "done".

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

When flow emits single string, emits single "next" with string, then single greedy "done".

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

When flow emits several numbers, emits single "next" with numbers converted to strings and concatenated via ",", then single greedy "done".

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

When flow emits several strings, emits single "next" with strings concatenated via ",", then single greedy "done".

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

<a name="aeroflowtostring-aeroflowtostringseperatorstring"></a>
## aeroflow().toString(@seperator:string)
When flow emits several strings, emits single "next" with strings concatenated via @separator, then single greedy "done".

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

