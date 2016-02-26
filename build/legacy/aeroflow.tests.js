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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  (function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.aeroflowTests = factory();
  })(undefined, function () {
    'use strict';

    var emptyGeneratorTests = function emptyGeneratorTests(aeroflow, exec, expect, sinon) {
      return describe('.empty', function () {
        it('Gets instance of Aeroflow', function () {
          return exec(null, function () {
            return aeroflow.empty;
          }, function (result) {
            return expect(result).to.be.an('Aeroflow');
          });
        });
        it('Gets flow emitting "done" notification argumented with "true"', function () {
          return exec(function () {
            return sinon.spy();
          }, function (spy) {
            return aeroflow.empty.notify(Function(), spy).run();
          }, function (spy) {
            return expect(spy).to.have.been.calledWith(true);
          });
        });
        it('Gets flow not emitting "next" notification', function () {
          return exec(function () {
            return sinon.spy();
          }, function (spy) {
            return aeroflow.empty.notify(spy).run();
          }, function (spy) {
            return expect(spy).not.to.have.been.called;
          });
        });
      });
    };

    var expandGeneratorTests = function expandGeneratorTests(aeroflow, exec, expect, sinon) {
      return describe('.expand', function () {
        it('Is static method', function () {
          return exec(null, function () {
            return aeroflow.expand;
          }, function (result) {
            return expect(result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return exec(null, function () {
              return aeroflow.expand();
            }, function (result) {
              return expect(result).to.be.an('Aeroflow');
            });
          });
        });
        describe('(@expander:function)', function () {
          it('Calls @expander', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.expand(spy).take(1).run();
            }, function (spy) {
              return expect(spy).to.have.been.called;
            });
          });
          it('Passes undefined to @expander as first argument when no seed has been specified', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.expand(function (arg) {
                return spy(typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
              }).take(1).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith('undefined');
            });
          });
          it('Passes value returned by @expander to @expander as first argument on subsequent iteration', function () {
            return exec(function () {
              var value = 'test';
              return {
                value: value,
                spy: sinon.spy(function () {
                  return value;
                })
              };
            }, function (ctx) {
              return aeroflow.expand(function (result) {
                return ctx.spy(result);
              }).take(2).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
          it('Passes zero-based index of iteration to @expander as second argument', function () {
            return exec(function () {
              return {
                limit: 3,
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.expand(function (_, index) {
                return ctx.spy(index);
              }).take(ctx.limit).run();
            }, function (ctx) {
              return Array(ctx.limit).fill(0).forEach(function (_, i) {
                return expect(ctx.spy).to.have.been.calledWith(i);
              });
            });
          });
          it('Passes context data to @expander as third argument', function () {
            return exec(function () {
              return {
                data: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.expand(function (_, __, data) {
                return ctx.spy(data);
              }).take(1).run(ctx.data);
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.data);
            });
          });
          it('Emits "next" notification with value returned by @expander', function () {
            return exec(function () {
              return {
                value: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.expand(function () {
                return ctx.value;
              }).take(1).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@expander:function, @seed:any)', function () {
          it('Passes @seed to @expander as first argument at first iteration', function () {
            return exec(function () {
              return {
                seed: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.expand(function (seed) {
                return ctx.spy(seed);
              }, ctx.seed).take(1).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.seed);
            });
          });
        });
      });
    };

    var justGeneratorTests = function justGeneratorTests(aeroflow, exec, expect, sinon) {
      return describe('.just', function () {
        it('Is static method', function () {
          return exec(null, function () {
            return aeroflow.just;
          }, function (result) {
            return expect(result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return exec(null, function () {
              return aeroflow.just();
            }, function (result) {
              return expect(result).to.be.an('Aeroflow');
            });
          });
          it('Returns flow emitting "done" notification argumented with "true"', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.just().notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with undefined', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.just().notify(function (result) {
                return spy(typeof result === 'undefined' ? 'undefined' : _typeof(result));
              }).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith('undefined');
            });
          });
        });
        describe('(@value:aeroflow)', function () {
          it('Returns flow emitting "next" notification argumented with @value', function () {
            return exec(function () {
              return {
                value: aeroflow.empty,
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.just(ctx.value).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@value:array)', function () {
          it('Returns flow emitting "next" notification argumented with @value', function () {
            return exec(function () {
              return {
                value: [],
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.just(ctx.value).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@value:function)', function () {
          it('Returns flow emitting "next" notification argumented with @value', function () {
            return exec(function () {
              return {
                value: Function(),
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.just(ctx.value).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@value:iterable)', function () {
          it('Returns flow emitting "next" notification argumented with @value', function () {
            return exec(function () {
              return {
                value: new Set(),
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.just(ctx.value).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@value:promise)', function () {
          it('Returns flow emitting "next" notification argumented with @value', function () {
            return exec(function () {
              return {
                value: Promise.resolve,
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.just(ctx.value).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
      });
    };

    var averageOperatorTests = function averageOperatorTests(aeroflow, exec, expect, sinon) {
      return describe('#average', function () {
        it('Is instance method', function () {
          return exec(null, function () {
            return aeroflow.empty.average;
          }, function (result) {
            return expect(result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return exec(null, function () {
              return aeroflow.empty.average();
            }, function (result) {
              return expect(result).to.be.an('Aeroflow');
            });
          });
          it('Does not emit "next" notification when flow is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.empty.average().notify(spy).run();
            }, function (spy) {
              return expect(spy).not.to.have.been.called;
            });
          });
          it('Emits "next" notification argumented with @value when flow emits single numeric @value', function () {
            return exec(function () {
              return {
                value: 42,
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.value).average().notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
          it('Emits "next" notification argumented with NaN when flow emits single not numeric @value', function () {
            return exec(function () {
              return {
                value: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.value).average().notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(NaN);
            });
          });
          it('Emits "next" notification argumented with average of @values when flow emits several numeric @values', function () {
            return exec(function () {
              return {
                values: [1, 2, 5],
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.values).average().notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.values.reduce(function (sum, value) {
                return sum + value;
              }, 0) / ctx.values.length);
            });
          });
          it('Emits "next" notification argumented with NaN when flow emits several not numeric @values', function () {
            return exec(function () {
              return {
                values: ['a', 'b'],
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.value).average().notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(NaN);
            });
          });
        });
      });
    };

    var catchOperatorTests = function catchOperatorTests(aeroflow, exec, expect, sinon) {
      return describe('#catch', function () {
        it('Is instance method', function () {
          return exec(null, function () {
            return aeroflow.empty.catch;
          }, function (result) {
            return expect(result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return exec(null, function () {
              return aeroflow.empty.catch();
            }, function (result) {
              return expect(result).to.be.an('Aeroflow');
            });
          });
          it('Does not emit "next" notification when flow is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.empty.catch().notify(spy).run();
            }, function (spy) {
              return expect(spy).not.to.have.been.called;
            });
          });
          it('Does not emit "next" notification when flow emits single error', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Error('test')).catch().notify(spy).run();
            }, function (spy) {
              return expect(spy).not.to.have.been.called;
            });
          });
          it('Emits "done" notification argumented with "true" when emits error', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Error('test')).catch().notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@alternative:function)', function () {
          it('Does not call @alternative when flow is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.empty.catch(spy).run();
            }, function (spy) {
              return expect(spy).not.to.have.been.called;
            });
          });
          it('Does not call @alternative when flow does not emit error', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow('test').catch(spy).run();
            }, function (spy) {
              return expect(spy).not.to.have.been.called;
            });
          });
          it('Calls @alternative and passes error as first argument when flow emits error', function () {
            return exec(function () {
              return {
                error: new Error('test'),
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.error).catch(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.error);
            });
          });
          it('Calls @alternative and passes context data as second argument when flow emits error', function () {
            return exec(function () {
              return {
                data: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(new Error('test')).catch(function (_, data) {
                return ctx.spy(data);
              }).run(ctx.data);
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.data);
            });
          });
          it('Emits "next" notification argumented with value returned by @alternative when flow emits error', function () {
            return exec(function () {
              return {
                value: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(new Error('test')).catch(function () {
                return ctx.value;
              }).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@alternative:!function)', function () {
          it('Emits "next" notification argumented with @alternative when flow emits error', function () {
            return exec(function () {
              return {
                alternative: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(new Error('test')).catch(ctx.alternative).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.alternative);
            });
          });
        });
      });
    };

    var coalesceOperatorTests = function coalesceOperatorTests(aeroflow, exec, expect, sinon) {
      return describe('#coalesce', function () {
        it('Is instance method', function () {
          return exec(null, function () {
            return aeroflow.empty.coalesce;
          }, function (result) {
            return expect(result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return exec(null, function () {
              return aeroflow.empty.coalesce();
            }, function (result) {
              return expect(result).to.be.an('Aeroflow');
            });
          });
          it('Does not emit "next" notification when flow is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.empty.coalesce().notify(spy).run();
            }, function (spy) {
              return expect(spy).not.to.have.been.called;
            });
          });
        });
        describe('(@alternative:function)', function () {
          it('Calls @alternative when flow is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.empty.coalesce(spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.called;
            });
          });
          it('Does not call @alternative when flow emits error', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Error('test')).coalesce(spy).run();
            }, function (spy) {
              return expect(spy).not.to.have.been.called;
            });
          });
          it('Emits "next" notification argumented with value returned by @alternative when flow is empty', function () {
            return exec(function () {
              return {
                value: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.empty.coalesce(function () {
                return ctx.value;
              }).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@alternative:!function)', function () {
          it('Emits "next" notification argumented with @alternative value when flow is empty', function () {
            return exec(function () {
              return {
                alternative: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow.empty.coalesce(ctx.alternative).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.alternative);
            });
          });
        });
      });
    };

    var countOperatorTests = function countOperatorTests(aeroflow, exec, expect, sinon) {
      return describe('#count', function () {
        it('Is instance method', function () {
          return exec(null, function () {
            return aeroflow.empty.count;
          }, function (result) {
            return expect(result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return exec(null, function () {
              return aeroflow.empty.count();
            }, function (result) {
              return expect(result).to.be.an('Aeroflow');
            });
          });
          it('Emits "next" notification argumented with "0" when flow is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow.empty.count().notify(function (result) {
                return spy(result);
              }).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(0);
            });
          });
          it('Emits "next" notification argumented with "1" when flow emits single value', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow('test').count().notify(spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(1);
            });
          });
          it('Emits number of @values emitted by flow when flow emits several @values', function () {
            return exec(function () {
              return {
                values: [1, 2, 3],
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.values).count().notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.values.length);
            });
          });
        });
      });
    };

    var exec = function exec(arrange, act) {
      for (var _len = arguments.length, asserts = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        asserts[_key - 2] = arguments[_key];
      }

      var input = typeof arrange === 'function' ? arrange() : arrange;
      return Promise.resolve(act(input)).catch(function () {}).then(function (result) {
        input ? input.result = result : input = result;
        asserts.forEach(function (assert) {
          return assert(input);
        });
      });
    };

    var aeroflowTests = function aeroflowTests(aeroflow, expect, sinon) {
      return describe('aeroflow', function () {
        it('Is function', function () {
          return exec(function () {}, function () {
            return aeroflow;
          }, function (result) {
            return expect(result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return exec(null, function () {
              return aeroflow();
            }, function (result) {
              return expect(result).to.be.an('Aeroflow');
            });
          });
          it('Returns empty flow emitting "done" notification argumented with "true"', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow().notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns empty flow not emitting "next" notification', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow().notify(spy).run();
            }, function (spy) {
              return expect(spy).to.have.not.been.called;
            });
          });
        });
        describe('(@source:aeroflow)', function () {
          it('Returns flow emitting "done" notification argumented with "true" when @source is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(aeroflow.empty).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(aeroflow([1, 2])).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with "false" when @source is not empty but has not been entirely enumerated', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(aeroflow([1, 2])).take(1).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(false);
            });
          });
          it('Returns flow not emitting "next" notification when @source is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(aeroflow.empty).notify(spy).run();
            }, function (spy) {
              return expect(spy).to.have.not.been.called;
            });
          });
          it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', function () {
            return exec(function () {
              return {
                source: [1, 2],
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(aeroflow(ctx.source)).notify(ctx.spy).run();
            }, function (ctx) {
              return ctx.source.forEach(function (value) {
                return expect(ctx.spy).to.have.been.calledWith(value);
              });
            });
          });
        });
        describe('(@source:array)', function () {
          it('Returns flow emitting "done" notification argumented with "true" when @source is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow([]).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow([1, 2]).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with "false" when @source is not empty and has not been entirely enumerated', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow([1, 2]).take(1).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(false);
            });
          });
          it('Returns flow not emitting "next" notification when @source is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow([]).notify(spy).run();
            }, function (spy) {
              return expect(spy).to.have.not.been.called;
            });
          });
          it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', function () {
            return exec(function () {
              return {
                source: [1, 2],
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.source).notify(ctx.spy).run();
            }, function (ctx) {
              return ctx.source.forEach(function (value) {
                return expect(ctx.spy).to.have.been.calledWith(value);
              });
            });
          });
        });
        describe('(@source:date)', function () {
          it('Returns flow emitting "done" notification argumented with "true"', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Date()).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with @source', function () {
            return exec(function () {
              return {
                source: new Date(),
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.source).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.source);
            });
          });
        });
        describe('(@source:error)', function () {
          it('Returns flow emitting "done" notification argumented with @source', function () {
            return exec(function () {
              return {
                source: new Error('test'),
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.source).notify(Function(), ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.source);
            });
          });
          it('Returns flow not emitting "next" notification', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Error('test')).notify(spy).run();
            }, function (spy) {
              return expect(spy).to.have.not.been.called;
            });
          });
        });
        describe('(@source:function)', function () {
          it('Calls @source and passes ctx data as first argument', function () {
            return exec(function () {
              return {
                data: {},
                source: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.source).run(ctx.data);
            }, function (ctx) {
              return expect(ctx.source).to.have.been.calledWith(ctx.data);
            });
          });
          it('Returns flow emitting "done" notification argumented with "true" when @source does not throw', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(Function()).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with error thrown by @source', function () {
            return exec(function () {
              return {
                error: new Error('test'),
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(function () {
                throw ctx.error;
              }).notify(Function(), ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.error);
            });
          });
          it('Returns flow emitting "next" notification argumented with value returned by @source', function () {
            return exec(function () {
              return {
                value: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(function () {
                return ctx.value;
              }).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@source:iterable)', function () {
          it('Returns empty flow emitting "done" notification argumented with "true" when source is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Set()).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with "true" when source is not empty and has been entirely enumerated', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Set([1, 2])).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with "false" when source is not empty but has not been entirely enumerated', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Set([1, 2])).take(1).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(false);
            });
          });
          it('Returns flow not emitting "next" notification when source is empty', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(new Set()).notify(spy).run();
            }, function (spy) {
              return expect(spy).to.have.not.been.called;
            });
          });
          it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', function () {
            return exec(function () {
              return {
                source: [1, 2],
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(new Set(ctx.source)).notify(ctx.spy).run();
            }, function (ctx) {
              return ctx.source.forEach(function (value) {
                return expect(ctx.spy).to.have.been.calledWith(value);
              });
            });
          });
        });
        describe('(@source:null)', function () {
          it('Returns flow emitting "done" notification argumented with "true"', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(null).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with @source', function () {
            return exec(function () {
              return {
                source: null,
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.source).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.source);
            });
          });
        });
        describe('(@source:promise)', function () {
          it('Returns flow emitting "done" notification argumented with "true" when @source resolves', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(Promise.resolve()).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with rejection error when @source rejects', function () {
            return exec(function () {
              return {
                error: new Error('test'),
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(Promise.reject(ctx.error)).notify(Function(), ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.error);
            });
          });
          it('Returns flow emitting "next" notification argumented with value resolved by @source', function () {
            return exec(function () {
              return {
                value: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(Promise.resolve(ctx.value)).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.value);
            });
          });
        });
        describe('(@source:string)', function () {
          it('Returns flow emitting "done" notification argumented with "true"', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow('test').notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with @source', function () {
            return exec(function () {
              return {
                source: 'test',
                spy: sinon.spy()
              };
            }, function (ctx) {
              return aeroflow(ctx.source).notify(ctx.spy).run();
            }, function (ctx) {
              return expect(ctx.spy).to.have.been.calledWith(ctx.source);
            });
          });
        });
        describe('(@source:undefined)', function () {
          it('Returns flow emitting "done" notification argumented with "true"', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(undefined).notify(Function(), spy).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with @source', function () {
            return exec(function () {
              return sinon.spy();
            }, function (spy) {
              return aeroflow(undefined).notify(function (arg) {
                return spy(typeof arg === 'undefined' ? 'undefined' : _typeof(arg));
              }, Function()).run();
            }, function (spy) {
              return expect(spy).to.have.been.calledWith('undefined');
            });
          });
        });
        [emptyGeneratorTests, expandGeneratorTests, justGeneratorTests, averageOperatorTests, catchOperatorTests, coalesceOperatorTests, countOperatorTests].forEach(function (test) {
          return test(aeroflow, exec, expect, sinon);
        });
      });
    };

    return aeroflowTests;
  });
});
