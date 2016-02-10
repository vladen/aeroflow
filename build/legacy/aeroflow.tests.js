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

  var toStringOperatorTests = function toStringOperatorTests(aeroflow, assert) {
    return describe('Aeroflow#toString', function () {
      it('is instance method', function () {
        return assert.isFunction(aeroflow.empty.toString);
      });
      describe('()', function () {
        it('returns instance of Aeroflow', function () {
          return assert.typeOf(aeroflow.empty.toString(), 'Aeroflow');
        });
        it('emits a string', function (done) {
          aeroflow.empty.toString().run(function (result) {
            return done(assert.isString(result));
          });
        });
        it('emits empty string from an empty flow', function (done) {
          aeroflow.empty.toString().run(function (result) {
            return done(assert.lengthOf(result, 0));
          });
        });
        it('emits @string from a flow emitting single @string', function (done) {
          var string = 'test';
          aeroflow(string).toString().run(function (result) {
            return done(assert.strictEqual(result, string));
          });
        });
        it('emits @number converted to string from a flow emitting single @number', function (done) {
          var number = 42;
          aeroflow(number).toString().run(function (result) {
            return done(assert.strictEqual(result, '' + number));
          });
        });
        it('emits @strings concatenated via "," separator from a flow emitting @strings', function (done) {
          var strings = ['a', 'b'];
          aeroflow(strings).toString().run(function (result) {
            return done(assert.strictEqual(result, strings.join(',')));
          });
        });
        it('emits @numbers converted to strings and concatenated via "," separator from a flow emitting @numbers', function (done) {
          var numbers = [100, 500];
          aeroflow(numbers).toString().run(function (result) {
            return done(assert.strictEqual(result, numbers.join(',')));
          });
        });
      });
      describe('(true)', function () {
        it('emits nothing from an empty flow', function (done) {
          aeroflow.empty.toString(true).run(function (result) {
            return done(assert(false));
          }, function (result) {
            return done();
          });
        });
      });
      describe('(@string)', function () {
        it('emits @strings concatenated via @string separator from a flow emitting @strings', function (done) {
          var separator = ';',
              strings = ['a', 'b'];
          aeroflow(strings).toString(separator).run(function (result) {
            return done(assert.strictEqual(result, strings.join(separator)));
          });
        });
      });
      describe('(@string, true)', function () {
        it('emits nothing from an empty flow', function (done) {
          aeroflow.empty.toString(';', true).run(function (result) {
            return done(assert(false));
          }, function (result) {
            return done();
          });
        });
      });
    });
  };

  var tests = [toStringOperatorTests];

  var aeroflow = function aeroflow(_aeroflow, assert) {
    return tests.forEach(function (test) {
      return test(_aeroflow, assert);
    });
  };

  exports.default = aeroflow;
  module.exports = exports['default'];
});
