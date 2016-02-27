export default (aeroflow, execute, expect, sinon) => describe('#coalesce', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.coalesce,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.coalesce(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Does not emit "next" notification when flow is empty', () =>
      execute(
        context => aeroflow.empty.coalesce().notify(context.next).run(),
        context => expect(context.next).not.to.have.been.called));
  });

  describe('(@alternative:function)', () => {
    it('Calls @alternative when flow is empty', () =>
      execute(
        context => context.alternative = sinon.spy(),
        context => aeroflow.empty.coalesce(context.alternative).run(),
        context => expect(context.alternative).to.have.been.called));

    it('Does not call @alternative when flow emits error', () =>
      execute(
        context => context.alternative = sinon.spy(),
        context => aeroflow(new Error('test')).coalesce(context.alternative).run(),
        context => expect(context.alternative).not.to.have.been.called));

    it('Emits "next" notification with value returned by @alternative when flow is empty', () =>
      execute(
        context => context.value = 'test',
        context => aeroflow.empty.coalesce(() => context.value).notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.value)));
  });

  describe('(@alternative:!function)', () => {
    it('Emits "next" notification with @alternative value when flow is empty', () =>
      execute(
        context => context.alternative = 'test',
        context => aeroflow.empty.coalesce(context.alternative).notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.alternative)));
  });
});
