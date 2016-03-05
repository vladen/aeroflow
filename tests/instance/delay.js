export default (aeroflow, execute, expect) => describe('aeroflow().delay', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.delay,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().delay()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.delay(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.delay().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().delay(@delayer:date)', () => {
    it('Delays each "next" emission until @delayer date', () =>
      execute(
        context => {
          context.delayer = new Date(Date.now() + 10);
          context.limit = 3;
        },
        context => aeroflow.range()
          .take(context.limit)
          .delay(context.delayer)
          .map(() => new Date)
          .run(context.next, context.done),
        context => Array(context.limit).fill().forEach(date =>
          expect(date).to.be.not.below(context.delayer))));
  });

  describe('aeroflow().delay(@delayer:function)', () => {
    it('Calls @delayer for each emitted value with value and iteration index', () =>
      execute(
        context => {
          context.delayer = context.spy(() => 0);
          context.limit = 3;
          context.values = [1, 2, 3];
        },
        context => aeroflow(context.values).take(context.limit).delay(context.delayer).run(),
        context => {
          expect(context.delayer).to.have.callCount(context.limit);
          context.values.forEach((value, index) =>
            expect(context.delayer.getCall(index)).to.have.been.calledWith(value, index));
        }));

    it('Delays each "next" emission until date returned by @delayer', () =>
      execute(
        context => {
          context.delay = 10;
          context.delayer = () => new Date(Date.now() + context.delay);
          context.limit = 3;
        },
        context => aeroflow.range()
          .take(context.limit)
          .delay(context.delayer)
          .scan((prev, next) => next - prev)
          .skip(1)
          .run(context.next, context.done),
        context => Array(context.limit - 1).fill().forEach(delay =>
          expect(delay).to.be.not.below(context.delay))));

    it('Delays each "next" emission by delay returned by @delayer', () =>
      execute(
        context => {
          context.delay = 10;
          context.delayer = () => context.delay;
          context.limit = 3;
        },
        context => aeroflow.range()
          .take(context.limit)
          .delay(context.delayer)
          .scan((prev, next) => next - prev)
          .skip(1)
          .run(context.next, context.done),
        context => Array(context.limit - 1).fill().forEach(delay =>
          expect(delay).to.be.not.below(context.delay))));
  });

  describe('aeroflow().delay(@delayer:number)', () => {
    it('Delays each "next" emission for @delayer milliseconds', () =>
      execute(
        context => {
          context.delayer = 10;
          context.limit = 3;
        },
        context => aeroflow.range()
          .take(context.limit)
          .delay(context.delayer)
          .scan((prev, next) => next - prev)
          .skip(1)
          .run(context.next, context.done),
        context => Array(context.limit - 1).fill().forEach(delay =>
          expect(delay).to.be.not.below(context.delayer))));
  });
});