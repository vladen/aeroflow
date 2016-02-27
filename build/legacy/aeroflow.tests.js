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

    var aeroflowTests = function aeroflowTests(aeroflow, expect, sinon) {
      var Context = function () {
        function Context() {
          _classCallCheck(this, Context);

          this.spies = new Map();
        }

        _createClass(Context, [{
          key: 'spy',
          value: function spy(key) {
            var spy = this.spies.get(key);
            if (!spy) this.spies.set(key, spy = sinon.spy());
            return spy;
          }
        }, {
          key: 'done',
          get: function get() {
            return this.spy('done');
          }
        }, {
          key: 'fake',
          get: function get() {
            return this.spy('fake');
          },
          set: function set(result) {
            this.spies.set('fake', sinon.spy(function () {
              return result;
            }));
          }
        }, {
          key: 'next',
          get: function get() {
            return this.spy('next');
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
          value: Function()
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
          it('Emits only single "done"', function () {
            return execute(function (context) {
              return aeroflow().notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.next).to.have.not.been.called;
            });
          });
        });
        describe('(@source:aeroflow)', function () {
          it('When @source is empty, emits only single "done"', function () {
            return execute(function (context) {
              return aeroflow(aeroflow.empty).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.next).to.have.not.been.called;
            });
          });
          it('When @source is not empty, emits "next" for each value from @source, then single "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(aeroflow(context.values)).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
            });
          });
        });
        describe('(@source:array)', function () {
          it('When @source is empty, emits only single "done"', function () {
            return execute(function (context) {
              return aeroflow([]).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.next).to.have.not.been.called;
            });
          });
          it('When @source is not empty, emits "next" for each value from @source, then "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(context.values).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledAfter(context.next);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
            });
          });
        });
        describe('(@source:date)', function () {
          it('Emits single "next" with @source, then single "done"', function () {
            return execute(function (context) {
              return context.source = new Date();
            }, function (context) {
              return aeroflow(context.source).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
            });
          });
        });
        describe('(@source:error)', function () {
          it('Emits only single "done" with @source', function () {
            return execute(function (context) {
              return aeroflow(context.error).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
              expect(context.next).to.have.not.been.called;
            });
          });
        });
        describe('(@source:function)', function () {
          it('Calls @source once with context data', function () {
            return execute(function (context) {
              return aeroflow(context.fake).run(context.data);
            }, function (context) {
              expect(context.fake).to.have.been.calledOnce;
              expect(context.fake).to.have.been.calledWith(context.data);
            });
          });
          it('When @source returns value, emits single "next" with value, then single "done"', function () {
            return execute(function (context) {
              return aeroflow(function () {
                return context.data;
              }).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.data);
            });
          });
          it('When @source throws, emits only single "done" with error', function () {
            return execute(function (context) {
              return aeroflow(context.fail).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
              expect(context.next).to.have.not.been.called;
            });
          });
        });
        describe('(@source:iterable)', function () {
          it('When @source is empty, emits only single "done"', function () {
            return execute(function (context) {
              return aeroflow(new Set()).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.next).to.have.not.been.called;
            });
          });
          it('When @source is not empty, emits "next" for each value from @source, then single "done"', function () {
            return execute(function (context) {
              return context.values = [1, 2];
            }, function (context) {
              return aeroflow(new Set(context.values)).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
            });
          });
        });
        describe('(@source:null)', function () {
          it('Emits single "next" with @source, then single "done"', function () {
            return execute(function (context) {
              return context.source = null;
            }, function (context) {
              return aeroflow(context.source).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
            });
          });
        });
        describe('(@source:promise)', function () {
          it('When @source rejects, emits single "done" with rejected error', function () {
            return execute(function (context) {
              return aeroflow(Promise.reject(context.error)).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledWith(context.error);
              expect(context.next).to.have.not.been.called;
            });
          });
          it('When @source resolves, emits single "next" with resolved value, then single "done"', function () {
            return execute(function (context) {
              return context.value = 42;
            }, function (context) {
              return aeroflow(Promise.resolve(context.value)).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.value);
            });
          });
        });
        describe('(@source:string)', function () {
          it('Emits single "next" with @source, then single "done"', function () {
            return execute(function (context) {
              return context.source = 'test';
            }, function (context) {
              return aeroflow(context.source).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
            });
          });
        });
        describe('(@source:undefined)', function () {
          it('Emits single "next" with @source, then single "done"', function () {
            return execute(function (context) {
              return context.source = undefined;
            }, function (context) {
              return aeroflow(context.source).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              expect(context.next).to.have.been.calledOnce;
              expect(context.next).to.have.been.calledWith(context.source);
            });
          });
        });
        describe('(...@sources)', function () {
          it('Emits "next" for each value from @sources, then single "done"', function () {
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
              return aeroflow.apply(undefined, _toConsumableArray(context.sources)).notify(context.next, context.done).run();
            }, function (context) {
              expect(context.done).to.have.been.calledOnce;
              expect(context.done).to.have.been.calledAfter(context.next);
              context.values.forEach(function (value, index) {
                return expect(context.next.getCall(index)).to.have.been.calledWith(value);
              });
            });
          });
        });
        [].forEach(function (test) {
          return test(aeroflow, execute, expect, sinon);
        });
      });
    };

    return aeroflowTests;
  });
});
