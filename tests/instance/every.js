export default (aeroflow, execute, expect) => describe('aeroflow().every', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.every,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().every()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.every(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits "next" with true, then single greedy "done"', () =>
      execute(
        context => aeroflow.empty.every().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several truthy values, emits "next" with true, then single greedy "done"', () =>
      execute(
        context => context.values = [true, 1, 'test'],
        context => aeroflow(context.values).every().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits at least one falsey value, emits "next" with false, then single lazy "done"', () =>
      execute(
        context => context.values = [true, 1, ''],
        context => aeroflow(context.values).every().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow().every(@condition:function)', () => {
    it('When flow is empty, does not call @condition', () => 
      execute(
        context => context.condition = context.spy(),
        context => aeroflow.empty.every(context.condition).run(),
        context => expect(context.condition).to.have.not.been.called));

    it('When flow is not empty, calls @condition with each emitted value and its index until @condition returns falsey result', () => 
      execute(
        context => {
          context.values = [1, 2];
          context.condition = context.spy((_, index) => index !== context.values.length - 1);
        },
        context => aeroflow(context.values, 3).every(context.condition).run(),
        context => {
          expect(context.condition).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.condition.getCall(index)).to.have.been.calledWith(value, index));
        }));

    it('When flow emits several values and all values pass the @condition test, emits single "next" with true, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = value => value > 0;
          context.values = [1, 2];
        },
        context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several values and at least one value does not pass the @condition test, emits single "next" with false, then single lazy "done"', () =>
      execute(
        context => {
          context.condition = value => value > 0;
          context.values = [1, 0];
        },
        context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow().every(@condition:regex)', () => {
    it('When flow emits several values and all values pass the @condition test, emits single "next" with true, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = /a/;
          context.values = ['a', 'aa'];
        },
        context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several values and at least one value does not pass the @condition test, emits single "next" with false, then single lazy "done"', () =>
      execute(
        context => {
          context.condition = /a/;
          context.values = ['a', 'b'];
        },
        context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow().every(@condition:string)', () => {
    it('When flow emits several values equal to @condition, emits single "next" with true, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = 1;
          context.values = [1, 1];
        },
        context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several values not equal to @condition, emits single "next" with false, then single lazy "done"', () =>
      execute(
        context => {
          context.condition = 1;
          context.values = [1, 2];
        },
        context => aeroflow(context.values).every(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });
});