export default (aeroflow, execute, expect, sinon) => describe('#min', () => {
  it('Is instance method', () => 
    execute(
      context => aeroflow.empty.min,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.min(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Does not emit next notification when flow is empty', () => 
       execute(
        context => aeroflow.empty.min().notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));

    it('Emits next(@min, 0, @context) notification with @min as minimum value emitted by flow when flow emits numeric values', () =>
      execute(
        context => context.values = [1, 3, 2],
        context => aeroflow(context.values).min().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(Math.min(...context.values), 0, context)));

    it('Emits next(@min, 0, @context) notification with @min as minimum value emitted by flow when flow emits string values', () =>
      execute(
        context => context.values = ['a', 'c', 'b'],
        context => aeroflow(context.values).min().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWith(
          context.values.reduce((min, value) => value < min ? value : min), 0, context)));
  });
});