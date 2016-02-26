export default (aeroflow, chai, exec, noop) => describe('.just', () => {
  it('Is static method', () =>
    exec(
      noop,
      () => aeroflow.just,
      result => chai.expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        noop,
        () => aeroflow.just(),
        result => chai.expect(result).to.be.an('Aeroflow')));

    it('Returns flow emitting "done" notification argumented with "true"', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.just().notify(noop, spy).run(),
        spy => chai.expect(spy).to.have.been.called.with(true)));

    it('Returns flow emitting "next" notification argumented with undefined', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.just().notify(result => spy(typeof result)).run(),
        spy => chai.expect(spy).to.have.been.called.with('undefined')));
  });

  describe('(@value:aeroflow)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: aeroflow.empty, spy: chai.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
  });

  describe('(@value:array)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: [], spy: chai.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
  });

  describe('(@value:function)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: noop, spy: chai.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
  });

  describe('(@value:iterable)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: new Set, spy: chai.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
  });

  describe('(@value:promise)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: Promise.resolve, spy: chai.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));
  });
});
