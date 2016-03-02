export default (aeroflow, execute, expect) => describe('aeroflow.repeat', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.repeat,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow.repeat()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.repeat(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits "next" with undefined, then single lazy "done"', () =>
      execute(
        context => aeroflow.repeat().take(1).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(undefined);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow.repeat(@repeater:function)', () => {
    it('Calls @repeater with index of current iteration', () =>
      execute(
        context => {
          context.limit = 3;
          context.repeater = context.spy();
        },
        context => aeroflow.repeat(context.repeater).take(context.limit).run(),
        context => {
          expect(context.repeater).to.have.callCount(context.limit);
          Array(context.limit).fill(undefined).forEach((_, index) =>
            expect(context.repeater.getCall(index)).to.have.been.calledWith(index));
        }));

    it('Emits "next" with each value returned by @repeater, then single lazy "done"', () =>
      execute(
        context => {
          context.limit = 3;
          context.repeater = index => index;
        },
        context => aeroflow.repeat(context.repeater).take(context.limit).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.limit);
          Array(context.limit).fill().forEach((_, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(index));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow.repeat(@repeater:function, @delayer:function)', () => {
    it('Calls @repeater and @delayer with index of iteration', () =>
      execute(
        context => {
          context.limit = 3;
          context.delayer = context.spy(() => 0);
          context.repeater = context.spy();
        },
        context => aeroflow.repeat(context.repeater, context.delayer).take(context.limit).run(),
        context => {
          expect(context.delayer).to.have.callCount(context.limit);
          expect(context.repeater).to.have.callCount(context.limit);
          Array(context.limit).fill(undefined).forEach((_, index) => {
            expect(context.delayer.getCall(index)).to.have.been.calledWith(index);
            expect(context.repeater.getCall(index)).to.have.been.calledWith(index);
          });
        }));

    it('Emits "next" with each value returned by @repeater and delayed to the number of milliseconds returned by @delayer, then single lazy "done"', () =>
      execute(
        context => {
          context.delay = 25;
          context.limit = 3;
          context.delayer = index => index * context.delay;
          context.repeater = index => ({ date: new Date, index });
        },
        context => aeroflow.repeat(context.repeater, context.delayer).take(context.limit).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.limit);
          const results = Array(context.limit).fill().map((_, index) =>
            context.next.getCall(index).args[0]);
          results.forEach((result, index) =>
            expect(result.index).to.equal(index));
          results.reduce((prev, next) => {
            expect(next.date - prev.date).to.be.not.below(context.delay);
            return next;
          });
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('(@repeater:string)', () => {
    it('Emits "next" with @repeater value, then single lazy "done"', () =>
      execute(
        context => {
          context.limit = 3;
          context.repeater = 42;
        },
        context => aeroflow.repeat(context.repeater).take(context.limit).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.limit);
          Array(context.limit).fill().forEach((_, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(context.repeater));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });
});
