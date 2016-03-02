export default (aeroflow, execute, expect) => describe('aeroflow().slice', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.slice,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().slice()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.slice(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.slice().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several values, emits "next" for each value, then single greedy "done"', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(context.values).slice().run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) => 
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().slice(@begin:number)', () => {
    it('When flow emits several values and @begin is positive, emits "next" for each of values starting from @begin, then emits single greedy "done"', () =>
      execute(
        context => {
          context.begin = 1;
          context.values = [1, 2, 3, 4];
        },
        context => aeroflow(context.values).slice(context.begin).run(context.next, context.done),
        context => {
          const sliced = context.values.slice(context.begin);
          expect(context.next).to.have.callCount(sliced.length);
          sliced.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several values and @begin is negative, emits "next" for each of values starting from reversed @begin, then emits single greedy "done"', () =>
      execute(
        context => {
          context.begin = -2;
          context.values = [1, 2, 3, 4];
        },
        context => aeroflow(context.values).slice(context.begin).run(context.next, context.done),
        context => {
          const sliced = context.values.slice(context.begin);
          expect(context.next).to.have.callCount(sliced.length);
          sliced.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().slice(@begin:number, @end:number)', () => {
    it('When flow emits several values and both @start and @end are positive, emits "next" for each of values between @begin and @end, then emits single lazy "done"', () =>
      execute(
        context => {
          context.begin = 1;
          context.end = 3;
          context.values = [1, 2, 3, 4];
        },
        context => aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done),
        context => {
          const sliced = context.values.slice(context.begin, context.end);
          expect(context.next).to.have.callCount(sliced.length);
          sliced.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));

    it('When flow emits several values and @begin is positive but @end is negative, emits "next" for each of values between @begin and reversed @end, then emits single greedy "done"', () =>
      execute(
        context => {
          context.begin = 1;
          context.end = -1;
          context.values = [1, 2, 3, 4];
        },
        context => aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done),
        context => {
          const sliced = context.values.slice(context.begin, context.end);
          expect(context.next).to.have.callCount(sliced.length);
          sliced.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several values and @begin is negative but @end is positive, emits "next" for each of values between reversed @begin and @end, then emits single greedy "done"', () =>
      execute(
        context => {
          context.begin = -3;
          context.end = 3;
          context.values = [1, 2, 3, 4];
        },
        context => aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done),
        context => {
          const sliced = context.values.slice(context.begin, context.end);
          expect(context.next).to.have.callCount(sliced.length);
          sliced.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several values and both @start and @end are negative, emits "next" for each of values between reversed @begin and reversed @end, then emits single greedy "done"', () =>
      execute(
        context => {
          context.begin = -3;
          context.end = -1;
          context.values = [1, 2, 3, 4];
        },
        context => aeroflow(context.values).slice(context.begin, context.end).run(context.next, context.done),
        context => {
          const sliced = context.values.slice(context.begin, context.end);
          expect(context.next).to.have.callCount(sliced.length);
          sliced.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});