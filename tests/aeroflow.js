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

class Context {
  constructor() {
    this.spies = new Map;
  }
  get done() {
    return this.spy('done');
  }
  get fake() {
    return this.spy('fake');
  }
  set fake(result) {
    this.spies.set('fake', sinon.spy(() => result));
  }
  get next() {
    return this.spy('next');
  }
  spy(key) {
    let spy = this.spies.get(key);
    if (!spy) this.spies.set(key, spy = sinon.spy());
    return spy;
  }
}
Object.defineProperties(Context.prototype, {
  data: { value: { data: true } },
  error: { value: new Error('test') },
  fail: { value: () => { throw this.error; } },
  noop: { value: Function() }
});

function execute(arrange, act, assert) {
  if (arguments.length < 3) {
    assert = act;
    act = arrange;
    arrange = null;
  }
  const context = new Context;
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

    it('Emits only single "done"', () =>
      execute(
        context => aeroflow().notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.next).to.have.not.been.called;
        }));
  });

  describe('(@source:aeroflow)', () => {
    it('When @source is empty, emits only single "done"', () =>
      execute(
        context => aeroflow(aeroflow.empty).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.next).to.have.not.been.called;
        }));

    it('When @source is not empty, emits "next" for each value from @source, then single "done"', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(aeroflow(context.values)).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          context.values.forEach(
            (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
        }));
  });

  describe('(@source:array)', () => {
    it('When @source is empty, emits only single "done"', () =>
      execute(
        context => aeroflow([]).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.next).to.have.not.been.called;
        }));

    it('When @source is not empty, emits "next" for each value from @source, then "done"', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(context.values).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledAfter(context.next);
          context.values.forEach(
            (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
        }));
  });

  describe('(@source:date)', () => {
    it('Emits single "next" with @source, then single "done"', () =>
      execute(
        context => context.source = new Date,
        context => aeroflow(context.source).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.source);
        }));
  });

  describe('(@source:error)', () => {
    it('Emits only single "done" with @source', () =>
      execute(
        context => aeroflow(context.error).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(context.error);
          expect(context.next).to.have.not.been.called;
        }));
  });

  describe('(@source:function)', () => {
    it('Calls @source once with context data', () =>
      execute(
        context => aeroflow(context.fake).run(context.data),
        context => {
          expect(context.fake).to.have.been.calledOnce;
          expect(context.fake).to.have.been.calledWith(context.data)
        }));

    it('When @source returns value, emits single "next" with value, then single "done"', () =>
      execute(
        context => aeroflow(() => context.data).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.data);
        }));

    it('When @source throws, emits only single "done" with error', () =>
      execute(
        context => aeroflow(context.fail).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(context.error);
          expect(context.next).to.have.not.been.called;
        }));
  });

  describe('(@source:iterable)', () => {
    it('When @source is empty, emits only single "done"', () =>
      execute(
        context => aeroflow(new Set).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.next).to.have.not.been.called;
        }));

    it('When @source is not empty, emits "next" for each value from @source, then single "done"', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(new Set(context.values)).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          context.values.forEach(
            (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
        }));
  });

  describe('(@source:null)', () => {
    it('Emits single "next" with @source, then single "done"', () =>
      execute(
        context => context.source = null,
        context => aeroflow(context.source).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.source);
        }));
  });

  describe('(@source:promise)', () => {
    it('When @source rejects, emits single "done" with rejected error', () =>
      execute(
        context => aeroflow(Promise.reject(context.error)).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(context.error);
          expect(context.next).to.have.not.been.called;
        }));

    it('When @source resolves, emits single "next" with resolved value, then single "done"', () =>
      execute(
        context => context.value = 42,
        context => aeroflow(Promise.resolve(context.value)).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.value);
        }));
  });

  describe('(@source:string)', () => {
    it('Emits single "next" with @source, then single "done"', () =>
      execute(
        context => context.source = 'test',
        context => aeroflow(context.source).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.source);
        }));
  });

  describe('(@source:undefined)', () => {
    it('Emits single "next" with @source, then single "done"', () =>
      execute(
        context => context.source = undefined,
        context => aeroflow(context.source).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.source);
        }));
  });

  describe('(...@sources)', () => {
    it('Emits "next" for each value from @sources, then single "done"', () =>
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
        context => aeroflow(...context.sources).notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
        }));
  });

  [
    // emptyGeneratorTests,
    // expandGeneratorTests,
    // justGeneratorTests,

    // averageOperatorTests,
    // catchOperatorTests,
    // coalesceOperatorTests,
    // countOperatorTests,
    // distinctOperatorTests,
    // everyOperatorTests,
    // filterOperatorTests,
    // groupOperatorTests,
    // mapOperatorTests,
    // maxOperatorTests,
    // meanOperatorTests,
    // minOperatorTests,
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
