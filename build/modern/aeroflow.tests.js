(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.aeroflowTests = factory());
}(this, function () { 'use strict';

    var staticMethodsTests = (aeroflow, assert) => describe('aeroflow', () => {

        it('is function', () => 
            assert.isFunction(aeroflow));

        describe('#empty', () => {
            it('is static property returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.empty, 'Aeroflow'));

            it('emitting empty flow', (done) => {
                let invoked = false;
                aeroflow.empty
                        .run(value => invoked = true);
                setImmediate(() => done(assert.isFalse(invoked)));
            });
        });

        describe('#expand()', () => {
            it('is static method', () => 
                assert.isFunction(aeroflow.expand));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.expand(), 'Aeroflow'));
        });

        describe('#expand(@function)', () => {
            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.expand(() => true, 1), 'Aeroflow'));

            describe('@function', () => {
                it('emitting geometric progression', (done)=> {
                    let expander = value => value * 2
                        , actual = []
                        , seed = 1
                        , expected = [2, 4, 8]
                        , index = 0;

                    aeroflow
                        .expand(expander, seed)
                        .take(expected.length)
                        .run(value => {
                            actual.push(value);
                        });

                    setImmediate(() => {
                        actual.forEach((item, index) => assert.strictEqual(item, expected[index]));
                        done();
                    });
                });
            });
        });

        describe('#just()', () => {
            it('is static method', () => 
                assert.isFunction(aeroflow.just));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.just(), 'Aeroflow'));

            it('emitting empty flow', (done) => {
                let invoked = false;

                aeroflow.just()
                        .run(value => invoked = true );

                setImmediate(() => {
                    assert.isTrue(invoked);
                    done();
                });
            });
        });

        describe('#just(@*)', () => {
            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.just(() => true), 'Aeroflow'));

            describe('@function', () => {
                it('emitting single function', (done) => {
                    let expected = () => {}
                        , actual;

                    aeroflow.just(expected)
                            .run(value => actual = value );
                    
                    setImmediate(() => done(assert.strictEqual(actual, expected)));
                });
            });

            describe('@Promise', () => {
                it('emitting single promise', (done) => {
                    let expected = Promise.resolve([1, 2, 3])
                        , actual;

                    aeroflow.just(expected)
                            .run(value => actual = value );

                    setImmediate(() => done(assert.strictEqual(actual, expected)));
                });
            });
        });

        describe('#random()', () => {
            it('is static method', () => 
                assert.isFunction(aeroflow.random));

            it('emitting random decimals within 0 and 1', (done) => {
                let actual = [];

                aeroflow.random()
                        .take(10)
                        .run(value => actual.push(value));

                setImmediate(() => {
                    actual.forEach((item) => assert.isTrue(!Number.isInteger(item) && item >= 0 && item < 1));
                    done();
                });
            });
        });

        describe('#random(@Number, @Number)', ()=> {
            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.random(0, 1), 'Aeroflow'));

            describe('@Number, @Number', () => {
                it('emitting random integers within a range', (done) => {
                    let limit = 10
                        , max = 10
                        , min = 1
                        , actual = [];

                    aeroflow.random(min, max)
                        .take(limit)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item) => assert.isTrue(Number.isInteger(item) && item >= min && item < max));
                        done();
                    });
                });

                it('emitting random decimals within a range', (done) => {
                    let limit = 10
                        , max = 10.1
                        , min = 1.1
                        , actual = [];

                    aeroflow.random(min, max)
                        .take(limit)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item) => assert.isTrue(!Number.isInteger(item) && item >= min && item < max));
                        done();
                    });
                });
            });
        });

        describe('#range()', () => {
             it('is static method', () => 
                assert.isFunction(aeroflow.range));

             it('emitting ascending sequential starting from 0', (done) => {
                let expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                    , actual = []

                aeroflow.range()
                        .take(10)
                        .run(value => actual.push(value));

                setImmediate(() => {
                    actual.forEach((item, index) => assert.strictEqual(item, expected[index]));
                    done();
                });
             });
        });

        describe('#range(@Number, @Number, @Number)', () => {
            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.random(0, 1), 'Aeroflow'));

            describe('@Number', () => {
                it('emitting ascending sequential starting from passed number', (done)=>{
                    let expected = [5, 6, 7, 8]
                        , actual = []

                    aeroflow.range(expected[0])
                        .take(4)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, index) => assert.strictEqual(item, expected[index]));
                        done();
                    });
                });
            });

            describe('@Number, @Number', () => {
                it('emitting ascending sequential integers within a range', (done)=>{
                    let expected = [5, 6, 7, 8]
                        , start = expected[0]
                        , end = expected[expected.length - 1]
                        , actual = [];
                        

                    aeroflow.range(start, end)
                        .take(4)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, index) => assert.strictEqual(item, expected[index]));
                        done();
                    });
                });

                it('emitting descending sequential integers within a range', (done) => {
                     let expected = [8, 7, 6, 5]
                        , start = expected[0]
                        , end = expected[expected.length - 1]
                        , actual = [];
                        

                    aeroflow.range(start, end)
                        .take(4)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, index) => assert.strictEqual(item, expected[index]));
                        done();
                    });
                });
            });

            describe('@Number, @Number, @Number', () => {
                it('emitting ascending sequential integers within a stepped range', (done)=>{
                    let expected = [0, 2, 4, 6]
                        , start = expected[0]
                        , end = expected[expected.length - 1]
                        , step = 2
                        , actual = [];

                    aeroflow.range(start, end, step)
                        .take(10)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, index) => assert.strictEqual(item, expected[index]));
                        done();
                    });
                });

                it('emitting descending sequential integers within a stepped range', (done) => {
                    let expected = [6, 4, 2, 0]
                        , start = expected[0]
                        , end = expected[expected.length - 1]
                        , step = -2
                        , actual = [];

                    aeroflow.range(start, end, step)
                        .take(10)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, index) => assert.strictEqual(item, expected[index]));
                        done();
                    });

                });
            });
        });

        describe('#repeat()', () => {
            it('is static method', () => 
                assert.isFunction(aeroflow.repeat));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.repeat(), 'Aeroflow'));
        });

        describe('#repeat(@function)', () => {
            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.repeat(() => true), 'Aeroflow'));

            describe('@function', () => {
                it('emitting geometric progression', (done)=> {
                    let repeater = index => index * 2
                        , expected = [0, 2, 4, 6, 8]
                        , actual = [];

                    aeroflow
                        .repeat(repeater)
                        .take(expected.length)
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, index) => assert.strictEqual(item, expected[index]));
                        done();
                    });
                });
            });
        });
    });

    var factoryTests = (aeroflow, assert) => describe('aeroflow', () => {
        describe('aeroflow()', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(), 'Aeroflow');
            });

            describe('#sources', () => {
                it('is initially empty array', () => {
                    assert.strictEqual(aeroflow().sources.length, 0);
                });
            });

            describe('#emitter', () => {
                it('is function', () => {
                    assert.isFunction(aeroflow().emitter);
                });
            });
        });

        describe('aeroflow(@Array)', (done) => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow([1, 2]), 'Aeroflow');
            });

            describe('@Array', () => {
                it('emitting array items', (done) => {
                    let expected = ['str', new Date(), {}, 2]
                        , actual = [];
                    
                    aeroflow(expected)
                        .run(value => actual.push(value));

                    setImmediate(() => done(assert.sameMembers(actual, expected)));
                });
            });
        });

        describe('aeroflow(@Map)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(new Map([[1,2], [2, 1]])), 'Aeroflow');
            });

            describe('@Map', () => {
                it('emitting map entries', (done) => {
                    let expected = [['a', 1], ['b', 2]]
                        , actual = [];

                    aeroflow(new Map(expected))
                        .run(value => actual.push(value));

                    setImmediate(() => {
                        expected.forEach((item, index) => assert.sameMembers(actual[index], expected[index]));
                        done();
                    });
                });
            });
        });

        describe('aerflow(@Set)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(new Set([1, 2])), 'Aeroflow');
            });

            describe('@Set', () => {
                it('emitting set keys', (done) => {
                    let expected = ['a', 'b']
                        , actual = [];

                    aeroflow(new Set(expected))
                        .run(value => actual.push(value));

                    setImmediate(() => done(assert.sameMembers(actual, expected)));
                });
            });
        });

        describe('aeroflow(@Function)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(() => true), 'Aeroflow');
            });

            describe('@Function', () => {
                it('emitting scalar value returned by function', (done) => {
                    let expected = 'test tester'
                        , actual;
                    aeroflow(() => expected)
                        .run(value => actual = value);

                    setImmediate(() => done(assert.strictEqual(actual, expected)));
                });
            });
        });

        describe('Aeroflow(@Promise)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(Promise.resolve({})), 'Aeroflow');
            });

            describe('@Promise', () => {
                it('emitting array resolved by promise', (done) => {
                    let expected = ['a', 'b']
                        , actual

                    aeroflow(Promise.resolve(expected))
                        .run( value => assert.strictEqual(value, expected), () => done());
                });

                //TODO: Promise tests pending
            });
        });
    });

    var instanceTests = (aeroflow, assert) => describe('Aeroflow', () => {
        describe('#max()', ()=> {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.max));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().max(), 'Aeroflow'));

            it('emitting undefined if empty flow', done => {
                let invoked = false;
                aeroflow().max()
                        .run(value => invoked = true);

                setImmediate(() => done(assert.isFalse(invoked)));
            });

            it('emitting valid result for non-empty flow', done => {
                let values = [1, 9, 2, 8, 3, 7, 4, 6, 5]
                    , expected = Math.max(...values)
                    , actual;

                aeroflow(values).max()
                        .run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

         describe('#min()', ()=> {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.min));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().min(), 'Aeroflow'));

            it('does not invoke if empty flow', done => {
                let invoked = false;
                aeroflow.empty.min()
                        .run(value => invoked = true);

                setImmediate(() => done(assert.isFalse(invoked)));
            });

            it('emitting valid result for non-empty flow', done => {
                let values = [1, 9, 2, 8, 3, 7, 4, 6, 5]
                    , expected = Math.min(...values)
                    , actual;

                aeroflow(values).min()
                        .run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#skip()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.skip));

            it('emitting undefined if called without param', done => {
                let invoked = false;
                aeroflow([1, 2, 3, 4]).skip()
                        .run(value => invoked = true);

                setImmediate(() => done(assert.isFalse(invoked)));
            });
        });

        describe('#skip(@Number)', () => {
            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().skip(1), 'Aeroflow'));

            it('skips provided number of values from start', done => {
                let values = [1, 2, 3, 4],
                    skip = 2,
                    actual = [];

                aeroflow(values).skip(skip)
                    .run(value => actual.push(value));

                setImmediate(() => done(assert.sameMembers(actual, values.slice(skip))));
            });

            it('emitting values skipped provided number of values from end', done => {
                let values = [1, 2, 3, 4]
                    , skip = 2
                    , actual = [];

                aeroflow(values).skip(-skip)
                                .run(value => actual.push(value));

                setImmediate(() => done(assert.sameMembers(actual, values.slice(0, skip))));
            });
        });

        describe('#skip(@Function)', () => {
            it('emitting remained values when provided function returns false', done => {
                let values = [1, 2, 3, 4]
                    , skip = Math.floor(values.length / 2)
                    , limiter = (value, index) => index < skip
                    , actual = [];

                aeroflow(values).skip(limiter)
                                .run(value => actual.push(value));

                setImmediate(() => done(assert.sameMembers(actual, values.slice(skip))));
            });
        });

        describe('#tap()', () => {
             it('is instance method', () =>
                assert.isFunction(aeroflow.empty.tap));

             it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().tap(), 'Aeroflow'));
        });

        describe('#tap(@Function)', () => {
            it('intercepts each emitted value', done => {
                let expected = [0, 1, 2]
                    , actual = [];

                aeroflow(expected).tap(value => actual.push(value)).run();

                setImmediate(() => {
                    actual.forEach((item, i) => assert.strictEqual(item, expected[i]));
                    done();
                });
            });
        });

        describe('#toArray()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.toArray));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().toArray(), 'Aeroflow'));

            it('emitting empty Array if empty flow', done => {
                let actual;

                aeroflow().toArray().run(value => actual = value);

                setImmediate(() => {
                    assert.isArray(actual);
                    assert.strictEqual(actual.length, 0);
                    done();
                });
            });

            it('emitting single array containing all values', done => {
                let expected = [1, 2, 3]
                    , actual;

                aeroflow(...expected).toArray().run(value => actual = value);

                setImmediate(() => {
                    assert.isArray(actual);
                    assert.sameMembers(actual, expected);
                    done();
                });
            });
        });

        describe('#toMap()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.toMap));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().toMap(), 'Aeroflow'));

            it('emitting empty Map if empty flow', done => {
                let actual;

                aeroflow().toMap().run(value => actual = value);

                setImmediate(() => {
                    assert.typeOf(actual, 'Map');
                    assert.strictEqual(actual.size, 0);
                    done();
                });
            });

            it('emitting single map containing all values', done => {
                let expected = [1, 2, 3]
                    , actual;

                aeroflow(...expected).toMap().run(value => actual = value);

                setImmediate(() => {
                    assert.typeOf(actual, 'Map');
                    assert.includeMembers(Array.from(actual.keys()), expected);
                    assert.includeMembers(Array.from(actual.values()), expected);
                    done();
                });
            });
        });

        describe('#toSet()', ()=> {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.toSet));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().toSet(), 'Aeroflow'));

            it('emitting empty Set if empty flow', (done) => {
                let actual;

                aeroflow().toSet().run(value => actual = value);

                setImmediate(() => {
                    assert.typeOf(actual, 'Set');
                    assert.strictEqual(actual.size, 0);
                    done();
                });
            });

            it('emitting single set containing all values', done => {
                let expected = [0, 1, 2, 3]
                    , actual;

                aeroflow(...expected, ...expected).toSet().run(value => actual = value);

                setImmediate(() => {
                    assert.typeOf(actual, 'Set');
                    assert.sameMembers(Array.from(actual.keys()), expected);
                    assert.sameMembers(Array.from(actual.values()), expected);
                    done();
                });
            });
        });

        describe('#distinct()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.distinct));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().distinct(), 'Aeroflow'));

            it('emitting only unique values in sources with a same type', done => {
                let values = [1, 1, 1, 2, 2]
                    , expected = [1, 2]
                    , actual = [];

                aeroflow(...values).distinct().run(value => actual.push(value));

                setImmediate(() => {
                    assert.strictEqual(actual.length, expected.length);
                    assert.sameMembers(actual, expected);
                    done();
                });
            });

            it('emitting only unique values in sources with different types', done => {
                let values = ['a', 'b', 1, new Date(), 2]
                    , actual = [];

                aeroflow(...values).distinct().run(value => actual.push(value));

                setImmediate(() => {
                    assert.strictEqual(actual.length, values.length);
                    assert.sameMembers(actual, values);
                    done();
                });
            });

            it('emitting only unique values if passed like one source', done => {
                 let values = [1, 1, 1, 2, 2]
                    , expected = [1, 2]
                    , actual = [];

                aeroflow(values).distinct().run(value => actual.push(value));

                setImmediate(() => {
                    assert.strictEqual(actual.length, expected.length);
                    assert.sameMembers(actual, expected);
                    done();
                });
            });
        });

        describe('#distinct(@Boolean)', () => {
            it('emitting unique values until it changed if true passed', done => {
                 let values = [1, 1, 1, 2, 2, 1, 1]
                    , expected = [1, 2, 1]
                    , actual = [];

                aeroflow(...values).distinct(true).run(value => actual.push(value));

                setImmediate(() => {
                    assert.strictEqual(actual.length, expected.length);
                    assert.sameMembers(actual, expected);
                    done();
                });
            });

            it('emitting unique values until it changed if false passed', done => {
                 let values = [1, 1, 1, 2, 2, 1, 1]
                    , expected = [1, 2]
                    , actual = [];

                aeroflow(...values).distinct(false).run(value => actual.push(value));

                setImmediate(() => {
                    assert.strictEqual(actual.length, expected.length);
                    assert.sameMembers(actual, expected);
                    done();
                });
            });
        });

        describe('#average()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.average));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().average(), 'Aeroflow'));

            it('does not invoke if empty flow', (done) => {
                let invoked = false;
                aeroflow().average()
                        .run(value => invoked = true);

                setImmediate(() => done(assert.isFalse(invoked)));
            });

            it('emitting average value of array', done => {
                let values = [1, 4, 7, 8]
                    , expected = values.reduce((sum, next) => sum + next, 0)/values.length
                    , actual;

                aeroflow(values).average().run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#count()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.count));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().count(), 'Aeroflow'));

            it('emitting 0 if empty flow', done => {
                let actual;

                aeroflow.empty.count().run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, 0)));
            });

            it('emitting the number of values in flow', done => {
                let values = [[1, 2], new Map(), () => {}, 'a']
                    , expected = values.length
                    , actual;

                aeroflow(...values).count().run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#sum()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.sum));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().sum(), 'Aeroflow'));

            it('does not invoke if empty flow', done => {
                let invoked = false;
                aeroflow.empty.sum()
                        .run(value => invoked = true);

                setImmediate(() => done(assert.isFalse(invoked)));
            });

            it('emitting NaN if not integer passed', done => {
                let values = []
                    , actual = false;

                aeroflow('test').sum().run(value => actual = value);

                setImmediate(() => done(assert.isNotNumber(true)));
            });

            it('emitting sum of integer values', done => {
                let values = [1, 4, 7, 8]
                    , expected = values.reduce((sum, next) => sum + next, 0)
                    , actual;

                aeroflow(...values).sum().run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#bind()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.bind));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().bind(), 'Aeroflow'));

            it('does not invoke if no arguments passed', done => {
                let invoked = false;
                aeroflow(1, 2).bind()
                        .run(value => invoked = true);

                setImmediate(() => done(assert.isFalse(invoked)));
            });
        });

        describe('#bind(@sources)', () => {
            it('emitting binded values', done => {
                let initialSources = [1, 2, 3]
                    , bindedSources = [7, 8]
                    , actual = [];

                aeroflow(...initialSources).bind(...bindedSources).run(value => actual.push(value));

                setImmediate(() => done(assert.sameMembers(actual, bindedSources)));
            });
        });

        describe('#concat()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.concat));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().concat(), 'Aeroflow'));

            it('emitting same values if no arguments passed', done => {
                let sources = [1, 2]
                    , actual = [];

                aeroflow(sources).concat().run(value => actual.push(value));

                setImmediate(() => done(assert.sameMembers(actual, sources)));
            });
        });

        describe('#concat(@sources)', () => {
            it('emitting initial values with concatenated as one flow', done => {
                let sources = ['a', 1, new Date()]
                    , additional = [3, 4]
                    , actual = [];

                aeroflow(...sources).concat(additional).run(value => actual.push(value));

                setImmediate(() => done(assert.sameMembers(actual, sources.concat(additional))));
            });
        });

        describe('#every()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.every));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().every(), 'Aeroflow'));

            it('emitting true if no arguments passed', (done) => {
                let actual;

                aeroflow(1, 2).every().run(value => actual = value);

                setImmediate(() => done(assert.isTrue(actual)));
            });
        });

        describe('#every(@Function)', () => {
            it('emitting a result of matching provided function to all sources', (done) => {
                let sources = [2, 4, 6, 8, 12, 14]
                    , isEven = (value) => value % 2 === 0
                    , expected = sources.every(isEven)
                    , actual;

                aeroflow(sources).every(isEven).run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#every(@RegExp)', () => {
            it('emitting a result of matching provided RegExp to all sources', done => {
                let sources = ['a', 'b', '6']
                    , reqexp = /^([a-z0-9])$/
                    , expected = sources.every(item => reqexp.test(item))
                    , actual;

                aeroflow(sources).every(reqexp).run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#every(@Primitive)', () => {
            it('emitting result whether all sources equal to passed string', done => {
                let values = ['a', 'a']
                    , every = values[0]
                    , expected = values.every(i => i === every)
                    , actual;

                aeroflow(values).every(every).run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });

            it('emitting result whether all sources equal to passed integer', done => {
               let values = [0, 1, 2, 3]
                    , every = values[0]
                    , expected = values.every(i => i === every)
                    , actual;

                aeroflow(values).every(every).run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#some()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.some));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().some(), 'Aeroflow'));

            it('emitting true if no arguments passed', (done) => {
                let actual;

                aeroflow(1, 2).some().run(value => actual = value);

                setImmediate(() => done(assert.isTrue(actual)));
            });
        });

        describe('#some(@Function)', () => {
            it('emitting result if at least one source matches to provided function', done => {
                let sources = [3, 4, 5, 6]
                    , isEven = (value) => value % 2 === 0
                    , expected = sources.filter(isEven).length !== 0
                    , actual;

                aeroflow(sources).some(isEven).run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#some(@RegExp)', () => {
            it('emitting result if at least one source matches to provided ReqExp', done => {
                let sources = ['*', 2, '6']
                    , reqexp = /^([a-z0-9])$/
                    , expected = sources.filter(item => reqexp.test(item)).length !== 0
                    , actual;

                aeroflow(sources).some(reqexp).run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#some(@Primitive)', () => {
            it('emitting result whether at least one source equal to passed string', done => {
               let values = ['a', 'b']
                    , some = values[0]
                    , expected = values.indexOf(some) >= 0
                    , actual;

                aeroflow(...values).some(some).run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });

            it('emitting result whether at least one source equal to passed integer', done => {
                let values = [0, 1, 2, 3]
                    , some = values[0]
                    , expected = values.indexOf(some) >= 0
                    , actual;

                aeroflow(values).some(some).run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#mean()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.mean));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow().mean(), 'Aeroflow'));

            it('emitting mean value of flow with integers', done => {
                let sources = [3, 4, 6, 7]
                    , expected = 6
                    , actual;

                aeroflow(...sources).mean().run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });

            it('emitting mean value of flow with strings', done => {
                let sources = ['a', 'b', 'c']
                    , expected = 'b'
                    , actual;

                aeroflow(...sources).mean().run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });

        });
    });

    var aeroflow = (aeroflow, assert) => {
        factoryTests(aeroflow, assert);
        staticMethodsTests(aeroflow, assert);
        instanceTests(aeroflow, assert);
    };

    return aeroflow;

}));