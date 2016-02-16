export default (aeroflow, assert) => describe('empty', () => {
  it('is static property', () => {
    assert.isDefined(aeroflow.empty);
  });

  describe('empty', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty, 'Aeroflow');
    });

    it('returns instance of Aeroflow emitting "done" event only', () => {
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.run(fail, done)));
    });
  });
});