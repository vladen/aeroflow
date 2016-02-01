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

    var factoryTests = function factoryTests(aeroflow, assert) {
        return describe('aeroflow', function () {
            it('is function', function () {
                assert.isFunction(aeroflow);
            });
            it('should put everything in sources', function () {
                var sources = ['str', new Date(), {}, 1];
                var index = 0;
                aeroflow(sources).run(function (value) {
                    return assert.strictEqual(value, sources[index++]);
                }, function (error, count) {
                    return assert.strictEqual(count, sources.length);
                });
            });
            describe('aeroflow', function () {
                it('returns instance of Aeroflow', function () {
                    assert.typeOf(aeroflow(), 'Aeroflow');
                });
            });
            describe('aeroflow.append', function () {
                it('is Function', function () {
                    assert.isFunction(aeroflow.empty.append);
                });
            });
        });
    };

    var aeroflow = function aeroflow(_aeroflow, assert) {
        factoryTests(_aeroflow, assert);
    };

    exports.default = aeroflow;
    module.exports = exports['default'];
});
