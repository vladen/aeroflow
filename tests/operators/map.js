export default (aeroflow, assert) => describe('#map', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.map));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.map(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.map().run(fail, done))));

    it('Emits same @values when no arguments passed', () => {
      const values = [1, 2];
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).map().toArray().run(done, fail)),
        values);
    });
  });

  describe('(@mapping:function)', () => {
    it('Does not call @mapping when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.map(fail).run(fail, done))));

    it('Calls @mapping when flow emits several values', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).map(done).run(fail, fail))));

    it('Emits error thrown by @mapping', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).map(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Emits @values processed through @mapping', () => {
      const values = [1, 2, 3], mapping = (item) => item * 2, expectation = values.map(mapping);
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).map(mapping).toArray().run(done, fail)),
        expectation);
    });

    it('Passes context data to @mapping as third argument', () => {
      const expectation = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').map((_, __, data) => done(data)).run(fail, fail, expectation)),
        expectation);
    });
  });

  describe('(@mapping:!function)', () => {
    it('Emits @mapping value instead of every value in @values', () => {
      const values = [1, 2], mapping = 'a', expectation = [mapping, mapping];
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).map(mapping).toArray().run(done, fail)),
        expectation);
    });
  });
});