export default (aeroflow, chai, exec, noop) => describe('.expand', () => {
  it('Is static method', () =>
    exec(
      noop,
      () => aeroflow.expand,
      result => chai.expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        noop,
        () => aeroflow.expand(),
        result => chai.expect(result).to.be.an('Aeroflow')));
  });

  describe('(@expander:function)', () => {
    it('Calls @expander', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.expand(spy).take(1).run(),
        spy => chai.expect(spy).to.have.been.called()));

    it('Passes undefined to @expander as first argument when no seed has been specified', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.expand(arg => spy(typeof arg)).take(1).run(),
        spy => chai.expect(spy).to.have.been.called.with('undefined')));

    it('Passes result returned by @expander to @expander as first argument on sybsequent iteration', () =>
      exec(
        () => {
          const result = {};
          return { result, spy: chai.spy(() => result) };
        },
        ctx => aeroflow.expand(result => ctx.spy(result)).take(2).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.result)));

    it('Passes zero-based index of iteration to @expander as second argument', () =>
      exec(
        () => ({ limit: 3, spy: chai.spy() }),
        ctx => aeroflow.expand((_, index) => ctx.spy(index)).take(ctx.limit).run(),
        ctx => Array(ctx.limit).fill(0).forEach(
          (_, i) => chai.expect(ctx.spy).to.have.been.called.with(i))));

    it('Passes context data to @expander as third argument', () =>
      exec(
        () => ({ data: 'test', spy: chai.spy() }),
        ctx => aeroflow.expand((_, __, data) => ctx.spy(data)).take(1).run(ctx.data),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.data)));

    it('Emits "next" notification with value returned by @expander', () =>
      exec(
        () => ({ result: {}, spy: chai.spy() }),
        ctx => aeroflow.expand(() => ctx.result).take(1).notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.result)));
  });

  describe('(@expander:function, @seed:any)', () => {
    it('Passes @seed to @expander as first argument at first iteration', () =>
      exec(
        () => ({ seed: 'test', spy: chai.spy() }),
        ctx => aeroflow.expand(seed => ctx.spy(seed), ctx.seed).take(1).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.seed)));
  });
});
