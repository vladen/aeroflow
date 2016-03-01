export default (aeroflow, execute, expect) => describe('#map', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.map,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.map(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.map().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow is not empty, emits "next" for each emitted value, then single greedy "done"', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(context.values).map().run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('(@mapper:function)', () => {
    it('When flow is empty, does not call @mapper', () => 
      execute(
        context => context.mapper = context.spy(),
        context => aeroflow.empty.map(context.mapper).run(),
        context => expect(context.mapper).to.have.not.been.called));

    it('When flow is not empty, calls @mapper with each emitted value, index of value and context data', () => 
      execute(
        context => {
          context.values = [1, 2];
          context.mapper = context.spy();
        },
        context => aeroflow(context.values).map(context.mapper).run(context.data),
        context => {
          expect(context.mapper).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.mapper.getCall(index)).to.have.been.calledWithExactly(value, index, context.data));
        }));

    it('When flow is not empty, emits "next" for each emitted value with result returned by @mapper, then single greedy "done"', () =>
      execute(
        context => {
          context.mapper = value => -value;
          context.values = [1, 2];
        },
        context => aeroflow(context.values).map(context.mapper).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(context.mapper(value)));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('(@mapper:number)', () => {
    it('When flow is not empty, emits "next" for each emitted value with @mapper instead of value, then single greedy "done"', () =>
      execute(
        context => {
          context.mapper = 42;
          context.values = [1, 2];
        },
        context => aeroflow(context.values).map(context.mapper).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((_, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(context.mapper));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});