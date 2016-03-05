export default (aeroflow, execute, expect) => describe('aeroflow().replay', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.replay,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().replay()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.replay(),
        context => expect(context.result).to.be.an('Aeroflow')));
  });
});
