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
    global.aeroflow = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _objectCreate;

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var AEROFLOW = 'Aeroflow';
  var ARRAY = 'Array';
  var CLASS = Symbol.toStringTag;
  var CONTEXT = Symbol('Context');
  var DATE = 'Date';
  var DONE = Symbol('Done');
  var EMITTER = Symbol('Emitter');
  var ERROR = 'Error';
  var FUNCTION = 'Function';
  var ITERATOR = Symbol.iterator;
  var NEXT = Symbol('Next');
  var NUMBER = 'Number';
  var PROMISE = 'Promise';
  var PROTOTYPE = 'prototype';
  var REGEXP = 'RegExp';
  var STRING = 'String';
  var SYMBOL = 'Symbol';
  var UNDEFINED = 'Undefined';
  var dateNow = Date.now;
  var mathFloor = Math.floor;
  var mathPow = Math.pow;
  var mathRandom = Math.random;
  var mathMax = Math.max;
  var mathMin = Math.min;
  var maxInteger = Number.MAX_SAFE_INTEGER;
  var nothing = undefined;
  var objectCreate = Object.create;
  var objectDefineProperties = Object.defineProperties;
  var objectDefineProperty = Object.defineProperty;
  var objectToString = Object.prototype.toString;

  var compare = function compare(left, right, direction) {
    return left < right ? -direction : left > right ? direction : 0;
  };

  var constant = function constant(value) {
    return function () {
      return value;
    };
  };

  var identity = function identity(value) {
    return value;
  };

  var noop = function noop() {};

  var classOf = function classOf(value) {
    return objectToString.call(value).slice(8, -1);
  };

  var classIs = function classIs(className) {
    return function (value) {
      return classOf(value) === className;
    };
  };

  var isBoolean = function isBoolean(value) {
    return value === true || value === false;
  };

  var isDefined = function isDefined(value) {
    return value !== nothing;
  };

  var isError = classIs(ERROR);

  var isFunction = function isFunction(value) {
    return typeof value == 'function';
  };

  var isInteger = Number.isInteger;

  var isObject = function isObject(value) {
    return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  };

  var isPromise = classIs(PROMISE);

  var isUndefined = function isUndefined(value) {
    return value === nothing;
  };

  var tie = function tie(func) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return function () {
      return func.apply(undefined, args);
    };
  };

  var falsey = function falsey() {
    return false;
  };

  var truthy = function truthy() {
    return true;
  };

  var toDelay = function toDelay(value, def) {
    switch (classOf(value)) {
      case DATE:
        value = value - dateNow();
        break;

      case NUMBER:
        break;

      default:
        value = +value;
        break;
    }

    return isNaN(value) ? def : value < 0 ? 0 : value;
  };

  var toFunction = function toFunction(value, def) {
    return isFunction(value) ? value : isDefined(def) ? isFunction(def) ? def : constant(def) : constant(value);
  };

  var toNumber = function toNumber(value, def) {
    value = +value;
    return isNaN(value) ? def : value;
  };

  var toError = function toError(value) {
    return isError(value) ? value : new Error(value);
  };

  function registry() {
    var list = [];
    return objectDefineProperties(list, {
      get: {
        value: get
      },
      use: {
        value: use
      }
    });

    function get(target) {
      var builder = list[classOf(target)];

      for (var _len2 = arguments.length, parameters = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        parameters[_key2 - 1] = arguments[_key2];
      }

      if (isFunction(builder)) return builder.apply(undefined, [target].concat(parameters));

      for (var i = list.length; i--;) {
        var _instance = list[i].apply(list, [target].concat(parameters));

        if (_instance) return _instance;
      }
    }

    function use(key, builder) {
      switch (classOf(key)) {
        case FUNCTION:
          list.push(key);
          break;

        case NUMBER:
          if (isFunction(builder)) list.splice(key, 0, builder);else list.splice(key, 1);
          break;

        case STRING:
        case SYMBOL:
          if (isFunction(builder)) list[key] = builder;else delete list[key];
          break;
      }

      return list;
    }
  }

  function unsync(result, next, done) {
    switch (result) {
      case true:
        return false;

      case false:
        done(false);
        return true;
    }

    if (isPromise(result)) return result.then(function (promiseResult) {
      if (!unsync(promiseResult, next, done)) next(true);
    }, function (promiseError) {
      return done(toError(promiseError));
    });
    done(result);
    return true;
  }

  function arrayAdapter(source) {
    return function (next, done, context) {
      var index = -1;
      !function proceed() {
        while (++index < source.length) {
          if (unsync(next(source[index]), proceed, done)) return;
        }

        done(true);
      }();
    };
  }

  function errorAdapter(error) {
    return function (next, done) {
      done(error);
    };
  }

  function flowAdapter(flow) {
    return flow[EMITTER];
  }

  function functionAdapter(source) {
    return function (next, done, context) {
      if (!unsync(next(source()), done, done)) done(true);
    };
  }

  function iterableAdapter(source) {
    if (isObject(source) && ITERATOR in source) return function (next, done, context) {
      var iterator = source[ITERATOR]();
      !function proceed() {
        var iteration = undefined;

        while (!(iteration = iterator.next()).done) {
          if (unsync(next(iteration.value), proceed, done)) return;
        }

        done(true);
      }();
    };
  }

  function promiseAdapter(source) {
    return function (next, done, context) {
      return source.then(function (result) {
        if (!unsync(next(result), done, done)) done(true);
      }, function (result) {
        return done(toError(result));
      });
    };
  }

  function valueAdapter(source) {
    return function (next, done) {
      if (!unsync(next(source), done, done)) done(true);
    };
  }

  var adapters = registry().use(iterableAdapter).use(AEROFLOW, flowAdapter).use(ARRAY, arrayAdapter).use(ERROR, errorAdapter).use(FUNCTION, functionAdapter).use(PROMISE, promiseAdapter);

  function emptyGenerator(result) {
    return function (next, done) {
      return done(result);
    };
  }

  function impede(next, done) {
    var _ref;

    var busy = false,
        idle = false,
        queue = [],
        signal = undefined;

    function convey() {
      busy = false;

      while (queue.length) {
        signal = unsync(queue.pop()(), convey, finish);

        switch (signal) {
          case false:
            signal = true;
            continue;

          case true:
            return signal = false;

          default:
            return;
        }
      }

      if (idle) queue = nothing;
    }

    function finish(result) {
      idle = true;
      signal = false;
      queue = nothing;
      done(result);
    }

    return _ref = {}, _defineProperty(_ref, DONE, function (result) {
      if (idle) return false;
      idle = true;
      queue.push(tie(done, result));
      if (!busy) convey();
    }), _defineProperty(_ref, NEXT, function (result) {
      if (idle) return false;
      queue.push(tie(next, result));
      if (!busy) convey();
      return signal;
    }), _ref;
  }

  function customGenerator(generator) {
    if (isUndefined(generator)) return emptyGenerator(true);
    if (!isFunction(generator)) return valueAdapter(generator);
    return function (next, done, context) {
      var finalizer = generator(impede(next, function (result) {
        if (isFunction(finalizer)) setImmediate(finalizer);
        done(result);
      }, context));
    };
  }

  function expandGenerator(expander, seed) {
    expander = toFunction(expander);
    return function (next, done, context) {
      var index = 0,
          value = seed;
      !function proceed() {
        while (!unsync(next(value = expander(value, index++)), proceed, done)) {}
      }();
    };
  }

  function randomGenerator(minimum, maximum) {
    maximum = toNumber(maximum, 1 - mathPow(10, -15));
    minimum = toNumber(minimum, 0);
    maximum -= minimum;
    var rounder = isInteger(minimum) && isInteger(maximum) ? mathFloor : identity;
    return function (next, done) {
      !function proceed() {
        while (!unsync(next(rounder(minimum + maximum * mathRandom())), proceed, done)) {}
      }();
    };
  }

  function rangeGenerator(start, end, step) {
    end = toNumber(end, maxInteger);
    start = toNumber(start, 0);
    if (start === end) return valueAdapter(start);
    var down = start < end;

    if (down) {
      step = toNumber(step, 1);
      if (step < 1) return valueAdapter(start);
    } else {
      step = toNumber(step, -1);
      if (step > -1) return valueAdapter(start);
    }

    var limiter = down ? function (value) {
      return value <= end;
    } : function (value) {
      return value >= end;
    };
    return function (next, done, context) {
      var value = start - step;
      !function proceed() {
        while (limiter(value += step)) {
          if (unsync(next(value), proceed, done)) return;
        }

        done(true);
      }();
    };
  }

  function repeatDeferredGenerator(repeater, delayer) {
    return function (next, done, context) {
      var index = 0;
      !function proceed(result) {
        setTimeout(function () {
          if (!unsync(next(repeater(index++)), proceed, done)) proceed();
        }, toDelay(delayer(index), 1000));
      }();
    };
  }

  function repeatImmediateGenerator(repeater) {
    return function (next, done, context) {
      var index = 0;
      !function proceed() {
        while (!unsync(next(repeater(index++)), proceed, done)) {}
      }();
    };
  }

  function repeatGenerator(repeater, delayer) {
    repeater = toFunction(repeater);
    return isDefined(delayer) ? repeatDeferredGenerator(repeater, toFunction(delayer)) : repeatImmediateGenerator(repeater);
  }

  function eventEmitterListener(target) {
    var eventName = arguments.length <= 1 || arguments[1] === undefined ? 'next' : arguments[1];
    if (isObject(target) && isFunction(target.addListener) && isFunction(target.removeListener)) return function (next) {
      target.addListener(eventName, next);
      return function () {
        return target.removeListener(eventName, next);
      };
    };
  }

  function eventTargetListener(target) {
    var eventName = arguments.length <= 1 || arguments[1] === undefined ? 'next' : arguments[1];
    var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    if (isObject(target) && isFunction(target.addEventListener) && isFunction(target.removeEventListener)) return function (next) {
      target.addEventListener(eventName, next, useCapture);
      return function () {
        return target.removeEventListener(eventName, next, useCapture);
      };
    };
  }

  var listeners = registry().use(eventEmitterListener).use(eventTargetListener);

  function listener(source, parameters) {
    var instance = listeners.get.apply(listeners, [source].concat(_toConsumableArray(parameters)));
    return isFunction(instance) ? function (next, done, context) {
      var _impede = impede(next, done);

      var retardedDone = _impede[DONE];
      var retardedNext = _impede[NEXT];
      var finalizer = toFunction(instance(onNext, onDone));

      function onDone(result) {
        setImmediate(finalizer);
        retardedDone(false);
      }

      function onNext(result) {
        if (false === retardedNext(result)) onDone(false);
      }
    } : emptyGenerator(true);
  }

  function consoleNotifier(target) {
    var _ref2;

    var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    if (!isObject(target)) return;
    var log = target.log;
    var error = target.error;
    if (!isFunction(log)) return;
    return _ref2 = {}, _defineProperty(_ref2, DONE, function (result) {
      return (isError(result) && isFunction(error) ? error : log).call(target, prefix + 'done', result);
    }), _defineProperty(_ref2, NEXT, function (result) {
      return log.call(target, prefix + 'next', result);
    }), _ref2;
  }

  function eventEmitterNotifier(target) {
    var _ref3;

    var nextEventType = arguments.length <= 1 || arguments[1] === undefined ? 'next' : arguments[1];
    var doneEventType = arguments.length <= 2 || arguments[2] === undefined ? 'done' : arguments[2];
    if (!isObject(target) || !isFunction(target.emit)) return;

    var emit = function emit(eventName) {
      return function (result) {
        return target.emit(eventName, result);
      };
    };

    return _ref3 = {}, _defineProperty(_ref3, DONE, emit(doneEventType)), _defineProperty(_ref3, NEXT, emit(nextEventType)), _ref3;
  }

  function eventTargetNotifier(target) {
    var _ref4;

    var nextEventType = arguments.length <= 1 || arguments[1] === undefined ? 'next' : arguments[1];
    var doneEventType = arguments.length <= 2 || arguments[2] === undefined ? 'done' : arguments[2];
    if (!isObject(target) || !isFunction(target.dispatchEvent)) return;

    var dispatch = function dispatch(eventName) {
      return function (detail) {
        return target.dispatchEvent(new CustomEvent(eventName, {
          detail: detail
        }));
      };
    };

    return _ref4 = {}, _defineProperty(_ref4, DONE, dispatch(doneEventType)), _defineProperty(_ref4, NEXT, dispatch(nextEventType)), _ref4;
  }

  var notifiers = registry().use(consoleNotifier).use(eventTargetNotifier).use(eventEmitterNotifier);

  function notifier(target, parameters) {
    return function (emitter) {
      return function (next, done, context) {
        var instance = notifiers.get.apply(notifiers, [target].concat(_toConsumableArray(parameters)));

        if (isObject(instance)) {
          var _ret = function () {
            var notifyDone = instance[DONE];
            var notifyNext = instance[NEXT];
            if (isFunction(notifyNext)) return {
              v: emitter(function (result) {
                notifyNext(result);
                return next(result);
              }, function (result) {
                if (isFunction(notifyDone)) notifyDone(result);
                return done(result);
              }, context)
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }

        emitter(next, done, context);
      };
    };
  }

  function reduceOperator(reducer, seed, forced) {
    if (isUndefined(reducer)) {
      reducer = identity;
      seed = constant();
    } else if (isFunction(reducer)) seed = toFunction(seed);else return tie(valueAdapter, reducer);

    return function (emitter) {
      return function (next, done, context) {
        var empty = !forced,
            index = 0,
            reduced = seed();
        emitter(function (result) {
          if (empty) {
            empty = false;

            if (isUndefined(reduced)) {
              reduced = result;
              return true;
            }
          }

          reduced = reducer(reduced, result, index++);
          return true;
        }, function (result) {
          if (isError(result) || empty || !unsync(next(reduced), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function averageOperator(forced) {
    return reduceOperator(function (average, result, index) {
      return (average * index + result) / (index + 1);
    }, 0);
  }

  function catchOperator(alternative) {
    if (isDefined(alternative)) {
      alternative = toFunction(alternative);
      return function (emitter) {
        return function (next, done, context) {
          return emitter(next, function (result) {
            if (isError(result)) {
              var source = alternative(result);
              (adapters.get(source) || valueAdapter(source))(next, tie(done, false), context);
            } else done(result);
          }, context);
        };
      };
    }

    return function (emitter) {
      return function (next, done, context) {
        return emitter(next, function (result) {
          return done(!isError(result) && result);
        }, context);
      };
    };
  }

  function coalesceOperator(alternative) {
    if (!isDefined(alternative)) return identity;
    alternative = toFunction(alternative);
    return function (emitter) {
      return function (next, done, context) {
        var empty = true;
        emitter(function (result) {
          empty = false;
          return next(result);
        }, function (result) {
          if (!isError(result) && empty) {
            var source = alternative();
            (adapters.get(source) || valueAdapter(source))(next, done, context);
          } else done(result);
        }, context);
      };
    };
  }

  function countOperator() {
    return reduceOperator(function (count) {
      return count + 1;
    }, 0, true);
  }

  function delayOperator(interval) {
    var delayer = toFunction(interval);
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        return emitter(function (result) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              try {
                if (!unsync(next(result), resolve, reject)) resolve(true);
              } catch (error) {
                reject(error);
              }
            }, toDelay(delayer(result, index++), 1000));
          });
        }, done, context);
      };
    };
  }

  function distinctOperator(untilChanged) {
    return function (emitter) {
      return untilChanged ? function (next, done, context) {
        var idle = true,
            last = undefined;
        emitter(function (result) {
          if (!idle && last === result) return true;
          idle = false;
          last = result;
          return next(result);
        }, done, context);
      } : function (next, done, context) {
        var set = new Set();
        emitter(function (result) {
          if (set.has(result)) return true;
          set.add(result);
          return next(result);
        }, done, context);
      };
    };
  }

  function everyOperator(condition) {
    var predicate = undefined;

    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;

      case REGEXP:
        predicate = function predicate(result) {
          return condition.test(result);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(result) {
          return !!result;
        };

        break;

      default:
        predicate = function predicate(result) {
          return result === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var empty = true,
            every = true,
            index = 0;
        emitter(function (result) {
          empty = false;
          if (predicate(result, index++)) return true;
          return every = false;
        }, function (result) {
          if (isError(result) || !unsync(next(every || empty), done, done)) done(result);
        }, context);
      };
    };
  }

  function filterOperator(condition) {
    var predicate = undefined;

    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;

      case REGEXP:
        predicate = function predicate(result) {
          return condition.test(result);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(result) {
          return !!result;
        };

        break;

      default:
        predicate = function predicate(result) {
          return result === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (result) {
          return !predicate(result, index++) || next(result);
        }, done, context);
      };
    };
  }

  function flattenOperator(depth) {
    depth = toNumber(depth, maxInteger);
    if (depth < 1) return identity;
    return function (emitter) {
      return function (next, done, context) {
        var level = 0;

        var flatten = function flatten(result) {
          if (level === depth) return next(result);
          var adapter = adapters.get(result);

          if (adapter) {
            level++;
            return new Promise(function (resolve) {
              return adapter(flatten, function (adapterResult) {
                level--;
                resolve(adapterResult);
              }, context);
            });
          } else return next(result);
        };

        emitter(flatten, done, context);
      };
    };
  }

  function groupOperator(selectors) {
    selectors = selectors.length ? selectors.map(toFunction) : [constant];
    var limit = selectors.length - 1;
    return function (emitter) {
      return function (next, done, context) {
        var groups = new Map(),
            index = 0;
        emitter(function (value) {
          var ancestor = groups,
              descendant = undefined;

          for (var i = -1; ++i <= limit;) {
            var key = selectors[i](value, index++);
            descendant = ancestor.get(key);

            if (!descendant) {
              descendant = i === limit ? [] : new Map();
              ancestor.set(key, descendant);
            }

            ancestor = descendant;
          }

          descendant.push(value);
          return true;
        }, function (result) {
          if (isError(result)) done(result);else iterableAdapter(groups)(next, tie(done, result), context);
        }, context);
      };
    };
  }

  function mapOperator(mapper) {
    if (isUndefined(mapper)) return identity;
    mapper = toFunction(mapper);
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          return next(mapper(value, index++));
        }, done, context);
      };
    };
  }

  function maxOperator() {
    return reduceOperator(function (maximum, result) {
      return maximum < result ? result : maximum;
    });
  }

  function toArrayOperator() {
    return function (emitter) {
      return function (next, done, context) {
        var array = [];
        emitter(function (result) {
          array.push(result);
          return true;
        }, function (result) {
          if (isError(result) || !unsync(next(array), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function meanOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          if (!result.length) return true;
          result.sort();
          return next(result[mathFloor(result.length / 2)]);
        }, done, context);
      };
    };
  }

  function minOperator() {
    return reduceOperator(function (minimum, result) {
      return minimum > result ? result : minimum;
    });
  }

  function replayOperator(interval, timing) {
    var delayer = toFunction(interval);
    return function (emitter) {
      return function (next, done, context) {
        var past = dateNow();
        var chronicles = [],
            chronicler = timing ? function (result) {
          var now = dateNow(),
              chronicle = {
            delay: now - past,
            result: result
          };
          past = now;
          return chronicle;
        } : function (result) {
          return {
            delay: 0,
            result: result
          };
        };
        emitter(function (result) {
          chronicles.push(chronicler(result));
          return next(result);
        }, function (result) {
          if (isError(result)) done(result);else {
            (function () {
              var index = -1;
              !function proceed(proceedResult) {
                if (unsync(proceedResult, proceed, tie(done, proceedResult))) return;
                index = (index + 1) % chronicles.length;
                var chronicle = chronicles[index];
                interval = index ? chronicle.delay : chronicle.delay + toNumber(delayer(), 0);
                (interval ? setTimeout : setImmediate)(function () {
                  if (!unsync(next(chronicle.result), proceed, proceed)) proceed(true);
                }, interval);
              }(true);
            })();
          }
        }, context);
      };
    };
  }

  function retryOperator(attempts) {
    attempts = toNumber(attempts, 1);
    if (!attempts) return identity;
    return function (emitter) {
      return function (next, done, context) {
        var attempt = 0;
        proceed();

        function proceed() {
          emitter(next, retry, context);
        }

        function retry(result) {
          if (++attempt <= attempts && isError(result)) proceed();else done(result);
        }
      };
    };
  }

  function reverseOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          return new Promise(function (resolve) {
            var index = result.length;
            !function proceed() {
              while (--index >= 0 && !unsync(next(result[index]), proceed, resolve)) {}

              resolve(true);
            }();
          });
        }, done, context);
      };
    };
  }

  function shareOperator() {
    return function (emitter) {
      var shares = new WeakMap();
      return function (next, done, context) {
        var share = shares.get(context);
        if (share) {
          if (share.result) done(share.result);else share.retarded.push(impede(next, done));
        } else {
          shares.set(context, share = {
            retarded: [impede(next, done)]
          });
          emitter(function (result) {
            var retarded = share.retarded;

            for (var i = -1, l = retarded.length; ++i < l;) {
              retarded[i][NEXT](result);
            }
          }, function (result) {
            share.result = result;
            var retarded = share.retarded;

            for (var i = -1, l = retarded.length; ++i < l;) {
              retarded[i][DONE](result);
            }
          }, context);
        }
      };
    };
  }

  function skipAllOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(truthy, done, context);
      };
    };
  }

  function skipFirstOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        var index = -1;
        emitter(function (result) {
          return ++index < count || next(result);
        }, done, context);
      };
    };
  }

  function skipLastOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        var buffer = [];
        emitter(function (result) {
          buffer.push(result);
          return true;
        }, function (result) {
          if (isError(result)) done(result);else if (count >= buffer.length) done(result);else arrayAdapter(buffer.slice(0, -count))(next, done, context);
        }, context);
      };
    };
  }

  function skipWhileOperator(predicate) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0,
            skipping = true;
        emitter(function (value) {
          if (skipping && !predicate(value, index++)) skipping = false;
          return skipping || next(value);
        }, done, context);
      };
    };
  }

  function skipOperator(condition) {
    switch (classOf(condition)) {
      case NUMBER:
        return condition > 0 ? skipFirstOperator(condition) : condition < 0 ? skipLastOperator(-condition) : identity;

      case FUNCTION:
        return skipWhileOperator(condition);

      case UNDEFINED:
        return skipAllOperator();

      default:
        return condition ? skipAllOperator() : identity;
    }
  }

  function sliceOperator(begin, end) {
    begin = toNumber(begin, 0);
    end = toNumber(end, maxInteger);
    return begin < 0 || end < 0 ? function (emitter) {
      return function (next, done, context) {
        var buffer = [];
        emitter(function (result) {
          buffer.push(result);
          return true;
        }, function (result) {
          if (isError(result)) done(result);else {
            (function () {
              var index = mathMax(0, begin > 0 ? begin : buffer.length + begin),
                  limit = mathMax(end > 0 ? mathMin(buffer.length, end) : buffer.length + end);
              done = tie(done, result);
              !function proceed() {
                while (index < limit) {
                  if (unsync(next(buffer[index++]), proceed, done)) return;
                }

                done();
              }();
            })();
          }
        }, context);
      };
    } : function (emitter) {
      return function (next, done, context) {
        var index = -1;
        emitter(function (value) {
          return ++index < begin || index < end && next(value);
        }, done, context);
      };
    };
  }

  function someOperator(condition) {
    var predicate = undefined;

    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;

      case REGEXP:
        predicate = function predicate(result) {
          return condition.test(result);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(result) {
          return !!result;
        };

        break;

      default:
        predicate = function predicate(result) {
          return result === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var some = false,
            index = 0;
        emitter(function (result) {
          if (!predicate(result, index++)) return true;
          some = true;
          return false;
        }, function (result) {
          if (isError(result) || !unsync(next(some), done, done)) done(result);
        }, context);
      };
    };
  }

  function sortOperator(parameters) {
    var directions = [],
        selectors = [];
    var direction = 1;

    for (var i = -1, l = parameters.length; ++i < l;) {
      var parameter = parameters[i];

      switch (classOf(parameter)) {
        case FUNCTION:
          selectors.push(parameter);
          directions.push(direction);
          continue;

        case NUMBER:
          parameter = parameter > 0 ? 1 : -1;
          break;

        case STRING:
          parameter = parameter.toLowerCase() === 'desc' ? -1 : 1;
          break;

        default:
          parameter = parameter ? 1 : -1;
          break;
      }

      if (directions.length) directions[directions.length - 1] = parameter;else direction = parameter;
    }

    var comparer = selectors.length ? function (left, right) {
      var result = undefined;

      for (var i = -1, l = selectors.length; ++i < l;) {
        var selector = selectors[i];
        result = compare(selector(left), selector(right), directions[i]);
        if (result) break;
      }

      return result;
    } : function (left, right) {
      return compare(left, right, direction);
    };
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (result) {
          return new Promise(function (resolve) {
            return arrayAdapter(result.sort(comparer))(next, resolve, context);
          });
        }, done, context);
      };
    };
  }

  function sumOperator() {
    return reduceOperator(function (sum, result) {
      return +result + sum;
    }, 0);
  }

  function takeFirstOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (result) {
          if (++index < count) return next(result);
          result = next(result);
          if (isBoolean(result)) return false;
          if (isPromise(result)) return result.then(falsey);
          return result;
        }, done, context);
      };
    };
  }

  function takeLastOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        var buffer = [];
        emitter(function (result) {
          if (buffer.length >= count) buffer.shift();
          buffer.push(result);
          return true;
        }, function (result) {
          if (isError(result)) done(result);else arrayAdapter(buffer)(next, done, context);
        }, context);
      };
    };
  }

  function takeWhileOperator(predicate) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          return predicate(value, index++) && next(value);
        }, done, context);
      };
    };
  }

  function takeOperator(condition) {
    switch (classOf(condition)) {
      case NUMBER:
        return condition > 0 ? takeFirstOperator(condition) : condition < 0 ? takeLastOperator(-condition) : tie(emptyGenerator, false);

      case FUNCTION:
        return takeWhileOperator(condition);

      case UNDEFINED:
        return identity;

      default:
        return condition ? identity : tie(emptyGenerator, false);
    }
  }

  function toMapOperator(keySelector, valueSelector) {
    keySelector = isUndefined(keySelector) ? identity : toFunction(keySelector);
    valueSelector = isUndefined(valueSelector) ? identity : toFunction(valueSelector);
    return function (emitter) {
      return function (next, done, context) {
        var map = new Map();
        var index = 0;
        emitter(function (result) {
          map.set(keySelector(result, index++), valueSelector(result, index++));
          return true;
        }, function (result) {
          if (isError(result) || !unsync(next(map), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function toSetOperator() {
    return function (emitter) {
      return function (next, done, context) {
        var set = new Set();
        emitter(function (result) {
          set.add(result);
          return true;
        }, function (result) {
          if (isError(result) || !unsync(next(set), tie(done, result), done)) done(result);
        }, context);
      };
    };
  }

  function toStringOperator(separator) {
    separator = toFunction(separator, separator || ',');
    return reduceOperator(function (string, result, index) {
      return string.length ? string + separator(result, index) + result : '' + result;
    }, '', true);
  }

  function Flow() {}

  function defineOperator(defintion, operator) {
    defintion[operator.name[0] === '_' ? operator.name.substring(1) : operator.name] = {
      configurable: true,
      value: operator,
      writable: true
    };
    return defintion;
  }

  var operators = objectCreate(Object[PROTOTYPE], [average, _catch, coalesce, count, delay, distinct, every, filter, flatten, group, map, max, mean, min, notify, reduce, replay, retry, reverse, share, skip, slice, some, sort, sum, take, toArray, toMap, toSet, toString].reduce(defineOperator, {}));
  Flow[PROTOTYPE] = objectCreate(operators, (_objectCreate = {}, _defineProperty(_objectCreate, CLASS, {
    value: AEROFLOW
  }), _defineProperty(_objectCreate, 'chain', {
    value: chain
  }), _defineProperty(_objectCreate, 'run', {
    value: run
  }), _objectCreate));

  function instance(emitter) {
    return objectDefineProperty(new Flow(), EMITTER, {
      value: emitter
    });
  }

  function average() {
    return this.chain(averageOperator());
  }

  function _catch(alternative) {
    return this.chain(catchOperator(alternative));
  }

  function chain(operator) {
    return instance(operator(this[EMITTER]), this.sources);
  }

  function coalesce(alternative) {
    return this.chain(coalesceOperator(alternative));
  }

  function count() {
    return this.chain(countOperator());
  }

  function delay(interval) {
    return this.chain(delayOperator(interval));
  }

  function distinct(untilChanged) {
    return this.chain(distinctOperator(untilChanged));
  }

  function every(condition) {
    return this.chain(everyOperator(condition));
  }

  function filter(condition) {
    return this.chain(filterOperator(condition));
  }

  function flatten(depth) {
    return this.chain(flattenOperator(depth));
  }

  function group() {
    for (var _len3 = arguments.length, selectors = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      selectors[_key3] = arguments[_key3];
    }

    return this.chain(groupOperator(selectors));
  }

  function map(mapper) {
    return this.chain(mapOperator(mapper));
  }

  function max() {
    return this.chain(maxOperator());
  }

  function mean() {
    return this.chain(meanOperator());
  }

  function min() {
    return this.chain(minOperator());
  }

  function notify(target) {
    for (var _len4 = arguments.length, parameters = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      parameters[_key4 - 1] = arguments[_key4];
    }

    return this.chain(notifier(target, parameters));
  }

  function reduce(reducer, accumulator) {
    return this.chain(reduceOperator(reducer, accumulator, isDefined(accumulator)));
  }

  function replay(interval, timing) {
    return this.chain(replayOperator(interval, timing));
  }

  function retry(attempts) {
    return this.chain(retryOperator(attempts));
  }

  function reverse() {
    return this.chain(reverseOperator());
  }

  function run(next, done) {
    var _this = this;

    if (!isFunction(next)) done = next = noop;else if (!isFunction(done)) done = noop;
    if (!(CONTEXT in this)) objectDefineProperty(this, CONTEXT, {
      value: {}
    });
    return new Promise(function (resolve, reject) {
      var index = 0,
          last = undefined;

      _this[EMITTER](function (result) {
        last = result;
        return next(result, index++) !== false;
      }, function (result) {
        done(result);
        isError(result) ? reject(result) : resolve(last);
      }, _this.context);
    });
  }

  function share() {
    return this.chain(shareOperator());
  }

  function skip(condition) {
    return this.chain(skipOperator(condition));
  }

  function slice(begin, end) {
    return this.chain(sliceOperator(begin, end));
  }

  function some(condition) {
    return this.chain(someOperator(condition));
  }

  function sort() {
    for (var _len5 = arguments.length, parameters = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      parameters[_key5] = arguments[_key5];
    }

    return this.chain(sortOperator(parameters));
  }

  function sum() {
    return this.chain(sumOperator());
  }

  function take(condition) {
    return this.chain(takeOperator(condition));
  }

  function toArray() {
    return this.chain(toArrayOperator());
  }

  function toMap(keySelector, valueSelector) {
    return this.chain(toMapOperator(keySelector, valueSelector));
  }

  function toSet() {
    return this.chain(toSetOperator());
  }

  function toString(separator) {
    return this.chain(toStringOperator(separator));
  }

  function emit() {
    for (var _len6 = arguments.length, sources = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      sources[_key6] = arguments[_key6];
    }

    return function (next, done, context) {
      var index = -1;
      !function proceed(result) {
        if (result !== true || ++index >= sources.length) done(result);else try {
          var source = sources[index];
          (adapters.get(source) || valueAdapter(source))(next, proceed, context);
        } catch (error) {
          done(error);
        }
      }(true);
    };
  }

  function aeroflow() {
    return instance(emit.apply(undefined, arguments));
  }

  function create(emitter) {
    return instance(customGenerator(emitter));
  }

  function expand(expander, seed) {
    return instance(expandGenerator(expander, seed));
  }

  function just(source) {
    return instance(valueAdapter(source));
  }

  function listen(source) {
    for (var _len7 = arguments.length, parameters = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      parameters[_key7 - 1] = arguments[_key7];
    }

    return instance(listener(source, parameters));
  }

  function random(minimum, maximum) {
    return instance(randomGenerator(minimum, maximum));
  }

  function range(start, end, step) {
    return instance(rangeGenerator(start, end, step));
  }

  function repeat(repeater, delayer) {
    return instance(repeatGenerator(repeater, delayer));
  }

  function defineGenerator(defintion, generator) {
    defintion[generator.name] = {
      value: generator
    };
    return defintion;
  }

  objectDefineProperties(aeroflow, [create, expand, just, listen, random, range, repeat].reduce(defineGenerator, {}));
  objectDefineProperties(aeroflow, {
    adapters: {
      value: adapters
    },
    empty: {
      enumerable: true,
      get: function get() {
        return instance(emptyGenerator(true));
      }
    },
    listeners: {
      value: listeners
    },
    notifiers: {
      value: notifiers
    },
    operators: {
      value: operators
    }
  });
  exports.default = aeroflow;
  module.exports = exports['default'];
});
