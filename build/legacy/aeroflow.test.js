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
    global.aeroflowTest = mod.exports;
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
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.aeroflowTest = factory();
  })(undefined, function () {
    'use strict';

    function testify(arrange, act) {
      for (var _len = arguments.length, asserts = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        asserts[_key - 2] = arguments[_key];
      }

      var input = arrange();
      return Promise.resolve(act(input)).then(function (result) {
        input.result = result;
        asserts.forEach(function (assert) {
          return assert(input);
        });
      }).catch(function () {});
    }

    var aeroflowTest = function aeroflowTest(aeroflow, chai) {
      return describe('aeroflow', function () {
        it('Is function', function () {
          return chai.expect(aeroflow).to.be.a('function');
        });
        describe('()', function () {
          it('Returns instance of Aeroflow', function () {
            return chai.expect(aeroflow()).to.be.an('Aeroflow');
          });
          it('Returns empty flow not emitting "next" notification', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow().notify(spy, Function()).run();
            }, function (spy) {
              return chai.expect(spy).not.to.have.been.called();
            });
          });
          it('Returns empty flow emitting "done" notification argumented with "true"', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow().notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
        });
        describe('(@source:aeroflow)', function () {
          it('Returns flow emitting "done" notification argumented with "true" when @source is empty', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(aeroflow.empty).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(aeroflow([1, 2])).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty but has not been entirely enumerated', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(aeroflow([1, 2])).take(1).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(false);
            });
          });
          it('Returns flow not emitting "next" notification when @source is empty', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(aeroflow.empty).notify(spy, Function()).run();
            }, function (spy) {
              return chai.expect(spy).not.to.have.been.called();
            });
          });
          it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', function () {
            return testify(function () {
              return {
                source: [1, 2],
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(aeroflow(context.source)).notify(context.spy, Function()).run();
            }, function (context) {
              var _chai$expect$to$have$;

              return (_chai$expect$to$have$ = chai.expect(context.spy).to.have.been.called).with.apply(_chai$expect$to$have$, _toConsumableArray(context.source));
            });
          });
        });
        describe('(@source:array)', function () {
          it('Returns flow emitting "done" notification argumented with "true" when @source is empty', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow([]).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow eventually emitting "done" notification argumented with "true" when @source is not empty and has been entirely enumerated', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow([1, 2]).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow eventually emitting "done" notification argumented with "false" when @source is not empty and has not been entirely enumerated', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow([1, 2]).take(1).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(false);
            });
          });
          it('Returns flow not emitting "next" notification when @source is empty', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow([]).notify(spy, Function()).run();
            }, function (spy) {
              return chai.expect(spy).not.to.have.been.called();
            });
          });
          it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', function () {
            return testify(function () {
              return {
                source: [1, 2],
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(context.source).notify(context.spy, Function()).run();
            }, function (context) {
              var _chai$expect$to$have$2;

              return (_chai$expect$to$have$2 = chai.expect(context.spy).to.have.been.called).with.apply(_chai$expect$to$have$2, _toConsumableArray(context.source));
            });
          });
        });
        describe('(@source:date)', function () {
          it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(new Date()).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with @source', function () {
            return testify(function () {
              return {
                source: new Date(),
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(context.source).notify(context.spy, Function()).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.source);
            });
          });
        });
        describe('(@source:error)', function () {
          it('Returns flow emitting "done" notification argumented with @source', function () {
            return testify(function () {
              return {
                source: new Error('test'),
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(context.source).notify(Function(), context.spy).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.source);
            });
          });
          it('Returns flow not emitting "next" notification', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(new Error('test')).notify(spy, Function()).run();
            }, function (spy) {
              return chai.expect(spy).not.to.have.been.called();
            });
          });
        });
        describe('(@source:function)', function () {
          it('Calls @source and passes context data as first argument', function () {
            return testify(function () {
              return {
                data: {},
                source: chai.spy()
              };
            }, function (context) {
              return aeroflow(context.source).run(context.data);
            }, function (context) {
              return chai.expect(context.source).to.have.been.called.with(context.data);
            });
          });
          it('Returns flow eventually emitting "done" notification argumented with "true" when @source does not throw', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(Function()).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with error thrown by @source', function () {
            return testify(function () {
              return {
                error: new Error('test'),
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(function () {
                throw context.error;
              }).notify(Function(), context.spy).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.error);
            });
          });
          it('Returns flow emitting "next" notification argumented with result returned by @source', function () {
            return testify(function () {
              return {
                result: 'test',
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(function () {
                return context.result;
              }).notify(context.spy, Function()).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.result);
            });
          });
        });
        describe('(@source:iterable)', function () {
          it('Returns empty flow emitting "done" notification argumented with "true" when source is empty', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(new Set()).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow eventually emitting "done" notification argumented with "true" when source is not empty and has been entirely enumerated', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(new Set([1, 2])).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow eventually emitting "done" notification argumented with "false" when source is not empty but has not been entirely enumerated', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(new Set([1, 2])).take(1).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(false);
            });
          });
          it('Returns flow not emitting "next" notification when source is empty', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(new Set()).notify(spy, Function()).run();
            }, function (spy) {
              return chai.expect(spy).not.to.have.been.called();
            });
          });
          it('Returns flow emitting several "next" notifications argumented with subsequent items from @source', function () {
            return testify(function () {
              return {
                source: [1, 2],
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(new Set(context.source)).notify(context.spy, Function()).run();
            }, function (context) {
              var _chai$expect$to$have$3;

              return (_chai$expect$to$have$3 = chai.expect(context.spy).to.have.been.called).with.apply(_chai$expect$to$have$3, _toConsumableArray(context.source));
            });
          });
        });
        describe('(@source:null)', function () {
          it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(null).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with @source', function () {
            return testify(function () {
              return {
                source: null,
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(context.source).notify(context.spy, Function()).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.source);
            });
          });
        });
        describe('(@source:promise)', function () {
          it('Returns flow eventually emitting "done" notification argumented with "true" when @source resolves', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(Promise.resolve()).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow emitting "done" notification argumented with rejection error when @source rejects', function () {
            return testify(function () {
              return {
                error: new Error('test'),
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(Promise.reject(context.error)).notify(Function(), context.spy).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.error);
            });
          });
          it('Returns flow emitting "next" notification argumented with result resolved by @source', function () {
            return testify(function () {
              return {
                result: 'test',
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(Promise.resolve(context.result)).notify(context.spy, Function()).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.source);
            });
          });
        });
        describe('(@source:string)', function () {
          it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow('test').notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with @source', function () {
            return testify(function () {
              return {
                source: 'test',
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(context.source).notify(context.spy, Function()).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.source);
            });
          });
        });
        describe('(@source:undefined)', function () {
          it('Returns flow eventually emitting "done" notification argumented with "true"', function () {
            return testify(function () {
              return chai.spy();
            }, function (spy) {
              return aeroflow(undefined).notify(Function(), spy).run();
            }, function (spy) {
              return chai.expect(spy).to.have.been.called.with(true);
            });
          });
          it('Returns flow emitting "next" notification argumented with @source', function () {
            return testify(function () {
              return {
                source: undefined,
                spy: chai.spy()
              };
            }, function (context) {
              return aeroflow(context.source).notify(context.spy, Function()).run();
            }, function (context) {
              return chai.expect(context.spy).to.have.been.called.with(context.source);
            });
          });
        });
      });
    };

    return aeroflowTest;
  });
});
