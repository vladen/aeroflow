(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.aeroflowTests = factory());
}(this, function () { 'use strict';

    var staticFactory = (aeroflow, assert) => describe('aeroflow', () => {


        it('is function', () => 
            assert.isFunction(aeroflow));

        describe('#empty', () => {
            it('is static property returns instance of Aeroflow', () =>
                assert.typeOf(aeroflow.empty, 'Aeroflow'));

            it('emitting empty flow', (done) => {
                let result;
                aeroflow.empty
                        .run(value => result = value);
                setImmediate(() => {
                    assert.isUndefined(result);
                    done();
                });
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

            // describe('@function', () => {
            //     it('emitting geometric progression', (done)=> {
            //         let expander = value => value * 2
            //             , actual = []
            //             , seed = 1
            //             , expected = [2, 4, 8]
            //             , index = 0;

            //         aeroflow
            //             .expand(expander, seed)
            //             .take(expected.length)
            //             .run(value => {
            //                 actual.push(value);
            //             });

            //         setImmediate(() => {
            //             assert.strictEqual(actual, expected);
            //             //done();
            //         });
            //     });
            // });
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
                    
                    setImmediate(() => {
                        assert.strictEqual(actual, expected);
                        done();
                    });
                });
            });

            describe('@Promise', () => {
                it('emitting single promise', (done) => {
                    let expected = Promise.resolve([1, 2, 3])
                        , actual;

                    aeroflow.just(expected)
                            .run(value => actual = value );

                    setImmediate(() => {
                        assert.strictEqual(actual, expected);
                        done();
                    });
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

    var aeroflow = (aeroflow, assert) => {
        staticFactory(aeroflow, assert);
    };

    return aeroflow;

}));