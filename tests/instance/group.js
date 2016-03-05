export default (aeroflow, execute, expect) => describe('aeroflow().group', () => {
  it('Is instance method', () =>
    execute(
      context => aeroflow.empty.group,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().group()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.group(),
        context => expect(context.result).to.be.an('Aeroflow')));

    it('When flow is empty, emits only single greedy "done"', () =>
      execute(
        context => aeroflow.empty.group().run(context.next, context.done),
        context => {
          expect(context.next).to.have.not.been.called;
          expect(context.done).to.have.been.calledOnce;
          expect(context.done).to.have.been.calledWith(true);
        }));
  });
});

/*
export default (aeroflow, assert) => describe('#group', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.group));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.group(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.group().run(fail, done))));
  });

  describe('(@selector:function)', () => {
    it('Does not call @selector when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.group(fail).run(fail, done))));

    it('Calls @selector when flow emits several values', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).group(done).run(fail, fail))));

    it('Emits error thrown by @selector', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).group(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Passes context data to @selector as third argument', () => {
      const expectation = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').group((_, __, data) => done(data)).run(fail, fail, expectation)),
        expectation);
    });

    it('Passes zero-based @index of iteration to @condition as second argument', () => {
      const values = [1, 2, 3, 4], expectation = values.length - 1;
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(values).group((_, index) => {
          if (index === expectation) done();
        }).run(fail, fail)));
    });

    it('Emits @values divided into groups by result of @selector', () => {
      const values = [-1, 6, -3, 4],
        expectation = [[-1, -3], [6, 4]];

      return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
        aeroflow(values).group(value => value >= 0).map(group => group[1]).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values divided into named groups by result of @selector', () => {
      const values = [-1, 6, -3, 4], positive = 'positive', negative = 'positive';

      return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
        aeroflow(values).group(value => value >= 0 ? positive : negative).map(group => group[0]).toArray().run(done, fail)),
        [positive, negative]);
    });
  });

  describe('(@selectors:array)', () => {
    it('Emits nested named groups which divide @values by first predicate from @selectors', () => {
      const values = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
        expectation = [values[0].name, values[1].name],
        selectors = [(value) => value.name, (value) => value.sex];

      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).group(...selectors).map(group => group[0]).toArray().run(done, fail)),
        expectation);
    });

    it('Use maps to contain nested groups which divided @values by @selectors', () => {
      const values = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
        selectors = [(value) => value.name, (value) => value.sex];

      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow(values).group(...selectors).toArray().map(group => group[0][1]).run(done, fail)),
        'Map');
    });

    it('Emits nested named groups which divide @values by second predicate from @selectors', () => {
       const values = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
         expectation = [[values[0].sex], [values[1].sex]],
       selectors = [(value) => value.name, (value) => value.sex];

      return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
        aeroflow(values).group(...selectors).map(group => Array.from(group[1].keys())).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values on the root of nested groups', () => {
      const values = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
         selectors = [(value) => value.name, (value) => value.sex];

      return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
        aeroflow(values).group(...selectors).map(group => Array.from(group[1].values())[0][0]).toArray().run(done, fail)),
        values);
    });
  });
});
*/
