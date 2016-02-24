var emptyGeneratorTests = (aeroflow, assert) => describe('.empty', () => {
  it('Is static property', () =>
    assert.isDefined(aeroflow.empty));

  it('Returns instance of Aeroflow', () =>
    assert.typeOf(aeroflow.empty, 'Aeroflow'));

  it('Returns instance of Aeroflow emitting "done" notification with "true"', () =>
    assert.eventually.isTrue(new Promise((done, fail) =>
      aeroflow.empty.run(fail, done))));

  it('Returns instance of Aeroflow not emitting "next" notification', () =>
    assert.isFulfilled(new Promise((done, fail) =>
      aeroflow.empty.run(fail, done))));
});

const noop$1 = () => {};

var expandGeneratorTests = (aeroflow, assert) => describe('.expand', () => {
  it('Is static method', () =>
    assert.isFunction(aeroflow.expand));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.expand(), 'Aeroflow'));
  });

  describe('(@expander:function)', () => {
    it('Calls @expander', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.expand(done).take(1).run(fail, fail))));

    it('Passes undefined to @expander as first argument when no seed is specified', () =>
      assert.eventually.isUndefined(new Promise((done, fail) =>
        aeroflow.expand(done).take(1).run(fail, fail))));

    it('Passes value returned by @expander to @expander as first argument on subsequent iteration', () => {
      const expectation = {};
      let iteration = 0;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow
          .expand(value => iteration++
              ? done(value)
              : expectation)
          .take(2)
          .run(noop$1, fail)),
        expectation);
    });

    it('Passes zero-based index of iteration to @expander as second argument', () => {
      const indices = [], expectation = [0, 1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow
          .expand((_, index) => indices.push(index))
          .take(expectation.length)
          .run(noop$1, () => done(indices))),
        expectation);
    });

    it('Passes context data to @expander as third argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.expand((_, __, context) => done(context)).take(1).run(fail, fail, data)),
        data);
    });

    it('Emits "next" notification with value returned by @expander', () => {
      const value = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.expand(() => value).take(1).run(done, fail)),
        value);
    });
  });

  describe('(@expander:function, @seed:any)', () => {
    it('Passes @seed to @expander as first argument', () => {
      const seed = 42, expectation = seed;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.expand(done, seed).take(1).run(fail, fail)),
        expectation);
    });
  });
});

var justGeneratorTests = (aeroflow, assert) => describe('.just', () => {
  it('Is static method', () =>
    assert.isFunction(aeroflow.just));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.just(), 'Aeroflow'));

    it('Returns instance of Aeroflow emitting "next" notification with undefined', () => {
      const expectation = undefined;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just().run(done, fail)),
        expectation);
    });
  });

  describe('(@value:array)', () => {
    it('Returns instance of Aeroflow emitting "next" notification with @value', () => {
      const array = [1, 2, 3], expectation = array;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just(array).run(done, fail)),
        expectation);
    });
  });

  describe('(@value:iterable)', () => {
    it('Returns instance of Aeroflow emitting "next" notification with @value', () => {
      const iterable = new Set([1, 2, 3]), expectation = iterable;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.just(iterable).run(done, fail)),
        expectation);
    });
  });
});

var randomGeneratorTests = (aeroflow, assert) => describe('.random', () => {
  it('Is static method', () =>
    assert.isFunction(aeroflow.random));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.random(), 'Aeroflow'));

    it('Emits random values decimals within 0 and 1', () => {
      const count = 10, expectation = (value) => !Number.isInteger(value) && value >= 0 && value <= 1;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random().take(count).every(expectation).run(done, fail)));
    });
  });

  describe('(@start:number)', () => {
    it('Emits random demical values less than @start if @start', () => {
      const start = 2, count = 10, expectation = (value) => !Number.isInteger(value) && value <= start;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start).take(count).every(expectation).run(done, fail)));
    });
  });

  describe('(@start:!number)', () => {
    it('Emits random decimals values within 0 and 1', () => {
      const start = 'test', count = 10, 
        expectation = (value) => !Number.isInteger(value) && value >= 0 && value <= 1;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start).take(count).every(expectation).run(done, fail)));
    });
  });

  describe('(@start, @end:number)', () => {
    it('Emits random integer values within @start and @end if @start and @end is integer', () => {
      const start = 10, end = 20, count = 10, 
        expectation = (value) => Number.isInteger(value) && value >= start && value <= end;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start, end).take(count).every(expectation).run(done, fail)));
    });

    it('Emits random demical values within @start and @end if @start or @end is demical', () => {
      const start = 1, end = 2.3, count = 10, 
        expectation = (value) => !Number.isInteger(value) && value >= start && value <= end;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start, end).take(count).every(expectation).run(done, fail)));
    });
  });

  describe('(@start, @end:!number)', () => {
    it('Emits random demical values less than @start if @start', () => {
      const start = 2, end = 'test', count = 10,
        expectation = (value) => !Number.isInteger(value) && value <= start;
      return assert.eventually.isTrue(new Promise((done, fail) => 
        aeroflow.random(start, end).take(count).every(expectation).run(done, fail)));
    });
  });
});

var repeatGeneratorTests = (aeroflow, assert) => describe('.repeat', () => {
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

var averageOperatorTests = (aeroflow, assert) => describe('#average', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.average));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.average(), 'Aeroflow'));

    it('Emits "done" notification only when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.average().run(fail, done))));

    it('Emits "next" notification parameterized with @value when flow emits single numeric @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).average().run(done, fail)),
        value);
    });

    it('Emits "next" notification parameterized with NaN when flow emits single not numeric @value', () =>
      assert.eventually.isNaN(new Promise((done, fail) =>
        aeroflow('test').average().run(done, fail))));

    it('Emits "next" notification parameterized with average of @values when flow emits several numeric @values', () => {
      const values = [1, 3, 2], average = values.reduce((sum, value) => sum + value, 0) / values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).average().run(done, fail)),
        average);
    });

    it('Emits "next" notification parameterized with NaN when flow emits several not numeric @values', () =>
      assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow('a', 'b').average().run(done, fail))));
  });
});

var catchOperatorTests = (aeroflow, assert) => describe('#catch', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.catch));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.catch(), 'Aeroflow'));

    it('Emits "done" notification only when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch().run(fail, done))));

    it('Supresses error emitted by flow', () =>
      assert.eventually.isBoolean(new Promise((done, fail) => 
        aeroflow(new Error('test')).catch().run(fail, done))));
  });

  describe('(@alternate:function)', () => {
    it('Does not call @alternative when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.catch(fail).run(fail, done))));

    it('Does not call @alternate when flow does not emit error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').catch(fail).run(done, fail))));

    it('Calls @alternate when flow emits error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(done).run(fail, fail))));

    it('Emits "next" notification with value returned by @alternate when flow emits error', () => {
      const alternate = 'alternate';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(() => alternate).run(done, fail)),
        alternate);
    });
  });

  describe('(@alternate:!function)', () => {
    it('Emits "next" notification with @alternate value instead of error emitted by flow', () => {
      const alternate = 'alternate';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(new Error('test')).catch(alternate).run(done, fail)),
        alternate);
    });
  });
});

var coalesceOperatorTests = (aeroflow, assert) => describe('#coalesce', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.coalesce));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.coalesce(), 'Aeroflow'));

    it('Emits "done" notification only when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.coalesce().run(fail, done))));
  });

  describe('(@alternate:function)', () => {
    it('Does not call @alternate when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').coalesce(fail).run(done, fail))));

    it('Does not call @alternate when flow emits error', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('test')).coalesce(fail).run(fail, done))));

    it('Emits "next" notification with value returned by @alternate when flow is empty', () => {
      const alternate = 'alternate';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.empty.coalesce(() => alternate).run(done, fail)),
        alternate);
    });
  });

  describe('(@alternate:!function)', () => {
    it('Emits "next" notification with @alternate value when flow is empty', () => {
      const alternate = 'alternate';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.empty.coalesce(alternate).run(done, fail)),
        alternate);
    });
  });
});

var countOperatorTests = (aeroflow, assert) => describe('#count', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.count));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.count(), 'Aeroflow'));

    it('Emits 0 when flow is empty', () =>
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.empty.count().run(done, fail)),
        0));

    it('Emits 1 when flow emits single @value', () => {
      const expectation = 1;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(expectation).count().run(done, fail)),
        expectation);
    });

    it('Emits number of @values emitted by flow when flow emits several @values', () => {
      const values = [1, 2, 3], expectation = values.length;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).count().run(done, fail)),
        expectation);
    });
  });
});

var distinctOperatorTests = (aeroflow, assert) => describe('#distinct', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.distinct));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.distinct(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.distinct().run(fail, done))));

    it('Emits unique of @values when flow emits several numeric @values', () => {
      const values = [1, 1, 2, 2, 3], expectation = Array.from(new Set(values));
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).distinct().toArray().run(done, fail)),
        expectation);
    });

    it('Emits unique of @values when flow emits several string @values', () => {
      const values = ['a', 'a', 'b', 'b', 'c'], expectation = Array.from(new Set(values));
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).distinct().toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(true)', () => {
    it('Emits first @value of each sub-sequence of identical @values (distinct until changed)', () => {
      const values = [1, 1, 2, 2, 1, 1], expectation = [1, 2, 1];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).distinct(true).toArray().run(done, fail)),
        expectation);
    });
  });
});

var everyOperatorTests = (aeroflow, assert) => describe('#every', () => {
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

var filterOperatorTests = (aeroflow, assert) => describe('#filter', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.filter));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.filter(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.filter().run(fail, done))));

    it('Emits only truthy of @values emitted by flow', () => {
      const values = [false, true, 0, 1, undefined, null, 'test'],
        expectation = values.filter(value => value);
      assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).filter().toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:function)', () => {
    it('Does not call @condition when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.filter(fail).run(fail, done))));

    it('Calls @condition when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').filter(done).run(fail, fail))));

    it('Passes @value emitted by flow to @condition as first argument', () => {
      const value = 'test';
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).filter(done).run(fail, fail)),
        value);
    });

    it('Passes zero-based @index of iteration to @condition as second argument', () => {
      const values = [1, 2, 3, 4], expectation = values.length - 1;
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(values).filter((_, index) => {
          if (index === expectation) done();
        }).run(fail, fail)));
    });

    it('Passes context @data to @condition as third argument', () => {
      const expectation = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').filter((_, __, data) => done(data)).run(fail, fail, expectation)),
        expectation);
    });

    it('Emits only @values emitted by flow and passing @condition test', () => {
      const values = [0, 1, 2, 3], condition = value => value > 1,
        expectation = values.filter(condition);
      assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:regex)', () => {
    it('Emits only @values emitted by flow and passing @condition test', () => {
      const values = ['a', 'b', 'aa', 'bb'], condition = /a/,
        expectation = values.filter(value => condition.test(value));
      assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:!function!regex)', () => {
    it('Emits only @values emitted by flow and equal to @condition', () => {
      const values = [1, 2, 3], condition = 2,
        expectation = values.filter(value => value === condition);
      assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).filter(condition).toArray().run(done, fail)),
        expectation);
    });
  });
});

var groupOperatorTests = (aeroflow, assert) => describe('#group', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.group));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.group(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.group().run(fail, done))));
  });

  describe('(@selector:function)', () => {
    it('Does not call @selector when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.group(fail).run(fail, done))));

    it('Calls @selector when flow emits several values', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).group(done).run(fail, fail))));

    it('Emits error thrown by @selector', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).group(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Passes context data to @selector as third argument', () => {
      const expectation = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').group((_, __, data) => done(data)).run(fail, fail, expectation)),
        expectation);
    });

    it('Passes zero-based @index of iteration to @condition as second argument', () => {
      const values = [1, 2, 3, 4], expectation = values.length - 1;
      return assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(values).group((_, index) => {
          if (index === expectation) done();
        }).run(fail, fail)));
    });

    it('Emits @values divided into groups by result of @selector', () => {
      const values = [-1, 6, -3, 4],
        expectation = [[-1, -3], [6, 4]];

      return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
        aeroflow(values).group(value => value >= 0).map(group => group[1]).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values divided into named groups by result of @selector', () => {
      const values = [-1, 6, -3, 4], positive = 'positive', negative = 'positive';

      return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
        aeroflow(values).group(value => value >= 0 ? positive : negative).map(group => group[0]).toArray().run(done, fail)),
        [positive, negative]);
    });
  });

  describe('(@selectors:array)', () => {
    it('Emits nested named groups which divide @values by first predicate from @selectors', () => {
      const values = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
        expectation = [values[0].name, values[1].name],
        selectors = [(value) => value.name, (value) => value.sex];

      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).group(...selectors).map(group => group[0]).toArray().run(done, fail)),
        expectation);
    });

    it('Use maps to contain nested groups which divided @values by @selectors', () => {
      const values = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
        selectors = [(value) => value.name, (value) => value.sex];

      return assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow(values).group(...selectors).toArray().map(group => group[0][1]).run(done, fail)),
        'Map');
    });

    it('Emits nested named groups which divide @values by second predicate from @selectors', () => {
       const values = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
         expectation = [[values[0].sex], [values[1].sex]],
       selectors = [(value) => value.name, (value) => value.sex];

      return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
        aeroflow(values).group(...selectors).map(group => Array.from(group[1].keys())).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values on the root of nested groups', () => {
      const values = [{name: 'test1', sex: 'female'}, {name: 'test2', sex: 'male'}],
         selectors = [(value) => value.name, (value) => value.sex];

      return assert.eventually.sameDeepMembers(new Promise((done, fail) =>
        aeroflow(values).group(...selectors).map(group => Array.from(group[1].values())[0][0]).toArray().run(done, fail)),
        values);
    });
  });
});

var joinOperatorTests = (aeroflow, assert) => describe('#join', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.join));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.join(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.join().run(fail, done))));

    it('Emits @values from flow concatenated with undefined when flow is not empty', () => {
      const values = [1, 2], expectation = [[1, undefined], [2, undefined]];
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => {
        aeroflow(values).join().toArray().run(done, fail);
      }), expectation);
    });
  });

  describe('(@joiner:any)', () => {
    it('Emits nested arrays with @values concatenated with @joiner values by one to one', () => {
      const values = [1, 2], joiner = [3, 4], expectation = [[1, 3], [1, 4], [2, 3], [2, 4]];
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => {
        aeroflow(values).join(joiner).toArray().run(done, fail);
      }), expectation);
    });
  });

  describe('(@joiner:any, @comparer:function)', () => {
    it('Emits nested arrays with @values concatenated with @joiner through @comparer function', () => {
      const values = [{a: 'test', b: 'tests'}], joiner = [{a: 'test', c: 'tests3'}],
        comparer = (left, right) => left.a === right.a, expectation = [...values, ...joiner];
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => {
        aeroflow(values).join(joiner, comparer).toArray().map(res => res[0]).run(done, fail);
      }), expectation);
    });
  });

  describe('(@joiner:any, @comparer:!function)', () => {
    it('Emits nested arrays with @values concatenated with @joiner values by one to one ignored @comparer', () => {
      const values = [1, 2], joiner = 3, comparer ='test', expectation = [[1, 3], [2, 3]];
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => {
        aeroflow(values).join(joiner, comparer).toArray().run(done, fail);
      }), expectation);
    });
  });
});

var mapOperatorTests = (aeroflow, assert) => describe('#map', () => {
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

var maxOperatorTests = (aeroflow, assert) => describe('#max', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.max);
  });

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.max(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () => 
       assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.max().run(fail, done))));

    it('Emits @value when flow emits single numeric @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).max().run(done, fail)),
        value);
    });

    it('Emits @value when flow emits single string @value', () => {
      const value = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).max().run(done, fail)),
        value);
    });

    it('Emits maximum of @values when flow emits several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.max(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).max().run(done, fail)),
        expectation);
    });

    it('Emits maximum of @values when flow emits several string @values', () => {
      const values = ['a', 'c', 'b'],
        expectation = values.reduce((max, value) => value > max ? value : max);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).max().run(done, fail)),
        expectation);
    });
  });
});

var meanOperatorTests = (aeroflow, assert) => describe('#mean', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.mean));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.mean(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.mean().run(fail, done))));

    it('Emits @value from flow emitting single numeric @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).mean().run(done, fail)),
        expectation);
    });

    it('Emits mean value of @values from flow emitting several numeric @values', () => {
      const values = [1, 3, 4, 5], expectation = 4;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).mean().run(done, fail)),
        expectation);
    });

    it('Emits @value from flow emitting single non-numeric @value', () => {
      const value = 'a', expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).mean().run(done, fail)),
        expectation);
    });

    it('Emits mean value of @values from flow emitting several numeric @values', () => {
      const values = ['a', 'd', 'f', 'm'], expectation = 'f';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).mean().run(done, fail)),
        expectation);
    });
  });
});

var minOperatorTests = (aeroflow, assert) => describe('#min', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.min));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.min(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow.empty.min().run(fail, done))));

    it('Emits @value when flow emits single numeric @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).min().run(done, fail)),
        value);
    });

    it('Emits @value when flow emits single string @value', () => {
      const value = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).min().run(done, fail)),
        value);
    });

    it('Emits minimum of @values when flow emits several numeric @values', () => {
      const values = [1, 3, 2], expectation = Math.min(...values);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).min().run(done, fail)),
        expectation);
    });

    it('Emits minimum of @values when flow emits several string @values', () => {
      const values = ['a', 'c', 'b'], expectation = values.reduce((min, value) => value < min ? value : min);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).min().run(done, fail)),
        expectation);
    });
  });
});

var reduceOperatorTests = (aeroflow, assert) => describe('#reduce', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.reduce));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce().run(fail, done))));

    it('Emits first value emitted by flow when flow is not empty', () => {
      const values = [1, 2];
      assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).reduce().run(done, fail)),
        values[0]);
    });
  });

  describe('(@reducer:function)', () => {
    it('Does not call @reducer when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reduce(fail).run(fail, done))));

    it('Does not call @reducer when flow emits single @value', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1).reduce(fail).run(done, fail))));

    it('Calls @reducer when flow emits several v@alues', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(done).run(fail, fail))));

    it('Emits error thrown by @reducer', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Emits @value emitted by flow when flow emits single @value', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).reduce(() => 'test').run(done, fail)),
        value);
    });

    it('Emits @value returned by @reducer when flow emits several @values', () => {
      const value = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).reduce(() => value).run(done, fail)),
        value);
    });

    it('Passes first and second @values emitted by flow to @reducer as first and second arguments on first iteration', () => {
      const values = [1, 2];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).reduce((first, second) => done([first, second])).run(fail, fail)),
        values);
    });

    it('Passes zero-based @index of iteration to @reducer as third argument', () =>
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce((_, __, index) => done(index)).run(fail, fail)),
        0));

    it('Passes context @data to @reducer as forth argument', () => {
      const expectation = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).reduce((_, __, ___, data) => done(data)).run(fail, fail, expectation)),
        expectation);
    });
  });

  describe('(@reducer:function, @seed)', () => {
    it('Emits @seed value when flow is empty', () => {
      const seed = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow.empty.reduce(() => {}, seed).run(done, fail)),
        seed);
    });

    it('Passes @seed to @reducer as first argument on first iteration', () => {
      const seed = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').reduce(done, seed).run(fail, fail)),
        seed);
    });
  });

  describe('(@reducer:!function)', () => {
    it('Emits @reducer value when flow is empty', () => {
      const reducer = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow.empty.reduce(reducer).run(done, fail)),
        reducer);
    });

    it('Emits @reducer value when flow is not empty', () => {
      const reducer = 42;
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(1, 2).reduce(reducer).run(done, fail)),
        reducer);
    });
  });
});

var reverseOperatorTests = (aeroflow, assert) => describe('#reverse', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.reverse));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.reverse(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.reverse().run(fail, done))));

    it('Emits @value from flow emitting single numeric @value', () => {
      const value = 42, expectation = value;
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(value).reverse().run(done, fail)),
        expectation);
    });

    it('Emits reversed @values from flow emitting @values', () => {
      const values = [1, 3], expectation = values.reverse();
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).reverse().toArray().run(done, fail)),
        expectation);
    });
  });
});

var skipOperatorTests = (aeroflow, assert) => describe('#skip', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.skip));

  describe('()', () => {
    it('Returns instance of Aeroflow', () => 
      assert.typeOf(aeroflow.empty.skip(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.skip().run(fail, done))));

    it('Emits nothing when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow('test').skip().run(fail, done))));
  });

  describe('(@condition:function)', () => {
    it('Emits @values until they not satisfies @condition ', () => {
      const values = [2, 4, 6, 3, 7], condition = (value) => value %2 === 0, expectation = [3, 7];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).skip(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:number)', () => {
    it('Emits @values beginning with @condition position from the start', () => {
      const values = [1, 2, 3], skip = 2, expectation = values.slice(skip);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).skip(skip).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values without @condition number of @values from the end', () => {
      const values = [1, 2, 3], skip = 2, expectation = values.slice(0, values.length - skip);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).skip(-skip).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:!function!number)', () => {
    it('Emits nothing when @condition is non-numeric', () => 
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow('test').skip('test').run(fail, done))));
  });
});

var sliceOperatorTests = (aeroflow, assert) => describe('#slice', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.slice);
  });

  describe('()', () => {
    it('Returns instance of Aeroflow', () => {
      assert.typeOf(aeroflow.empty.slice(), 'Aeroflow');
    });

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.slice().run(fail, done))));

    it('Emits @values when flow emits several @values', () => {
      const values = [1, 2];
      assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice().toArray().run(done, fail)),
        values);
    });
  });

  describe('(@start:number)', () => {
    it('Emits @start number of @values from the start', () => {
      const values = [1, 2, 3], slice = 2, expectation = values.slice(slice);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(slice).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @start number of @values from the end', () => {
      const values = [1, 2, 3], slice = -2, expectation = values.slice(slice);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(slice).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@start:!number)', () => {
    it('Emits @values when passed non-numerical @start', () => {
      const values = [1, 2];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice('test').toArray().run(done, fail)),
        values);
    });
  });

  describe('(@start:number, @end:number)', () => {
    it('Emits @values within @start and @end indexes from the start', () => {
      const values = [1, 2, 3], slice = [1, 2], expectation = values.slice(...slice);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(...slice).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values within @start and @end indexes from the end', () => {
      const values = [1, 2, 3], slice = [-2, -1], expectation = values.slice(...slice);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(...slice).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@start:number, @end:!number)', () => {
    it('Emits @values from @start index till the end', () => {
      const values = [1, 2], start = 1, expectation = values.slice(start);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).slice(start, 'test').toArray().run(done, fail)),
        expectation);
    });
  });
});

var someOperatorTests = (aeroflow, assert) => describe('#some', () => {
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

var sortOperatorTests = (aeroflow, assert) => describe('#sort', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.sort));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.sort(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.sort().run(fail, done))));

    it('Emits @values in ascending order when flow is not empty', () => {
      const values = [6, 5, 3, 8], expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort().toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparer:string)', () => {
    it('Emits @values in descending order when @comparer equal to desc', () => {
      const values = ['a', 'c', 'f'], sort = 'desc', expectation = values.sort().reverse();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values in descending order when @comparer not equal to desc', () => {
      const values = ['a', 'c', 'f'], sort = 'asc', expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparer:boolean)', () => {
    it('Emits @values in descending order when false passed', () => {
      const values = [2, 7, 4], sort = false, expectation = values.sort().reverse();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values in descending order when true passed', () => {
      const values = [4, 8, 1], sort = true, expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparer:number)', () => {
    it('Emits @values in descending order when @comparer less than 0', () => {
      const values = [2, 7, 4], sort = -1, expectation = values.sort().reverse();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @values in descending order when @comparer greatest or equal to 0', () => {
      const values = [4, 8, 1], sort = 1, expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(sort).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparer:function)', () => {
    it('Emits @values sorted according by result of @comparer', () => {
      const values = [4, 8, 1], comparer = (a, b) => a - b, expectation = values.sort();
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).sort(comparer).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@comparers:array)', () => {
    it('Emits @values sorted by applying @comparers in order', () => {
      const values = [{ prop: 'test1'}, { prop: 'test2'}], comparers = [(value) => value.prop, 'desc'],
        expectation = values.sort((value) => value.prop).reverse();
      return assert.eventually.sameDeepMembers(new Promise((done, fail) => 
        aeroflow(values).sort(comparers).toArray().run(done, fail)),
        expectation);
    });
  });
});

var sumOperatorTests = (aeroflow, assert) => describe('#sum', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.sum));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.sum(), 'Aeroflow'));

    it('Emits nothing ("done" event only) when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.sum().run(fail, done))));

    it('Emits total sum of values when flow emits several numeric values', () => {
      const values = [1, 3, 2], expectation = values.reduce((prev, curr) => prev + curr, 0);
      return assert.eventually.strictEqual(new Promise((done, fail) => 
        aeroflow(values).sum().run(done, fail)),
        expectation);
    });

    it('Emits NaN when flow emits single not numeric value', () =>
      assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow('q').sum().run(done, fail))));

    it('Emits NaN when flow emits several not numeric values', () =>
      assert.eventually.isNaN(new Promise((done, fail) => 
        aeroflow('q', 'b').sum().run(done, fail))));
  });
});

var takeOperatorTests = (aeroflow, assert) => describe('#take', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.take));

  describe('()', () => {
    it('Returns instance of Aeroflow', () => 
      assert.typeOf(aeroflow.empty.take(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.take().run(fail, done))));

    it('Emits nothing when flow is not empty', () =>
      assert.isFulfilled(new Promise((done, fail) => 
        aeroflow('test').take().run(fail, done))));
  });

  describe('(@condition:function)', () => {
    it('Emits @values while they satisfies @condition ', () => {
      const values = [2, 4, 6, 3, 4], condition = (value) => value %2 === 0, expectation = [2, 4, 6];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).take(condition).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:number)', () => {
    it('Emits @condition number of @values from the start', () => {
      const values = [1, 2, 3], take = 2, expectation = values.slice(0, take);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).take(take).toArray().run(done, fail)),
        expectation);
    });

    it('Emits @condition number of @values from the end', () => {
      const values = [1, 2, 3], take = -2, expectation = values.slice(take);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).take(take).toArray().run(done, fail)),
        expectation);
    });
  });

  describe('(@condition:!function!number)', () => {
    it('Emits all @values when @condition is non-numeric', () => {
      const values = ['a', 'b', 'c'], take = 'a';
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).take(take).toArray().run(done, fail)),
        values);
    });
  });
});

var tapOperatorTests = (aeroflow, assert) => describe('#tap', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.tap));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.tap(), 'Aeroflow'));

    it('Emits nothing when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.tap().run(fail, done))));
  });

  describe('(@callback:function)', () => {
    it('Does not call @callback when flow is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow.empty.tap(fail).run(fail, done))));

    it('Calls @callback when flow emits several values', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(1, 2).tap(done).run(fail, fail))));

    it('Emits error thrown by @callback', () => {
      const error = new Error('test');
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2).tap(() => { throw error; }).run(fail, done)),
        error);
    });

    it('Passes context data to @callback as third argument', () => {
      const expectation = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow('test').tap((_, __, data) => done(data)).run(fail, fail, expectation)),
        expectation);
    });

    it('Emits immutable @values after tap @callback was applied', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).tap((item) => item * 2).toArray().run(done, fail)),
        values);
    });
  });

  describe('(@callback:!function)', () => {
    it('Emits immutable @values after tap @callback was applied', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).tap(1).toArray().run(done, fail)),
        values);
    });
  });
});

var toArrayOperatorTests = (aeroflow, assert) => describe('#toArray', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.toArray));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow'));

    it('Emits "next" notification aergumented with array when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        'Array'));

    it('Emits "next" notification aergumented with empty array when flow is empty', () =>
      assert.eventually.lengthOf(new Promise((done, fail) =>
        aeroflow.empty.toArray(true).run(done, fail)),
        0));

    it('Emits array of @values when flow emits several @values', () => {
      const values = [1, 2];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toArray().run(done, fail)),
        values);
    });
  });
});

const noop$2 = () => {};

var toMapOperatorTests = (aeroflow, assert) => describe('#toMap', () => {
  it('Is instance method', () =>
    assert.isFunction(aeroflow.empty.toMap));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toMap(), 'Aeroflow'));

    it('Emits "next" notification with map when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toMap(noop$2, noop$2, true).run(done, fail)),
        'Map'));

    it('Emits "next" notification with empty map when flow is empty', () =>
      assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow.empty.toMap(noop$2, noop$2, true).run(done, fail)),
        'size',
        0));

    it('Emits map containing @values emitted by flow as keys', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap().map(map => Array.from(map.keys())).run(done, fail)),
        values);
    });

    it('Emits map containing @values emitted by flow as values', () => {
      const values = [1, 2, 3];
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap().map(map => Array.from(map.values())).run(done, fail)),
        values);
    });
  });

  describe('(@keySelector:function)', () => {
    it('Emits map containing @keys returned by @keySelector', () => {
      const values = [1, 2, 3], keyTransform = key => key++,
        expectation = values.map(keyTransform);
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap(keyTransform).map(map => Array.from(map.keys())).run(done, fail)),
        expectation);
    });

    it('Emits map containing values emitted by flow', () => {
      const values = [1, 2, 3], keyTransform = key => key++;
      return assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(values).toMap(keyTransform).map(map => Array.from(map.values())).run(done, fail)),
        values);
    });
  });

  describe('(@keySelector:!function)', () => {
    it('Emits map containing single key', () =>
      assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow(1, 2, 3).toMap('test').run(done, fail)),
        'size',
        1));

    it('Emits map containing single key equal to @keySelector', () => {
      const keySelector = 'test';
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(1, 2, 3).toMap(keySelector).map(map => map.keys()).flatten().run(done, fail)),
        keySelector);
    });

    it('Emits map containing single latest @value emitted by flow', () => {
      const values = [1, 2, 3], expectation = values[values.length - 1];
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(values).toMap('test').map(map => map.values()).flatten().run(done, fail)),
        expectation);
    });
  });
});

var toSetOperatorTests = (aeroflow, assert) => describe('#toSet', () => {
  it('Is instance method', () => {
    assert.isFunction(aeroflow.empty.toSet);
  });

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow'));

    it('Emits "next" notification with set when flow is empty', () =>
      assert.eventually.typeOf(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        'Set'));

    it('Emits "next" notification with empty set when flow is empty', () =>
      assert.eventually.propertyVal(new Promise((done, fail) =>
        aeroflow.empty.toSet(true).run(done, fail)),
        'size',
        0));

    it('Emits "next" notification with set containing unique of @values when flow emits several @values', () => {
      const values = [1, 2, 1, 3, 2, 3], expectation = Array.from(new Set(values));
      return assert.eventually.sameMembers(new Promise((done, fail) => 
        aeroflow(values).toSet().map(set => Array.from(set)).run(done, fail)),
        expectation);
    });
  });
});

var toStringOperatorTests = (aeroflow, assert) => describe('#toString', () => {
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

const noop = () => {};

var aeroflow = (aeroflow, assert) => describe('aeroflow', () => {
  it('Is function', () =>
    assert.isFunction(aeroflow));

  describe('()', () => {
    it('Returns instance of Aeroflow', () =>
      assert.typeOf(aeroflow(), 'Aeroflow'));

    it('Returns empty flow emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow().run(fail, done))));
  });

  describe('(@source:aeroflow)', () => {
    it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(aeroflow.empty).run(noop, done))));

    it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and enumerated till end', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(aeroflow([1, 2])).run(noop, done))));

    it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but not enumerated till end', () =>
      assert.eventually.isFalse(new Promise(done =>
        aeroflow(aeroflow([1, 2]).take(1)).run(noop, done))));

    it('Returns flow not emitting "next" notification when @source is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(aeroflow.empty).run(fail, done))));

    it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', () => {
      const source = [1, 2], results = [];
      assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(aeroflow(source)).run((result, index) => {
          results.push(result);
          if (index === source.length - 1) done(results);
        }, fail)),
        source);
    });
  });

  describe('(@source:array)', () => {
    it('Returns flow emitting "done" notification argumented with "true" when @source is empty', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow([]).run(noop, done))));

    it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and enumerated till end', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow([1, 2]).run(noop, done))));

    it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but not enumerated till end', () =>
      assert.eventually.isFalse(new Promise(done =>
        aeroflow([1, 2]).take(1).run(noop, done))));

    it('Returns flow not emitting "next" notification when @source is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow([]).run(fail, done))));

    it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', () => {
      const source = [1, 2], results = [];
      assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(source).run((result, index) => {
          results.push(result);
          if (index === source.length - 1) done(results);
        }, fail)),
        source);
    });
  });

  describe('(@source:date)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(noop).run(noop, done))));

    it('Returns flow emitting "next" notification argumented with @source', () => {
      const source = new Date;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        source);
    });
  });

  describe('(@source:error)', () => {
    it('Returns flow not emitting "next" notification', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Error('test')).run(fail, done))));

    it('Returns flow emitting "done" notification argumented with @source', () => {
      const source = new Error('test');
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(fail, done)),
        source);
    });
  });

  describe('(@source:function)', () => {
    it('Calls @source and passes context data as first argument', () => {
      const data = {};
      return assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(context => done(context)).run(fail, fail, data)),
        data);
    });

    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(noop).run(noop, done))));

    it('Returns flow emitting "done" notification argumented with error thrown by @source', () => {
      const error = new Error('test');
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(() => { throw error }).run(fail, done)),
        error);
    });

    it('Returns flow emitting "next" notification argumented with result of @source invocation', () => {
      const result = 42;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(() => result).run(done, fail)),
        result);
    });
  });

  describe('(@source:iterable)', () => {
    it('Returns empty flow emitting "done" notification argumented with "true" when source is empty', () =>
      assert.eventually.isTrue(new Promise((done, fail) =>
        aeroflow(new Set).run(fail, done))));

    it('Returns flow eventually emitting "done" notification argumented with "true" when source is not empty', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(new Set([1, 2])).run(noop, done))));

    it('Returns flow not emitting "next" notification when source is empty', () =>
      assert.isFulfilled(new Promise((done, fail) =>
        aeroflow(new Set).run(fail, done))));

    it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', () => {
      const source = [1, 2], results = [];
      assert.eventually.sameMembers(new Promise((done, fail) =>
        aeroflow(new Set(source)).run((result, index) => {
          results.push(result);
          if (index === source.length - 1) done(results);
        }, fail)),
        source);
    });
  });

  describe('(@source:null)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(noop).run(noop, done))));

    it('Returns flow emitting "next" notification with @source', () => {
      const source = null;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        source);
    });
  });

  describe('(@source:promise)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true" when @source resolves', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(Promise.resolve()).run(noop, done))));

    it('Returns flow emitting "done" notification argumented with error rejected by @source', () => {
      const error = new Error('test'), source = Promise.reject(error);
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(fail, done)),
        error);
    });

    it('Returns flow emitting "next" notification argumented with result resolved by @source', () => {
      const result = 42, source = Promise.resolve(result);
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        result);
    });
  });

  describe('(@source:string)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow('test').run(noop, done))));

    it('Returns flow emitting "next" notification argumented with @source', () => {
      const source = 'test';
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        source);
    });
  });

  describe('(@source:undefined)', () => {
    it('Returns flow eventually emitting "done" notification argumented with "true"', () =>
      assert.eventually.isTrue(new Promise(done =>
        aeroflow(noop).run(noop, done))));

    it('Returns flow emitting "next" notification argumented with @source', () => {
      const source = undefined;
      assert.eventually.strictEqual(new Promise((done, fail) =>
        aeroflow(source).run(done, fail)),
        source);
    });
  });

  [
    emptyGeneratorTests,
    expandGeneratorTests,
    justGeneratorTests,
    randomGeneratorTests,
    repeatGeneratorTests,
    
    averageOperatorTests,
    catchOperatorTests,
    coalesceOperatorTests,
    countOperatorTests,
    distinctOperatorTests,
    everyOperatorTests,
    filterOperatorTests,
    groupOperatorTests,
    joinOperatorTests,
    mapOperatorTests,
    maxOperatorTests,
    meanOperatorTests,
    minOperatorTests,
    reduceOperatorTests,
    reverseOperatorTests,
    skipOperatorTests,
    sliceOperatorTests,
    someOperatorTests,
    sortOperatorTests,
    sumOperatorTests,
    takeOperatorTests,
    tapOperatorTests,
    toArrayOperatorTests,
    toMapOperatorTests,
    toSetOperatorTests,
    toStringOperatorTests
  ].forEach(test => test(aeroflow, assert));
});

export default aeroflow;