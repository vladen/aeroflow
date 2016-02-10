export default (aeroflow, assert) => describe('Aeroflow#count', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.count);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
    });

    it('emits 0 from empty flow', () => {
      const expectation = 0;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.count().run(done, fail)),
        expectation);
    });

    it('emits 1 from flow emitting single value', () => {
      const expectation = 1;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(expectation).count().run(done, fail)),
        expectation);
    });

    it('emits number of @values from flow emitting several @values', () => {
      const values = [1, 2, 3], expectation = values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).count().run(done, fail)),
        expectation);
    });
  });

});
