(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.aeroflowTests = factory());
}(this, function () { 'use strict';

    var factoryTests = (aeroflow, assert) => describe('aeroflow', () => {
        it('is function', () => {
            assert.isFunction(aeroflow);
        });

        it('should put everything in sources', ()=>{
            let sources = ['str', new Date(), {}, 1];

            let index = 0;

            aeroflow(sources).run(
                value => 
                    assert.strictEqual(value, sources[index++]),
                (error, count) => 
                    assert.strictEqual(count, sources.length)
            );
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

    var aeroflow = (aeroflow, assert) => {
        factoryTests(aeroflow, assert);
    };

    return aeroflow;

}));