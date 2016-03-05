export default (aeroflow, execute, expect) => describe('aeroflow().reverse', () => {
  it('Is instance method', () => 
    execute(
      context => aeroflow.empty.reverse,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().reverse()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.reverse(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () => 
       execute(
        context => aeroflow.empty.reverse().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow is not empty, emits "next" for each emitted value in reverse order, then emits single greedy "done"', () => 
       execute(
        context => context.values = [1, 2, 3],
        context => aeroflow(context.values).reverse().run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(context.values.length - index - 1)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});