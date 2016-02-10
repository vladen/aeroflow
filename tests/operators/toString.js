export default (aeroflow, assert) => describe('Aeroflow#toString', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.toString);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
    });

    it('emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.toString().run(fail, done)));
    });

    it('emits @string from flow emitting single @string', () => {
      const expectation = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(expectation).toString().run(done, fail)),
        expectation);
    });

    it('emits @number converted to string from flow emitting single @number', () => {
      const number = 42, expectation = '' + number;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(number).toString().run(done, fail)),
        expectation);
    });

    it('emits @strings concatenated via "," separator from flow emitting several @strings', () => {
      const strings = ['a', 'b'], expectation = strings.join(',');
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(strings).toString().run(done, fail)),
        expectation);
    });

    it('emits @numbers converted to strings and concatenated via "," separator from flow emitting several @numbers', () => {
      const numbers = [100, 500], expectation = numbers.join(',');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(numbers).toString().run(done, fail)),
        expectation);
    });
  });

  describe('(true)', () => {
    it('emits empty string from empty flow', () => {
      const expectation = 0;
      return assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString(true).run(done, fail)),
        expectation);
    });
  });

  describe('(@string)', () => {
    it('emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.toString(';').run(fail, done)));
    });

    it('emits @strings concatenated via @string separator from flow emitting several @strings', () => {
      const separator = ';', strings = ['a', 'b'], expectation = strings.join(separator);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(strings).toString(separator).run(done, fail)),
        expectation);
    });
  });

  describe('(@string, true)', () => {
    it('emits empty string from empty flow', () => {
      const delimiter = ';', expectation = 0;
      return assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString(delimiter, true).run(done, fail)),
        expectation);
    });
  });

});
