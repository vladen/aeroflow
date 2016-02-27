export default (aeroflow, execute, expect, sinon) => describe('#toSet', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.toSet,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.toSet(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits "next" notification with empty set when flow is empty', () =>
      execute(
        context => aeroflow.empty.toSet().notify(context.next).run(),
        context => {
          const set = context.next.args[0][0];
          expect(set).to.be.a('Set');
          expect(set).to.have.property('size', 0);
        }));

    it('Emits "next" notification with set containing values emitted by flow', () =>
      execute(
        context => context.values = [1, 3, 5],
        context => aeroflow(context.values).toSet().notify(context.next).run(),
        context => {
          const set = context.next.args[0][0];
          context.values.forEach(value => expect(set.has(value)).to.be.true);
        }));
  });
});
