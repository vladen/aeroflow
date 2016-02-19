export default (aeroflow, assert) => describe('#every', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.every));

  describe('()', () => {
    it('Returns instance of Aeroflow', () => 
      assert.typeOf(aeroflow.empty.every(), 'Aeroflow'));

    it('Emits "true" when flow is empty', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow.empty.every().run(done, fail))));

    it('Emits "true" when all @values emitted by flow are truthy', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow(true, 1).every().run(done, fail))));

    it('Emits "false" when at least one @value emitted by flow is falsey', () =>
      assert.eventually.isFalse(new Promise((done, fail) =>
        aeroflow(true, 0).every().run(done, fail))));

    it('Emits single result when flow emits several @values', () => {
      const expectation = 1;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).every().count().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:function)', () => {
    it('Emits "true" when all @values emitted by flow pass @condition test', () => {
      const values = [2, 4], condition = item => item % 2 === 0,
        expectation = values.every(condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });

    it('Emits "false" when at least one @value emitted by flow does not pass @condition test', () => {
      const values = [1, 4], condition = item => item % 2 === 0,
        expectation = values.every(condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:regex)', () => {
    it('Emits "true" when all @values emitted by flow pass @condition test', () => {
      const values = ['a', 'aa'], condition = /a/,
        expectation = values.every(value => condition.test(value));
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });

    it('Emits "false" when at least one @value emitted by flow does not pass @condition test', () => {
      const values = ['a', 'bb'], condition = /a/,
        expectation = values.every(value => condition.test(value));
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:!function!regex)', () => {
    it('Emits "true" when all @values emitted by flow equal @condition', () => {
      const values = [1, 1], condition = 1,
        expectation = values.every(value => value === condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });

    it('Emits "false" when at least one @value emitted by flow does not equal @condition', () => {
      const values = [1, 2], condition = 2,
        expectation = values.every(value => value === condition);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).every(condition).run(done, fail)),
        expectation);
    });
  });
});