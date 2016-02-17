export default (aeroflow, assert) => describe('max', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.max);
  });

  describe('max()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.max(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () => 
       assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.max().run(fail, done))));

    it('Emits @value when flow emits single numeric @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).max().run(done, fail)),
        value);
    });

    it('Emits @value when flow emits single string @value', () => {
      const value = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).max().run(done, fail)),
        value);
    });

    it('Emits maximum of @values when flow emits several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.max(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).max().run(done, fail)),
        expectation);
    });

    it('Emits maximum of @values when flow emits several string @values', () => {
      const values = ['a', 'c', 'b'],
        expectation = values.reduce((max, value) => value > max ? value : max);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).max().run(done, fail)),
        expectation);
    });
  });
});
