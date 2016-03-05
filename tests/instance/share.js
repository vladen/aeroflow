export default (aeroflow, execute, expect) => describe('aeroflow().share', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.share,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().share()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.share(),
        context => expect(context.result).to.be.an('Aeroflow')));
  });
});
