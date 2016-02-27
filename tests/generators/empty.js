export default (aeroflow, execute, expect, sinon) => describe('.empty', () => {
  it('Gets instance of Aeroflow', () =>
    execute(
      context => aeroflow.empty,
      context => expect(context.result).to.be.an('Aeroflow')));

  it('Emits done(true, @context) notification', () =>
    execute(
      context => aeroflow.empty.notify(context.nop, context.spy).run(context),
      context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

  it('Does not emit next notification', () =>
    execute(
      context => aeroflow.empty.notify(context.spy).run(),
      context => expect(context.spy).not.to.have.been.called));
});
