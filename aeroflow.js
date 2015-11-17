'use strict';

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

  function _typeof(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }

  var AEROFLOW = 'Aeroflow',
      FUNCTION_TYPE = 'function',
      NUMBER_TYPE = 'number',
      OBJECT_TYPE = 'object',
      STRING_TYPE = 'object',
      classTag = function classTag(className) {
    return '[object ' + className + ']';
  },
      ARRAY_TAG = classTag('Array'),
      DATE_TAG = classTag('Date'),
      ERROR_TAG = classTag('Error'),
      NUMBER_TAG = classTag('Number'),
      PROMISE_TAG = classTag('Promise'),
      REGEXP_TAG = classTag('RegExp'),
      STRING_TAG = classTag('String'),
      defineProperty = Object.defineProperty,
      defineProperties = Object.defineProperties,
      floor = Math.floor,
      now = Date.now,
      hasSymbols = FUNCTION_TYPE === (typeof Symbol === 'undefined' ? 'undefined' : _typeof(Symbol)),
      maxInteger = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1,
      identity = function identity(value) {
    return value;
  },
      noop = function noop() {},
      toStringTag = Object.prototype.toString,
      GENERATOR = (hasSymbols ? Symbol : identity)('generator'),
      ITERATOR = hasSymbols ? Symbol.iterator : 'iterator',
      TO_STRING_TAG = hasSymbols ? Symbol.toStringTag : 'toStringTag',
      isArray = typeof Array.isArray === 'function' ? Array.isArray : function (value) {
    return ARRAY_TAG === toStringTag.call(value);
  },
      isDate = function isDate(value) {
    return DATE_TAG === toStringTag.call(value);
  },
      isError = function isError(value) {
    return ERROR_TAG === toStringTag.call(value);
  },
      isFunction = function isFunction(value) {
    return FUNCTION_TYPE === (typeof value === 'undefined' ? 'undefined' : _typeof(value));
  },
      isInteger = FUNCTION_TYPE === _typeof(Number.isInteger) ? Number.isInteger : function (value) {
    return NUMBER_TYPE === (typeof value === 'undefined' ? 'undefined' : _typeof(value)) && isFinite(value) && value === floor(value);
  },
      isNothing = function isNothing(value) {
    return value == null;
  },
      isNumber = function isNumber(value) {
    return NUMBER_TAG === toStringTag.call(value);
  },
      isObject = function isObject(value) {
    return OBJECT_TYPE === (typeof value === 'undefined' ? 'undefined' : _typeof(value)) && null !== value;
  },
      isPromise = function isPromise(value) {
    return PROMISE_TAG === toStringTag.call(value);
  },
      isRegExp = function isRegExp(value) {
    return REGEXP_TAG === toStringTag.call(value);
  },
      isSomething = function isSomething(value) {
    return null != value;
  },
      isString = function isString(value) {
    return STRING_TAG === toStringTag.call(value);
  },
      isAeroflow = function isAeroflow(value) {
    return isObject(value) && AEROFLOW === value[TO_STRING_TAG];
  },
      isIterable = function isIterable(value) {
    return isObject(value) && ITERATOR in value;
  };

  function makeContext(data) {
    var active = true,
        callbacks = [],
        context = function context(value) {
      if (value !== undefined) if (value === false) {
        active = false;
        callbacks.forEach(function (callback) {
          return callback();
        });
      } else if (isFunction(value)) active ? callbacks.push(value) : value();
      return active;
    };

    return defineProperties(context, {
      data: {
        value: data
      },
      spawn: {
        value: function value() {
          var child = makeContext(data);
          context(child);
          return child;
        }
      }
    });
  }

  function makeLimiter(condition) {
    return isNumber(condition) ? function (value, index) {
      return index < condition;
    } : isFunction(condition) ? condition : function () {
      return true;
    };
  }

  function makeMapper(mapping) {
    return isNothing(mapping) ? identity : isFunction(mapping) ? mapping : function () {
      return mapping;
    };
  }

  function makePredicate(condition) {
    return isNothing(condition) ? isSomething : isFunction(condition) ? condition : isRegExp(condition) ? function (value) {
      return condition.test(value);
    } : function (value) {
      return value === condition;
    };
  }

  function throwError(error) {
    throw isError(error) ? error : new Error(error);
  }

  var Aeroflow = (function () {
    function Aeroflow(generator) {
      var _defineProperties;

      _classCallCheck(this, Aeroflow);

      defineProperties(this, (_defineProperties = {}, _defineProperty(_defineProperties, GENERATOR, {
        value: generator
      }), _defineProperty(_defineProperties, TO_STRING_TAG, {
        value: AEROFLOW
      }), _defineProperties));
    }

    _createClass(Aeroflow, [{
      key: 'concat',
      value: function concat() {
        for (var _len = arguments.length, flows = Array(_len), _key = 0; _key < _len; _key++) {
          flows[_key] = arguments[_key];
        }

        return _concat.apply(undefined, [this].concat(flows));
      }
    }, {
      key: 'count',
      value: function count() {
        return this.reduce(function (result) {
          return result + 1;
        }, 0);
      }
    }, {
      key: 'delay',
      value: function delay(condition) {
        var _this = this;

        var delayer = isFunction(condition) ? condition : function () {
          return condition;
        };
        return new Aeroflow(function (next, done, context) {
          var completition = now(),
              index = 0;

          _this[GENERATOR](function (value) {
            var delay = delayer(value, index++, context.data),
                estimation = undefined;

            if (isDate(delay)) {
              estimation = delay;
              delay = delay - now();
            } else estimation = now() + delay;

            if (completition < estimation) completition = estimation;
            setTimeout(function () {
              return next(value);
            }, delay < 0 ? 0 : delay);
          }, function (error) {
            completition -= now();
            setTimeout(function () {
              return done(error);
            }, completition < 0 ? 0 : completition);
          }, context);
        });
      }
    }, {
      key: 'dump',
      value: function dump(prefix, logger) {
        var _this2 = this;

        if (isFunction(prefix)) {
          logger = prefix;
          prefix = '';
        } else {
          if (!isFunction(logger)) logger = console.log.bind(console);
          prefix = isNothing(prefix) ? '' : prefix + ' ';
        }

        return new Aeroflow(function (next, done, context) {
          return _this2[GENERATOR](function (value) {
            logger(prefix + 'next', value);
            next(value);
          }, function (error) {
            error ? logger(prefix + 'done', error) : logger(prefix + 'done');
            done(error);
          }, context);
        });
      }
    }, {
      key: 'every',
      value: function every(condition) {
        var _this3 = this;

        var predicate = makePredicate(condition);
        return new Aeroflow(function (next, done, context) {
          var empty = true,
              result = true;
          context = context.spawn();

          _this3[GENERATOR](function (value) {
            empty = false;

            if (!predicate(value)) {
              result = false;
              context(false);
            }
          }, function (error) {
            next(result && !empty);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'filter',
      value: function filter(condition) {
        var _this4 = this;

        var predicate = makePredicate(predicate);
        return new Aeroflow(function (next, done, context) {
          var index = 0;

          _this4[GENERATOR](function (value) {
            return predicate(value, index++, context.data) ? next(value) : false;
          }, done, context);
        });
      }
    }, {
      key: 'first',
      value: function first() {
        var _this5 = this;

        return new Aeroflow(function (next, done, context) {
          context = context.spawn();

          _this5[GENERATOR](function (value) {
            next(value);
            context(false);
          }, done, context);
        });
      }
    }, {
      key: 'join',
      value: function join(separator) {
        var joiner = isNothing(separator) ? ',' : isFunction(separator) ? separator : '' + separator;
        return this.reduce(function (result, value) {
          return result.length ? result + joiner() + value : value;
        }, '');
      }
    }, {
      key: 'last',
      value: function last() {
        var _this6 = this;

        return new Aeroflow(function (next, done, context) {
          var empty = true,
              result = undefined;

          _this6[GENERATOR](function (value) {
            empty = false;
            result = value;
          }, function (error) {
            if (!empty) next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'map',
      value: function map(mapping) {
        var _this7 = this;

        var mapper = makeMapper(mapping);
        return new Aeroflow(function (next, done, context) {
          var index = 0;

          _this7[GENERATOR](function (value) {
            return next(mapper(value, index++, context.data));
          }, done, context);
        });
      }
    }, {
      key: 'max',
      value: function max() {
        return this.reduce(function (max, value) {
          return value > max ? value : max;
        });
      }
    }, {
      key: 'memoize',
      value: function memoize(expiration) {
        var _this8 = this;

        var cache = undefined,
            expirator = isFunction(expiration) ? expiration : isNumber(expiration) ? function () {
          return expiration;
        } : function () {
          return maxInteger;
        };
        return new Aeroflow(function (next, done, context) {
          if (cache) {
            cache.forEach(next);
            done();
            return;
          }

          cache = [];

          _this8[GENERATOR](function (value) {
            cache.push(value);
            next(value);
          }, function (error) {
            setTimeout(function () {
              cache = null;
            }, expirator(context.data));
            done(error);
          }, context);
        });
      }
    }, {
      key: 'mean',
      value: function mean() {
        var array = this.toArray();
        return new Aeroflow(function (next, done, context) {
          return array[GENERATOR](function (values) {
            if (values.length) {
              values.sort();
              next(values[floor(values.length / 2)]);
            }
          }, done, context);
        });
      }
    }, {
      key: 'min',
      value: function min(valueSelector) {
        return this.reduce(function (min, value) {
          return value < min ? value : min;
        });
      }
    }, {
      key: 'reduce',
      value: function reduce(mapping, seed) {
        var _this9 = this;

        var reducer = makeMapper(mapping);
        return new Aeroflow(function (next, done, context) {
          var empty = true,
              index = 0,
              result = undefined;

          if (isSomething(seed)) {
            empty = false;
            result = seed;
          }

          _this9[GENERATOR](function (value) {
            if (empty) {
              empty = false;
              index++;
              result = value;
            } else result = reducer(result, value, index++, context.data);
          }, function (error) {
            if (!empty) next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'run',
      value: function run(next, done, data) {
        var _this10 = this;

        var context = makeContext(data);
        if (!isFunction(done)) done = noop;
        if (!isFunction(next)) next = noop;
        setTimeout(function () {
          return _this10[GENERATOR](next, function (error) {
            context(false);
            error ? done(error) : done();
          }, context);
        }, 0);
        return this;
      }
    }, {
      key: 'skip',
      value: function skip(condition) {
        var _this11 = this;

        if (isNothing(condition)) return new Aeroflow(function (next, done, context) {
          return _this11[GENERATOR](function (value) {}, done, context);
        });
        var limiter = makeLimiter(condition);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              limited = true;

          _this11[GENERATOR](function (value) {
            if (limited && !limiter(value, index++, context.data)) limited = false;
            if (!limited) next(value);
          }, done, context);
        });
      }
    }, {
      key: 'some',
      value: function some(predicate) {
        var _this12 = this;

        predicate = makePredicate(predicate);
        return new Aeroflow(function (next, done, context) {
          var result = false;
          context = context.spawn();

          _this12[GENERATOR](function (value) {
            if (predicate(value)) {
              result = true;
              context(false);
            }
          }, function (error) {
            next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'sort',
      value: function sort(comparer) {
        var array = this.toArray();
        return new Aeroflow(function (next, done, context) {
          return array[GENERATOR](function (values) {
            return values.length ? values.sort(comparer).forEach(next) : false;
          }, done, context);
        });
      }
    }, {
      key: 'sum',
      value: function sum() {
        return this.reduce(function (result, value) {
          return result + value;
        }, 0);
      }
    }, {
      key: 'take',
      value: function take(condition) {
        var _this13 = this;

        if (isNothing(condition)) return this;
        var limiter = makeLimiter(condition);
        return new Aeroflow(function (next, done, context) {
          var index = 0;
          context = context.spawn();

          _this13[GENERATOR](function (value) {
            return limiter(value, index++, context.data) ? next(value) : context(false);
          }, done, context);
        });
      }
    }, {
      key: 'tap',
      value: function tap(callback) {
        var _this14 = this;

        return isFunction(callback) ? new Aeroflow(function (next, done, context) {
          var index = 0;

          _this14[GENERATOR](function (value) {
            callback(value, index++, context.data);
            next(value);
          }, done, context);
        }) : this;
      }
    }, {
      key: 'timedelta',
      value: function timedelta() {
        var _this15 = this;

        return new Aeroflow(function (next, done, context) {
          var past = now();

          _this15[GENERATOR](function (value) {
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
        var _this16 = this;

        return new Aeroflow(function (next, done, context) {
          return _this16[GENERATOR](function (value) {
            return next({
              timestamp: now(),
              value: value
            });
          }, done, context);
        });
      }
    }, {
      key: 'toArray',
      value: function toArray(mapping) {
        var _this17 = this;

        var mapper = makeMapper(mapping);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = [];

          _this17[GENERATOR](function (value) {
            return result.push(mapper(value, index++, context.data));
          }, function (error) {
            next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'toSet',
      value: function toSet(mapping) {
        var _this18 = this;

        var mapper = makeMapper(mapping);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = new Set();

          _this18[GENERATOR](function (value) {
            return result.add(mapper(value, index++, context.data));
          }, function (error) {
            next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'toMap',
      value: function toMap(keyMapper, valueMapper) {
        var _this19 = this;

        keyMapper = isNothing(keyMapper) ? function (value) {
          return isArray(value) && 2 === value.length ? value[0] : value;
        } : isFunction(keyMapper) ? keyMapper : function () {
          return keyMapper;
        };
        valueMapper = isNothing(valueMapper) ? function (value) {
          return isArray(value) && 2 === value.length ? value[1] : value;
        } : isFunction(valueMapper) ? valueMapper : function () {
          return valueMapper;
        };
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = new Map();

          _this19[GENERATOR](function (value) {
            return result.set(keyMapper(value, index, context.data), valueMapper(value, index++, context.data));
          }, function (error) {
            next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'unique',
      value: function unique() {
        var _this20 = this;

        return new Aeroflow(function (next, done, context) {
          var values = new Set();

          _this20[GENERATOR](function (value) {
            var size = values.size;
            values.add(value);
            if (size < values.size) next(value);
          }, done, context);
        });
      }
    }]);

    return Aeroflow;
  })();

  var empty = new Aeroflow(function (next, done) {
    return done();
  });

  function aeroflow(source) {
    if (isAeroflow(source)) return source;
    if (isArray(source)) return fromArray(source);
    if (isFunction(source)) return fromFunction(source);
    if (isPromise(source)) return fromPromise(source);
    if (isIterable(source)) return fromIterable(source);
    return aeroflow.just(source);
  }

  function _concat() {
    for (var _len2 = arguments.length, flows = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      flows[_key2] = arguments[_key2];
    }

    var queue = [].concat(flows);
    return new Aeroflow(function (next, done, context) {
      !(function proceed() {
        queue.length ? aeroflow(queue.shift())[GENERATOR](next, proceed, context) : done();
      })();
    });
  }

  function create(generator) {
    return isFunction(generator) ? new Aeroflow(generator) : empty;
  }

  function expand(callback, seed, limit) {
    limit = limit || maxInteger;
    var expander = isFunction(callback) ? callback : identity;
    return new Aeroflow(function (next, done, context) {
      var counter = limit,
          index = 0,
          value = seed;

      while (0 < counter-- && context()) {
        next(value = expander(value, index++, context.data));
      }

      done();
    });
  }

  function fromArray(source) {
    return new Aeroflow(function (next, done, context) {
      var index = -1;

      while (context() && ++index < source.length) {
        next(source[index]);
      }

      done();
    });
  }

  function fromFunction(source) {
    return new Aeroflow(function (next, done, context) {
      return aeroflow(source())[GENERATOR](next, done, context);
    });
  }

  function fromIterable(source) {
    return new Aeroflow(function (next, done, context) {
      var iterator = source[ITERATOR]();

      while (context()) {
        var result = iterator.next();
        if (result.done) break;else next(result.value);
      }

      done();
    });
  }

  function fromPromise(source) {
    return new Aeroflow(function (next, done, context) {
      return source.then(function (value) {
        return aeroflow(value)[GENERATOR](next, done, context);
      }, function (error) {
        done(error);
        throwError(error);
      });
    });
  }

  function just(value) {
    return new Aeroflow(function (next, done) {
      next(value);
      done();
    });
  }

  function random(min, max, limit) {
    limit = limit || maxInteger;
    min = +min || 0;
    max = +max || 1;
    max -= min;
    return isInteger(min) && isInteger(max) ? new Aeroflow(function (next, done, context) {
      var counter = limit;

      while (0 < counter-- && context()) {
        next(floor(min + max * Math.random()));
      }

      done();
    }) : new Aeroflow(function (next, done, context) {
      var counter = limit;

      while (0 < counter-- && context()) {
        next(min + max * Math.random());
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

  function repeat(repeater, limit) {
    limit = limit || maxInteger;
    return isFunction(repeater) ? new Aeroflow(function (next, done, context) {
      var counter = limit;
      proceed();

      function onDone(error) {
        if (error) {
          done();
          throwError(error);
        } else if (counter && context()) setTimeout(proceed, 0);else done();
      }

      function proceed() {
        if (0 < counter--) {
          var result = context() && repeater(context.data);
          if (result === false) done();else aeroflow(result)[GENERATOR](next, onDone, context);
        } else done();
      }
    }) : new Aeroflow(function (next, done, context) {
      var counter = limit;

      while (0 < counter-- && context()) {
        next(repeater);
      }

      done();
    });
  }

  module.exports = defineProperties(aeroflow, {
    concat: {
      value: _concat
    },
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
