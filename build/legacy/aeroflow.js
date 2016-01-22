(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.aeroflow = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var _arguments = arguments,
      _objectDefineProperti;

  function append() {
    for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }

    return aeroflow.apply(undefined, [this].concat(sources));
  }

  var justEmitter = function justEmitter(value) {
    return function (next, done) {
      var result = next(value);
      done();
      return result;
    };
  };

  var just = function just(value) {
    return new Aeroflow(justEmitter(value));
  };

  var AEROFLOW = 'Aeroflow';
  var ARRAY = 'Array';
  var CLASS = Symbol.toStringTag;
  var DATE = 'Date';
  var EMITTER = Symbol('emitter');
  var FUNCTION = 'Function';
  var ITERATOR = Symbol.iterator;
  var NUMBER = 'Number';
  var PROMISE = 'Promise';
  var PROTOTYPE = 'prototype';
  var REGEXP = 'RegExp';

  var classOf$1 = function classOf$1(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };

  var classIs = function classIs(className) {
    return function (value) {
      return classOf$1(value) === className;
    };
  };

  var constant = function constant(value) {
    return function () {
      return value;
    };
  };

  var dateNow = Date.now;

  var identity = function identity(value) {
    return value;
  };

  var isDate = classIs(DATE);
  var isFunction$1 = classIs(FUNCTION);
  var isInteger = Number.isInteger;

  var isNothing = function isNothing(value) {
    return value == null;
  };

  var isNumber = classIs(NUMBER);
  var isRegExp = classIs(REGEXP);
  var mathFloor = Math.floor;
  var mathRandom = Math.random;
  var maxInteger = Number.MAX_SAFE_INTEGER;
  var mathMax = Math.max;

  var noop = function noop() {};

  var objectDefineProperties = Object.defineProperties;
  var objectDefineProperty = Object.defineProperty;

  var reduceEmitter = function reduceEmitter(emitter, reducer, seed) {
    return function (next, done, context) {
      var index = 0,
          result = seed;
      emitter(function (value) {
        return result = reducer(result, value, index++, context.data);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  };

  var reduceAlongEmitter = function reduceAlongEmitter(emitter, reducer) {
    return function (next, done, context) {
      var idle = true,
          index = 1,
          result = undefined;
      emitter(function (value) {
        if (idle) {
          idle = false;
          result = value;
        } else result = reducer(result, value, index++, context.data);
      }, function (error) {
        if (!idle) next(result);
        done(error);
      }, context);
    };
  };

  var reduceOptionalEmitter = function reduceOptionalEmitter(emitter, reducer, seed) {
    return function (next, done, context) {
      var idle = true,
          index = 0,
          result = seed;
      emitter(function (value) {
        idle = false;
        result = reducer(result, value, index++, context.data);
      }, function (error) {
        if (!idle) next(result);
        done(error);
      }, context);
    };
  };

  function reduce(reducer, seed) {
    switch (arguments.length) {
      case 0:
        return empty;

      case 1:
        return isFunction$1(reducer) ? new Aeroflow(reduceAlongEmitter(this[EMITTER], reducer)) : just(reducer);

      default:
        return isFunction$1(reducer) ? new Aeroflow(reduceEmitter(this[EMITTER], reducer, seed)) : just(reducer);
    }
  }

  var countEmitter = function countEmitter(emitter) {
    return reduceEmitter(emitter, function (result) {
      return result + 1;
    }, 0);
  };

  function count() {
    return new Aeroflow(countEmitter(this[EMITTER]));
  }

  var create = function create(emitter) {
    return _arguments.length ? isFunction$1(emitter) ? new Aeroflow(function (next, done, context) {
      var completed = false;
      context.onend(emitter(function (value) {
        return context() ? next() : false;
      }, function (error) {
        if (completed) return;
        completed = true;
        done();
        context.end();
      }, context));
    }) : just(emitter) : empty;
  };

  var delayEmitter = function delayEmitter(emitter, interval) {
    return function (next, done, context) {
      return emitter(function (value) {
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(next(value));
          }, interval);
        });
      }, function (error) {
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(done(error));
          }, interval);
        });
      }, context);
    };
  };

  var delayDynamicEmitter = function delayDynamicEmitter(emitter, selector) {
    return function (next, done, context) {
      var completition = dateNow(),
          index = 0;
      emitter(function (value) {
        var interval = selector(value, index++, context.data),
            estimation = undefined;

        if (isDate(interval)) {
          estimation = interval;
          interval = interval - dateNow();
        } else estimation = dateNow() + interval;

        if (completition < estimation) completition = estimation;
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(next(value));
          }, mathMax(interval, 0));
        });
      }, function (error) {
        completition -= dateNow();
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(done(error));
          }, mathMax(completition, 0));
        });
      }, context);
    };
  };

  function delay(condition) {
    return new Aeroflow(isFunction$1(condition) ? delayDynamicEmitter(this[EMITTER], condition) : isDate(condition) ? delayDynamicEmitter(this[EMITTER], function () {
      return mathMax(condition - new Date(), 0);
    }) : delayEmitter(this[EMITTER], mathMax(+condition || 0, 0)));
  }

  var dumpToConsoleEmitter = function dumpToConsoleEmitter(emitter, prefix) {
    return function (next, done, context) {
      return emitter(function (value) {
        console.log(prefix + 'next', value);
        next(value);
      }, function (error) {
        error ? console.error(prefix + 'done', error) : console.log(prefix + 'done');
        done(error);
      }, context);
    };
  };

  var dumpToLoggerEmitter = function dumpToLoggerEmitter(emitter, prefix, logger) {
    return function (next, done, context) {
      return emitter(function (value) {
        logger(prefix + 'next', value);
        next(value);
      }, function (error) {
        error ? logger(prefix + 'done', error) : logger(prefix + 'done');
        done(error);
      }, context);
    };
  };

  function dump(prefix, logger) {
    return new Aeroflow(arguments.length === 0 ? dumpToConsoleEmitter(this[EMITTER], '') : arguments.length === 1 ? isFunction$1(prefix) ? dumpToLoggerEmitter(this[EMITTER], '', prefix) : dumpToConsoleEmitter(this[EMITTER], '') : isFunction$1(logger) ? isNothing(prefix) ? dumpToLoggerEmitter(this[EMITTER], '', logger) : dumpToLoggerEmitter(this[EMITTER], prefix, logger) : dumpToConsoleEmitter(this[EMITTER], prefix));
  }

  var everyEmitter = function everyEmitter(emitter, predicate) {
    return function (next, done, context) {
      var idle = true,
          result = true;
      context = context.spawn();
      emitter(function (value) {
        idle = false;
        if (!predicate(value)) return;
        result = false;
        context.end();
      }, function (error) {
        next(result && !idle);
        done(error);
      }, context);
    };
  };

  function every(predicate) {
    return new Aeroflow(everyEmitter(this[EMITTER], isNothing(predicate) ? function (value) {
      return !!value;
    } : isFunction$1(predicate) ? predicate : isRegExp(predicate) ? function (value) {
      return predicate.test(value);
    } : function (value) {
      return value === predicate;
    }));
  }

  var repeatEmitter = function repeatEmitter(value) {
    return function (next, done, context) {
      while (context()) {
        next(value);
      }

      done();
    };
  };

  var repeatDynamicEmitter = function repeatDynamicEmitter(repeater) {
    return function (next, done, context) {
      var index = 0,
          result = undefined;

      while (context() && false !== (result = repeater(index++, context.data))) {
        next(result);
      }

      done();
    };
  };

  var repeat = function repeat(value) {
    return new Aeroflow(isFunction$1(value) ? repeatDynamicEmitter(value) : repeatEmitter(value));
  };

  var expandEmitter = function expandEmitter(expander, seed) {
    return function (next, done, context) {
      var index = 0,
          value = seed;

      while (context()) {
        next(value = expander(value, index++, context.data));
      }

      done();
    };
  };

  var expand = function expand(expander, seed) {
    return isFunction$1(expander) ? new Aeroflow(expandEmitter(expander, seed)) : repeatEmitter(expander);
  };

  var filterEmitter = function filterEmitter(emitter, predicate) {
    return function (next, done, context) {
      var index = 0;
      emitter(function (value) {
        return predicate(value, index++, context.data) ? next(value) : true;
      }, done, context);
    };
  };

  function filter(predicate) {
    return new Aeroflow(filterEmitter(this[EMITTER], isNothing(predicate) ? function (value) {
      return !!value;
    } : isFunction$1(predicate) ? predicate : isRegExp(predicate) ? function (value) {
      return predicate.test(value);
    } : function (value) {
      return value === predicate;
    }));
  }

  var joinEmitter = function joinEmitter(emitter, joiner) {
    return reduceOptionalEmitter(emitter, function (result, value, index, data) {
      return result.length ? result + joiner(value, index, data) + value : value;
    }, '');
  };

  function join(separator) {
    return new Aeroflow(joinEmitter(this[EMITTER], arguments.length ? isFunction$1(separator) ? separator : function () {
      return '' + separator;
    } : function () {
      return ',';
    }));
  }

  var mapEmitter = function mapEmitter(emitter, mapper) {
    return function (next, done, context) {
      var index = 0;
      emitter(function (value) {
        return next(mapper(value, index++, context.data));
      }, done, context);
    };
  };

  function map(mapper) {
    return arguments.length ? new Aeroflow(mapEmitter(this[EMITTER], isFunction$1(mapper) ? mapper : constant(mapper))) : this;
  }

  var maxEmitter = function maxEmitter(emitter) {
    return reduceAlongEmitter(emitter, function (maximum, value) {
      return value > maximum ? value : maximum;
    });
  };

  function max() {
    return new Aeroflow(maxEmitter(this[EMITTER]));
  }

  var minEmitter = function minEmitter(emitter) {
    return reduceAlongEmitter(emitter, function (minimum, value) {
      return value < minimum ? value : minimum;
    });
  };

  function min() {
    return new Aeroflow(minEmitter(this[EMITTER]));
  }

  function prepend() {
    for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      sources[_key2] = arguments[_key2];
    }

    return aeroflow.apply(undefined, sources.concat([this]));
  }

  var randomEmitter = function randomEmitter(inclusiveMin, exclusiveMax) {
    return function (next, done, context) {
      while (context()) {
        next(inclusiveMin + exclusiveMax * mathRandom());
      }

      done();
    };
  };

  var randomIntegerEmitter = function randomIntegerEmitter(inclusiveMin, exclusiveMax) {
    return function (next, done, context) {
      while (context()) {
        next(mathFloor(inclusiveMin + exclusiveMax * mathRandom()));
      }

      done();
    };
  };

  var random = function random(inclusiveMin, exclusiveMax) {
    inclusiveMin = +inclusiveMin || 0;
    exclusiveMax = +exclusiveMax || 1;
    exclusiveMax -= inclusiveMin;
    return new Aeroflow(isInteger(inclusiveMin) && isInteger(exclusiveMax) ? randomIntegerEmitter(inclusiveMin, exclusiveMax) : randomEmitter(inclusiveMin, exclusiveMax));
  };

  var rangeEmitter = function rangeEmitter(inclusiveStart, inclusiveEnd, step) {
    return function (next, done, context) {
      var i = inclusiveStart - step;
      if (inclusiveStart < inclusiveEnd) while (context() && (i += step) <= inclusiveEnd) {
        next(i);
      } else while (context() && (i += step) >= inclusiveEnd) {
        next(i);
      }
      done();
    };
  };

  var range = function range(inclusiveStart, inclusiveEnd, step) {
    inclusiveEnd = +inclusiveEnd || maxInteger;
    inclusiveStart = +inclusiveStart || 0;
    step = +step || (inclusiveStart < inclusiveEnd ? 1 : -1);
    return inclusiveStart === inclusiveEnd ? just(inclusiveStart) : new Aeroflow(rangeEmitter(inclusiveStart, inclusiveEnd, step));
  };

  function createContext(flow, data) {
    var active = true,
        callbacks = [],
        context = function context() {
      return active;
    },
        end = function end() {
      if (active) {
        active = false;
        callbacks.forEach(function (callback) {
          return callback();
        });
      }

      return false;
    },
        onend = function onend(callback) {
      if (isFunction$1(callback)) active ? callbacks.push(callback) : callback();
      return callback;
    },
        spawn = function spawn() {
      return onend(createContext(flow, data).end);
    };

    return objectDefineProperties(context, {
      data: {
        value: data
      },
      flow: {
        value: flow
      },
      end: {
        value: end
      },
      onend: {
        value: onend
      },
      spawn: {
        value: spawn
      }
    });
  }

  function run(next, done, data) {
    if (!isFunction$1(done)) done = noop;
    if (!isFunction$1(next)) next = noop;
    var context = createContext(this, data),
        emitter = this[EMITTER];
    setImmediate(function () {
      var index = 0;
      emitter(function (value) {
        return next(value, index++, context);
      }, function (error) {
        context.end();
        done(error, index, context);
      }, context);
    });
    return this;
  }

  var toArrayEmitter = function toArrayEmitter(emitter) {
    return function (next, done, context) {
      var result = [];
      emitter(function (value) {
        return result.push(value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  };

  var toArrayTransformingEmitter = function toArrayTransformingEmitter(emitter, transformer) {
    return function (next, done, context) {
      var index = 0,
          result = [];
      emitter(function (value) {
        return result.push(transformer(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  };

  function toArray(transformer) {
    return new Aeroflow(arguments.length ? isFunction$1(transformer) ? toArrayTransformingEmitter(this[EMITTER], transformer) : toArrayTransformingEmitter(this[EMITTER], constant(transformer)) : toArrayEmitter(this[EMITTER]));
  }

  var skipAllEmitter = function skipAllEmitter(emitter) {
    return function (next, done, context) {
      return emitter(noop, done, context);
    };
  };

  var skipFirstEmitter = function skipFirstEmitter(emitter, count) {
    return function (next, done, context) {
      var index = -1;
      emitter(function (value) {
        return ++index < count ? false : next(value);
      }, done, context);
    };
  };

  var skipLastEmitter = function skipLastEmitter(emitter, count) {
    return function (next, done, context) {
      return toArrayEmitter(emitter)(function (value) {
        for (var index = -1, limit = value.length - count; ++index < limit;) {
          next(value[index]);
        }
      }, done, context);
    };
  };

  var skipWhileEmitter = function skipWhileEmitter(emitter, predicate) {
    return function (next, done, context) {
      var index = 0,
          skipping = true;
      emitter(function (value) {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        if (!skipping) next(value);
      }, done, context);
    };
  };

  function skip(condition) {
    return arguments.length ? isNumber(condition) ? condition === 0 ? this : new Aeroflow(condition > 0 ? skipFirstEmitter(this[EMITTER], condition) : skipLastEmitter(this[EMITTER], -condition)) : isFunction$1(condition) ? new Aeroflow(skipWhileEmitter(this[EMITTER], condition)) : condition ? new Aeroflow(skipAllEmitter(this[EMITTER])) : this : new Aeroflow(skipAllEmitter(this[EMITTER]));
  }

  var someEmitter = function someEmitter(emitter, predicate) {
    return function (next, done, context) {
      var result = false;
      context = context.spawn();
      emitter(function (value) {
        if (!predicate(value)) return;
        result = true;
        context.end();
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  };

  function some(predicate) {
    return new Aeroflow(someEmitter(this[EMITTER], arguments.length ? isFunction$1(predicate) ? predicate : isRegExp(predicate) ? function (value) {
      return predicate.test(value);
    } : function (value) {
      return value === predicate;
    } : function (value) {
      return !!value;
    }));
  }

  var sumEmitter = function sumEmitter(emitter) {
    return reduceEmitter(emitter, function (result, value) {
      return result + value;
    }, 0);
  };

  function sum() {
    return new Aeroflow(sumEmitter(this[EMITTER]));
  }

  var takeFirstEmitter = function takeFirstEmitter(emitter, count) {
    return function (next, done, context) {
      var index = 1;
      context = context.spawn();
      emitter(function (value) {
        next(value);
        if (count <= index++) context.end();
      }, done, context);
    };
  };

  var takeLastEmitter = function takeLastEmitter(emitter, count) {
    return function (next, done, context) {
      return toArrayEmitter(emitter)(function (value) {
        var limit = value.length;
        var index = mathMax(limit - 1 - count, 0);

        while (index < limit) {
          next(value[index++]);
        }
      }, done, context);
    };
  };

  var takeWhileEmitter = function takeWhileEmitter(emitter, predicate) {
    return function (next, done, context) {
      var index = 0;
      context = context.spawn();
      emitter(function (value) {
        return predicate(value, index++, context.data) ? next(value) : context.end();
      }, done, context);
    };
  };

  function take(condition) {
    return arguments.length ? isNumber(condition) ? condition === 0 ? empty : new Aeroflow(condition > 0 ? takeFirstEmitter(this[EMITTER], condition) : takeLastEmitter(this[EMITTER], condition)) : isFunction$1(condition) ? new Aeroflow(takeWhileEmitter(this[EMITTER], condition)) : condition ? this : empty : this;
  }

  var tapEmitter = function tapEmitter(emitter, callback) {
    return function (next, done, context) {
      var index = 0;
      emitter(function (value) {
        callback(value, index++, context.data);
        return next(value);
      }, done, context);
    };
  };

  function tap(callback) {
    return isFunction$1(callback) ? new Aeroflow(tapEmitter(this[EMITTER], callback)) : this;
  }

  var timestampEmitter = function timestampEmitter(emitter) {
    return function (next, done, context) {
      var past = dateNow();
      emitter(function (value) {
        var current = dateNow();
        next({
          timedelta: current - past,
          timestamp: dateNow,
          value: value
        });
        past = current;
      }, done, context);
    };
  };

  function timestamp() {
    return new Aeroflow(timestampEmitter(this[EMITTER]));
  }

  var toMapEmitter = function toMapEmitter(emitter) {
    return function (next, done, context) {
      var result = new Map();
      emitter(function (value) {
        return result.set(value, value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  };

  var toMapTransformingEmitter = function toMapTransformingEmitter(emitter, keyTransformer, valueTransformer) {
    return function (next, done, context) {
      var index = 0,
          result = new Map();
      emitter(function (value) {
        return result.set(keyTransformer(value, index++, context.data), valueTransformer(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  };

  function toMap(keyTransformer, valueTransformer) {
    return new Aeroflow(arguments.length === 0 ? toMapEmitter(this[EMITTER]) : toMapTransformingEmitter(this[EMITTER], isFunction$1(keyTransformer) ? keyTransformer : constant(keyTransformer), arguments.length === 1 ? identity : isFunction$1(valueTransformer) ? keyTransformer : constant(valueTransformer)));
  }

  var toSetEmitter = function toSetEmitter(emitter) {
    return function (next, done, context) {
      var result = new Set();
      emitter(function (value) {
        return result.add(value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  };

  var toSetTransformingEmitter = function toSetTransformingEmitter(emitter, transformer) {
    return function (next, done, context) {
      var index = 0,
          result = new Set();
      emitter(function (value) {
        return result.add(transformer(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  };

  function toSet(transformer) {
    return new Aeroflow(arguments.length === 0 ? toSetEmitter(this[EMITTER]) : toSetTransformingEmitter(this[EMITTER], isFunction$1(transformer) ? transformer : constant(transformer)));
  }

  function Aeroflow(emitter) {
    objectDefineProperty(this, EMITTER, {
      value: emitter
    });
  }

  objectDefineProperties(Aeroflow[PROTOTYPE], (_objectDefineProperti = {}, _defineProperty(_objectDefineProperti, CLASS, {
    value: AEROFLOW
  }), _defineProperty(_objectDefineProperti, 'append', {
    value: append
  }), _defineProperty(_objectDefineProperti, 'count', {
    value: count
  }), _defineProperty(_objectDefineProperti, 'delay', {
    value: delay
  }), _defineProperty(_objectDefineProperti, 'dump', {
    value: dump
  }), _defineProperty(_objectDefineProperti, 'emitters', {
    value: emitters
  }), _defineProperty(_objectDefineProperti, 'every', {
    value: every
  }), _defineProperty(_objectDefineProperti, 'filter', {
    value: filter
  }), _defineProperty(_objectDefineProperti, 'join', {
    value: join
  }), _defineProperty(_objectDefineProperti, 'map', {
    value: map
  }), _defineProperty(_objectDefineProperti, 'max', {
    value: max
  }), _defineProperty(_objectDefineProperti, 'min', {
    value: min
  }), _defineProperty(_objectDefineProperti, 'prepend', {
    value: prepend
  }), _defineProperty(_objectDefineProperti, 'reduce', {
    value: reduce
  }), _defineProperty(_objectDefineProperti, 'run', {
    value: run
  }), _defineProperty(_objectDefineProperti, 'skip', {
    value: skip
  }), _defineProperty(_objectDefineProperti, 'some', {
    value: some
  }), _defineProperty(_objectDefineProperti, 'sum', {
    value: sum
  }), _defineProperty(_objectDefineProperti, 'take', {
    value: take
  }), _defineProperty(_objectDefineProperti, 'tap', {
    value: tap
  }), _defineProperty(_objectDefineProperti, 'timestamp', {
    value: timestamp
  }), _defineProperty(_objectDefineProperti, 'toArray', {
    value: toArray
  }), _defineProperty(_objectDefineProperti, 'toMap', {
    value: toMap
  }), _defineProperty(_objectDefineProperti, 'toSet', {
    value: toSet
  }), _objectDefineProperti));
  var emitters = new Map();

  var aeroflowEmitter = function aeroflowEmitter(source) {
    return source[EMITTER];
  };

  var arrayEmitter = function arrayEmitter(source) {
    return function (next, done, context) {
      var index = -1;

      while (context() && ++index < source.length) {
        next(source[index]);
      }

      done();
    };
  };

  var emptyEmitter = function emptyEmitter() {
    return function (_, done) {
      return done();
    };
  };

  var empty = new Aeroflow(emptyEmitter());

  var functionEmitter = function functionEmitter(source) {
    return function (next, done, context) {
      emit(source(context.data))(next, done, context);
    };
  };

  var promiseEmitter = function promiseEmitter(source) {
    return function (next, done, context) {
      source.then(function (value) {
        return emit(value)(next, done, context);
      }, function (error) {
        done(error);
        throwError(error);
      });
    };
  };

  emitters.set(AEROFLOW, aeroflowEmitter);
  emitters.set(ARRAY, arrayEmitter);
  emitters.set(FUNCTION, functionEmitter);
  emitters.set(PROMISE, promiseEmitter);

  function emit() {
    for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      sources[_key3] = arguments[_key3];
    }

    switch (sources.length) {
      case 0:
        return emptyEmitter();

      case 1:
        var emitter = emitters[classOf(source)],
            source = sources[0];
        if (isFunction(emitter)) return emitter(source);
        if (isObject(source) && ITERATOR in source) return function (source) {
          return function (next, done, context) {
            var iterator = source[ITERATOR]();
            var iteration = undefined;

            while (context() && !(iteration = iterator.next()).done) {
              next(iteration.value);
            }

            done();
          };
        };
        return justEmitter(source);

      default:
        return function (next, done, context) {
          var index = -1;

          var limit = sources.length,
              proceed = function proceed() {
            ++index < limit ? emit(sources[index])(next, proceed, context) : done();
          };

          proceed();
        };
    }
  }

  function aeroflow() {
    return new Aeroflow(emit.apply(undefined, arguments));
  }

  objectDefineProperties(aeroflow, {
    create: {
      value: create
    },
    empty: {
      value: empty
    },
    expand: {
      value: expand
    },
    just: {
      value: just
    },
    random: {
      value: random
    },
    range: {
      value: range
    },
    repeat: {
      value: repeat
    }
  });
  exports.Aeroflow = Aeroflow;
  exports.aeroflow = aeroflow;
  exports.empty = empty;
});
