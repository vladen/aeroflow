export default (aeroflow, execute, expect) => describe('aeroflow().toArray', () => {
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
