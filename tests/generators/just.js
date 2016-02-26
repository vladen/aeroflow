export default (aeroflow, exec, expect, sinon) => describe('.just', () => {
  it('Is static method', () =>
    exec(
      null,
      () => aeroflow.just,
      result => expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        null,
        () => aeroflow.just(),
        result => expect(result).to.be.an('Aeroflow')));

    it('Returns flow emitting "done" notification argumented with "true"', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.just().notify(Function(), spy).run(),
        spy => expect(spy).to.have.been.calledWith(true)));

    it('Returns flow emitting "next" notification argumented with undefined', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.just().notify(result => spy(typeof result)).run(),
        spy => expect(spy).to.have.been.calledWith('undefined')));
  });

  describe('(@value:aeroflow)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: aeroflow.empty, spy: sinon.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
  });

  describe('(@value:array)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: [], spy: sinon.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
  });

  describe('(@value:function)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: Function(), spy: sinon.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
  });

  describe('(@value:iterable)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: new Set, spy: sinon.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
  });

  describe('(@value:promise)', () => {
    it('Returns flow emitting "next" notification argumented with @value', () =>
      exec(
        () => ({ value: Promise.resolve, spy: sinon.spy() }),
        ctx => aeroflow.just(ctx.value).notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));
  });
});
