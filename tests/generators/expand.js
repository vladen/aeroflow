export default (aeroflow, execute, expect, sinon) => describe('.expand', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.expand,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.expand(),
        context => expect(context.result).to.be.an('Aeroflow')));
  });

  describe('(@expander:function)', () => {
    it('Calls @expander(undefined, 0, @context) at first iteration', () =>
      execute(
        context => aeroflow.expand(context.spy).take(1).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(undefined, 0, context)));

    it('Calls @expander(@value, @index, @context) at subsequent iterations with @value previously returned by @expander', () =>
      execute(
        context => {
          context.expander = (value, ...args) => {
            context.spy(value, ...args);
            return value ? value + 1 : 1;
          };
          context.iterations = 3;
        },
        context => aeroflow.expand(context.expander).take(context.iterations).run(context),
        context => Array(context.iterations).fill(0).forEach(
          (_, index) => expect(context.spy.getCall(index)).to.have.been.calledWithExactly(index || undefined, index, context))));

    it('Emits done(@error, @context) notification with @error thrown by @expander', () =>
      execute(
        context => {
          context.error = new Error('test');
          context.expander = () => { throw context.error };
        },
        context => aeroflow(context.expander).notify(context.nop, context.spy).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.error, context)));

    it('Emits next(@value, @index, @context) notification for each @value returned by @expander', () =>
      execute(
        context => {
          context.expander = value => value ? value + 1 : 1;
          context.iterations = 3;
        },
        context => aeroflow.expand(context.expander).take(context.iterations).notify(context.spy).run(context),
        context => Array(context.iterations).fill(0).forEach(
          (_, index) => expect(context.spy.getCall(index)).to.have.been.calledWithExactly(index + 1, index, context))));
  });

  describe('(@expander:function, @seed)', () => {
    it('Calls @expander(@seed, 0, @context) at first iteration', () =>
      execute(
        context => context.seed = 'test',
        context => aeroflow.expand(context.spy, context.seed).take(1).run(context),
        context => expect(context.spy).to.have.been.calledWithExactly(context.seed, 0, context)));
  });

  describe('(@expander:!function)', () => {
    it('Emits next(@expander, 0, @context) notification', () =>
      execute(
        context => context.expander = 'test',
        context => aeroflow.expand(context.expander).take(1).notify(context.spy).run(),
        context => expect(context.spy).to.have.been.calledWith(context.expander)));
  });
});
