export default (aeroflow, assert) => describe('distinct', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.distinct));

  describe('distinct()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.distinct(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.distinct().run(fail, done))));

    it('Emits unique of @values when flow emits several numeric @values', () => {
      const values = [1, 1, 2, 2, 3], expectation = Array.from(new Set(values));
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).distinct().toArray().run(done, fail)),
        expectation);
    });

    it('Emits unique of @values when flow emits several string @values', () => {
      const values = ['a', 'a', 'b', 'b', 'c'], expectation = Array.from(new Set(values));
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).distinct().toArray().run(done, fail)),
        expectation);
    });
  });

  describe('distinct(true)', () => {
    it('Emits first @value of each sub-sequence of identical @values (distinct until changed)', () => {
      const values = [1, 1, 2, 2, 1, 1], expectation = [1, 2, 1];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).distinct(true).toArray().run(done, fail)),
        expectation);
    });
  });
});
