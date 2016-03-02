export default (aeroflow, execute, expect) => describe('aeroflow.operators', () => {
  it('Is static property', () =>
    execute(
      context => aeroflow.operators,
      context => expect(context.result).to.exist));

  it('Registers new operator', () =>
    execute(
      context => context.operator = Function(),
      context => {
        aeroflow.operators.test = context.operator;
        return aeroflow.empty.test;
      },
      context => expect(context.result).to.equal(context.operator)));
});
