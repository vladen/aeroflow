export default (aeroflow, execute, expect, sinon) => describe('aeroflow().toString', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.toString,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().toString()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.toString(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits single "next" with empty string, then single greedy "done"', () =>
      execute(
        context => aeroflow.empty.toString().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith('');
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits single number, emits single "next" with number converted to string, then single greedy "done"', () =>
      execute(
        context => context.number = 42,
        context => aeroflow(context.number).toString().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.number.toString());
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits single string, emits single "next" with string, then single greedy "done"', () =>
      execute(
        context => context.string = 'test',
        context => aeroflow(context.string).toString().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.string);
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several numbers, emits single "next" with numbers converted to strings and concatenated via ",", then single greedy "done"', () =>
      execute(
        context => context.numbers = [1, 2],
        context => aeroflow(context.numbers).toString().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.numbers.join());
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When flow emits several strings, emits single "next" with strings concatenated via ",", then single greedy "done"', () =>
      execute(
        context => context.strings = ['a', 'b'],
        context => aeroflow(context.strings).toString().run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.strings.join());
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('aeroflow().toString(@seperator:string)', () => {
    it('When flow emits several strings, emits single "next" with strings concatenated via @separator, then single greedy "done"', () =>
      execute(
        context => {
          context.separator = ':';
          context.strings = ['a', 'b'];
        },
        context => aeroflow(context.strings).toString(context.separator).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.strings.join(context.separator));
          expect(context.done).to.have.been.calledAfter(context.next);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});
