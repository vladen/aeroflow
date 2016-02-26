export default (aeroflow, exec, expect, sinon) => describe('.expand', () => {
  it('Is static method', () =>
    exec(
      null,
      () => aeroflow.expand,
      result => expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        null,
        () => aeroflow.expand(),
        result => expect(result).to.be.an('Aeroflow')));
  });

  describe('(@expander:function)', () => {
    it('Calls @expander', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.expand(spy).take(1).run(),
        spy => expect(spy).to.have.been.called));

    it('Passes undefined to @expander as first argument when no seed has been specified', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.expand(arg => spy(typeof arg)).take(1).run(),
        spy => expect(spy).to.have.been.calledWith('undefined')));

    it('Passes value returned by @expander to @expander as first argument on subsequent iteration', () =>
      exec(
        () => {
          const value = 'test';
          return { value, spy: sinon.spy(() => value) };
        },
        ctx => aeroflow.expand(result => ctx.spy(result)).take(2).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));

    it('Passes zero-based index of iteration to @expander as second argument', () =>
      exec(
        () => ({ limit: 3, spy: sinon.spy() }),
        ctx => aeroflow.expand((_, index) => ctx.spy(index)).take(ctx.limit).run(),
        ctx => Array(ctx.limit).fill(0).forEach(
          (_, i) => expect(ctx.spy).to.have.been.calledWith(i))));

    it('Passes context data to @expander as third argument', () =>
      exec(
        () => ({ data: 'test', spy: sinon.spy() }),
        ctx => aeroflow.expand((_, __, data) => ctx.spy(data)).take(1).run(ctx.data),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.data)));

    it('Emits "next" notification with value returned by @expander', () =>
      exec(
        () => ({ value: 'test', spy: sinon.spy() }),
        ctx => aeroflow.expand(() => ctx.value).take(1).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
  });

  describe('(@expander:function, @seed:any)', () => {
    it('Passes @seed to @expander as first argument at first iteration', () =>
      exec(
        () => ({ seed: 'test', spy: sinon.spy() }),
        ctx => aeroflow.expand(seed => ctx.spy(seed), ctx.seed).take(1).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.seed)));
  });
});
