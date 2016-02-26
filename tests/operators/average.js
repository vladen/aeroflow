export default (aeroflow, exec, expect, sinon) => describe('#average', () => {
  it('Is instance method', () =>
    exec(
      null,
      () => aeroflow.empty.average,
      result => expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        null,
        () => aeroflow.empty.average(),
        result => expect(result).to.be.an('Aeroflow')));

    it('Does not emit "next" notification when flow is empty', () =>
      exec(
        () => sinon.spy(),
        spy => aeroflow.empty.average().notify(spy).run(),
        spy => expect(spy).not.to.have.been.called));

    it('Emits "next" notification argumented with @value when flow emits single numeric @value', () =>
      exec(
        () => ({ value: 42, spy: sinon.spy() }),
        ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(ctx.value)));

    it('Emits "next" notification argumented with NaN when flow emits single not numeric @value', () =>
      exec(
        () => ({ value: 'test', spy: sinon.spy() }),
        ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(NaN)));

    it('Emits "next" notification argumented with average of @values when flow emits several numeric @values', () =>
      exec(
        () => ({ values: [1, 2, 5], spy: sinon.spy() }),
        ctx => aeroflow(ctx.values).average().notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(
          ctx.values.reduce((sum, value) => sum + value, 0) / ctx.values.length)));

    it('Emits "next" notification argumented with NaN when flow emits several not numeric @values', () =>
      exec(
        () => ({ values: ['a', 'b'], spy: sinon.spy() }),
        ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
        ctx => expect(ctx.spy).to.have.been.calledWith(NaN)));
  });
});
