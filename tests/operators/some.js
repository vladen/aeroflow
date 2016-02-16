export default (aeroflow, assert) => describe('some', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.some));

  describe('some()', () => {
    it('Returns instance of Aeroflow', () => 
      assert.typeOf(aeroflow.empty.some(), 'Aeroflow'));

    it('Emits false when flow is empty', () =>
      assert.eventually.isFalse(new Promise((done, fail) =>
        aeroflow.empty.some().run(done, fail))));

    it('Emits true when flow is not empty', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow(1).some().run(done, fail))));
  });

  describe('every(@condition:function)', () => {
    it('Emits result of passing @condition test at least one item in flow', () => {
      const values = [2, 1, 3], condition = (item) => item % 2 === 0, expectation = values.some(condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });
  });

  describe('some(@condition:regex)', () => {
    it('Emits result of passing @condition test at least one item in flow', () => {
      const values = ['a', 'b', 'aa', 'bb'], condition = /^a$/,
        expectation = values.some(value => condition.test(value));
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });
  });

  describe('some(@condition:!function!regex)', () => {
    it('Emits result of passing @condition test at least one item in flow', () => {
      const values = [1, 2], condition = 1,
        expectation = values.some(value => value === condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });
  });
});