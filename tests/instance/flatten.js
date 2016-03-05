export default (aeroflow, execute, expect) => describe('aeroflow().flatten', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.flatten,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().flatten()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.flatten(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.flatten().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});
