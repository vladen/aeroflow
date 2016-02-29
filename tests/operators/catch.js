export default (aeroflow, execute, expect) => describe('#catch', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.catch,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.catch(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.catch().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits only error, supresses error and emits only single lazy "done"', () =>
      execute(
        context => aeroflow(context.error).catch().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));

    it('When flow emits some values and then error, emits "next" for each serial value before error, then supresses error and emits single lazy "done" ignoring values emitted after error', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(context.values, context.error, context.values).catch().run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@alternative:array)', () => {
    it('When flow emits error, emits "next" for each serial value from @alternative, then single lazy "done"', () =>
      execute(
        context => context.alternative = [1, 2],
        context => aeroflow(context.error).catch(context.alternative).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.alternative.length);
          context.alternative.forEach((value, index) => 
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@alternative:function)', () => {
    it('When flow is empty, does not call @alternative', () =>
      execute(
        context => context.alternative = context.spy(),
        context => aeroflow.empty.catch(context.alternative).run(),
        context => expect(context.alternative).not.to.have.been.called));

    it('When flow does not emit error, does not call @alternative', () =>
      execute(
        context => context.alternative = context.spy(),
        context => aeroflow('test').catch(context.alternative).run(),
        context => expect(context.alternative).not.to.have.been.called));

    it('When flow emits several values and then error, calls @alternative once with emitted error and context data, then emits "next" for each serial value from result returned by @alternative, then emits single lazy "done"', () =>
      execute(
        context => {
          context.values = [1, 2];
          context.alternative = context.spy(context.values);
        },
        context => aeroflow(context.values, context.error).catch(context.alternative).run(context.next, context.done, context.data),
        context => {
          expect(context.alternative).to.have.been.calledOnce;
          expect(context.alternative).to.have.been.calledWith(context.error, context.data);
          expect(context.next).to.have.callCount(context.values.length * 2);
          context.values.forEach((value, index) => {
            expect(context.next.getCall(index)).to.have.been.calledWith(value);
            expect(context.next.getCall(index + context.values.length)).to.have.been.calledWith(value);
          });
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@alternative:string)', () => {
    it('When flow emits error, emits "next" with @alternative, then single lazy "done"', () =>
      execute(
        context => context.alternative = 'test',
        context => aeroflow(context.error).catch(context.alternative).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.alternative);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });
});
