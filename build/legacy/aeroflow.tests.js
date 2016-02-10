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
        it('emits @value from flow emitting single @value', function () {
          var expectation = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(expectation).average().run(done, fail);
          }), expectation);
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
        it('emits @value from flow emitting single @value', function () {
          var expectation = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(expectation).max().run(done, fail);
          }), expectation);
        });
        it('emits maximum from @values from flow emitting several numeric @values', function () {
          var _Math;

          var values = [1, 3, 2],
              expectation = (_Math = Math).max.apply(_Math, values);

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
          var expectation = 42;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(expectation).min().run(done, fail);
          }), expectation);
        });
        it('emits maximum from @values from flow emitting several numeric @values', function () {
          var _Math2;

          var values = [1, 3, 2],
              expectation = (_Math2 = Math).min.apply(_Math2, values);

          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(values).min().run(done, fail);
          }), expectation);
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
        it('emits nothing from empty flow', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.toString().run(fail, done);
          }));
        });
        it('emits @string from flow emitting single @string', function () {
          var expectation = 'test';
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(expectation).toString().run(done, fail);
          }), expectation);
        });
        it('emits @number converted to string from flow emitting single @number', function () {
          var number = 42,
              expectation = '' + number;
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(number).toString().run(done, fail);
          }), expectation);
        });
        it('emits @strings concatenated via "," separator from flow emitting several @strings', function () {
          var strings = ['a', 'b'],
              expectation = strings.join(',');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(strings).toString().run(done, fail);
          }), expectation);
        });
        it('emits @numbers converted to strings and concatenated via "," separator from flow emitting several @numbers', function () {
          var numbers = [100, 500],
              expectation = numbers.join(',');
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(numbers).toString().run(done, fail);
          }), expectation);
        });
      });
      describe('(true)', function () {
        it('emits empty string from empty flow', function () {
          var expectation = 0;
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString(true).run(done, fail);
          }), expectation);
        });
      });
      describe('(@string)', function () {
        it('emits nothing from empty flow', function () {
          return assert.isFulfilled(new Promise(function (done, fail) {
            return aeroflow.empty.toString(';').run(fail, done);
          }));
        });
        it('emits @strings concatenated via @string separator from flow emitting several @strings', function () {
          var separator = ';',
              strings = ['a', 'b'],
              expectation = strings.join(separator);
          return assert.eventually.strictEqual(new Promise(function (done, fail) {
            return aeroflow(strings).toString(separator).run(done, fail);
          }), expectation);
        });
      });
      describe('(@string, true)', function () {
        it('emits empty string from empty flow', function () {
          var delimiter = ';',
              expectation = 0;
          return assert.eventually.lengthOf(new Promise(function (done, fail) {
            return aeroflow.empty.toString(delimiter, true).run(done, fail);
          }), expectation);
        });
      });
    });
  };

  var tests = [averageOperatorTests, countOperatorTests, maxOperatorTests, minOperatorTests, toStringOperatorTests];

  var aeroflow = function aeroflow(_aeroflow, assert) {
    return tests.forEach(function (test) {
      return test(_aeroflow, assert);
    });
  };

  exports.default = aeroflow;
  module.exports = exports['default'];
});
