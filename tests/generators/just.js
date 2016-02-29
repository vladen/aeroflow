export default (aeroflow, execute, expect) => describe('.just', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.just,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.just(),
        context => expect(context.result).to.be.an('Aeroflow')));
  });

  describe('(@value:aeroflow)', () => {
    it('Emits single "next" with @value, then single greedy "done"', () =>
      execute(
        context => context.value = aeroflow.empty,
        context => aeroflow.just(context.value).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.value);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@value:array)', () => {
    it('Emits single "next" with @value, then single greedy "done"', () =>
      execute(
        context => context.value = [42],
        context => aeroflow.just(context.value).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.value);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@value:function)', () => {
    it('Emits single "next" with @value, then single greedy "done"', () =>
      execute(
        context => context.value = Function(),
        context => aeroflow.just(context.value).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.value);
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@value:iterable)', () => {
    it('Emits single "next" with @value, then single greedy "done"', () =>
      execute(
        context => context.value = new Set,
        context => aeroflow.just(context.value).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.value);
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@value:promise)', () => {
    it('Emits single "next" with @value, then single greedy "done"', () =>
      execute(
        context => context.value = Promise.resolve(),
        context => aeroflow.just(context.value).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.value);
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });
});
