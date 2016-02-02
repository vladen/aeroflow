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

        describe('aeroflow(@Array)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow([1, 2]), 'Aeroflow');
            });

            describe('@Array', () => {
                it('emitting array items', () => {
                    let expected = ['str', new Date(), {}, 1];
                    let index = 0;
                    aeroflow(expected)
                        .run(value => assert.strictEqual(value, expected[index++]));
                });
            });
        });

        describe('aeroflow(@Map)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(new Map([[1,2], [2, 1]])), 'Aeroflow');
            });

            describe('@Map', () => {
                it('emitting map entries', () => {
                    let expected = [['a', 1], ['b', 2]];
                    let index = 0;
                    aeroflow(new Map(expected))
                        .run(value => assert.includeMembers(value, expected[index++]));
                });
            });
        });

        describe('aerflow(@Set)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(new Set([1, 2])), 'Aeroflow');
            });

            describe('@Set', () => {
                it('emitting set keys', () => {
                    let expected = ['a', 'b'];
                    let index = 0;
                    aeroflow(new Set(expected))
                        .run(value => assert.strictEqual(value, expected[index++]));
                });
            });
        });

        describe('aeroflow(@Function)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(() => true), 'Aeroflow');
            });

            describe('@Function', () => {
                it('emitting scalar value returned by function', () => {
                    let expected = 'test tester';
                    aeroflow(() => expected)
                        .run(value => assert.strictEqual(value, expected));
                });
            });
        });

        describe('Aeroflow(@Promise)', () => {
            it('returns instance of Aeroflow', () => {
                assert.typeOf(aeroflow(Promise.resolve({})), 'Aeroflow');
            });

            describe('@Promise', () => {
               it('emitting array resolved by promise', () => {
                    let expected = ['a', 'b'];
                    aeroflow(Promise.resolve(expected))
                        .run( value => assert.strictEqual(value, expected));
               });

               it('emitting scalar value resolved by promise returned by function asynchronously', () => {
                    let expected = ['a', 'b'];
                    aeroflow(() => new Promise(resolve => setTimeout(() => resolve(expected))))
                        .run(value => assert.strictEqual(value, expected));
               });
            });
        });
    });

    var aeroflow = (aeroflow, assert) => {
        factoryTests(aeroflow, assert);
    };

    return aeroflow;

}));