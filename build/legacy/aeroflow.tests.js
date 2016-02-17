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
    global.aeroflowTests = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var emptyTests = function emptyTests(aeroflow, assert) {
    return describe('empty', function () {
      it('Is static property', function () {
        return assert.isDefined(aeroflow.empty);
      });
      describe('empty', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty, 'Aeroflow');
        });
        it('Returns instance of Aeroflow emitting nothing ("done" event only)', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.run(fail, done);
          }));
        });
      });
    });
  };

  var noop = function noop() {};

  var expandTests = function expandTests(aeroflow, assert) {
    return describe('expand', function () {
      it('Is static method', function () {
        return assert.isFunction(aeroflow.expand);
      });
      describe('expand()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.expand(), 'Aeroflow');
        });
      });
      describe('expand(@expander:function)', function () {
        it('Calls @expander', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.expand(done).take(1).run(fail, fail);
          }));
        });
        it('Passes undefined to @expander as first argument because no seed is specified', function () {
          return assert.eventually.isUndefined(new Promise(function (done, fail) {
            return aeroflow.expand(done).take(1).run(fail, fail);
          }));
        });
        it('Passes value returned by @expander to @expander again as first argument on next iteration', function () {
          var expectation = {};
          var iteration = 0;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.expand(function (value) {
              return iteration++ ? done(value) : expectation;
            }).take(2).run(noop, fail);
          }), expectation);
        });
        it('Passes zero-based index of iteration to @expander as second argument', function () {
          var indices = [],
              expectation = [0, 1, 2, 3];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow.expand(function (_, index) {
              return indices.push(index);
            }).take(expectation.length).run(noop, function () {
              return done(indices);
            });
          }), expectation);
        });
        it('Passes context data to @expander as third argument', function () {
          var expectation = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.expand(function (_, __, data) {
              return done(data);
            }).take(1).run(fail, fail, expectation);
          }), expectation);
        });
        it('Emits value returned by @expander', function () {
          var expectation = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.expand(function () {
              return expectation;
            }).take(1).run(done, fail);
          }), expectation);
        });
      });
      describe('expand(@expander:function, @seed:any)', function () {
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

  var justTests = function justTests(aeroflow, assert) {
    return describe('just', function () {
      it('Is static method', function () {
        return assert.isFunction(aeroflow.just);
      });
      describe('just()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.just(), 'Aeroflow');
        });
        it('Returns instance of Aeroflow emitting single undefined value', function () {
          var expectation = undefined;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.just().run(done, fail);
          }), expectation);
        });
      });
      describe('just(@array)', function () {
        it('Returns instance of Aeroflow emitting @array as is', function () {
          var array = [1, 2, 3],
              expectation = array;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.just(array).run(done, fail);
          }), expectation);
        });
      });
      describe('just(@iterable)', function () {
        it('Returns instance of Aeroflow emitting @iterable as is', function () {
          var iterable = new Set([1, 2, 3]),
              expectation = iterable;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.just(iterable).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var tests$1 = [emptyTests, expandTests, justTests];

  var staticMethodsTests = function staticMethodsTests(aeroflow, assert) {
    return describe('static members', function () {
      return tests$1.forEach(function (test) {
        return test(aeroflow, assert);
      });
    });
  };

  var averageTests = function averageTests(aeroflow, assert) {
    return describe('average', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.average);
      });
      describe('average()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.average().run(fail, done);
          }));
        });
        it('Emits @value when flow emits single numeric @value', function () {
          var value = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).average().run(done, fail);
          }), value);
        });
        it('Emits NaN when flow emits single not numeric @value', function () {
          return assert.eventually.isNaN(new Promise(function (done, fail) {
            return aeroflow('test').average().run(done, fail);
          }));
        });
        it('Emits average of @values when flow emits several numeric @values', function () {
          var values = [1, 3, 2],
              expectation = values.reduce(function (sum, value) {
            return sum + value;
          }, 0) / values.length;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).average().run(done, fail);
          }), expectation);
        });
        it('Emits NaN when flow emits several not numeric @values', function () {
          return assert.eventually.isNaN(new Promise(function (done, fail) {
            return aeroflow('a', 'b').average().run(done, fail);
          }));
        });
      });
    });
  };

  var catchTests = function catchTests(aeroflow, assert) {
    return describe('catch', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.catch);
      });
      describe('catch()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.catch(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
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
      describe('catch(@alternative:function)', function () {
        it('Does not call @alternative when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.catch(fail).run(fail, done);
          }));
        });
        it('Does not call @alternative when flow does not emit error', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(1).catch(fail).run(done, fail);
          }));
        });
        it('Calls @alternative when flow emits error', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(new Error('tests')).catch(done).run(fail, fail);
          }));
        });
        it('Emits value returned by @alternative when flow emits error', function () {
          var alternative = 'caught';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(new Error('test')).catch(function () {
              return alternative;
            }).run(done, fail);
          }), alternative);
        });
      });
      describe('catch(@alternative:!function)', function () {
        it('Emits @alternative value instead of error emitted by flow', function () {
          var alternative = 'caught';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(new Error('test')).catch(alternative).run(done, fail);
          }), alternative);
        });
      });
    });
  };

  var countTests = function countTests(aeroflow, assert) {
    return describe('count', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.count);
      });
      describe('count()', function () {
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

  var filterTests = function filterTests(aeroflow, assert) {
    return describe('filter', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.filter);
      });
      describe('filter()', function () {
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
      describe('filter(@condition:function)', function () {
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
          var data = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow('test').filter(function (_, __, data) {
              return done(data);
            }).run(fail, fail, data);
          }), data);
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
      describe('filter(@condition:regex)', function () {
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
      describe('filter(@condition:!function!regex)', function () {
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

  var maxTests = function maxTests(aeroflow, assert) {
    return describe('max', function () {
      it('Is instance method', function () {
        assert.isFunction(aeroflow.empty.max);
      });
      describe('max()', function () {
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

  var minTests = function minTests(aeroflow, assert) {
    return describe('min', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.min);
      });
      describe('min()', function () {
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

  var reduceTests = function reduceTests(aeroflow, assert) {
    return describe('reduce', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.reduce);
      });
      describe('reduce()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow');
        });
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.reduce().run(fail, done);
          }));
        });
        it('Emits nothing ("done" event only) when flow is not empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').reduce().run(fail, done);
          }));
        });
      });
      describe('reduce(@reducer:function)', function () {
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
          var expectation = 0;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(function (_, __, index) {
              return done(index);
            }).run(fail, fail);
          }), expectation);
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
      describe('reduce(@reducer:function, @seed)', function () {
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(function () {}, 42).run(fail, done);
          }));
        });
        it('Passes @seed to @reducer as first argument on first iteration', function () {
          var seed = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow('test').reduce(done, seed).run(fail, fail);
          }), seed);
        });
      });
      describe('reduce(@reducer:function, @seed, true)', function () {
        it('Emits @seed value when flow is empty', function () {
          var seed = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(function () {}, seed, true).run(done, fail);
          }), seed);
        });
      });
      describe('reduce(@seed:!function)', function () {
        it('Emits @seed value when flow is empty', function () {
          var seed = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(seed).run(done, fail);
          }), seed);
        });
        it('Emits @seed value when flow is not empty', function () {
          var seed = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(seed).run(done, fail);
          }), seed);
        });
      });
    });
  };

  var toStringTests = function toStringTests(aeroflow, assert) {
    return describe('toString', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.toString);
      });
      describe('toString()', function () {
        it('Returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
        });
        it('Emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.toString().run(fail, done);
          }));
        });
        it('Emits @string when flow emits single @string', function () {
          var string = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(string).toString().run(done, fail);
          }), string);
        });
        it('Emits @number converted to string when flow emits single @number', function () {
          var number = 42,
              expectation = '' + number;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(number).toString().run(done, fail);
          }), expectation);
        });
        it('Emits @strings concatenated via "," separator when flow emits several @strings', function () {
          var strings = ['a', 'b'],
              expectation = strings.join(',');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(strings).toString().run(done, fail);
          }), expectation);
        });
        it('Emits @numbers converted to strings and concatenated via "," separator when flow emits several @numbers', function () {
          var numbers = [100, 500],
              expectation = numbers.join(',');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(numbers).toString().run(done, fail);
          }), expectation);
        });
      });
      describe('toString(true)', function () {
        it('Emits string when flow empty', function () {
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString(true).run(done, fail);
          }), 'String');
        });
        it('Emits empty string when flow is empty', function () {
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString(true).run(done, fail);
          }), 0);
        });
      });
      describe('toString(@string)', function () {
        it('Emits nothing ("done" event only) when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.toString(';').run(fail, done);
          }));
        });
        it('Emits @strings concatenated via @string separator when flow emits several @strings', function () {
          var separator = ';',
              strings = ['a', 'b'],
              expectation = strings.join(separator);
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(strings).toString(separator).run(done, fail);
          }), expectation);
        });
      });
      describe('toString(@string, true)', function () {
        it('Emits empty string when flow is empty', function () {
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString(';', true).run(done, fail);
          }), 0);
        });
      });
    });
  };

  var everyTests = function everyTests(aeroflow, assert) {
    return describe('every', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.every);
      });
      describe('every()', function () {
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
      describe('every(@condition:function)', function () {
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
      describe('every(@condition:regex)', function () {
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
      describe('every(@condition:!function!regex)', function () {
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

  var someTests = function someTests(aeroflow, assert) {
    return describe('some', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.some);
      });
      describe('some()', function () {
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
      describe('every(@condition:function)', function () {
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
      describe('some(@condition:regex)', function () {
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
      describe('some(@condition:!function!regex)', function () {
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

  var distinctTests = function distinctTests(aeroflow, assert) {
    return describe('distinct', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.distinct);
      });
      describe('distinct()', function () {
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
      describe('distinct(true)', function () {
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

  var takeTests = function takeTests(aeroflow, assert) {
    return describe('take', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.take);
      });
      describe('take()', function () {
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
      describe('take(@condition:function)', function () {
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
      describe('take(@condition:number)', function () {
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
      describe('take(@condition:!function!number)', function () {
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

  var skipTests = function skipTests(aeroflow, assert) {
    return describe('skip', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.skip);
      });
      describe('skip()', function () {
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
      describe('skip(@condition:function)', function () {
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
      describe('skip(@condition:number)', function () {
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
      describe('skip(@condition:!function!number)', function () {
        it('Emits nothing when @condition is non-numeric', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').skip('test').run(fail, done);
          }));
        });
      });
    });
  };

  var sortTests = function sortTests(aeroflow, assert) {
    return describe('sort', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.sort);
      });
      describe('sort()', function () {
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
      describe('sort(@comparer:string)', function () {
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
      describe('sort(@comparer:boolean)', function () {
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
      describe('sort(@comparer:number)', function () {
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
      describe('sort(@comparer:function)', function () {
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
      describe('sort(@comparers:array)', function () {
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

  var sliceTests = function sliceTests(aeroflow, assert) {
    return describe('slice', function () {
      it('Is instance method', function () {
        assert.isFunction(aeroflow.empty.slice);
      });
      describe('slice()', function () {
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
      describe('slice(@start:number)', function () {
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
      describe('slice(@start:!number)', function () {
        it('Emits @values when passed non-numerical @start', function () {
          var values = [1, 2];
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            return aeroflow(values).slice('test').toArray().run(done, fail);
          }), values);
        });
      });
      describe('slice(@start:number, @end:number)', function () {
        it('Emits @values within @start and @end indexes from the start', function () {
          var values = [1, 2, 3],
              slice = [1, 2],
              expectation = values.slice.apply(values, slice);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            var _aeroflow;

            return (_aeroflow = aeroflow(values)).slice.apply(_aeroflow, slice).toArray().run(done, fail);
          }), expectation);
        });
        it('Emits @values within @start and @end indexes from the end', function () {
          var values = [1, 2, 3],
              slice = [-2, -1],
              expectation = values.slice.apply(values, slice);
          return assert.eventually.sameMembers(new Promise(function (done, fail) {
            var _aeroflow2;

            return (_aeroflow2 = aeroflow(values)).slice.apply(_aeroflow2, slice).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('slice(@start:number, @end:!number)', function () {
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

  var sumTests = function sumTests(aeroflow, assert) {
    return describe('sum', function () {
      it('Is instance method', function () {
        return assert.isFunction(aeroflow.empty.sum);
      });
      describe('sum()', function () {
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

  var tests$2 = [averageTests, catchTests, countTests, distinctTests, everyTests, filterTests, maxTests, minTests, reduceTests, someTests, takeTests, skipTests, sortTests, sliceTests, sumTests, toStringTests];

  var instanceMethodsTests = function instanceMethodsTests(aeroflow, assert) {
    return describe('instance members', function () {
      return tests$2.forEach(function (test) {
        return test(aeroflow, assert);
      });
    });
  };

  var tests = [staticMethodsTests, instanceMethodsTests];

  var aeroflow = function aeroflow(_aeroflow3, assert) {
    return tests.forEach(function (test) {
      return test(_aeroflow3, assert);
    });
  };

  exports.default = aeroflow;
  module.exports = exports['default'];
});
