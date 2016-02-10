var averageOperatorTests = (aeroflow, assert) => describe('Aeroflow#average', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.average);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
    });

    it('emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.average().run(fail, done)));
    });

    it('emits @value from flow emitting single @value', () => {
      const expectation = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).average().run(done, fail)),
        expectation);
    });

    it('emits average from @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = values.reduce((sum, value) => sum + value, 0) / values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).average().run(done, fail)),
        expectation);
    });
  });

});

var countOperatorTests = (aeroflow, assert) => describe('Aeroflow#count', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.count);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
    });

    it('emits 0 from empty flow', () => {
      const expectation = 0;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.count().run(done, fail)),
        expectation);
    });

    it('emits 1 from flow emitting single value', () => {
      const expectation = 1;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(expectation).count().run(done, fail)),
        expectation);
    });

    it('emits number of @values from flow emitting several @values', () => {
      const values = [1, 2, 3], expectation = values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).count().run(done, fail)),
        expectation);
    });
  });

});

var maxOperatorTests = (aeroflow, assert) => describe('Aeroflow#max', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.max);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
    });

    it('emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.max().run(fail, done)));
    });

    it('emits @value from flow emitting single @value', () => {
      const expectation = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).max().run(done, fail)),
        expectation);
    });

    it('emits maximum from @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.max(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).max().run(done, fail)),
        expectation);
    });
  });

});

var minOperatorTests = (aeroflow, assert) => describe('Aeroflow#min', () => {
  it('is instance method', () => {
    assert.isFunction(aeroflow.empty.min);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
    });

    it('emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.min().run(fail, done)));
    });

    it('emits @value from flow emitting single @value', () => {
      const expectation = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).min().run(done, fail)),
        expectation);
    });

    it('emits maximum from @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.min(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).min().run(done, fail)),
        expectation);
    });
  });

});

var toStringOperatorTests = (aeroflow, assert) => describe('Aeroflow#toString', () => {
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

const tests = [
  // factoryTests,
  // staticMethodsTests,
  // instanceTests,
  averageOperatorTests,
  countOperatorTests,
  maxOperatorTests,
  minOperatorTests,
  toStringOperatorTests
];

var aeroflow = (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));

export default aeroflow;