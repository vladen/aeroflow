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

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  (function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.aeroflowTests = factory();
  })(undefined, function () {
    'use strict';

    var emptyGeneratorTests = function emptyGeneratorTests(aeroflow, execute, expect, sinon) {
      return describe('.empty', function () {
        it('Gets instance of Aeroflow', function () {
          return execute(function (context) {
            return aeroflow.empty;
          }, function (context) {
            return expect(context.result).to.be.an('Aeroflow');
          });
        });
        it('Emits done(true, @context) notification', function () {
          return execute(function (context) {
            return aeroflow.empty.notify(context.nop, context.spy).run(context);
          }, function (context) {
            return expect(context.spy).to.have.been.calledWithExactly(true, context);
          });
        });
        it('Does not emit next notification', function () {
          return execute(function (context) {
            return aeroflow.empty.notify(context.spy).run();
          }, function (context) {
            return expect(context.spy).not.to.have.been.called;
          });
        });
      });
    };

    var expandGeneratorTests = function expandGeneratorTests(aeroflow, execute, expect, sinon) {
      return describe('.expand', function () {
        it('Is static method', function () {
          return execute(function (context) {
            return aeroflow.expand;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.expand();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
        });
        describe('(@expander:function)', function () {
          it('Calls @expander(undefined, 0, @context) at first iteration', function () {
            return execute(function (context) {
              return aeroflow.expand(context.spy).take(1).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(undefined, 0, context);
            });
          });
          it('Calls @expander(@value, @index, @context) at subsequent iterations with @value previously returned by @expander', function () {
            return execute(function (context) {
              context.expander = function (value) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }

                context.spy.apply(context, [value].concat(args));
                return value ? value + 1 : 1;
              };

              context.iterations = 3;
            }, function (context) {
              return aeroflow.expand(context.expander).take(context.iterations).run(context);
            }, function (context) {
              return Array(context.iterations).fill(0).forEach(function (_, index) {
                return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(index || undefined, index, context);
              });
            });
          });
          it('Emits done(@error, @context) notification with @error thrown by @expander', function () {
            return execute(function (context) {
              context.error = new Error('test');

              context.expander = function () {
                throw context.error;
              };
            }, function (context) {
              return aeroflow(context.expander).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.error, context);
            });
          });
          it('Emits next(@value, @index, @context) notification for each @value returned by @expander', function () {
            return execute(function (context) {
              context.expander = function (value) {
                return value ? value + 1 : 1;
              };

              context.iterations = 3;
            }, function (context) {
              return aeroflow.expand(context.expander).take(context.iterations).notify(context.spy).run(context);
            }, function (context) {
              return Array(context.iterations).fill(0).forEach(function (_, index) {
                return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(index + 1, index, context);
              });
            });
          });
        });
        describe('(@expander:function, @seed)', function () {
          it('Calls @expander(@seed, 0, @context) at first iteration', function () {
            return execute(function (context) {
              return context.seed = 'test';
            }, function (context) {
              return aeroflow.expand(context.spy, context.seed).take(1).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.seed, 0, context);
            });
          });
        });
        describe('(@expander:!function)', function () {
          it('Emits next(@expander, 0, @context) notification', function () {
            return execute(function (context) {
              return context.expander = 'test';
            }, function (context) {
              return aeroflow.expand(context.expander).take(1).notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.been.calledWith(context.expander);
            });
          });
        });
      });
    };

    var justGeneratorTests = function justGeneratorTests(aeroflow, execute, expect, sinon) {
      return describe('.just', function () {
        it('Is static method', function () {
          return execute(function (context) {
            return aeroflow.just;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.just();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('Emits done(true, @context) notification', function () {
            return execute(function (context) {
              return aeroflow.just().notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits next(undefined, 0, @context) notification', function () {
            return execute(function (context) {
              return aeroflow.just().notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(undefined, 0, context);
            });
          });
        });
        describe('(@value:aeroflow)', function () {
          it('Emits next(@value, 0, @context) notification', function () {
            return execute(function (context) {
              return context.value = aeroflow.empty;
            }, function (context) {
              return aeroflow.just(context.value).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
            });
          });
        });
        describe('(@value:array)', function () {
          it('Emits next(@value, 0, @context) notification', function () {
            return execute(function (context) {
              return context.value = [];
            }, function (context) {
              return aeroflow.just(context.value).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
            });
          });
        });
        describe('(@value:function)', function () {
          it('Emits next(@value, 0, @context) notification', function () {
            return execute(function (context) {
              return context.value = Function();
            }, function (context) {
              return aeroflow.just(context.value).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
            });
          });
        });
        describe('(@value:iterable)', function () {
          it('Emits next(@value, 0, @context) notification', function () {
            return execute(function (context) {
              return context.value = new Set();
            }, function (context) {
              return aeroflow.just(context.value).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
            });
          });
        });
        describe('(@value:promise)', function () {
          it('Emits next(@value, 0, @context) notification', function () {
            return execute(function (context) {
              return context.value = Promise.resolve();
            }, function (context) {
              return aeroflow.just(context.value).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
            });
          });
        });
      });
    };

    var averageOperatorTests = function averageOperatorTests(aeroflow, execute, expect, sinon) {
      return describe('#average', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.average;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.average();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('Does not emit next notification when flow is empty', function () {
            return execute(function (context) {
              return aeroflow.empty.average().notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
          it('Emits next(@value, 0, @context) notification when flow emits single numeric @value', function () {
            return execute(function (context) {
              return context.value = 42;
            }, function (context) {
              return aeroflow(context.value).average().notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
            });
          });
          it('Emits next(@average, 0, @context) notification with @average of serveral numeric values emitted by flow', function () {
            return execute(function (context) {
              return context.values = [1, 2, 5];
            }, function (context) {
              return aeroflow(context.values).average().notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.values.reduce(function (sum, value) {
                return sum + value;
              }, 0) / context.values.length, 0, context);
            });
          });
          it('Emits next(NaN, 0, @context) notification when flow emits at least one value not convertible to numeric', function () {
            return execute(function (context) {
              return context.values = [1, 'test', 2];
            }, function (context) {
              return aeroflow(context.values).average().notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(NaN, 0, context);
            });
          });
        });
      });
    };

    var countOperatorTests = function countOperatorTests(aeroflow, execute, expect, sinon) {
      return describe('#count', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.count;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.count();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('Emits next(0, 0, @context) notification when flow is empty', function () {
            return execute(function (context) {
              return aeroflow.empty.count().notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWith(0, 0, context);
            });
          });
          it('Emits next(@count, 0, @context) notification with @count of values emitted by flow', function () {
            return execute(function (context) {
              return context.values = [1, 2, 3];
            }, function (context) {
              return aeroflow(context.values).count().notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWith(context.values.length, 0, context);
            });
          });
        });
      });
    };

    var maxOperatorTests = function maxOperatorTests(aeroflow, execute, expect, sinon) {
      return describe('#max', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.max;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.max();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('Does not emit next notification when flow is empty', function () {
            return execute(function (context) {
              return aeroflow.empty.max().notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
          it('Emits next(@max, 0, @context) notification with @max as maximum value emitted by flow when flow emits numeric values', function () {
            return execute(function (context) {
              return context.values = [1, 3, 2];
            }, function (context) {
              return aeroflow(context.values).max().notify(context.spy).run(context);
            }, function (context) {
              var _Math;

              return expect(context.spy).to.have.been.calledWithExactly((_Math = Math).max.apply(_Math, _toConsumableArray(context.values)), 0, context);
            });
          });
          it('Emits next(@max, 0, @context) notification with @max as maximum value emitted by flow when flow emits string values', function () {
            return execute(function (context) {
              return context.values = ['a', 'c', 'b'];
            }, function (context) {
              return aeroflow(context.values).max().notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWith(context.values.reduce(function (max, value) {
                return value > max ? value : max;
              }), 0, context);
            });
          });
        });
      });
    };

    var minOperatorTests = function minOperatorTests(aeroflow, execute, expect, sinon) {
      return describe('#min', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.min;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.min();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('Does not emit next notification when flow is empty', function () {
            return execute(function (context) {
              return aeroflow.empty.min().notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
          it('Emits next(@min, 0, @context) notification with @min as minimum value emitted by flow when flow emits numeric values', function () {
            return execute(function (context) {
              return context.values = [1, 3, 2];
            }, function (context) {
              return aeroflow(context.values).min().notify(context.spy).run(context);
            }, function (context) {
              var _Math2;

              return expect(context.spy).to.have.been.calledWithExactly((_Math2 = Math).min.apply(_Math2, _toConsumableArray(context.values)), 0, context);
            });
          });
          it('Emits next(@min, 0, @context) notification with @min as minimum value emitted by flow when flow emits string values', function () {
            return execute(function (context) {
              return context.values = ['a', 'c', 'b'];
            }, function (context) {
              return aeroflow(context.values).min().notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWith(context.values.reduce(function (min, value) {
                return value < min ? value : min;
              }), 0, context);
            });
          });
        });
      });
    };

    var aeroflowTests = function aeroflowTests(aeroflow, expect, sinon) {
      function execute(arrange, act, assert) {
        if (arguments.length < 3) {
          assert = act;
          act = arrange;
          arrange = null;
        }

        var context = {
          nop: Function(),
          spy: sinon.spy()
        };
        if (arrange) arrange(context);
        return Promise.resolve(act(context)).catch(Function()).then(function (result) {
          context.result = result;
          assert(context);
        });
      }

      describe('aeroflow', function () {
        it('Is function', function () {
          return execute(function (context) {}, function (context) {
            return aeroflow;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('Emits done(true, @context) notification', function () {
            return execute(function (context) {
              return aeroflow().notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Does not emit next notification', function () {
            return execute(function (context) {
              return aeroflow().notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
        });
        describe('(@source:aeroflow)', function () {
          it('Emits done(true, @context) notification when @source is empty', function () {
            return execute(function (context) {
              return aeroflow(aeroflow.empty).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits done(true, @context) notification when @source is not empty and has been entirely enumerated', function () {
            return execute(function (context) {
              return aeroflow(aeroflow([1, 2])).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits done(false, @context) notification when @source is not empty but has not been entirely enumerated', function () {
            return execute(function (context) {
              return aeroflow(aeroflow([1, 2])).take(1).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(false, context);
            });
          });
          it('Does not emit next notification when @source is empty', function () {
            return execute(function (context) {
              return aeroflow(aeroflow.empty).notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
          it('Emits several next(@value, @index, @context) notifications for each @value from @source', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(aeroflow(context.values)).notify(context.spy).run(context);
            }, function (context) {
              return context.values.forEach(function (value, index) {
                return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context);
              });
            });
          });
        });
        describe('(@source:array)', function () {
          it('Emits done(true, @context) notification when @source is empty', function () {
            return execute(function (context) {
              return aeroflow([]).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWith(true, context);
            });
          });
          it('Emits done(true, @context) notification when @source is not empty and has been entirely enumerated', function () {
            return execute(function (context) {
              return aeroflow([1, 2]).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits done(false, @context) notification when @source is not empty and has not been entirely enumerated', function () {
            return execute(function (context) {
              return aeroflow([1, 2]).take(1).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(false, context);
            });
          });
          it('Does not emit next notification when @source is empty', function () {
            return execute(function (context) {
              return aeroflow([]).notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
          it('Emits several next(@value, @index, @context) notifications for each subsequent @value from @source', function () {
            return execute(function (context) {
              return context.source = [1, 2];
            }, function (context) {
              return aeroflow(context.source).notify(context.spy).run(context);
            }, function (context) {
              return context.source.forEach(function (value, index) {
                return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context);
              });
            });
          });
        });
        describe('(@source:date)', function () {
          it('Emits done(true, @context) notification', function () {
            return execute(function (context) {
              return context.source = new Date();
            }, function (context) {
              return aeroflow(context.source).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits next(@source, 0, @context) notification', function () {
            return execute(function (context) {
              return context.source = new Date();
            }, function (context) {
              return aeroflow(context.source).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context);
            });
          });
        });
        describe('(@source:error)', function () {
          it('Emits done(true, @context) notification', function () {
            return execute(function (context) {
              return context.source = new Error('test');
            }, function (context) {
              return aeroflow(context.source).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.source, context);
            });
          });
          it('Does not emit next notification', function () {
            return execute(function (context) {
              return aeroflow(new Error('test')).notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
        });
        describe('(@source:function)', function () {
          it('Calls @source(context data)', function () {
            return execute(function (context) {
              return context = 42;
            }, function (context) {
              return aeroflow(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWith(context);
            });
          });
          it('Emits done(true, @context) notification when @source does not throw', function () {
            return execute(function (context) {
              return aeroflow(context.nop).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits done(@error, @context) notification when @source throws @error', function () {
            return execute(function (context) {
              return context.error = new Error('test');
            }, function (context) {
              return aeroflow(function () {
                throw context.error;
              }).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.error, context);
            });
          });
          it('Emits next(@value, 0, @context) notification when @source returns @value', function () {
            return execute(function (context) {
              return context.value = 42;
            }, function (context) {
              return aeroflow(function () {
                return context.value;
              }).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
            });
          });
        });
        describe('(@source:iterable)', function () {
          it('Emits done(true, @context) notification when source is empty', function () {
            return execute(function (context) {
              return aeroflow(new Set()).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits done(true, @context) notification when source is not empty and has been entirely enumerated', function () {
            return execute(function (context) {
              return aeroflow(new Set([1, 2])).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits done(false, @context) notification when source is not empty but has not been entirely enumerated', function () {
            return execute(function (context) {
              return aeroflow(new Set([1, 2])).take(1).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(false, context);
            });
          });
          it('Does not emit next notification when source is empty', function () {
            return execute(function (context) {
              return aeroflow(new Set()).notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
          it('Emits several next(@value, @index, @context) notifications for each subsequent @value from @source', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(new Set(context.values)).notify(context.spy).run(context);
            }, function (context) {
              return context.values.forEach(function (value, index) {
                return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context);
              });
            });
          });
        });
        describe('(@source:null)', function () {
          it('Emits done(true, @context) notification', function () {
            return execute(function (context) {
              return aeroflow(null).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits next(@source, 0, @context) notification', function () {
            return execute(function (context) {
              return context.source = null;
            }, function (context) {
              return aeroflow(context.source).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context);
            });
          });
        });
        describe('(@source:promise)', function () {
          it('Emits done(true, @context) notification when @source resolves', function () {
            return execute(function (context) {
              return aeroflow(Promise.resolve()).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits done(@error, @context) notification when @source rejects with @error', function () {
            return execute(function (context) {
              return context.error = new Error('test');
            }, function (context) {
              return aeroflow(Promise.reject(context.error)).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.error, context);
            });
          });
          it('Emits next(@value, 0, @context) notification when @source resolves with @value', function () {
            return execute(function (context) {
              return context.value = 42;
            }, function (context) {
              return aeroflow(Promise.resolve(context.value)).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.value, 0, context);
            });
          });
          it('Does not emit next notification when @source rejects', function () {
            return execute(function (context) {
              return aeroflow(Promise.reject()).notify(context.spy).run();
            }, function (context) {
              return expect(context.spy).to.have.not.been.called;
            });
          });
        });
        describe('(@source:string)', function () {
          it('Emits done(true, @context) notification', function () {
            return execute(function (context) {
              return aeroflow('test').notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits next(@source, 0, @context) notification', function () {
            return execute(function (context) {
              return context.source = 'test';
            }, function (context) {
              return aeroflow(context.source).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWith(context.source, 0, context);
            });
          });
        });
        describe('(@source:undefined)', function () {
          it('Emits done(true, @context) notification', function () {
            return execute(function (context) {
              return aeroflow(undefined).notify(context.nop, context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(true, context);
            });
          });
          it('Emits next(@source, 0, @context) notification', function () {
            return execute(function (context) {
              return context.source = undefined;
            }, function (context) {
              return aeroflow(context.source).notify(context.spy).run(context);
            }, function (context) {
              return expect(context.spy).to.have.been.calledWithExactly(context.source, 0, context);
            });
          });
        });
        describe('(...@sources)', function () {
          it('Emits serveral next(@value, @index, @context) notifications for each subsequent @value from @sources', function () {
            return execute(function (context) {
              var values = context.values = [true, new Date(), null, 42, 'test', Symbol('test'), undefined];
              context.sources = [values[0], [values[1]], new Set([values[2], values[3]]), function () {
                return values[4];
              }, Promise.resolve(values[5]), new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve(values[6]);
                });
              })];
            }, function (context) {
              return aeroflow.apply(undefined, _toConsumableArray(context.sources)).notify(context.spy).run(context);
            }, function (context) {
              return context.values.forEach(function (value, index) {
                return expect(context.spy.getCall(index)).to.have.been.calledWithExactly(value, index, context);
              });
            });
          });
        });
        [emptyGeneratorTests, expandGeneratorTests, justGeneratorTests, averageOperatorTests, countOperatorTests, maxOperatorTests, minOperatorTests].forEach(function (test) {
          return test(aeroflow, execute, expect, sinon);
        });
      });
    };

    return aeroflowTests;
  });
});
