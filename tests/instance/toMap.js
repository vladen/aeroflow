export default (aeroflow, execute, expect) => describe('aeroflow().toMap', () => {
  it('Is instance toMap', () =>
    execute(
      context => aeroflow.empty.toMap,
      context => expect(context.result).to.be.a('function')));

  describe('aeroflow().toMap()', () => {
    it('Returns instance of Aeroflow', () =>
      execute(
        context => aeroflow.empty.toMap(),
        context => expect(context.result).to.be.an('Aeroflow')));
  });
});

/*
export default (aeroflow, assert) => describe('#toMap', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.toMap));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toMap(), 'Aeroflow'));

    it('Emits "next" notification with map when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toMap(noop, noop, true).run(done, fail)),
        'Map'));

    it('Emits "next" notification with empty map when flow is empty', () =>
      assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow.empty.toMap(noop, noop, true).run(done, fail)),
        'size',
        0));

    it('Emits map containing @values emitted by flow as keys', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap().map(map => Array.from(map.keys())).run(done, fail)),
        values);
    });

    it('Emits map containing @values emitted by flow as values', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap().map(map => Array.from(map.values())).run(done, fail)),
        values);
    });
  });

  describe('(@keySelector:function)', () => {
    it('Emits map containing @keys returned by @keySelector', () => {
      const values = [1, 2, 3], keyTransform = key => key++,
        expectation = values.map(keyTransform);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap(keyTransform).map(map => Array.from(map.keys())).run(done, fail)),
        expectation);
    });

    it('Emits map containing values emitted by flow', () => {
      const values = [1, 2, 3], keyTransform = key => key++;
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap(keyTransform).map(map => Array.from(map.values())).run(done, fail)),
        values);
    });
  });

  describe('(@keySelector:!function)', () => {
    it('Emits map containing single key', () =>
      assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow(1, 2, 3).toMap('test').run(done, fail)),
        'size',
        1));

    it('Emits map containing single key equal to @keySelector', () => {
      const keySelector = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).toMap(keySelector).map(map => map.keys()).flatten().run(done, fail)),
        keySelector);
    });

    it('Emits map containing single latest @value emitted by flow', () => {
      const values = [1, 2, 3], expectation = values[values.length - 1];
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).toMap('test').map(map => map.values()).flatten().run(done, fail)),
        expectation);
    });
  });
});
*/