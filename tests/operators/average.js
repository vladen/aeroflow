export default (aeroflow, chai, exec, noop) => describe('#average', () => {
  it('Is instance method', () =>
    exec(
      noop,
      () => aeroflow.empty.average,
      result => chai.expect(result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      exec(
        noop,
        () => aeroflow.empty.average(),
        result => chai.expect(result).to.be.an('Aeroflow')));

    it('Does not emit "next" notification when flow is empty', () =>
      exec(
        () => chai.spy(),
        spy => aeroflow.empty.average().notify(spy).run(),
        spy => chai.expect(spy).not.to.have.been.called()));

    it('Emits "next" notification argumented with @value when flow emits single numeric @value', () =>
      exec(
        () => ({ value: 42, spy: chai.spy() }),
        ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(ctx.value)));

    it('Emits "next" notification argumented with NaN when flow emits single not numeric @value', () =>
      exec(
        () => ({ value: 'test', spy: chai.spy() }),
        ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(NaN)));

    it('Emits "next" notification argumented with average of @values when flow emits several numeric @values', () =>
      exec(
        () => ({ values: [1, 2, 5], spy: chai.spy() }),
        ctx => aeroflow(ctx.values).average().notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(
          ctx.values.reduce((sum, value) => sum + value, 0) / ctx.values.length)));

    it('Emits "next" notification argumented with NaN when flow emits several not numeric @values', () =>
      exec(
        () => ({ values: ['a', 'b'], spy: chai.spy() }),
        ctx => aeroflow(ctx.value).average().notify(ctx.spy).run(),
        ctx => chai.expect(ctx.spy).to.have.been.called.with(NaN)));
  });
});
