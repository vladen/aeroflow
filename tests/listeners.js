export default (aeroflow, execute, expect) => describe('aeroflow.listeners', () => {
  it('Is static property', () =>
    execute(
      context => aeroflow.listeners,
      context => expect(context.result).to.exist));

  describe('aeroflow.listeners.get', () => {
    it('Is function', () =>
      execute(
        context => aeroflow.listeners.get,
        context => expect(context.result).to.be.a('function')));
  });

  describe('aeroflow.listeners.use', () => {
    it('Is function', () =>
      execute(
        context => aeroflow.listeners.use,
        context => expect(context.result).to.be.a('function')));
  });
});
