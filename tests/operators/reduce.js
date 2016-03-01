export default (aeroflow, execute, expect) => describe('#reduce', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.reduce,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
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

  describe('(@reducer:function)', () => {
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

    it('When flow emits several values, calls @reducer with first emitted value, second emitted value, 0 and context data on first iteration', () =>
      execute(
        context => {
          context.values = [1, 2];
          context.reducer = context.spy();
        },
        context => aeroflow(context.values).reduce(context.reducer).run(context.data),
        context => expect(context.reducer).to.have.been.calledWithExactly(context.values[0], context.values[1], 0, context.data)));

    it('When flow is not empty, calls @reducer with result returned by @reducer on previous iteration, emitted value, index of value and context data on next iterations', () =>
      execute(
        context => {
          context.values = [1, 2, 3];
          context.reducer = context.spy((_, value) => value);
        },
        context => aeroflow(context.values).reduce(context.reducer).run(context.data),
        context => {
          expect(context.reducer).to.have.callCount(context.values.length - 1);
          context.values.slice(0, -1).forEach((value, index) =>
            expect(context.reducer.getCall(index)).to.have.been.calledWithExactly(value, context.values[index + 1], index, context.data));
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

  describe('(@reducer:function, @seed:function)', () => {
    it('When flow is not empty, calls @seed with context data, calls @reducer with result returned by @seed, first emitted value, 0 and context data on first iteration', () =>
      execute(
        context => {
          context.value = 42;
          context.seed = context.spy(() => context.value);
          context.reducer = context.spy();
        },
        context => aeroflow(context.value).reduce(context.reducer, context.seed).run(context.data),
        context => {
          expect(context.seed).to.have.been.calledWithExactly(context.data);
          expect(context.reducer).to.have.been.calledWithExactly(context.value, context.value, 0, context.data);
        }));
  });

  describe('(@reducer:function, @seed:number)', () => {
    it('When flow is not empty, calls @reducer with @seed, first emitted value, 0 and context data on first iteration', () =>
      execute(
        context => {
          context.seed = 1;
          context.value = 2;
          context.reducer = context.spy();
        },
        context => aeroflow(context.value).reduce(context.reducer, context.seed).run(context.data),
        context => expect(context.reducer).to.have.been.calledWithExactly(context.seed, context.value, 0, context.data)));
  });

  describe('(@reducer:string)', () => {
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
