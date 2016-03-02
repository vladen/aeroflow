export default (aeroflow, execute, expect, sinon) => describe('aeroflow().toSet', () => {
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
