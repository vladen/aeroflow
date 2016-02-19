export default (aeroflow, assert) => describe('#toSet', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.toSet);
  });

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow'));

    it('Emits "next" notification with set when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        'Set'));

    it('Emits "next" notification with empty set when flow is empty', () =>
      assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        'size',
        0));

    it('Emits "next" notification with set containing unique of @values when flow emits several @values', () => {
      const values = [1, 2, 1, 3, 2, 3], expectation = Array.from(new Set(values));
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).toSet().map(set => Array.from(set)).run(done, fail)),
        expectation);
    });
  });
});
