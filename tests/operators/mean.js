export default (aeroflow, execute, expect, sinon) => describe('#mean', () => {
  it('Is instance method', () => 
    execute(
      context => aeroflow.empty.mean,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.mean(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Does not emit "next" notification when flow is empty', () =>
      execute(
        context => aeroflow.empty.mean().notify(context.next).run(),
        context => expect(context.next).to.have.not.been.called));

    it('Emits "next" notification with value emitted by flow when flow emits single value', () =>
      execute(
        context => context.value = 42,
        context => aeroflow(context.value).mean().notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.value)));

    it('Emits "next" notification with mean of values emitted by flow when flow emits several values', () =>
      execute(
        context => context.values = [1, 2, 3],
        context => aeroflow(context.values).mean().notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(
          context.values[Math.floor(context.values.length / 2)])));
  });
});