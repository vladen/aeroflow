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
    it('Calls @source and passes context data', () =>
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

export default aeroflowTests;
