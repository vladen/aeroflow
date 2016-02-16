export default (aeroflow, assert) => describe('skip', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.skip));

  describe('skip()', () => {
    it('Returns instance of Aeroflow', () => 
      assert.typeOf(aeroflow.empty.skip(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.skip().run(fail, done))));

    it('Emits nothing when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow('test').skip().run(fail, done))));
  });

  describe('skip(@condition:function)', () => {
    it('Emits @values until they not satisfies @condition ', () => {
      const values = [2, 4, 6, 3, 7], condition = (value) => value %2 === 0, expectation = [3, 7];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).skip(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('skip(@condition:number)', () => {
    it('Emits @values beginning with @condition position from the start', () => {
      const values = [1, 2, 3], skip = 2, expectation = values.slice(skip);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).skip(skip).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values without @condition number of @values from the end', () => {
      const values = [1, 2, 3], skip = 2, expectation = values.slice(0, values.length - skip);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).skip(-skip).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('skip(@condition:!function!number)', () => {
    it('Emits nothing when @condition is non-numeric', () => 
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').skip('test').run(fail, done))));
  });
});