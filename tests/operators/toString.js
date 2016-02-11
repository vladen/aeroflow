export default (aeroflow, assert) => describe('Aeroflow#toString', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.toString);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
    });

    it('emits nothing when flow is empty', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.toString().run(fail, done)));
    });

    it('emits @string when flow emits single @string', () => {
      const string = 'test', expectation = string;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(string).toString().run(done, fail)),
        expectation);
    });

    it('emits @number converted to string when flow emits single @number', () => {
      const number = 42, expectation = '' + number;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(number).toString().run(done, fail)),
        expectation);
    });

    it('emits @strings concatenated via "," separator when flow emits several @strings', () => {
      const strings = ['a', 'b'], expectation = strings.join(',');
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(strings).toString().run(done, fail)),
        expectation);
    });

    it('emits @numbers converted to strings and concatenated via "," separator when flow emits several @numbers', () => {
      const numbers = [100, 500], expectation = numbers.join(',');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(numbers).toString().run(done, fail)),
        expectation);
    });
  });

  describe('(true)', () => {
    it('emits string when flow empty', () => {
      const expectation = 'String';
      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toString(true).run(done, fail)),
        expectation);
    });
    it('emits empty string when flow is empty', () => {
      const expectation = 0;
      return assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString(true).run(done, fail)),
        expectation);
    });
  });

  describe('(@string)', () => {
    it('emits nothing when flow is empty', () => {
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.toString(';').run(fail, done)));
    });

    it('emits @strings concatenated via @string separator when flow emits several @strings', () => {
      const separator = ';', strings = ['a', 'b'], expectation = strings.join(separator);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(strings).toString(separator).run(done, fail)),
        expectation);
    });
  });

  describe('(@string, true)', () => {
    it('emits empty string when flow is empty', () => {
      const delimiter = ';', expectation = 0;
      return assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString(delimiter, true).run(done, fail)),
        expectation);
    });
  });
});
