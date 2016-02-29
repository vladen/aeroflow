export default (aeroflow, execute, expect) => describe('#coalesce', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.coalesce,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.coalesce(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.coalesce().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('(@alternative:array)', () => {
    it('When flow is empty, emits "next" for each serial value from @alternative, then emits single greedy "done"', () =>
      execute(
        context => context.alternative = [1, 2],
        context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.alternative.length);
          context.alternative.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@alternative:function)', () => {
    it('When flow is empty, calls @alternative once with context data, emits single "next" with value returned by @alternative, then emits single greedy "done"', () =>
      execute(
        context => {
          context.values = [1, 2];
          context.alternative = context.spy(context.values);
        },
        context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done, context.data),
        context => {
          expect(context.alternative).to.have.been.calledOnce;
          expect(context.alternative).to.have.been.calledWith(context.data);
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));

    it('When flow emits error, does not call @alternative', () =>
      execute(
        context => context.alternative = context.spy(),
        context => aeroflow(context.error).coalesce(context.alternative).run(),
        context => expect(context.alternative).to.have.not.been.called));

    it('When flow emits some values, does not call @alternative', () =>
      execute(
        context => context.alternative = context.spy(),
        context => aeroflow('test').coalesce(context.alternative).run(),
        context => expect(context.alternative).to.have.not.been.called));
  });

    describe('(@alternative:promise)', () => {
    it('When flow is empty, emits single "next" with value resolved by @alternative, then emits single greedy "done"', () =>
      execute(
        context => {
          context.value = 42;
          context.alternative = Promise.resolve(context.value);
        },
        context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.value);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@alternative:string)', () => {
    it('When flow is empty, emits single "next" with @alternative, then emits single greedy "done"', () =>
      execute(
        context => context.alternative = 'test',
        context => aeroflow.empty.coalesce(context.alternative).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.alternative);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });
});
