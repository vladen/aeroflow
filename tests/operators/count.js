export default (aeroflow, execute, expect, sinon) => describe('#count', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.count,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.count(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits next(0, 0, @context) notification when flow is empty', () =>
      execute(
        context => aeroflow.empty.count().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWith(0, 0, context)));

    it('Emits next(@count, 0, @context) notification with @count of values emitted by flow', () =>
      execute(
        context => context.values = [1, 2, 3],
        context => aeroflow(context.values).count().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWith(context.values.length, 0, context)));
  });
});
