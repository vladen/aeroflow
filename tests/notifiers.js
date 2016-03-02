export default (aeroflow, execute, expect) => describe('aeroflow.notifiers', () => {
  it('Is static property', () =>
    execute(
      context => aeroflow.notifiers,
      context => expect(context.result).to.exist));

  describe('aeroflow.adapters.get', () => {
    it('Is function', () =>
      execute(
        context => aeroflow.adapters.get,
        context => expect(context.result).to.be.a('function')));
  });

  describe('aeroflow.adapters.use', () => {
    it('Is function', () =>
      execute(
        context => aeroflow.adapters.get,
        context => expect(context.result).to.be.a('function')));
  });
});
