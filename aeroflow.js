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

  var DISPOSER = Symbol('generator'),
      GENERATOR = Symbol('generator'),
      ITERATOR = Symbol.iterator,
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

  var Aeroflow = (function () {
    function Aeroflow(generator, disposer) {
      _classCallCheck(this, Aeroflow);

      defineProperty(this, GENERATOR, {
        value: generator
      });
      if (disposer) defineProperty(this, DISPOSER, {
        value: disposer
      });
    }

    _createClass(Aeroflow, [{
      key: 'concat',
      value: function concat(that) {
        var _this = this;

        that = aeroflow(that);
        return new Aeroflow(function () {
          var end = false,
              iterator = _this[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              next(value);
            }, function () {
              if (end) done();else {
                end = true;
                iterator = that[GENERATOR]();
              }
            });
          };
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

        return new Aeroflow(function () {
          var end = false,
              iterator = _this2[GENERATOR]();

          return function (next, done) {
            return new Promise(function (resolve) {
              if (!end) iterator(function (value) {
                return setTimeout(function () {
                  next(value);
                  resolve();
                }, interval);
              }, function () {
                end = true;
                setTimeout(function () {
                  done();
                  resolve();
                }, interval);
              });
            });
          };
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

        return new Aeroflow(function () {
          var iterator = _this3[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              logger(prefix + 'next', value);
              next(value);
            }, function () {
              logger(prefix + 'done');
              done();
            });
          };
        });
      }
    }, {
      key: 'every',
      value: function every(predicate) {
        var _this4 = this;

        if (!isFunction(predicate)) predicate = isSomething;
        return new Aeroflow(function () {
          var end = false,
              iterator = _this4[GENERATOR]();

          return function (next, done) {
            if (!end) iterator(function (value) {
              if (!predicate(value)) {
                end = true;
                next(false);
                done();
              }
            }, function () {
              if (!end) {
                next(true);
                done();
              }
            });
          };
        });
      }
    }, {
      key: 'filter',
      value: function filter(predicate) {
        var _this5 = this;

        if (!isFunction(predicate)) predicate = isSomething;
        return new Aeroflow(function () {
          var index = 0,
              iterator = _this5[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              if (predicate(value, index++)) next(value);
            }, done);
          };
        });
      }
    }, {
      key: 'first',
      value: function first() {
        var _this6 = this;

        return new Aeroflow(function () {
          var end = false,
              iterator = _this6[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              if (!end) {
                end = true;
                next(value);
                done();
              }
            }, function () {
              if (!end) done();
            });
          };
        });
      }
    }, {
      key: 'join',
      value: function join(separator) {
        if (!isString(separator)) separator = ',';
        return this.reduce(function (result, value) {
          return result.length ? result + separator + value : value;
        }, '');
      }
    }, {
      key: 'last',
      value: function last() {
        var _this7 = this;

        return new Aeroflow(function () {
          var iterator = _this7[GENERATOR](),
              last = undefined;

          return function (next, done) {
            return iterator(function (value) {
              last = value;
            }, function () {
              next(last);
              done();
            });
          };
        });
      }
    }, {
      key: 'map',
      value: function map(transform) {
        var _this8 = this;

        if (isNothing(transform)) transform = identity;else if (!isFunction(transform)) throw typeError('Argument "transform" must be a function.');
        return new Aeroflow(function () {
          var index = 0,
              iterator = _this8[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              return next(transform(value, index++));
            }, done);
          };
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
        return new Aeroflow(function () {
          var iterator = _this9[GENERATOR](),
              values = undefined;

          if (cache) {
            var _ret = (function () {
              values = cache;
              var index = -1;
              return {
                v: function v(next, done) {
                  return ++index < values.length ? next(values[index]) : done();
                }
              };
            })();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          } else {
            values = cache = [];
            setTimeout(function () {
              return cache = null;
            }, expires);
            return function (next, done) {
              return iterator(function (value) {
                values.push(value);
                next(value);
              }, done);
            };
          }
        });
      }
    }, {
      key: 'mean',
      value: function mean() {
        var array = this.toArray();
        return new Aeroflow(function () {
          var iterator = array[GENERATOR]();
          return function (next, done) {
            return iterator(function (values) {
              if (values.length) {
                values.sort();
                next(values[floor(values.length / 2)]);
              } else done();
            }, done);
          };
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
        return new Aeroflow(function () {
          var index = 0,
              inited = false,
              iterator = _this10[GENERATOR](),
              result = undefined;

          if (seeded) {
            result = seed;
            inited = true;
          } else index = 1;

          return function (next, done) {
            return iterator(function (value) {
              if (inited) result = reducer(result, value, index++);else {
                result = value;
                inited = true;
              }
            }, function () {
              if (inited) next(result);
              done();
            });
          };
        });
      }
    }, {
      key: 'run',
      value: function run(onNext, onDone) {
        if (isNothing(onNext)) onNext = noop;else if (!isFunction(onNext)) throw typeError('Argument "onNext" must be a function.');
        if (isNothing(onDone)) onDone = noop;else if (!isFunction(onDone)) throw typeError('Argument "onDone" must be a function.');
        var end = false,
            iterator = this[GENERATOR]();
        setTimeout(proceed, 0);
        return this;

        function proceed() {
          while (!end) {
            var result = iterator(onNext, function () {
              end = true;
              onDone();
            });

            if (isPromise(result)) {
              result.then(proceed);
              break;
            }
          }
        }
      }
    }, {
      key: 'skip',
      value: function skip(count) {
        var _this11 = this;

        return new Aeroflow(function () {
          var counter = +count,
              iterator = _this11[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              if (--counter < 0) next(value);
            }, done);
          };
        });
      }
    }, {
      key: 'some',
      value: function some(predicate) {
        var _this12 = this;

        if (!isFunction(predicate)) predicate = isSomething;
        return new Aeroflow(function () {
          var end = false,
              iterator = _this12[GENERATOR]();

          return function (next, done) {
            if (!end) iterator(function (value) {
              if (predicate(value)) {
                end = true;
                next(true);
                done();
              }
            }, function () {
              if (!end) {
                next(false);
                done();
              }
            });
          };
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
        var _this13 = this;

        return new Aeroflow(function () {
          var counter = +count,
              iterator = _this13[GENERATOR]();

          return function (next, done) {
            return counter > 0 ? iterator(function (value) {
              return counter-- > 0 ? next(value) : done();
            }, done) : done();
          };
        });
      }
    }, {
      key: 'tap',
      value: function tap(callback) {
        var _this14 = this;

        if (!isFunction(callback)) callback = noop;
        return new Aeroflow(function () {
          var index = 0,
              iterator = _this14[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              callback(value, index++);
              next(value);
            }, done);
          };
        });
      }
    }, {
      key: 'timedelta',
      value: function timedelta() {
        var _this15 = this;

        return new Aeroflow(function () {
          var iterator = _this15[GENERATOR](),
              past = now();

          return function (next, done) {
            return iterator(function (value) {
              var current = now();
              next({
                timedelta: current - past,
                value: value
              });
              past = current;
            }, done);
          };
        });
      }
    }, {
      key: 'timestamp',
      value: function timestamp() {
        var _this16 = this;

        return new Aeroflow(function () {
          var iterator = _this16[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              return next({
                timestamp: now(),
                value: value
              });
            }, done);
          };
        });
      }
    }, {
      key: 'toArray',
      value: function toArray() {
        var _this17 = this;

        return new Aeroflow(function () {
          var array = [],
              iterator = _this17[GENERATOR]();

          return function (next, done) {
            return iterator(function (value) {
              return array.push(value);
            }, function () {
              next(array);
              done();
            });
          };
        });
      }
    }, {
      key: 'toSet',
      value: function toSet(keySelector) {
        var _this18 = this;

        if (isNothing(keySelector)) keySelector = identity;else if (!isFunction(keySelector)) throw typeError('Argument "keySelector" must be a function.');
        return new Aeroflow(function () {
          var iterator = _this18[GENERATOR](),
              set = new Set();

          return function (next, done) {
            return iterator(function (value) {
              return set.add(keySelector(value));
            }, function () {
              next(set);
              done();
            });
          };
        });
      }
    }, {
      key: 'toMap',
      value: function toMap(keySelector, valueSelector) {
        var _this19 = this;

        if (isNothing(keySelector)) keySelector = identity;else if (!isFunction(keySelector)) throw typeError('Argument "keySelector" must be a function.');
        if (isNothing(valueSelector)) valueSelector = identity;else if (!isFunction(valueSelector)) throw typeError('Argument "valueSelector" must be a function.');
        return new Aeroflow(function () {
          var iterator = _this19[GENERATOR](),
              map = new Map();

          return function (next, done) {
            return iterator(function (value) {
              return map.set(keySelector(value), valueSelector(value));
            }, function () {
              next(map);
              done();
            });
          };
        });
      }
    }, {
      key: 'unique',
      value: function unique() {
        var _this20 = this;

        return new Aeroflow(function () {
          var iterator = _this20[GENERATOR](),
              values = new Set();

          return function (next, done) {
            return iterator(function (value) {
              var size = values.size;
              values.add(value);
              if (size < values.size) next(value);
            }, done);
          };
        });
      }
    }]);

    return Aeroflow;
  })();

  function aeroflow(source) {
    if (source instanceof Aeroflow) return source;
    if (isArray(source)) return new Aeroflow(function () {
      var index = -1;
      return function (next, done) {
        return ++index < source.length ? next(source[index]) : done();
      };
    });
    if (isFunction(source)) return new Aeroflow(function () {
      return function (next, done) {
        var result = source();
        if (isPromise(result)) return result.then(function (value) {
          next(value);
          done();
        }, function (error) {
          done();
          throw error;
        });
        next(result);
        done();
      };
    });
    if (isPromise(source)) return new Aeroflow(function () {
      return function (next, done) {
        return source.then(function (value) {
          next(value);
          done();
        }, function (error) {
          done();
          throw error;
        });
      };
    });
    if (isObject(source) && ITERATOR in source) return new Aeroflow(function () {
      var iterator = source[ITERATOR]();
      return function (next, done) {
        var result = iterator.next();
        if (result.done) done();else next(result.value);
      };
    });
    return aeroflow.just(source);
  }

  aeroflow.empty = new Aeroflow(function () {
    return function (next, done) {
      return done();
    };
  });

  aeroflow.expand = function (expander, seed) {
    if (isNothing(expander)) expander = identity;else if (!isFunction(expander)) throw typeError('Argument "expander" must be a function.');
    return new Aeroflow(function () {
      var value = seed;
      return function (next, done) {
        return next(value = expander(value));
      };
    });
  };

  aeroflow.just = function (value) {
    return new Aeroflow(function () {
      return function (next, done) {
        next(value);
        done();
      };
    });
  };

  aeroflow.random = function (min, max) {
    if (isNothing(min)) {
      if (isNothing(max)) return new Aeroflow(function () {
        return function (next, done) {
          return next(Math.random());
        };
      });else if (isNaN(max = +max)) throw typeError('Argument "max" must be a number');
      min = 0;
    }

    if (isNothing(max)) max = maxInteger;
    if (min >= max) throw new RangeError('Argument "min" must be greater then "max".');
    max -= min;
    var round = isInteger(min) && isInteger(max) ? floor : identity;
    return new Aeroflow(function () {
      return function (next, done) {
        return next(round(min + max * Math.random()));
      };
    });
  };

  aeroflow.range = function (start, end, step) {
    if (isNothing(step)) step = 1;else if (isNaN(step = +step) || step < 1) throw typeError('Argument "step" must be a positive number.');
    if (isNothing(start)) start = 0;else if (isNaN(start = +start)) throw typeError('Argument "start" must be a number.');
    if (isNothing(end)) end = 0;else if (isNaN(end = +end)) throw typeError('Argument "end" must be a number.');
    if (start <= end) return new Aeroflow(function () {
      var i = start - step;
      end -= step;
      return function (next, done) {
        return i <= end ? next(i += step) : done();
      };
    });
    if (start >= end) return new Aeroflow(function () {
      var i = start + step;
      end += step;
      return function (next, done) {
        return i >= end ? next(i -= step) : done();
      };
    });
    return aeroflow.empty;
  };

  aeroflow.repeat = function (repeater) {
    if (isNothing(repeater)) return new Aeroflow(function () {
      var index = 0;
      return function (next, done) {
        return next(index++);
      };
    });
    if (isFunction(repeater)) return new Aeroflow(function () {
      return function (next, done) {
        var value = repeater();
        if (value === false) done();else if (isPromise(value)) value.then(next, done);else next(value);
      };
    });
    throw typeError('Argument "repeater" must be a function.');
  };

  module.exports = aeroflow;
});
