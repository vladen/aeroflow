export default (aeroflow, execute, expect) => describe('aeroflow.operators', () => {
  it('Is static property', () =>
    execute(
      context => aeroflow.operators,
      context => expect(context.result).to.exist));

  it('Registers new operator and exposes it as method of aeroflow instance', () =>
    execute(
      context => context.operator = Function(),
      context => {
        aeroflow.operators.test = context.operator;
        return aeroflow.empty.test;
      },
      context => expect(context.result).to.equal(context.operator)));

  it('When new operator is chained, calls builder function returned by it once with emitter function', () =>
    execute(
      context => {
        context.builder = context.spy();
        context.operator = function() {
          return this.chain(context.builder);
        }
      },
      context => {
        aeroflow.operators.test = context.operator;
        return aeroflow.empty.test();
      },
      context => {
        expect(context.builder).to.have.been.called;
        expect(context.builder.getCall(0).args[0]).to.be.a('function');
      }));
});
