(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTest = factory());
}(this, function () { 'use strict';

  function testify(arrange, act, ...asserts) {
    const input = arrange();
    return Promise
      .resolve(act(input))
      .then(result => {
        input.result = result;
        asserts.forEach(assert => assert(input));
      })
      .catch(() => {});
  }

  const aeroflowTest = (aeroflow, chai) =>
  describe('aeroflow', () => {
    it('Is function', () =>
      chai.expect(aeroflow).to.be.a('function'));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        chai.expect(aeroflow()).to.be.an('Aeroflow'));

      it('Returns empty flow not emitting "next" notification', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow().notify(spy, Function()).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Returns empty flow emitting "done" notification argumented with "true"', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow().notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));
    });

    describe('(@source:aeroflow)', () => {
      it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(aeroflow.empty).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(aeroflow([1, 2])).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but has not been entirely enumerated', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(aeroflow([1, 2])).take(1).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(false)));

      it('Returns flow not emitting "next" notification when @source is empty', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(aeroflow.empty).notify(spy, Function()).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        testify(
          () => ({ source: [1, 2], spy: chai.spy() }),
          context => aeroflow(aeroflow(context.source)).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(...context.source)));
    });

    describe('(@source:array)', () => {
      it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow([]).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow([1, 2]).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty and has not been entirely enumerated', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow([1, 2]).take(1).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(false)));

      it('Returns flow not emitting "next" notification when @source is empty', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow([]).notify(spy, Function()).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        testify(
          () => ({ source: [1, 2], spy: chai.spy() }),
          context => aeroflow(context.source).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(...context.source)));
    });

    describe('(@source:date)', () => {
      it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(new Date).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        testify(
          () => ({ source: new Date, spy: chai.spy() }),
          context => aeroflow(context.source).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.source)));
    });

    describe('(@source:error)', () => {
      it('Returns flow emitting "done" notification argumented with @source', () =>
        testify(
          () => ({ source: new Error('test'), spy: chai.spy() }),
          context => aeroflow(context.source).notify(Function(), context.spy).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.source)));

      it('Returns flow not emitting "next" notification', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(new Error('test')).notify(spy, Function()).run(),
          spy => chai.expect(spy).not.to.have.been.called()));
    });

    describe('(@source:function)', () => {
      it('Calls @source and passes context data as first argument', () =>
        testify(
          () => ({ data: {}, source: chai.spy() }),
          context => aeroflow(context.source).run(context.data),
          context => chai.expect(context.source).to.have.been.called.with(context.data)));

      it('Returns flow eventually emitting "done" notification argumented with "true" when @source does not throw', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(Function()).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with error thrown by @source', () =>
        testify(
          () => ({ error: new Error('test'), spy: chai.spy() }),
          context => aeroflow(() => { throw context.error }).notify(Function(), context.spy).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.error)));

      it('Returns flow emitting "next" notification argumented with result returned by @source', () =>
        testify(
          () => ({ result: 'test', spy: chai.spy() }),
          context => aeroflow(() => context.result).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.result)));
    });

    describe('(@source:iterable)', () => {
      it('Returns empty flow emitting "done" notification argumented with "true" when source is empty', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(new Set).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow eventually emitting "done" notification argumented with "true" when source is not empty and has been entirely enumerated', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(new Set([1, 2])).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow eventually emitting "done" notification argumented with "false" when source is not empty but has not been entirely enumerated', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(new Set([1, 2])).take(1).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(false)));

      it('Returns flow not emitting "next" notification when source is empty', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(new Set).notify(spy, Function()).run(),
          spy => chai.expect(spy).not.to.have.been.called()));

      it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', () =>
        testify(
          () => ({ source: [1, 2], spy: chai.spy() }),
          context => aeroflow(new Set(context.source)).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(...context.source)));
    });

    describe('(@source:null)', () => {
      it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(null).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        testify(
          () => ({ source: null, spy: chai.spy() }),
          context => aeroflow(context.source).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.source)));
    });

    describe('(@source:promise)', () => {
      it('Returns flow eventually emitting "done" notification argumented with "true" when @source resolves', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(Promise.resolve()).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "done" notification argumented with rejection error when @source rejects', () =>
        testify(
          () => ({ error: new Error('test'), spy: chai.spy() }),
          context => aeroflow(Promise.reject(context.error)).notify(Function(), context.spy).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.error)));

      it('Returns flow emitting "next" notification argumented with result resolved by @source', () =>
        testify(
          () => ({ result: 'test', spy: chai.spy() }),
          context => aeroflow(Promise.resolve(context.result)).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.source)));
    });

    describe('(@source:string)', () => {
      it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow('test').notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        testify(
          () => ({ source: 'test', spy: chai.spy() }),
          context => aeroflow(context.source).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.source)));
    });

    describe('(@source:undefined)', () => {
      it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
        testify(
          () => chai.spy(),
          spy => aeroflow(undefined).notify(Function(), spy).run(),
          spy => chai.expect(spy).to.have.been.called.with(true)));

      it('Returns flow emitting "next" notification argumented with @source', () =>
        testify(
          () => ({ source: undefined, spy: chai.spy() }),
          context => aeroflow(context.source).notify(context.spy, Function()).run(),
          context => chai.expect(context.spy).to.have.been.called.with(context.source)));
    });

  /*
    [
      emptyGeneratorTests,
      expandGeneratorTests,
      justGeneratorTests,

      averageOperatorTests,
      catchOperatorTests,
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
    ].forEach(test => test(aeroflow, assert));
  */
  });

  return aeroflowTest;

}));