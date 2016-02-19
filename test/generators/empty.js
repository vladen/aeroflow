export default (aeroflow, assert) => describe('.empty', () => {
  it('Is static property', () =>
    assert.isDefined(aeroflow.empty));

  it('Returns instance of Aeroflow', () =>
    assert.typeOf(aeroflow.empty, 'Aeroflow'));

  it('Returns instance of Aeroflow emitting "done" notification with "true"', () =>
    assert.eventually.isTrue(new Promise((done, fail) =>
      aeroflow.empty.run(fail, done))));

  it('Returns instance of Aeroflow not emitting "next" notification', () =>
    assert.isFulfilled(new Promise((done, fail) =>
      aeroflow.empty.run(fail, done))));
});
