export default (aeroflow, execute, expect) => describe('aeroflow.adapters', () => {
  it('Is static property', () =>
    execute(
      context => aeroflow.adapters,
      context => expect(context.result).to.exist));

  describe('aeroflow.adapters.get', () => {
    it('Is function', () =>
      execute(
        context => aeroflow.adapters.get,
        context => expect(context.result).to.be.a('function')));

    it('Contains indexed iterable adapter', () =>
      execute(
        context => aeroflow.adapters[0],
        context => expect(context.result).to.be.a('function')));

    it('Contains mapped array adapter', () =>
      execute(
        context => aeroflow.adapters['Array'],
        context => expect(context.result).to.be.a('function')));

    it('Contains mapped error adapter', () =>
      execute(
        context => aeroflow.adapters['Error'],
        context => expect(context.result).to.be.a('function')));

    it('Contains mapped function adapter', () =>
      execute(
        context => aeroflow.adapters['Function'],
        context => expect(context.result).to.be.a('function')));

    it('Contains mapped promise adapter', () =>
      execute(
        context => aeroflow.adapters['Promise'],
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow.adapters.get(@source:array)', () => {
      it('Does not resolve adapter function', () =>
        execute(
          context => aeroflow.adapters.get(),
          context => expect(context.result).to.not.exist));
    });

    describe('aeroflow.adapters.get(@source:array)', () => {
      it('Resolves adapter function for @source', () =>
        execute(
          context => aeroflow.adapters.get([]),
          context => expect(context.result).to.be.a('function')));
    });

    describe('aeroflow.adapters.get(@source:iterable)', () => {
      it('Resolves adapter function for @source', () =>
        execute(
          context => aeroflow.adapters.get(new Set),
          context => expect(context.result).to.be.a('function')));
    });

    describe('aeroflow.adapters.get(@source:function)', () => {
      it('Resolves adapter function for @source', () =>
        execute(
          context => aeroflow.adapters.get(Function()),
          context => expect(context.result).to.be.a('function')));
    });

    describe('aeroflow.adapters.get(@source:promise)', () => {
      it('Resolves adapter function for @source', () =>
        execute(
          context => aeroflow.adapters.get(Promise.resolve()),
          context => expect(context.result).to.be.a('function')));
    });
  });

  describe('aeroflow.adapters.use', () => {
    it('Is function', () =>
      execute(
        context => aeroflow.adapters.get,
        context => expect(context.result).to.be.a('function')));

    describe('aeroflow.adapters.use(@adapter:function)', () => {
      it('Registers indexed @adapter and calls it with source when resolves adapter for not mapped class', () =>
        execute(
          context => {
            context.adapter = context.spy();
            context.source = {};
          },
          context => {
            aeroflow.adapters.use(context.adapter);
            aeroflow.adapters.get(context.source);
          },
          context => {
            expect(context.adapter).to.have.been.called;
            expect(context.adapter).to.have.been.calledWith(context.source);
          }));
    });

    describe('aeroflow.adapters.use(@class:string, @adapter:function)', () => {
      it('Registers mapped @adapter and calls it with @source when resolves adapter for instance of @class', () =>
        execute(
          context => {
            context.adapter = context.spy();
            context.class = 'test';
            context.source = {
              [Symbol.toStringTag]: context.class
            };
          },
          context => {
            aeroflow.adapters.use(context.class, context.adapter);
            aeroflow.adapters.get(context.source);
          },
          context => {
            expect(context.adapter).to.have.been.called;
            expect(context.adapter).to.have.been.calledWith(context.source);
          }));
    });
  });
});
