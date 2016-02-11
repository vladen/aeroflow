var averageTests = (aeroflow, assert) => describe('average', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.average);
  });

  describe('average()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
    });

    it('Emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.average().run(fail, done)));
    });

    it('Emits @value from flow emitting single numeric @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).average().run(done, fail)),
        expectation);
    });

    it('Emits NaN from flow emitting single non-numeric @value', () => {
      const value = 'test';
      return assert.eventually.isNaN(new Promise((done, fail) =>
        aeroflow(value).average().run(done, fail)));
    });

    it('Emits average from @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = values.reduce((sum, value) => sum + value, 0) / values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).average().run(done, fail)),
        expectation);
    });

    it('Emits NaN from @values from flow emitting several non-numeric @values', () => {
      const values = ['a', 'b'];
      return assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow(values).average().run(done, fail)));
    });
  });

});

var catchTests = (aeroflow, assert) => describe('catch', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.catch));

  describe('catch()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.catch(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch().run(fail, done))));

    it('Supresses error emitted by flow', () =>
      assert.eventually.isBoolean(new Promise((done, fail) => 
        aeroflow(new Error('test')).catch().run(fail, done))));
  });

  describe('catch(@alternative:function)', () => {
    it('Does not call @alternative when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch(fail).run(fail, done))));

    it('Does not call @alternative when flow does not emit error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1).catch(fail).run(done, fail))));

    it('Calls @alternative when flow emits error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('tests')).catch(done).run(fail, fail))));

    it('Emits value returned by @alternative when flow emits error', () => {
      const alternative = 'caught';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(() => alternative).run(done, fail)),
        alternative);
    });
  });

  describe('catch(@alternative:!function)', () => {
    it('Emits @alternative value when flow emits error', () => {
      const alternative = 'caught';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(alternative).run(done, fail)),
        alternative);
    });
  });
});

var countTests = (aeroflow, assert) => describe('count', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.count);
  });

  describe('count()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
    });

    it('Emits 0 from empty flow', () => {
      const expectation = 0;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.count().run(done, fail)),
        expectation);
    });

    it('Emits 1 from flow emitting single value', () => {
      const expectation = 1;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(expectation).count().run(done, fail)),
        expectation);
    });

    it('Emits number of @values from flow emitting several @values', () => {
      const values = [1, 2, 3], expectation = values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).count().run(done, fail)),
        expectation);
    });
  });
});

var filterTests = (aeroflow, assert) => describe('filter', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.filter));

  describe('filter()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.filter(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.filter().run(fail, done))));

    it('Emits only truthy values', () => {
      const values = [false, true, 0, 1, undefined, null, 'test'],
        expectation = values.filter(value => value);
      assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).filter().toArray().run(done, fail)),
        expectation);
    });
  });

  describe('filter(@condition:function)', () => {
    it('Does not call @condition when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.filter(fail).run(fail, done))));

    it('Calls @condition when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').filter(done).run(fail, fail))));

    it('Passes value emitted by flow to @condition as first argument', () => {
      const value = 'test';
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).filter(done).run(fail, fail)),
        value);
    });

    it('Passes zero-based index of iteration to @condition as second argument', () => {
      const values = [1, 2, 3, 4], expectation = values.length - 1;
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(values).filter((_, index) => {
          if (index === expectation) done();
        }).run(fail, fail)));
    });

    it('Passes context data to @condition as third argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').filter((_, __, data) => done(data)).run(fail, fail, data)),
        data);
    });

    it('Emits only values passing @condition test', () => {
      const values = [0, 1, 2, 3], condition = value => value > 1,
        expectation = values.filter(condition);
      assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('filter(@condition:regex)', () => {
    it('Emits only values passing @condition test', () => {
      const values = ['a', 'b', 'aa', 'bb'], condition = /a/,
        expectation = values.filter(value => condition.test(value));
      assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('filter(@condition:!function!regex)', () => {
    it('Emits only values equal to @condition', () => {
      const values = [1, 2, 3], condition = 2,
        expectation = values.filter(value => value === condition);
      assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });
});

var maxTests = (aeroflow, assert) => describe('max', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.max);
  });

  describe('max()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
    });

    it('Emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.max().run(fail, done)));
    });

    it('Emits @value from flow emitting single numeric @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).max().run(done, fail)),
        expectation);
    });

    it('Emits @value from flow emitting single non-numeric @value', () => {
      const value = 'test', expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).max().run(done, fail)),
        expectation);
    });

    it('Emits maximum of @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.max(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).max().run(done, fail)),
        expectation);
    });

    it('Emits maximum of @values from flow emitting several non-numeric @values', () => {
      const values = ['a', 'c', 'b'], expectation = values.reduce((max, value) => value > max ? value : max);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).max().run(done, fail)),
        expectation);
    });
  });
});

var minTests = (aeroflow, assert) => describe('min', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.min);
  });

  describe('min()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
    });

    it('Emits nothing from empty flow', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.min().run(fail, done)));
    });

    it('Emits @value from flow emitting single @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).min().run(done, fail)),
        expectation);
    });

    it('Emits @value from flow emitting single non-numeric @value', () => {
      const value = 'test', expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).min().run(done, fail)),
        expectation);
    });

    it('Emits minimum of @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.min(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).min().run(done, fail)),
        expectation);
    });

    it('Emits minimum of @values from flow emitting several non-numeric @values', () => {
      const values = ['a', 'c', 'b'], expectation = values.reduce((min, value) => value < min ? value : min);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).min().run(done, fail)),
        expectation);
    });
  });
});

var reduceTests = (aeroflow, assert) => describe('reduce', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.reduce));

  describe('reduce()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce().run(fail, done))));

    it('Emits nothing when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow('test').reduce().run(fail, done))));
  });

  describe('reduce(@reducer:function)', () => {
    it('Does not call @reducer when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce(fail).run(fail, done))));

    it('Does not call @reducer when flow emits single value', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1).reduce(fail).run(done, fail))));

    it('calls @reducer when flow emits serveral values', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(done).run(fail, fail))));

    it('Emits error thrown by @reducer', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Emits value emitted by flow when flow emits single value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).reduce(() => 'test').run(done, fail)),
        value);
    });

    it('Emits value returned by @reducer when flow emits several values', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).reduce(() => value).run(done, fail)),
        value);
    });

    it('Passes first and second values emitted by flow to @reducer as first and second arguments on first iteration', () => {
      const values = [1, 2];
      return assert.eventually.includeMembers(new Promise((done, fail) =>
        aeroflow(values).reduce((...args) => done(args)).run(fail, fail)),
        values);
    });

    it('Passes zero-based index of iteration to @reducer as third argument', () => {
      const values = [1, 2, 3, 4], expectation = values.length - 2;
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(values).reduce((_, __, index) => {
          if (index === expectation) done();
        }).run(fail, fail)));
    });

    it('Passes context data to @reducer as forth argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce((_, __, ___, data) => done(data)).run(fail, fail, data)),
        data);
    });
  });

  describe('reduce(@reducer:function, @seed:any)', () => {
    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce(() => {}, 42).run(fail, done))));

    it('Passes @seed to @reducer as first argument on first iteration', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').reduce(done, seed).run(fail, fail)),
        seed);
    });
  });

  describe('reduce(@reducer:function, @seed:any, true)', () => {
    it('Emits @seed when flow is empty', () => {
      const seed = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.reduce(() => {}, seed, true).run(done, fail)),
        seed);
    });
  });

  describe('reduce(@seed:!function)', () => {
    it('Emits @seed when flow is empty', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.reduce(seed).run(done, fail)),
        seed);
    });

    it('Emits @seed when flow is not empty', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(1, 2).reduce(seed).run(done, fail)),
        seed);
    });
  });
});

var toArrayTests = (aeroflow, assert) => describe('toArray', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.toArray);
  });

  describe('toArray()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow');
    });

    it('Emits nothing when flow is empty', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.toArray().run(fail, done)));
    });

    it('Emits array of @values when flow emits several @values', () => {
      const values = [1, 2, 1, 3, 2, 3], expectation = values;
      return assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('toArray(true)', () => {
    it('Emits an array when flow is empty', () => {
      const expectation = 'Array';
      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        expectation);
    });
    it('Emits empty array from flow is empty', () => {
      const expectation = 0;
      return assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        expectation);
    });
  });
});

var toSetTests = (aeroflow, assert) => describe('toSet', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.toSet);
  });

  describe('toSet()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow');
    });

    it('Emits nothing when flow is empty', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.toSet().run(fail, done)));
    });

    it('Emits set of unique @values when flow emits several @values', () => {
      const values = [1, 2, 1, 3, 2, 3], expectation = Array.from(new Set(values));
      return assert.eventually.includeMembers(new Promise((done, fail) => 
        aeroflow(values).toSet().map(set => Array.from(set)).run(done, fail)),
        expectation);
    });
  });

  describe('toSet(true)', () => {
    it('Emits a set when flow is empty', () => {
      const expectation = 'Set';
      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        expectation);
    });
    it('Emits empty set when flow is empty', () => {
      const expectation = 0;
      return assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        'size',
        expectation);
    });
  });
});

var toStringTests = (aeroflow, assert) => describe('toString', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.toString);
  });

  describe('toString()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
    });

    it('Emits nothing when flow is empty', () => {
      return assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.toString().run(fail, done)));
    });

    it('Emits @string when flow emits single @string', () => {
      const string = 'test', expectation = string;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(string).toString().run(done, fail)),
        expectation);
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
    it('Emits string when flow empty', () => {
      const expectation = 'String';
      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toString(true).run(done, fail)),
        expectation);
    });
    it('Emits empty string when flow is empty', () => {
      const expectation = 0;
      return assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString(true).run(done, fail)),
        expectation);
    });
  });

  describe('toString(@string)', () => {
    it('Emits nothing when flow is empty', () => {
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.toString(';').run(fail, done)));
    });

    it('Emits @strings concatenated via @string separator when flow emits several @strings', () => {
      const separator = ';', strings = ['a', 'b'], expectation = strings.join(separator);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(strings).toString(separator).run(done, fail)),
        expectation);
    });
  });

  describe('toString(@string, true)', () => {
    it('Emits empty string when flow is empty', () => {
      const delimiter = ';', expectation = 0;
      return assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toString(delimiter, true).run(done, fail)),
        expectation);
    });
  });
});

var operatorsTests = [
  averageTests,
  catchTests,
  countTests,
  filterTests,
  maxTests,
  minTests,
  reduceTests,
  toArrayTests,
  toSetTests,
  toStringTests
];

var expandTests = (aeroflow, assert) => describe('Aeroflow#expand', () => {
  it('is static method', () => {
    assert.isFunction(aeroflow.expand);
  });

  describe('()', () => {
    it('returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.expand(), 'Aeroflow');
    });
  });

  describe('(@function)', () => {
    
  });

  describe('(@!function)', () => {
    
  });
});

var generatorsTests = [
  expandTests
];

const tests = [
  ...operatorsTests,
  ...generatorsTests
];

var aeroflow = (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));

export default aeroflow;