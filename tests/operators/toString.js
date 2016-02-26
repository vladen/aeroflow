export default (aeroflow, assert) => describe('#toString', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.toString));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toString(), 'Aeroflow'));

    it('Emits "next" notification with string when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toString().run(done, fail)),
        'String'));

    it('Emits "next" notification with empty string when flow is empty', () =>
      assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString().run(done, fail)),
        0));

    it('Emits "next" notification with @string when flow emits single @string', () => {
      const string = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(string).toString().run(done, fail)),
        string);
    });

    it('Emits "next" notification with @number converted to string when flow emits single @number', () => {
      const number = 42, expectation = '' + number;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(number).toString().run(done, fail)),
        expectation);
    });

    it('Emits "next" notification with @strings concatenated via "," separator when flow emits several @strings', () => {
      const strings = ['a', 'b'], expectation = strings.join(',');
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(strings).toString().run(done, fail)),
        expectation);
    });

    it('Emits "next" notification with @numbers converted to strings and concatenated via "," separator when flow emits several @numbers', () => {
      const numbers = [100, 500], expectation = numbers.join(',');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(numbers).toString().run(done, fail)),
        expectation);
    });
  });

  describe('(@seperator:string)', () => {
    it('Emits "next" notification with @strings concatenated via @seperator when flow emits several @strings', () => {
      const separator = ';', strings = ['a', 'b'], expectation = strings.join(separator);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(strings).toString(separator).run(done, fail)),
        expectation);
    });
  });
});
