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

        return aeroflow.apply(undefined, [this].concat(flows));
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
          context = context.make();

          _this3[EMITTER](function (value) {
            empty = false;

            if (!predicate(value)) {
              result = false;
              context.stop();
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
          context = context.make();

          _this5[EMITTER](function (value) {
            next(value);
            context.stop();
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

        var context = makeContext(this, data);
        if (!isFunction(done)) done = noop;
        if (!isFunction(next)) next = noop;
        setImmediate(function () {
          return _this9[EMITTER](function (value) {
            return next(value, context);
          }, function (error) {
            context.stop();
            done(error, context);
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

        return new Aeroflow(isNothing(condition) ? emitEmpty() : isNumber(condition) ? function (next, done, context) {
          var index = 1;

          _this11[EMITTER](function (value) {
            return condition < index++ ? next(value) : false;
          }, done, context);
        } : isFunction(condition) ? function (next, done, context) {
          var index = 0,
              limited = true;

          _this11[EMITTER](function (value) {
            if (limited && !condition(value, index++, context.data)) limited = false;
            if (!limited) next(value);
          }, done, context);
        } : condition ? emitEmpty() : this[EMITTER]);
      }
    }, {
      key: 'some',
      value: function some(predicate) {
        var _this12 = this;

        predicate = makePredicate(predicate);
        return new Aeroflow(function (next, done, context) {
          var result = false;
          context = context.make();

          _this12[EMITTER](function (value) {
            if (predicate(value)) {
              result = true;
              context.stop();
            }
          }, function (error) {
            next(result);
            done(error);
          }, context);
        });
      }
    }, {
      key: 'sort',
      value: function sort(order) {
        for (var _len2 = arguments.length, comparers = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          comparers[_key2 - 1] = arguments[_key2];
        }

        return _sort.apply(undefined, [this, order].concat(comparers));
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

        return new Aeroflow(isNumber(condition) ? condition > 0 ? function (next, done, context) {
          var index = 1;
          context = context.make();

          _this13[EMITTER](function (value) {
            next(value);
            if (condition <= index++) context.stop();
          }, done, context);
        } : emitEmpty() : isFunction(condition) ? function (next, done, context) {
          var index = 0;
          context = context.make();

          _this13[EMITTER](function (value) {
            return condition(value, index++, context.data) ? next(value) : context.stop();
          }, done, context);
        } : isNothing(condition) || condition ? this[EMITTER] : emitEmpty());
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

  function aeroflow() {
    return new Aeroflow(emit.apply(undefined, arguments));
  }

  function compare(left, right) {
    return left < right ? -1 : left > right ? 1 : 0;
  }

  function create(emitter, disposer) {
    return new Aeroflow(isFunction(emitter) ? function (next, done, context) {
      var completed = false;
      emitter(function (value) {
        return context() ? next() : false;
      }, function (error) {
        if (completed) return;
        completed = true;
        done();
        context.stop();
        if (isFunction(disposer)) disposer();
      }, context);
    } : emitEmpty());
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
        if (isAeroflow(source)) return source[EMITTER];
        if (isArray(source)) return emitArray(source);
        if (isFunction(source)) return emitFunction(source);
        if (isPromise(source)) return emitPromise(source);
        if (isIterable(source)) return emitIterable(source);
        return emitValue(source);

      default:
        return function (next, done, context) {
          var count = sources.length,
              index = -1;
          !(function proceed() {
            ++index < count ? emit(sources[index])(next, proceed, context) : done();
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

  function expand(callback, seed, limit) {
    limit = limit || maxInteger;
    var expander = isFunction(callback) ? callback : identity;
    return new Aeroflow(isFunction(callback) ? function (next, done, context) {
      var counter = limit,
          index = 0,
          value = seed;

      while (0 < counter-- && context()) {
        next(value = expander(value, index++, context.data));
      }

      done();
    } : function (next, done, context) {
      var counter = limit;

      while (0 < counter-- && context()) {
        next(seed);
      }

      done();
    });
  }

  function just(value) {
    return new Aeroflow(emitValue(value));
  }

  function makeContext(flow, data) {
    var active = true,
        callbacks = [],
        care = function care(callback) {
      if (isFunction(callback)) active ? callbacks.push(callback) : callback();
      return callback;
    },
        context = function context() {
      return active;
    },
        make = function make() {
      return care(makeContext(flow, data));
    },
        stop = function stop() {
      if (active) {
        active = false;
        callbacks.forEach(function (callback) {
          return callback();
        });
      }

      return false;
    };

    return defineProperties(context, {
      care: {
        value: care
      },
      data: {
        value: data
      },
      flow: {
        value: flow
      },
      make: {
        value: make
      },
      stop: {
        value: stop
      }
    });
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
    return new Aeroflow(start === end ? emitValue(start) : function (next, done, context) {
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
    return new Aeroflow(isFunction(repeater) ? function (next, done, context) {
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
          if (result === false) done();else emit(result)(next, onDone, context);
        } else done();
      }
    } : function (next, done, context) {
      var counter = limit;

      while (0 < counter-- && context()) {
        next(repeater);
      }

      done();
    });
  }

  function _sort(flow, order) {
    for (var _len4 = arguments.length, selectors = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
      selectors[_key4 - 2] = arguments[_key4];
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
        return sortWithoutComparer(flow, order);

      case 1:
        return sortWithComparer(flow, order, selectors[0]);

      default:
        return sortWithComparers.apply(undefined, [flow, order].concat(selectors));
    }
  }

  function sortWithComparer(flow, order, selector) {
    var array = flow.toArray(),
        comparer = function comparer(left, right) {
      return order * compare(selector(left), selector(right));
    };

    return new Aeroflow(function (next, done, context) {
      return array[EMITTER](function (values) {
        return values.sort(comparer).forEach(next);
      }, done, context);
    });
  }

  function sortWithComparers(flow, order) {
    for (var _len5 = arguments.length, selectors = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
      selectors[_key5 - 2] = arguments[_key5];
    }

    var array = flow.toArray(),
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

  function sortWithoutComparer(flow, order) {
    var array = flow.toArray();
    return new Aeroflow(function (next, done, context) {
      return array[EMITTER](function (values) {
        return order === 1 ? values.sort().forEach(next) : values.sort().reverse().forEach(next);
      }, done, context);
    });
  }

  function throwError(error) {
    throw isError(error) ? error : new Error(error);
  }

  module.exports = defineProperties(aeroflow, {
    create: {
      value: create
    },
    empty: {
      value: new Aeroflow(emitEmpty())
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
