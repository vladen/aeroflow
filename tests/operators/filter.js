export default (aeroflow, assert) => describe('filter', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.filter));

  describe('aeroflow().filter()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.filter(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.filter().run(fail, done))));

    it('Emits only truthy values', () => {
      const values = [false, true, 0, 1, undefined, null, 'test'],
        expectation = values.filter(value => value);
      assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).filter().toArray().run(done, fail)),
        expectation);
    });
  });

  describe('aeroflow().filter(@condition:function)', () => {
    it('Does not call @condition when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.filter(fail).run(fail, done))));

    it('Calls @condition when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').filter(done).run(fail, fail))));

    it('Passes value emitted by flow to @condition as first argument', () => {
      const value = 'test';
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).filter(done).run(fail, fail)),
        value);
    });

    it('Passes zero-based index of iteration to @condition as second argument', () => {
      const values = [1, 2, 3, 4], expectation = values.length - 1;
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(values).filter((_, index) => {
          if (index === expectation) done();
        }).run(fail, fail)));
    });

    it('Passes context data to @condition as third argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').filter((_, __, data) => done(data)).run(fail, fail, data)),
        data);
    });

    it('Emits only values passing @condition test', () => {
      const values = [0, 1, 2, 3], condition = value => value > 1,
        expectation = values.filter(condition);
      assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('aeroflow().filter(@condition:regex)', () => {
    it('Emits only values passing @condition test', () => {
      const values = ['a', 'b', 'aa', 'bb'], condition = /a/,
        expectation = values.filter(value => condition.test(value));
      assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('aeroflow().filter(@condition:!function!regex)', () => {
    it('Emits only values equal to @condition', () => {
      const values = [1, 2, 3], condition = 2,
        expectation = values.filter(value => value === condition);
      assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });
});
