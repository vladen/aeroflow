export default (aeroflow, assert) => describe('Aeroflow#toSet', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.toSet);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow');
    });

    it('emits nothing when flow is empty', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.toSet().run(fail, done)));
    });

    it('emits set of unique @values when flow emits several @values', () => {
      const values = [1, 2, 1, 3, 2, 3], expectation = Array.from(new Set(values));
      return assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).toSet().map(set => Array.from(set)).run(done, fail)),
        expectation);
    });
  });

  describe('(true)', () => {
    it('emits a set when flow is empty', () => {
      const expectation = 'Set';
      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        expectation);
    });
    it('emits empty set when flow is empty', () => {
      const expectation = 0;
      return assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        'size',
        expectation);
    });
  });
});
