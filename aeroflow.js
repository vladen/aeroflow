/*
  aeroflow([1, 2, 3]).sum().dump().run()
  aeroflow.range(1, 10).skip(1).take(2).delay(500).dump().run()
  aeroflow.range(1, 10).delay(100).count().dump().run()
  aeroflow([1, 2, 3]).concat(aeroflow.repeat().delay(100).take(5)).dump().run()
  operators pending implementation:
    * buffer(count)
    * zip(thatFlow)
    * groupBy(keySelector, valueSelector)
    * scan(scanner, seed)
    * window(interval)
    * debounce(interval, mode)
    * throttle(interval)
    * at(index)
    * skip(-index) -> skipLast
    * skip(condition) -> skipWhile
    * take(-index) -> takeLast
    * take(condition) -> takeWhile
    * fork(selector, leftCallback, rightCallback)
    * merge(thatFlow)
    * after(interval/condition)
    * pause/resume
    * materialize
    * amb
    * avg, min, max
*/

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

  var BUSY = Symbol('busy'),
      GENERATOR = Symbol('generator'),
      ITERATOR = Symbol.iterator,
      PARAMETERS = Symbol('parameters'),
      defineProperty = Object.defineProperty,
      floor = Math.floor,
      identity = function identity(value) {
    return value;
  },
      isArray = function isArray(value) {
    return Array.isArray(value);
  },
      isDate = function isDate(value) {
    return value instanceof Date;
  },
      isFunction = function isFunction(value) {
    return typeof value === 'function';
  },
      isInteger = Number.isInteger,
      isNothing = function isNothing(value) {
    return value == null;
  },
      isNumber = function isNumber(value) {
    return typeof value === 'number' || value instanceof Number;
  },
      isObject = function isObject(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
  },
      isPromise = function isPromise(value) {
    return value instanceof Promise;
  },
      isSomething = function isSomething(value) {
    return value != null;
  },
      isString = function isString(value) {
    return typeof value === 'string' || value instanceof String;
  },
      maxInteger = Number.MAX_SAFE_INTEGER,
      noop = function noop() {},
      now = Date.now,
      typeError = function typeError(message) {
    return new TypeError(message);
  };

  var Context = (function () {
    function Context(parameters) {
      _classCallCheck(this, Context);

      this[BUSY] = true;
      this[PARAMETERS] = parameters;
    }

    _createClass(Context, [{
      key: 'stop',
      value: function stop() {
        this[BUSY] = false;
      }
    }, {
      key: 'busy',
      get: function get() {
        return this[BUSY];
      }
    }]);

    return Context;
  })();

  var Aeroflow = (function () {
    function Aeroflow(generator) {
      _classCallCheck(this, Aeroflow);

      defineProperty(this, GENERATOR, {
        value: generator
      });
    }

    _createClass(Aeroflow, [{
      key: 'concat',
      value: function concat() {
        var _this = this;

        for (var _len = arguments.length, flows = Array(_len), _key = 0; _key < _len; _key++) {
          flows[_key] = arguments[_key];
        }

        flows = flows.map(aeroflow);
        return new Aeroflow(function (next, done, context) {
          _this[GENERATOR](next, proceed, context);

          function proceed() {
            flows.length ? flows.shift()[GENERATOR](next, proceed, context) : done();
          }
        });
      }
    }, {
      key: 'count',
      value: function count() {
        return this.reduce(function (count) {
          return count + 1;
        }, 0);
      }
    }, {
      key: 'delay',
      value: function delay(interval) {
        var _this2 = this;

        if (isNothing(interval)) interval = 0;else if (isNaN(interval = +interval) || interval < 0) throw typeError('Argument "interval" must be non-negative number.');
        return new Aeroflow(function (next, done, context) {
          return _this2[GENERATOR](function (value) {
            return setTimeout(function () {
              return next(value);
            }, interval);
          }, done, context);
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
          if (isNothing(logger)) logger = console.log.bind(console);else if (!isFunction(logger)) throw typeError('Argument "logger" must be a function.');
          prefix = isNothing(prefix) ? '' : prefix + ' ';
        }

        return new Aeroflow(function (next, done, context) {
          return _this3[GENERATOR](function (value) {
            logger(prefix + 'next', value);
            next(value);
          }, function () {
            logger(prefix + 'done');
            done();
          }, context);
        });
      }
    }, {
      key: 'every',
      value: function every(predicate) {
        var _this4 = this;

        if (!isFunction(predicate)) predicate = isSomething;
        return new Aeroflow(function (next, done, context) {
          var empty = true,
              result = true;

          _this4[GENERATOR](function (value) {
            empty = false;

            if (!predicate(value)) {
              result = false;
              context.stop();
            }
          }, function () {
            next(result && !empty);
            done();
          }, context);
        });
      }
    }, {
      key: 'filter',
      value: function filter(predicate) {
        var _this5 = this;

        if (!isFunction(predicate)) predicate = isSomething;
        return new Aeroflow(function (next, done, context) {
          var index = 0;

          _this5[GENERATOR](function (value) {
            return predicate(value, index++) ? next(value) : false;
          }, done, context);
        });
      }
    }, {
      key: 'first',
      value: function first() {
        var _this6 = this;

        return new Aeroflow(function (next, done, context) {
          return _this6[GENERATOR](function (value) {
            next(value);
            context.stop();
          }, done, context);
        });
      }
    }, {
      key: 'join',
      value: function join(separator) {
        if (isNothing(separator)) separator = ',';else if (!isString(separator)) separator = '' + separator;
        return this.reduce(function (result, value) {
          return result.length ? result + separator + value : value;
        }, '');
      }
    }, {
      key: 'last',
      value: function last() {
        var _this7 = this;

        return new Aeroflow(function (next, done, context) {
          var empty = true,
              last = undefined;

          _this7[GENERATOR](function (value) {
            empty = false;
            last = value;
          }, function () {
            if (!empty) next(last);
            done();
          }, context);
        });
      }
    }, {
      key: 'map',
      value: function map(transform) {
        var _this8 = this;

        if (isNothing(transform)) transform = identity;else if (!isFunction(transform)) throw typeError('Argument "transform" must be a function.');
        return new Aeroflow(function (next, done, context) {
          var index = 0;

          _this8[GENERATOR](function (value) {
            return next(transform(value, index++));
          }, done, context);
        });
      }
    }, {
      key: 'max',
      value: function max(valueSelector) {
        return this.reduce(function (max, value) {
          return value > max ? value : max;
        });
      }
    }, {
      key: 'memoize',
      value: function memoize(expires) {
        var _this9 = this;

        if (isNothing(expires)) expires = 9e9;else if (isDate(expires)) expires = expires.valueOf();else if (isNaN(expires = +expires) || expires < 0) throw typeError('Argument "expires" must be a date or a positive number.');
        var cache = undefined;
        return new Aeroflow(function (next, done, context) {
          if (cache) {
            cache.forEach(next);
            done();
          } else {
            cache = [];
            setTimeout(function () {
              return cache = null;
            }, expires);

            _this9[GENERATOR](function (value) {
              cache.push(value);
              next(value);
            }, done, context);
          }
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
      value: function reduce(reducer, seed) {
        var _this10 = this;

        if (!isFunction(reducer)) reducer = noop;
        var seeded = arguments.length > 1;
        return new Aeroflow(function (next, done, context) {
          var index = 0,
              inited = false,
              result = undefined;

          if (seeded) {
            result = seed;
            inited = true;
          } else index = 1;

          _this10[GENERATOR](function (value) {
            if (inited) result = reducer(result, value, index++);else {
              result = value;
              inited = true;
            }
          }, function () {
            if (inited) next(result);
            done();
          }, context);
        });
      }
    }, {
      key: 'run',
      value: function run(onNext, onDone) {
        for (var _len2 = arguments.length, parameters = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          parameters[_key2 - 2] = arguments[_key2];
        }

        var _this11 = this;

        if (isNothing(onNext)) onNext = noop;else if (!isFunction(onNext)) throw typeError('Argument "onNext" must be a function.');
        if (isNothing(onDone)) onDone = noop;else if (!isFunction(onDone)) throw typeError('Argument "onDone" must be a function.');
        setTimeout(function () {
          return _this11[GENERATOR](onDone, onNext, new Context(parameters));
        }, 0);
        return this;
      }
    }, {
      key: 'skip',
      value: function skip(count) {
        var _this12 = this;

        if (isNaN(count = +count)) throw typeError('Argument "count" must be a number.');
        return new Aeroflow(function (next, done, context) {
          var counter = count;

          _this12[GENERATOR](function (value) {
            if (--counter < 0) next(value);
          }, done, context);
        });
      }
    }, {
      key: 'some',
      value: function some(predicate) {
        var _this13 = this;

        if (!isFunction(predicate)) predicate = isSomething;
        return new Aeroflow(function (next, done, context) {
          var result = false;

          _this13[GENERATOR](function (value) {
            if (predicate(value)) {
              result = true;
              context.stop();
            }
          }, function () {
            next(result);
            done();
          }, context);
        });
      }
    }, {
      key: 'sum',
      value: function sum(valueSelector) {
        return this.reduce(function (sum, value) {
          return sum + value;
        }, 0);
      }
    }, {
      key: 'take',
      value: function take(count) {
        var _this14 = this;

        if (isNaN(count = +count)) throw typeError('Argument "count" must be a number.');
        return new Aeroflow(function (next, done, context) {
          var counter = count;
          counter > 0 ? _this14[GENERATOR](function (value) {
            return counter-- > 0 ? next(value) : context.stop();
          }, done, context) : context.stop();
        });
      }
    }, {
      key: 'tap',
      value: function tap(callback) {
        var _this15 = this;

        if (!isFunction(callback)) callback = noop;
        return new Aeroflow(function (next, done, context) {
          var index = 0;

          _this15[GENERATOR](function (value) {
            callback(value, index++);
            next(value);
          }, done, context);
        });
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
      value: function toArray() {
        var _this18 = this;

        return new Aeroflow(function (next, done, context) {
          var array = [];

          _this18[GENERATOR](function (value) {
            return array.push(value);
          }, function () {
            next(array);
            done();
          }, context);
        });
      }
    }, {
      key: 'toSet',
      value: function toSet(keySelector) {
        var _this19 = this;

        if (isNothing(keySelector)) keySelector = identity;else if (!isFunction(keySelector)) throw typeError('Argument "keySelector" must be a function.');
        return new Aeroflow(function (next, done, context) {
          var set = new Set();

          _this19[GENERATOR](function (value) {
            return set.add(keySelector(value));
          }, function () {
            next(set);
            done();
          }, context);
        });
      }
    }, {
      key: 'toMap',
      value: function toMap(keySelector, valueSelector) {
        var _this20 = this;

        if (isNothing(keySelector)) keySelector = identity;else if (!isFunction(keySelector)) throw typeError('Argument "keySelector" must be a function.');
        if (isNothing(valueSelector)) valueSelector = identity;else if (!isFunction(valueSelector)) throw typeError('Argument "valueSelector" must be a function.');
        return new Aeroflow(function (next, done, context) {
          var map = new Map();

          _this20[GENERATOR](function (value) {
            return map.set(keySelector(value), valueSelector(value));
          }, function () {
            next(map);
            done();
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
          }, done, new Context());
        });
      }
    }]);

    return Aeroflow;
  })();

  function aeroflow(source) {
    if (source instanceof Aeroflow) return source;
    if (isArray(source)) return new Aeroflow(function (next, done, context) {
      var index = -1;

      while (context.busy && ++index < source.length) {
        next(source[index]);
      }

      done();
    });
    if (isFunction(source)) return new Aeroflow(function (next, done, context) {
      var result = source();
      if (isPromise(result)) result.then(function (value) {
        next(value);
        done();
      }, function (error) {
        done();
        throw error;
      });else {
        next(result);
        done();
      }
    });
    if (isPromise(source)) return new Aeroflow(function (next, done, context) {
      return source.then(function (value) {
        next(value);
        done();
      }, function (error) {
        done();
        throw error;
      });
    });
    if (isObject(source) && ITERATOR in source) return new Aeroflow(function (next, done, context) {
      var iterator = source[ITERATOR]();

      while (context.busy) {
        var result = iterator.next();
        if (result.done) break;else next(result.value);
      }

      done();
    });
    return aeroflow.just(source);
  }

  aeroflow.empty = new Aeroflow(function (next, done, context) {
    return done();
  });

  aeroflow.expand = function (expander, seed) {
    if (isNothing(expander)) expander = identity;else if (!isFunction(expander)) throw typeError('Argument "expander" must be a function.');
    return new Aeroflow(function (next, done, context) {
      var value = seed;

      while (context.busy) {
        next(value = expander(value));
      }

      done();
    });
  };

  aeroflow.just = function (value) {
    return new Aeroflow(function (next, done, context) {
      next(value);
      done();
    });
  };

  aeroflow.random = function (min, max) {
    if (isNothing(min)) {
      if (isNothing(max)) return new Aeroflow(function (next, done, context) {
        while (context.busy) {
          next(Math.random());
        }

        done();
      });else if (isNaN(max = +max)) throw typeError('Argument "max" must be a number');
      min = 0;
    }

    if (isNothing(max)) max = maxInteger;
    if (min >= max) throw new RangeError('Argument "min" must be greater then "max".');
    max -= min;
    var round = isInteger(min) && isInteger(max) ? floor : identity;
    return new Aeroflow(function (next, done, context) {
      while (context.busy) {
        next(round(min + max * Math.random()));
      }

      done();
    });
  };

  aeroflow.range = function (start, end, step) {
    if (isNothing(step)) step = 1;else if (isNaN(step = +step) || step < 1) throw typeError('Argument "step" must be a positive number.');
    if (isNothing(start)) start = 0;else if (isNaN(start = +start)) throw typeError('Argument "start" must be a number.');
    if (isNothing(end)) end = 0;else if (isNaN(end = +end)) throw typeError('Argument "end" must be a number.');
    if (start <= end) return new Aeroflow(function (next, done, context) {
      var i = start - step;

      while (context.busy && (i += step) <= end) {
        next(i);
      }

      done();
    });
    return new Aeroflow(function (next, done, context) {
      var i = start + step;

      while (context.busy && (i -= step) >= end) {
        next(i);
      }

      done();
    });
  };

  aeroflow.repeat = function (repeater) {
    if (isNothing(repeater)) return new Aeroflow(function (next, done, context) {
      var index = 0;

      while (context.busy) {
        next(index++);
      }

      done();
    });
    if (isFunction(repeater)) return new Aeroflow(function (next, done, context) {
      !(function repeat() {
        while (context.busy) {
          var result = repeater();
          if (result === false) break;else if (isPromise(result)) return result.then(function (value) {
            next(value);
            repeat();
          }, function (error) {
            done();
            throw error;
          });else next(result);
        }

        done();
      })();
    });
    throw typeError('Argument "repeater" must be a function.');
  };

  module.exports = aeroflow;
});
