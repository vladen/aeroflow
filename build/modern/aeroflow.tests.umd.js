(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTests = factory());
}(this, function () { 'use strict';

  var emptyGeneratorTests = (aeroflow, exec, expect, sinon) => describe('.empty', () => {
    it('Gets instance of Aeroflow', () =>
      exec(
        null,
        () => aeroflow.empty,
        result => expect(result).to.be.an('Aeroflow')));

    it('Gets flow emitting "done" notification argumented with "true"', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.empty.notify(Function(), spy).run(),
        spy => expect(spy).to.have.been.calledWith(true)));

    it('Gets flow not emitting "next" notification', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.empty.notify(spy).run(),
        spy => expect(spy).not.to.have.been.called));
  });

  var expandGeneratorTests = (aeroflow, exec, expect, sinon) => describe('.expand', () => {
    it('Is static method', () =>
      exec(
        null,
        () => aeroflow.expand,
        result => expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          null,
          () => aeroflow.expand(),
          result => expect(result).to.be.an('Aeroflow')));
    });

    describe('(@expander:function)', () => {
      it('Calls @expander', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.expand(spy).take(1).run(),
          spy => expect(spy).to.have.been.called));

      it('Passes undefined to @expander as first argument when no seed has been specified', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.expand(arg => spy(typeof arg)).take(1).run(),
          spy => expect(spy).to.have.been.calledWith('undefined')));

      it('Passes value returned by @expander to @expander as first argument on subsequent iteration', () =>
        exec(
          () => {
            const value = 'test';
            return { value, spy: sinon.spy(() => value) };
          },
          ctx => aeroflow.expand(result => ctx.spy(result)).take(2).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));

      it('Passes zero-based index of iteration to @expander as second argument', () =>
        exec(
          () => ({ limit: 3, spy: sinon.spy() }),
          ctx => aeroflow.expand((_, index) => ctx.spy(index)).take(ctx.limit).run(),
          ctx => Array(ctx.limit).fill(0).forEach(
            (_, i) => expect(ctx.spy).to.have.been.calledWith(i))));

      it('Passes context data to @expander as third argument', () =>
        exec(
          () => ({ data: 'test', spy: sinon.spy() }),
          ctx => aeroflow.expand((_, __, data) => ctx.spy(data)).take(1).run(ctx.data),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.data)));

      it('Emits "next" notification with value returned by @expander', () =>
        exec(
          () => ({ value: 'test', spy: sinon.spy() }),
          ctx => aeroflow.expand(() => ctx.value).take(1).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@expander:function, @seed:any)', () => {
      it('Passes @seed to @expander as first argument at first iteration', () =>
        exec(
          () => ({ seed: 'test', spy: sinon.spy() }),
          ctx => aeroflow.expand(seed => ctx.spy(seed), ctx.seed).take(1).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.seed)));
    });
  });

  var justGeneratorTests = (aeroflow, exec, expect, sinon) => describe('.just', () => {
    it('Is static method', () =>
      exec(
        null,
        () => aeroflow.just,
        result => expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          null,
          () => aeroflow.just(),
          result => expect(result).to.be.an('Aeroflow')));

      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.just().notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "next" notification argumented with undefined', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.just().notify(result => spy(typeof result)).run(),
          spy => expect(spy).to.have.been.calledWith('undefined')));
    });

    describe('(@value:aeroflow)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: aeroflow.empty, spy: sinon.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@value:array)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: [], spy: sinon.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@value:function)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: Function(), spy: sinon.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@value:iterable)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: new Set, spy: sinon.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@value:promise)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: Promise.resolve, spy: sinon.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });
  });

  var averageOperatorTests = (aeroflow, exec, expect, sinon) => describe('#average', () => {
    it('Is instance method', () =>
      exec(
        null,
        () => aeroflow.empty.average,
        result => expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          null,
          () => aeroflow.empty.average(),
          result => expect(result).to.be.an('Aeroflow')));

      it('Does not emit "next" notification when flow is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.empty.average().notify(spy).run(),
          spy => expect(spy).not.to.have.been.called));

      it('Emits "next" notification argumented with @value when flow emits single numeric @value', () =>
        exec(
          () => ({ value: 42, spy: sinon.spy() }),
          ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));

      it('Emits "next" notification argumented with NaN when flow emits single not numeric @value', () =>
        exec(
          () => ({ value: 'test', spy: sinon.spy() }),
          ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(NaN)));

      it('Emits "next" notification argumented with average of @values when flow emits several numeric @values', () =>
        exec(
          () => ({ values: [1, 2, 5], spy: sinon.spy() }),
          ctx => aeroflow(ctx.values).average().notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(
            ctx.values.reduce((sum, value) => sum + value, 0) / ctx.values.length)));

      it('Emits "next" notification argumented with NaN when flow emits several not numeric @values', () =>
        exec(
          () => ({ values: ['a', 'b'], spy: sinon.spy() }),
          ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(NaN)));
    });
  });

  var catchOperatorTests = (aeroflow, exec, expect, sinon) => describe('#catch', () => {
    it('Is instance method', () =>
      exec(
        null,
        () => aeroflow.empty.catch,
        result => expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          null,
          () => aeroflow.empty.catch(),
          result => expect(result).to.be.an('Aeroflow')));

      it('Does not emit "next" notification when flow is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.empty.catch().notify(spy).run(),
          spy => expect(spy).not.to.have.been.called));

      it('Does not emit "next" notification when flow emits single error', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Error('test')).catch().notify(spy).run(),
          spy => expect(spy).not.to.have.been.called));

      it('Emits "done" notification argumented with "true" when emits error', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Error('test')).catch().notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));
    });

    describe('(@alternative:function)', () => {
      it('Does not call @alternative when flow is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.empty.catch(spy).run(),
          spy => expect(spy).not.to.have.been.called));

      it('Does not call @alternative when flow does not emit error', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow('test').catch(spy).run(),
          spy => expect(spy).not.to.have.been.called));

      it('Calls @alternative and passes error as first argument when flow emits error', () =>
        exec(
          () => ({ error: new Error('test'), spy: sinon.spy() }),
          ctx => aeroflow(ctx.error).catch(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.error)));

      it('Calls @alternative and passes context data as second argument when flow emits error', () =>
        exec(
          () => ({ data: 'test', spy: sinon.spy() }),
          ctx => aeroflow(new Error('test')).catch((_, data) => ctx.spy(data)).run(ctx.data),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.data)));

      it('Emits "next" notification argumented with value returned by @alternative when flow emits error', () =>
        exec(
          () => ({ value: 'test', spy: sinon.spy() }),
          ctx => aeroflow(new Error('test')).catch(() => ctx.value).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@alternative:!function)', () => {
      it('Emits "next" notification argumented with @alternative when flow emits error', () =>
        exec(
          () => ({ alternative: 'test', spy: sinon.spy() }),
          ctx => aeroflow(new Error('test')).catch(ctx.alternative).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.alternative)));
    });
  });

  var coalesceOperatorTests = (aeroflow, exec, expect, sinon) => describe('#coalesce', () => {
    it('Is instance method', () =>
      exec(
        null,
        () => aeroflow.empty.coalesce,
        result => expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          null,
          () => aeroflow.empty.coalesce(),
          result => expect(result).to.be.an('Aeroflow')));

      it('Does not emit "next" notification when flow is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.empty.coalesce().notify(spy).run(),
          spy => expect(spy).not.to.have.been.called));
    });

    describe('(@alternative:function)', () => {
      it('Calls @alternative when flow is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.empty.coalesce(spy).run(),
          spy => expect(spy).to.have.been.called));

      it('Does not call @alternative when flow emits error', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Error('test')).coalesce(spy).run(),
          spy => expect(spy).not.to.have.been.called));

      it('Emits "next" notification argumented with value returned by @alternative when flow is empty', () =>
        exec(
          () => ({ value: 'test', spy: sinon.spy() }),
          ctx => aeroflow.empty.coalesce(() => ctx.value).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@alternative:!function)', () => {
      it('Emits "next" notification argumented with @alternative value when flow is empty', () =>
        exec(
          () => ({ alternative: 'test', spy: sinon.spy() }),
          ctx => aeroflow.empty.coalesce(ctx.alternative).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.alternative)));
    });
  });

  var countOperatorTests = (aeroflow, exec, expect, sinon) => describe('#count', () => {
    it('Is instance method', () =>
      exec(
        null,
        () => aeroflow.empty.count,
        result => expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          null,
          () => aeroflow.empty.count(),
          result => expect(result).to.be.an('Aeroflow')));

      it('Emits "next" notification argumented with "0" when flow is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow.empty.count().notify(result => spy(result)).run(),
          spy => expect(spy).to.have.been.calledWith(0)));

      it('Emits "next" notification argumented with "1" when flow emits single value', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow('test').count().notify(spy).run(),
          spy => expect(spy).to.have.been.calledWith(1)));

      it('Emits number of @values emitted by flow when flow emits several @values', () =>
        exec(
          () => ({ values: [1, 2, 3], spy: sinon.spy() }),
          ctx => aeroflow(ctx.values).count().notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.values.length)));
    });
  });

  const exec = (arrange, act, ...asserts) => {
    let input = typeof arrange === 'function'
      ? arrange()
      : arrange;
    return Promise
      .resolve(act(input))
      .catch(() => {})
      .then(result => {
        input
          ? input.result = result
          : input = result;
        asserts.forEach(assert => assert(input));
      });
  }

  const aeroflowTests = (aeroflow, expect, sinon) =>
  describe('aeroflow', () => {
    it('Is function', () =>
      exec(
        () => {}, /* arrange */
        () => aeroflow, /* act */
        result => expect(result).to.be.a('function') /* assert */ ));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          null,
          () => aeroflow(),
          result => expect(result).to.be.an('Aeroflow')));

      it('Returns empty flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow().notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns empty flow not emitting "next" notification', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow().notify(spy).run(),
          spy => expect(spy).to.have.not.been.called));
    });

    describe('(@source:aeroflow)', () => {
      it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(aeroflow.empty).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(aeroflow([1, 2])).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "done" notification argumented with "false" when @source is not empty but has not been entirely enumerated', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(aeroflow([1, 2])).take(1).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(false)));

      it('Returns flow not emitting "next" notification when @source is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(aeroflow.empty).notify(spy).run(),
          spy => expect(spy).to.have.not.been.called));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        exec(
          () => ({ source: [1, 2], spy: sinon.spy() }),
          ctx => aeroflow(aeroflow(ctx.source)).notify(ctx.spy).run(),
          ctx => ctx.source.forEach(value => expect(ctx.spy).to.have.been.calledWith(value))));
    });

    describe('(@source:array)', () => {
      it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow([]).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow([1, 2]).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "done" notification argumented with "false" when @source is not empty and has not been entirely enumerated', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow([1, 2]).take(1).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(false)));

      it('Returns flow not emitting "next" notification when @source is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow([]).notify(spy).run(),
          spy => expect(spy).to.have.not.been.called));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        exec(
          () => ({ source: [1, 2], spy: sinon.spy() }),
          ctx => aeroflow(ctx.source).notify(ctx.spy).run(),
          ctx => ctx.source.forEach(value => expect(ctx.spy).to.have.been.calledWith(value))));
    });

    describe('(@source:date)', () => {
      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Date).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        exec(
          () => ({ source: new Date, spy: sinon.spy() }),
          ctx => aeroflow(ctx.source).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.source)));
    });

    describe('(@source:error)', () => {
      it('Returns flow emitting "done" notification argumented with @source', () =>
        exec(
          () => ({ source: new Error('test'), spy: sinon.spy() }),
          ctx => aeroflow(ctx.source).notify(Function(), ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.source)));

      it('Returns flow not emitting "next" notification', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Error('test')).notify(spy).run(),
          spy => expect(spy).to.have.not.been.called));
    });

    describe('(@source:function)', () => {
      it('Calls @source and passes ctx data as first argument', () =>
        exec(
          () => ({ data: {}, source: sinon.spy() }),
          ctx => aeroflow(ctx.source).run(ctx.data),
          ctx => expect(ctx.source).to.have.been.calledWith(ctx.data)));

      it('Returns flow emitting "done" notification argumented with "true" when @source does not throw', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(Function()).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "done" notification argumented with error thrown by @source', () =>
        exec(
          () => ({ error: new Error('test'), spy: sinon.spy() }),
          ctx => aeroflow(() => { throw ctx.error }).notify(Function(), ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.error)));

      it('Returns flow emitting "next" notification argumented with value returned by @source', () =>
        exec(
          () => ({ value: 'test', spy: sinon.spy() }),
          ctx => aeroflow(() => ctx.value).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@source:iterable)', () => {
      it('Returns empty flow emitting "done" notification argumented with "true" when source is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Set).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "done" notification argumented with "true" when source is not empty and has been entirely enumerated', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Set([1, 2])).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "done" notification argumented with "false" when source is not empty but has not been entirely enumerated', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Set([1, 2])).take(1).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(false)));

      it('Returns flow not emitting "next" notification when source is empty', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(new Set).notify(spy).run(),
          spy => expect(spy).to.have.not.been.called));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        exec(
          () => ({ source: [1, 2], spy: sinon.spy() }),
          ctx => aeroflow(new Set(ctx.source)).notify(ctx.spy).run(),
          ctx => ctx.source.forEach(value => expect(ctx.spy).to.have.been.calledWith(value))));
    });

    describe('(@source:null)', () => {
      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(null).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        exec(
          () => ({ source: null, spy: sinon.spy() }),
          ctx => aeroflow(ctx.source).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.source)));
    });

    describe('(@source:promise)', () => {
      it('Returns flow emitting "done" notification argumented with "true" when @source resolves', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(Promise.resolve()).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "done" notification argumented with rejection error when @source rejects', () =>
        exec(
          () => ({ error: new Error('test'), spy: sinon.spy() }),
          ctx => aeroflow(Promise.reject(ctx.error)).notify(Function(), ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.error)));

      it('Returns flow emitting "next" notification argumented with value resolved by @source', () =>
        exec(
          () => ({ value: 'test', spy: sinon.spy() }),
          ctx => aeroflow(Promise.resolve(ctx.value)).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
    });

    describe('(@source:string)', () => {
      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow('test').notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        exec(
          () => ({ source: 'test', spy: sinon.spy() }),
          ctx => aeroflow(ctx.source).notify(ctx.spy).run(),
          ctx => expect(ctx.spy).to.have.been.calledWith(ctx.source)));
    });

    describe('(@source:undefined)', () => {
      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(undefined).notify(Function(), spy).run(),
          spy => expect(spy).to.have.been.calledWith(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        exec(
          () => sinon.spy(),
          spy => aeroflow(undefined).notify(arg => spy(typeof arg), Function()).run(),
          spy => expect(spy).to.have.been.calledWith('undefined')));
    });

    [
      emptyGeneratorTests,
      expandGeneratorTests,
      justGeneratorTests,

      averageOperatorTests,
      catchOperatorTests,
      coalesceOperatorTests,
      countOperatorTests /*,

      distinctOperatorTests,
      everyOperatorTests,
      filterOperatorTests,
      groupOperatorTests,
      mapOperatorTests,
      maxOperatorTests,
      meanOperatorTests,
      minOperatorTests,
      reduceOperatorTests,
      reverseOperatorTests,
      skipOperatorTests,
      sliceOperatorTests,
      someOperatorTests,
      sortOperatorTests,
      sumOperatorTests,
      takeOperatorTests,
      tapOperatorTests,
      toArrayOperatorTests,
      toMapOperatorTests,
      toSetOperatorTests,
      toStringOperatorTests
  */
    ].forEach(test => test(aeroflow, exec, expect, sinon));
  });

  return aeroflowTests;

}));