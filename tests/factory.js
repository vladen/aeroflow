export default (aeroflow, execute, expect) => describe('aeroflow', () => {
  it('Is function', () =>
    execute(
      context => {}, /* arrange (optional) */
      context => aeroflow, /* act */
      context => expect(context.result).to.be.a('function') /* assert */ ));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('Emits only single greedy "done"', () =>
      execute(
        context => aeroflow().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });

  describe('(@source:aeroflow)', () => {
    it('When @source is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow(aeroflow.empty).run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(aeroflow(context.values)).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach(
            (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@source:array)', () => {
    it('When @source is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow([]).run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(context.values).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach(
            (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@source:date)', () => {
    it('Emits single "next" with @source, then single greedy "done"', () =>
      execute(
        context => context.source = new Date,
        context => aeroflow(context.source).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.source);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@source:error)', () => {
    it('Emits only single faulty "done" with @source', () =>
      execute(
        context => aeroflow(context.error).run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(context.error);
        }));
  });

  describe('(@source:function)', () => {
    it('Calls @source once with context data', () =>
      execute(
        context => context.source = context.spy(),
        context => aeroflow(context.source).run(context.data),
        context => {
          expect(context.source).to.have.been.calledOnce;
          expect(context.source).to.have.been.calledWith(context.data);
        }));

    it('When @source returns value, emits single "next" with value, then single greedy "done"', () =>
      execute(
        context => aeroflow(() => context.data).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.data);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));

    it('When @source throws, emits only single faulty "done" with thrown error', () =>
      execute(
        context => aeroflow(context.fail).run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(context.error);
        }));
  });

  describe('(@source:iterable)', () => {
    it('When @source is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow(new Set).run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));

    it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', () =>
      execute(
        context => context.values = [1, 2],
        context => aeroflow(new Set(context.values)).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach(
            (value, index) => expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@source:null)', () => {
    it('Emits single "next" with @source, then single greedy "done"', () =>
      execute(
        context => context.source = null,
        context => aeroflow(context.source).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.source);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@source:promise)', () => {
    it('When @source rejects, emits single faulty "done" with rejected error', () =>
      execute(
        context => aeroflow(Promise.reject(context.error)).run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(context.error);
        }));

    it('When @source resolves, emits single "next" with resolved value, then single greedy "done"', () =>
      execute(
        context => context.value = 42,
        context => aeroflow(Promise.resolve(context.value)).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.value);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@source:string)', () => {
    it('Emits single "next" with @source, then single greedy "done"', () =>
      execute(
        context => context.source = 'test',
        context => aeroflow(context.source).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.source);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(@source:undefined)', () => {
    it('Emits single "next" with @source, then single greedy "done"', () =>
      execute(
        context => context.source = undefined,
        context => aeroflow(context.source).run(context.next, context.done),
        context => {
          expect(context.next).to.have.been.calledOnce;
          expect(context.next).to.have.been.calledWith(context.source);
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });

  describe('(...@sources)', () => {
    it('Emits "next" with each serial value from @sources, then single greedy "done"', () =>
      execute(
        context => {
          const values = context.values = [true, new Date, null, 42, 'test', Symbol('test'), undefined];
          context.sources = [
            values[0],
            [values[1]],
            new Set([values[2], values[3]]),
            () => values[4],
            Promise.resolve(values[5]),
            new Promise(resolve => setTimeout(() => resolve(values[6])))
          ];
        },
        context => aeroflow(...context.sources).run(context.next, context.done),
        context => {
          expect(context.next).to.have.callCount(context.values.length);
          context.values.forEach((value, index) =>
            expect(context.next.getCall(index)).to.have.been.calledWith(value));
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
          expect(context.done).to.have.been.calledAfter(context.next);
        }));
  });
});
