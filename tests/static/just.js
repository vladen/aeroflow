export default (aeroflow, assert) => describe('just', () => {
  it('is static method', () =>
    assert.isFunction(aeroflow.just));

  describe('just()', () => {
    it('returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.just(), 'Aeroflow'));

    it('returns instance of Aeroflow emitting single undefined value', () => {
      const expectation = undefined;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just().run(done, fail)),
        expectation);
    });
  });

  describe('just(@array)', () => {
    it('returns instance of Aeroflow emitting @array as is', () => {
      const array = [1, 2, 3], expectation = array;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just(array).run(done, fail)),
        expectation);
    });
  });

  describe('just(@iterable)', () => {
    it('returns instance of Aeroflow emitting @iterable as is', () => {
      const iterable = new Set([1, 2, 3]), expectation = iterable;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just(iterable).run(done, fail)),
        expectation);
    });
  });
});