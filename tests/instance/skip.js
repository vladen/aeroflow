export default (aeroflow, execute, expect) => describe('aeroflow().skip', () => {
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
