export default (aeroflow, assert) => describe('#average', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.average));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.average(), 'Aeroflow'));

    it('Emits "done" notification only when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.average().run(fail, done))));

    it('Emits "next" notification parameterized with @value when flow emits single numeric @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).average().run(done, fail)),
        value);
    });

    it('Emits "next" notification parameterized with NaN when flow emits single not numeric @value', () =>
      assert.eventually.isNaN(new Promise((done, fail) =>
        aeroflow('test').average().run(done, fail))));

    it('Emits "next" notification parameterized with average of @values when flow emits several numeric @values', () => {
      const values = [1, 3, 2], average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).average().run(done, fail)),
        average);
    });

    it('Emits "next" notification parameterized with NaN when flow emits several not numeric @values', () =>
      assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow('a', 'b').average().run(done, fail))));
  });
});
