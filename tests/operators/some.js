export default (aeroflow, execute, expect) => describe('aeroflow().some', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.some,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().some()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.some(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits "next" with false, then single greedy "done"', () =>
      execute(
        context => aeroflow.empty.some().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several falsey values, emits "next" with false, then single greedy "done"', () =>
      execute(
        context => context.values = [false, 0, ''],
        context => aeroflow(context.values).some().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits at least one truthy value, emits "next" with true, then single lazy "done"', () =>
      execute(
        context => context.values = [false, 1, ''],
        context => aeroflow(context.values).some().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));
  });

  describe('aeroflow().some(@condition:function)', () => {
    it('When flow is empty, does not call @condition', () => 
      execute(
        context => context.condition = context.spy(),
        context => aeroflow.empty.some(context.condition).run(),
        context => expect(context.condition).to.have.not.been.called));

    it('When flow is not empty, calls @condition with each emitted value, index of value and context data until @condition returns truthy result', () => 
      execute(
        context => {
          context.values = [1, 2];
          context.condition = context.spy((_, index) => index === context.values.length - 1);
        },
        context => aeroflow(context.values, 3).some(context.condition).run(context.data),
        context => {
          expect(context.condition).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data));
        }));

    it('When flow emits several values and at least one value passes the @condition test, emits single "next" with true, then single lazy "done"', () =>
      execute(
        context => {
          context.condition = value => value > 0;
          context.values = [0, 1];
        },
        context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));

    it('When flow emits several values and no values pass the @condition test, emits single "next" with false, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = value => value > 0;
          context.values = [0, -1];
        },
        context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().some(@condition:regex)', () => {
    it('When flow emits several values and at least one value passes the @condition test, emits single "next" with true, then single lazy "done"', () =>
      execute(
        context => {
          context.condition = /b/;
          context.values = ['a', 'b'];
        },
        context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));

    it('When flow emits several values and no values pass the @condition test, emits single "next" with false, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = /b/;
          context.values = ['a', 'aa'];
        },
        context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().some(@condition:string)', () => {
    it('When flow emits at least one value equal to @condition, emits single "next" with true, then single lazy "done"', () =>
      execute(
        context => {
          context.condition = 1;
          context.values = [1, 2];
        },
        context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(false);
        }));

    it('When flow emits several values not equal to @condition, emits single "next" with false, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = 1;
          context.values = [2, 3];
        },
        context => aeroflow(context.values).some(context.condition).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(false);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});