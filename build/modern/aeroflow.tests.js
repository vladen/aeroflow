(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTests = factory());
}(this, function () { 'use strict';

  var emptyGeneratorTests = (aeroflow, chai, exec, noop) => describe('.empty', () => {
    it('Gets instance of Aeroflow', () =>
      exec(
        noop,
        () => aeroflow.empty,
        result => chai.expect(result).to.be.an('Aeroflow')));

    it('Gets flow emitting "done" notification argumented with "true"', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.empty.notify(noop, spy).run(),
        spy => chai.expect(spy).to.have.been.called.with(true)));

    it('Gets flow not emitting "next" notification', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.empty.notify(spy).run(),
        spy => chai.expect(spy).not.to.have.been.called()));
  });

  var expandGeneratorTests = (aeroflow, chai, exec, noop) => describe('.expand', () => {
    it('Is static method', () =>
      exec(
        noop,
        () => aeroflow.expand,
        result => chai.expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          noop,
          () => aeroflow.expand(),
          result => chai.expect(result).to.be.an('Aeroflow')));
    });

    describe('(@expander:function)', () => {
      it('Calls @expander', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow.expand(spy).take(1).run(),
          spy => chai.expect(spy).to.have.been.called()));

      it('Passes undefined to @expander as first argument when no seed has been specified', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow.expand(arg => spy(typeof arg)).take(1).run(),
          spy => chai.expect(spy).to.have.been.called.with('undefined')));

      it('Passes result returned by @expander to @expander as first argument on sybsequent iteration', () =>
        exec(
          () => {
            const result = {};
            return { result, spy: chai.spy(() => result) };
          },
          ctx => aeroflow.expand(result => ctx.spy(result)).take(2).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.result)));

      it('Passes zero-based index of iteration to @expander as second argument', () =>
        exec(
          () => ({ limit: 3, spy: chai.spy() }),
          ctx => aeroflow.expand((_, index) => ctx.spy(index)).take(ctx.limit).run(),
          ctx => Array(ctx.limit).fill(0).forEach(
            (_, i) => chai.expect(ctx.spy).to.have.been.called.with(i))));

      it('Passes context data to @expander as third argument', () =>
        exec(
          () => ({ data: 'test', spy: chai.spy() }),
          ctx => aeroflow.expand((_, __, data) => ctx.spy(data)).take(1).run(ctx.data),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.data)));

      it('Emits "next" notification with value returned by @expander', () =>
        exec(
          () => ({ result: {}, spy: chai.spy() }),
          ctx => aeroflow.expand(() => ctx.result).take(1).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.result)));
    });

    describe('(@expander:function, @seed:any)', () => {
      it('Passes @seed to @expander as first argument at first iteration', () =>
        exec(
          () => ({ seed: 'test', spy: chai.spy() }),
          ctx => aeroflow.expand(seed => ctx.spy(seed), ctx.seed).take(1).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.seed)));
    });
  });

  var justGeneratorTests = (aeroflow, chai, exec, noop) => describe('.just', () => {
    it('Is static method', () =>
      exec(
        noop,
        () => aeroflow.just,
        result => chai.expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          noop,
          () => aeroflow.just(),
          result => chai.expect(result).to.be.an('Aeroflow')));

      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow.just().notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with undefined', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow.just().notify(result => spy(typeof result)).run(),
          spy => chai.expect(spy).to.have.been.called.with('undefined')));
    });

    describe('(@value:aeroflow)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: aeroflow.empty, spy: chai.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
    });

    describe('(@value:array)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: [], spy: chai.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
    });

    describe('(@value:function)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: noop, spy: chai.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
    });

    describe('(@value:iterable)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: new Set, spy: chai.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
    });

    describe('(@value:promise)', () => {
      it('Returns flow emitting "next" notification argumented with @value', () =>
        exec(
          () => ({ value: Promise.resolve, spy: chai.spy() }),
          ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
    });
  });

  var averageOperatorTests = (aeroflow, chai, exec, noop) => describe('#average', () => {
    it('Is instance method', () =>
      exec(
        noop,
        () => aeroflow.empty.average,
        result => chai.expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          noop,
          () => aeroflow.empty.average(),
          result => chai.expect(result).to.be.an('Aeroflow')));

      it('Does not emit "next" notification when flow is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow.empty.average().notify(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Emits "next" notification argumented with @value when flow emits single numeric @value', () =>
        exec(
          () => ({ value: 42, spy: chai.spy() }),
          ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));

      it('Emits "next" notification argumented with NaN when flow emits single not numeric @value', () =>
        exec(
          () => ({ value: 'test', spy: chai.spy() }),
          ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(NaN)));

      it('Emits "next" notification argumented with average of @values when flow emits several numeric @values', () =>
        exec(
          () => ({ values: [1, 2, 5], spy: chai.spy() }),
          ctx => aeroflow(ctx.values).average().notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(
            ctx.values.reduce((sum, value) => sum + value, 0) / ctx.values.length)));

      it('Emits "next" notification argumented with NaN when flow emits several not numeric @values', () =>
        exec(
          () => ({ values: ['a', 'b'], spy: chai.spy() }),
          ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(NaN)));
    });
  });

  var catchOperatorTests = (aeroflow, chai, exec, noop) => describe('#catch', () => {
    it('Is instance method', () =>
      exec(
        noop,
        () => aeroflow.empty.catch,
        result => chai.expect(result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          noop,
          () => aeroflow.empty.catch(),
          result => chai.expect(result).to.be.an('Aeroflow')));

      it('Does not emit "next" notification when flow is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow.empty.catch().notify(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Does not emit "next" notification when flow emits single error', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(new Error('test')).catch().notify(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Emits "done" notification argumented with "true" when emits error', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(new Error('test')).catch().notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));
    });

    describe('(@alternative:function)', () => {
      it('Does not call @alternative when flow is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow.empty.catch(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Does not call @alternative when flow does not emit error', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow('test').catch(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Calls @alternative and passes error as first argument when flow emits error', () =>
        exec(
          () => ({ error: new Error('test'), spy: chai.spy() }),
          ctx => aeroflow(ctx.error).catch(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.error)));

      it('Calls @alternative and passes context data as second argument when flow emits error', () =>
        exec(
          () => ({ data: 'test', spy: chai.spy() }),
          ctx => aeroflow(new Error('test')).catch((_, data) => ctx.spy(data)).run(ctx.data),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.data)));

      it('Emits "next" notification argumented with value returned by @alternative when flow emits error', () =>
        exec(
          () => ({ value: 'test', spy: chai.spy() }),
          ctx => aeroflow(new Error('test')).catch(() => ctx.value).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
    });

    describe('(@alternative:!function)', () => {
      it('Emits "next" notification argumented with @alternative when flow emits error', () =>
        exec(
          () => ({ alternative: 'test', spy: chai.spy() }),
          ctx => aeroflow(new Error('test')).catch(ctx.alternative).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.alternative)));
    });
  });

  const exec = (arrange, act, ...asserts) => {
    let input = arrange();
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

  const noop = Function();

  const aeroflowTests = (aeroflow, chai) =>
  describe('aeroflow', () => {
    it('Is function', () =>
      exec(
        noop, /* arrange */
        () => aeroflow, /* act */
        result => chai.expect(result).to.be.a('function') /* assert */ ));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        exec(
          noop,
          () => aeroflow(),
          result => chai.expect(result).to.be.an('Aeroflow')));

      it('Returns empty flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow().notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns empty flow not emitting "next" notification', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow().notify(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));
    });

    describe('(@source:aeroflow)', () => {
      it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(aeroflow.empty).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(aeroflow([1, 2])).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with "false" when @source is not empty but has not been entirely enumerated', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(aeroflow([1, 2])).take(1).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(false)));

      it('Returns flow not emitting "next" notification when @source is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(aeroflow.empty).notify(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        exec(
          () => ({ source: [1, 2], spy: chai.spy() }),
          ctx => aeroflow(aeroflow(ctx.source)).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(...ctx.source)));
    });

    describe('(@source:array)', () => {
      it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow([]).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow([1, 2]).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with "false" when @source is not empty and has not been entirely enumerated', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow([1, 2]).take(1).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(false)));

      it('Returns flow not emitting "next" notification when @source is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow([]).notify(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        exec(
          () => ({ source: [1, 2], spy: chai.spy() }),
          ctx => aeroflow(ctx.source).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(...ctx.source)));
    });

    describe('(@source:date)', () => {
      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(new Date).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        exec(
          () => ({ source: new Date, spy: chai.spy() }),
          ctx => aeroflow(ctx.source).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.source)));
    });

    describe('(@source:error)', () => {
      it('Returns flow emitting "done" notification argumented with @source', () =>
        exec(
          () => ({ source: new Error('test'), spy: chai.spy() }),
          ctx => aeroflow(ctx.source).notify(noop, ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.source)));

      it('Returns flow not emitting "next" notification', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(new Error('test')).notify(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));
    });

    describe('(@source:function)', () => {
      it('Calls @source and passes ctx data as first argument', () =>
        exec(
          () => ({ data: {}, source: chai.spy() }),
          ctx => aeroflow(ctx.source).run(ctx.data),
          ctx => chai.expect(ctx.source).to.have.been.called.with(ctx.data)));

      it('Returns flow emitting "done" notification argumented with "true" when @source does not throw', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(noop).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with error thrown by @source', () =>
        exec(
          () => ({ error: new Error('test'), spy: chai.spy() }),
          ctx => aeroflow(() => { throw ctx.error }).notify(noop, ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.error)));

      it('Returns flow emitting "next" notification argumented with value returned by @source', () =>
        exec(
          () => ({ value: 'test', spy: chai.spy() }),
          ctx => aeroflow(() => ctx.value).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
    });

    describe('(@source:iterable)', () => {
      it('Returns empty flow emitting "done" notification argumented with "true" when source is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(new Set).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with "true" when source is not empty and has been entirely enumerated', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(new Set([1, 2])).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with "false" when source is not empty but has not been entirely enumerated', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(new Set([1, 2])).take(1).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(false)));

      it('Returns flow not emitting "next" notification when source is empty', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(new Set).notify(spy).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        exec(
          () => ({ source: [1, 2], spy: chai.spy() }),
          ctx => aeroflow(new Set(ctx.source)).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(...ctx.source)));
    });

    describe('(@source:null)', () => {
      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(null).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        exec(
          () => ({ source: null, spy: chai.spy() }),
          ctx => aeroflow(ctx.source).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.source)));
    });

    describe('(@source:promise)', () => {
      it('Returns flow emitting "done" notification argumented with "true" when @source resolves', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(Promise.resolve()).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with rejection error when @source rejects', () =>
        exec(
          () => ({ error: new Error('test'), spy: chai.spy() }),
          ctx => aeroflow(Promise.reject(ctx.error)).notify(noop, ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.error)));

      it('Returns flow emitting "next" notification argumented with result resolved by @source', () =>
        exec(
          () => ({ result: 'test', spy: chai.spy() }),
          ctx => aeroflow(Promise.resolve(ctx.result)).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.source)));
    });

    describe('(@source:string)', () => {
      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow('test').notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        exec(
          () => ({ source: 'test', spy: chai.spy() }),
          ctx => aeroflow(ctx.source).notify(ctx.spy).run(),
          ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.source)));
    });

    describe('(@source:undefined)', () => {
      it('Returns flow emitting "done" notification argumented with "true"', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(undefined).notify(noop, spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        exec(
          () => chai.spy(),
          spy => aeroflow(undefined).notify(arg => spy(typeof arg), noop).run(),
          spy => chai.expect(spy).to.have.been.called.with('undefined')));
    });

    [
      emptyGeneratorTests,
      expandGeneratorTests,
      justGeneratorTests,

      averageOperatorTests,
      catchOperatorTests /*,
      coalesceOperatorTests,
      countOperatorTests,
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
    ].forEach(test => test(aeroflow, chai, exec, noop));
  });

  return aeroflowTests;

}));