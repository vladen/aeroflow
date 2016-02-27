export default (aeroflow, execute, expect, sinon) => describe('#take', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.take,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.take(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits "done" notification with "true" when flow is empty', () =>
      execute(
        context => aeroflow.empty.take().notify(context.next, context.done).run(),
        context => expect(context.done).to.have.been.calledWith(true)));

    it('Does not emit "next" notification when flow is empty', () =>
      execute(
        context => aeroflow.empty.take().notify(context.next).run(),
        context => expect(context.next).to.have.not.been.called));

    it('Emits "next" notification with value emitted by flow', () =>
      execute(
        context => context.value = 42,
        context => aeroflow(context.value).take().notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.value)));
  });

  describe('(false)', () => {
    it('Emits "done" notification with "false" when flow is not empty', () =>
      execute(
        context => aeroflow(42).take(false).notify(context.next, context.done).run(),
        context => expect(context.done).to.have.been.calledWith(false)));

    it('Does not emit "next" notification', () =>
      execute(
        context => aeroflow(1, 2).take(false).notify(context.next).run(),
        context => expect(context.next).to.have.not.been.called));
  });

  describe('(true)', () => {
    it('Emits "done" notification with "true" when flow is not empty', () =>
      execute(
        context => aeroflow(42).take(true).notify(context.next, context.done).run(),
        context => expect(context.done).to.have.been.calledWith(true)));

    it('Emits several "next" notifications with all values emitted by flow', () =>
      execute(
        context => context.values = [1, 2, 3],
        context => aeroflow(context.values).take(true).notify(context.next).run(),
        context => context.values.forEach(
          value => expect(context.next).to.have.not.been.calledWith(value))));
  });

  describe('(@condition:function)', () => {
    it('Does not call @condition when flow is empty', () =>
      execute(
        context => context.condition = sinon.spy(),
        context => aeroflow.empty.take(context.condition).run(),
        context => expect(context.condition).to.have.not.been.called));

    it('Calls @condition with emitted value, zero-based index of value and context data when flow is not empty', () =>
      execute(
        context => {
          context.condition = sinon.spy();
          context.data = 'test';
          context.value = 42;
        },
        context => aeroflow(context.value).take(context.condition).run(context.data),
        context => expect(context.condition).to.have.been.calledWithExactly(context.value, 0, context.data)));

    it('Emits "next" notifications with values emitted by flow while @condition returns truthy value', () =>
      execute(
        context => {
          context.spy = sinon.spy();
          context.limit = 2;
          context.condition = (value, index) => {
            sinon.spy(value);
            return index < context.limit;
          };
          context.values = [1, 2, 3, 4];
        },
        context => aeroflow(context.values).take(context.condition).run(),
        context => context.values.slice(0, context.limit).forEach(
          value => expect(context.condition).to.have.been.calledWith(value))));
  });

  describe('(@condition:number:negative)', () => {
    it('Emits @condition number of first values emitted by flow', () =>
      execute(
        context => {
          context.condition = 2;
          context.values = [1, 2, 3];
        },
        context => aeroflow(context.values).take(context.condition).notify(context.next).run(),
        context => context.values.slice(0, context.condition).forEach(
          value => expect(context.next).to.have.been.calledWith(value))));
  });

  describe('(@condition:number:positive)', () => {
    it('Emits @condition number of first values emitted by flow', () =>
      execute(
        context => {
          context.condition = 2;
          context.values = [1, 2, 3];
        },
        context => aeroflow(context.values).take(context.condition).notify(context.next).run(),
        context => context.values.slice(0, context.condition).forEach(
          value => expect(context.next).to.have.been.calledWith(value))));
  });
});