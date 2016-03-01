export default (aeroflow, execute, expect) => describe('aeroflow.empty', () => {
  it('Gets instance of Aeroflow', () =>
    execute(
      context => aeroflow.empty,
      context => expect(context.result).to.be.an('Aeroflow')));

  it('Emits only single greedy "done"', () =>
    execute(
      context => aeroflow.empty.run(context.next, context.done),
      context => {
        expect(context.next).to.have.not.been.called;
        expect(context.done).to.have.been.calledOnce;
        expect(context.done).to.have.been.calledWith(true);
      }));
});
