export default (aeroflow, execute, expect, sinon) => describe('#max', () => {
  it('Is instance method', () => 
    execute(
      context => aeroflow.empty.max,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.max(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Does not emit next notification when flow is empty', () => 
       execute(
        context => aeroflow.empty.max().notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));

    it('Emits next(@max, 0, @context) notification with @max as maximum value emitted by flow when flow emits numeric values', () =>
      execute(
        context => context.values = [1, 3, 2],
        context => aeroflow(context.values).max().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(Math.max(...context.values), 0, context)));

    it('Emits next(@max, 0, @context) notification with @max as maximum value emitted by flow when flow emits string values', () =>
      execute(
        context => context.values = ['a', 'c', 'b'],
        context => aeroflow(context.values).max().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWith(
          context.values.reduce((max, value) => value > max ? value : max), 0, context)));
  });
});
