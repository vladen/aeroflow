export default (aeroflow, execute, expect) => describe('aeroflow().take', () => {
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

    it('When flow is not empty, emits "next" for each emitted value, then emits single greedy "done"', () =>
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
    it('When flow is not empty, emits "next" for each emitted value, then emits single greedy "done"', () =>
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

    it('When flow is not empty, calls @condition with each emitted value, index of value and context data while it returns truthy', () => 
      execute(
        context => {
          context.values = [1, 2];
          context.condition = context.spy((_, index) => index < context.values.length - 1);
        },
        context => aeroflow(context.values, 3).take(context.condition).run(context.data),
        context => {
          expect(context.condition).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data));
        }));

    it('When flow emits several values, then emits "next" for each emitted value while @condition returns truthy and skips remaining values, then emits single lazy "done"', () =>
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
