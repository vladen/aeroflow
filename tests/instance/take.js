export default (aeroflow, assert) => describe('take', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.take));

  describe('take()', () => {
    it('Returns instance of Aeroflow', () => 
      assert.typeOf(aeroflow.empty.take(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.take().run(fail, done))));

    it('Emits nothing when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow('test').take().run(fail, done))));
  });

  describe('take(@condition:function)', () => {
    it('Emits @values while they satisfies @condition ', () => {
      const values = [2, 4, 6, 3, 4], condition = (value) => value %2 === 0, expectation = [2, 4, 6];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).take(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('take(@condition:number)', () => {
    it('Emits @condition number of @values from the start', () => {
      const values = [1, 2, 3], take = 2, expectation = values.slice(0, take);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).take(take).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @condition number of @values from the end', () => {
      const values = [1, 2, 3], take = -2, expectation = values.slice(take);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).take(take).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('take(@condition:!function!number)', () => {
    it('Emits all @values when @condition is non-numeric', () => {
      const values = ['a', 'b', 'c'], take = 'a';
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).take(take).toArray().run(done, fail)),
        values);
    });
  });
});