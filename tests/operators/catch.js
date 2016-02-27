export default (aeroflow, execute, expect, sinon) => describe('#catch', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.catch,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.catch(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Does not emit "next" notification when flow is empty', () =>
      execute(
        context => aeroflow.empty.catch().notify(context.next).run(),
        context => expect(context.next).not.to.have.been.called));

    it('Does not emit "next" notification when flow emits single error', () =>
      execute(
        context => aeroflow(new Error('test')).catch().notify(context.next).run(),
        context => expect(context.next).not.to.have.been.called));

    it('Emits "done" notification with "true" when flow emits single error', () =>
      execute(
        context => aeroflow(new Error('test')).catch().notify(context.next, context.done).run(),
        context => expect(context.done).to.have.been.calledWith(true)));
  });

  describe('(@alternative:array)', () => {
    it('Emits serveral "next" notifications with subsequent items from @alternative when flow emits error', () =>
      execute(
        context => context.alternative = [1, 2],
        context => aeroflow(new Error('test')).catch(context.alternative).notify(context.next).run(),
        context => context.alternative.forEach(
          item => expect(context.next).to.have.been.calledWith(item))));
  });

  describe('(@alternative:function)', () => {
    it('Does not call @alternative when flow is empty', () =>
      execute(
        context => context.alternative = sinon.spy(),
        context => aeroflow.empty.catch(context.alternative).run(),
        context => expect(context.alternative).not.to.have.been.called));

    it('Does not call @alternative when flow does not emit error', () =>
      execute(
        context => context.alternative = sinon.spy(),
        context => aeroflow('test').catch(context.alternative).run(),
        context => expect(context.alternative).not.to.have.been.called));

    it('Calls @alternative with error emitted by flow and context data', () =>
      execute(
        context => {
          context.alternative = sinon.spy();
          context.data = 'test';
          context.error = new Error('test');
        },
        context => aeroflow(context.error).catch(context.alternative).run(context.data),
        context => expect(context.alternative).to.have.been.calledWith(context.error, context.data)));

    it('Emits "next" notification with value returned by @alternative when flow emits error', () =>
      execute(
        context => context.value = 'test',
        context => aeroflow(new Error('test')).catch(() => context.value).notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.value)));
  });

  describe('(@alternative:string)', () => {
    it('Emits "next" notification with @alternative value when flow emits error', () =>
      execute(
        context => context.alternative = 'test',
        context => aeroflow(new Error('test')).catch(context.alternative).notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.alternative)));
  });
});
