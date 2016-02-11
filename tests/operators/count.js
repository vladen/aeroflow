export default (aeroflow, assert) => describe('count', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.count);
  });

  describe('aeroflow().count()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
    });

    it('Emits 0 from empty flow', () => {
      const expectation = 0;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.count().run(done, fail)),
        expectation);
    });

    it('Emits 1 from flow emitting single value', () => {
      const expectation = 1;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(expectation).count().run(done, fail)),
        expectation);
    });

    it('Emits number of @values from flow emitting several @values', () => {
      const values = [1, 2, 3], expectation = values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).count().run(done, fail)),
        expectation);
    });
  });
});
