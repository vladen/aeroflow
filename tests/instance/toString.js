export default (aeroflow, assert) => describe('toString', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.toString));

  describe('toString()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toString(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.toString().run(fail, done))));

    it('Emits @string when flow emits single @string', () => {
      const string = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(string).toString().run(done, fail)),
        string);
    });

    it('Emits @number converted to string when flow emits single @number', () => {
      const number = 42, expectation = '' + number;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(number).toString().run(done, fail)),
        expectation);
    });

    it('Emits @strings concatenated via "," separator when flow emits several @strings', () => {
      const strings = ['a', 'b'], expectation = strings.join(',');
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(strings).toString().run(done, fail)),
        expectation);
    });

    it('Emits @numbers converted to strings and concatenated via "," separator when flow emits several @numbers', () => {
      const numbers = [100, 500], expectation = numbers.join(',');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(numbers).toString().run(done, fail)),
        expectation);
    });
  });

  describe('toString(true)', () => {
    it('Emits string when flow empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toString(true).run(done, fail)),
        'String'));

    it('Emits empty string when flow is empty', () =>
      assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString(true).run(done, fail)),
        0));
  });

  describe('toString(@string)', () => {
    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.toString(';').run(fail, done))));

    it('Emits @strings concatenated via @string separator when flow emits several @strings', () => {
      const separator = ';', strings = ['a', 'b'], expectation = strings.join(separator);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(strings).toString(separator).run(done, fail)),
        expectation);
    });
  });

  describe('toString(@string, true)', () => {
    it('Emits empty string when flow is empty', () =>
      assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString(';', true).run(done, fail)),
        0));
  });
});
