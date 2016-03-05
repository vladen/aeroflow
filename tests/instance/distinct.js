export default (aeroflow, execute, expect) => describe('aeroflow().distinct', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.distinct,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().distinct()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.distinct(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.distinct().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several values, emits "next" for each unique value, then emits single greedy "done"', () =>
      execute(
        context => context.values = [1, 2, 1],
        context => aeroflow(context.values).distinct().run(context.next, context.done),
        context => {
          const unique = context.values.reduce((array, value) => {
            if (!~array.indexOf(value)) array.push(value);
            return array;
          }, []);
          expect(context.next).to.have.callCount(unique.length);
          unique.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().distinct(true)', () => {
    it('When flow emits several values, emits "next" for each unique and first-non repeating value, then emits single greedy "done"', () =>
      execute(
        context => context.values = [1, 1, 2, 2],
        context => aeroflow(context.values).distinct().run(context.next, context.done),
        context => {
          let last;
          const unique = context.values.reduce((array, value) => {
            if (value !== last) array.push(last = value);
            return array;
          }, []);
          expect(context.next).to.have.callCount(unique.length);
          unique.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});
