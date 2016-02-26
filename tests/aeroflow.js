import emptyGeneratorTests from './generators/empty';
import expandGeneratorTests from './generators/expand';
import justGeneratorTests from './generators/just';

import averageOperatorTests from './operators/average';
import catchOperatorTests from './operators/catch';
import coalesceOperatorTests from './operators/coalesce';
import countOperatorTests from './operators/count';
import distinctOperatorTests from './operators/distinct';
import everyOperatorTests from './operators/every';
import filterOperatorTests from './operators/filter';
import groupOperatorTests from './operators/group';
import mapOperatorTests from './operators/map';
import maxOperatorTests from './operators/max';
import meanOperatorTests from './operators/mean';
import minOperatorTests from './operators/min';
import reduceOperatorTests from './operators/reduce';
import reverseOperatorTests from './operators/reverse';
import skipOperatorTests from './operators/skip';
import sliceOperatorTests from './operators/slice';
import someOperatorTests from './operators/some';
import sortOperatorTests from './operators/sort';
import sumOperatorTests from './operators/sum';
import takeOperatorTests from './operators/take';
import tapOperatorTests from './operators/tap';
import toArrayOperatorTests from './operators/toArray';
import toMapOperatorTests from './operators/toMap';
import toSetOperatorTests from './operators/toSet';
import toStringOperatorTests from './operators/toString';

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

export default aeroflowTests;
