export default (aeroflow, assert) => describe('#sort', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.sort));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.sort(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.sort().run(fail, done))));

    it('Emits @values in ascending order when flow is not empty', () => {
      const values = [6, 5, 3, 8], expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort().toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparer:string)', () => {
    it('Emits @values in descending order when @comparer equal to desc', () => {
      const values = ['a', 'c', 'f'], sort = 'desc', expectation = values.sort().reverse();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values in descending order when @comparer not equal to desc', () => {
      const values = ['a', 'c', 'f'], sort = 'asc', expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparer:boolean)', () => {
    it('Emits @values in descending order when false passed', () => {
      const values = [2, 7, 4], sort = false, expectation = values.sort().reverse();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values in descending order when true passed', () => {
      const values = [4, 8, 1], sort = true, expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparer:number)', () => {
    it('Emits @values in descending order when @comparer less than 0', () => {
      const values = [2, 7, 4], sort = -1, expectation = values.sort().reverse();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values in descending order when @comparer greatest or equal to 0', () => {
      const values = [4, 8, 1], sort = 1, expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparer:function)', () => {
    it('Emits @values sorted according by result of @comparer', () => {
      const values = [4, 8, 1], comparer = (a, b) => a - b, expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(comparer).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparers:array)', () => {
    it('Emits @values sorted by applying @comparers in order', () => {
      const values = [{ prop: 'test1'}, { prop: 'test2'}], comparers = [(value) => value.prop, 'desc'],
        expectation = values.sort((value) => value.prop).reverse();
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => 
        aeroflow(values).sort(comparers).toArray().run(done, fail)),
        expectation);
    });
  });
});