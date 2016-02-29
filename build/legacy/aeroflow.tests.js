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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  (function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.aeroflowTests = factory();
  })(undefined, function () {
    'use strict';

    var _this = this;

    var emptyGeneratorTests = function emptyGeneratorTests(aeroflow, execute, expect) {
      return describe('.empty', function () {
        it('Gets instance of Aeroflow', function () {
          return execute(function (context) {
            return aeroflow.empty;
          }, function (context) {
            return expect(context.result).to.be.an('Aeroflow');
          });
        });
        it('Emits only single greedy "done"', function () {
          return execute(function (context) {
            return aeroflow.empty.run(context.next, context.done);
          }, function (context) {
            expect(context.next).to.have.not.been.called;
            expect(context.done).to.have.been.calledOnce;
            expect(context.done).to.have.been.calledWith(true);
          });
        });
      });
    };

    var expandGeneratorTests = function expandGeneratorTests(aeroflow, execute, expect) {
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
          it('Calls @expander with undefined, 0  and context data on first iteration', function () {
            return execute(function (context) {
              return context.expander = context.spy();
            }, function (context) {
              return aeroflow.expand(context.expander).take(1).run(context.data);
            }, function (context) {
              return expect(context.expander).to.have.been.calledWithExactly(undefined, 0, context.data);
            });
          });
          it('Calls @expander with value previously returned by @expander, iteration index and context data on subsequent iterations', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.expander = context.spy(function (_, index) {
                return context.values[index];
              });
            }, function (context) {
              return aeroflow.expand(context.expander).take(context.values.length + 1).run(context.data);
            }, function (context) {
              return [undefined].concat(context.values).forEach(function (value, index) {
                return expect(context.expander.getCall(index)).to.have.been.calledWithExactly(value, index, context.data);
              });
            });
          });
          it('If @expander throws, emits only single faulty "done" with thrown error', function () {
            return execute(function (context) {
              return context.expander = context.fail;
            }, function (context) {
              return aeroflow(context.expander).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
          it('Emits "next" for each serial value returned by @expander, then not being infinite, lazy "done"', function () {
            return execute(function (context) {
              context.values = [1, 2, 3];
              context.expander = context.spy(function (_, index) {
                return context.values[index];
              });
            }, function (context) {
              return aeroflow.expand(context.expander).take(context.values.length).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@expander:function, @seed)', function () {
          it('Calls @expander with @seed on first iteration', function () {
            return execute(function (context) {
              context.expander = context.spy();
              context.seed = 'test';
            }, function (context) {
              return aeroflow.expand(context.expander, context.seed).take(1).run();
            }, function (context) {
              return expect(context.expander).to.have.been.calledWith(context.seed);
            });
          });
        });
        describe('(@expander:!function)', function () {
          it('Emits "next" with @expander', function () {
            return execute(function (context) {
              return context.expander = 'test';
            }, function (context) {
              return aeroflow.expand(context.expander).take(1).run(context.next);
            }, function (context) {
              return expect(context.next).to.have.been.calledWith(context.expander);
            });
          });
        });
      });
    };

    var justGeneratorTests = function justGeneratorTests(aeroflow, execute, expect) {
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
        });
        describe('(@value:aeroflow)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = aeroflow.empty;
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@value:array)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = [42];
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@value:function)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = Function();
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@value:iterable)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = new Set();
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@value:promise)', function () {
          it('Emits single "next" with @value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = Promise.resolve();
            }, function (context) {
              return aeroflow.just(context.value).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var averageOperatorTests = function averageOperatorTests(aeroflow, execute, expect) {
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
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.average().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits numeric values, emits single "next" with average of values, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2, 5];
            }, function (context) {
              return aeroflow(context.values).average().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.values.reduce(function (sum, value) {
                return sum + value;
              }, 0) / context.values.length);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
          it('When flow emits some not numeric values, emits single "next" with NaN, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 'test', 2];
            }, function (context) {
              return aeroflow(context.values).average().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(NaN);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var catchOperatorTests = function catchOperatorTests(aeroflow, execute, expect) {
      return describe('#catch', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.catch;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.catch();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.catch().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When flow emits only error, supresses error and emits only single lazy "done"', function () {
            return execute(function (context) {
              return aeroflow(context.error).catch().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
            });
          });
          it('When flow emits some values and then error, emits "next" for each serial value before error, then supresses error and emits single lazy "done" ignoring values emitted after error', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values, context.error, context.values).catch().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:array)', function () {
          it('When flow emits error, emits "next" for each serial value from @alternative, then single lazy "done"', function () {
            return execute(function (context) {
              return context.alternative = [1, 2];
            }, function (context) {
              return aeroflow(context.error).catch(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.alternative.length);
              context.alternative.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:function)', function () {
          it('When flow is empty, does not call @alternative', function () {
            return execute(function (context) {
              return context.alternative = context.spy();
            }, function (context) {
              return aeroflow.empty.catch(context.alternative).run();
            }, function (context) {
              return expect(context.alternative).not.to.have.been.called;
            });
          });
          it('When flow does not emit error, does not call @alternative', function () {
            return execute(function (context) {
              return context.alternative = context.spy();
            }, function (context) {
              return aeroflow('test').catch(context.alternative).run();
            }, function (context) {
              return expect(context.alternative).not.to.have.been.called;
            });
          });
          it('When flow emits several values and then error, calls @alternative once with emitted error and context data, then emits "next" for each serial value from result returned by @alternative, then emits single lazy "done"', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.alternative = context.spy(context.values);
            }, function (context) {
              return aeroflow(context.values, context.error).catch(context.alternative).run(context.next, context.done, context.data);
            }, function (context) {
              expect(context.alternative).to.have.been.calledOnce;
              expect(context.alternative).to.have.been.calledWith(context.error, context.data);
              expect(context.next).to.have.callCount(context.values.length * 2);
              context.values.forEach(function (value, index) {
                expect(context.next.getCall(index)).to.have.been.calledWith(value);
                expect(context.next.getCall(index + context.values.length)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:string)', function () {
          it('When flow emits error, emits "next" with @alternative, then single lazy "done"', function () {
            return execute(function (context) {
              return context.alternative = 'test';
            }, function (context) {
              return aeroflow(context.error).catch(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.alternative);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(false);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var coalesceOperatorTests = function coalesceOperatorTests(aeroflow, execute, expect) {
      return describe('#coalesce', function () {
        it('Is instance method', function () {
          return execute(function (context) {
            return aeroflow.empty.coalesce;
          }, function (context) {
            return expect(context.result).to.be.a('function');
          });
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return execute(function (context) {
              return aeroflow.empty.coalesce();
            }, function (context) {
              return expect(context.result).to.be.an('Aeroflow');
            });
          });
          it('When flow is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow.empty.coalesce().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@alternative:array)', function () {
          it('When flow is empty, emits "next" for each serial value from @alternative, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.alternative = [1, 2];
            }, function (context) {
              return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.alternative.length);
              context.alternative.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:function)', function () {
          it('When flow is empty, calls @alternative once with context data, emits single "next" with value returned by @alternative, then emits single greedy "done"', function () {
            return execute(function (context) {
              context.values = [1, 2];
              context.alternative = context.spy(context.values);
            }, function (context) {
              return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done, context.data);
            }, function (context) {
              expect(context.alternative).to.have.been.calledOnce;
              expect(context.alternative).to.have.been.calledWith(context.data);
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
          it('When flow emits error, does not call @alternative', function () {
            return execute(function (context) {
              return context.alternative = context.spy();
            }, function (context) {
              return aeroflow(context.error).coalesce(context.alternative).run();
            }, function (context) {
              return expect(context.alternative).to.have.not.been.called;
            });
          });
          it('When flow emits some values, does not call @alternative', function () {
            return execute(function (context) {
              return context.alternative = context.spy();
            }, function (context) {
              return aeroflow('test').coalesce(context.alternative).run();
            }, function (context) {
              return expect(context.alternative).to.have.not.been.called;
            });
          });
        });
        describe('(@alternative:promise)', function () {
          it('When flow is empty, emits single "next" with value resolved by @alternative, then emits single greedy "done"', function () {
            return execute(function (context) {
              context.value = 42;
              context.alternative = Promise.resolve(context.value);
            }, function (context) {
              return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@alternative:string)', function () {
          it('When flow is empty, emits single "next" with @alternative, then emits single greedy "done"', function () {
            return execute(function (context) {
              return context.alternative = 'test';
            }, function (context) {
              return aeroflow.empty.coalesce(context.alternative).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.alternative);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
      });
    };

    var aeroflowTests = function aeroflowTests(aeroflow, expect, sinon) {
      var Context = function () {
        function Context() {
          _classCallCheck(this, Context);
        }

        _createClass(Context, [{
          key: 'done',
          get: function get() {
            return this._done || (this._done = this.spy());
          },
          set: function set(result) {
            this._done = this.spy(result);
          }
        }, {
          key: 'next',
          get: function get() {
            return this._next || (this._next = this.spy());
          },
          set: function set(result) {
            this._next = this.spy(result);
          }
        }]);

        return Context;
      }();

      Object.defineProperties(Context.prototype, {
        data: {
          value: {
            data: true
          }
        },
        error: {
          value: new Error('test')
        },
        fail: {
          value: function value() {
            throw _this.error;
          }
        },
        noop: {
          value: function value() {}
        },
        spy: {
          value: function value(result) {
            return sinon.spy(typeof result === 'function' ? result : function () {
              return result;
            });
          }
        }
      });

      function execute(arrange, act, assert) {
        if (arguments.length < 3) {
          assert = act;
          act = arrange;
          arrange = null;
        }

        var context = new Context();
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
          it('Emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow().run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
        });
        describe('(@source:aeroflow)', function () {
          it('When @source is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow(aeroflow.empty).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(aeroflow(context.values)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:array)', function () {
          it('When @source is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow([]).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:date)', function () {
          it('Emits single "next" with @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.source = new Date();
            }, function (context) {
              return aeroflow(context.source).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:error)', function () {
          it('Emits only single faulty "done" with @source', function () {
            return execute(function (context) {
              return aeroflow(context.error).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
        });
        describe('(@source:function)', function () {
          it('Calls @source once with context data', function () {
            return execute(function (context) {
              return context.source = context.spy();
            }, function (context) {
              return aeroflow(context.source).run(context.data);
            }, function (context) {
              expect(context.source).to.have.been.calledOnce;
              expect(context.source).to.have.been.calledWith(context.data);
            });
          });
          it('When @source returns value, emits single "next" with value, then single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow(function () {
                return context.data;
              }).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.data);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
          it('When @source throws, emits only single faulty "done" with thrown error', function () {
            return execute(function (context) {
              return aeroflow(context.fail).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
        });
        describe('(@source:iterable)', function () {
          it('When @source is empty, emits only single greedy "done"', function () {
            return execute(function (context) {
              return aeroflow(new Set()).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
            });
          });
          it('When @source is not empty, emits "next" for each serial value from @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(new Set(context.values)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:null)', function () {
          it('Emits single "next" with @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.source = null;
            }, function (context) {
              return aeroflow(context.source).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:promise)', function () {
          it('When @source rejects, emits single faulty "done" with rejected error', function () {
            return execute(function (context) {
              return aeroflow(Promise.reject(context.error)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.not.been.called;
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
            });
          });
          it('When @source resolves, emits single "next" with resolved value, then single greedy "done"', function () {
            return execute(function (context) {
              return context.value = 42;
            }, function (context) {
              return aeroflow(Promise.resolve(context.value)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:string)', function () {
          it('Emits single "next" with @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.source = 'test';
            }, function (context) {
              return aeroflow(context.source).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(@source:undefined)', function () {
          it('Emits single "next" with @source, then single greedy "done"', function () {
            return execute(function (context) {
              return context.source = undefined;
            }, function (context) {
              return aeroflow(context.source).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        describe('(...@sources)', function () {
          it('Emits "next" with each serial value from @sources, then single greedy "done"', function () {
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
              return aeroflow.apply(undefined, _toConsumableArray(context.sources)).run(context.next, context.done);
            }, function (context) {
              expect(context.next).to.have.callCount(context.values.length);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(true);
              expect(context.done).to.have.been.calledAfter(context.next);
            });
          });
        });
        [emptyGeneratorTests, expandGeneratorTests, justGeneratorTests, averageOperatorTests, catchOperatorTests, coalesceOperatorTests].forEach(function (test) {
          return test(aeroflow, execute, expect);
        });
      });
    };

    return aeroflowTests;
  });
});
