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

    var staticMethodsTests = function staticMethodsTests(aeroflow, assert) {
        return describe('aeroflow', function () {
            it('is function', function () {
                return assert.isFunction(aeroflow);
            });
            describe('#empty', function () {
                it('is static property returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.empty, 'Aeroflow');
                });
                it('emitting empty flow', function (done) {
                    var result = undefined;
                    aeroflow.empty.run(function (value) {
                        return result = value;
                    });
                    setImmediate(function () {
                        assert.isUndefined(result);
                        done();
                    });
                });
            });
            describe('#expand()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.expand);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.expand(), 'Aeroflow');
                });
            });
            describe('#expand(@function)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.expand(function () {
                        return true;
                    }, 1), 'Aeroflow');
                });
            });
            describe('#just()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.just);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.just(), 'Aeroflow');
                });
                it('emitting empty flow', function (done) {
                    var actual = undefined;
                    aeroflow.just().run(function (value) {
                        return value = actual;
                    });
                    setImmediate(function () {
                        assert.isUndefined(actual);
                        done();
                    });
                });
            });
            describe('#just(@*)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.just(function () {
                        return true;
                    }), 'Aeroflow');
                });
                describe('@function', function () {
                    it('emitting single function', function (done) {
                        var expected = function expected() {},
                            actual = undefined;

                        aeroflow.just(expected).run(function (value) {
                            return actual = value;
                        });
                        setImmediate(function () {
                            assert.strictEqual(actual, expected);
                            done();
                        });
                    });
                });
                describe('@Promise', function () {
                    it('emitting single promise', function (done) {
                        var expected = Promise.resolve([1, 2, 3]),
                            actual = undefined;
                        aeroflow.just(expected).run(function (value) {
                            return actual = value;
                        });
                        setImmediate(function () {
                            assert.strictEqual(actual, expected);
                            done();
                        });
                    });
                });
            });
            describe('#random()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.random);
                });
                it('emitting random decimals within 0 and 1', function (done) {
                    var actual = [];
                    aeroflow.random().take(10).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        actual.forEach(function (item) {
                            return assert.isTrue(!Number.isInteger(item) && item >= 0 && item < 1);
                        });
                        done();
                    });
                });
            });
            describe('#random(@Number, @Number)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.random(0, 1), 'Aeroflow');
                });
                describe('@Number, @Number', function () {
                    it('emitting random integers within a range', function (done) {
                        var limit = 10,
                            max = 10,
                            min = 1,
                            actual = [];
                        aeroflow.random(min, max).take(limit).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item) {
                                return assert.isTrue(Number.isInteger(item) && item >= min && item < max);
                            });
                            done();
                        });
                    });
                    it('emitting random decimals within a range', function (done) {
                        var limit = 10,
                            max = 10.1,
                            min = 1.1,
                            actual = [];
                        aeroflow.random(min, max).take(limit).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item) {
                                return assert.isTrue(!Number.isInteger(item) && item >= min && item < max);
                            });
                            done();
                        });
                    });
                });
            });
            describe('#range()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.range);
                });
                it('emitting ascending sequential starting from 0', function (done) {
                    var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        actual = [];
                    aeroflow.range().take(10).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        actual.forEach(function (item, index) {
                            return assert.strictEqual(item, expected[index]);
                        });
                        done();
                    });
                });
            });
            describe('#range(@Number, @Number, @Number)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.random(0, 1), 'Aeroflow');
                });
                describe('@Number', function () {
                    it('emitting ascending sequential starting from passed number', function (done) {
                        var expected = [5, 6, 7, 8],
                            actual = [];
                        aeroflow.range(expected[0]).take(4).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
                describe('@Number, @Number', function () {
                    it('emitting ascending sequential integers within a range', function (done) {
                        var expected = [5, 6, 7, 8],
                            start = expected[0],
                            end = expected[expected.length - 1],
                            actual = [];
                        aeroflow.range(start, end).take(4).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                    it('emitting descending sequential integers within a range', function (done) {
                        var expected = [8, 7, 6, 5],
                            start = expected[0],
                            end = expected[expected.length - 1],
                            actual = [];
                        aeroflow.range(start, end).take(4).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
                describe('@Number, @Number, @Number', function () {
                    it('emitting ascending sequential integers within a stepped range', function (done) {
                        var expected = [0, 2, 4, 6],
                            start = expected[0],
                            end = expected[expected.length - 1],
                            step = 2,
                            actual = [];
                        aeroflow.range(start, end, step).take(10).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                    it('emitting descending sequential integers within a stepped range', function (done) {
                        var expected = [6, 4, 2, 0],
                            start = expected[0],
                            end = expected[expected.length - 1],
                            step = -2,
                            actual = [];
                        aeroflow.range(start, end, step).take(10).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
            });
            describe('#repeat()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.repeat);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.repeat(), 'Aeroflow');
                });
            });
            describe('#repeat(@function)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.repeat(function () {
                        return true;
                    }), 'Aeroflow');
                });
                describe('@function', function () {
                    it('emitting geometric progression', function (done) {
                        var repeater = function repeater(index) {
                            return index * 2;
                        },
                            expected = [0, 2, 4, 6, 8],
                            actual = [];

                        aeroflow.repeat(repeater).take(expected.length).run(function (value) {
                            return actual.push(value);
                        });
                        setImmediate(function () {
                            actual.forEach(function (item, index) {
                                return assert.strictEqual(item, expected[index]);
                            });
                            done();
                        });
                    });
                });
            });
        });
    };

    var aeroflow = function aeroflow(_aeroflow, assert) {
        staticMethodsTests(_aeroflow, assert);
    };

    exports.default = aeroflow;
    module.exports = exports['default'];
});
