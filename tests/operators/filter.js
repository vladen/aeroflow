export default (aeroflow, execute, expect) => describe('aeroflow().filter', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.filter,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().filter()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.filter(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.filter().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow is not empty, emits "next" for each truthy value, then single greedy "done"', () =>
      execute(
        context => context.values = [0, 1, false, true, '', 'test'],
        context => aeroflow(context.values).filter().run(context.next, context.done),
        context => {
          const filtered = context.values.filter(value => !!value);
          expect(context.next).to.have.callCount(filtered.length);
          filtered.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().filter(@condition:function)', () => {
    it('When flow is empty, does not call @condition', () => 
      execute(
        context => context.condition = context.spy(),
        context => aeroflow.empty.filter(context.condition).run(),
        context => expect(context.condition).to.have.not.been.called));

    it('When flow is not empty, calls @condition with each emitted value, index of value and context data', () => 
      execute(
        context => {
          context.values = [1, 2];
          context.condition = context.spy();
        },
        context => aeroflow(context.values).filter(context.condition).run(context.data),
        context => {
          expect(context.condition).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.condition.getCall(index)).to.have.been.calledWithExactly(value, index, context.data));
        }));

    it('When flow is not empty, emits "next" for each value passing the @condition test, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = value => 0 === value % 2;
          context.values = [1, 2, 3];
        },
        context => aeroflow(context.values).filter(context.condition).run(context.next, context.done),
        context => {
          const filtered = context.values.filter(context.condition);
          expect(context.next).to.have.callCount(filtered.length);
          filtered.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().filter(@condition:regex)', () => {
    it('When flow is not empty, emits "next" for each value passing the @condition test, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = /b/;
          context.values = ['a', 'b', 'c'];
        },
        context => aeroflow(context.values).filter(context.condition).run(context.next, context.done),
        context => {
          const filtered = context.values.filter(value => context.condition.test(value));
          expect(context.next).to.have.callCount(filtered.length);
          filtered.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().filter(@condition:number)', () => {
    it('When flow is not empty, emits "next" for each value equal to @condition, then single greedy "done"', () =>
      execute(
        context => {
          context.condition = 2;
          context.values = [1, 2, 3];
        },
        context => aeroflow(context.values).filter(context.condition).run(context.next, context.done),
        context => {
          const filtered = context.values.filter(value => value === context.condition);
          expect(context.next).to.have.callCount(filtered.length);
          filtered.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});
