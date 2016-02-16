export default (aeroflow, assert) => describe('toMap', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.toMap);
  });

  describe('toMap()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.toMap(), 'Aeroflow');
    });

    it('Emits a map when flow is empty', () => {
      const expectation = 'Map';
      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toMap().run(done, fail)),
        expectation);
    });

    it('Emits empty Map when flow is empty', () => {
      const expectation = 0;
      return assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow.empty.toMap().run(done, fail)),
        'size',
        expectation);
    });

    it('Emits the @values as keys of Map', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap().map(map => Array.from(map.keys())).run(done, fail)),
        values);
    });

    it('Emits the @values as values of Map', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap().map(map => Array.from(map.values())).run(done, fail)),
        values);
    });
  });

  describe('toMap(@keys:function)', () => {
    it('Emits Map with keys provided by @keys', () => {
      const values = [0, 1, 2, 3]
            , keyTransform = (key) => key++
            , expectation = values.map(keyTransform);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap(keyTransform).map(map => Array.from(map.keys())).run(done, fail)),
        expectation);
    });

    it('Emits Map with keys provided by @keys and values from flow', () => {
      const values = [0, 1, 2, 3], keyTransform = (key) => key++;
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap(keyTransform).map(map => Array.from(map.values())).run(done, fail)),
        values);
    });
  });

  describe('toMap(@keys:!function)', () => {
    it('Emits Map with only one element', () => {
      const values = [0, 1, 2, 3], key = 'a', expectation = 1;
      return assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow(values).toMap(key).run(done, fail)),
        'size',
        expectation);
    });

    it('Emits Map with only one key equal to @keys', () => {
      const values = [0, 1, 2, 3], keys = 'a';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(...values).toMap(keys).map(map => Array.from(map.keys())[0]).run(done, fail)),
        keys);
    });

    it('Emits Map with only one key equal to @keys and value last from @values', () => {
      const values = [0, 1, 2, 3], keys = 'a', expectation = values[values.length - 1];
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(...values).toMap(keys).map(map => Array.from(map.values())[0]).run(done, fail)),
        expectation);
    });
  });

  describe('toMap(@keys, @values:function)', () => {

  });

  describe('toMap(@keys, @values:!function)', () => {
    
  });
});