export default (aeroflow, chai, exec, noop) => describe('#catch', () => {
  it('Is instance method', () =>
    exec(
      noop,
      () => aeroflow.empty.catch,
      result => chai.expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        noop,
        () => aeroflow.empty.catch(),
        result => chai.expect(result).to.be.an('Aeroflow')));

    it('Does not emit "next" notification when flow is empty', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.empty.catch().notify(spy).run(),
        spy => chai.expect(spy).not.to.have.been.called()));

    it('Does not emit "next" notification when flow emits single error', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow(new Error('test')).catch().notify(spy).run(),
        spy => chai.expect(spy).not.to.have.been.called()));

    it('Emits "done" notification argumented with "true" when emits error', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow(new Error('test')).catch().notify(noop, spy).run(),
        spy => chai.expect(spy).to.have.been.called.with(true)));
  });

  describe('(@alternative:function)', () => {
    it('Does not call @alternative when flow is empty', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.empty.catch(spy).run(),
        spy => chai.expect(spy).not.to.have.been.called()));

    it('Does not call @alternative when flow does not emit error', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow('test').catch(spy).run(),
        spy => chai.expect(spy).not.to.have.been.called()));

    it('Calls @alternative and passes error as first argument when flow emits error', () =>
      exec(
        () => ({ error: new Error('test'), spy: chai.spy() }),
        ctx => aeroflow(ctx.error).catch(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.error)));

    it('Calls @alternative and passes context data as second argument when flow emits error', () =>
      exec(
        () => ({ data: 'test', spy: chai.spy() }),
        ctx => aeroflow(new Error('test')).catch((_, data) => ctx.spy(data)).run(ctx.data),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.data)));

    it('Emits "next" notification argumented with value returned by @alternative when flow emits error', () =>
      exec(
        () => ({ value: 'test', spy: chai.spy() }),
        ctx => aeroflow(new Error('test')).catch(() => ctx.value).notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
  });

  describe('(@alternative:!function)', () => {
    it('Emits "next" notification argumented with @alternative when flow emits error', () =>
      exec(
        () => ({ alternative: 'test', spy: chai.spy() }),
        ctx => aeroflow(new Error('test')).catch(ctx.alternative).notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.alternative)));
  });
});
