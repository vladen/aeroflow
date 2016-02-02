'use strict';

export default (aeroflow, assert) => describe('aeroflow', () => {
    it('is function', () => 
        assert.isFunction(aeroflow));

    describe('#empty', () => {
        it('is static property returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow.empty, 'Aeroflow'));

        it('emitting empty flow', () => {
            aeroflow.empty
                    .run(value => assert.isUndefined(value))
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
            it('emitting geometric progression', ()=> {
                let expander = value => value * 2
                    , seed = 1
                    , expected = [2, 4, 8]
                    , index = 0;

                aeroflow
                    .expand(expander, seed)
                    .take(expected.length)
                    .run(value => assert.strictEqual(value, expected[index++]));
            });
        });
    });

    describe('#just()', () => {
        it('is static method', () => 
            assert.isFunction(aeroflow.just));

        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow.just(), 'Aeroflow'));

        it('emitting empty flow', () => {
            aeroflow.just()
                    .run(value => assert.isUndefined(value));
        });
    });

    describe('#just(@*)', () => {
        it('returns instance of Aeroflow', () =>
            assert.typeOf(aeroflow.just(() => true), 'Aeroflow'));

        describe('@function', () => {
            it('emitting single function', () => {
                let expected = () => {};
                aeroflow.just(expected)
                        .run(value => assert.strictEqual(value, expected));
            });
        });

        describe('@Promise', () => {
            it('emitting single promise', () => {
                let expected = Promise.resolve([1, 2, 3]);
                aeroflow.just(expected)
                        .run(value => assert.strictEqual(value, expected));
            });
        });
    });
});