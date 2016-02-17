export default (aeroflow, assert) => describe('toSet', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.toSet);
  });

  describe('toSet()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.toSet().run(fail, done))));

    it('Emits set of unique @values when flow emits several @values', () => {
      const values = [1, 2, 1, 3, 2, 3], expectation = Array.from(new Set(values));
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).toSet().map(set => Array.from(set)).run(done, fail)),
        expectation);
    });
  });

  describe('toSet(true)', () => {
    it('Emits a set when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        'Set'));

    it('Emits empty set when flow is empty', () =>
      assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        'size',
        0));
  });
});
