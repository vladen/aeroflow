export default (aeroflow, execute, expect) => describe('aeroflow.expand', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.expand,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow.expand()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.expand(),
        context => expect(context.result).to.be.an('Aeroflow')));
  });

  describe('aeroflow.expand(@expander:function)', () => {
    it('Calls @expander with undefined and 0 on first iteration', () =>
      execute(
        context => context.expander = context.spy(),
        context => aeroflow.expand(context.expander).take(1).run(),
        context => expect(context.expander).to.have.been.calledWith(undefined)));

    it('Calls @expander with value previously returned by @expander, iteration index on subsequent iterations', () =>
      execute(
        context => {
          context.values = [1, 2];
          context.expander = context.spy((_, index) => context.values[index]);
        },
        context => aeroflow.expand(context.expander).take(context.values.length + 1).run(),
        context => [undefined].concat(context.values).forEach((value, index) =>
          expect(context.expander.getCall(index)).to.have.been.calledWith(value))));

    it('If @expander throws, emits only single faulty "done" with thrown error', () =>
      execute(
        context => context.expander = context.fail,
        context => aeroflow(context.expander).run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(context.error);
        }));

    it('Emits "next" for each value returned by @expander, then, being limited, lazy "done"', () =>
      execute(
        context => {
          context.values = [1, 2, 3];
          context.expander = context.spy((_, index) => context.values[index]);
        },
        context => aeroflow.expand(context.expander).take(context.values.length).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('aeroflow.expand(@expander:function, @seed)', () => {
    it('Calls @expander with @seed on first iteration', () =>
      execute(
        context => {
          context.expander = context.spy();
          context.seed = 'test';
        },
        context => aeroflow.expand(context.expander, context.seed).take(1).run(),
        context => expect(context.expander).to.have.been.calledWith(context.seed)));
  });

  describe('aeroflow.expand(@expander:string)', () => {
    it('Emits "next" with @expander', () =>
      execute(
        context => context.expander = 'test',
        context => aeroflow.expand(context.expander).take(1).run(context.next),
        context => expect(context.next).to.have.been.calledWith(context.expander)));
  });
});
