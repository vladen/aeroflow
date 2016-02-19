export default (aeroflow, assert) => describe('#toArray', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.toArray));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow'));

    it('Emits "next" notification aergumented with array when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        'Array'));

    it('Emits "next" notification aergumented with empty array when flow is empty', () =>
      assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        0));

    it('Emits array of @values when flow emits several @values', () => {
      const values = [1, 2];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toArray().run(done, fail)),
        values);
    });
  });
});
