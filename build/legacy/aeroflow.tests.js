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
                    var invoked = false;
                    aeroflow.empty.run(function (value) {
                        return invoked = true;
                    });
                    setImmediate(function () {
                        return done(assert.isFalse(invoked));
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
                describe('@function', function () {
                    it('emitting geometric progression', function (done) {
                        var expander = function expander(value) {
                            return value * 2;
                        },
                            actual = [],
                            seed = 1,
                            expected = [2, 4, 8],
                            index = 0;

                        aeroflow.expand(expander, seed).take(expected.length).run(function (value) {
                            actual.push(value);
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
            describe('#just()', function () {
                it('is static method', function () {
                    return assert.isFunction(aeroflow.just);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow.just(), 'Aeroflow');
                });
                it('emitting empty flow', function (done) {
                    var invoked = false;
                    aeroflow.just().run(function (value) {
                        return invoked = true;
                    });
                    setImmediate(function () {
                        assert.isTrue(invoked);
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
                            return done(assert.strictEqual(actual, expected));
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
                            return done(assert.strictEqual(actual, expected));
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

    var factoryTests = function factoryTests(aeroflow, assert) {
        return describe('aeroflow', function () {
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

    var instanceTests = function instanceTests(aeroflow, assert) {
        return describe('Aeroflow', function () {
            describe('#max()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.max);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().max(), 'Aeroflow');
                });
                it('emitting undefined if empty flow', function (done) {
                    var invoked = false;
                    aeroflow().max().run(function (value) {
                        return invoked = true;
                    });
                    setImmediate(function () {
                        return done(assert.isFalse(invoked));
                    });
                });
                it('emitting valid result for non-empty flow', function (done) {
                    var _Math;

                    var values = [1, 9, 2, 8, 3, 7, 4, 6, 5],
                        expected = (_Math = Math).max.apply(_Math, values),
                        actual = undefined;

                    aeroflow(values).max().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#min()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.min);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().min(), 'Aeroflow');
                });
                it('does not invoke if empty flow', function (done) {
                    var invoked = false;
                    aeroflow.empty.min().run(function (value) {
                        return invoked = true;
                    });
                    setImmediate(function () {
                        return done(assert.isFalse(invoked));
                    });
                });
                it('emitting valid result for non-empty flow', function (done) {
                    var _Math2;

                    var values = [1, 9, 2, 8, 3, 7, 4, 6, 5],
                        expected = (_Math2 = Math).min.apply(_Math2, values),
                        actual = undefined;

                    aeroflow(values).min().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#skip()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.skip);
                });
                it('emitting undefined if called without param', function (done) {
                    var invoked = false;
                    aeroflow([1, 2, 3, 4]).skip().run(function (value) {
                        return invoked = true;
                    });
                    setImmediate(function () {
                        return done(assert.isFalse(invoked));
                    });
                });
            });
            describe('#skip(@Number)', function () {
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().skip(1), 'Aeroflow');
                });
                it('skips provided number of values from start', function (done) {
                    var values = [1, 2, 3, 4],
                        skip = 2,
                        actual = [];
                    aeroflow(values).skip(skip).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        return done(assert.sameMembers(actual, values.slice(skip)));
                    });
                });
                it('emitting values skipped provided number of values from end', function (done) {
                    var values = [1, 2, 3, 4],
                        skip = 2,
                        actual = [];
                    aeroflow(values).skip(-skip).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        return done(assert.sameMembers(actual, values.slice(0, skip)));
                    });
                });
            });
            describe('#skip(@Function)', function () {
                it('emitting remained values when provided function returns false', function (done) {
                    var values = [1, 2, 3, 4],
                        skip = Math.floor(values.length / 2),
                        limiter = function limiter(value, index) {
                        return index < skip;
                    },
                        actual = [];

                    aeroflow(values).skip(limiter).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        return done(assert.sameMembers(actual, values.slice(skip)));
                    });
                });
            });
            describe('#tap()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.tap);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().tap(), 'Aeroflow');
                });
            });
            describe('#tap(@Function)', function () {
                it('intercepts each emitted value', function (done) {
                    var expected = [0, 1, 2],
                        actual = [];
                    aeroflow(expected).tap(function (value) {
                        return actual.push(value);
                    }).run();
                    setImmediate(function () {
                        actual.forEach(function (item, i) {
                            return assert.strictEqual(item, expected[i]);
                        });
                        done();
                    });
                });
            });
            describe('#toArray()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.toArray);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().toArray(), 'Aeroflow');
                });
                it('emitting empty Array if empty flow', function (done) {
                    var actual = undefined;
                    aeroflow().toArray().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        assert.isArray(actual);
                        assert.strictEqual(actual.length, 0);
                        done();
                    });
                });
                it('emitting single array containing all values', function (done) {
                    var expected = [1, 2, 3],
                        actual = undefined;
                    aeroflow.apply(undefined, expected).toArray().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        assert.isArray(actual);
                        assert.sameMembers(actual, expected);
                        done();
                    });
                });
            });
            describe('#toMap()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.toMap);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().toMap(), 'Aeroflow');
                });
                it('emitting empty Map if empty flow', function (done) {
                    var actual = undefined;
                    aeroflow().toMap().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        assert.typeOf(actual, 'Map');
                        assert.strictEqual(actual.size, 0);
                        done();
                    });
                });
                it('emitting single map containing all values', function (done) {
                    var expected = [1, 2, 3],
                        actual = undefined;
                    aeroflow.apply(undefined, expected).toMap().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        assert.typeOf(actual, 'Map');
                        assert.includeMembers(Array.from(actual.keys()), expected);
                        assert.includeMembers(Array.from(actual.values()), expected);
                        done();
                    });
                });
            });
            describe('#toSet()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.toSet);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().toSet(), 'Aeroflow');
                });
                it('emitting empty Set if empty flow', function (done) {
                    var actual = undefined;
                    aeroflow().toSet().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        assert.typeOf(actual, 'Set');
                        assert.strictEqual(actual.size, 0);
                        done();
                    });
                });
                it('emitting single set containing all values', function (done) {
                    var expected = [0, 1, 2, 3],
                        actual = undefined;
                    aeroflow.apply(undefined, expected.concat(expected)).toSet().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        assert.typeOf(actual, 'Set');
                        assert.sameMembers(Array.from(actual.keys()), expected);
                        assert.sameMembers(Array.from(actual.values()), expected);
                        done();
                    });
                });
            });
            describe('#distinct()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.distinct);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().distinct(), 'Aeroflow');
                });
                it('emitting only unique values in sources with a same type', function (done) {
                    var values = [1, 1, 1, 2, 2],
                        expected = [1, 2],
                        actual = [];
                    aeroflow.apply(undefined, values).distinct().run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        assert.strictEqual(actual.length, expected.length);
                        assert.sameMembers(actual, expected);
                        done();
                    });
                });
                it('emitting only unique values in sources with different types', function (done) {
                    var values = ['a', 'b', 1, new Date(), 2],
                        actual = [];
                    aeroflow.apply(undefined, values).distinct().run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        assert.strictEqual(actual.length, values.length);
                        assert.sameMembers(actual, values);
                        done();
                    });
                });
                it('emitting only unique values if passed like one source', function (done) {
                    var values = [1, 1, 1, 2, 2],
                        expected = [1, 2],
                        actual = [];
                    aeroflow(values).distinct().run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        assert.strictEqual(actual.length, expected.length);
                        assert.sameMembers(actual, expected);
                        done();
                    });
                });
            });
            describe('#distinct(@Boolean)', function () {
                it('emitting unique values until it changed if true passed', function (done) {
                    var values = [1, 1, 1, 2, 2, 1, 1],
                        expected = [1, 2, 1],
                        actual = [];
                    aeroflow.apply(undefined, values).distinct(true).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        assert.strictEqual(actual.length, expected.length);
                        assert.sameMembers(actual, expected);
                        done();
                    });
                });
                it('emitting unique values until it changed if false passed', function (done) {
                    var values = [1, 1, 1, 2, 2, 1, 1],
                        expected = [1, 2],
                        actual = [];
                    aeroflow.apply(undefined, values).distinct(false).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        assert.strictEqual(actual.length, expected.length);
                        assert.sameMembers(actual, expected);
                        done();
                    });
                });
            });
            describe('#average()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.average);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().average(), 'Aeroflow');
                });
                it('does not invoke if empty flow', function (done) {
                    var invoked = false;
                    aeroflow().average().run(function (value) {
                        return invoked = true;
                    });
                    setImmediate(function () {
                        return done(assert.isFalse(invoked));
                    });
                });
                it('emitting average value of array', function (done) {
                    var values = [1, 4, 7, 8],
                        expected = values.reduce(function (sum, next) {
                        return sum + next;
                    }, 0) / values.length,
                        actual = undefined;
                    aeroflow(values).average().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#count()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.count);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().count(), 'Aeroflow');
                });
                it('emitting 0 if empty flow', function (done) {
                    var actual = undefined;
                    aeroflow.empty.count().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, 0));
                    });
                });
                it('emitting the number of values in flow', function (done) {
                    var values = [[1, 2], new Map(), function () {}, 'a'],
                        expected = values.length,
                        actual = undefined;
                    aeroflow.apply(undefined, values).count().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#sum()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.sum);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().sum(), 'Aeroflow');
                });
                it('does not invoke if empty flow', function (done) {
                    var invoked = false;
                    aeroflow.empty.sum().run(function (value) {
                        return invoked = true;
                    });
                    setImmediate(function () {
                        return done(assert.isFalse(invoked));
                    });
                });
                it('emitting NaN if not integer passed', function (done) {
                    var values = [],
                        actual = false;
                    aeroflow('test').sum().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.isNotNumber(true));
                    });
                });
                it('emitting sum of integer values', function (done) {
                    var values = [1, 4, 7, 8],
                        expected = values.reduce(function (sum, next) {
                        return sum + next;
                    }, 0),
                        actual = undefined;
                    aeroflow.apply(undefined, values).sum().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#bind()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.bind);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().bind(), 'Aeroflow');
                });
                it('does not invoke if no arguments passed', function (done) {
                    var invoked = false;
                    aeroflow(1, 2).bind().run(function (value) {
                        return invoked = true;
                    });
                    setImmediate(function () {
                        return done(assert.isFalse(invoked));
                    });
                });
            });
            describe('#bind(@sources)', function () {
                it('emitting binded values', function (done) {
                    var _aeroflow;

                    var initialSources = [1, 2, 3],
                        bindedSources = [7, 8],
                        actual = [];

                    (_aeroflow = aeroflow.apply(undefined, initialSources)).bind.apply(_aeroflow, bindedSources).run(function (value) {
                        return actual.push(value);
                    });

                    setImmediate(function () {
                        return done(assert.sameMembers(actual, bindedSources));
                    });
                });
            });
            describe('#concat()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.concat);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().concat(), 'Aeroflow');
                });
                it('emitting same values if no arguments passed', function (done) {
                    var sources = [1, 2],
                        actual = [];
                    aeroflow(sources).concat().run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        return done(assert.sameMembers(actual, sources));
                    });
                });
            });
            describe('#concat(@sources)', function () {
                it('emitting initial values with concatenated as one flow', function (done) {
                    var sources = ['a', 1, new Date()],
                        additional = [3, 4],
                        actual = [];
                    aeroflow.apply(undefined, sources).concat(additional).run(function (value) {
                        return actual.push(value);
                    });
                    setImmediate(function () {
                        return done(assert.sameMembers(actual, sources.concat(additional)));
                    });
                });
            });
            describe('#every()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.every);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().every(), 'Aeroflow');
                });
                it('emitting true if no arguments passed', function (done) {
                    var actual = undefined;
                    aeroflow(1, 2).every().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.isTrue(actual));
                    });
                });
            });
            describe('#every(@Function)', function () {
                it('emitting a result of matching provided function to all sources', function (done) {
                    var sources = [2, 4, 6, 8, 12, 14],
                        isEven = function isEven(value) {
                        return value % 2 === 0;
                    },
                        expected = sources.every(isEven),
                        actual = undefined;

                    aeroflow(sources).every(isEven).run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#every(@RegExp)', function () {
                it('emitting a result of matching provided RegExp to all sources', function (done) {
                    var sources = ['a', 'b', '6'],
                        reqexp = /^([a-z0-9])$/,
                        expected = sources.every(function (item) {
                        return reqexp.test(item);
                    }),
                        actual = undefined;
                    aeroflow(sources).every(reqexp).run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#every(@Primitive)', function () {
                it('emitting result whether all sources equal to passed string', function (done) {
                    var values = ['a', 'a'],
                        every = values[0],
                        expected = values.every(function (i) {
                        return i === every;
                    }),
                        actual = undefined;
                    aeroflow(values).every(every).run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
                it('emitting result whether all sources equal to passed integer', function (done) {
                    var values = [0, 1, 2, 3],
                        every = values[0],
                        expected = values.every(function (i) {
                        return i === every;
                    }),
                        actual = undefined;
                    aeroflow(values).every(every).run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#some()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.some);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().some(), 'Aeroflow');
                });
                it('emitting true if no arguments passed', function (done) {
                    var actual = undefined;
                    aeroflow(1, 2).some().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.isTrue(actual));
                    });
                });
            });
            describe('#some(@Function)', function () {
                it('emitting result if at least one source matches to provided function', function (done) {
                    var sources = [3, 4, 5, 6],
                        isEven = function isEven(value) {
                        return value % 2 === 0;
                    },
                        expected = sources.filter(isEven).length !== 0,
                        actual = undefined;

                    aeroflow(sources).some(isEven).run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#some(@RegExp)', function () {
                it('emitting result if at least one source matches to provided ReqExp', function (done) {
                    var sources = ['*', 2, '6'],
                        reqexp = /^([a-z0-9])$/,
                        expected = sources.filter(function (item) {
                        return reqexp.test(item);
                    }).length !== 0,
                        actual = undefined;
                    aeroflow(sources).some(reqexp).run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#some(@Primitive)', function () {
                it('emitting result whether at least one source equal to passed string', function (done) {
                    var values = ['a', 'b'],
                        some = values[0],
                        expected = values.indexOf(some) >= 0,
                        actual = undefined;
                    aeroflow.apply(undefined, values).some(some).run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
                it('emitting result whether at least one source equal to passed integer', function (done) {
                    var values = [0, 1, 2, 3],
                        some = values[0],
                        expected = values.indexOf(some) >= 0,
                        actual = undefined;
                    aeroflow(values).some(some).run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
            describe('#mean()', function () {
                it('is instance method', function () {
                    return assert.isFunction(aeroflow.empty.mean);
                });
                it('returns instance of Aeroflow', function () {
                    return assert.typeOf(aeroflow().mean(), 'Aeroflow');
                });
                it('emitting mean value of flow with integers', function (done) {
                    var sources = [3, 4, 6, 7],
                        expected = 6,
                        actual = undefined;
                    aeroflow.apply(undefined, sources).mean().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
                it('emitting mean value of flow with strings', function (done) {
                    var sources = ['a', 'b', 'c'],
                        expected = 'b',
                        actual = undefined;
                    aeroflow.apply(undefined, sources).mean().run(function (value) {
                        return actual = value;
                    });
                    setImmediate(function () {
                        return done(assert.strictEqual(actual, expected));
                    });
                });
            });
        });
    };

    var aeroflow = function aeroflow(_aeroflow2, assert) {
        factoryTests(_aeroflow2, assert);
        staticMethodsTests(_aeroflow2, assert);
        instanceTests(_aeroflow2, assert);
    };

    exports.default = aeroflow;
    module.exports = exports['default'];
});
