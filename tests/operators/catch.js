export default (aeroflow, exec, expect, sinon) => describe('#catch', () => {
  it('Is instance method', () =>
    exec(
      null,
      () => aeroflow.empty.catch,
      result => expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        null,
        () => aeroflow.empty.catch(),
        result => expect(result).to.be.an('Aeroflow')));

    it('Does not emit "next" notification when flow is empty', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.empty.catch().notify(spy).run(),
        spy => expect(spy).not.to.have.been.called));

    it('Does not emit "next" notification when flow emits single error', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow(new Error('test')).catch().notify(spy).run(),
        spy => expect(spy).not.to.have.been.called));

    it('Emits "done" notification argumented with "true" when emits error', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow(new Error('test')).catch().notify(Function(), spy).run(),
        spy => expect(spy).to.have.been.calledWith(true)));
  });

  describe('(@alternative:function)', () => {
    it('Does not call @alternative when flow is empty', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.empty.catch(spy).run(),
        spy => expect(spy).not.to.have.been.called));

    it('Does not call @alternative when flow does not emit error', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow('test').catch(spy).run(),
        spy => expect(spy).not.to.have.been.called));

    it('Calls @alternative and passes error and context data when flow emits error', () =>
      exec(
        () => ({ data: 'test', error: new Error('test'), spy: sinon.spy() }),
        ctx => aeroflow(ctx.error).catch(ctx.spy).run(ctx.data),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.error, ctx.data)));

    it('Emits "next" notification argumented with value returned by @alternative when flow emits error', () =>
      exec(
        () => ({ value: 'test', spy: sinon.spy() }),
        ctx => aeroflow(new Error('test')).catch(() => ctx.value).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
  });

  describe('(@alternative:!function)', () => {
    it('Emits "next" notification argumented with @alternative when flow emits error', () =>
      exec(
        () => ({ alternative: 'test', spy: sinon.spy() }),
        ctx => aeroflow(new Error('test')).catch(ctx.alternative).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.alternative)));
  });
});
