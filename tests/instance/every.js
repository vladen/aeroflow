export default (aeroflow, assert) => describe('every', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.every));

  describe('every()', () => {
    it('Returns instance of Aeroflow', () => 
      assert.typeOf(aeroflow.empty.every(), 'Aeroflow'));

    it('Emits true when flow is empty', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow.empty.every().run(done, fail))));

    it('Emits true when flow is not empty', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow(1).every().run(done, fail))));
  });

  describe('every(@condition:function)', () => {
    it('Emits result of passing @condition test by each item in flow', () => {
      const values = [2, 4, 3], condition = (item) => item % 2 === 0, expectation = values.every(condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });
  });

  describe('every(@condition:regex)', () => {
    it('Emits result of passing @condition test by each item in flow', () => {
      const values = ['a', 'b', 'aa', 'bb'], condition = /a/,
        expectation = values.every(value => condition.test(value));
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });
  });

  describe('every(@condition:!function!regex)', () => {
    it('Emits result of passing @condition test by each item in flow', () => {
      const values = [1, 1, 1, 1], condition = 1,
        expectation = values.every(value => value === condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });
  });
});