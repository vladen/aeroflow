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
    return value !== undefined;
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
    return value === undefined;
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
      get: { value: get },
      use: { value: use }
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
        }done(true);
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
        var iteration = void 0;
        while (!(iteration = iterator.next()).done) {
          if (unsync(next(iteration.value), proceed, done)) return;
        }done(true);
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

  function adapter(sources) {
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

  function resync(next, done) {
    var _ref;

    var busy = false,
        idle = false,
        queue = [],
        signal = true;
    function resend() {
      busy = false;
      while (queue.length) {
        var state = unsync(queue.pop()(), resend, redone);
        switch (state) {
          case false:
            signal = true;
            continue;
          case true:
            signal = false;
            return;
          default:
            busy = true;
            signal = state;
            return;
        }
      }
    }
    function redone(result) {
      if (idle) return false;
      idle = true;
      queue.push(tie(done, result));
      if (!busy) resend();
    }
    function renext(result) {
      if (idle) return false;
      queue.push(tie(next, result));
      if (!busy) resend();
      return signal;
    }
    return _ref = {}, _defineProperty(_ref, DONE, redone), _defineProperty(_ref, NEXT, renext), _ref;
  }

  function emptyGenerator(result) {
    return function (next, done) {
      return done(result);
    };
  }

  function customGenerator(generator) {
    if (isUndefined(generator)) return emptyGenerator(true);
    if (!isFunction(generator)) return valueAdapter(generator);
    return function (next, done, context) {
      var _resync = resync(next, done, context);

      var redone = _resync[DONE];
      var renext = _resync[NEXT];var end = toFunction(generator(renext, function (result) {
        redone(isUndefined(result) ? true : result);
        end();
      }));
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
        }done(true);
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
      var _resync2 = resync(next, done);

      var redone = _resync2[DONE];
      var renext = _resync2[NEXT];var end = toFunction(instance(function (result) {
        if (false !== renext(result)) return;
        redone(false);
        end();
      }, function (result) {
        redone(false);
        end();
      }));
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
        return target.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
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

  function concatOperator(sources) {
    return sources.length ? function (emitter) {
      return function (next, done, context) {
        emitter(next, function (result) {
          if (result === true) adapter(sources)(next, done, context);
        }, context);
      };
    } : identity;
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
            }, toDelay(delayer(result, index++), 0));
          });
        }, done, context);
      };
    };
  }

  function distinctOperator(untilChanged) {
    return function (emitter) {
      return untilChanged ? function (next, done, context) {
        var idle = true,
            last = void 0;
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
    var predicate = void 0;
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
    var predicate = void 0;
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
              descendant = void 0;
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
              chronicle = { delay: now - past, result: result };
          past = now;
          return chronicle;
        } : function (result) {
          return { delay: 0, result: result };
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

  function scanOperator(scanner) {
    scanner = toFunction(scanner);
    return function (emitter) {
      return function (next, done, context) {
        var accumulator = void 0,
            index = -1;
        emitter(function (result) {
          return ++index ? next(accumulator = scanner(accumulator, result, index)) : next(accumulator = result);
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
          if (share.result) done(share.result);else share.callbacks.push(resync(next, done));
        } else {
          shares.set(context, share = { callbacks: [resync(next, done)] });
          emitter(function (result) {
            var callbacks = share.callbacks;
            for (var i = -1, l = callbacks.length; ++i < l;) {
              callbacks[i][NEXT](result);
            }
          }, function (result) {
            share.result = result;
            var callbacks = share.callbacks;
            for (var i = -1, l = callbacks.length; ++i < l;) {
              callbacks[i][DONE](result);
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
                }done();
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
    var predicate = void 0;
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
      var result = void 0;
      for (var _i = -1, _l = selectors.length; ++_i < _l;) {
        var selector = selectors[_i];
        result = compare(selector(left), selector(right), directions[_i]);
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

  /**
  @class
  
  @property {function} emitter
  @property {array} sources
  */
  function Flow() {}

  function defineOperator(defintion, operator) {
    defintion[operator.name[0] === '_' ? operator.name.substring(1) : operator.name] = { configurable: true, value: operator, writable: true };
    return defintion;
  }

  var operators = objectCreate(Object[PROTOTYPE], [average, _catch, coalesce, concat, count, delay, distinct, every, filter, flatten, group, map, max, mean, min, notify, reduce, replay, retry, reverse, scan, share, skip, slice, some, sort, sum, take, toArray, toMap, toSet, toString].reduce(defineOperator, {}));

  Flow[PROTOTYPE] = objectCreate(operators, (_objectCreate = {}, _defineProperty(_objectCreate, CLASS, { value: AEROFLOW }), _defineProperty(_objectCreate, 'chain', { value: chain }), _defineProperty(_objectCreate, 'run', { value: run }), _objectCreate));

  function instance(emitter) {
    return objectDefineProperty(new Flow(), EMITTER, { value: emitter });
  }

  /**
  @alias Flow#average
  
  @return {Flow}
  
  @example
  aeroflow().average().notify(console).run();
  // done true
  aeroflow('test').average().notify(console).run();
  // next NaN
  // done true
  aeroflow(1, 2, 6).average().notify(console).run();
  // next 3
  // done true
  */
  function average() {
    return this.chain(averageOperator());
  }

  /**
  Returns new flow suppressing error, emitted by this flow, or replacing it with alternative data source.
  
  @alias Flow#catch
  
  @param {function|any} [alternative]
  Optional alternative data source to replace error, emitted by this flow.
  If not passed, the emitted error is supressed.
  If a function passed, it is called with two arguments:
  1) the error, emitted by this flow,
  2) context data (see {@link Flow#run} method documentation for additional information about context data).
  The result, returned by this function, as well as any other value passed as alternative,
  is adapted with suitable adapter from {@link aeroflow.adapters} registry and emitted to this flow.
  
  @return {Flow}
  
  @example
  aeroflow(new Error('test')).catch().notify(console).run();
  // done false
  aeroflow(new Error('test')).dump('before ').catch('success').dump('after ').run();
  // before done Error: test(…)
  // after next success
  // after done false
  aeroflow(new Error('test')).catch([1, 2]).notify(console).run();
  // next 1
  // next 2
  // done false
  aeroflow(new Error('test')).catch(() => [1, 2]).notify(console).run();
  // next 1
  // next 2
  // done false
  aeroflow(new Error('test')).catch(() => [[1], [2]]).notify(console).run();
  // next [1]
  // next [2]
  // done false
  */
  function _catch(alternative) {
    return this.chain(catchOperator(alternative));
  }

  /**
  @alias Flow#chain
  
  @param {function} [operator]
  
  @return {Flow}
  */
  function chain(operator) {
    return instance(operator(this[EMITTER]), this.sources);
  }

  /**
  Returns new flow emitting values from alternate data source when this flow is empty.
  
  @alias Flow#coalesce
  
  @param {any} [alternative]
  Optional alternative data source to use when this flow is empty.
  If not passed, this method does nothing.
  If a function passed, it is called with one argument:
  1) the context data (see {@link Flow#run} method documentation for additional information about context data).
  The result, returned by this function, as well as any other value passed as alternative,
  is adapted with suitable adapter from {@link aeroflow.adapters} registry and emitted to this flow.
  
  @return {Flow}
  
  @example
  aeroflow.empty.coalesce().notify(console).run();
  // done true
  aeroflow.empty.coalesce([1, 2]).notify(console).run();
  // next 1
  // next 2
  // done true
  aeroflow.empty.coalesce(() => [1, 2]).notify(console).run();
  // next 1
  // next 2
  // done true
  aeroflow.empty.coalesce(() => [[1], [2]]).notify(console).run();
  // next [1]
  // next [2]
  // done true
  */
  function coalesce(alternative) {
    return this.chain(coalesceOperator(alternative));
  }

  /*
  Concatenates all provided data source to the end of this flow.
  
  @alias Flow#concat
  
  @param {any} [sources]
  Data sources to append to this flow.
  
  @return {Flow}
  New flow emitting all values emitted by this flow first
  and then all provided values.
  
  @example
  aeroflow(1).concat(
    2,
    [3, 4],
    () => 5,
    Promise.resolve(6),
    new Promise(resolve => setTimeout(() => resolve(7), 500))
  ).notify(console).run();
  // next 1
  // next 2
  // next 3
  // next 4
  // next 5
  // next 6
  // next 7 // after 500ms
  // done
  */
  function concat() {
    for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      sources[_key3] = arguments[_key3];
    }

    return this.chain(concatOperator(sources));
  }

  /**
  Counts the number of values emitted by this flow and emits only count value.
  
  @alias Flow#count
  
  @return {Flow}
  
  @example
  aeroflow().count().notify(console).run();
  // next 0
  // done
  aeroflow('a', 'b', 'c').count().notify(console).run();
  // next 3
  // done
  */
  function count() {
    return this.chain(countOperator());
  }

  /**
  Delays emission of each value by specified amount of time.
  
  @alias Flow#delay
  
  @param {function|number|date} [delayer]
  Function, defining dynamic delay, called for each emitted value with three arguments:
    1) Value being emitted;
    2) Index of iteration.
  The result returned by delayer function is converted to number and used as delay in milliseconds.
  Or static numeric delay in milliseconds.
  Or date to delay until.
  
  @return {Flow}
  
  @example:
  aeroflow(1, 2).delay(500).notify(console).run();
  // next 1 // after 500ms
  // next 2 // after 500ms
  // done true // after 500ms
  aeroflow(1, 2).delay(new Date(Date.now() + 500)).notify(console).run();
  // next 1 // after 500ms
  // next 2
  // done true
  aeroflow(1, 2).delay((value, index) => 500 + 500 * index).notify(console).run();
  // next 1 // after 500ms
  // next 2 // after 1000ms
  // done true
  aeroflow(1, 2).delay(value => { throw new Error }).notify(console).run();
  // done Error(…)
  // Uncaught (in promise) Error: test(…)
  */
  function delay(delayer) {
    return this.chain(delayOperator(delayer));
  }

  /**
  @alias Flow#distinct
  
  @param {boolean} untilChanged
  
  @return {Flow}
  
  @example
  aeroflow(1, 1, 2, 2, 1, 1).distinct().notify(console).run();
  // next 1
  // next 2
  // done true
  aeroflow(1, 1, 2, 2, 1, 1).distinct(true).notify(console).run();
  // next 1
  // next 2
  // next 1
  // done true
  */
  // TODO: distinct by selector
  function distinct(untilChanged) {
    return this.chain(distinctOperator(untilChanged));
  }

  /**
  Tests whether all values emitted by this flow pass the provided test.
  
  @alias Flow#every
  
  @param {function|regexp|any} [predicate]
  The predicate function or regular expression to test each emitted value with,
  or scalar value to compare emitted values with.
  If omitted, default (truthy) predicate is used.
  
  @return {Flow}
  New flow emitting true if all emitted values pass the test; otherwise, false.
  
  @example
  aeroflow().every().notify(console).run();
  // next true
  // done true
  aeroflow('a', 'b').every('a').notify(console).run();
  // next false
  // done false
  aeroflow(1, 2).every(value => value > 0).notify(console).run();
  // next true
  // done true
  aeroflow(1, 2).every(value => { throw new Error }).notify(console).run();
  // done Error(…)
  // Uncaught (in promise) Error: test(…)
  */
  function every(condition) {
    return this.chain(everyOperator(condition));
  }

  /**
  Filters values emitted by this flow with the provided test.
  
  @alias Flow#filter
  
  @param {function|regexp|any} [predicate]
  The predicate function or regular expression to test each emitted value with,
  or scalar value to compare emitted values with.
  If omitted, default (truthy) predicate is used.
  
  @return {Flow}
  New flow emitting only values passing the provided test.
  
  @example
  aeroflow().filter().notify(console).run();
  // done true
  aeroflow(0, 1).filter().notify(console).run();
  // next 1
  // done true
  aeroflow('a', 'b', 'a').filter('a').notify(console).run();
  // next "a"
  // next "a"
  // done true
  aeroflow('a', 'b', 'a').filter(/a/).notify(console).run();
  // next "b"
  // next "b"
  // done true
  aeroflow(1, 2, 3, 4, 5).filter(value => (value % 2) === 0).notify(console).run();
  // next 2
  // next 4
  // done true
  aeroflow(1, 2).filter(value => { throw new Error }).notify(console).run();
  // done Error: (…)
  // Uncaught (in promise) Error: test(…)
  */
  function filter(condition) {
    return this.chain(filterOperator(condition));
  }

  /**
  @alias Flow#flatten
  
  @param {number} [depth]
  
  @return {Flow}
  
  @example
  aeroflow([[1, 2]]).flatten().notify(console).run();
  // next 1
  // next 2
  // done true
  aeroflow(() => [[1], [2]]).flatten(1).notify(console).run();
  // next [1]
  // next [2]
  // done true
  aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
    .flatten().notify(console).run();
  // next 1 // after 500ms
  // next 2
  // done true
  aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
    .flatten(1).notify(console).run();
  // next [1, 2] // after 500ms
  // done true
  */
  function flatten(depth) {
    return this.chain(flattenOperator(depth));
  }

  /**
  @alias Flow#group
  
  @param {function|any[]} [selectors]
  
  @return {Flow}
  
  @example
  aeroflow.range(1, 10).group(value => (value % 2) ? 'odd' : 'even').notify(console).run();
  // next ["odd", Array[5]]
  // next ["even", Array[5]]
  // done true
  aeroflow(
    { country: 'Belarus', city: 'Brest' },
    { country: 'Poland', city: 'Krakow' },
    { country: 'Belarus', city: 'Minsk' },
    { country: 'Belarus', city: 'Grodno' },
    { country: 'Poland', city: 'Lodz' }
  ).group(value => value.country, value => value.city).notify(console).run();
  // next ["Belarus", {{"Brest" => Array[1]}, {"Minsk" => Array[1]}, {"Grodno" => Array[1]}}]
  // next ["Poland", {{"Krakow" => Array[1]}, {"Lodz" => Array[1]}}]
  // done
  */
  function group() {
    for (var _len4 = arguments.length, selectors = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      selectors[_key4] = arguments[_key4];
    }

    return this.chain(groupOperator(selectors));
  }

  /*
  @alias Flow#join
  
  @param {any} right
  @param {function} comparer
  
  @return {Flow}
  
  @example
  aeroflow().join().notify(console).run();
  // done true
  aeroflow(1, 2).join().notify(console).run();
  // next [1, undefined]
  // next [2, undefined]
  aeroflow(1, 2).join(0).notify(console).run();
  // next [1, 0]
  // next [2, 0]
  // done true
  aeroflow('a','b').join(1, 2).notify(console).run();
  // next ["a", 1]
  // next ["a", 2]
  // next ["b", 1]
  // next ["b", 2]
  aeroflow([
    { country: 'USA', capital: 'Washington' },
    { country: 'Russia', capital: 'Moskow' }
  ]).join([
    { country: 'USA', currency: 'US Dollar' },
    { country: 'Russia', currency: 'Russian Ruble' }
  ], (left, right) => left.country === right.country)
  .map(result => (
    { country: result[0].country, capital: result[0].capital, currency: result[1].currency }
  ))
  .notify(console).run();
  // next Object {country: "USA", capital: "Washington", currency: "US Dollar"}
  // next Object {country: "Russia", capital: "Moskow", currency: "Russian Ruble"}
  // done true
  
  function join(right, comparer) {
    return this.chain(joinOperator(right, comparer));
  }
  */

  /**
  @alias Flow#map
  
  @param {function|any} [mapper]
  
  @return {Flow}
  
  @example
  aeroflow().map().notify(console).run();
  // done true
  aeroflow(1, 2).map().notify(console).run();
  // next 1
  // next 2
  // done true
  aeroflow(1, 2).map('test').notify(console).run();
  // next test
  // next test
  // done true
  aeroflow(1, 2).map(value => value * 10).notify(console).run();
  // next 10
  // next 20
  // done true
  */
  function map(mapper) {
    return this.chain(mapOperator(mapper));
  }

  /**
  Determines the maximum value emitted by this flow.
  
  @alias Flow#max
  
  @return {Flow}
  New flow emitting the maximum value only.
  
  @example
  aeroflow().max().notify(console).run();
  // done true
  aeroflow(1, 3, 2).max().notify(console).run();
  // next 3
  // done true
  aeroflow('b', 'a', 'c').max().notify(console).run();
  // next c
  // done true
  */
  function max() {
    return this.chain(maxOperator());
  }

  /**
  Determines the mean value emitted by this flow.
  
  @alias Flow#mean
  
  @return {Flow}
  New flow emitting the mean value only.
  
  @example
  aeroflow().mean().notify(console).run();
  // done true
  aeroflow(3, 1, 2).mean().notify(console).run();
  // next 2
  // done true
  aeroflow('a', 'd', 'f', 'm').mean().notify(console).run();
  // next f
  // done true
  */
  function mean() {
    return this.chain(meanOperator());
  }

  /**
  Determines the minimum value emitted by this flow.
  
  @alias Flow#min
  
  @return {Flow}
  New flow emitting the minimum value only.
  
  @example
  aeroflow().min().notify(console).run();
  // done true
  aeroflow(3, 1, 2).min().notify(console).run();
  // next 1
  // done true
  aeroflow('b', 'a', 'c').min().notify(console).run();
  // next a
  // done true
  */
  function min() {
    return this.chain(minOperator());
  }

  function notify(target) {
    for (var _len5 = arguments.length, parameters = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      parameters[_key5 - 1] = arguments[_key5];
    }

    return this.chain(notifier(target, parameters));
  }

  /**
  Applies a function against an accumulator and each value emitted by this flow
  to reduce it to a single value, returns new flow emitting the reduced value.
  
  @alias Flow#reduce
  
  @param {function|any} [reducer]
  Function to execute on each emitted value, taking four arguments:
    result - the value previously returned in the last invocation of the reducer, or seed, if supplied;
    value - the current value emitted by this flow;
    index - the index of the current value emitted by the flow;
    data - the data bound to current execution context.
    If is not a function, the returned flow will emit just the reducer value.
  @param {any|boolean} [accumulator]
  Value to use as the first argument to the first call of the reducer.
  When boolean value is passed and no value defined for the 'required' argument,
  the 'seed' argument is considered to be omitted.
  @param {boolean} [required=false]
  True to emit reduced result always, even if this flow is empty.
  False to emit only 'done' event for empty flow.
  
  @return {Flow}
  New flow emitting reduced result only or no result at all if this flow is empty
  and the 'required' argument is false.
  
  @example
  aeroflow().reduce().notify(console).run();
  // done false
  aeroflow(1, 2).reduce().notify(console).run();
  // done false
  aeroflow().reduce('test').notify(console).run();
  // next test
  // done true
  aeroflow().reduce((product, value) => product * value).notify(console).run();
  // next undefined
  // done true
  aeroflow().reduce((product, value) => product * value, 1, true).notify(console).run();
  // next 1
  // done true
  aeroflow(2, 4, 8).reduce((product, value) => product * value).notify(console).run();
  // next 64
  // done
  aeroflow(2, 4, 8).reduce((product, value) => product * value, 2).notify(console).run();
  // next 128
  // done
  aeroflow(['a', 'b', 'c'])
    .reduce((product, value, index) => product + value + index, '')
    .notify(console).run();
  // next a0b1c2
  // done
  */
  function reduce(reducer, accumulator) {
    return this.chain(reduceOperator(reducer, accumulator, isDefined(accumulator)));
  }

  /**
  @alias Flow#replay
  
  @param {number|function} delay
  @param {boolean} timing
  
  @return {Flow}
  
  @example
  aeroflow(1, 2).replay(1000).take(4).notify(console).run();
  // next 1
  // next 2
  // next 1 // after 1000ms
  // next 2
  // done false
  aeroflow(1, 2).delay(500).replay(1000).take(4).notify(console).run();
  // next 1
  // next 2 // after 500ms
  // next 1 // after 1000ms
  // next 2
  // done false
  aeroflow(1, 2).delay(500).replay(1000, true).take(4).notify(console).run();
  // next 1
  // next 2 // after 500ms
  // next 1 // after 1000ms
  // next 2 // after 500ms
  // done false
  */
  function replay(interval, timing) {
    return this.chain(replayOperator(interval, timing));
  }

  /**
  @alias Flow#retry
  
  @param {number} attempts
  
  @return {Flow}
  
  @example
  var attempt = 0; aeroflow(() => {
    if (attempt++ % 2) return 'success';
    else throw new Error('error');
  }).dump('before ').retry().dump('after ').run();
  // before done Error: error(…)
  // before next success
  // after next success
  // before done true
  // after done true
  */
  function retry(attempts) {
    return this.chain(retryOperator(attempts));
  }

  /**
  @alias Flow#reverse
  
  @return {Flow}
  
  @example
  aeroflow().reverse().notify(console).run();
  // done true
  aeroflow(1, 2, 3).reverse().notify(console).run();
  // next 3
  // next 2
  // next 1
  // done true
  */
  function reverse() {
    return this.chain(reverseOperator());
  }

  /**
  Runs this flow.
  
  @alias Flow#run
  
  @param {function|any} [next]
  Optional callback called for each data value emitted by this flow with 3 arguments:
  1) the emitted value,
  2) zero-based index of emitted value,
  3) context data.
  When passed something other than function, it considered as context data.
  @param {function|any} [done]
  Optional callback called after this flow has finished emission of data with 2 arguments:
  1) the error thrown within this flow
  or boolean value indicating lazy (false) or eager (true) enumeration of data sources,
  2) context data.
  When passed something other than function, it considered as context data.
  
  @return {Promise}
  New promise,
  resolving to the latest value emitted by this flow (for compatibility with ES7 await operator),
  or rejecting to the error thrown within this flow.
  
  @example
  aeroflow('test').notify(console).run();
  // next test
  // done true
  (async function() {
    var result = await aeroflow('test').notify(console).run();
    console.log(result);
  })();
  // test
  aeroflow(Promise.reject('test')).run();
  // Uncaught (in promise) Error: test(…)
  */
  function run(next, done) {
    var _this = this;

    if (!isFunction(next)) done = next = noop;else if (!isFunction(done)) done = noop;
    if (!(CONTEXT in this)) objectDefineProperty(this, CONTEXT, { value: {} });
    return new Promise(function (resolve, reject) {
      var index = 0,
          last = void 0;
      _this[EMITTER](function (result) {
        last = result;
        return next(result, index++) !== false;
      }, function (result) {
        done(result);
        isError(result) ? reject(result) : resolve(last);
      }, _this.context);
    });
  }

  /**
  Emits first value emitted by this flow,
  and then values returned by scanner applied to each successive emitted value.
  
  @alias Flow#scan
  
  @param {function|any} [scanner]
  Function to apply to each emitted value, called with three arguments:
  1) First value emitted by this flow or value returned by previous call to scanner;
  2) Current value emitted by this flow;
  3) Index of iteration.
  
  @example
  aeroflow.range(1, 3).scan((prev, next) => prev + next).notify(console).run();
  
  */
  function scan(scanner) {
    return this.chain(scanOperator(scanner));
  }

  function share() {
    return this.chain(shareOperator());
  }

  /**
  Skips some of the values emitted by this flow,
  returns flow emitting remaining values.
  
  @alias Flow#skip
  
  @param {number|function|any} [condition] 
  The number or predicate function used to determine how many values to skip.
    If omitted, returned flow skips all values emitting done event only.
    If zero, returned flow skips nothing.
    If positive number, returned flow skips this number of first emitted values.
    If negative number, returned flow skips this number of last emitted values.
    If function, returned flow skips emitted values while this function returns trythy value.
  
  @return {Flow}
  New flow emitting remaining values.
  
  @example
  aeroflow(1, 2, 3).skip().notify(console).run();
  // done true
  aeroflow(1, 2, 3).skip(1).notify(console).run();
  // next 2
  // next 3
  // done true
  aeroflow(1, 2, 3).skip(-1).notify(console).run();
  // next 1
  // next 2
  // done true
  aeroflow(1, 2, 3).skip(value => value < 3).notify(console).run();
  // next 3
  // done true
    */
  function skip(condition) {
    return this.chain(skipOperator(condition));
  }

  /**
  @alias Flow#slice
  
  @param {number} [begin]
  @param {number} [end]
  
  @return {Flow}
  
  @example
  aeroflow(1, 2, 3).slice().notify(console).run();
  // next 1
  // next 2
  // next 3
  // done true
  aeroflow(1, 2, 3).slice(1).notify(console).run();
  // next 2
  // next 3
  // done true
  aeroflow(1, 2, 3).slice(1, 2).notify(console).run();
  // next 2
  // done false
  aeroflow(1, 2, 3).slice(-2).notify(console).run();
  // next 2
  // next 3
  // done true
  aeroflow(1, 2, 3).slice(-3, -1).notify(console).run();
  // next 1
  // next 2
  // done true
  */
  function slice(begin, end) {
    return this.chain(sliceOperator(begin, end));
  }

  /**
  Tests whether some value emitted by this flow passes the predicate test,
  returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.
  
  @alias Flow#some
  
  @param {function|regexp|any} [predicate]
  The predicate function or regular expression object used to test each emitted value.
  Or scalar value to compare emitted values with.
  If omitted, truthy predicate is used.
  
  @return {Flow}
  New flow that emits true or false.
  
  @example
  aeroflow().some().notify(console).run();
  // next false
  // done true
  aeroflow(1, 2, 3).some(2).notify(console).run();
  // next true
  // done false
  aeroflow(1, 2, 3).some(value => value % 2).notify(console).run();
  // next true
  // done false
  aeroflow(1, 2, 3).some(value => { throw new Error }).notify(console).run();
  // done Error(…)
  // Uncaught (in promise) Error: test(…)
  */
  function some(condition) {
    return this.chain(someOperator(condition));
  }

  /**
  @alias Flow#sort
  
  @param {function|boolean|'desc'[]} [parameters]
  
  @return {Flow}
  
  @return {Flow}
  
  @example
  aeroflow(3, 1, 2).sort().notify(console).run();
  // next 1
  // next 2
  // next 3
  // done true
  aeroflow(2, 1, 3).sort('desc').notify(console).run();
  // next 3
  // next 2
  // next 1
  // done true
  aeroflow(
    { country: 'Belarus', city: 'Brest' },
    { country: 'Poland', city: 'Krakow' },
    { country: 'Belarus', city: 'Minsk' },
    { country: 'Belarus', city: 'Grodno' },
    { country: 'Poland', city: 'Lodz' }
  ).sort(value => value.country, value => value.city, 'desc').notify(console).run();
  // next Object {country: "Belarus", city: "Minsk"}
  // next Object {country: "Belarus", city: "Grodno"}
  // next Object {country: "Belarus", city: "Brest"}
  // next Object {country: "Poland", city: "Lodz"}
  // next Object {country: "Poland", city: "Krakow"}
  // done true
  */
  function sort() {
    for (var _len6 = arguments.length, parameters = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      parameters[_key6] = arguments[_key6];
    }

    return this.chain(sortOperator(parameters));
  }

  /**
  @alias Flow#sum
  
  @param {boolean} [required=false]
  
  @return {Flow}
  
  @example
  aeroflow().sum().notify(console).run();
  // done true
  aeroflow('test').sum().notify(console).run();
  // next NaN
  // done true
  aeroflow(1, 2, 3).sum().notify(console).run();
  // next 6
  // done true
  */
  function sum() {
    return this.chain(sumOperator());
  }

  /**
  @alias Flow#take
  
  @param {function|number} [condition]
  
  @return {Flow}
  
  @example
  aeroflow(1, 2, 3).take().notify(console).run();
  // done false
  aeroflow(1, 2, 3).take(1).notify(console).run();
  // next 1
  // done false
  aeroflow(1, 2, 3).take(-1).notify(console).run();
  // next 3
  // done true
  */
  function take(condition) {
    return this.chain(takeOperator(condition));
  }

  /**
  Collects all values emitted by this flow to array, returns flow emitting this array.
  
  @alias Flow#toArray
  
  @return {Flow}
  New flow emitting array containing all results emitted by this flow.
  
  @example
  aeroflow().toArray().notify(console).run();
  // next []
  // done true
  aeroflow('test').toArray().notify(console).run();
  // next ["test"]
  // done true
  aeroflow(1, 2, 3).toArray().notify(console).run();
  // next [1, 2, 3]
  // done true
  */
  function toArray() {
    return this.chain(toArrayOperator());
  }

  /**
  Collects all values emitted by this flow to ES6 map, returns flow emitting this map.
  
  @alias Flow#toMap
  
  @param {function|any} [keySelector]
  The mapping function used to transform each emitted value to map key.
  Or scalar value to use as map key.
  @param {function|any} [valueSelector]
  The mapping function used to transform each emitted value to map value,
  Or scalar value to use as map value.
  
  @return {Flow}
  New flow emitting map containing all results emitted by this flow.
  
  @example
  aeroflow().toMap().notify(console).run();
  // next Map {}
  // done true
  aeroflow('test').toMap().notify(console).run();
  // next Map {"test" => "test"}
  done true
  aeroflow(1, 2, 3).toMap(v => 'key' + v, true).notify(console).run();
  // next Map {"key1" => true, "key2" => true, "key3" => true}
  // done true
  aeroflow(1, 2, 3).toMap(v => 'key' + v, v => 10 * v).notify(console).run();
  // next Map {"key1" => 10, "key2" => 20, "key3" => 30}
  // done true
  */
  function toMap(keySelector, valueSelector) {
    return this.chain(toMapOperator(keySelector, valueSelector));
  }

  /**
  Collects all values emitted by this flow to ES6 set, returns flow emitting this set.
  
  @alias Flow#toSet
  
  @return {Flow}
  New flow emitting set containing all results emitted by this flow.
  
  @example
  aeroflow().toSet().notify(console).run();
  // next Set {}
  // done true
  aeroflow(1, 2, 3).toSet().notify(console).run();
  // next Set {1, 2, 3}
  // done true
  */
  function toSet() {
    return this.chain(toSetOperator());
  }

  /**
  Returns new flow joining all values emitted by this flow into a string
  and emitting this string.
  
  @alias Flow#toString
  
  @param {string|function|boolean} [separator]
  Optional. Specifies a string to separate each value emitted by this flow.
  The separator is converted to a string if necessary.
  If omitted, the array elements are separated with a comma.
  If separator is an empty string, all values are joined without any characters in between them.
  If separator is a boolean value, it is used instead a second parameter of this method.
  
  @return {Flow}
  New flow emitting string representation of this flow.
  
  @example
  aeroflow().toString().notify(console).run();
  // next
  // done true
  aeroflow('test').toString().notify(console).run();
  // next test
  // done true
  aeroflow(1, 2, 3).toString().notify(console).run();
  // next 1,2,3
  // done true
  aeroflow(1, 2, 3).toString(';').notify(console).run();
  // next 1;2;3
  // done true
  aeroflow(1, 2, 3).toString((value, index) => '-'.repeat(index + 1)).notify(console).run();
  // next 1--2---3
  // done true
  */
  /*eslint no-shadow: 0*/
  function toString(separator) {
    return this.chain(toStringOperator(separator));
  }

  var empty = instance(emptyGenerator(true));

  /**
  Creates new instance emitting values extracted from every provided data source in series.
  If no data sources provided, creates empty instance emitting "done" event only.
  
  @alias aeroflow
  
  @param {any} [sources]
  Data sources to extract values from.
  
  @return {Flow}
  
  @property {Adapters} adapters
  Mixed array/map of adapters for various types of data sources.
  As a map matches the type of a data source to adapter function (e.g. Promise -> promiseAdapter).
  As an array contains functions performing arbitrary (more complex than type matching) testing
  of a data source (e.g. some iterable -> iterableAdapter).
  When aeroflow adapts particular data source, direct type mapping is attempted first.
  Then, if mapping attempt did not return an adapter function,
  array is enumerated in reverse order, from last indexed adapter to first,
  until a function is returned.
  This returned function is used as adapter and called with single argument: the data source being adapted.
  Expected that adapter function being called with data source returns an emitter function accepting 2 arguments:
  next callback, done callback and execution context.
  If no adapter function has been found, the data source is treated as scalar value and emitted as is.
  See examples to find out how to create and register custom adapters.
  
  @property {object} operators
  Map of operators available for use with every instance.
  See examples to find out how to create and register custom operators.
  
  @example
  aeroflow().notify(console).run();
  // done true
  aeroflow(
    1,
    [2, 3],
    new Set([4, 5]),
    () => 6,
    Promise.resolve(7),
    new Promise(resolve => setTimeout(() => resolve(8), 500))
  ).notify(console).run();
  // next 1
  // next 2
  // next 3
  // next 4
  // next 5
  // next 6
  // next 7
  // next 8 // after 500ms
  // done true
  aeroflow(new Error('test')).notify(console).run();
  // done Error: test(…)
  // Uncaught (in promise) Error: test(…)
  aeroflow(() => { throw new Error }).notify(console).run();
  // done Error: test(…)
  // Uncaught (in promise) Error: test(…)
  aeroflow("test").notify(console).run();
  // next test
  // done true
  aeroflow.adapters.use('String', aeroflow.adapters['Array']);
  aeroflow("test").notify(console).run();
  // next t
  // next e
  // next s
  // next t
  // done true
  aeroflow.operators.test = function() {
    return this.chain(emitter => (next, done, context) => emitter(
      value => next('test:' + value),
      done,
      context));
  }
  aeroflow(42).test().notify(console).run();
  // next test:42
  // done true
  */
  function aeroflow() {
    for (var _len7 = arguments.length, sources = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      sources[_key7] = arguments[_key7];
    }

    return sources.length ? instance(adapter(sources)) : empty;
  }

  /**
  Creates programmatically controlled instance.
  
  @memberof aeroflow
  @static
  
  @param {function|any} emitter
  The emitter function taking three arguments:
  next - the function emitting 'next' event,
  done - the function emitting 'done' event,
  context - the execution context.
  
  @return {Flow}
  The new instance emitting values generated by emitter function.
  
  @example
  aeroflow.create((next, done, context) => {
    next('test');
    done();
  }).notify(console).run();
  // next test
  // done true
  aeroflow.create((next, done, context) => {
    window.addEventListener('click', next);
    return () => window.removeEventListener('click', next);
  }).take(2).notify(console).run();
  // next MouseEvent {...}
  // next MouseEvent {...}
  // done false
  */
  function create(emitter) {
    return instance(customGenerator(emitter));
  }

  /**
  @alias aeroflow.expand
  
  @param {function} expander
  @param {any} [seed]
  
  @return {Flow}
  
  @example
  aeroflow.expand(value => value * 2, 1).take(3).notify(console).run();
  // next 2
  // next 4
  // next 8
  // done false
  */
  function expand(expander, seed) {
    return instance(expandGenerator(expander, seed));
  }

  /**
  Returns new instance emitting the provided source as is.
  
  @alias aeroflow.just
  
  @param {any} source
  The source to emit as is.
  
  @return {Flow}
  The new instance emitting provided value.
  
  @example
  aeroflow.just([1, 2, 3]).notify(console).run();
  // next [1, 2, 3]
  // done
  */
  // TODO: multiple arguments
  function just(source) {
    return instance(valueAdapter(source));
  }

  /**
  @alias aeroflow.listen
  
  @example
  aeroflow
    .listen(document, 'mousemove')
    .map(event => ({ x: event.x, y: event.y }))
    .take(3)
    .notify(console)
    .run();
  // next Object {x: 241, y: 269}
  // next Object {x: 221, y: 272}
  // next Object {x: 200, y: 273}
  // done false
  */
  function listen(source) {
    for (var _len8 = arguments.length, parameters = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
      parameters[_key8 - 1] = arguments[_key8];
    }

    return instance(listener(source, parameters));
  }

  /**
  Creates new instance emitting infinite sequence of random numbers.
  
  @alias aeroflow.random
  
  @param {number} [minimum]
  @param {number} [maximum]
  
  @return {Flow}
  The new instance emitting random numbers.
  
  @example
  aeroflow.random().take(2).notify(console).run();
  // next 0.07417976693250232
  // next 0.5904422281309957
  // done false
  aeroflow.random(1, 9).take(2).notify(console).run();
  // next 7
  // next 2
  // done false
  aeroflow.random(1.1, 8.9).take(2).notify(console).run();
  // next 4.398837305698544
  // next 2.287970747705549
  // done false
  */
  function random(minimum, maximum) {
    return instance(randomGenerator(minimum, maximum));
  }

  /**
  @alias aeroflow.range
  
  @param {number} [start]
  @param {number} [end]
  @param {number} [step]
  
  @return {Flow}
  
  @example
  aeroflow.range().take(3).notify(console).run();
  // next 0
  // next 1
  // next 2
  // done false
  aeroflow.range(-3).take(3).notify(console).run();
  // next -3
  // next -2
  // next -1
  // done false
  aeroflow.range(1, 1).notify(console).run();
  // next 1
  // done true
  aeroflow.range(0, 5, 2).notify(console).run();
  // next 0
  // next 2
  // next 4
  // done true
  aeroflow.range(5, 0, -2).notify(console).run();
  // next 5
  // next 3
  // next 1
  // done true
  */
  function range(start, end, step) {
    return instance(rangeGenerator(start, end, step));
  }

  /**
  Creates infinite flow, repeating static/dynamic value immediately or with static/dynamic delay.
  
  @alias aeroflow.repeat
  
  @param {function|any} [repeater]
  Optional static value to repeat;
  or function providing dynamic value and called with one argument:
  1) index of current iteration.
  @param {function|number} [delayer]
  Optional static delay between iterations in milliseconds;
  or function providing dynamic delay and called with one argument:
  1) index of current iteration.
  
  @return {Flow}
  New flow emitting repeated values.
  
  @example
  aeroflow.repeat(Math.random()).take(2).notify(console).run();
  // next 0.7492001398932189
  // next 0.7492001398932189
  // done false
  aeroflow.repeat(() => Math.random()).take(2).notify(console).run();
  // next 0.46067174314521253
  // next 0.7977648684754968
  // done false
  aeroflow.repeat(index => Math.pow(2, index)).take(3).notify(console).run();
  // next 1
  // next 2
  // next 4
  // done false
  aeroflow.repeat('ping', 500).take(3).notify(console).run();
  // next ping // after 500ms
  // next ping // after 500ms
  // next ping // after 500ms
  // done false
  aeroflow.repeat(index => index, index => 500 + 500 * index).take(3).notify(console).run();
  // next 0 // after 500ms
  // next 1 // after 1000ms
  // next 2 // after 1500ms
  // done false
  */
  function repeat(repeater, delayer) {
    return instance(repeatGenerator(repeater, delayer));
  }

  function defineGenerator(defintion, generator) {
    defintion[generator.name] = { value: generator };
    return defintion;
  }

  objectDefineProperties(aeroflow, [create, expand, just, listen, random, range, repeat].reduce(defineGenerator, {}));

  objectDefineProperties(aeroflow, {
    adapters: { value: adapters },
    empty: { enumerable: true, get: function get() {
        return empty;
      } },
    listeners: { value: listeners },
    notifiers: { value: notifiers },
    operators: { value: operators }
  });

  exports.default = aeroflow;
  module.exports = exports['default'];
});
