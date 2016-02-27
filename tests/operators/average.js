export default (aeroflow, execute, expect, sinon) => describe('#average', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.average,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.average(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single "done"', () =>
      execute(
        context => aeroflow.empty.average().notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.next).to.have.not.been.called;
        }));

    it('When values are numeric, emits single "next" with average of values, then single "done"', () =>
      execute(
        context => context.values = [1, 2, 5],
        context => aeroflow(context.values).average().notify(context.next, context.done).run(),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(
            context.values.reduce((sum, value) => sum + value, 0) / context.values.length, 0, context);
        }));

    it('When some values are not numeric, emits single "next" with NaN, then single "done"', () =>
      execute(
        context => context.values = [1, 'test', 2],
        context => aeroflow(context.values).average().notify(context.next, context.done).run(context),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.next).to.have.been.calledOnce;
          expect(context.spy).to.have.been.calledWith(NaN);
        }));
  });
});
