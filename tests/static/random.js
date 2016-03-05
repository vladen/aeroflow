export default (aeroflow, execute, expect) => describe('aeroflow.random', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.random,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow.random()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.random(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits "next" with each random value in the range [0, 1), then single lazy "done"', () =>
      execute(
        context => context.limit = 5,
        context => aeroflow.random().take(context.limit).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.limit);
          const results = new Set(Array(context.limit).fill().map((_, index) =>
            context.next.getCall(index).args[0]));
          expect(results).to.have.property('size', context.limit);
          results.forEach(value => expect(value).to.be.within(0, 1));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow.random(@maximum:number)', () => {
    it('Emits "next" with each random value in the range [0, @maximum), then single lazy "done"', () =>
      execute(
        context => {
          context.limit = 5;
          context.maximum = 9;
        },
        context => aeroflow.random(context.maximum).take(context.limit).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.limit);
          const results = new Set(Array(context.limit).fill().map((_, index) =>
            context.next.getCall(index).args[0]));
          expect(results.size).to.be.above(1);
          results.forEach(value => expect(value).to.be.within(0, context.maximum));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow.random(@minimum:number, @maximum:number)', () => {
    it('Emits "next" with each random value in the range [@minimum, @maximum), then single lazy "done"', () =>
      execute(
        context => {
          context.limit = 5;
          context.minimum = 1;
          context.maximum = 9;
        },
        context => aeroflow.random(context.minimum, context.maximum).take(context.limit).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.limit);
          const results = new Set(Array(context.limit).fill().map((_, index) =>
            context.next.getCall(index).args[0]));
          expect(results.size).to.be.above(1);
          results.forEach(value => expect(value).to.be.within(context.minimum, context.maximum));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });
});
