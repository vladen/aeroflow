(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflowTests = factory());
}(this, function () { 'use strict';

  var toStringOperatorTests = (aeroflow, assert) => describe('Aeroflow#toString', () => {
    it('is instance method', () =>
      assert.isFunction(aeroflow.empty.toString));

    describe('()', () => {
      it('returns instance of Aeroflow', () =>
        assert.typeOf(aeroflow.empty.toString(), 'Aeroflow'));
      it('emits a string', done => {
        aeroflow.empty.toString().run(
          result => done(assert.isString(result)));
      });
      it('emits empty string from an empty flow', done => {
        aeroflow.empty.toString().run(
          result => done(assert.lengthOf(result, 0)));
      });
      it('emits @string from a flow emitting single @string', done => {
        const string = 'test';
        aeroflow(string).toString().run(
          result => done(assert.strictEqual(result, string)));
      });
      it('emits @number converted to string from a flow emitting single @number', done => {
        const number = 42;
        aeroflow(number).toString().run(
          result => done(assert.strictEqual(result, '' + number)));
      });
      it('emits @strings concatenated via "," separator from a flow emitting @strings', done => {
        const strings = ['a', 'b'];
        aeroflow(strings).toString().run(
          result => done(assert.strictEqual(result, strings.join(','))));
      });
      it('emits @numbers converted to strings and concatenated via "," separator from a flow emitting @numbers', done => {
        const numbers = [100, 500];
        aeroflow(numbers).toString().run(
          result => done(assert.strictEqual(result, numbers.join(','))));
      });
    });

    describe('(true)', () => {
      it('emits nothing from an empty flow', done => {
        aeroflow.empty.toString(true).run(
          result => done(assert(false)),
          result => done());
      });
    });

    describe('(@string)', () => {
      it('emits @strings concatenated via @string separator from a flow emitting @strings', done => {
        const separator = ';', strings = ['a', 'b'];
        aeroflow(strings).toString(separator).run(
          result => done(assert.strictEqual(result, strings.join(separator))));
      });
    });

    describe('(@string, true)', () => {
      it('emits nothing from an empty flow', done => {
        aeroflow.empty.toString(';', true).run(
          result => done(assert(false)),
          result => done());
      });
    });

  });

  const tests = [
    // factoryTests,
    // staticMethodsTests,
    // instanceTests,
    toStringOperatorTests
  ];

  var aeroflow = (aeroflow, assert) => tests.forEach(test => test(aeroflow, assert));

  return aeroflow;

}));