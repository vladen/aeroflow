export default (aeroflow, assert) => describe('empty', () => {
  it('Is static property', () =>
    assert.isDefined(aeroflow.empty));

  describe('empty', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty, 'Aeroflow'));

    it('Returns instance of Aeroflow emitting nothing ("done" event only)', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.run(fail, done))));
  });
});
