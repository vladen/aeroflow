(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.aeroflowTests = factory());
}(this, function () { 'use strict';

    var factoryTests = (aeroflow, assert) => describe('aeroflow', () => {
        it('is function', () => {
            assert.isFunction(aeroflow);
        });

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

    var aeroflow = (aeroflow, assert) => {
        factoryTests(aeroflow, assert);
    };

    return aeroflow;

}));