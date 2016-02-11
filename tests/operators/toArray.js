export default (aeroflow, assert) => describe('toArray', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.toArray);
  });

  describe('aeroflow().toArray()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow');
    });

    it('Emits nothing when flow is empty', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.toArray().run(fail, done)));
    });

    it('Emits array of @values when flow emits several @values', () => {
      const values = [1, 2, 1, 3, 2, 3], expectation = values;
      return assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('aeroflow().toArray(true)', () => {
    it('Emits an array when flow is empty', () => {
      const expectation = 'Array';
      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        expectation);
    });
    it('Emits empty array from flow is empty', () => {
      const expectation = 0;
      return assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        expectation);
    });
  });
});
