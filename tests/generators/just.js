export default (aeroflow, execute, expect, sinon) => describe('.just', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.just,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.just(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits done(true, @context) notification', () =>
      execute(
        context => aeroflow.just().notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(true, context)));

    it('Emits next(undefined, 0, @context) notification', () =>
      execute(
        context => aeroflow.just().notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(undefined, 0, context)));
  });

  describe('(@value:aeroflow)', () => {
    it('Emits next(@value, 0, @context) notification', () =>
      execute(
        context => context.value = aeroflow.empty,
        context => aeroflow.just(context.value).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
  });

  describe('(@value:array)', () => {
    it('Emits next(@value, 0, @context) notification', () =>
      execute(
        context => context.value = [],
        context => aeroflow.just(context.value).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
  });

  describe('(@value:function)', () => {
    it('Emits next(@value, 0, @context) notification', () =>
      execute(
        context => context.value = Function(),
        context => aeroflow.just(context.value).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
  });

  describe('(@value:iterable)', () => {
    it('Emits next(@value, 0, @context) notification', () =>
      execute(
        context => context.value = new Set,
        context => aeroflow.just(context.value).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
  });

  describe('(@value:promise)', () => {
    it('Emits next(@value, 0, @context) notification', () =>
      execute(
        context => context.value = Promise.resolve(),
        context => aeroflow.just(context.value).notify(context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context)));
  });
});
