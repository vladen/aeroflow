export default (aeroflow, assert) => describe('toArray', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.toArray));

  describe('toArray()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.toArray().run(fail, done))));

    it('Emits array of @values when flow emits several @values', () => {
      const values = [1, 2, 1, 3, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toArray().run(done, fail)),
        values);
    });
  });

  describe('toArray(true)', () => {
    it('Emits array when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        'Array'));

    it('Emits empty array from flow is empty', () =>
      assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        0));
  });
});
