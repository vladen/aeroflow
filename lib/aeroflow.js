'use strict';

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
      EMITTER = Symbol('emitter'),
      classof = Object.classof,
      defineProperties = Object.defineProperties,
      floor = Math.floor,
      now = Date.now,
      maxInteger = Number.MAX_SAFE_INTEGER,
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
      isSomething = function isSomething(value) {
    return null != value;
  },
      noop = function noop() {};

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

  function makeLimiter(limiter) {
    return isNumber(limiter) ? function (_, index) {
      return index < limiter;
    } : isFunction(limiter) ? limiter : function () {
      return true;
    };
  }

  function makeMapper(mapper) {
    return isFunction(mapper) ? mapper : identity;
  }

  function makePredicate(predicate) {
    return isNothing(predicate) ? isSomething : isFunction(predicate) ? predicate : isRegExp(predicate) ? function (value) {
      return predicate.test(value);
    } : function (value) {
      return value === predicate;
    };
  }

  function throwError(error) {
    throw isError(error) ? error : new Error(error);
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

          _this[EMITTER](function (value) {
            var delay = delayer(value, index++, context.data),
                estimation = undefined;

            if (isDate(delay)) {
              estimation = delay;
              delay = delay - now();
            } else estimation = now() + delay;

            if (completition < estimation) completition = estimation;
            delay < 0 ? setImmediate(function () {
              return next(value);
            }) : setTimeout(function () {
              return next(value);
            }, delay);
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
          return _this2[EMITTER](function (value) {
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

          _this3[EMITTER](function (value) {
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

          _this4[EMITTER](function (value) {
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

          _this5[EMITTER](function (value) {
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

          _this6[EMITTER](function (value) {
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
      value: function map(mapper) {
        var _this7 = this;

        mapper = makeMapper(mapper);
        return new Aeroflow(function (next, done, context) {
          var index = 0;

          _this7[EMITTER](function (value) {
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
      key: 'mean',
      value: function mean() {
        var array = this.toArray();
        return new Aeroflow(function (next, done, context) {
          return array[EMITTER](function (values) {
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
      value: function reduce(reducer, seed) {
        var _this8 = this;

        reducer = makeMapper(reducer);
        return new Aeroflow(function (next, done, context) {
          var empty = true,
              index = 0,
              result = undefined;

          if (isSomething(seed)) {
            empty = false;
            result = seed;
          }

          _this8[EMITTER](function (value) {
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
        var _this9 = this;

        var context = makeContext(data);
        if (!isFunction(done)) done = noop;
        if (!isFunction(next)) next = noop;
        setImmediate(function () {
          return _this9[EMITTER](next, function (error) {
            context(false);
            error ? done(error) : done();
          }, context);
        });
        return this;
      }
    }, {
      key: 'share',
      value: function share(expiration) {
        var _this10 = this;

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

          _this10[EMITTER](function (value) {
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
      key: 'skip',
      value: function skip(condition) {
        var _this11 = this;

        if (isNothing(condition)) return new Aeroflow(function (next, done, context) {
          return _this11[EMITTER](function (value) {}, done, context);
        });
        var limiter = makeLimiter(condition);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              limited = true;

          _this11[EMITTER](function (value) {
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

          _this12[EMITTER](function (value) {
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
          return array[EMITTER](function (values) {
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

          _this13[EMITTER](function (value) {
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

          _this14[EMITTER](function (value) {
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

          _this15[EMITTER](function (value) {
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
          return _this16[EMITTER](function (value) {
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
        var _this17 = this;

        mapper = makeMapper(mapper);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = [];

          _this17[EMITTER](function (value) {
            return result.push(mapper(value, index++, context.data));
          }, function (error) {
            next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'toSet',
      value: function toSet(mapper) {
        var _this18 = this;

        mapper = makeMapper(mapper);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = new Set();

          _this18[EMITTER](function (value) {
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

        keyMapper = isFunction(keyMapper) ? keyMapper : function (value) {
          return isArray(value) && 2 === value.length ? value[0] : value;
        };
        valueMapper = isFunction(valueMapper) ? valueMapper : function (value) {
          return isArray(value) && 2 === value.length ? value[1] : value;
        };
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = new Map();

          _this19[EMITTER](function (value) {
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

          _this20[EMITTER](function (value) {
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
        queue.length ? aeroflow(queue.shift())[EMITTER](next, proceed, context) : done();
      })();
    });
  }

  function create(emitter) {
    return isFunction(emitter) ? new Aeroflow(function (next, done, context) {
      var completed = false;
      emitter(function (value) {
        if (context()) next();
      }, function (error) {
        if (!completed) {
          completed = true;
          done();
          context(false);
        }
      });
    }) : empty;
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
      return aeroflow(source())[EMITTER](next, done, context);
    });
  }

  function fromIterable(source) {
    return new Aeroflow(function (next, done, context) {
      var iterator = source[Symbol.iterator]();

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
        return aeroflow(value)[EMITTER](next, done, context);
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
        } else if (counter && context()) setImmediate(proceed);else done();
      }

      function proceed() {
        if (0 < counter--) {
          var result = context() && repeater(context.data);
          if (result === false) done();else aeroflow(result)[EMITTER](next, onDone, context);
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

  exports.default = defineProperties(aeroflow, {
    concat: { value: _concat },
    create: { value: create },
    empty: { value: empty },
    expand: { value: expand },
    just: { value: just },
    random: { value: random },
    range: { value: range },
    repeat: { value: repeat }
  });
  module.exports = exports['default'];
});
