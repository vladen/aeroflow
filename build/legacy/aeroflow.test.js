(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.aeroflowTest = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var emptyGeneratorTests = function emptyGeneratorTests(aeroflow, assert) {
    return describe('.empty', function () {
      it('Is static property', function () {
        return assert.isDefined(aeroflow.empty);
      });
      it('Returns instance of Aeroflow', function () {
        return assert.typeOf(aeroflow.empty, 'Aeroflow');
      });
      it('Returns instance of Aeroflow emitting "done" notification with "true"', function () {
        return assert.eventually.isTrue(new Promise(function (done, fail) {
          return aeroflow.empty.run(fail, done);
        }));
      });
      it('Returns instance of Aeroflow not emitting "next" notification', function () {
        return assert.isFulfilled(new Promise(function (done, fail) {
          return aeroflow.empty.run(fail, done);
        }));
      });
    });
  };

  var noop$1 = function noop$1() {};

  var expandGeneratorTests = function expandGeneratorTests(aeroflow, assert) {
    return describe('.expand', function () {
      it('Is static method', function () {
        return assert.isFunction(aeroflow.expand);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.expand(), 'Aeroflow');
        });
      });
      describe('(@expander:function)', function () {
        it('Calls @expander', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.expand(done).take(1).run(fail, fail);
          }));
        });
        it('Passes undefined to @expander as first argument when no seed is specified', function () {
          return assert.eventually.isUndefined(new Promise(function (done, fail) {
            return aeroflow.expand(done).take(1).run(fail, fail);
          }));
        });
        it('Passes value returned by @expander to @expander as first argument on subsequent iteration', function () {
          var expectation = {};
          var iteration = 0;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.expand(function (value) {
              return iteration++ ? done(value) : expectation;
            }).take(2).run(noop$1, fail);
          }), expectation);
        });
        it('Passes zero-based index of iteration to @expander as second argument', function () {
          var indices = [],
              expectation = [0, 1, 2, 3];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow.expand(function (_, index) {
              return indices.push(index);
            }).take(expectation.length).run(noop$1, function () {
              return done(indices);
            });
          }), expectation);
        });
        it('Passes context data to @expander as third argument', function () {
          var data = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.expand(function (_, __, context) {
              return done(context);
            }).take(1).run(fail, fail, data);
          }), data);
        });
        it('Emits "next" notification with value returned by @expander', function () {
          var value = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.expand(function () {
              return value;
            }).take(1).run(done, fail);
          }), value);
        });
      });
      describe('(@expander:function, @seed:any)', function () {
        it('Passes @seed to @expander as first argument', function () {
          var seed = 42,
              expectation = seed;
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.expand(done, seed).take(1).run(fail, fail);
          }), expectation);
        });
      });
    });
  };

  var justGeneratorTests = function justGeneratorTests(aeroflow, assert) {
    return describe('.just', function () {
      it('Is static method', function () {
        return assert.isFunction(aeroflow.just);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.just(), 'Aeroflow');
        });
        it('Returns instance of Aeroflow emitting "next" notification with undefined', function () {
          var expectation = undefined;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.just().run(done, fail);
          }), expectation);
        });
      });
      describe('(@value:array)', function () {
        it('Returns instance of Aeroflow emitting "next" notification with @value', function () {
          var array = [1, 2, 3],
              expectation = array;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.just(array).run(done, fail);
          }), expectation);
        });
      });
      describe('(@value:iterable)', function () {
        it('Returns instance of Aeroflow emitting "next" notification with @value', function () {
          var iterable = new Set([1, 2, 3]),
              expectation = iterable;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.just(iterable).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var randomGeneratorTests = function randomGeneratorTests(aeroflow, assert) {
    return describe('.random', function () {
      it('Is static method', function () {
        return assert.isFunction(aeroflow.random);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.random(), 'Aeroflow');
        });
        it('Emits random values decimals within 0 and 1', function () {
          var count = 10,
              expectation = function expectation(value) {
            return !Number.isInteger(value) && value >= 0 && value <= 1;
          };

          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.random().take(count).every(expectation).run(done, fail);
          }));
        });
      });
      describe('(@start:number)', function () {
        it('Emits random demical values less than @start if @start', function () {
          var start = 2,
              count = 10,
              expectation = function expectation(value) {
            return !Number.isInteger(value) && value <= start;
          };

          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.random(start).take(count).every(expectation).run(done, fail);
          }));
        });
      });
      describe('(@start:!number)', function () {
        it('Emits random decimals values within 0 and 1', function () {
          var start = 'test',
              count = 10,
              expectation = function expectation(value) {
            return !Number.isInteger(value) && value >= 0 && value <= 1;
          };

          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.random(start).take(count).every(expectation).run(done, fail);
          }));
        });
      });
      describe('(@start, @end:number)', function () {
        it('Emits random integer values within @start and @end if @start and @end is integer', function () {
          var start = 10,
              end = 20,
              count = 10,
              expectation = function expectation(value) {
            return Number.isInteger(value) && value >= start && value <= end;
          };

          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.random(start, end).take(count).every(expectation).run(done, fail);
          }));
        });
        it('Emits random demical values within @start and @end if @start or @end is demical', function () {
          var start = 1,
              end = 2.3,
              count = 10,
              expectation = function expectation(value) {
            return !Number.isInteger(value) && value >= start && value <= end;
          };

          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.random(start, end).take(count).every(expectation).run(done, fail);
          }));
        });
      });
      describe('(@start, @end:!number)', function () {
        it('Emits random demical values less than @start if @start', function () {
          var start = 2,
              end = 'test',
              count = 10,
              expectation = function expectation(value) {
            return !Number.isInteger(value) && value <= start;
          };

          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.random(start, end).take(count).every(expectation).run(done, fail);
          }));
        });
      });
    });
  };

  var repeatGeneratorTests = function repeatGeneratorTests(aeroflow, assert) {
    return describe('.repeat', function () {
      it('Is static method', function () {
        return assert.isFunction(aeroflow.repeat);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.repeat(), 'Aeroflow');
        });
        it('Emits undefined @values if no params passed', function () {
          return assert.eventually.isUndefined(new Promise(function (done, fail) {
            return aeroflow.repeat().take(1).run(done, fail);
          }));
        });
      });
      describe('(@repeater:function)', function () {
        it('Calls @repeater', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.repeat(done).take(1).run(fail, fail);
          }));
        });
        it('Emits @value returned by @repeater', function () {
          var value = 'a';
          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.repeat(value).take(5).every(value).run(done, fail);
          }));
        });
        it('Emits geometric progression recalculating @repeater each time', function () {
          var expectation = [0, 2, 4, 6];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow.repeat(function (index) {
              return index * 2;
            }).take(expectation.length).toArray().run(done, fail);
          }), expectation);
        });
        it('Passes zero-based @index of iteration to @repeater as first argument', function () {
          var values = [0, 1, 2, 3, 4];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow.repeat(function (index) {
              return index;
            }).take(values.length).toArray().run(done, fail);
          }), values);
        });
      });
      describe('(@repeater:!function)', function () {
        it('Emits @repeater value if @repeater is not function', function () {
          var value = 'a';
          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.repeat(value).take(5).every(value).run(done, fail);
          }));
        });
      });
      describe('(@repeater, @interval:number)', function () {
        it('Emits value of @repeater each @interval ms', function () {
          var interval = 10,
              take = 3,
              actual = [];
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.repeat(function () {
              return actual.push('test');
            }, interval).take(take).count().run(done, fail);
          }), take);
        });
      });
      describe('(@repeater, @interval:!number)', function () {
        it('Emits value of @repeater each 1000 ms', function () {
          var take = 1,
              actualTime = new Date().getSeconds();
          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.repeat(function () {
              return new Date().getSeconds();
            }, 'tests').take(take).every(function (val) {
              return val - actualTime >= 1;
            }).run(done, fail);
          }));
        });
      });
    });
  };

  var averageOperatorTests = function averageOperatorTests(aeroflow, assert) {
    return describe('#average', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.average);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
        });
        it('Emits "done" notification only when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.average().run(fail, done);
          }));
        });
        it('Emits "next" notification parameterized with @value when flow emits single numeric @value', function () {
          var value = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).average().run(done, fail);
          }), value);
        });
        it('Emits "next" notification parameterized with NaN when flow emits single not numeric @value', function () {
          return assert.eventually.isNaN(new Promise(function (done, fail) {
            return aeroflow('test').average().run(done, fail);
          }));
        });
        it('Emits "next" notification parameterized with average of @values when flow emits several numeric @values', function () {
          var values = [1, 3, 2],
              average = values.reduce(function (sum, value) {
            return sum + value;
          }, 0) / values.length;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).average().run(done, fail);
          }), average);
        });
        it('Emits "next" notification parameterized with NaN when flow emits several not numeric @values', function () {
          return assert.eventually.isNaN(new Promise(function (done, fail) {
            return aeroflow('a', 'b').average().run(done, fail);
          }));
        });
      });
    });
  };

  var catchOperatorTests = function catchOperatorTests(aeroflow, assert) {
    return describe('#catch', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.catch);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.catch(), 'Aeroflow');
        });
        it('Emits "done" notification only when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.catch().run(fail, done);
          }));
        });
        it('Supresses error emitted by flow', function () {
          return assert.eventually.isBoolean(new Promise(function (done, fail) {
            return aeroflow(new Error('test')).catch().run(fail, done);
          }));
        });
      });
      describe('(@alternate:function)', function () {
        it('Does not call @alternative when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.catch(fail).run(fail, done);
          }));
        });
        it('Does not call @alternate when flow does not emit error', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').catch(fail).run(done, fail);
          }));
        });
        it('Calls @alternate when flow emits error', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(new Error('test')).catch(done).run(fail, fail);
          }));
        });
        it('Emits "next" notification with value returned by @alternate when flow emits error', function () {
          var alternate = 'alternate';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(new Error('test')).catch(function () {
              return alternate;
            }).run(done, fail);
          }), alternate);
        });
      });
      describe('(@alternate:!function)', function () {
        it('Emits "next" notification with @alternate value instead of error emitted by flow', function () {
          var alternate = 'alternate';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(new Error('test')).catch(alternate).run(done, fail);
          }), alternate);
        });
      });
    });
  };

  var coalesceOperatorTests = function coalesceOperatorTests(aeroflow, assert) {
    return describe('#coalesce', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.coalesce);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.coalesce(), 'Aeroflow');
        });
        it('Emits "done" notification only when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.coalesce().run(fail, done);
          }));
        });
      });
      describe('(@alternate:function)', function () {
        it('Does not call @alternate when flow is not empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').coalesce(fail).run(done, fail);
          }));
        });
        it('Does not call @alternate when flow emits error', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(new Error('test')).coalesce(fail).run(fail, done);
          }));
        });
        it('Emits "next" notification with value returned by @alternate when flow is empty', function () {
          var alternate = 'alternate';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.coalesce(function () {
              return alternate;
            }).run(done, fail);
          }), alternate);
        });
      });
      describe('(@alternate:!function)', function () {
        it('Emits "next" notification with @alternate value when flow is empty', function () {
          var alternate = 'alternate';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.coalesce(alternate).run(done, fail);
          }), alternate);
        });
      });
    });
  };

  var countOperatorTests = function countOperatorTests(aeroflow, assert) {
    return describe('#count', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.count);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
        });
        it('Emits 0 when flow is empty', function () {
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.count().run(done, fail);
          }), 0);
        });
        it('Emits 1 when flow emits single @value', function () {
          var expectation = 1;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(expectation).count().run(done, fail);
          }), expectation);
        });
        it('Emits number of @values emitted by flow when flow emits several @values', function () {
          var values = [1, 2, 3],
              expectation = values.length;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).count().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var distinctOperatorTests = function distinctOperatorTests(aeroflow, assert) {
    return describe('#distinct', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.distinct);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.distinct(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.distinct().run(fail, done);
          }));
        });
        it('Emits unique of @values when flow emits several numeric @values', function () {
          var values = [1, 1, 2, 2, 3],
              expectation = Array.from(new Set(values));
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).distinct().toArray().run(done, fail);
          }), expectation);
        });
        it('Emits unique of @values when flow emits several string @values', function () {
          var values = ['a', 'a', 'b', 'b', 'c'],
              expectation = Array.from(new Set(values));
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).distinct().toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(true)', function () {
        it('Emits first @value of each sub-sequence of identical @values (distinct until changed)', function () {
          var values = [1, 1, 2, 2, 1, 1],
              expectation = [1, 2, 1];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).distinct(true).toArray().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var everyOperatorTests = function everyOperatorTests(aeroflow, assert) {
    return describe('#every', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.every);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.every(), 'Aeroflow');
        });
        it('Emits "true" when flow is empty', function () {
          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow.empty.every().run(done, fail);
          }));
        });
        it('Emits "true" when all @values emitted by flow are truthy', function () {
          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow(true, 1).every().run(done, fail);
          }));
        });
        it('Emits "false" when at least one @value emitted by flow is falsey', function () {
          return assert.eventually.isFalse(new Promise(function (done, fail) {
            return aeroflow(true, 0).every().run(done, fail);
          }));
        });
        it('Emits single result when flow emits several @values', function () {
          var expectation = 1;
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2, 3).every().count().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:function)', function () {
        it('Emits "true" when all @values emitted by flow pass @condition test', function () {
          var values = [2, 4],
              condition = function condition(item) {
            return item % 2 === 0;
          },
              expectation = values.every(condition);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).every(condition).run(done, fail);
          }), expectation);
        });
        it('Emits "false" when at least one @value emitted by flow does not pass @condition test', function () {
          var values = [1, 4],
              condition = function condition(item) {
            return item % 2 === 0;
          },
              expectation = values.every(condition);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).every(condition).run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:regex)', function () {
        it('Emits "true" when all @values emitted by flow pass @condition test', function () {
          var values = ['a', 'aa'],
              condition = /a/,
              expectation = values.every(function (value) {
            return condition.test(value);
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).every(condition).run(done, fail);
          }), expectation);
        });
        it('Emits "false" when at least one @value emitted by flow does not pass @condition test', function () {
          var values = ['a', 'bb'],
              condition = /a/,
              expectation = values.every(function (value) {
            return condition.test(value);
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).every(condition).run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:!function!regex)', function () {
        it('Emits "true" when all @values emitted by flow equal @condition', function () {
          var values = [1, 1],
              condition = 1,
              expectation = values.every(function (value) {
            return value === condition;
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).every(condition).run(done, fail);
          }), expectation);
        });
        it('Emits "false" when at least one @value emitted by flow does not equal @condition', function () {
          var values = [1, 2],
              condition = 2,
              expectation = values.every(function (value) {
            return value === condition;
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).every(condition).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var filterOperatorTests = function filterOperatorTests(aeroflow, assert) {
    return describe('#filter', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.filter);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.filter(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.filter().run(fail, done);
          }));
        });
        it('Emits only truthy of @values emitted by flow', function () {
          var values = [false, true, 0, 1, undefined, null, 'test'],
              expectation = values.filter(function (value) {
            return value;
          });
          assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).filter().toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:function)', function () {
        it('Does not call @condition when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.filter(fail).run(fail, done);
          }));
        });
        it('Calls @condition when flow is not empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').filter(done).run(fail, fail);
          }));
        });
        it('Passes @value emitted by flow to @condition as first argument', function () {
          var value = 'test';
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).filter(done).run(fail, fail);
          }), value);
        });
        it('Passes zero-based @index of iteration to @condition as second argument', function () {
          var values = [1, 2, 3, 4],
              expectation = values.length - 1;
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(values).filter(function (_, index) {
              if (index === expectation) done();
            }).run(fail, fail);
          }));
        });
        it('Passes context @data to @condition as third argument', function () {
          var expectation = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow('test').filter(function (_, __, data) {
              return done(data);
            }).run(fail, fail, expectation);
          }), expectation);
        });
        it('Emits only @values emitted by flow and passing @condition test', function () {
          var values = [0, 1, 2, 3],
              condition = function condition(value) {
            return value > 1;
          },
              expectation = values.filter(condition);

          assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).filter(condition).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:regex)', function () {
        it('Emits only @values emitted by flow and passing @condition test', function () {
          var values = ['a', 'b', 'aa', 'bb'],
              condition = /a/,
              expectation = values.filter(function (value) {
            return condition.test(value);
          });
          assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).filter(condition).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:!function!regex)', function () {
        it('Emits only @values emitted by flow and equal to @condition', function () {
          var values = [1, 2, 3],
              condition = 2,
              expectation = values.filter(function (value) {
            return value === condition;
          });
          assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).filter(condition).toArray().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var groupOperatorTests = function groupOperatorTests(aeroflow, assert) {
    return describe('#group', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.group);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.group(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.group().run(fail, done);
          }));
        });
      });
      describe('(@selector:function)', function () {
        it('Does not call @selector when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.group(fail).run(fail, done);
          }));
        });
        it('Calls @selector when flow emits several values', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(1, 2).group(done).run(fail, fail);
          }));
        });
        it('Emits error thrown by @selector', function () {
          var error = new Error('test');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).group(function () {
              throw error;
            }).run(fail, done);
          }), error);
        });
        it('Passes context data to @selector as third argument', function () {
          var expectation = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow('test').group(function (_, __, data) {
              return done(data);
            }).run(fail, fail, expectation);
          }), expectation);
        });
        it('Passes zero-based @index of iteration to @condition as second argument', function () {
          var values = [1, 2, 3, 4],
              expectation = values.length - 1;
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(values).group(function (_, index) {
              if (index === expectation) done();
            }).run(fail, fail);
          }));
        });
        it('Emits @values divided into groups by result of @selector', function () {
          var values = [-1, 6, -3, 4],
              expectation = [[-1, -3], [6, 4]];
          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            return aeroflow(values).group(function (value) {
              return value >= 0;
            }).map(function (group) {
              return group[1];
            }).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @values divided into named groups by result of @selector', function () {
          var values = [-1, 6, -3, 4],
              positive = 'positive',
              negative = 'positive';
          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            return aeroflow(values).group(function (value) {
              return value >= 0 ? positive : negative;
            }).map(function (group) {
              return group[0];
            }).toArray().run(done, fail);
          }), [positive, negative]);
        });
      });
      describe('(@selectors:array)', function () {
        it('Emits nested named groups which divide @values by first predicate from @selectors', function () {
          var values = [{
            name: 'test1',
            sex: 'female'
          }, {
            name: 'test2',
            sex: 'male'
          }],
              expectation = [values[0].name, values[1].name],
              selectors = [function (value) {
            return value.name;
          }, function (value) {
            return value.sex;
          }];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            var _aeroflow;

            return (_aeroflow = aeroflow(values)).group.apply(_aeroflow, selectors).map(function (group) {
              return group[0];
            }).toArray().run(done, fail);
          }), expectation);
        });
        it('Use maps to contain nested groups which divided @values by @selectors', function () {
          var values = [{
            name: 'test1',
            sex: 'female'
          }, {
            name: 'test2',
            sex: 'male'
          }],
              selectors = [function (value) {
            return value.name;
          }, function (value) {
            return value.sex;
          }];
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            var _aeroflow2;

            return (_aeroflow2 = aeroflow(values)).group.apply(_aeroflow2, selectors).toArray().map(function (group) {
              return group[0][1];
            }).run(done, fail);
          }), 'Map');
        });
        it('Emits nested named groups which divide @values by second predicate from @selectors', function () {
          var values = [{
            name: 'test1',
            sex: 'female'
          }, {
            name: 'test2',
            sex: 'male'
          }],
              expectation = [[values[0].sex], [values[1].sex]],
              selectors = [function (value) {
            return value.name;
          }, function (value) {
            return value.sex;
          }];
          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            var _aeroflow3;

            return (_aeroflow3 = aeroflow(values)).group.apply(_aeroflow3, selectors).map(function (group) {
              return Array.from(group[1].keys());
            }).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @values on the root of nested groups', function () {
          var values = [{
            name: 'test1',
            sex: 'female'
          }, {
            name: 'test2',
            sex: 'male'
          }],
              selectors = [function (value) {
            return value.name;
          }, function (value) {
            return value.sex;
          }];
          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            var _aeroflow4;

            return (_aeroflow4 = aeroflow(values)).group.apply(_aeroflow4, selectors).map(function (group) {
              return Array.from(group[1].values())[0][0];
            }).toArray().run(done, fail);
          }), values);
        });
      });
    });
  };

  var joinOperatorTests = function joinOperatorTests(aeroflow, assert) {
    return describe('#join', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.join);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.join(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.join().run(fail, done);
          }));
        });
        it('Emits @values from flow concatenated with undefined when flow is not empty', function () {
          var values = [1, 2],
              expectation = [[1, undefined], [2, undefined]];
          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            aeroflow(values).join().toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@joiner:any)', function () {
        it('Emits nested arrays with @values concatenated with @joiner values by one to one', function () {
          var values = [1, 2],
              joiner = [3, 4],
              expectation = [[1, 3], [1, 4], [2, 3], [2, 4]];
          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            aeroflow(values).join(joiner).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@joiner:any, @comparer:function)', function () {
        it('Emits nested arrays with @values concatenated with @joiner through @comparer function', function () {
          var values = [{
            a: 'test',
            b: 'tests'
          }],
              joiner = [{
            a: 'test',
            c: 'tests3'
          }],
              comparer = function comparer(left, right) {
            return left.a === right.a;
          },
              expectation = [].concat(values, joiner);

          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            aeroflow(values).join(joiner, comparer).toArray().map(function (res) {
              return res[0];
            }).run(done, fail);
          }), expectation);
        });
      });
      describe('(@joiner:any, @comparer:!function)', function () {
        it('Emits nested arrays with @values concatenated with @joiner values by one to one ignored @comparer', function () {
          var values = [1, 2],
              joiner = 3,
              comparer = 'test',
              expectation = [[1, 3], [2, 3]];
          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            aeroflow(values).join(joiner, comparer).toArray().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var mapOperatorTests = function mapOperatorTests(aeroflow, assert) {
    return describe('#map', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.map);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.map(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.map().run(fail, done);
          }));
        });
        it('Emits same @values when no arguments passed', function () {
          var values = [1, 2];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).map().toArray().run(done, fail);
          }), values);
        });
      });
      describe('(@mapping:function)', function () {
        it('Does not call @mapping when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.map(fail).run(fail, done);
          }));
        });
        it('Calls @mapping when flow emits several values', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(1, 2).map(done).run(fail, fail);
          }));
        });
        it('Emits error thrown by @mapping', function () {
          var error = new Error('test');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).map(function () {
              throw error;
            }).run(fail, done);
          }), error);
        });
        it('Emits @values processed through @mapping', function () {
          var values = [1, 2, 3],
              mapping = function mapping(item) {
            return item * 2;
          },
              expectation = values.map(mapping);

          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).map(mapping).toArray().run(done, fail);
          }), expectation);
        });
        it('Passes context data to @mapping as third argument', function () {
          var expectation = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow('test').map(function (_, __, data) {
              return done(data);
            }).run(fail, fail, expectation);
          }), expectation);
        });
      });
      describe('(@mapping:!function)', function () {
        it('Emits @mapping value instead of every value in @values', function () {
          var values = [1, 2],
              mapping = 'a',
              expectation = [mapping, mapping];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).map(mapping).toArray().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var maxOperatorTests = function maxOperatorTests(aeroflow, assert) {
    return describe('#max', function () {
      it('Is instance method', function () {
        assert.isFunction(aeroflow.empty.max);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.max().run(fail, done);
          }));
        });
        it('Emits @value when flow emits single numeric @value', function () {
          var value = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).max().run(done, fail);
          }), value);
        });
        it('Emits @value when flow emits single string @value', function () {
          var value = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).max().run(done, fail);
          }), value);
        });
        it('Emits maximum of @values when flow emits several numeric @values', function () {
          var _Math;

          var values = [1, 3, 2],
              expectation = (_Math = Math).max.apply(_Math, values);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).max().run(done, fail);
          }), expectation);
        });
        it('Emits maximum of @values when flow emits several string @values', function () {
          var values = ['a', 'c', 'b'],
              expectation = values.reduce(function (max, value) {
            return value > max ? value : max;
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).max().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var meanOperatorTests = function meanOperatorTests(aeroflow, assert) {
    return describe('#mean', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.mean);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.mean(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.mean().run(fail, done);
          }));
        });
        it('Emits @value from flow emitting single numeric @value', function () {
          var value = 42,
              expectation = value;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).mean().run(done, fail);
          }), expectation);
        });
        it('Emits mean value of @values from flow emitting several numeric @values', function () {
          var values = [1, 3, 4, 5],
              expectation = 4;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).mean().run(done, fail);
          }), expectation);
        });
        it('Emits @value from flow emitting single non-numeric @value', function () {
          var value = 'a',
              expectation = value;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).mean().run(done, fail);
          }), expectation);
        });
        it('Emits mean value of @values from flow emitting several numeric @values', function () {
          var values = ['a', 'd', 'f', 'm'],
              expectation = 'f';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).mean().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var minOperatorTests = function minOperatorTests(aeroflow, assert) {
    return describe('#min', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.min);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.min().run(fail, done);
          }));
        });
        it('Emits @value when flow emits single numeric @value', function () {
          var value = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).min().run(done, fail);
          }), value);
        });
        it('Emits @value when flow emits single string @value', function () {
          var value = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).min().run(done, fail);
          }), value);
        });
        it('Emits minimum of @values when flow emits several numeric @values', function () {
          var _Math2;

          var values = [1, 3, 2],
              expectation = (_Math2 = Math).min.apply(_Math2, values);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).min().run(done, fail);
          }), expectation);
        });
        it('Emits minimum of @values when flow emits several string @values', function () {
          var values = ['a', 'c', 'b'],
              expectation = values.reduce(function (min, value) {
            return value < min ? value : min;
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).min().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var reduceOperatorTests = function reduceOperatorTests(aeroflow, assert) {
    return describe('#reduce', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.reduce);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.reduce().run(fail, done);
          }));
        });
        it('Emits first value emitted by flow when flow is not empty', function () {
          var values = [1, 2];
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).reduce().run(done, fail);
          }), values[0]);
        });
      });
      describe('(@reducer:function)', function () {
        it('Does not call @reducer when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(fail).run(fail, done);
          }));
        });
        it('Does not call @reducer when flow emits single @value', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(1).reduce(fail).run(done, fail);
          }));
        });
        it('Calls @reducer when flow emits several v@alues', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(done).run(fail, fail);
          }));
        });
        it('Emits error thrown by @reducer', function () {
          var error = new Error('test');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(function () {
              throw error;
            }).run(fail, done);
          }), error);
        });
        it('Emits @value emitted by flow when flow emits single @value', function () {
          var value = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).reduce(function () {
              return 'test';
            }).run(done, fail);
          }), value);
        });
        it('Emits @value returned by @reducer when flow emits several @values', function () {
          var value = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2, 3).reduce(function () {
              return value;
            }).run(done, fail);
          }), value);
        });
        it('Passes first and second @values emitted by flow to @reducer as first and second arguments on first iteration', function () {
          var values = [1, 2];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).reduce(function (first, second) {
              return done([first, second]);
            }).run(fail, fail);
          }), values);
        });
        it('Passes zero-based @index of iteration to @reducer as third argument', function () {
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(function (_, __, index) {
              return done(index);
            }).run(fail, fail);
          }), 0);
        });
        it('Passes context @data to @reducer as forth argument', function () {
          var expectation = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(function (_, __, ___, data) {
              return done(data);
            }).run(fail, fail, expectation);
          }), expectation);
        });
      });
      describe('(@reducer:function, @seed)', function () {
        it('Emits @seed value when flow is empty', function () {
          var seed = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(function () {}, seed).run(done, fail);
          }), seed);
        });
        it('Passes @seed to @reducer as first argument on first iteration', function () {
          var seed = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow('test').reduce(done, seed).run(fail, fail);
          }), seed);
        });
      });
      describe('(@reducer:!function)', function () {
        it('Emits @reducer value when flow is empty', function () {
          var reducer = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(reducer).run(done, fail);
          }), reducer);
        });
        it('Emits @reducer value when flow is not empty', function () {
          var reducer = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(reducer).run(done, fail);
          }), reducer);
        });
      });
    });
  };

  var reverseOperatorTests = function reverseOperatorTests(aeroflow, assert) {
    return describe('#reverse', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.reverse);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.reverse(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.reverse().run(fail, done);
          }));
        });
        it('Emits @value from flow emitting single numeric @value', function () {
          var value = 42,
              expectation = value;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).reverse().run(done, fail);
          }), expectation);
        });
        it('Emits reversed @values from flow emitting @values', function () {
          var values = [1, 3],
              expectation = values.reverse();
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).reverse().toArray().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var skipOperatorTests = function skipOperatorTests(aeroflow, assert) {
    return describe('#skip', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.skip);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.skip(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.skip().run(fail, done);
          }));
        });
        it('Emits nothing when flow is not empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').skip().run(fail, done);
          }));
        });
      });
      describe('(@condition:function)', function () {
        it('Emits @values until they not satisfies @condition ', function () {
          var values = [2, 4, 6, 3, 7],
              condition = function condition(value) {
            return value % 2 === 0;
          },
              expectation = [3, 7];

          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).skip(condition).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:number)', function () {
        it('Emits @values beginning with @condition position from the start', function () {
          var values = [1, 2, 3],
              skip = 2,
              expectation = values.slice(skip);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).skip(skip).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @values without @condition number of @values from the end', function () {
          var values = [1, 2, 3],
              skip = 2,
              expectation = values.slice(0, values.length - skip);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).skip(-skip).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:!function!number)', function () {
        it('Emits nothing when @condition is non-numeric', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').skip('test').run(fail, done);
          }));
        });
      });
    });
  };

  var sliceOperatorTests = function sliceOperatorTests(aeroflow, assert) {
    return describe('#slice', function () {
      it('Is instance method', function () {
        assert.isFunction(aeroflow.empty.slice);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          assert.typeOf(aeroflow.empty.slice(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.slice().run(fail, done);
          }));
        });
        it('Emits @values when flow emits several @values', function () {
          var values = [1, 2];
          assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).slice().toArray().run(done, fail);
          }), values);
        });
      });
      describe('(@start:number)', function () {
        it('Emits @start number of @values from the start', function () {
          var values = [1, 2, 3],
              slice = 2,
              expectation = values.slice(slice);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).slice(slice).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @start number of @values from the end', function () {
          var values = [1, 2, 3],
              slice = -2,
              expectation = values.slice(slice);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).slice(slice).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@start:!number)', function () {
        it('Emits @values when passed non-numerical @start', function () {
          var values = [1, 2];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).slice('test').toArray().run(done, fail);
          }), values);
        });
      });
      describe('(@start:number, @end:number)', function () {
        it('Emits @values within @start and @end indexes from the start', function () {
          var values = [1, 2, 3],
              slice = [1, 2],
              expectation = values.slice.apply(values, slice);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            var _aeroflow5;

            return (_aeroflow5 = aeroflow(values)).slice.apply(_aeroflow5, slice).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @values within @start and @end indexes from the end', function () {
          var values = [1, 2, 3],
              slice = [-2, -1],
              expectation = values.slice.apply(values, slice);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            var _aeroflow6;

            return (_aeroflow6 = aeroflow(values)).slice.apply(_aeroflow6, slice).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@start:number, @end:!number)', function () {
        it('Emits @values from @start index till the end', function () {
          var values = [1, 2],
              start = 1,
              expectation = values.slice(start);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).slice(start, 'test').toArray().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var someOperatorTests = function someOperatorTests(aeroflow, assert) {
    return describe('#some', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.some);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.some(), 'Aeroflow');
        });
        it('Emits "false" when flow is empty', function () {
          return assert.eventually.isFalse(new Promise(function (done, fail) {
            return aeroflow.empty.some().run(done, fail);
          }));
        });
        it('Emits "true" when at least one @value emitted by flow is truthy', function () {
          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return aeroflow(true, 0).some().run(done, fail);
          }));
        });
        it('Emits "false" when all @value emitted by flow are falsey', function () {
          return assert.eventually.isFalse(new Promise(function (done, fail) {
            return aeroflow(false, 0).some().run(done, fail);
          }));
        });
        it('Emits single result when flow emits several values', function () {
          var expectation = 1;
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2, 3).some().count().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:function)', function () {
        it('Emits "true" when at least one @value emitted by flow passes @condition test', function () {
          var values = [2, 1],
              condition = function condition(item) {
            return item % 2 === 0;
          },
              expectation = values.some(condition);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).some(condition).run(done, fail);
          }), expectation);
        });
        it('Emits "false" when no @values emitted by flow pass @condition test', function () {
          var values = [3, 1],
              condition = function condition(item) {
            return item % 2 === 0;
          },
              expectation = values.some(condition);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).some(condition).run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:regex)', function () {
        it('Emits "true" when at least one @value emitted by flow passes @condition test', function () {
          var values = ['a', 'b'],
              condition = /a/,
              expectation = values.some(function (value) {
            return condition.test(value);
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).some(condition).run(done, fail);
          }), expectation);
        });
        it('Emits "false" when no @values emitted by flow pass @condition test', function () {
          var values = ['a', 'b'],
              condition = /c/,
              expectation = values.some(function (value) {
            return condition.test(value);
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).some(condition).run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:!function!regex)', function () {
        it('Emits "true" when at least one @value emitted by flow equals @condition', function () {
          var values = [1, 2],
              condition = 1,
              expectation = values.some(function (value) {
            return value === condition;
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).some(condition).run(done, fail);
          }), expectation);
        });
        it('Emits "false" when no @values emitted by flow equal @condition', function () {
          var values = [1, 2],
              condition = 3,
              expectation = values.some(function (value) {
            return value === condition;
          });
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).some(condition).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var sortOperatorTests = function sortOperatorTests(aeroflow, assert) {
    return describe('#sort', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.sort);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.sort(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.sort().run(fail, done);
          }));
        });
        it('Emits @values in ascending order when flow is not empty', function () {
          var values = [6, 5, 3, 8],
              expectation = values.sort();
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort().toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@comparer:string)', function () {
        it('Emits @values in descending order when @comparer equal to desc', function () {
          var values = ['a', 'c', 'f'],
              sort = 'desc',
              expectation = values.sort().reverse();
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort(sort).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @values in descending order when @comparer not equal to desc', function () {
          var values = ['a', 'c', 'f'],
              sort = 'asc',
              expectation = values.sort();
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort(sort).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@comparer:boolean)', function () {
        it('Emits @values in descending order when false passed', function () {
          var values = [2, 7, 4],
              sort = false,
              expectation = values.sort().reverse();
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort(sort).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @values in descending order when true passed', function () {
          var values = [4, 8, 1],
              sort = true,
              expectation = values.sort();
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort(sort).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@comparer:number)', function () {
        it('Emits @values in descending order when @comparer less than 0', function () {
          var values = [2, 7, 4],
              sort = -1,
              expectation = values.sort().reverse();
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort(sort).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @values in descending order when @comparer greatest or equal to 0', function () {
          var values = [4, 8, 1],
              sort = 1,
              expectation = values.sort();
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort(sort).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@comparer:function)', function () {
        it('Emits @values sorted according by result of @comparer', function () {
          var values = [4, 8, 1],
              comparer = function comparer(a, b) {
            return a - b;
          },
              expectation = values.sort();

          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort(comparer).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@comparers:array)', function () {
        it('Emits @values sorted by applying @comparers in order', function () {
          var values = [{
            prop: 'test1'
          }, {
            prop: 'test2'
          }],
              comparers = [function (value) {
            return value.prop;
          }, 'desc'],
              expectation = values.sort(function (value) {
            return value.prop;
          }).reverse();
          return assert.eventually.sameDeepMembers(new Promise(function (done, fail) {
            return aeroflow(values).sort(comparers).toArray().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var sumOperatorTests = function sumOperatorTests(aeroflow, assert) {
    return describe('#sum', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.sum);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.sum(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.sum().run(fail, done);
          }));
        });
        it('Emits total sum of values when flow emits several numeric values', function () {
          var values = [1, 3, 2],
              expectation = values.reduce(function (prev, curr) {
            return prev + curr;
          }, 0);
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).sum().run(done, fail);
          }), expectation);
        });
        it('Emits NaN when flow emits single not numeric value', function () {
          return assert.eventually.isNaN(new Promise(function (done, fail) {
            return aeroflow('q').sum().run(done, fail);
          }));
        });
        it('Emits NaN when flow emits several not numeric values', function () {
          return assert.eventually.isNaN(new Promise(function (done, fail) {
            return aeroflow('q', 'b').sum().run(done, fail);
          }));
        });
      });
    });
  };

  var takeOperatorTests = function takeOperatorTests(aeroflow, assert) {
    return describe('#take', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.take);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.take(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.take().run(fail, done);
          }));
        });
        it('Emits nothing when flow is not empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').take().run(fail, done);
          }));
        });
      });
      describe('(@condition:function)', function () {
        it('Emits @values while they satisfies @condition ', function () {
          var values = [2, 4, 6, 3, 4],
              condition = function condition(value) {
            return value % 2 === 0;
          },
              expectation = [2, 4, 6];

          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).take(condition).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:number)', function () {
        it('Emits @condition number of @values from the start', function () {
          var values = [1, 2, 3],
              take = 2,
              expectation = values.slice(0, take);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).take(take).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @condition number of @values from the end', function () {
          var values = [1, 2, 3],
              take = -2,
              expectation = values.slice(take);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).take(take).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(@condition:!function!number)', function () {
        it('Emits all @values when @condition is non-numeric', function () {
          var values = ['a', 'b', 'c'],
              take = 'a';
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).take(take).toArray().run(done, fail);
          }), values);
        });
      });
    });
  };

  var tapOperatorTests = function tapOperatorTests(aeroflow, assert) {
    return describe('#tap', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.tap);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.tap(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.tap().run(fail, done);
          }));
        });
      });
      describe('(@callback:function)', function () {
        it('Does not call @callback when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.tap(fail).run(fail, done);
          }));
        });
        it('Calls @callback when flow emits several values', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(1, 2).tap(done).run(fail, fail);
          }));
        });
        it('Emits error thrown by @callback', function () {
          var error = new Error('test');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).tap(function () {
              throw error;
            }).run(fail, done);
          }), error);
        });
        it('Passes context data to @callback as third argument', function () {
          var expectation = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow('test').tap(function (_, __, data) {
              return done(data);
            }).run(fail, fail, expectation);
          }), expectation);
        });
        it('Emits immutable @values after tap @callback was applied', function () {
          var values = [1, 2, 3];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).tap(function (item) {
              return item * 2;
            }).toArray().run(done, fail);
          }), values);
        });
      });
      describe('(@callback:!function)', function () {
        it('Emits immutable @values after tap @callback was applied', function () {
          var values = [1, 2, 3];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).tap(1).toArray().run(done, fail);
          }), values);
        });
      });
    });
  };

  var toArrayOperatorTests = function toArrayOperatorTests(aeroflow, assert) {
    return describe('#toArray', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.toArray);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow');
        });
        it('Emits "next" notification aergumented with array when flow is empty', function () {
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            return aeroflow.empty.toArray(true).run(done, fail);
          }), 'Array');
        });
        it('Emits "next" notification aergumented with empty array when flow is empty', function () {
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toArray(true).run(done, fail);
          }), 0);
        });
        it('Emits array of @values when flow emits several @values', function () {
          var values = [1, 2];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).toArray().run(done, fail);
          }), values);
        });
      });
    });
  };

  var noop$2 = function noop$2() {};

  var toMapOperatorTests = function toMapOperatorTests(aeroflow, assert) {
    return describe('#toMap', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.toMap);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.toMap(), 'Aeroflow');
        });
        it('Emits "next" notification with map when flow is empty', function () {
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            return aeroflow.empty.toMap(noop$2, noop$2, true).run(done, fail);
          }), 'Map');
        });
        it('Emits "next" notification with empty map when flow is empty', function () {
          return assert.eventually.propertyVal(new Promise(function (done, fail) {
            return aeroflow.empty.toMap(noop$2, noop$2, true).run(done, fail);
          }), 'size', 0);
        });
        it('Emits map containing @values emitted by flow as keys', function () {
          var values = [1, 2, 3];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).toMap().map(function (map) {
              return Array.from(map.keys());
            }).run(done, fail);
          }), values);
        });
        it('Emits map containing @values emitted by flow as values', function () {
          var values = [1, 2, 3];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).toMap().map(function (map) {
              return Array.from(map.values());
            }).run(done, fail);
          }), values);
        });
      });
      describe('(@keySelector:function)', function () {
        it('Emits map containing @keys returned by @keySelector', function () {
          var values = [1, 2, 3],
              keyTransform = function keyTransform(key) {
            return key++;
          },
              expectation = values.map(keyTransform);

          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).toMap(keyTransform).map(function (map) {
              return Array.from(map.keys());
            }).run(done, fail);
          }), expectation);
        });
        it('Emits map containing values emitted by flow', function () {
          var values = [1, 2, 3],
              keyTransform = function keyTransform(key) {
            return key++;
          };

          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).toMap(keyTransform).map(function (map) {
              return Array.from(map.values());
            }).run(done, fail);
          }), values);
        });
      });
      describe('(@keySelector:!function)', function () {
        it('Emits map containing single key', function () {
          return assert.eventually.propertyVal(new Promise(function (done, fail) {
            return aeroflow(1, 2, 3).toMap('test').run(done, fail);
          }), 'size', 1);
        });
        it('Emits map containing single key equal to @keySelector', function () {
          var keySelector = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2, 3).toMap(keySelector).map(function (map) {
              return map.keys();
            }).flatten().run(done, fail);
          }), keySelector);
        });
        it('Emits map containing single latest @value emitted by flow', function () {
          var values = [1, 2, 3],
              expectation = values[values.length - 1];
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).toMap('test').map(function (map) {
              return map.values();
            }).flatten().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var toSetOperatorTests = function toSetOperatorTests(aeroflow, assert) {
    return describe('#toSet', function () {
      it('Is instance method', function () {
        assert.isFunction(aeroflow.empty.toSet);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow');
        });
        it('Emits "next" notification with set when flow is empty', function () {
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            return aeroflow.empty.toSet(true).run(done, fail);
          }), 'Set');
        });
        it('Emits "next" notification with empty set when flow is empty', function () {
          return assert.eventually.propertyVal(new Promise(function (done, fail) {
            return aeroflow.empty.toSet(true).run(done, fail);
          }), 'size', 0);
        });
        it('Emits "next" notification with set containing unique of @values when flow emits several @values', function () {
          var values = [1, 2, 1, 3, 2, 3],
              expectation = Array.from(new Set(values));
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).toSet().map(function (set) {
              return Array.from(set);
            }).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var toStringOperatorTests = function toStringOperatorTests(aeroflow, assert) {
    return describe('#toString', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.toString);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
        });
        it('Emits "next" notification with string when flow is empty', function () {
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString().run(done, fail);
          }), 'String');
        });
        it('Emits "next" notification with empty string when flow is empty', function () {
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString().run(done, fail);
          }), 0);
        });
        it('Emits "next" notification with @string when flow emits single @string', function () {
          var string = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(string).toString().run(done, fail);
          }), string);
        });
        it('Emits "next" notification with @number converted to string when flow emits single @number', function () {
          var number = 42,
              expectation = '' + number;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(number).toString().run(done, fail);
          }), expectation);
        });
        it('Emits "next" notification with @strings concatenated via "," separator when flow emits several @strings', function () {
          var strings = ['a', 'b'],
              expectation = strings.join(',');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(strings).toString().run(done, fail);
          }), expectation);
        });
        it('Emits "next" notification with @numbers converted to strings and concatenated via "," separator when flow emits several @numbers', function () {
          var numbers = [100, 500],
              expectation = numbers.join(',');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(numbers).toString().run(done, fail);
          }), expectation);
        });
      });
      describe('(@seperator:string)', function () {
        it('Emits "next" notification with @strings concatenated via @seperator when flow emits several @strings', function () {
          var separator = ';',
              strings = ['a', 'b'],
              expectation = strings.join(separator);
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(strings).toString(separator).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var noop = function noop() {};

  var aeroflow = function aeroflow(_aeroflow7, assert) {
    return describe('aeroflow', function () {
      it('Is function', function () {
        return assert.isFunction(_aeroflow7);
      });
      describe('()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(_aeroflow7(), 'Aeroflow');
        });
        it('Returns empty flow emitting "done" notification argumented with "true"', function () {
          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return _aeroflow7().run(fail, done);
          }));
        });
      });
      describe('(@source:aeroflow)', function () {
        it('Returns flow emitting "done" notification argumented with "true" when @source is empty', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7(_aeroflow7.empty).run(noop, done);
          }));
        });
        it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and enumerated till end', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7(_aeroflow7([1, 2])).run(noop, done);
          }));
        });
        it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but not enumerated till end', function () {
          return assert.eventually.isFalse(new Promise(function (done) {
            return _aeroflow7(_aeroflow7([1, 2]).take(1)).run(noop, done);
          }));
        });
        it('Returns flow not emitting "next" notification when @source is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return _aeroflow7(_aeroflow7.empty).run(fail, done);
          }));
        });
        it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', function () {
          var source = [1, 2],
              results = [];
          assert.eventually.sameMembers(new Promise(function (done, fail) {
            return _aeroflow7(_aeroflow7(source)).run(function (result, index) {
              results.push(result);
              if (index === source.length - 1) done(results);
            }, fail);
          }), source);
        });
      });
      describe('(@source:array)', function () {
        it('Returns flow emitting "done" notification argumented with "true" when @source is empty', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7([]).run(noop, done);
          }));
        });
        it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and enumerated till end', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7([1, 2]).run(noop, done);
          }));
        });
        it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but not enumerated till end', function () {
          return assert.eventually.isFalse(new Promise(function (done) {
            return _aeroflow7([1, 2]).take(1).run(noop, done);
          }));
        });
        it('Returns flow not emitting "next" notification when @source is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return _aeroflow7([]).run(fail, done);
          }));
        });
        it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', function () {
          var source = [1, 2],
              results = [];
          assert.eventually.sameMembers(new Promise(function (done, fail) {
            return _aeroflow7(source).run(function (result, index) {
              results.push(result);
              if (index === source.length - 1) done(results);
            }, fail);
          }), source);
        });
      });
      describe('(@source:date)', function () {
        it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7(noop).run(noop, done);
          }));
        });
        it('Returns flow emitting "next" notification argumented with @source', function () {
          var source = new Date();
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(source).run(done, fail);
          }), source);
        });
      });
      describe('(@source:error)', function () {
        it('Returns flow not emitting "next" notification', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return _aeroflow7(new Error('test')).run(fail, done);
          }));
        });
        it('Returns flow emitting "done" notification argumented with @source', function () {
          var source = new Error('test');
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(source).run(fail, done);
          }), source);
        });
      });
      describe('(@source:function)', function () {
        it('Calls @source and passes context data as first argument', function () {
          var data = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(function (context) {
              return done(context);
            }).run(fail, fail, data);
          }), data);
        });
        it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7(noop).run(noop, done);
          }));
        });
        it('Returns flow emitting "done" notification argumented with error thrown by @source', function () {
          var error = new Error('test');
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(function () {
              throw error;
            }).run(fail, done);
          }), error);
        });
        it('Returns flow emitting "next" notification argumented with result of @source invocation', function () {
          var result = 42;
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(function () {
              return result;
            }).run(done, fail);
          }), result);
        });
      });
      describe('(@source:iterable)', function () {
        it('Returns empty flow emitting "done" notification argumented with "true" when source is empty', function () {
          return assert.eventually.isTrue(new Promise(function (done, fail) {
            return _aeroflow7(new Set()).run(fail, done);
          }));
        });
        it('Returns flow eventually emitting "done" notification argumented with "true" when source is not empty', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7(new Set([1, 2])).run(noop, done);
          }));
        });
        it('Returns flow not emitting "next" notification when source is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return _aeroflow7(new Set()).run(fail, done);
          }));
        });
        it('Returns flow emitting several "next" notifications argumented with each subsequent item of @source', function () {
          var source = [1, 2],
              results = [];
          assert.eventually.sameMembers(new Promise(function (done, fail) {
            return _aeroflow7(new Set(source)).run(function (result, index) {
              results.push(result);
              if (index === source.length - 1) done(results);
            }, fail);
          }), source);
        });
      });
      describe('(@source:null)', function () {
        it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7(noop).run(noop, done);
          }));
        });
        it('Returns flow emitting "next" notification with @source', function () {
          var source = null;
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(source).run(done, fail);
          }), source);
        });
      });
      describe('(@source:promise)', function () {
        it('Returns flow eventually emitting "done" notification argumented with "true" when @source resolves', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7(Promise.resolve()).run(noop, done);
          }));
        });
        it('Returns flow emitting "done" notification argumented with error rejected by @source', function () {
          var error = new Error('test'),
              source = Promise.reject(error);
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(source).run(fail, done);
          }), error);
        });
        it('Returns flow emitting "next" notification argumented with result resolved by @source', function () {
          var result = 42,
              source = Promise.resolve(result);
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(source).run(done, fail);
          }), result);
        });
      });
      describe('(@source:string)', function () {
        it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7('test').run(noop, done);
          }));
        });
        it('Returns flow emitting "next" notification argumented with @source', function () {
          var source = 'test';
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(source).run(done, fail);
          }), source);
        });
      });
      describe('(@source:undefined)', function () {
        it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
          return assert.eventually.isTrue(new Promise(function (done) {
            return _aeroflow7(noop).run(noop, done);
          }));
        });
        it('Returns flow emitting "next" notification argumented with @source', function () {
          var source = undefined;
          assert.eventually.strictEqual(new Promise(function (done, fail) {
            return _aeroflow7(source).run(done, fail);
          }), source);
        });
      });
      [emptyGeneratorTests, expandGeneratorTests, justGeneratorTests, randomGeneratorTests, repeatGeneratorTests, averageOperatorTests, catchOperatorTests, coalesceOperatorTests, countOperatorTests, distinctOperatorTests, everyOperatorTests, filterOperatorTests, groupOperatorTests, joinOperatorTests, mapOperatorTests, maxOperatorTests, meanOperatorTests, minOperatorTests, reduceOperatorTests, reverseOperatorTests, skipOperatorTests, sliceOperatorTests, someOperatorTests, sortOperatorTests, sumOperatorTests, takeOperatorTests, tapOperatorTests, toArrayOperatorTests, toMapOperatorTests, toSetOperatorTests, toStringOperatorTests].forEach(function (test) {
        return test(_aeroflow7, assert);
      });
    });
  };

  exports.default = aeroflow;
  module.exports = exports['default'];
});
