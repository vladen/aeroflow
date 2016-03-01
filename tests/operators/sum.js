export default (aeroflow, execute, expect) => describe('#sum', () => {
  it('Is instance method', () => 
    execute(
      context => aeroflow.empty.sum,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
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
