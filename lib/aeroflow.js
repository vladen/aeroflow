/**
  * Lazily computed async reactive data flow.
  * @module aeroflow
  */

'use strict'

/*
  -------------
    constants
  -------------
*/

;

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.aeroflow = mod.exports;
  }
})(this, function (module) {
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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
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
  })();

  var CLASS_AEROFLOW = 'Aeroflow',
      CLASS_ARRAY = 'Array',
      CLASS_DATE = 'Date',
      CLASS_ERROR = 'Error',
      CLASS_FUNCTION = 'Function',
      CLASS_NUMBER = 'Number',
      CLASS_PROMISE = 'Promise',
      CLASS_REG_EXP = 'RegExp',
      SYMBOL_CLASS = Symbol('class'),
      SYMBOL_EMITTER = Symbol('emitter'),
      SYMBOL_TO_STRING_TAG = Symbol.toStringTag;
  var classof = Object.classof,
      defineProperties = Object.defineProperties,
      floor = Math.floor,
      isInteger = Number.isInteger,
      maxInteger = Number.MAX_SAFE_INTEGER,
      now = Date.now;

  var compare = function compare(left, right) {
    return left < right ? -1 : left > right ? 1 : 0;
  },
      constant = function constant(value) {
    return function () {
      return value;
    };
  },
      identity = function identity(value) {
    return value;
  },
      isDate = function isDate(value) {
    return CLASS_DATE === classof(value);
  },
      isError = function isError(value) {
    return CLASS_ERROR === classof(value);
  },
      isFunction = function isFunction(value) {
    return CLASS_FUNCTION === classof(value);
  },
      isNothing = function isNothing(value) {
    return value == null;
  },
      isNumber = function isNumber(value) {
    return CLASS_NUMBER === classof(value);
  },
      isPromise = function isPromise(value) {
    return CLASS_PROMISE === classof(value);
  },
      isRegExp = function isRegExp(value) {
    return CLASS_REG_EXP === classof(value);
  },
      noop = function noop() {},
      throwError = function throwError(error) {
    throw isError(error) ? error : new Error(error);
  };

  var empty = undefined;

  var Aeroflow = (function () {
    function Aeroflow(emitter) {
      var _defineProperties;

      _classCallCheck(this, Aeroflow);

      defineProperties(this, (_defineProperties = {}, _defineProperty(_defineProperties, SYMBOL_EMITTER, {
        value: emitter
      }), _defineProperty(_defineProperties, SYMBOL_TO_STRING_TAG, {
        value: CLASS_AEROFLOW
      }), _defineProperties));
    }

    _createClass(Aeroflow, [{
      key: 'append',
      value: function append() {
        for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
          sources[_key] = arguments[_key];
        }

        return aeroflow.apply(undefined, [this].concat(sources));
      }
    }, {
      key: 'count',
      value: function count() {
        return new Aeroflow(_reduce(this[SYMBOL_EMITTER], function (result) {
          return result + 1;
        }, 0));
      }
    }, {
      key: 'delay',
      value: function delay(condition) {
        return new Aeroflow(isFunction(condition) ? delayExtended(this[SYMBOL_EMITTER], condition) : isDate(condition) ? delayExtended(this[SYMBOL_EMITTER], function () {
          return Math.max(condition - new Date(), 0);
        }) : _delay(this[SYMBOL_EMITTER], Math.max(+condition || 0, 0)));
      }
    }, {
      key: 'dump',
      value: function dump(prefix, logger) {
        var arity = arguments.length,
            emitter = this[SYMBOL_EMITTER];
        return new Aeroflow(arity === 0 ? dumpToConsole(emitter, '') : arity === 1 ? isFunction(prefix) ? _dump(emitter, '', prefix) : dumpToConsole(emitter, '') : isFunction(logger) ? isNothing(prefix) ? _dump(emitter, '', logger) : _dump(emitter, prefix, logger) : dumpToConsole(emitter, prefix));
      }
    }, {
      key: 'every',
      value: function every(predicate) {
        return new Aeroflow(_every(this[SYMBOL_EMITTER], isNothing(predicate) ? function (value) {
          return !!value;
        } : isFunction(predicate) ? predicate : isRegExp(predicate) ? function (value) {
          return predicate.test(value);
        } : function (value) {
          return value === predicate;
        }));
      }
    }, {
      key: 'filter',
      value: function filter(predicate) {
        return new Aeroflow(_filter(this[SYMBOL_EMITTER], isNothing(predicate) ? function (value) {
          return !!value;
        } : isFunction(predicate) ? predicate : isRegExp(predicate) ? function (value) {
          return predicate.test(value);
        } : function (value) {
          return value === predicate;
        }));
      }
    }, {
      key: 'join',
      value: function join(separator) {
        return new Aeroflow(_join(this[SYMBOL_EMITTER], arguments.length ? isFunction(separator) ? separator : function () {
          return '' + separator;
        } : function () {
          return ',';
        }));
      }
    }, {
      key: 'map',
      value: function map(mapper) {
        return arguments.length ? new Aeroflow(_map(this[SYMBOL_EMITTER], isFunction(mapper) ? mapper : function () {
          return mapper;
        })) : this;
      }
    }, {
      key: 'max',
      value: function max() {
        return new Aeroflow(reduceAlong(this[SYMBOL_EMITTER], function (max, value) {
          return value > max ? value : max;
        }));
      }
    }, {
      key: 'mean',
      value: function mean() {
        var _this = this;

        return new Aeroflow(function (next, done, context) {
          return _toArray(_this[SYMBOL_EMITTER])(function (values) {
            if (!values.length) return;
            values.sort();
            next(values[floor(values.length / 2)]);
          }, done, context);
        });
      }
    }, {
      key: 'min',
      value: function min() {
        return new Aeroflow(reduceAlong(this[SYMBOL_EMITTER], function (min, value) {
          return value < min ? value : min;
        }));
      }
    }, {
      key: 'prepend',
      value: function prepend() {
        for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          sources[_key2] = arguments[_key2];
        }

        return aeroflow.apply(undefined, sources.concat([this]));
      }
    }, {
      key: 'reduce',
      value: function reduce(reducer, seed) {
        switch (arguments.length) {
          case 0:
            return empty;

          case 1:
            return isFunction(reducer) ? new Aeroflow(reduceAlong(this[SYMBOL_EMITTER], reducer)) : just(reducer);

          default:
            return isFunction(reducer) ? new Aeroflow(_reduce(this[SYMBOL_EMITTER], reducer, seed)) : just(reducer);
        }
      }
    }, {
      key: 'run',
      value: function run(next, done, data) {
        var _this2 = this;

        setImmediate(function () {
          return _run(_this2[SYMBOL_EMITTER], isFunction(next) ? next : noop, isFunction(done) ? done : noop, createContext(_this2, data));
        });
        return this;
      }
    }, {
      key: 'skip',
      value: function skip(condition) {
        return arguments.length ? isNumber(condition) ? condition === 0 ? this : new Aeroflow(condition > 0 ? skipFirst(this[SYMBOL_EMITTER], condition) : skipLast(this[SYMBOL_EMITTER], condition)) : isFunction(condition) ? new Aeroflow(skipWhile(this[SYMBOL_EMITTER], condition)) : condition ? new Aeroflow(skipAll(this[SYMBOL_EMITTER])) : this : new Aeroflow(skipAll(this[SYMBOL_EMITTER]));
      }
    }, {
      key: 'some',
      value: function some(predicate) {
        return _some(this[SYMBOL_EMITTER], arguments.length ? isFunction(predicate) ? predicate : isRegExp(predicate) ? function (value) {
          return predicate.test(value);
        } : function (value) {
          return value === predicate;
        } : function (value) {
          return !!value;
        });
      }
    }, {
      key: 'sum',
      value: function sum() {
        return _reduce(this[SYMBOL_EMITTER], function (result, value) {
          return result + value;
        }, 0);
      }
    }, {
      key: 'take',
      value: function take(condition) {
        return arguments.length ? isNumber(condition) ? condition === 0 ? empty : new Aeroflow(condition > 0 ? takeFirst(this[SYMBOL_EMITTER], condition) : takeLast(this[SYMBOL_EMITTER], condition)) : isFunction(condition) ? new Aeroflow(takeWhile(this[SYMBOL_EMITTER], condition)) : condition ? this : empty : this;
      }
    }, {
      key: 'tap',
      value: function tap(callback) {
        return isFunction(callback) ? _tap(this[SYMBOL_EMITTER], callback) : this;
      }
    }, {
      key: 'timestamp',
      value: function timestamp() {
        return new Aeroflow(_timestamp(this[SYMBOL_EMITTER]));
      }
    }, {
      key: 'toArray',
      value: function toArray(mapper) {
        return new Aeroflow(arguments.length ? isFunction(mapper) ? toArrayExtended(this[SYMBOL_EMITTER], mapper) : toArrayExtended(this[SYMBOL_EMITTER], constant(mapper)) : _toArray(this[SYMBOL_EMITTER]));
      }
    }, {
      key: 'toMap',
      value: function toMap(keyMapper, valueMapper) {
        var arity = arguments.length,
            emitter = this[SYMBOL_EMITTER];
        return new Aeroflow(arity === 0 ? _toMap(emitter) : toMapExtended(emitter, isFunction(keyMapper) ? keyMapper : constant(keyMapper), arity === 1 ? identity : isFunction(valueMapper) ? keyMapper : constant(valueMapper)));
      }
    }, {
      key: 'toSet',
      value: function toSet(mapper) {
        var emitter = this[SYMBOL_EMITTER];
        return new Aeroflow(arguments.length === 0 ? _toSet(emitter) : toSetExtended(emitter, isFunction(mapper) ? mapper : constant(mapper)));
      }
    }]);

    return Aeroflow;
  })();

  function aeroflow() {
    return new Aeroflow(emit.apply(undefined, arguments));
  }

  empty = new Aeroflow(emitEmpty());

  function create(emitter) {
    return arguments.length ? isFunction(emitter) ? new Aeroflow(function (next, done, context) {
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
  }

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
      if (isFunction(callback)) active ? callbacks.push(callback) : callback();
      return callback;
    },
        spawn = function spawn() {
      return onend(createContext(flow, data));
    };

    return defineProperties(context, {
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

  function emit() {
    for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      sources[_key3] = arguments[_key3];
    }

    switch (sources.length) {
      case 0:
        return emitEmpty();

      case 1:
        var source = sources[0];

        switch (classof(source)) {
          case CLASS_AEROFLOW:
            return source[SYMBOL_EMITTER];

          case CLASS_ARRAY:
            return emitArray(source);

          case CLASS_FUNCTION:
            return emitFunction(source);

          case CLASS_PROMISE:
            return emitPromise(source);

          default:
            return Object.isObject(source) && Symbol.iterator in source ? emitIterable(source) : emitJust(source);
        }

        break;

      default:
        return function (next, done, context) {
          var limit = sources.length,
              index = -1,
              proceed = function proceed() {
            ++index < limit ? emit(sources[index])(next, proceed, context) : done();
          };

          proceed();
        };
    }
  }

  function emitArray(source) {
    return function (next, done, context) {
      var index = -1;

      while (context() && ++index < source.length) {
        next(source[index]);
      }

      done();
    };
  }

  function emitEmpty() {
    return function (next, done) {
      done();
      return true;
    };
  }

  function emitFunction(source) {
    return function (next, done, context) {
      return emit(source(context.data))(next, done, context);
    };
  }

  function emitIterable(source) {
    return function (next, done, context) {
      var iteration = undefined,
          iterator = source[Symbol.iterator]();

      while (context() && !(iteration = iterator.next()).done) {
        next(iteration.value);
      }

      done();
    };
  }

  function emitJust(value) {
    return function (next, done) {
      var result = next(value);
      done();
      return result;
    };
  }

  function emitPromise(source) {
    return function (next, done, context) {
      return source.then(function (value) {
        return emit(value)(next, done, context);
      }, function (error) {
        done(error);
        throwError(error);
      });
    };
  }

  function expand(expander, seed) {
    return new Aeroflow(isFunction(expander) ? function (next, done, context) {
      var index = 0,
          value = seed;

      while (context()) {
        next(value = expander(value, index++, context.data));
      }

      done();
    } : repeatStatic(expander));
  }

  function just(value) {
    return new Aeroflow(emitJust(value));
  }

  function random(inclusiveMin, exclusiveMax) {
    inclusiveMin = +inclusiveMin || 0;
    exclusiveMax = +exclusiveMax || 1;
    exclusiveMax -= inclusiveMin;
    var generator = isInteger(inclusiveMin) && isInteger(exclusiveMax) ? function () {
      return floor(inclusiveMin + exclusiveMax * Math.random());
    } : function () {
      return inclusiveMin + exclusiveMax * Math.random();
    };
    return new Aeroflow(function (next, done, context) {
      while (context()) {
        next(generator());
      }

      done();
    });
  }

  function range(inclusiveStart, inclusiveEnd, step) {
    inclusiveEnd = +inclusiveEnd || maxInteger;
    inclusiveStart = +inclusiveStart || 0;
    step = +step || (inclusiveStart < inclusiveEnd ? 1 : -1);
    return inclusiveStart === inclusiveEnd ? just(inclusiveStart) : new Aeroflow(function (next, done, context) {
      var i = inclusiveStart - step;
      if (inclusiveStart < inclusiveEnd) while (context() && (i += step) <= inclusiveEnd) {
        next(i);
      } else while (context() && (i += step) >= inclusiveEnd) {
        next(i);
      }
      done();
    });
  }

  function repeat(value) {
    return new Aeroflow(isFunction(value) ? repeatDynamic(value) : repeatStatic(value));
  }

  function repeatDynamic(repeater) {
    return function (next, done, context) {
      var index = 0,
          result = undefined;

      while (context() && false !== (result = repeater(index++, context.data))) {
        next(result);
      }

      done();
    };
  }

  function repeatStatic(value) {
    return function (next, done, context) {
      while (context()) {
        next(value);
      }

      done();
    };
  }

  function _delay(emitter, interval) {
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
  }

  function delayExtended(emitter, selector) {
    return function (next, done, context) {
      var completition = now(),
          index = 0;
      emitter(function (value) {
        var interval = selector(value, index++, context.data),
            estimation = undefined;

        if (isDate(interval)) {
          estimation = interval;
          interval = interval - now();
        } else estimation = now() + interval;

        if (completition < estimation) completition = estimation;
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(next(value));
          }, Math.max(interval, 0));
        });
      }, function (error) {
        completition -= now();
        return new Promise(function (resolve) {
          return setTimeout(function () {
            return resolve(done(error));
          }, Math.max(completition, 0));
        });
      }, context);
    };
  }

  function _dump(emitter, prefix, logger) {
    return function (next, done, context) {
      return emitter(function (value) {
        logger(prefix + 'next', value);
        next(value);
      }, function (error) {
        error ? logger(prefix + 'done', error) : logger(prefix + 'done');
        done(error);
      }, context);
    };
  }

  function dumpToConsole(emitter, prefix) {
    return function (next, done, context) {
      return emitter(function (value) {
        console.log(prefix + 'next', value);
        next(value);
      }, function (error) {
        error ? console.error(prefix + 'done', error) : console.log(prefix + 'done');
        done(error);
      }, context);
    };
  }

  function _every(emitter, predicate) {
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
  }

  function _filter(emitter, predicate) {
    return function (next, done, context) {
      var index = 0;
      emitter(function (value) {
        return predicate(value, index++, context.data) ? next(value) : true;
      }, done, context);
    };
  }

  function _join(emitter, joiner) {
    return reduceOptional(emitter, function (result, value, index, data) {
      return result.length ? result + joiner(value, index, data) + value : value;
    }, '');
  }

  function _map(emitter, mapper) {
    return function (next, done, context) {
      var index = 0;
      emitter(function (value) {
        return next(mapper(value, index++, context.data));
      }, done, context);
    };
  }

  function _reduce(emitter, reducer, seed) {
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
  }

  function reduceAlong(emitter, reducer) {
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
  }

  function reduceOptional(emitter, reducer, seed) {
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
  }

  function _run(emitter, next, done, context) {
    var index = 0;
    emitter(function (value) {
      return next(value, index++, context);
    }, function (error) {
      context.end();
      done(error, index, context);
    }, context);
  }

  function skipAll(emitter) {
    return function (next, done, context) {
      return emitter(noop, done, context);
    };
  }

  function skipFirst(emitter, count) {
    return function (next, done, context) {
      var index = -1;
      emitter(function (value) {
        return ++index < count ? false : next(value);
      }, done, context);
    };
  }

  function skipLast(emitter, count) {
    return function (next, done, context) {
      return _toArray(emitter)(function (value) {
        for (var index = 0, limit = value.length - count; index < limit; index++) {
          next(value[index]);
        }
      }, done, context);
    };
  }

  function skipWhile(emitter, predicate) {
    return function (next, done, context) {
      var index = 0,
          skipping = true;
      emitter(function (value) {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        if (!skipping) next(value);
      }, done, context);
    };
  }

  function _some(emitter, predicate) {
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
  }

  function takeFirst(emitter, count) {
    return function (next, done, context) {
      var index = 1;
      context = context.spawn();
      emitter(function (value) {
        next(value);
        if (count <= index++) context.end();
      }, done, context);
    };
  }

  function takeLast(emitter, count) {
    return function (next, done, context) {
      return _toArray(emitter)(function (value) {
        var limit = value.length,
            index = Math.max(length - 1 - count, 0);

        while (index < limit) {
          next(value[index++]);
        }
      }, done, context);
    };
  }

  function takeWhile(emitter, predicate) {
    return function (next, done, context) {
      var index = 0;
      context = context.spawn();
      emitter(function (value) {
        return predicate(value, index++, context.data) ? next(value) : context.end();
      }, done, context);
    };
  }

  function _tap(emitter, callback) {
    return function (next, done, context) {
      var index = 0;
      emitter(function (value) {
        callback(value, index++, context.data);
        return next(value);
      }, done, context);
    };
  }

  function _timestamp(emitter) {
    return new Aeroflow(function (next, done, context) {
      var past = now();
      emitter(function (value) {
        var current = now();
        next({
          timedelta: current - past,
          timestamp: now,
          value: value
        });
        past = current;
      }, done, context);
    });
  }

  function _toArray(emitter) {
    return function (next, done, context) {
      var result = [];
      emitter(function (value) {
        return result.push(value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  }

  function toArrayExtended(emitter, mapper) {
    return function (next, done, context) {
      var index = 0,
          result = [];
      emitter(function (value) {
        return result.push(mapper(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  }

  function _toMap(emitter) {
    return function (next, done, context) {
      var result = new Map();
      emitter(function (value) {
        return result.set(value, value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  }

  function toMapExtended(emitter, keyMapper, valueMapper) {
    return function (next, done, context) {
      var index = 0,
          result = new Map();
      emitter(function (value) {
        return result.set(keyMapper(value, index++, context.data), valueMapper(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  }

  function _toSet(emitter) {
    return function (next, done, context) {
      var result = new Set();
      emitter(function (value) {
        return result.add(value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  }

  function toSetExtended(emitter, mapper) {
    return function (next, done, context) {
      var index = 0,
          result = new Set();
      emitter(function (value) {
        return result.add(mapper(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    };
  }

  module.exports = defineProperties(aeroflow, {
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
});
