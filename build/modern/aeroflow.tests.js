(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTests = factory());
}(this, function () { 'use strict';

  var emptyGeneratorTests = (aeroflow, execute, expect) => describe('.empty', () => {
    it('Gets instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty,
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  var expandGeneratorTests = (aeroflow, execute, expect) => describe('.expand', () => {
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
      it('Calls @expander with undefined, 0  and context data on first iteration', () =>
        execute(
          context => context.expander = context.spy(),
          context => aeroflow.expand(context.expander).take(1).run(context.data),
          context => expect(context.expander).to.have.been.calledWithExactly(undefined, 0, context.data)));

      it('Calls @expander with value previously returned by @expander, iteration index and context data on subsequent iterations', () =>
        execute(
          context => {
            context.values = [1, 2];
            context.expander = context.spy((_, index) => context.values[index]);
          },
          context => aeroflow.expand(context.expander).take(context.values.length + 1).run(context.data),
          context => [undefined].concat(context.values).forEach((value, index) =>
            expect(context.expander.getCall(index)).to.have.been.calledWithExactly(value, index, context.data))));

      it('If @expander throws, emits only single faulty "done" with thrown error', () =>
        execute(
          context => context.expander = context.fail,
          context => aeroflow(context.expander).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(context.error);
          }));

      it('Emits "next" for each serial value returned by @expander, then not being infinite, lazy "done"', () =>
        execute(
          context => {
            context.values = [1, 2, 3];
            context.expander = context.spy((_, index) => context.values[index]);
          },
          context => aeroflow.expand(context.expander).take(context.values.length).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@expander:function, @seed)', () => {
      it('Calls @expander with @seed on first iteration', () =>
        execute(
          context => {
            context.expander = context.spy();
            context.seed = 'test';
          },
          context => aeroflow.expand(context.expander, context.seed).take(1).run(),
          context => expect(context.expander).to.have.been.calledWith(context.seed)));
    });

    describe('(@expander:!function)', () => {
      it('Emits "next" with @expander', () =>
        execute(
          context => context.expander = 'test',
          context => aeroflow.expand(context.expander).take(1).run(context.next),
          context => expect(context.next).to.have.been.calledWith(context.expander)));
    });
  });

  var justGeneratorTests = (aeroflow, execute, expect) => describe('.just', () => {
    it('Is static method', () =>
      execute(
        context => aeroflow.just,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.just(),
          context => expect(context.result).to.be.an('Aeroflow')));
    });

    describe('(@value:aeroflow)', () => {
      it('Emits single "next" with @value, then single greedy "done"', () =>
        execute(
          context => context.value = aeroflow.empty,
          context => aeroflow.just(context.value).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@value:array)', () => {
      it('Emits single "next" with @value, then single greedy "done"', () =>
        execute(
          context => context.value = [42],
          context => aeroflow.just(context.value).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@value:function)', () => {
      it('Emits single "next" with @value, then single greedy "done"', () =>
        execute(
          context => context.value = Function(),
          context => aeroflow.just(context.value).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@value:iterable)', () => {
      it('Emits single "next" with @value, then single greedy "done"', () =>
        execute(
          context => context.value = new Set,
          context => aeroflow.just(context.value).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@value:promise)', () => {
      it('Emits single "next" with @value, then single greedy "done"', () =>
        execute(
          context => context.value = Promise.resolve(),
          context => aeroflow.just(context.value).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });
  });

  var averageOperatorTests = (aeroflow, execute, expect) => describe('#average', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.average,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.average(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.average().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits numeric values, emits single "next" with average of values, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 2, 5],
          context => aeroflow(context.values).average().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(
              context.values.reduce((sum, value) => sum + value, 0) / context.values.length);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));

      it('When flow emits some not numeric values, emits single "next" with NaN, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 'test', 2],
          context => aeroflow(context.values).average().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(NaN);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });
  });

  var catchOperatorTests = (aeroflow, execute, expect) => describe('#catch', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.catch,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.catch(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.catch().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits only error, supresses error and emits only single lazy "done"', () =>
        execute(
          context => aeroflow(context.error).catch().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));

      it('When flow emits some values and then error, emits "next" for each serial value before error, then supresses error and emits single lazy "done" ignoring values emitted after error', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(context.values, context.error, context.values).catch().run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@alternative:array)', () => {
      it('When flow emits error, emits "next" for each serial value from @alternative, then single lazy "done"', () =>
        execute(
          context => context.alternative = [1, 2],
          context => aeroflow(context.error).catch(context.alternative).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.alternative.length);
            context.alternative.forEach((value, index) => 
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@alternative:function)', () => {
      it('When flow is empty, does not call @alternative', () =>
        execute(
          context => context.alternative = context.spy(),
          context => aeroflow.empty.catch(context.alternative).run(),
          context => expect(context.alternative).not.to.have.been.called));

      it('When flow does not emit error, does not call @alternative', () =>
        execute(
          context => context.alternative = context.spy(),
          context => aeroflow('test').catch(context.alternative).run(),
          context => expect(context.alternative).not.to.have.been.called));

      it('When flow emits several values and then error, calls @alternative once with emitted error and context data, then emits "next" for each serial value from result returned by @alternative, then emits single lazy "done"', () =>
        execute(
          context => {
            context.values = [1, 2];
            context.alternative = context.spy(context.values);
          },
          context => aeroflow(context.values, context.error).catch(context.alternative).run(context.next, context.done, context.data),
          context => {
            expect(context.alternative).to.have.been.calledOnce;
            expect(context.alternative).to.have.been.calledWith(context.error, context.data);
            expect(context.next).to.have.callCount(context.values.length * 2);
            context.values.forEach((value, index) => {
              expect(context.next.getCall(index)).to.have.been.calledWith(value);
              expect(context.next.getCall(index + context.values.length)).to.have.been.calledWith(value);
            });
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@alternative:string)', () => {
      it('When flow emits error, emits "next" with @alternative, then single lazy "done"', () =>
        execute(
          context => context.alternative = 'test',
          context => aeroflow(context.error).catch(context.alternative).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.alternative);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });
  });

  var coalesceOperatorTests = (aeroflow, execute, expect) => describe('#coalesce', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.coalesce,
        context => expect(context.result).to.be.a('function')));

    describe('()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.coalesce(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.coalesce().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('(@alternative:array)', () => {
      it('When flow is empty, emits "next" for each serial value from @alternative, then emits single greedy "done"', () =>
        execute(
          context => context.alternative = [1, 2],
          context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.alternative.length);
            context.alternative.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@alternative:function)', () => {
      it('When flow is empty, calls @alternative once with context data, emits single "next" with value returned by @alternative, then emits single greedy "done"', () =>
        execute(
          context => {
            context.values = [1, 2];
            context.alternative = context.spy(context.values);
          },
          context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done, context.data),
          context => {
            expect(context.alternative).to.have.been.calledOnce;
            expect(context.alternative).to.have.been.calledWith(context.data);
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));

      it('When flow emits error, does not call @alternative', () =>
        execute(
          context => context.alternative = context.spy(),
          context => aeroflow(context.error).coalesce(context.alternative).run(),
          context => expect(context.alternative).to.have.not.been.called));

      it('When flow emits some values, does not call @alternative', () =>
        execute(
          context => context.alternative = context.spy(),
          context => aeroflow('test').coalesce(context.alternative).run(),
          context => expect(context.alternative).to.have.not.been.called));
    });

      describe('(@alternative:promise)', () => {
      it('When flow is empty, emits single "next" with value resolved by @alternative, then emits single greedy "done"', () =>
        execute(
          context => {
            context.value = 42;
            context.alternative = Promise.resolve(context.value);
          },
          context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@alternative:string)', () => {
      it('When flow is empty, emits single "next" with @alternative, then emits single greedy "done"', () =>
        execute(
          context => context.alternative = 'test',
          context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.alternative);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });
  });

  const aeroflowTests = (aeroflow, expect, sinon) => {

  class Context {
    get done() {
      return this._done || (this._done = this.spy());
    }
    set done(result) {
      this._done = this.spy(result);
    }
    get next() {
      return this._next || (this._next = this.spy());
    }
    set next(result) {
      this._next = this.spy(result);
    }
  }
  Object.defineProperties(Context.prototype, {
    data: { value: { data: true } },
    error: { value: new Error('test') },
    fail: { value: () => { throw this.error } },
    noop: { value: () => { } },
    spy: { value: result => sinon.spy(typeof result === 'function' ? result : () => result) }
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

      it('Emits only single greedy "done"', () =>
        execute(
          context => aeroflow().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('(@source:aeroflow)', () => {
      it('When @source is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow(aeroflow.empty).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(aeroflow(context.values)).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach(
              (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@source:array)', () => {
      it('When @source is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow([]).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(context.values).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach(
              (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@source:date)', () => {
      it('Emits single "next" with @source, then single greedy "done"', () =>
        execute(
          context => context.source = new Date,
          context => aeroflow(context.source).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.source);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@source:error)', () => {
      it('Emits only single faulty "done" with @source', () =>
        execute(
          context => aeroflow(context.error).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(context.error);
          }));
    });

    describe('(@source:function)', () => {
      it('Calls @source once with context data', () =>
        execute(
          context => context.source = context.spy(),
          context => aeroflow(context.source).run(context.data),
          context => {
            expect(context.source).to.have.been.calledOnce;
            expect(context.source).to.have.been.calledWith(context.data);
          }));

      it('When @source returns value, emits single "next" with value, then single greedy "done"', () =>
        execute(
          context => aeroflow(() => context.data).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.data);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));

      it('When @source throws, emits only single faulty "done" with thrown error', () =>
        execute(
          context => aeroflow(context.fail).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(context.error);
          }));
    });

    describe('(@source:iterable)', () => {
      it('When @source is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow(new Set).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(new Set(context.values)).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach(
              (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@source:null)', () => {
      it('Emits single "next" with @source, then single greedy "done"', () =>
        execute(
          context => context.source = null,
          context => aeroflow(context.source).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.source);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@source:promise)', () => {
      it('When @source rejects, emits single faulty "done" with rejected error', () =>
        execute(
          context => aeroflow(Promise.reject(context.error)).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(context.error);
          }));

      it('When @source resolves, emits single "next" with resolved value, then single greedy "done"', () =>
        execute(
          context => context.value = 42,
          context => aeroflow(Promise.resolve(context.value)).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@source:string)', () => {
      it('Emits single "next" with @source, then single greedy "done"', () =>
        execute(
          context => context.source = 'test',
          context => aeroflow(context.source).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.source);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(@source:undefined)', () => {
      it('Emits single "next" with @source, then single greedy "done"', () =>
        execute(
          context => context.source = undefined,
          context => aeroflow(context.source).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.source);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    describe('(...@sources)', () => {
      it('Emits "next" with each serial value from @sources, then single greedy "done"', () =>
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
          context => aeroflow(...context.sources).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
          }));
    });

    [
      emptyGeneratorTests,
      expandGeneratorTests,
      justGeneratorTests,

      averageOperatorTests,
      catchOperatorTests,
      coalesceOperatorTests //,
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
    ].forEach(test => test(aeroflow, execute, expect));
  });

  }

  return aeroflowTests;

}));