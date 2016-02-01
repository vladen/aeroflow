'use strict';

export default (aeroflow, assert) => describe('aeroflow', () => {
    it('is function', () => {
        assert.isFunction(aeroflow);
    });

    it('should put everything in sources', ()=>{
        let sources = ['str', new Date(), {}, 1];

        let index = 0;

        aeroflow(sources).run(value => assert.strictEqual(value, sources[index++]));
    });

    describe('aeroflow', () => {
        it('returns instance of Aeroflow', () => {
            assert.typeOf(aeroflow(), 'Aeroflow');
        });
    });

    describe('aeroflow.append', () => {
        it('is Function', () => {
            assert.isFunction(aeroflow.empty.append);
        });
    });
});
