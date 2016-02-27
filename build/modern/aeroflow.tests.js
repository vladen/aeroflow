(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTests = factory());
}(this, function () { 'use strict';

  var emptyGeneratorTests = (aeroflow, execute, expect, sinon) => describe('.empty', () => {
    it('Gets instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty,
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits done(true, @context) notification', () =>
      execute(
        context => aeroflow.empty.notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Does not emit next notification', () =>
      execute(
        context => aeroflow.empty.notify(context.spy).run(),
        context => expect(context.spy).not.to.have.been.called));
  });

  var expandGeneratorTests = (aeroflow, execute, expect, sinon) => describe('.expand', () => {
    it('Is static method', () =>
      execute(
        context => aeroflow.expand,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.expand(),
          context => expect(context.result).to.be.an('Aeroflow')));
    });

    describe('(@expander:function)', () => {
      it('Calls @expander(undefined, 0, @context) at first iteration', () =>
        execute(
          context => aeroflow.expand(context.spy).take(1).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(undefined, 0, context)));

      it('Calls @expander(@value, @index, @context) at subsequent iterations with @value previously returned by @expander', () =>
        execute(
          context => {
            context.expander = (value, ...args) => {
              context.spy(value, ...args);
              return value ? value + 1 : 1;
            };
            context.iterations = 3;
          },
          context => aeroflow.expand(context.expander).take(context.iterations).run(context),
          context => Array(context.iterations).fill(0).forEach(
            (_, index) => expect(context.spy.getCall(index)).to.have.been.calledWithExactly(index || undefined, index, context))));

      it('Emits done(@error, @context) notification with @error thrown by @expander', () =>
        execute(
          context => {
            context.error = new Error('test');
            context.expander = () => { throw context.error };
          },
          context => aeroflow(context.expander).notify(context.nop, context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(context.error, context)));

      it('Emits next(@value, @index, @context) notification for each @value returned by @expander', () =>
        execute(
          context => {
            context.expander = value => value ? value + 1 : 1;
            context.iterations = 3;
          },
          context => aeroflow.expand(context.expander).take(context.iterations).notify(context.spy).run(context),
          context => Array(context.iterations).fill(0).forEach(
            (_, index) => expect(context.spy.getCall(index)).to.have.been.calledWithExactly(index + 1, index, context))));
    });

    describe('(@expander:function, @seed)', () => {
      it('Calls @expander(@seed, 0, @context) at first iteration', () =>
        execute(
          context => context.seed = 'test',
          context => aeroflow.expand(context.spy, context.seed).take(1).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(context.seed, 0, context)));
    });

    describe('(@expander:!function)', () => {
      it('Emits next(@expander, 0, @context) notification', () =>
        execute(
          context => context.expander = 'test',
          context => aeroflow.expand(context.expander).take(1).notify(context.spy).run(),
          context => expect(context.spy).to.have.been.calledWith(context.expander)));
    });
  });

  var justGeneratorTests = (aeroflow, execute, expect, sinon) => describe('.just', () => {
    it('Is static method', () =>
      execute(
        context => aeroflow.just,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.just(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('Emits done(true, @context) notification', () =>
        execute(
          context => aeroflow.just().notify(context.nop, context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

      it('Emits next(undefined, 0, @context) notification', () =>
        execute(
          context => aeroflow.just().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(undefined, 0, context)));
    });

    describe('(@value:aeroflow)', () => {
      it('Emits next(@value, 0, @context) notification', () =>
        execute(
          context => context.value = aeroflow.empty,
          context => aeroflow.just(context.value).notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
    });

    describe('(@value:array)', () => {
      it('Emits next(@value, 0, @context) notification', () =>
        execute(
          context => context.value = [],
          context => aeroflow.just(context.value).notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
    });

    describe('(@value:function)', () => {
      it('Emits next(@value, 0, @context) notification', () =>
        execute(
          context => context.value = Function(),
          context => aeroflow.just(context.value).notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
    });

    describe('(@value:iterable)', () => {
      it('Emits next(@value, 0, @context) notification', () =>
        execute(
          context => context.value = new Set,
          context => aeroflow.just(context.value).notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
    });

    describe('(@value:promise)', () => {
      it('Emits next(@value, 0, @context) notification', () =>
        execute(
          context => context.value = Promise.resolve(),
          context => aeroflow.just(context.value).notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
    });
  });

  var averageOperatorTests = (aeroflow, execute, expect, sinon) => describe('#average', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.average,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.average(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('Does not emit next notification when flow is empty', () =>
        execute(
          context => aeroflow.empty.average().notify(context.spy).run(),
          context => expect(context.spy).to.have.not.been.called));

      it('Emits next(@value, 0, @context) notification when flow emits single numeric @value', () =>
        execute(
          context => context.value = 42,
          context => aeroflow(context.value).average().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));

      it('Emits next(@average, 0, @context) notification with @average of serveral numeric values emitted by flow', () =>
        execute(
          context => context.values = [1, 2, 5],
          context => aeroflow(context.values).average().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(
            context.values.reduce((sum, value) => sum + value, 0) / context.values.length, 0, context)));

      it('Emits next(NaN, 0, @context) notification when flow emits at least one value not convertible to numeric', () =>
        execute(
          context => context.values = [1, 'test', 2],
          context => aeroflow(context.values).average().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(NaN, 0, context)));
    });
  });

  var countOperatorTests = (aeroflow, execute, expect, sinon) => describe('#count', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.count,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.count(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('Emits next(0, 0, @context) notification when flow is empty', () =>
        execute(
          context => aeroflow.empty.count().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWith(0, 0, context)));

      it('Emits next(@count, 0, @context) notification with @count of values emitted by flow', () =>
        execute(
          context => context.values = [1, 2, 3],
          context => aeroflow(context.values).count().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWith(context.values.length, 0, context)));
    });
  });

  var maxOperatorTests = (aeroflow, execute, expect, sinon) => describe('#max', () => {
    it('Is instance method', () => 
      execute(
        context => aeroflow.empty.max,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.max(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('Does not emit next notification when flow is empty', () => 
         execute(
          context => aeroflow.empty.max().notify(context.spy).run(),
          context => expect(context.spy).to.have.not.been.called));

      it('Emits next(@max, 0, @context) notification with @max as maximum value emitted by flow when flow emits numeric values', () =>
        execute(
          context => context.values = [1, 3, 2],
          context => aeroflow(context.values).max().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(Math.max(...context.values), 0, context)));

      it('Emits next(@max, 0, @context) notification with @max as maximum value emitted by flow when flow emits string values', () =>
        execute(
          context => context.values = ['a', 'c', 'b'],
          context => aeroflow(context.values).max().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWith(
            context.values.reduce((max, value) => value > max ? value : max), 0, context)));
    });
  });

  var minOperatorTests = (aeroflow, execute, expect, sinon) => describe('#min', () => {
    it('Is instance method', () => 
      execute(
        context => aeroflow.empty.min,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.min(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('Does not emit next notification when flow is empty', () => 
         execute(
          context => aeroflow.empty.min().notify(context.spy).run(),
          context => expect(context.spy).to.have.not.been.called));

      it('Emits next(@min, 0, @context) notification with @min as minimum value emitted by flow when flow emits numeric values', () =>
        execute(
          context => context.values = [1, 3, 2],
          context => aeroflow(context.values).min().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWithExactly(Math.min(...context.values), 0, context)));

      it('Emits next(@min, 0, @context) notification with @min as minimum value emitted by flow when flow emits string values', () =>
        execute(
          context => context.values = ['a', 'c', 'b'],
          context => aeroflow(context.values).min().notify(context.spy).run(context),
          context => expect(context.spy).to.have.been.calledWith(
            context.values.reduce((min, value) => value < min ? value : min), 0, context)));
    });
  });

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

  return aeroflowTests;

}));