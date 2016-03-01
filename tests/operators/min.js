export default (aeroflow, execute, expect) => describe('#min', () => {
  it('Is instance method', () => 
    execute(
      context => aeroflow.empty.min,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.min(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () => 
       execute(
        context => aeroflow.empty.min().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several numeric values, emits single "next" with maximum emitted value, then single greedy "done"', () =>
      execute(
        context => context.values = [1, 3, 2],
        context => aeroflow(context.values).min().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(Math.min(...context.values));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several string values, emits single "next" with minnimum emitted value, then single greedy "done"', () =>
      execute(
        context => context.values = ['a', 'c', 'b'],
        context => aeroflow(context.values).min().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(
            context.values.reduce((min, value) => value < min ? value : min));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});
