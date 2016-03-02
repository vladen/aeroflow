export default (aeroflow, execute, expect) => describe('aeroflow().count', () => {
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
