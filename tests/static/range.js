export default (aeroflow, execute, expect) => describe('aeroflow.range', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.range,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow.range()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.range(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Infinitely emits "next" for each integer from 0, then single lazy "done"', () =>
      execute(
        context => context.limit = 3,
        context => aeroflow.range().take(context.limit).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.limit);
          Array(context.limit).fill().forEach((_, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(index));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow.range(@start)', () => {
    it('Infinitely emits "next" for each integer from @start, then single lazy "done"', () =>
      execute(
        context => {
          context.limit = 3;
          context.start = -3;
        },
        context => aeroflow.range(context.start).take(context.limit).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.limit);
          Array(context.limit).fill().forEach((_, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(context.start + index));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow.range(@start, @end)', () => {
    it('When @start equal @end, emits single "next" with @start, then single greedy "done"', () =>
      execute(
        context => {
          context.end = 42;
          context.start = context.end;
        },
        context => aeroflow.range(context.start, context.end).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(1);
          expect(context.next).to.have.been.calledWith(context.start);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When @start less than @end, emits "next" for each integer up from @start to @end inclusively, then single greedy "done"', () =>
      execute(
        context => {
          context.end = 3;
          context.start = -3;
        },
        context => aeroflow.range(context.start, context.end).run(context.next, context.done),
        context => {
          const count = context.end - context.start + 1;
          expect(context.next).to.have.callCount(count);
          Array(count).fill().forEach((_, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(context.start + index));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When @end less than @start, emits "next" for each integer down from @start to @end inclusively, then single greedy "done"', () =>
      execute(
        context => {
          context.end = -3;
          context.start = 3;
        },
        context => aeroflow.range(context.start, context.end).run(context.next, context.done),
        context => {
          const count = context.start - context.end + 1;
          expect(context.next).to.have.callCount(count);
          Array(count).fill().forEach((_, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(context.start - index));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});
