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

  var averageOperatorTests = function averageOperatorTests(aeroflow, assert) {
    return describe('Aeroflow#average', function () {
      it('is instance method', function () {
        assert.isFunction(aeroflow.empty.average);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          assert.typeOf(aeroflow.empty.average(), 'Aeroflow');
        });
        it('emits nothing from empty flow', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.average().run(fail, done);
          }));
        });
        it('emits @value from flow emitting single numeric @value', function () {
          var value = 42,
              expectation = value;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(expectation).average().run(done, fail);
          }), expectation);
        });
        it('emits NaN from flow emitting single non-numeric @value', function () {
          var value = 'test';
          return assert.eventually.isNaN(new Promise(function (done, fail) {
            return aeroflow(value).average().run(done, fail);
          }));
        });
        it('emits average from @values from flow emitting several numeric @values', function () {
          var values = [1, 3, 2],
              expectation = values.reduce(function (sum, value) {
            return sum + value;
          }, 0) / values.length;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).average().run(done, fail);
          }), expectation);
        });
        it('emits NaN from @values from flow emitting several non-numeric @values', function () {
          var values = ['a', 'b'];
          return assert.eventually.isNaN(new Promise(function (done, fail) {
            return aeroflow(values).average().run(done, fail);
          }));
        });
      });
    });
  };

  var countOperatorTests = function countOperatorTests(aeroflow, assert) {
    return describe('Aeroflow#count', function () {
      it('is instance method', function () {
        assert.isFunction(aeroflow.empty.count);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          assert.typeOf(aeroflow.empty.count(), 'Aeroflow');
        });
        it('emits 0 from empty flow', function () {
          var expectation = 0;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.count().run(done, fail);
          }), expectation);
        });
        it('emits 1 from flow emitting single value', function () {
          var expectation = 1;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(expectation).count().run(done, fail);
          }), expectation);
        });
        it('emits number of @values from flow emitting several @values', function () {
          var values = [1, 2, 3],
              expectation = values.length;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).count().run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var maxOperatorTests = function maxOperatorTests(aeroflow, assert) {
    return describe('Aeroflow#max', function () {
      it('is instance method', function () {
        assert.isFunction(aeroflow.empty.max);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          assert.typeOf(aeroflow.empty.max(), 'Aeroflow');
        });
        it('emits nothing from empty flow', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.max().run(fail, done);
          }));
        });
        it('emits @value from flow emitting single numeric @value', function () {
          var value = 42,
              expectation = value;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).max().run(done, fail);
          }), expectation);
        });
        it('emits @value from flow emitting single non-numeric @value', function () {
          var value = 'test',
              expectation = value;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).max().run(done, fail);
          }), expectation);
        });
        it('emits maximum of @values from flow emitting several numeric @values', function () {
          var _Math;

          var values = [1, 3, 2],
              expectation = (_Math = Math).max.apply(_Math, values);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).max().run(done, fail);
          }), expectation);
        });
        it('emits maximum of @values from flow emitting several non-numeric @values', function () {
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

  var minOperatorTests = function minOperatorTests(aeroflow, assert) {
    return describe('Aeroflow#min', function () {
      it('is instance method', function () {
        assert.isFunction(aeroflow.empty.min);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          assert.typeOf(aeroflow.empty.min(), 'Aeroflow');
        });
        it('emits nothing from empty flow', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.min().run(fail, done);
          }));
        });
        it('emits @value from flow emitting single @value', function () {
          var value = 42,
              expectation = value;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).min().run(done, fail);
          }), expectation);
        });
        it('emits @value from flow emitting single non-numeric @value', function () {
          var value = 'test',
              expectation = value;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).min().run(done, fail);
          }), expectation);
        });
        it('emits minimum of @values from flow emitting several numeric @values', function () {
          var _Math2;

          var values = [1, 3, 2],
              expectation = (_Math2 = Math).min.apply(_Math2, values);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).min().run(done, fail);
          }), expectation);
        });
        it('emits minimum of @values from flow emitting several non-numeric @values', function () {
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
    return describe('Aeroflow#reduce', function () {
      it('is instance method', function () {
        return assert.isFunction(aeroflow.empty.reduce);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.reduce(), 'Aeroflow');
        });
        it('emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.reduce().run(fail, done);
          }));
        });
        it('emits nothing when flow is not empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow('test').reduce().run(fail, done);
          }));
        });
      });
      describe('(@reducer:function)', function () {
        it('does not call @reducer when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(fail).run(fail, done);
          }));
        });
        it('does not call @reducer when flow emits single value', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(1).reduce(fail).run(done, fail);
          }));
        });
        it('calls @reducer when flow emits serveral values', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(done).run(fail, fail);
          }));
        });
        it('emits error thrown by @reducer', function () {
          var error = new Error('test');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(function () {
              throw error;
            }).run(fail, done);
          }), error);
        });
        it('emits value emitted by flow when flow emits single value', function () {
          var value = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(value).reduce(function () {
              return 'test';
            }).run(done, fail);
          }), value);
        });
        it('emits value returned by @reducer when flow emits several values', function () {
          var value = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2, 3).reduce(function () {
              return value;
            }).run(done, fail);
          }), value);
        });
        it('passes first and second values emitted by flow to @reducer as first and second arguments on first iteration', function () {
          var values = [1, 2];
          return assert.eventually.includeMembers(new Promise(function (done, fail) {
            return aeroflow(values).reduce(function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return done(args);
            }).run(fail, fail);
          }), values);
        });
        it('passes zero-based index of iteration to @reducer as third argument', function () {
          var values = [1, 2, 3, 4];
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).reduce(function (_, __, index) {
              return index;
            }).run(done, fail);
          }), values.length - 2);
        });
        it('passes context data to @function as forth argument', function () {
          var data = {};
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(function (_, __, ___, data) {
              return done(data);
            }).run(fail, fail, data);
          }), data);
        });
      });
      describe('(@reducer:function, @seed:any)', function () {
        it('emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(function () {}, 42).run(fail, done);
          }));
        });
        it('passes @seed to @reducer as first argument on first iteration', function () {
          var seed = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow('test').reduce(done, seed).run(fail, fail);
          }), seed);
        });
      });
      describe('(@reducer:function, @seed:any, true)', function () {
        it('emits @seed when flow is empty', function () {
          var seed = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(function () {}, seed, true).run(done, fail);
          }), seed);
        });
      });
      describe('(@seed:!function)', function () {
        it('emits @seed when flow is empty', function () {
          var seed = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow.empty.reduce(seed).run(done, fail);
          }), seed);
        });
        it('emits @seed when flow is not empty', function () {
          var seed = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(1, 2).reduce(seed).run(done, fail);
          }), seed);
        });
      });
    });
  };

  var toArrayOperatorTests = function toArrayOperatorTests(aeroflow, assert) {
    return describe('Aeroflow#toArray', function () {
      it('is instance method', function () {
        assert.isFunction(aeroflow.empty.toArray);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          assert.typeOf(aeroflow.empty.toArray(), 'Aeroflow');
        });
        it('emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.toArray().run(fail, done);
          }));
        });
        it('emits array of @values when flow emits several @values', function () {
          var values = [1, 2, 1, 3, 2, 3],
              expectation = values;
          return assert.eventually.includeMembers(new Promise(function (done, fail) {
            return aeroflow(values).toArray().run(done, fail);
          }), expectation);
        });
      });
      describe('(true)', function () {
        it('emits an array when flow is empty', function () {
          var expectation = 'Array';
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            return aeroflow.empty.toArray(true).run(done, fail);
          }), expectation);
        });
        it('emits empty array from flow is empty', function () {
          var expectation = 0;
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toArray(true).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var toSetOperatorTests = function toSetOperatorTests(aeroflow, assert) {
    return describe('Aeroflow#toSet', function () {
      it('is instance method', function () {
        assert.isFunction(aeroflow.empty.toSet);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          assert.typeOf(aeroflow.empty.toSet(), 'Aeroflow');
        });
        it('emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.toSet().run(fail, done);
          }));
        });
        it('emits set of unique @values when flow emits several @values', function () {
          var values = [1, 2, 1, 3, 2, 3],
              expectation = Array.from(new Set(values));
          return assert.eventually.includeMembers(new Promise(function (done, fail) {
            return aeroflow(values).toSet().map(function (set) {
              return Array.from(set);
            }).run(done, fail);
          }), expectation);
        });
      });
      describe('(true)', function () {
        it('emits a set when flow is empty', function () {
          var expectation = 'Set';
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            return aeroflow.empty.toSet(true).run(done, fail);
          }), expectation);
        });
        it('emits empty set when flow is empty', function () {
          var expectation = 0;
          return assert.eventually.propertyVal(new Promise(function (done, fail) {
            return aeroflow.empty.toSet(true).run(done, fail);
          }), 'size', expectation);
        });
      });
    });
  };

  var toStringOperatorTests = function toStringOperatorTests(aeroflow, assert) {
    return describe('Aeroflow#toString', function () {
      it('is instance method', function () {
        assert.isFunction(aeroflow.empty.toString);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
        });
        it('emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.toString().run(fail, done);
          }));
        });
        it('emits @string when flow emits single @string', function () {
          var string = 'test',
              expectation = string;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(string).toString().run(done, fail);
          }), expectation);
        });
        it('emits @number converted to string when flow emits single @number', function () {
          var number = 42,
              expectation = '' + number;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(number).toString().run(done, fail);
          }), expectation);
        });
        it('emits @strings concatenated via "," separator when flow emits several @strings', function () {
          var strings = ['a', 'b'],
              expectation = strings.join(',');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(strings).toString().run(done, fail);
          }), expectation);
        });
        it('emits @numbers converted to strings and concatenated via "," separator when flow emits several @numbers', function () {
          var numbers = [100, 500],
              expectation = numbers.join(',');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(numbers).toString().run(done, fail);
          }), expectation);
        });
      });
      describe('(true)', function () {
        it('emits string when flow empty', function () {
          var expectation = 'String';
          return assert.eventually.typeOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString(true).run(done, fail);
          }), expectation);
        });
        it('emits empty string when flow is empty', function () {
          var expectation = 0;
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString(true).run(done, fail);
          }), expectation);
        });
      });
      describe('(@string)', function () {
        it('emits nothing when flow is empty', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.toString(';').run(fail, done);
          }));
        });
        it('emits @strings concatenated via @string separator when flow emits several @strings', function () {
          var separator = ';',
              strings = ['a', 'b'],
              expectation = strings.join(separator);
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(strings).toString(separator).run(done, fail);
          }), expectation);
        });
      });
      describe('(@string, true)', function () {
        it('emits empty string when flow is empty', function () {
          var delimiter = ';',
              expectation = 0;
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString(delimiter, true).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var tests = [averageOperatorTests, countOperatorTests, maxOperatorTests, minOperatorTests, reduceOperatorTests, toArrayOperatorTests, toSetOperatorTests, toStringOperatorTests];

  var aeroflow = function aeroflow(_aeroflow, assert) {
    return tests.forEach(function (test) {
      return test(_aeroflow, assert);
    });
  };

  exports.default = aeroflow;
  module.exports = exports['default'];
});
