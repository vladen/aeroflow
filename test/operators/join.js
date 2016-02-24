export default (aeroflow, assert) => describe('#join', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.join));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.join(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.join().run(fail, done))));

    it('Emits @values from flow concatenated with undefined when flow is not empty', () => {
      const values = [1, 2], expectation = [[1, undefined], [2, undefined]];
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => {
        aeroflow(values).join().toArray().run(done, fail);
      }), expectation);
    });
  });

  describe('(@joiner:any)', () => {
    it('Emits nested arrays with @values concatenated with @joiner values by one to one', () => {
      const values = [1, 2], joiner = [3, 4], expectation = [[1, 3], [1, 4], [2, 3], [2, 4]];
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => {
        aeroflow(values).join(joiner).toArray().run(done, fail);
      }), expectation);
    });
  });

  describe('(@joiner:any, @comparer:function)', () => {
    it('Emits nested arrays with @values concatenated with @joiner through @comparer function', () => {
      const values = [{a: 'test', b: 'tests'}], joiner = [{a: 'test', c: 'tests3'}],
        comparer = (left, right) => left.a === right.a, expectation = [...values, ...joiner];
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => {
        aeroflow(values).join(joiner, comparer).toArray().map(res => res[0]).run(done, fail);
      }), expectation);
    });
  });

  describe('(@joiner:any, @comparer:!function)', () => {
    it('Emits nested arrays with @values concatenated with @joiner values by one to one ignored @comparer', () => {
      const values = [1, 2], joiner = 3, comparer ='test', expectation = [[1, 3], [2, 3]];
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => {
        aeroflow(values).join(joiner, comparer).toArray().run(done, fail);
      }), expectation);
    });
  });
});