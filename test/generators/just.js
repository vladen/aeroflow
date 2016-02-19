export default (aeroflow, assert) => describe('.just', () => {
  it('Is static method', () =>
    assert.isFunction(aeroflow.just));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.just(), 'Aeroflow'));

    it('Returns instance of Aeroflow emitting "next" notification with undefined', () => {
      const expectation = undefined;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just().run(done, fail)),
        expectation);
    });
  });

  describe('(@value:array)', () => {
    it('Returns instance of Aeroflow emitting "next" notification with @value', () => {
      const array = [1, 2, 3], expectation = array;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just(array).run(done, fail)),
        expectation);
    });
  });

  describe('(@value:iterable)', () => {
    it('Returns instance of Aeroflow emitting "next" notification with @value', () => {
      const iterable = new Set([1, 2, 3]), expectation = iterable;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just(iterable).run(done, fail)),
        expectation);
    });
  });
});
