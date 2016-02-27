export default (aeroflow, execute, expect, sinon) => describe('#toString', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.toString,
      context => expect(context.result).to.be.a('function')));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.toString(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits "next" notification with "empty string" when flow is empty', () =>
      execute(
        context => aeroflow.empty.toString().notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith('')));

    it('Emits "next" notification with string emitted by flow', () =>
      execute(
        context => context.string = 'test',
        context => aeroflow(context.string).toString().notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.string)));

    it('Emits "next" notification with number emitted by flow converted to string', () =>
      execute(
        context => context.number = 42,
        context => aeroflow(context.number).toString().notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith('' + context.number)));

    it('Emits "next" notification with strings emitted by flow concatenated via "," separator', () =>
      execute(
        context => context.strings = ['a', 'b'],
        context => aeroflow(context.strings).toString().notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.strings.join(','))));

    it('Emits "next" notification with numbers emitted by flow converted to strings and concatenated via "," separator', () =>
      execute(
        context => context.numbers = [1, 2],
        context => aeroflow(context.numbers).toString().notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.numbers.join(','))));
  });

  describe('(@seperator:string)', () => {
    it('Emits "next" notification with strings emitted by flow concatenated via @separator', () =>
      execute(
        context => {
          context.separator = ' ';
          context.strings = ['a', 'b'];
        },
        context => aeroflow(context.strings).toString(context.separator).notify(context.next).run(),
        context => expect(context.next).to.have.been.calledWith(context.strings.join(context.separator))));
  });
});
