export default (aeroflow, execute, expect) => describe('aeroflow().average', () => {
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
