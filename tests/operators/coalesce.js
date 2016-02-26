export default (aeroflow, exec, expect, sinon) => describe('#coalesce', () => {
  it('Is instance method', () =>
    exec(
      null,
      () => aeroflow.empty.coalesce,
      result => expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        null,
        () => aeroflow.empty.coalesce(),
        result => expect(result).to.be.an('Aeroflow')));

    it('Does not emit "next" notification when flow is empty', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.empty.coalesce().notify(spy).run(),
        spy => expect(spy).not.to.have.been.called));
  });

  describe('(@alternative:function)', () => {
    it('Calls @alternative when flow is empty', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.empty.coalesce(spy).run(),
        spy => expect(spy).to.have.been.called));

    it('Does not call @alternative when flow emits error', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow(new Error('test')).coalesce(spy).run(),
        spy => expect(spy).not.to.have.been.called));

    it('Emits "next" notification argumented with value returned by @alternative when flow is empty', () =>
      exec(
        () => ({ value: 'test', spy: sinon.spy() }),
        ctx => aeroflow.empty.coalesce(() => ctx.value).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
  });

  describe('(@alternative:!function)', () => {
    it('Emits "next" notification argumented with @alternative value when flow is empty', () =>
      exec(
        () => ({ alternative: 'test', spy: sinon.spy() }),
        ctx => aeroflow.empty.coalesce(ctx.alternative).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.alternative)));
  });
});
