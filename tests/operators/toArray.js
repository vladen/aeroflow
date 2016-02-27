export default (aeroflow, execute, expect, sinon) => describe('#toArray', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.toArray,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.toArray(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits "next" notification with empty array when flow is empty', () =>
      execute(
        context => aeroflow.empty.toArray().notify(context.next).run(),
        context => {
          const array = context.next.args[0][0];
          expect(array).to.be.an('array');
          expect(array).to.have.lengthOf(0);
        }));

    it('Emits "next" notification with array of values emitted by flow', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(context.values).toArray().notify(context.next).run(),
        context => {
          const array = context.next.args[0][0];
          expect(array).to.include.members(context.values);
          expect(context.values).to.include.members(array);
        }));
  });
});
