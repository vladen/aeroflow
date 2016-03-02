(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTests = factory());
}(this, function () { 'use strict';

  var factoryTests = (aeroflow, execute, expect) => describe('aeroflow', () => {
    it('Is function', () =>
      execute(
        /* arrange (optional) */
        context => {},
        /* act */
        context => aeroflow,
        /* assert */
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow()', () => {
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

    describe('aeroflow(@source:aeroflow)', () => {
      it('When @source is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow(aeroflow.empty).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When @source is not empty, emits "next" for each value from @source, then single greedy "done"', () =>
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

    describe('aeroflow(@source:array)', () => {
      it('When @source is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow([]).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When @source is not empty, emits "next" for each value from @source, then single greedy "done"', () =>
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

    describe('aeroflow(@source:date)', () => {
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

    describe('aeroflow(@source:error)', () => {
      it('Emits only single faulty "done" with @source', () =>
        execute(
          context => aeroflow(context.error).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(context.error);
          }));
    });

    describe('aeroflow(@source:function)', () => {
      it('Calls @source once', () =>
        execute(
          context => context.source = context.spy(),
          context => aeroflow(context.source).run(),
          context => expect(context.source).to.have.been.calledOnce));

      it('If @source returns value, emits single "next" with returned value, then single greedy "done"', () =>
        execute(
          context => {
            context.value = 42;
            context.source = () => context.value;
          },
          context => aeroflow(context.source).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('If @source throws, emits only single faulty "done" with thrown error', () =>
        execute(
          context => aeroflow(context.fail).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(context.error);
          }));
    });

    describe('aeroflow(@source:iterable)', () => {
      it('When @source is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow(new Set).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When @source is not empty, emits "next" for each value from @source, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(new Set(context.values)).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach(
              (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow(@source:null)', () => {
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

    describe('aeroflow(@source:promise)', () => {
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
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow(@source:string)', () => {
      it('Emits single "next" with @source, then single greedy "done"', () =>
        execute(
          context => context.source = 'test',
          context => aeroflow(context.source).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.source);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow(@source:undefined)', () => {
      it('Emits single "next" with @source, then single greedy "done"', () =>
        execute(
          context => context.source = undefined,
          context => aeroflow(context.source).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.source);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow(...@sources)', () => {
      it('Emits "next" with each value from @sources, then single greedy "done"', () =>
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
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var emptyGeneratorTests = (aeroflow, execute, expect) => describe('aeroflow.empty', () => {
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
          expect(context.done).to.have.been.calledWithExactly(true);
        }));
  });

  var expandGeneratorTests = (aeroflow, execute, expect) => describe('aeroflow.expand', () => {
    it('Is static method', () =>
      execute(
        context => aeroflow.expand,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow.expand()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.expand(),
          context => expect(context.result).to.be.an('Aeroflow')));
    });

    describe('aeroflow.expand(@expander:function)', () => {
      it('Calls @expander with undefined and 0 on first iteration', () =>
        execute(
          context => context.expander = context.spy(),
          context => aeroflow.expand(context.expander).take(1).run(),
          context => expect(context.expander).to.have.been.calledWith(undefined)));

      it('Calls @expander with value previously returned by @expander, iteration index on subsequent iterations', () =>
        execute(
          context => {
            context.values = [1, 2];
            context.expander = context.spy((_, index) => context.values[index]);
          },
          context => aeroflow.expand(context.expander).take(context.values.length + 1).run(),
          context => [undefined].concat(context.values).forEach((value, index) =>
            expect(context.expander.getCall(index)).to.have.been.calledWith(value))));

      it('If @expander throws, emits only single faulty "done" with thrown error', () =>
        execute(
          context => context.expander = context.fail,
          context => aeroflow(context.expander).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(context.error);
          }));

      it('Emits "next" for each value returned by @expander, then, being limited, lazy "done"', () =>
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

    describe('aeroflow.expand(@expander:function, @seed)', () => {
      it('Calls @expander with @seed on first iteration', () =>
        execute(
          context => {
            context.expander = context.spy();
            context.seed = 'test';
          },
          context => aeroflow.expand(context.expander, context.seed).take(1).run(),
          context => expect(context.expander).to.have.been.calledWith(context.seed)));
    });

    describe('aeroflow.expand(@expander:string)', () => {
      it('Emits "next" with @expander', () =>
        execute(
          context => context.expander = 'test',
          context => aeroflow.expand(context.expander).take(1).run(context.next),
          context => expect(context.next).to.have.been.calledWith(context.expander)));
    });
  });

  var justGeneratorTests = (aeroflow, execute, expect) => describe('aeroflow.just', () => {
    it('Is static method', () =>
      execute(
        context => aeroflow.just,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow.just()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.just(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('Emits single "next" with undefined, then single greedy "done"', () =>
        execute(
          context => aeroflow.just().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(undefined);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow.just(@value:aeroflow)', () => {
      it('Emits single "next" with @value, then single greedy "done"', () =>
        execute(
          context => context.value = aeroflow.empty,
          context => aeroflow.just(context.value).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow.just(@value:array)', () => {
      it('Emits single "next" with @value, then single greedy "done"', () =>
        execute(
          context => context.value = [42],
          context => aeroflow.just(context.value).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow.just(@value:function)', () => {
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

    describe('aeroflow.just(@value:iterable)', () => {
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

    describe('aeroflow.just(@value:promise)', () => {
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

  var randomGeneratorTests = (aeroflow, execute, expect) => describe('aeroflow.random', () => {
    it('Is static method', () =>
      execute(
        context => aeroflow.random,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow.random()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.random(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('Emits "next" with each random value in the range [0, 1), then single lazy "done"', () =>
        execute(
          context => context.limit = 5,
          context => aeroflow.random().take(context.limit).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.limit);
            const results = new Set(Array(context.limit).fill().map((_, index) =>
              context.next.getCall(index).args[0]));
            expect(results).to.have.property('size', context.limit);
            results.forEach(value => expect(value).to.be.within(0, 1));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow.random(@maximum:number)', () => {
      it('Emits "next" with each random value in the range [0, @maximum), then single lazy "done"', () =>
        execute(
          context => {
            context.limit = 5;
            context.maximum = 9;
          },
          context => aeroflow.random(context.maximum).take(context.limit).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.limit);
            const results = new Set(Array(context.limit).fill().map((_, index) =>
              context.next.getCall(index).args[0]));
            expect(results.size).to.be.above(1);
            results.forEach(value => expect(value).to.be.within(0, context.maximum));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow.random(@minimum:number, @maximum:number)', () => {
      it('Emits "next" with each random value in the range [@minimum, @maximum), then single lazy "done"', () =>
        execute(
          context => {
            context.limit = 5;
            context.minimum = 1;
            context.maximum = 9;
          },
          context => aeroflow.random(context.minimum, context.maximum).take(context.limit).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.limit);
            const results = new Set(Array(context.limit).fill().map((_, index) =>
              context.next.getCall(index).args[0]));
            expect(results.size).to.be.above(1);
            results.forEach(value => expect(value).to.be.within(context.minimum, context.maximum));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });
  });

  var repeatGeneratorTests = (aeroflow, execute, expect) => describe('aeroflow.repeat', () => {
    it('Is static method', () =>
      execute(
        context => aeroflow.repeat,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow.repeat()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.repeat(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('Emits "next" with undefined, then single lazy "done"', () =>
        execute(
          context => aeroflow.repeat().take(1).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(undefined);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow.repeat(@repeater:function)', () => {
      it('Calls @repeater with index of current iteration', () =>
        execute(
          context => {
            context.limit = 3;
            context.repeater = context.spy();
          },
          context => aeroflow.repeat(context.repeater).take(context.limit).run(),
          context => {
            expect(context.repeater).to.have.callCount(context.limit);
            Array(context.limit).fill(undefined).forEach((_, index) =>
              expect(context.repeater.getCall(index)).to.have.been.calledWith(index));
          }));

      it('Emits "next" with each value returned by @repeater, then single lazy "done"', () =>
        execute(
          context => {
            context.limit = 3;
            context.repeater = index => index;
          },
          context => aeroflow.repeat(context.repeater).take(context.limit).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.limit);
            Array(context.limit).fill().forEach((_, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(index));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow.repeat(@repeater:function, @delayer:function)', () => {
      it('Calls @repeater and @delayer with index of iteration', () =>
        execute(
          context => {
            context.limit = 3;
            context.delayer = context.spy(() => 0);
            context.repeater = context.spy();
          },
          context => aeroflow.repeat(context.repeater, context.delayer).take(context.limit).run(),
          context => {
            expect(context.delayer).to.have.callCount(context.limit);
            expect(context.repeater).to.have.callCount(context.limit);
            Array(context.limit).fill(undefined).forEach((_, index) => {
              expect(context.delayer.getCall(index)).to.have.been.calledWith(index);
              expect(context.repeater.getCall(index)).to.have.been.calledWith(index);
            });
          }));

      it('Emits "next" with each value returned by @repeater and delayed to the number of milliseconds returned by @delayer, then single lazy "done"', () =>
        execute(
          context => {
            context.delay = 25;
            context.limit = 3;
            context.delayer = index => index * context.delay;
            context.repeater = index => ({ date: new Date, index });
          },
          context => aeroflow.repeat(context.repeater, context.delayer).take(context.limit).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.limit);
            const results = Array(context.limit).fill().map((_, index) =>
              context.next.getCall(index).args[0]);
            results.forEach((result, index) =>
              expect(result.index).to.equal(index));
            results.reduce((prev, next) => {
              expect(next.date - prev.date).to.be.not.below(context.delay);
              return next;
            });
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('(@repeater:string)', () => {
      it('Emits "next" with @repeater value, then single lazy "done"', () =>
        execute(
          context => {
            context.limit = 3;
            context.repeater = 42;
          },
          context => aeroflow.repeat(context.repeater).take(context.limit).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.limit);
            Array(context.limit).fill().forEach((_, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(context.repeater));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });
  });

  var averageOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().average', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.average,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().average()', () => {
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

  var catchOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().catch', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.catch,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().catch()', () => {
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

      it('When flow emits some values and then error, emits "next" for each value before error, then supresses error and emits single lazy "done" ignoring values emitted after error', () =>
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

    describe('aeroflow().catch(@alternative:array)', () => {
      it('When flow emits error, emits "next" for each value from @alternative, then single lazy "done"', () =>
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

    describe('aeroflow().catch(@alternative:function)', () => {
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

      it('When flow emits several values and then error, calls @alternative once with emitted error, then emits "next" for each value from result returned by @alternative, then emits single lazy "done"', () =>
        execute(
          context => {
            context.values = [1, 2];
            context.alternative = context.spy(context.values);
          },
          context => aeroflow(context.values, context.error).catch(context.alternative).run(context.next, context.done),
          context => {
            expect(context.alternative).to.have.been.calledOnce;
            expect(context.alternative).to.have.been.calledWithExactly(context.error);
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

    describe('aeroflow().catch(@alternative:string)', () => {
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

  var coalesceOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().coalesce', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.coalesce,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().coalesce()', () => {
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

    describe('aeroflow().coalesce(@alternative:array)', () => {
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

    describe('aeroflow().coalesce(@alternative:function)', () => {
      it('When flow is empty, calls @alternative once, emits single "next" with value returned by @alternative, then emits single greedy "done"', () =>
        execute(
          context => {
            context.values = [1, 2];
            context.alternative = context.spy(context.values);
          },
          context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done),
          context => {
            expect(context.alternative).to.have.been.calledOnce;
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

      describe('aeroflow().coalesce(@alternative:promise)', () => {
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

    describe('aeroflow().coalesce(@alternative:string)', () => {
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

  var countOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().count', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.count,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().count()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.count(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits single "next" with 0, then single greedy "done"', () =>
        execute(
          context => aeroflow.empty.count().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(0);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow is not empty, emits single "next" with count of values, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 2, 3],
          context => aeroflow(context.values).count().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.values.length);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits error, emits only single faulty "done"', () =>
        execute(
          context => aeroflow(context.error).count().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(context.error);
          }));
    });
  });

  var distinctOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().distinct', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.distinct,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().distinct()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.distinct(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.distinct().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values, emits "next" for each unique value, then emits single greedy "done"', () =>
        execute(
          context => context.values = [1, 2, 1],
          context => aeroflow(context.values).distinct().run(context.next, context.done),
          context => {
            const unique = context.values.reduce((array, value) => {
              if (!~array.indexOf(value)) array.push(value);
              return array;
            }, []);
            expect(context.next).to.have.callCount(unique.length);
            unique.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().distinct(true)', () => {
      it('When flow emits several values, emits "next" for each unique and first-non repeating value, then emits single greedy "done"', () =>
        execute(
          context => context.values = [1, 1, 2, 2],
          context => aeroflow(context.values).distinct().run(context.next, context.done),
          context => {
            let last;
            const unique = context.values.reduce((array, value) => {
              if (value !== last) array.push(last = value);
              return array;
            }, []);
            expect(context.next).to.have.callCount(unique.length);
            unique.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var everyOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().every', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.every,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().every()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.every(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits "next" with true, then single greedy "done"', () =>
        execute(
          context => aeroflow.empty.every().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several truthy values, emits "next" with true, then single greedy "done"', () =>
        execute(
          context => context.values = [true, 1, 'test'],
          context => aeroflow(context.values).every().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits at least one falsey value, emits "next" with false, then single lazy "done"', () =>
        execute(
          context => context.values = [true, 1, ''],
          context => aeroflow(context.values).every().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow().every(@condition:function)', () => {
      it('When flow is empty, does not call @condition', () => 
        execute(
          context => context.condition = context.spy(),
          context => aeroflow.empty.every(context.condition).run(),
          context => expect(context.condition).to.have.not.been.called));

      it('When flow is not empty, calls @condition with each emitted value and its index until @condition returns falsey result', () => 
        execute(
          context => {
            context.values = [1, 2];
            context.condition = context.spy((_, index) => index !== context.values.length - 1);
          },
          context => aeroflow(context.values, 3).every(context.condition).run(),
          context => {
            expect(context.condition).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.condition.getCall(index)).to.have.been.calledWith(value, index));
          }));

      it('When flow emits several values and all values pass the @condition test, emits single "next" with true, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = value => value > 0;
            context.values = [1, 2];
          },
          context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values and at least one value does not pass the @condition test, emits single "next" with false, then single lazy "done"', () =>
        execute(
          context => {
            context.condition = value => value > 0;
            context.values = [1, 0];
          },
          context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow().every(@condition:regex)', () => {
      it('When flow emits several values and all values pass the @condition test, emits single "next" with true, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = /a/;
            context.values = ['a', 'aa'];
          },
          context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values and at least one value does not pass the @condition test, emits single "next" with false, then single lazy "done"', () =>
        execute(
          context => {
            context.condition = /a/;
            context.values = ['a', 'b'];
          },
          context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow().every(@condition:string)', () => {
      it('When flow emits several values equal to @condition, emits single "next" with true, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = 1;
            context.values = [1, 1];
          },
          context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values not equal to @condition, emits single "next" with false, then single lazy "done"', () =>
        execute(
          context => {
            context.condition = 1;
            context.values = [1, 2];
          },
          context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });
  });

  var filterOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().filter', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.filter,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().filter()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.filter(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.filter().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values, emits "next" for each truthy value, then single greedy "done"', () =>
        execute(
          context => context.values = [0, 1, false, true, '', 'test'],
          context => aeroflow(context.values).filter().run(context.next, context.done),
          context => {
            const filtered = context.values.filter(value => !!value);
            expect(context.next).to.have.callCount(filtered.length);
            filtered.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().filter(@condition:function)', () => {
      it('When flow is empty, does not call @condition', () => 
        execute(
          context => context.condition = context.spy(),
          context => aeroflow.empty.filter(context.condition).run(),
          context => expect(context.condition).to.have.not.been.called));

      it('When flow is not empty, calls @condition with each emitted value and its index', () => 
        execute(
          context => {
            context.values = [1, 2];
            context.condition = context.spy();
          },
          context => aeroflow(context.values).filter(context.condition).run(),
          context => {
            expect(context.condition).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index));
          }));

      it('When flow emits several values, emits "next" for each value passed the @condition test, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = value => 0 === value % 2;
            context.values = [1, 2, 3];
          },
          context => aeroflow(context.values).filter(context.condition).run(context.next, context.done),
          context => {
            const filtered = context.values.filter(context.condition);
            expect(context.next).to.have.callCount(filtered.length);
            filtered.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().filter(@condition:regex)', () => {
      it('When flow emits several values, emits "next" for each value passed the @condition test, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = /b/;
            context.values = ['a', 'b', 'c'];
          },
          context => aeroflow(context.values).filter(context.condition).run(context.next, context.done),
          context => {
            const filtered = context.values.filter(value => context.condition.test(value));
            expect(context.next).to.have.callCount(filtered.length);
            filtered.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().filter(@condition:number)', () => {
      it('When flow emits several values, emits "next" for each value equal to @condition, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = 2;
            context.values = [1, 2, 3];
          },
          context => aeroflow(context.values).filter(context.condition).run(context.next, context.done),
          context => {
            const filtered = context.values.filter(value => value === context.condition);
            expect(context.next).to.have.callCount(filtered.length);
            filtered.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var mapOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().map', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.map,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().map()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.map(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.map().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow is not empty, emits "next" for each value, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(context.values).map().run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().map(@mapper:function)', () => {
      it('When flow is empty, does not call @mapper', () => 
        execute(
          context => context.mapper = context.spy(),
          context => aeroflow.empty.map(context.mapper).run(),
          context => expect(context.mapper).to.have.not.been.called));

      it('When flow emits several values, calls @mapper for each value with value and its index', () => 
        execute(
          context => {
            context.values = [1, 2];
            context.mapper = context.spy();
          },
          context => aeroflow(context.values).map(context.mapper).run(),
          context => {
            expect(context.mapper).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.mapper.getCall(index)).to.have.been.calledWithExactly(value, index));
          }));

      it('When flow is not empty, emits "next" for each value with result returned by @mapper, then single greedy "done"', () =>
        execute(
          context => {
            context.mapper = value => -value;
            context.values = [1, 2];
          },
          context => aeroflow(context.values).map(context.mapper).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(context.mapper(value)));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().map(@mapper:number)', () => {
      it('When flow is not empty, emits "next" for each value with @mapper, then single greedy "done"', () =>
        execute(
          context => {
            context.mapper = 42;
            context.values = [1, 2];
          },
          context => aeroflow(context.values).map(context.mapper).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((_, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(context.mapper));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var maxOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().max', () => {
    it('Is instance method', () => 
      execute(
        context => aeroflow.empty.max,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().max()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.max(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () => 
         execute(
          context => aeroflow.empty.max().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several numeric values, emits single "next" with maximum emitted value, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 3, 2],
          context => aeroflow(context.values).max().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(Math.max(...context.values));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several string values, emits single "next" with emitted value, then single greedy "done"', () =>
        execute(
          context => context.values = ['a', 'c', 'b'],
          context => aeroflow(context.values).max().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(
              context.values.reduce((max, value) => value > max ? value : max));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var meanOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().mean', () => {
    it('Is instance method', () => 
      execute(
        context => aeroflow.empty.mean,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().mean()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.mean(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () => 
         execute(
          context => aeroflow.empty.mean().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several numeric values, emits single "next" with mean emitted value, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 3, 2],
          context => aeroflow(context.values).mean().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(
              context.values.sort()[Math.floor(context.values.length / 2)]);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var minOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().min', () => {
    it('Is instance method', () => 
      execute(
        context => aeroflow.empty.min,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().min()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.min(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () => 
         execute(
          context => aeroflow.empty.min().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several numeric values, emits single "next" with maximum emitted value, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 3, 2],
          context => aeroflow(context.values).min().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(Math.min(...context.values));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several string values, emits single "next" with minnimum emitted value, then single greedy "done"', () =>
        execute(
          context => context.values = ['a', 'c', 'b'],
          context => aeroflow(context.values).min().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(
              context.values.reduce((min, value) => value < min ? value : min));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var reduceOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().reduce', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.reduce,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().reduce()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.reduce(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.reduce().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values, emits single "next" with first emitted value, then emits single greedy "done"', () =>
        execute(
          context => context.value = 1,
          context => aeroflow(context.value, 2).reduce().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().reduce(@reducer:function)', () => {
      it('When flow is empty, does not call @reducer', () =>
        execute(
          context => context.reducer = context.spy(),
          context => aeroflow.empty.reduce(context.reducer).run(),
          context => expect(context.reducer).to.have.not.been.called));

      it('When flow emits single value, does not call @reducer', () =>
        execute(
          context => context.reducer = context.spy(),
          context => aeroflow(1).reduce(context.reducer).run(),
          context => expect(context.reducer).to.have.not.been.called));

      it('When flow emits several values, calls @reducer with first emitted value, second emitted value and 0 on first iteration', () =>
        execute(
          context => {
            context.values = [1, 2];
            context.reducer = context.spy();
          },
          context => aeroflow(context.values).reduce(context.reducer).run(),
          context => expect(context.reducer).to.have.been.calledWithExactly(context.values[0], context.values[1], 0)));

      it('When flow is not empty, calls @reducer with result returned by @reducer on previous iteration, emitted value and iteration index on next iterations', () =>
        execute(
          context => {
            context.values = [1, 2, 3];
            context.reducer = context.spy((_, value) => value);
          },
          context => aeroflow(context.values).reduce(context.reducer).run(),
          context => {
            expect(context.reducer).to.have.callCount(context.values.length - 1);
            context.values.slice(0, -1).forEach((value, index) =>
              expect(context.reducer.getCall(index)).to.have.been.calledWithExactly(value, context.values[index + 1], index));
          }));

      it('When flow emits several values, emits single "next" with last value returned by @reducer, then emits single greedy "done"', () =>
        execute(
          context => {
            context.value = 3;
            context.reducer = context.spy((_, value) => value);
          },
          context => aeroflow(1, 2, context.value).reduce(context.reducer).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.value);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().reduce(@reducer:function, @seed:function)', () => {
      it('When flow is not empty, calls @seed with context data, calls @reducer with result returned by @seed, first emitted value and 0 on first iteration', () =>
        execute(
          context => {
            context.value = 42;
            context.seed = context.spy(() => context.value);
            context.reducer = context.spy();
          },
          context => aeroflow(context.value).reduce(context.reducer, context.seed).run(),
          context => {
            expect(context.seed).to.have.been.called;
            expect(context.reducer).to.have.been.calledWithExactly(context.value, context.value, 0);
          }));
    });

    describe('aeroflow().reduce(@reducer:function, @seed:number)', () => {
      it('When flow is not empty, calls @reducer with @seed, first emitted value and 0 on first iteration', () =>
        execute(
          context => {
            context.seed = 1;
            context.value = 2;
            context.reducer = context.spy();
          },
          context => aeroflow(context.value).reduce(context.reducer, context.seed).run(),
          context => expect(context.reducer).to.have.been.calledWithExactly(context.seed, context.value, 0)));
    });

    describe('aeroflow().reduce(@reducer:string)', () => {
      it('When flow emits several values, emits single "next" with @reducer, then emits single greedy "done"', () =>
        execute(
          context => context.reducer = 42,
          context => aeroflow(1, 2).reduce(context.reducer).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.reducer);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var reverseOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().reverse', () => {
    it('Is instance method', () => 
      execute(
        context => aeroflow.empty.reverse,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().reverse()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.reverse(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () => 
         execute(
          context => aeroflow.empty.reverse().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow is not empty, emits "next" for each emitted value in reverse order, then emits single greedy "done"', () => 
         execute(
          context => context.values = [1, 2, 3],
          context => aeroflow(context.values).reverse().run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(context.values.length - index - 1)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var skipOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().skip', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.skip,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().skip()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.skip(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.skip().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow is not empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow(42).skip().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().skip(false)', () => {
      it('When flow emits several values, emits "next" for each value, then emits single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(context.values).skip(false).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().skip(true)', () => {
      it('When flow is not empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow(42).skip(true).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().skip(@condition:function)', () => {
      it('When flow is empty, does not call @condition', () => 
        execute(
          context => context.condition = context.spy(),
          context => aeroflow.empty.skip(context.condition).run(),
          context => expect(context.condition).to.have.not.been.called));

      it('When flow emits several values, calls @condition for each value and its index until it returns falsey', () => 
        execute(
          context => {
            context.values = [1, 2];
            context.condition = context.spy((_, index) => index < context.values.length - 1);
          },
          context => aeroflow(context.values, 3).skip(context.condition).run(),
          context => {
            expect(context.condition).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index));
          }));

      it('When flow emits several values, skips values until @condition returns falsey, then emits "next" for all remaining values, then emits single greedy "done"', () =>
        execute(
          context => {
            context.condition = value => value < 2;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).skip(context.condition).run(context.next, context.done),
          context => {
            const position = context.values.findIndex(value => !context.condition(value));
            expect(context.next).to.have.callCount(context.values.length - position);
            context.values.slice(position).forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().skip(@condition:number)', () => {
      it('When flow emits several values and @condition is positive, skips first @condition of values, then emits "next" for each remaining value, then emits single greedy "done"', () =>
        execute(
          context => {
            context.condition = 2;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).skip(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length - context.condition);
            context.values.slice(context.condition).forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values and @condition is negative, emits "next" for each value except the last @condition ones, then emits single greedy "done"', () =>
        execute(
          context => {
            context.condition = -2;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).skip(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length + context.condition);
            context.values.slice(0, -context.condition).forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var sliceOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().slice', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.slice,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().slice()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.slice(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.slice().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values, emits "next" for each value, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(context.values).slice().run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) => 
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().slice(@begin:number)', () => {
      it('When flow emits several values and @begin is positive, emits "next" for each of values starting from @begin, then emits single greedy "done"', () =>
        execute(
          context => {
            context.begin = 1;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).slice(context.begin).run(context.next, context.done),
          context => {
            const sliced = context.values.slice(context.begin);
            expect(context.next).to.have.callCount(sliced.length);
            sliced.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values and @begin is negative, emits "next" for each of values starting from reversed @begin, then emits single greedy "done"', () =>
        execute(
          context => {
            context.begin = -2;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).slice(context.begin).run(context.next, context.done),
          context => {
            const sliced = context.values.slice(context.begin);
            expect(context.next).to.have.callCount(sliced.length);
            sliced.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().slice(@begin:number, @end:number)', () => {
      it('When flow emits several values and both @start and @end are positive, emits "next" for each of values between @begin and @end, then emits single lazy "done"', () =>
        execute(
          context => {
            context.begin = 1;
            context.end = 3;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done),
          context => {
            const sliced = context.values.slice(context.begin, context.end);
            expect(context.next).to.have.callCount(sliced.length);
            sliced.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));

      it('When flow emits several values and @begin is positive but @end is negative, emits "next" for each of values between @begin and reversed @end, then emits single greedy "done"', () =>
        execute(
          context => {
            context.begin = 1;
            context.end = -1;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done),
          context => {
            const sliced = context.values.slice(context.begin, context.end);
            expect(context.next).to.have.callCount(sliced.length);
            sliced.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values and @begin is negative but @end is positive, emits "next" for each of values between reversed @begin and @end, then emits single greedy "done"', () =>
        execute(
          context => {
            context.begin = -3;
            context.end = 3;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done),
          context => {
            const sliced = context.values.slice(context.begin, context.end);
            expect(context.next).to.have.callCount(sliced.length);
            sliced.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values and both @start and @end are negative, emits "next" for each of values between reversed @begin and reversed @end, then emits single greedy "done"', () =>
        execute(
          context => {
            context.begin = -3;
            context.end = -1;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done),
          context => {
            const sliced = context.values.slice(context.begin, context.end);
            expect(context.next).to.have.callCount(sliced.length);
            sliced.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var someOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().some', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.some,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().some()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.some(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits "next" with false, then single greedy "done"', () =>
        execute(
          context => aeroflow.empty.some().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several falsey values, emits "next" with false, then single greedy "done"', () =>
        execute(
          context => context.values = [false, 0, ''],
          context => aeroflow(context.values).some().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits at least one truthy value, emits "next" with true, then single lazy "done"', () =>
        execute(
          context => context.values = [false, 1, ''],
          context => aeroflow(context.values).some().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow().some(@condition:function)', () => {
      it('When flow is empty, does not call @condition', () => 
        execute(
          context => context.condition = context.spy(),
          context => aeroflow.empty.some(context.condition).run(),
          context => expect(context.condition).to.have.not.been.called));

      it('When flow is not empty, calls @condition with each emitted value and its index until @condition returns truthy result', () => 
        execute(
          context => {
            context.values = [1, 2];
            context.condition = context.spy((_, index) => index === context.values.length - 1);
          },
          context => aeroflow(context.values, 3).some(context.condition).run(),
          context => {
            expect(context.condition).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index));
          }));

      it('When flow emits several values and at least one value passes the @condition test, emits single "next" with true, then single lazy "done"', () =>
        execute(
          context => {
            context.condition = value => value > 0;
            context.values = [0, 1];
          },
          context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));

      it('When flow emits several values and no values pass the @condition test, emits single "next" with false, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = value => value > 0;
            context.values = [0, -1];
          },
          context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().some(@condition:regex)', () => {
      it('When flow emits several values and at least one value passes the @condition test, emits single "next" with true, then single lazy "done"', () =>
        execute(
          context => {
            context.condition = /b/;
            context.values = ['a', 'b'];
          },
          context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));

      it('When flow emits several values and no values pass the @condition test, emits single "next" with false, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = /b/;
            context.values = ['a', 'aa'];
          },
          context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().some(@condition:string)', () => {
      it('When flow emits at least one value equal to @condition, emits single "next" with true, then single lazy "done"', () =>
        execute(
          context => {
            context.condition = 1;
            context.values = [1, 2];
          },
          context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(true);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));

      it('When flow emits several values not equal to @condition, emits single "next" with false, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = 1;
            context.values = [2, 3];
          },
          context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(false);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var sumOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().sum', () => {
    it('Is instance method', () => 
      execute(
        context => aeroflow.empty.sum,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().sum()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.sum(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () => 
         execute(
          context => aeroflow.empty.sum().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several numeric values, emits single "next" with sum of emitted values, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 3, 2],
          context => aeroflow(context.values).sum().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.values.reduce((sum, value) =>
              sum + value, 0));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits at least one not numeric value, emits single "next" with NaN, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 'test', 2],
          context => aeroflow(context.values).sum().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(NaN);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var takeOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().take', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.take,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().take()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.take(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits only single greedy "done"', () =>
        execute(
          context => aeroflow.empty.take().run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values, emits "next" for each value, then emits single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(context.values).take().run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().take(false)', () => {
      it('When flow is not empty, emits only single lazy "done"', () =>
        execute(
          context => aeroflow('test').take(false).run(context.next, context.done),
          context => {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow().take(true)', () => {
      it('When flow emits several values, emits "next" for each value, then emits single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(context.values).take(true).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.values.length);
            context.values.forEach((value, index) => 
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().take(@condition:function)', () => {
      it('When flow is empty, does not call @condition', () => 
        execute(
          context => context.condition = context.spy(),
          context => aeroflow.empty.take(context.condition).run(),
          context => expect(context.condition).to.have.not.been.called));

      it('When flow emits several values, calls @condition for each value with value and its index until it returns falsey', () => 
        execute(
          context => {
            context.values = [1, 2];
            context.condition = context.spy((_, index) => index < context.values.length - 1);
          },
          context => aeroflow(context.values, 3).take(context.condition).run(),
          context => {
            expect(context.condition).to.have.callCount(context.values.length);
            context.values.forEach((value, index) =>
              expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index));
          }));

      it('When flow emits several values, then emits "next" for each value until @condition returns falsey and skips remaining values, then emits single lazy "done"', () =>
        execute(
          context => {
            context.condition = value => value < 3;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).take(context.condition).run(context.next, context.done),
          context => {
            const position = context.values.findIndex(value => !context.condition(value));
            expect(context.next).to.have.callCount(context.values.length - position);
            context.values.slice(0, position).forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));
    });

    describe('aeroflow().take(@condition:number)', () => {
      it('When flow emits several values and @condition is positive, emits "next" for each @condition of first values, then emits single lazy "done"', () =>
        execute(
          context => {
            context.condition = 2;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).take(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(context.condition);
            context.values.slice(0, context.condition).forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(false);
          }));

      it('When flow emits several values and @condition is negative, skips several values and emits "next" for each of @condition last values, then single greedy "done"', () =>
        execute(
          context => {
            context.condition = -2;
            context.values = [1, 2, 3, 4];
          },
          context => aeroflow(context.values).take(context.condition).run(context.next, context.done),
          context => {
            expect(context.next).to.have.callCount(-context.condition);
            context.values.slice(-context.condition).forEach((value, index) =>
              expect(context.next.getCall(index)).to.have.been.calledWith(value));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var toArrayOperatorTests = (aeroflow, execute, expect) => describe('aeroflow().toArray', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.toArray,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().toArray()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.toArray(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits single "next" with empty array, then emits single greedy "done"', () =>
        execute(
          context => aeroflow.empty.toArray().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith([]);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values, emits single "next" with array containing all values, then emits single greedy "done"', () =>
        execute(
          context => context.values = [1, 2],
          context => aeroflow(context.values).toArray().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.values);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var toSetOperatorTests = (aeroflow, execute, expect, sinon) => describe('aeroflow().toSet', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.toSet,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().toSet()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.toSet(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits single "next" with empty set, then single greedy "done"', () =>
        execute(
          context => aeroflow.empty.toSet().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(new Set);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several values, emits single "next" with set containing all unique values, then single greedy "done"', () =>
        execute(
          context => context.values = [1, 3, 5, 3, 1],
          context => aeroflow(context.values).toSet().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(new Set(context.values));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  var toStringOperatorTests = (aeroflow, execute, expect, sinon) => describe('aeroflow().toString', () => {
    it('Is instance method', () =>
      execute(
        context => aeroflow.empty.toString,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow().toString()', () => {
      it('Returns instance of Aeroflow', () =>
        execute(
          context => aeroflow.empty.toString(),
          context => expect(context.result).to.be.an('Aeroflow')));

      it('When flow is empty, emits single "next" with empty string, then single greedy "done"', () =>
        execute(
          context => aeroflow.empty.toString().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith('');
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits single number, emits single "next" with number converted to string, then single greedy "done"', () =>
        execute(
          context => context.number = 42,
          context => aeroflow(context.number).toString().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.number.toString());
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits single string, emits single "next" with string, then single greedy "done"', () =>
        execute(
          context => context.string = 'test',
          context => aeroflow(context.string).toString().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.string);
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several numbers, emits single "next" with numbers converted to strings and concatenated via ",", then single greedy "done"', () =>
        execute(
          context => context.numbers = [1, 2],
          context => aeroflow(context.numbers).toString().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.numbers.join());
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));

      it('When flow emits several strings, emits single "next" with strings concatenated via ",", then single greedy "done"', () =>
        execute(
          context => context.strings = ['a', 'b'],
          context => aeroflow(context.strings).toString().run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.strings.join());
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });

    describe('aeroflow().toString(@seperator:string)', () => {
      it('When flow emits several strings, emits single "next" with strings concatenated via @separator, then single greedy "done"', () =>
        execute(
          context => {
            context.separator = ':';
            context.strings = ['a', 'b'];
          },
          context => aeroflow(context.strings).toString(context.separator).run(context.next, context.done),
          context => {
            expect(context.next).to.have.been.calledOnce;
            expect(context.next).to.have.been.calledWith(context.strings.join(context.separator));
            expect(context.done).to.have.been.calledAfter(context.next);
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          }));
    });
  });

  const tests = [
    factoryTests,

    emptyGeneratorTests,
    expandGeneratorTests,
    justGeneratorTests,
    randomGeneratorTests,
    repeatGeneratorTests,

    averageOperatorTests,
    catchOperatorTests,
    coalesceOperatorTests,
    countOperatorTests,
    distinctOperatorTests,
    everyOperatorTests,
    filterOperatorTests,
    // groupOperatorTests,
    mapOperatorTests,
    maxOperatorTests,
    meanOperatorTests,
    minOperatorTests,
    reduceOperatorTests,
    reverseOperatorTests,
    skipOperatorTests,
    sliceOperatorTests,
    someOperatorTests,
    // sortOperatorTests,
    sumOperatorTests,
    takeOperatorTests,
    toArrayOperatorTests,
    // toMapOperatorTests,
    toSetOperatorTests,
    toStringOperatorTests
  ];

  var index = (aeroflow, expect, sinon) => {
    const error = new Error('test');
    function fail() {
      throw error;
    }
    function noop() {}
    function spy(result) {
      return sinon.spy(typeof result === 'function' ? result : () => result);
    }
    class Context {
      get done() {
        return this._done || (this._done = spy());
      }
      set done(result) {
        this._done = spy(result);
      }
      get next() {
        return this._next || (this._next = spy());
      }
      set next(result) {
        this._next = spy(result);
      }
    }
    Object.defineProperties(Context.prototype, {
      error: { value: error },
      fail: { value: fail },
      noop: { value: noop },
      spy: { value: spy }
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
    tests.forEach(test => test(aeroflow, execute, expect));
  }

  return index;

}));