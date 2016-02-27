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

    it('Does not emit next notification when flow is empty', () =>
      execute(
        context => aeroflow.empty.average().notify(context.spy).run(),
        context => expect(context.spy).to.have.not.been.called));

    it('Emits next(@value, 0, @context) notification when flow emits single numeric @value', () =>
      execute(
        context => context.value = 42,
        context => aeroflow(context.value).average().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));

    it('Emits next(@average, 0, @context) notification with @average of serveral numeric values emitted by flow', () =>
      execute(
        context => context.values = [1, 2, 5],
        context => aeroflow(context.values).average().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(
          context.values.reduce((sum, value) => sum + value, 0) / context.values.length, 0, context)));

    it('Emits next(NaN, 0, @context) notification when flow emits at least one value not convertible to numeric', () =>
      execute(
        context => context.values = [1, 'test', 2],
        context => aeroflow(context.values).average().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(NaN, 0, context)));
  });
});
