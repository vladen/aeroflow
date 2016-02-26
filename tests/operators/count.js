export default (aeroflow, exec, expect, sinon) => describe('#count', () => {
  it('Is instance method', () =>
    exec(
      null,
      () => aeroflow.empty.count,
      result => expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        null,
        () => aeroflow.empty.count(),
        result => expect(result).to.be.an('Aeroflow')));

    it('Emits "next" notification argumented with "0" when flow is empty', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.empty.count().notify(result => spy(result)).run(),
        spy => expect(spy).to.have.been.calledWith(0)));

    it('Emits "next" notification argumented with "1" when flow emits single value', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow('test').count().notify(spy).run(),
        spy => expect(spy).to.have.been.calledWith(1)));

    it('Emits number of @values emitted by flow when flow emits several @values', () =>
      exec(
        () => ({ values: [1, 2, 3], spy: sinon.spy() }),
        ctx => aeroflow(ctx.values).count().notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.values.length)));
  });
});
