export default (aeroflow, assert) => describe('reverse', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.reverse));

  describe('reverse()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.reverse(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reverse().run(fail, done))));

    it('Emits @value from flow emitting single numeric @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).reverse().run(done, fail)),
        expectation);
    });

    it('Emits reversed @values from flow emitting @values', () => {
      const values = [1, 3], expectation = values.reverse();
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).reverse().toArray().run(done, fail)),
        expectation);
    });
  });
});