export default (aeroflow, execute, expect) => describe('aeroflow.just', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.just,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow.just()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.just(),
        context => expect(context.result).to.be.an('Aeroflow')));
  });

  describe('aeroflow.just(@value:aeroflow)', () => {
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

  describe('aeroflow.just(@value:array)', () => {
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

  describe('aeroflow.just(@value:function)', () => {
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

  describe('aeroflow.just(@value:iterable)', () => {
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

  describe('aeroflow.just(@value:promise)', () => {
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
