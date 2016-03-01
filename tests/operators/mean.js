export default (aeroflow, execute, expect) => describe('#mean', () => {
  it('Is instance method', () => 
    execute(
      context => aeroflow.empty.mean,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
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