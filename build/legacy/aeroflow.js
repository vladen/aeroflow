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

  var _objectDefineProperti, _objectCreate;

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
  var BOOLEAN = 'Boolean';
  var CLASS = Symbol.toStringTag;
  var DATE = 'Date';
  var ERROR = 'Error';
  var FUNCTION = 'Function';
  var ITERATOR = Symbol.iterator;
  var NULL = 'Null';
  var NUMBER = 'Number';
  var PROMISE = 'Promise';
  var PROTOTYPE = 'prototype';
  var REGEXP = 'RegExp';
  var STRING = 'String';
  var SYMBOL = 'Symbol';
  var UNDEFINED = 'Undefined';
  var primitives = new Set([BOOLEAN, NULL, NUMBER, STRING, SYMBOL, UNDEFINED]);
  var dateNow = Date.now;
  var mathFloor = Math.floor;
  var mathPow = Math.pow;
  var mathRandom = Math.random;
  var mathMin = Math.min;
  var maxInteger = Number.MAX_SAFE_INTEGER;
  var objectCreate = Object.create;
  var objectDefineProperties = Object.defineProperties;
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

  function unsync(result, next, done) {
    switch (result) {
      case true:
        return false;

      case false:
        done(false);
        return true;
    }

    switch (classOf(result)) {
      case PROMISE:
        result.then(function (promiseResult) {
          if (!unsync(promiseResult, next, done)) next(true);
        }, function (promiseError) {
          return done(toError(promiseError));
        });
        break;

      case ERROR:
        done(result);
        break;
    }

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
    return function (next, done, context) {
      return flow.emitter(next, done, objectDefineProperties({}, {
        data: {
          value: context.data
        },
        sources: {
          value: flow.sources
        }
      }));
    };
  }

  function functionAdapter(source) {
    return function (next, done, context) {
      if (!unsync(next(source(context.data)), done, done)) done(true);
    };
  }

  function iterableAdapter(source, sourceClass) {
    if (!primitives.has(sourceClass) && ITERATOR in source) return function (next, done, context) {
      var iteration = undefined,
          iterator = source[ITERATOR]();
      !function proceed() {
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

  function valueAdapter(value) {
    return function (next, done) {
      if (!unsync(next(value), done, done)) done(true);
    };
  }

  var adapters = [iterableAdapter];
  objectDefineProperties(adapters, (_objectDefineProperti = {}, _defineProperty(_objectDefineProperti, AEROFLOW, {
    value: flowAdapter
  }), _defineProperty(_objectDefineProperti, ARRAY, {
    configurable: true,
    value: arrayAdapter,
    writable: true
  }), _defineProperty(_objectDefineProperti, ERROR, {
    configurable: true,
    value: errorAdapter,
    writable: true
  }), _defineProperty(_objectDefineProperti, FUNCTION, {
    configurable: true,
    value: functionAdapter,
    writable: true
  }), _defineProperty(_objectDefineProperti, PROMISE, {
    configurable: true,
    value: promiseAdapter,
    writable: true
  }), _objectDefineProperti));

  function selectAdapter(source) {
    var fallback = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    var sourceClass = classOf(source);
    var adapter = adapters[sourceClass];
    if (isFunction(adapter)) return adapter(source);

    for (var i = -1, l = adapters.length; ++i < l;) {
      adapter = adapters[i](source, sourceClass);
      if (isFunction(adapter)) return adapter;
    }

    if (fallback) return valueAdapter(source);
  }

  function customNotifier(next, done) {
    if (isFunction(next)) return {
      done: toFunction(done, noop),
      next: next
    };
  }

  function eventEmitterNotifier(target) {
    var nextEventName = arguments.length <= 1 || arguments[1] === undefined ? 'next' : arguments[1];
    var doneEventName = arguments.length <= 2 || arguments[2] === undefined ? 'done' : arguments[2];
    if (!isObject(target) || !isFunction(target.emit)) return;

    var emit = function emit(eventName) {
      return function (result) {
        return target.emit(eventName, result);
      };
    };

    return {
      done: emit(doneEventName),
      next: emit(nextEventName)
    };
  }

  function eventTargetNotifier(target) {
    var nextEventName = arguments.length <= 1 || arguments[1] === undefined ? 'next' : arguments[1];
    var doneEventName = arguments.length <= 2 || arguments[2] === undefined ? 'done' : arguments[2];
    if (!isObject(target) || !isFunction(target.dispatchEvent)) return;

    var dispatch = function dispatch(eventName) {
      return function (detail) {
        return target.dispatchEvent(new CustomEvent(eventName, {
          detail: detail
        }));
      };
    };

    return {
      done: dispatch(doneEventName),
      next: dispatch(nextEventName)
    };
  }

  function observerNotifier(target) {
    if (!isObject(target) || !isFunction(target.onNext) || !isFunction(target.onError) || !isFunction(target.onCompleted)) return;
    return {
      done: function done(result) {
        return (isError(result) ? target.onError : target.onCompleted)(result);
      },
      next: function next(result) {
        return target.onNext(result);
      }
    };
  }

  var notifiers = [eventEmitterNotifier, eventTargetNotifier, observerNotifier];
  objectDefineProperties(notifiers, _defineProperty({}, FUNCTION, {
    configurable: true,
    value: customNotifier,
    writable: true
  }));

  var isNotifier = function isNotifier(notifier) {
    return isObject(notifier) && isFunction(notifier.done) && isFunction(notifier.next);
  };

  function selectNotifier(target, parameters) {
    var notifier = notifiers[classOf(target)];
    if (notifier) notifier = notifier.apply(undefined, [target].concat(_toConsumableArray(parameters)));
    if (!isNotifier(notifier)) for (var i = -1, l = notifiers.length; ++i < l;) {
      notifier = notifiers[i].apply(notifiers, [target].concat(_toConsumableArray(parameters)));
      if (isNotifier(notifier)) break;else notifier = null;
    }
    return notifier ? function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (result) {
          notifier.next(result, index++, context.data);
          return next(result);
        }, function (result) {
          notifier.done(result, context.data);
          return done(result);
        }, context);
      };
    } : identity;
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
      var buffer = [],
          conveying = false,
          finalizer = undefined,
          finished = false;
      finalizer = generator(function (result) {
        if (finished) return false;
        buffer.push(result);
        if (!conveying) convey(true);
        return true;
      }, function (result) {
        if (finished) return false;
        finished = true;
        buffer.result = isUndefined(result) || result;
        if (!conveying) convey(true);
        return true;
      }, context.data);

      function convey(result) {
        conveying = false;
        if (result) while (buffer.length) {
          if (unsync(next(buffer.shift()), convey, finish)) {
            conveying = true;
            return;
          }
        }
        if (finished) finish(result);
      }

      function finish(result) {
        finished = true;
        if (isFunction(finalizer)) setImmediate(finalizer);
        done(result && buffer.result);
      }
    };
  }

  function expandGenerator(expander, seed) {
    expander = toFunction(expander);
    return function (next, done, context) {
      var index = 0,
          value = seed;
      !function proceed() {
        while (!unsync(next(value = expander(value, index++, context.data)), proceed, done)) {}
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
      var index = -1;
      !function proceed(result) {
        setTimeout(function () {
          if (!unsync(next(repeater(index, context.data)), proceed, done)) proceed();
        }, toDelay(delayer(++index, context.data), 1000));
      }();
    };
  }

  function repeatImmediateGenerator(repeater) {
    return function (next, done, context) {
      var index = 0;
      !function proceed() {
        while (!unsync(next(repeater(index++, context.data)), proceed, done)) {}
      }();
    };
  }

  function repeatGenerator(value, interval) {
    var repeater = toFunction(value);
    return isDefined(interval) ? repeatDeferredGenerator(repeater, toFunction(interval)) : repeatImmediateGenerator(repeater);
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

          reduced = reducer(reduced, result, index++, context.data);
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
    alternative = toFunction(alternative, alternative || []);
    return function (emitter) {
      return function (next, done, context) {
        return emitter(next, function (result) {
          return isError(result) ? selectAdapter(alternative(result, context.data))(next, done, context) : done(result);
        }, context);
      };
    };
  }

  function coalesceOperator(alternatives) {
    if (!alternatives.length) return identity;
    return function (emitter) {
      return function (next, done, context) {
        var empty = true,
            index = 0;
        emitter(onNext, onDone, context);

        function onDone(result) {
          if (!isError(result) && empty && index < alternatives.length) selectAdapter(alternatives[index++])(onNext, onDone, context);else done(result);
        }

        function onNext(result) {
          empty = false;
          return next(result);
        }
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
            }, toDelay(delayer(result, index++, context.data), 1000));
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

  function dumpToConsoleOperator(prefix) {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(function (result) {
          console.log(prefix + 'next', result);
          return next(result);
        }, function (result) {
          console[isError(result) ? 'error' : 'log'](prefix + 'done', result);
          done(result);
        }, context);
      };
    };
  }

  function dumpToLoggerOperator(prefix, logger) {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(function (result) {
          logger(prefix + 'next', result);
          return next(result);
        }, function (result) {
          logger(prefix + 'done', result);
          done(result);
        }, context);
      };
    };
  }

  function dumpOperator(prefix, logger) {
    return isFunction(prefix) ? dumpToLoggerOperator('', prefix) : isFunction(logger) ? dumpToLoggerOperator(prefix, logger) : isUndefined(prefix) ? dumpToConsoleOperator('') : dumpToConsoleOperator(prefix);
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
            every = true;
        emitter(function (result) {
          empty = false;
          if (predicate(result)) return true;
          every = false;
          return false;
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
          return !predicate(result, index++, context.data) || next(result);
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
          var adapter = selectAdapter(result, false);

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
            var key = selectors[i](value, index++, context.data);
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

  function mapOperator(mapper) {
    if (isUndefined(mapper)) return identity;
    mapper = toFunction(mapper);
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          return next(mapper(value, index++, context.data));
        }, done, context);
      };
    };
  }

  function joinOperator(right, condition) {
    var comparer = toFunction(condition, truthy),
        toArray = toArrayOperator()(selectAdapter(right));
    return function (emitter) {
      return function (next, done, context) {
        return toArray(function (rightArray) {
          return new Promise(function (rightResolve) {
            return emitter(function (leftResult) {
              return new Promise(function (leftResolve) {
                var array = arrayAdapter(rightArray),
                    filter = filterOperator(function (rightResult) {
                  return comparer(leftResult, rightResult);
                }),
                    map = mapOperator(function (rightResult) {
                  return [leftResult, rightResult];
                });
                return map(filter(array))(next, leftResolve, context);
              });
            }, rightResolve, context);
          });
        }, done, context);
      };
    };
  }

  function maxOperator() {
    return reduceOperator(function (maximum, result) {
      return maximum < result ? result : maximum;
    });
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
                interval = index ? chronicle.delay : chronicle.delay + toNumber(delayer(context.data), 0);
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
          if (skipping && !predicate(value, index++, context.data)) skipping = false;
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
        return toArrayOperator()(emitter)(function (result) {
          var index = begin < 0 ? result.length + begin : begin,
              limit = end < 0 ? result.length + end : mathMin(result.length, end);
          if (index < 0) index = 0;
          if (limit < 0) limit = 0;
          return index >= limit || new Promise(function (resolve) {
            !function proceed() {
              while (!unsync(next(result[index++]), proceed, resolve) && index < limit) {}

              resolve(true);
            }();
          });
        }, done, context);
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
        var some = false;
        emitter(function (result) {
          if (!predicate(result)) return true;
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
          return predicate(value, index++, context.data) && next(value);
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

      default:
        return condition ? identity : tie(emptyGenerator, false);
    }
  }

  function tapOperator(callback) {
    return function (emitter) {
      return isFunction(callback) ? function (next, done, context) {
        var index = 0;
        emitter(function (result) {
          callback(result, index++, context.data);
          return next(result);
        }, done, context);
      } : emitter;
    };
  }

  function toMapOperator(keySelector, valueSelector) {
    keySelector = isUndefined(keySelector) ? identity : toFunction(keySelector);
    valueSelector = isUndefined(valueSelector) ? identity : toFunction(valueSelector);
    return function (emitter) {
      return function (next, done, context) {
        var map = new Map();
        var index = 0;
        emitter(function (result) {
          map.set(keySelector(result, index++, context.data), valueSelector(result, index++, context.data));
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
    return reduceOperator(function (string, result, index, data) {
      return string.length ? string + separator(result, index, data) + result : '' + result;
    }, '', true);
  }

  function emit(next, done, context) {
    var index = -1;
    !function proceed(result) {
      if (result !== true || ++index >= context.sources.length) done(result);else try {
        var source = context.sources[index];
        selectAdapter(source)(next, proceed, context);
      } catch (error) {
        done(error);
      }
    }(true);
  }

  function aeroflow() {
    for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      sources[_key2] = arguments[_key2];
    }

    return new Flow(emit, sources);
  }

  function create(emitter) {
    return new Flow(customGenerator(emitter));
  }

  function expand(expander, seed) {
    return new Flow(expandGenerator(expander, seed));
  }

  function just(value) {
    return new Flow(valueAdapter(value));
  }

  function random(minimum, maximum) {
    return new Flow(randomGenerator(minimum, maximum));
  }

  function range(start, end, step) {
    return new Flow(rangeGenerator(start, end, step));
  }

  function repeat(value, interval) {
    return new Flow(repeatGenerator(value, interval));
  }

  function Flow(emitter, sources) {
    objectDefineProperties(this, {
      emitter: {
        value: emitter
      },
      sources: {
        value: sources
      }
    });
  }

  function average() {
    return this.chain(averageOperator());
  }

  function bind() {
    for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      sources[_key3] = arguments[_key3];
    }

    return new Flow(this.emitter, sources);
  }

  function catch_(alternative) {
    return this.chain(catchOperator(alternative));
  }

  function chain(operator) {
    return new Flow(operator(this.emitter), this.sources);
  }

  function coalesce() {
    for (var _len4 = arguments.length, alternatives = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      alternatives[_key4] = arguments[_key4];
    }

    return this.chain(coalesceOperator(alternatives));
  }

  function concat() {
    for (var _len5 = arguments.length, sources = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      sources[_key5] = arguments[_key5];
    }

    return new Flow(this.emitter, this.sources.concat(sources));
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

  function dump(prefix, logger) {
    return this.chain(dumpOperator(prefix, logger));
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
    for (var _len6 = arguments.length, selectors = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      selectors[_key6] = arguments[_key6];
    }

    return this.chain(groupOperator(selectors));
  }

  function join(right, comparer) {
    return this.chain(joinOperator(right, comparer));
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
    for (var _len7 = arguments.length, parameters = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      parameters[_key7 - 1] = arguments[_key7];
    }

    return this.chain(selectNotifier(target, parameters));
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

  function run(data) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this.emitter(truthy, function (result) {
        return isError(result) ? reject(result) : resolve(_this);
      }, objectDefineProperties({}, {
        data: {
          value: data
        },
        sources: {
          value: _this.sources
        }
      }));
    });
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
    for (var _len8 = arguments.length, parameters = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      parameters[_key8] = arguments[_key8];
    }

    return this.chain(sortOperator(parameters));
  }

  function sum() {
    return this.chain(sumOperator());
  }

  function take(condition) {
    return this.chain(takeOperator(condition));
  }

  function tap(callback) {
    return this.chain(tapOperator(callback));
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

  var operators = objectCreate(Object[PROTOTYPE], {
    average: {
      value: average,
      writable: true
    },
    catch: {
      value: catch_,
      writable: true
    },
    coalesce: {
      value: coalesce,
      writable: true
    },
    count: {
      value: count,
      writable: true
    },
    delay: {
      value: delay,
      writable: true
    },
    distinct: {
      value: distinct,
      writable: true
    },
    dump: {
      value: dump,
      writable: true
    },
    every: {
      value: every,
      writable: true
    },
    filter: {
      value: filter,
      writable: true
    },
    flatten: {
      value: flatten,
      writable: true
    },
    group: {
      value: group,
      writable: true
    },
    join: {
      value: join,
      writable: true
    },
    map: {
      value: map,
      writable: true
    },
    max: {
      value: max,
      writable: true
    },
    mean: {
      value: mean,
      writable: true
    },
    min: {
      value: min,
      writable: true
    },
    reduce: {
      value: reduce,
      writable: true
    },
    replay: {
      value: replay,
      writable: true
    },
    retry: {
      value: retry,
      writable: true
    },
    reverse: {
      value: reverse,
      writable: true
    },
    skip: {
      value: skip,
      writable: true
    },
    slice: {
      value: slice,
      writable: true
    },
    some: {
      value: some,
      writable: true
    },
    sort: {
      value: sort,
      writable: true
    },
    sum: {
      value: sum,
      writable: true
    },
    take: {
      value: take,
      writable: true
    },
    tap: {
      value: tap,
      writable: true
    },
    toArray: {
      value: toArray,
      writable: true
    },
    toMap: {
      value: toMap,
      writable: true
    },
    toSet: {
      value: toSet,
      writable: true
    },
    toString: {
      value: toString,
      writable: true
    }
  });
  Flow[PROTOTYPE] = objectCreate(operators, (_objectCreate = {}, _defineProperty(_objectCreate, CLASS, {
    value: AEROFLOW
  }), _defineProperty(_objectCreate, 'bind', {
    value: bind
  }), _defineProperty(_objectCreate, 'chain', {
    value: chain
  }), _defineProperty(_objectCreate, 'concat', {
    value: concat
  }), _defineProperty(_objectCreate, 'notify', {
    value: notify
  }), _defineProperty(_objectCreate, 'run', {
    value: run
  }), _objectCreate));
  objectDefineProperties(aeroflow, {
    adapters: {
      value: adapters
    },
    create: {
      value: create
    },
    empty: {
      enumerable: true,
      value: new Flow(emptyGenerator(true))
    },
    expand: {
      value: expand
    },
    just: {
      value: just
    },
    notifiers: {
      value: notifiers
    },
    operators: {
      value: operators
    },
    random: {
      value: random
    },
    range: {
      value: range
    },
    repeat: {
      value: repeat
    },
    return: {
      value: just
    }
  });
  exports.default = aeroflow;
  module.exports = exports['default'];
});
