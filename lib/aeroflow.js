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

  var AEROFLOW = 'Aeroflow',
      EMITTER = Symbol('emitter');
  var classof = Object.classof,
      defineProperties = Object.defineProperties,
      floor = Math.floor,
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
      isAeroflow = function isAeroflow(value) {
    return AEROFLOW === classof(value);
  },
      isArray = function isArray(value) {
    return 'Array' === classof(value);
  },
      isDate = function isDate(value) {
    return 'Date' === classof(value);
  },
      isError = function isError(value) {
    return 'Error' === classof(value);
  },
      isFunction = function isFunction(value) {
    return 'Function' === classof(value);
  },
      isInteger = Number.isInteger,
      isIterable = function isIterable(value) {
    return Object.isObject(value) && Symbol.iterator in value;
  },
      isNothing = function isNothing(value) {
    return value == null;
  },
      isNumber = function isNumber(value) {
    return 'Number' === classof(value);
  },
      isPromise = function isPromise(value) {
    return 'Promise' === classof(value);
  },
      isRegExp = function isRegExp(value) {
    return 'RegExp' === classof(value);
  },
      noop = function noop() {},
      throwError = function throwError(error) {
    throw isError(error) ? error : new Error(error);
  };

  var empty = undefined;

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
    for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }

    switch (sources.length) {
      case 0:
        return emitEmpty();

      case 1:
        var source = sources[0];
        if (isAeroflow(source)) return source[EMITTER];
        if (isArray(source)) return emitArray(source);
        if (isFunction(source)) return emitFunction(source);
        if (isPromise(source)) return emitPromise(source);
        if (isIterable(source)) return emitIterable(source);
        return emitValue(source);

      default:
        return function (next, done, context) {
          var limit = sources.length,
              index = -1;
          !(function proceed() {
            ++index < limit ? emit(sources[index])(next, proceed, context) : done();
          })();
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
      return done();
    };
  }

  function emitFunction(source) {
    return function (next, done, context) {
      return emit(source())(next, done, context);
    };
  }

  function emitIterable(source) {
    return function (next, done, context) {
      var iterator = source[Symbol.iterator]();

      while (context()) {
        var result = iterator.next();
        if (result.done) break;else next(result.value);
      }

      done();
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

  function emitValue(value) {
    return function (next, done) {
      next(value);
      done();
    };
  }

  var Aeroflow = (function () {
    function Aeroflow(emitter) {
      var _defineProperties;

      _classCallCheck(this, Aeroflow);

      defineProperties(this, (_defineProperties = {}, _defineProperty(_defineProperties, EMITTER, {
        value: emitter
      }), _defineProperty(_defineProperties, Symbol.toStringTag, {
        value: AEROFLOW
      }), _defineProperties));
    }

    _createClass(Aeroflow, [{
      key: 'append',
      value: function append() {
        for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          sources[_key2] = arguments[_key2];
        }

        return aeroflow.apply(undefined, [this].concat(sources));
      }
    }, {
      key: 'count',
      value: function count() {
        return _reduce(this, function (result) {
          return result + 1;
        }, 0);
      }
    }, {
      key: 'delay',
      value: function delay(condition) {
        return isFunction(condition) ? delayExtended(this, condition) : isDate(condition) ? delayExtended(this, function () {
          return condition - new Date();
        }) : _delay(this, +condition || 0);
      }
    }, {
      key: 'dump',
      value: function dump(prefix, logger) {
        switch (arguments.length) {
          case 0:
            return dumpToConsole(this, '');

          case 1:
            return isFunction(prefix) ? _dump(this, '', prefix) : dumpToConsole(this, '');

          default:
            return isFunction(logger) ? isNothing(prefix) ? _dump(this, '', logger) : _dump(this, prefix, logger) : dumpToConsole(this, prefix);
        }
      }
    }, {
      key: 'every',
      value: function every(predicate) {
        return _every(this, isNothing(predicate) ? function (value) {
          return !!value;
        } : isFunction(predicate) ? predicate : isRegExp(predicate) ? function (value) {
          return predicate.test(value);
        } : function (value) {
          return value === predicate;
        });
      }
    }, {
      key: 'filter',
      value: function filter(predicate) {
        return _filter(this, isNothing(predicate) ? function (value) {
          return !!value;
        } : isFunction(predicate) ? predicate : isRegExp(predicate) ? function (value) {
          return predicate.test(value);
        } : function (value) {
          return value === predicate;
        });
      }
    }, {
      key: 'join',
      value: function join(separator) {
        return _join(this, arguments.length ? isFunction(separator) ? separator : function () {
          return '' + separator;
        } : function () {
          return ',';
        });
      }
    }, {
      key: 'map',
      value: function map(mapper) {
        return arguments.length ? _map(this, isFunction(mapper) ? mapper : function () {
          return mapper;
        }) : this;
      }
    }, {
      key: 'max',
      value: function max() {
        return reduceAlong(this, function (max, value) {
          return value > max ? value : max;
        });
      }
    }, {
      key: 'mean',
      value: function mean() {
        var array = _toArray(this);

        return new Aeroflow(function (next, done, context) {
          return array[EMITTER](function (values) {
            if (!values.length) return;
            values.sort();
            next(values[floor(values.length / 2)]);
          }, done, context);
        });
      }
    }, {
      key: 'min',
      value: function min() {
        return reduceAlong(this, function (min, value) {
          return value < min ? value : min;
        });
      }
    }, {
      key: 'prepend',
      value: function prepend() {
        for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          sources[_key3] = arguments[_key3];
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
            return isFunction(reducer) ? reduceAlong(this, reducer) : just(reducer);

          default:
            return isFunction(reducer) ? _reduce(this, reducer, seed) : just(reducer);
        }
      }
    }, {
      key: 'run',
      value: function run(next, done, data) {
        var _this = this;

        setImmediate(function () {
          return _run(_this, isFunction(next) ? next : noop, isFunction(done) ? done : noop, createContext(_this, data));
        });
        return this;
      }
    }, {
      key: 'share',
      value: function share(expiration) {
        return arguments.length ? isFunction(expiration) ? shareExtended(this, expiration) : isNumber(expiration) ? expiration <= 0 ? this : shareExtended(this, function () {
          return expiration;
        }) : expiration ? _share(this) : this : _share(this);
      }
    }, {
      key: 'skip',
      value: function skip(condition) {
        return arguments.length ? isNumber(condition) ? condition === 0 ? this : condition > 0 ? skipFirst(this, condition) : skipLast(this, condition) : isFunction(condition) ? skipWhile(this, condition) : condition ? skipAll(this) : this : skipAll(this);
      }
    }, {
      key: 'some',
      value: function some(predicate) {
        return _some(this, arguments.length ? isFunction(predicate) ? predicate : isRegExp(predicate) ? function (value) {
          return predicate.test(value);
        } : function (value) {
          return value === predicate;
        } : function (value) {
          return !!value;
        });
      }
    }, {
      key: 'sort',
      value: function sort(order) {
        for (var _len4 = arguments.length, comparers = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          comparers[_key4 - 1] = arguments[_key4];
        }

        return _sort.apply(undefined, [this, order].concat(comparers));
      }
    }, {
      key: 'sum',
      value: function sum() {
        return _reduce(this, function (result, value) {
          return result + value;
        }, 0);
      }
    }, {
      key: 'take',
      value: function take(condition) {
        return arguments.length ? isNumber(condition) ? condition === 0 ? empty : condition > 0 ? takeFirst(this, condition) : takeLast(this, condition) : isFunction(condition) ? takeWhile(this, condition) : condition ? this : empty : this;
      }
    }, {
      key: 'tap',
      value: function tap(callback) {
        return isFunction(callback) ? _tap(this, callback) : this;
      }
    }, {
      key: 'timedelta',
      value: function timedelta() {
        var _this2 = this;

        return new Aeroflow(function (next, done, context) {
          var past = now();

          _this2[EMITTER](function (value) {
            var current = now();
            next({
              timedelta: current - past,
              value: value
            });
            past = current;
          }, done, context);
        });
      }
    }, {
      key: 'timestamp',
      value: function timestamp() {
        var _this3 = this;

        return new Aeroflow(function (next, done, context) {
          return _this3[EMITTER](function (value) {
            return next({
              timestamp: now(),
              value: value
            });
          }, done, context);
        });
      }
    }, {
      key: 'toArray',
      value: function toArray(mapper) {
        return arguments.length ? isFunction(mapper) ? toArrayExtended(this, mapper) : toArrayExtended(this, constant(mapper)) : _toArray(this);
      }
    }, {
      key: 'toMap',
      value: function toMap(keyMapper, valueMapper) {
        switch (arguments.length) {
          case 0:
            return _toMap(this);

          case 1:
            return toMapExtended(this, isFunction(keyMapper) ? keyMapper : constant(keyMapper), identity);

          default:
            return toMapExtended(this, isFunction(keyMapper) ? keyMapper : constant(keyMapper), isFunction(valueMapper) ? keyMapper : constant(valueMapper));
        }
      }
    }, {
      key: 'toSet',
      value: function toSet(mapper) {
        return arguments.length ? isFunction(mapper) ? toSetExtended(this, mapper) : toSetExtended(this, constant(mapper)) : _toSet(this);
      }
    }, {
      key: 'unique',
      value: function unique() {
        var _this4 = this;

        return new Aeroflow(function (next, done, context) {
          var values = new Set();

          _this4[EMITTER](function (value) {
            var size = values.size;
            values.add(value);
            if (size < values.size) next(value);
          }, done, context);
        });
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

  function expand(expander, seed) {
    return isFunction(expander) ? new Aeroflow(function (next, done, context) {
      var index = 0,
          value = seed;

      while (context()) {
        next(value = expander(value, index++, context.data));
      }

      done();
    }) : repeatStatic(expander);
  }

  function just(value) {
    return new Aeroflow(emitValue(value));
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

  function range(start, end, step) {
    end = +end || maxInteger;
    start = +start || 0;
    step = +step || (start < end ? 1 : -1);
    return start === end ? just(start) : new Aeroflow(function (next, done, context) {
      var i = start - step;
      if (start < end) while (context() && (i += step) <= end) {
        next(i);
      } else while (context() && (i += step) >= end) {
        next(i);
      }
      done();
    });
  }

  function repeat(value) {
    return isFunction(value) ? repeatDynamic(value) : repeatStatic(value);
  }

  function repeatDynamic(repeater) {
    return new Aeroflow(function (next, done, context) {
      var index = 0;
      proceed();

      function complete(error) {
        if (error) {
          done();
          throwError(error);
        } else if (context()) setImmediate(proceed);else done();
      }

      function proceed() {
        var result = context() && repeater(index, context.data);
        if (result === false) done();else emit(result)(next, complete, context);
      }
    });
  }

  function repeatStatic(value) {
    return new Aeroflow(function (next, done, context) {
      while (context()) {
        next(value);
      }

      done();
    });
  }

  function _delay(flow, interval) {
    return new Aeroflow(function (next, done, context) {
      return flow[EMITTER](function (value) {
        return setTimeout(function () {
          return next(value);
        }, Math.max(interval, 0));
      }, function (error) {
        return setTimeout(function () {
          return done(error);
        }, Math.max(interval, 0));
      }, context);
    });
  }

  function delayExtended(flow, selector) {
    return new Aeroflow(function (next, done, context) {
      var completition = now(),
          index = 0;
      flow[EMITTER](function (value) {
        var interval = selector(value, index++, context.data),
            estimation = undefined;

        if (isDate(interval)) {
          estimation = interval;
          interval = interval - now();
        } else estimation = now() + interval;

        if (completition < estimation) completition = estimation;
        interval < 0 ? setImmediate(function () {
          return next(value);
        }) : setTimeout(function () {
          return next(value);
        }, interval);
      }, function (error) {
        completition -= now();
        completition < 0 ? setImmediate(function () {
          return done(error);
        }) : setTimeout(function () {
          return done(error);
        }, completition);
      }, context);
    });
  }

  function _dump(flow, prefix, logger) {
    return new Aeroflow(function (next, done, context) {
      return flow[EMITTER](function (value) {
        logger(prefix + 'next', value);
        next(value);
      }, function (error) {
        error ? logger(prefix + 'done', error) : logger(prefix + 'done');
        done(error);
      }, context);
    });
  }

  function dumpToConsole(flow, prefix) {
    return new Aeroflow(function (next, done, context) {
      return flow[EMITTER](function (value) {
        console.log(prefix + 'next', value);
        next(value);
      }, function (error) {
        error ? console.error(prefix + 'done', error) : console.log(prefix + 'done');
        done(error);
      }, context);
    });
  }

  function _every(predicate) {
    var _this5 = this;

    return new Aeroflow(function (next, done, context) {
      var idle = true,
          result = true;
      context = context.spawn();

      _this5[EMITTER](function (value) {
        idle = false;
        if (!predicate(value)) return;
        result = false;
        context.end();
      }, function (error) {
        next(result && !idle);
        done(error);
      }, context);
    });
  }

  function _filter(flow, predicate) {
    return new Aeroflow(function (next, done, context) {
      var index = 0;
      flow[EMITTER](function (value) {
        return predicate(value, index++, context.data) ? next(value) : false;
      }, done, context);
    });
  }

  function _join(flow, joiner) {
    return reduceOptional(flow, function (result, value, index, data) {
      return result.length ? result + joiner(value, index, data) + value : value;
    }, '');
  }

  function _map(flow, mapper) {
    return new Aeroflow(function (next, done, context) {
      var index = 0;
      flow[EMITTER](function (value) {
        return next(mapper(value, index++, context.data));
      }, done, context);
    });
  }

  function _reduce(flow, reducer, seed) {
    return new Aeroflow(function (next, done, context) {
      var index = 0,
          result = seed;
      flow[EMITTER](function (value) {
        return result = reducer(result, value, index++, context.data);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    });
  }

  function reduceAlong(flow, reducer) {
    return new Aeroflow(function (next, done, context) {
      var idle = true,
          index = 0,
          result = undefined;
      flow[EMITTER](function (value) {
        if (empty) {
          idle = false;
          index++;
          result = value;
        } else result = reducer(result, value, index++, context.data);
      }, function (error) {
        if (!idle) next(result);
        done(error);
      }, context);
    });
  }

  function reduceOptional(flow, reducer, seed) {
    return new Aeroflow(function (next, done, context) {
      var idle = true,
          index = 0,
          result = seed;
      flow[EMITTER](function (value) {
        idle = false;
        result = reducer(result, value, index++, context.data);
      }, function (error) {
        if (!idle) next(result);
        done(error);
      }, context);
    });
  }

  function _run(flow, next, done, context) {
    flow[EMITTER](function (value) {
      return next(value, context);
    }, function (error) {
      context.end();
      done(error, context);
    }, context);
  }

  function _share(flow) {
    var cache = [],
        cached = false;
    return new Aeroflow(function (next, done, context) {
      if (cached) {
        cache.forEach(next);
        done();
      } else flow[EMITTER](function (value) {
        cache.push(value);
        next(value);
      }, function (error) {
        cached = true;
        done(error);
      }, context);
    });
  }

  function shareExtended(flow, selector) {
    var cache = [],
        cached = false;
    return new Aeroflow(function (next, done, context) {
      if (cached) {
        cache.forEach(next);
        done();
      } else flow[EMITTER](function (value) {
        cache.push(value);
        next(value);
      }, function (error) {
        setTimeout(function () {
          cache = [];
          cached = false;
        }, selector(context.data));
        done(error);
      }, context);
    });
  }

  function skipAll(flow) {
    return new Aeroflow(function (next, done, context) {
      return flow[EMITTER](noop, done, context);
    });
  }

  function skipFirst(flow, count) {
    return new Aeroflow(function (next, done, context) {
      var index = -1;
      flow[EMITTER](function (value) {
        return ++index < count ? false : next(value);
      }, done, context);
    });
  }

  function skipLast(flow, count) {
    var array = _toArray(flow);

    return new Aeroflow(function (next, done, context) {
      return array[EMITTER](function (value) {
        for (var index = 0, limit = value.length - count; index < limit; index++) {
          next(value[index]);
        }
      }, done, context);
    });
  }

  function skipWhile(flow, predicate) {
    return new Aeroflow(function (next, done, context) {
      var index = 0,
          skipping = true;
      flow[EMITTER](function (value) {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        if (!skipping) next(value);
      }, done, context);
    });
  }

  function _some(flow, predicate) {
    return new Aeroflow(function (next, done, context) {
      var result = false;
      context = context.spawn();
      flow[EMITTER](function (value) {
        if (!predicate(value)) return;
        result = true;
        context.end();
      }, function (error) {
        next(result);
        done(error);
      }, context);
    });
  }

  function _sort(flow, order) {
    for (var _len5 = arguments.length, selectors = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
      selectors[_key5 - 2] = arguments[_key5];
    }

    if (isFunction(order)) {
      selectors.unshift(order);
      order = 1;
    }

    if (!selectors.every(isFunction)) throwError('Selector function expected.');

    switch (order) {
      case 'asc':
      case 1:
      case undefined:
      case null:
        order = 1;
        break;

      case 'desc':
      case -1:
        order = -1;
        break;

      default:
        order = order ? 1 : -1;
        break;
    }

    switch (selectors.length) {
      case 0:
        return sortStandard(flow, order);

      case 1:
        return sortWithSelector(flow, order, selectors[0]);

      default:
        return sortWithSelectors.apply(undefined, [flow, order].concat(selectors));
    }
  }

  function sortStandard(flow, order) {
    var array = _toArray(flow);

    return new Aeroflow(function (next, done, context) {
      return array[EMITTER](function (values) {
        return order === 1 ? values.sort().forEach(next) : values.sort().reverse().forEach(next);
      }, done, context);
    });
  }

  function sortWithSelector(flow, order, selector) {
    var array = _toArray(flow),
        comparer = function comparer(left, right) {
      return order * compare(selector(left), selector(right));
    };

    return new Aeroflow(function (next, done, context) {
      return array[EMITTER](function (values) {
        return values.sort(comparer).forEach(next);
      }, done, context);
    });
  }

  function sortWithSelectors(flow, order) {
    for (var _len6 = arguments.length, selectors = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
      selectors[_key6 - 2] = arguments[_key6];
    }

    var array = _toArray(flow),
        count = selectors.length,
        comparer = function comparer(left, right) {
      var index = -1;

      while (++index < count) {
        var selector = selectors[index],
            result = order * compare(selector(left), selector(right));
        if (result) return result;
      }

      return 0;
    };

    return new Aeroflow(function (next, done, context) {
      return array[EMITTER](function (values) {
        return values.sort(comparer).forEach(next);
      }, done, context);
    });
  }

  function takeFirst(flow, count) {
    return new Aeroflow(function (next, done, context) {
      var index = 1;
      context = context.spawn();
      flow[EMITTER](function (value) {
        next(value);
        if (count <= index++) context.end();
      }, done, context);
    });
  }

  function takeLast(flow, count) {
    var array = _toArray(flow);

    return new Aeroflow(function (next, done, context) {
      array[EMITTER](function (value) {
        var limit = value.length,
            index = Math.max(length - 1 - count, 0);

        while (index < limit) {
          next(value[index++]);
        }
      }, done, context);
    });
  }

  function takeWhile(flow, predicate) {
    return new Aeroflow(function (next, done, context) {
      var index = 0;
      context = context.spawn();
      flow[EMITTER](function (value) {
        return predicate(value, index++, context.data) ? next(value) : context.end();
      }, done, context);
    });
  }

  function _tap(flow, callback) {
    return new Aeroflow(function (next, done, context) {
      var index = 0;
      flow[EMITTER](function (value) {
        callback(value, index++, context.data);
        next(value);
      }, done, context);
    });
  }

  function _toArray(flow) {
    return new Aeroflow(function (next, done, context) {
      var result = [];
      flow[EMITTER](function (value) {
        return result.push(value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    });
  }

  function toArrayExtended(flow, mapper) {
    return new Aeroflow(function (next, done, context) {
      var index = 0,
          result = [];
      flow[EMITTER](function (value) {
        return result.push(mapper(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    });
  }

  function _toMap(flow) {
    return new Aeroflow(function (next, done, context) {
      var result = new Map();
      flow[EMITTER](function (value) {
        return result.set(value, value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    });
  }

  function toMapExtended(flow, keyMapper, valueMapper) {
    return new Aeroflow(function (next, done, context) {
      var index = 0,
          result = new Map();
      flow[EMITTER](function (value) {
        return result.set(keyMapper(value, index++, context.data), valueMapper(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    });
  }

  function _toSet(flow) {
    return new Aeroflow(function (next, done, context) {
      var result = new Set();
      flow[EMITTER](function (value) {
        return result.add(value);
      }, function (error) {
        next(result);
        done(error);
      }, context);
    });
  }

  function toSetExtended(flow, mapper) {
    return new Aeroflow(function (next, done, context) {
      var index = 0,
          result = new Set();
      flow[EMITTER](function (value) {
        return result.add(mapper(value, index++, context.data));
      }, function (error) {
        next(result);
        done(error);
      }, context);
    });
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
