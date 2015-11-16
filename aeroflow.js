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

  var defineProperty = Object.defineProperty,
      defineProperties = Object.defineProperties,
      floor = Math.floor,
      maxInteger = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1,
      now = Date.now,
      toStringTag = Object.prototype.toString,
      identity = function identity(value) {
    return value;
  },
      isArray = typeof Array.isArray === 'function' ? Array.isArray : function (value) {
    return toStringTag.call(value) === '[object Array]';
  },
      isDate = function isDate(value) {
    return toStringTag.call(value) === '[object Date]';
  },
      isError = function isError(value) {
    return toStringTag.call(value) === '[object Error]';
  },
      isFunction = function isFunction(value) {
    return typeof value === 'function';
  },
      isInteger = typeof Number.isInteger === 'function' ? Number.isInteger : function (value) {
    return typeof value === 'number' && isFinite(value) && floor(value) === value;
  },
      isNothing = function isNothing(value) {
    return value == null;
  },
      isNumber = function isNumber(value) {
    return typeof value === 'number' || toStringTag.call(value) === '[object Number]';
  },
      isObject = function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  },
      isPromise = function isPromise(value) {
    return toStringTag.call(value) === '[object Promise]';
  },
      isRegExp = function isRegExp(value) {
    return toStringTag.call(value) === '[object RegExp]';
  },
      isSomething = function isSomething(value) {
    return value != null;
  },
      isString = function isString(value) {
    return typeof value === 'string' || toStringTag.call(value) === '[object String]';
  },
      noop = function noop() {},
      GENERATOR = 'generator',
      ITERATOR = typeof Symbol === 'function' ? Symbol.iterator : 'iterator';

  function makeCallback(callback) {
    return isFunction(callback) ? callback : noop;
  }

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

  function makeDelayer(condition) {
    return isFunction(condition) ? condition : function () {
      return condition;
    };
  }

  function makeExpirator(condition) {
    return isFunction(condition) ? condition : isNumber(condition) ? function () {
      return condition;
    } : function () {
      return maxInteger;
    };
  }

  function makeJoiner(separator) {
    return isNothing(separator) ? ',' : isFunction(separator) ? separator : '' + separator;
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
      _classCallCheck(this, Aeroflow);

      defineProperty(this, GENERATOR, {
        value: generator
      });
    }

    _createClass(Aeroflow, [{
      key: 'after',
      value: function after(flow) {
        var _this = this;

        flow = aeroflow(flow);
        return new Aeroflow(function (next, done, context) {
          var completed = false,
              happened = false,
              values = [];
          flow[GENERATOR](noop, happen, makeContext());

          _this[GENERATOR](function (value) {
            return happened ? next(value) : values.push(value);
          }, function (error) {
            if (happened || !context()) done(error);else {
              completed = true;
              values.error = error;
            }
          }, context);

          function happen() {
            if (!context()) return;
            happened = true;
            values.forEach(next);
            if (completed) done(values.error);
          }
        });
      }
    }, {
      key: 'concat',
      value: function concat() {
        for (var _len = arguments.length, flows = Array(_len), _key = 0; _key < _len; _key++) {
          flows[_key] = arguments[_key];
        }

        var queue = [this].concat(flows);
        return new Aeroflow(function (next, done, context) {
          !(function proceed() {
            queue.length ? aeroflow(queue.shift())[GENERATOR](next, proceed, context) : done();
          })();
        });
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
        var _this2 = this;

        var delayer = makeDelayer(condition);
        return new Aeroflow(function (next, done, context) {
          var completition = now(),
              index = 0;

          _this2[GENERATOR](function (value) {
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
        var _this3 = this;

        if (isFunction(prefix)) {
          logger = prefix;
          prefix = '';
        } else {
          if (!isFunction(logger)) logger = console.log.bind(console);
          prefix = isNothing(prefix) ? '' : prefix + ' ';
        }

        return new Aeroflow(function (next, done, context) {
          return _this3[GENERATOR](function (value) {
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
        var _this4 = this;

        var predicate = makePredicate(condition);
        return new Aeroflow(function (next, done, context) {
          var empty = true,
              result = true;
          context = context.spawn();

          _this4[GENERATOR](function (value) {
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
        var _this5 = this;

        var predicate = makePredicate(predicate);
        return new Aeroflow(function (next, done, context) {
          var index = 0;

          _this5[GENERATOR](function (value) {
            return predicate(value, index++, context.data) ? next(value) : false;
          }, done, context);
        });
      }
    }, {
      key: 'first',
      value: function first() {
        var _this6 = this;

        return new Aeroflow(function (next, done, context) {
          context = context.spawn();

          _this6[GENERATOR](function (value) {
            next(value);
            context(false);
          }, done, context);
        });
      }
    }, {
      key: 'join',
      value: function join(separator) {
        var joiner = makeJoiner(separator);
        return this.reduce(function (result, value) {
          return result.length ? result + joiner() + value : value;
        }, '');
      }
    }, {
      key: 'last',
      value: function last() {
        var _this7 = this;

        return new Aeroflow(function (next, done, context) {
          var empty = true,
              result = undefined;

          _this7[GENERATOR](function (value) {
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
        var _this8 = this;

        var mapper = makeMapper(mapping);
        return new Aeroflow(function (next, done, context) {
          var index = 0;

          _this8[GENERATOR](function (value) {
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
        var _this9 = this;

        var cache = undefined,
            expirator = makeExpirator(expiration);
        return new Aeroflow(function (next, done, context) {
          if (cache) {
            cache.forEach(next);
            done();
            return;
          }

          cache = [];

          _this9[GENERATOR](function (value) {
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
        var _this10 = this;

        var reducer = makeMapper(mapping);
        return new Aeroflow(function (next, done, context) {
          var empty = true,
              index = 0,
              result = undefined;

          if (isSomething(seed)) {
            empty = false;
            result = seed;
          }

          _this10[GENERATOR](function (value) {
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
        var _this11 = this;

        var context = makeContext(data),
            nextCallback = makeCallback(next),
            doneCallback = makeCallback(done);
        setTimeout(function () {
          return _this11[GENERATOR](nextCallback, function (error) {
            context(false);
            error ? doneCallback(error) : doneCallback();
          }, context);
        }, 0);
        return this;
      }
    }, {
      key: 'skip',
      value: function skip(condition) {
        var _this12 = this;

        var limiter = makeLimiter(condition);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              limited = true;

          _this12[GENERATOR](function (value) {
            if (limited && !limiter(value, index++, context.data)) limited = false;
            if (!limited) next(value);
          }, done, context);
        });
      }
    }, {
      key: 'some',
      value: function some(predicate) {
        var _this13 = this;

        predicate = makePredicate(predicate);
        return new Aeroflow(function (next, done, context) {
          var result = false;
          context = context.spawn();

          _this13[GENERATOR](function (value) {
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
        var _this14 = this;

        var limiter = makeLimiter(condition);
        return new Aeroflow(function (next, done, context) {
          var index = 0;
          context = context.spawn();

          _this14[GENERATOR](function (value) {
            return limiter(value, index++, context.data) ? next(value) : context(false);
          }, done, context);
        });
      }
    }, {
      key: 'tap',
      value: function tap(callback) {
        var _this15 = this;

        return isFunction(callback) ? new Aeroflow(function (next, done, context) {
          var index = 0;

          _this15[GENERATOR](function (value) {
            callback(value, index++, context.data);
            next(value);
          }, done, context);
        }) : this;
      }
    }, {
      key: 'timedelta',
      value: function timedelta() {
        var _this16 = this;

        return new Aeroflow(function (next, done, context) {
          var past = now();

          _this16[GENERATOR](function (value) {
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
        var _this17 = this;

        return new Aeroflow(function (next, done, context) {
          return _this17[GENERATOR](function (value) {
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
        var _this18 = this;

        var mapper = makeMapper(mapping);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = [];

          _this18[GENERATOR](function (value) {
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
        var _this19 = this;

        var mapper = makeMapper(mapping);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = new Set();

          _this19[GENERATOR](function (value) {
            return result.add(mapper(value, index++, context.data));
          }, function (error) {
            next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'toMap',
      value: function toMap(keyMapping, valueMapping) {
        var _this20 = this;

        var keyMapper = makeMapper(keyMapping),
            valueMapper = makeMapper(valueMapping);
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              result = new Map();

          _this20[GENERATOR](function (value) {
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
        var _this21 = this;

        return new Aeroflow(function (next, done, context) {
          var values = new Set();

          _this21[GENERATOR](function (value) {
            var size = values.size;
            values.add(value);
            if (size < values.size) next(value);
          }, done, context);
        });
      }
    }]);

    return Aeroflow;
  })();

  function aeroflow(source) {
    if (source instanceof Aeroflow) return source;
    if (isArray(source)) return new Aeroflow(function (next, done, context) {
      var index = -1;

      while (context() && ++index < source.length) {
        next(source[index]);
      }

      done();
    });
    if (isFunction(source)) return new Aeroflow(function (next, done, context) {
      return aeroflow(source())[GENERATOR](next, done, context);
    });
    if (isPromise(source)) return new Aeroflow(function (next, done, context) {
      return source.then(function (value) {
        return aeroflow(value)[GENERATOR](next, done, context);
      }, function (error) {
        done(error);
        throwError(error);
      });
    });
    if (isObject(source) && ITERATOR in source) return new Aeroflow(function (next, done, context) {
      var iterator = source[ITERATOR]();

      while (context()) {
        var result = iterator.next();
        if (result.done) break;else next(result.value);
      }

      done();
    });
    return aeroflow.just(source);
  }

  function create(generator) {
    return new Aeroflow(isFunction(generator) ? generator : function (next, done) {
      return done();
    });
  }

  function expand(generator, seed) {
    var expander = isFunction(generator) ? generator : identity;
    return new Aeroflow(function (next, done, context) {
      var index = 0,
          value = seed;

      while (context()) {
        next(value = expander(value, index++, context.data));
      }

      done();
    });
  }

  function just(value) {
    return new Aeroflow(function (next, done) {
      next(value);
      done();
    });
  }

  function random(min, max) {
    if (isNothing(min)) {
      if (isNothing(max)) return new Aeroflow(function (next, done, context) {
        while (context()) {
          next(Math.random());
        }

        done();
      });else if (isNaN(max = +max)) throwError('Argument "max" must be a number');
      min = 0;
    }

    if (isNothing(max)) max = maxInteger;
    if (min >= max) throwError('Argument "min" must be greater then "max".');
    max -= min;
    var round = isInteger(min) && isInteger(max) ? floor : identity;
    return new Aeroflow(function (next, done, context) {
      while (context()) {
        next(round(min + max * Math.random()));
      }

      done();
    });
  }

  function range(start, end, step) {
    if (isNaN(end = +end)) end = maxInteger;
    if (isNaN(start = +start)) start = 0;
    if (isNaN(step = +step)) step = start < end ? 1 : -1;
    if (start === end) return just(start);
    return new Aeroflow(function (next, done, context) {
      var i = start - step;
      if (start < end) while (context() && (i += step) <= end) {
        next(i);
      } else while (context() && (i += step) >= end) {
        next(i);
      }
      done();
    });
  }

  function repeat(repeater) {
    if (isFunction(repeater)) return new Aeroflow(function (next, done, context) {
      !(function proceed() {
        var result = context() && repeater(context.data);
        if (result === false) done();else aeroflow(result)[GENERATOR](next, function (error) {
          if (error) {
            done();
            throwError(error);
          } else if (context()) setTimeout(proceed, 0);else done();
        }, context);
      })();
    });
    return new Aeroflow(function (next, done, context) {
      while (context()) {
        next(repeater);
      }

      done();
    });
  }

  module.exports = defineProperties(aeroflow, {
    create: {
      value: create
    },
    empty: {
      value: new Aeroflow(function (next, done) {
        return done();
      })
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
