export default (aeroflow, execute, expect) => describe('aeroflow.create', () => {
  it('Is static method', () =>
    execute(
      context => aeroflow.create,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow.create()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.create(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits only single greedy "done"', () =>
      execute(
        context => aeroflow.create().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWithExactly(true);
        }));
  });

  describe('aeroflow.create(@generator:function)', () => {
    it('Calls @generator once with "next" and "done" callbacks', () =>
      execute(
        context => context.generator = context.spy((_, done) => done()),
        context => aeroflow.create(context.generator).run(context.next, context.done),
        context => {
          expect(context.generator).to.have.been.calledOnce;
          const args = context.generator.getCall(0).args;
          expect(args[0]).to.be.a('function');
          expect(args[1]).to.be.a('function');
        }));

    it('Emits several "next" emitted by @generator until it emits "done"', () =>
      execute(
        context => {
          context.values = [1, 2];
          context.generator = (next, done) => {
            context.values.forEach(next);
            done();
            next();
          };
        },
        context => aeroflow.create(context.generator).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
        }));

    it('Emits "done" emitted by @generator only once', () =>
      execute(
        context => {
          context.value = 42;
          context.generator = (_, done) => {
            done(context.value);
            done();
          };
        },
        context => aeroflow.create(context.generator).run(context.noop, context.done),
        context => {
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWithExactly(context.value);
        }));
  });

  describe('aeroflow.create(@generator:string)', () => {
    it('Emits single "next" with @generator, then emits single greedy "done"', () =>
      execute(
        context => context.generator = 'test',
        context => aeroflow.create(context.generator).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.generator);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWithExactly(true);
        }));
  });
});
