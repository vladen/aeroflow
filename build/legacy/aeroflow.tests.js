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

    var factoryTests = function factoryTests(aeroflow, assert) {
        return describe('aeroflow', function () {
            it('is function', function () {
                assert.isFunction(aeroflow);
            });
            describe('aeroflow()', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(), 'Aeroflow');
                });
                describe('#sources', function () {
                    it('is initially empty array', function () {
                        assert.strictEqual(aeroflow().sources.length, 0);
                    });
                });
                describe('#emitter', function () {
                    it('is function', function () {
                        assert.isFunction(aeroflow().emitter);
                    });
                });
            });
            describe('aeroflow(@Array)', function (done) {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow([1, 2]), 'Aeroflow');
                });
                describe('@Array', function () {
                    it('emitting array items', function (done) {
                        var expected = ['str', new Date(), {}, 2],
                            actual = [];
                        aeroflow(expected).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            return done(assert.sameMembers(actual, expected));
                        });
                    });
                });
            });
            describe('aeroflow(@Map)', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(new Map([[1, 2], [2, 1]])), 'Aeroflow');
                });
                describe('@Map', function () {
                    it('emitting map entries', function (done) {
                        var expected = [['a', 1], ['b', 2]],
                            actual = [];
                        aeroflow(new Map(expected)).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            expected.forEach(function (item, index) {
                                return assert.sameMembers(actual[index], expected[index]);
                            });
                            done();
                        });
                    });
                });
            });
            describe('aerflow(@Set)', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(new Set([1, 2])), 'Aeroflow');
                });
                describe('@Set', function () {
                    it('emitting set keys', function (done) {
                        var expected = ['a', 'b'],
                            actual = [];
                        aeroflow(new Set(expected)).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            return done(assert.sameMembers(actual, expected));
                        });
                    });
                });
            });
            describe('aeroflow(@Function)', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(function () {
                        return true;
                    }), 'Aeroflow');
                });
                describe('@Function', function () {
                    it('emitting scalar value returned by function', function (done) {
                        var expected = 'test tester',
                            actual = undefined;
                        aeroflow(function () {
                            return expected;
                        }).run(function (value) {
                            return actual = value;
                        });
                        setImmediate(function () {
                            return done(assert.strictEqual(actual, expected));
                        });
                    });
                });
            });
            describe('Aeroflow(@Promise)', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(Promise.resolve({})), 'Aeroflow');
                });
                describe('@Promise', function () {
                    it('emitting array resolved by promise', function (done) {
                        var expected = ['a', 'b'],
                            actual = undefined;
                        aeroflow(Promise.resolve(expected)).run(function (value) {
                            return assert.strictEqual(value, expected);
                        }, function () {
                            return done();
                        });
                    });
                });
            });
        });
    };

    var aeroflow = function aeroflow(_aeroflow, assert) {
        factoryTests(_aeroflow, assert);
    };

    exports.default = aeroflow;
    module.exports = exports['default'];
});
