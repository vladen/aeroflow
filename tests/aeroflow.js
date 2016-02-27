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
import toArrayOperatorTests from './operators/toArray';
import toMapOperatorTests from './operators/toMap';
import toSetOperatorTests from './operators/toSet';
import toStringOperatorTests from './operators/toString';

const aeroflowTests = (aeroflow, expect, sinon) => {

function execute(arrange, act, assert) {
  if (arguments.length < 3) {
    assert = act;
    act = arrange;
    arrange = null;
  }
  const context = {
    nop: Function(),
    spy: sinon.spy()
  };
  if (arrange) arrange(context);
  return Promise
    .resolve(act(context))
    .catch(Function())
    .then(result => {
      context.result = result;
      assert(context);
    });
}

describe('aeroflow', () => {
  it('Is function', () =>
    execute(
      context => {}, /* arrange (optional) */
      context => aeroflow, /* act */
      context => expect(context.result).to.be.a('function') /* assert */ ));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits done(true, @context) notification', () =>
      execute(
        context => aeroflow().notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Does not emit next notification', () =>
      execute(
        context => aeroflow().notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));
  });

  describe('(@source:aeroflow)', () => {
    it('Emits done(true, @context) notification when @source is empty', () =>
      execute(
        context => aeroflow(aeroflow.empty).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits done(true, @context) notification when @source is not empty and has been entirely enumerated', () =>
      execute(
        context => aeroflow(aeroflow([1, 2])).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits done(false, @context) notification when @source is not empty but has not been entirely enumerated', () =>
      execute(
        context => aeroflow(aeroflow([1, 2])).take(1).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(false, context)));

    it('Does not emit next notification when @source is empty', () =>
      execute(
        context => aeroflow(aeroflow.empty).notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));

    it('Emits several next(@value, @index, @context) notifications for each @value from @source', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(aeroflow(context.values)).notify(context.spy).run(context),
        context => context.values.forEach(
          (value, index) => expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context))));
  });

  describe('(@source:array)', () => {
    it('Emits done(true, @context) notification when @source is empty', () =>
      execute(
        context => aeroflow([]).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWith(true, context)));

    it('Emits done(true, @context) notification when @source is not empty and has been entirely enumerated', () =>
      execute(
        context => aeroflow([1, 2]).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits done(false, @context) notification when @source is not empty and has not been entirely enumerated', () =>
      execute(
        context => aeroflow([1, 2]).take(1).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(false, context)));

    it('Does not emit next notification when @source is empty', () =>
      execute(
        context => aeroflow([]).notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));

    it('Emits several next(@value, @index, @context) notifications for each subsequent @value from @source', () =>
      execute(
        context => context.source = [1, 2],
        context => aeroflow(context.source).notify(context.spy).run(context),
        context => context.source.forEach(
          (value, index) => expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context))));
  });

  describe('(@source:date)', () => {
    it('Emits done(true, @context) notification', () =>
      execute(
        context => context.source = new Date,
        context => aeroflow(context.source).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits next(@source, 0, @context) notification', () =>
      execute(
        context => context.source = new Date,
        context => aeroflow(context.source).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context)));
  });

  describe('(@source:error)', () => {
    it('Emits done(true, @context) notification', () =>
      execute(
        context => context.source = new Error('test'),
        context => aeroflow(context.source).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.source, context)));

    it('Does not emit next notification', () =>
      execute(
        context => aeroflow(new Error('test')).notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));
  });

  describe('(@source:function)', () => {
    it('Calls @source(context data)', () =>
      execute(
        context => context = 42,
        context => aeroflow(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWith(context)));

    it('Emits done(true, @context) notification when @source does not throw', () =>
      execute(
        context => aeroflow(context.nop).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits done(@error, @context) notification when @source throws @error', () =>
      execute(
        context => context.error = new Error('test'),
        context => aeroflow(() => { throw context.error }).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.error, context)));

    it('Emits next(@value, 0, @context) notification when @source returns @value', () =>
      execute(
        context => context.value = 42,
        context => aeroflow(() => context.value).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
  });

  describe('(@source:iterable)', () => {
    it('Emits done(true, @context) notification when source is empty', () =>
      execute(
        context => aeroflow(new Set).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits done(true, @context) notification when source is not empty and has been entirely enumerated', () =>
      execute(
        context => aeroflow(new Set([1, 2])).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits done(false, @context) notification when source is not empty but has not been entirely enumerated', () =>
      execute(
        context => aeroflow(new Set([1, 2])).take(1).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(false, context)));

    it('Does not emit next notification when source is empty', () =>
      execute(
        context => aeroflow(new Set).notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));

    it('Emits several next(@value, @index, @context) notifications for each subsequent @value from @source', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(new Set(context.values)).notify(context.spy).run(context),
        context => context.values.forEach(
          (value, index) => expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context))));
  });

  describe('(@source:null)', () => {
    it('Emits done(true, @context) notification', () =>
      execute(
        context => aeroflow(null).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits next(@source, 0, @context) notification', () =>
      execute(
        context => context.source = null,
        context => aeroflow(context.source).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context)));
  });

  describe('(@source:promise)', () => {
    it('Emits done(true, @context) notification when @source resolves', () =>
      execute(
        context => aeroflow(Promise.resolve()).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits done(@error, @context) notification when @source rejects with @error', () =>
      execute(
        context => context.error = new Error('test'),
        context => aeroflow(Promise.reject(context.error)).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.error, context)));

    it('Emits next(@value, 0, @context) notification when @source resolves with @value', () =>
      execute(
        context => context.value = 42,
        context => aeroflow(Promise.resolve(context.value)).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));

    it('Does not emit next notification when @source rejects', () =>
      execute(
        context => aeroflow(Promise.reject()).notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));
  });

  describe('(@source:string)', () => {
    it('Emits done(true, @context) notification', () =>
      execute(
        context => aeroflow('test').notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits next(@source, 0, @context) notification', () =>
      execute(
        context => context.source = 'test',
        context => aeroflow(context.source).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWith(context.source, 0, context)));
  });

  describe('(@source:undefined)', () => {
    it('Emits done(true, @context) notification', () =>
      execute(
        context => aeroflow(undefined).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits next(@source, 0, @context) notification', () =>
      execute(
        context => context.source = undefined,
        context => aeroflow(context.source).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context)));
  });

  describe('(...@sources)', () => {
    it('Emits serveral next(@value, @index, @context) notifications for each subsequent @value from @sources', () =>
      execute(
        context => {
          const values = context.values = [true, new Date, null, 42, 'test', Symbol('test'), undefined];
          context.sources = [
            values[0],
            [values[1]],
            new Set([values[2], values[3]]),
            () => values[4],
            Promise.resolve(values[5]),
            new Promise(resolve => setTimeout(() => resolve(values[6])))
          ];
        },
        context => aeroflow(...context.sources).notify(context.spy).run(context),
        context => context.values.forEach(
          (value, index) => expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context))));
  });

  [
    emptyGeneratorTests,
    expandGeneratorTests,
    justGeneratorTests,

    averageOperatorTests,
    // catchOperatorTests,
    // coalesceOperatorTests,
    countOperatorTests,
    // distinctOperatorTests,
    // everyOperatorTests,
    // filterOperatorTests,
    // groupOperatorTests,
    // mapOperatorTests,
    maxOperatorTests,
    // meanOperatorTests,
    minOperatorTests //,
    // reduceOperatorTests,
    // reverseOperatorTests,
    // skipOperatorTests,
    // sliceOperatorTests,
    // someOperatorTests,
    // sortOperatorTests,
    // sumOperatorTests,
    // takeOperatorTests,
    // toArrayOperatorTests,
    // toMapOperatorTests,
    // toSetOperatorTests,
    // toStringOperatorTests
  ].forEach(test => test(aeroflow, execute, expect, sinon));
});

}

export default aeroflowTests;
