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
                let result;
                aeroflow.empty
                        .run(value => result = value);
                setImmediate(() => done(assert.isUndefined(result)));
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
                let actual;

                aeroflow.just()
                        .run(value => value = actual );

                setImmediate(() => {
                    assert.isUndefined(actual);
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

            it('emitting undefined if empty flow', (done) => {
                let actual;
                aeroflow().max()
                        .run(value => actual = value);

                setImmediate(() => done(assert.isUndefined(actual)));
            });

            it('emitting valid result for non-empty flow', (done) => {
                let values = [1, 9, 2, 8, 3, 7, 4, 6, 5]
                    , expected = Math.max(...values)
                    , actual;

                aeroflow(values).max()
                        .run(value => actual = value);

                setImmediate(() => done(assert.strictEqual(actual, expected)));
            });
        });

        describe('#skip()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.skip));

            it('emitting undefined if called without param', (done) => {
                let actual;
                aeroflow([1, 2, 3, 4]).skip()
                        .run(value => actual = value);

                setImmediate(() => done(assert.isUndefined(actual)));
            });
        });

        describe('#skip(@Number)', () => {
            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow([1 ,2 ,3, 4]).skip(), 'Aeroflow'));

            describe('@Number', () => {

                describe('skipps provided number of values from start', () => {
                    it('values passed as single source', (done) => {
                        let values = [1, 2, 3, 4],
                            skip = 2,
                            actual = [];

                        aeroflow(values).skip(skip)
                            .run(value => actual.push(value));

                        setImmediate(() => {
                            actual.forEach((item, i) => assert.strictEqual(item, values[skip + i]));
                            done();
                        });
                    });

                    it('values passed as separate sources', () => {
                        let expected = [1, 2, 3, 4],
                            skip = 2,
                            actual = [];

                        aeroflow(1, 2, 3, 4).skip(skip)
                            .run(value => actual.push(value));

                        setImmediate(() => {
                            actual.forEach((item, i) => assert.strictEqual(item, values[skip + i]));
                            done();
                        });
                    });
                });

                it('emitting values skipped provided number of values from end', (done) => {
                    let values = [1, 2, 3, 4]
                        , skip = 2
                        , actual = [];

                    aeroflow(values).skip(-skip)
                                    .run(value => actual.push(value));
                    setImmediate(() => {
                        actual.forEach((item, i) => assert.strictEqual(item, values[i]));
                        done();
                    });
                });
            });
        });

        describe('#skip(@Function)', () => {
            describe('@Function', () => {
                it('emitting remained values when provided function returns false', (done) => {
                    let values = [1, 2, 3, 4]
                        , skip = Math.floor(values.length / 2)
                        , limiter = (value, index) => index < skip
                        , actual = [];

                    aeroflow(values).skip(skip)
                                    .run(value => actual.push(value));

                    setImmediate(() => {
                        actual.forEach((item, i) => assert.strictEqual(item, values[skip + i]));
                        done();
                    });
                });
            });
        });

        describe('#tap()', () => {
             it('is instance method', () =>
                assert.isFunction(aeroflow.empty.tap));

             it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow([1 ,2 ,3, 4]).tap(), 'Aeroflow'));
        });

        describe('#tap(@Function)', () => {
            describe('@Function', () => {
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
        });

        describe('#toArray()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.toArray));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow([1 ,2 ,3, 4]).toArray(), 'Aeroflow'));

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
                assert.typeOf(aeroflow([1 ,2 ,3, 4]).toMap(), 'Aeroflow'));

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

        describe('#distinct()', () => {
            it('is instance method', () =>
                assert.isFunction(aeroflow.empty.distinct));

            it('returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow([1 ,2 ,3, 4]).distinct(), 'Aeroflow'));

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
            describe('@Boolean', () => {
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
        });
    });

    var aeroflow = (aeroflow, assert) => {
        factoryTests(aeroflow, assert);
        staticMethodsTests(aeroflow, assert);
        instanceTests(aeroflow, assert);
    };

    return aeroflow;

}));