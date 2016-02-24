export default (aeroflow, assert) => describe('.repeat', () => {
  it('Is static method', () =>
    assert.isFunction(aeroflow.repeat));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.repeat(), 'Aeroflow'));

    it('Emits undefined @values if no params passed', () =>
      assert.eventually.isUndefined(new Promise((done, fail) => 
        aeroflow.repeat().take(1).run(done, fail))));
  });

  describe('(@repeater:function)', () => {
    it('Calls @repeater', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.repeat(done).take(1).run(fail, fail))));

    it('Emits @value returned by @repeater', () => {
      const value = 'a';
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.repeat(value).take(5).every(value).run(done, fail)));
    });

    it('Emits geometric progression recalculating @repeater each time', () => {
      const expectation = [0, 2, 4, 6];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow.repeat(index => index * 2).take(expectation.length).toArray().run(done, fail)),
        expectation);
    });

    it('Passes zero-based @index of iteration to @repeater as first argument', () => {
      const values = [0, 1, 2, 3, 4];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow.repeat(index => index).take(values.length).toArray().run(done, fail)),
        values);
    });
  });

  describe('(@repeater:!function)', () => {
    it('Emits @repeater value if @repeater is not function', () => {
      const value = 'a';
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.repeat(value).take(5).every(value).run(done, fail)));
    });
  });

  //TODO: rethink this tests
  describe('(@repeater, @interval:number)', () => {
    it('Emits value of @repeater each @interval ms', () => {
      const interval = 10, take = 3, actual = [];

      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.repeat(() => actual.push('test'), interval).take(take).count().run(done, fail)),
        take);
    });
  });

  describe('(@repeater, @interval:!number)', () => {
    it('Emits value of @repeater each 1000 ms', () => {
      const take = 1, actualTime = new Date().getSeconds();
      return assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow.repeat(() => new Date().getSeconds(), 'tests').take(take).every(val => val - actualTime >= 1).run(done, fail)));
    });
  });
});