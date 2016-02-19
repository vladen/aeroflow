export default (aeroflow, assert) => describe('#some', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.some));

  describe('()', () => {
    it('Returns instance of Aeroflow', () => 
      assert.typeOf(aeroflow.empty.some(), 'Aeroflow'));

    it('Emits "false" when flow is empty', () =>
      assert.eventually.isFalse(new Promise((done, fail) =>
        aeroflow.empty.some().run(done, fail))));

    it('Emits "true" when at least one @value emitted by flow is truthy', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow(true, 0).some().run(done, fail))));

    it('Emits "false" when all @value emitted by flow are falsey', () =>
      assert.eventually.isFalse(new Promise((done, fail) =>
        aeroflow(false, 0).some().run(done, fail))));

    it('Emits single result when flow emits several values', () => {
      const expectation = 1;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).some().count().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:function)', () => {
    it('Emits "true" when at least one @value emitted by flow passes @condition test', () => {
      const values = [2, 1], condition = (item) => item % 2 === 0,
        expectation = values.some(condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });

    it('Emits "false" when no @values emitted by flow pass @condition test', () => {
      const values = [3, 1], condition = (item) => item % 2 === 0,
        expectation = values.some(condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:regex)', () => {
    it('Emits "true" when at least one @value emitted by flow passes @condition test', () => {
      const values = ['a', 'b'], condition = /a/,
        expectation = values.some(value => condition.test(value));
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });

    it('Emits "false" when no @values emitted by flow pass @condition test', () => {
      const values = ['a', 'b'], condition = /c/,
        expectation = values.some(value => condition.test(value));
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:!function!regex)', () => {
    it('Emits "true" when at least one @value emitted by flow equals @condition', () => {
      const values = [1, 2], condition = 1,
        expectation = values.some(value => value === condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });

    it('Emits "false" when no @values emitted by flow equal @condition', () => {
      const values = [1, 2], condition = 3,
        expectation = values.some(value => value === condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).some(condition).run(done, fail)),
        expectation);
    });
  });
});