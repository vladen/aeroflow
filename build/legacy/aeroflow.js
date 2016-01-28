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

  var _objectCreate, _objectCreate2;

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

  var AEROFLOW = 'Aeroflow';
  var ARRAY = 'Array';
  var BOOLEAN = 'Boolean';
  var CLASS = Symbol.toStringTag;
  var DATE = 'Date';
  var FUNCTION = 'Function';
  var ITERATOR = Symbol.iterator;
  var NUMBER = 'Number';
  var PROMISE = 'Promise';
  var PROTOTYPE = 'prototype';
  var REGEXP = 'RegExp';
  var SYMBOL = 'Symbol';
  var UNDEFINED = 'Undefined';
  var dateNow = Date.now;
  var mathFloor = Math.floor;
  var mathRandom = Math.random;
  var mathMax = Math.max;
  var maxInteger = Number.MAX_SAFE_INTEGER;
  var objectCreate = Object.create;
  var objectDefineProperties = Object.defineProperties;
  var objectToString = Object.prototype.toString;

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

  var isFunction$1 = classIs(FUNCTION);
  var isInteger = Number.isInteger;

  var isNothing = function isNothing(value) {
    return value == null;
  };

  var isNumber = classIs(NUMBER);

  var toNumber = function toNumber(value, def) {
    if (!isNumber(value)) {
      value = +value;
      if (isNaN(value)) return def;
    }

    return value;
  };

  function arrayEmitter(source) {
    return function (next, done, context) {
      var index = -1;

      while (++index < source.length && next(source[index])) {}

      done();
    };
  }

  function emptyEmitter() {
    return function (next, done) {
      return done();
    };
  }

  function functionEmitter(source) {
    return function (next, done, context) {
      try {
        next(source(context.data));
        return done();
      } catch (error) {
        return done(error);
      }
    };
  }

  function promiseEmitter(source) {
    return function (next, done, context) {
      return source.then(function (value) {
        next(value);
        done();
      }, done);
    };
  }

  function valueEmitter(value) {
    return function (next, done) {
      next(value);
      done();
    };
  }

  function finalize(finalizer) {
    if (isFunction$1(finalizer)) finalizer();
  }

  function customEmitter(emitter) {
    return arguments.length ? isFunction$1(emitter) ? function (next, done, context) {
      var complete = false,
          finalizer = undefined;

      try {
        finalizer = emitter(function (value) {
          if (complete) return false;
          if (next(value)) return true;
          complete = true;
          done();
        }, function (error) {
          if (complete) return;
          complete = true;
          done(error);
        }, context);
      } catch (error) {
        if (complete) {
          finalize(finalizer);
          throw error;
        }

        complete = true;
        done();
      }

      finalize(finalizer);
    } : valueEmitter(emitter) : emptyEmitter();
  }

  function expandEmitter(expanding, seed) {
    var expander = isFunction$1(expanding) ? expanding : constant(expanding);
    return function (next, done, context) {
      var index = 0,
          value = seed;

      while (next(expander(value, index++, context.data))) {}

      done();
    };
  }

  function randomDecimalEmitter(min, max) {
    return function (next, done) {
      while (next(min + max * mathRandom())) {}

      done();
    };
  }

  function randomIntegerEmitter(min, max) {
    return function (next, done) {
      while (next(mathFloor(min + max * mathRandom()))) {}

      done();
    };
  }

  function randomEmitter(min, max) {
    max = toNumber(max, 1);
    min = toNumber(min, 0);
    max -= min;
    return isInteger(min) && isInteger(max) ? randomIntegerEmitter(min, max) : randomDecimalEmitter(min, max);
  }

  function rangeEmitter(start, end, step) {
    end = toNumber(end, maxInteger);
    start = toNumber(start, 0);
    if (start === end) return valueEmitter(start);

    if (start < end) {
      step = toNumber(step, 1);
      if (step < 1) return valueEmitter(start);
      return function (next, done, context) {
        var value = start;

        while (next(value) && (value += step) <= end) {}

        done();
      };
    }

    step = toNumber(step, -1);
    if (step > -1) return valueEmitter(start);
    return function (next, done, context) {
      var value = start;

      while (next(value) && (value += step) >= end) {}

      done();
    };
  }

  function repeatDynamicEmitter(repeater) {
    return function (next, done, context) {
      var index = 0;

      try {
        while (next(repeater(index++, context.data))) {}

        done();
      } catch (error) {
        done(error);
      }
    };
  }

  function repeatStaticEmitter(value) {
    return function (next, done, context) {
      while (next(value)) {}

      done();
    };
  }

  function repeatEmitter(value) {
    return isFunction(value) ? repeatDynamicEmitter(value) : repeatStaticEmitter(value);
  }

  function timerEmitter(interval) {
    interval = +interval;
    return isNaN(interval) ? emptyEmitter() : function (next, done, context) {
      var timer = setInterval(function () {
        if (!next(new Date())) {
          clearInterval(timer);
          done();
        }
      }, interval);
    };
  }

  function reduceAlongOperator(reducer) {
    return function (emitter) {
      return function (next, done, context) {
        var idle = true,
            index = 1,
            result = undefined;
        emitter(function (value) {
          if (idle) {
            idle = false;
            result = value;
          } else result = reducer(result, value, index++, context.data);

          return true;
        }, function (error) {
          if (isNothing(error) && !idle) next(result);
          return done(error);
        }, context);
      };
    };
  }

  function reduceGeneralOperator(reducer, seed) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0,
            result = seed;
        emitter(function (value) {
          result = reducer(result, value, index++, context.data);
          return true;
        }, function (error) {
          if (isNothing(error)) next(result);
          return done(error);
        }, context);
      };
    };
  }

  function reduceOptionalOperator(reducer, seed) {
    return function (emitter) {
      return function (next, done, context) {
        var idle = true,
            index = 0,
            result = seed;
        emitter(function (value) {
          idle = false;
          result = reducer(result, value, index++, context.data);
          return true;
        }, function (error) {
          if (isNothing(error) && !idle) next(result);
          return done(error);
        }, context);
      };
    };
  }

  function reduceOperator(reducer, seed, optional) {
    var arity = arguments.length;
    if (!arity || !isFunction$1(reducer)) return function () {
      return emptyEmitter();
    };

    switch (arity) {
      case 1:
        return reduceAlongOperator(reducer);

      case 2:
        return reduceGeneralOperator(reducer, seed);

      default:
        return isFunction$1(reducer) ? optional ? reduceOptionalOperator(reducer, seed) : reduceGeneralOperator(reducer, seed) : function () {
          return valueEmitter(reducer);
        };
    }
  }

  function countOperator(optional) {
    return (optional ? reduceOptionalOperator : reduceGeneralOperator)(function (result) {
      return result + 1;
    }, 0);
  }

  function delayOperator(condition) {
    var delayer = isFunction$1(condition) ? condition : constant(condition);
    return function (emitter) {
      return function (next, done, context) {
        var buffer = [],
            completed = false,
            delivering = false,
            index = 0;

        function schedule(action, argument) {
          if (delivering) {
            buffer.push([action, argument]);
            return;
          }

          delivering = true;
          var interval = delayer(argument, index++, context.data);

          switch (classOf(interval)) {
            case DATE:
              interval = interval - dateNow();
              break;

            case NUMBER:
              break;

            default:
              interval = +interval;
          }

          if (interval < 0) interval = 0;
          setTimeout(function () {
            delivering = false;

            if (!action(argument)) {
              completed = true;
              buffer.length = 0;
            } else if (buffer.length) schedule.apply(null, buffer.shift());
          }, interval);
        }

        ;
        return emitter(function (value) {
          if (completed) return false;
          schedule(next, value);
          return true;
        }, function (error) {
          completed = true;
          schedule(done, error);
        }, context);
      };
    };
  }

  function dumpToConsoleOperator(prefix) {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(function (value) {
          console.log(prefix + 'next', value);
          return next(value);
        }, function (error) {
          error ? console.error(prefix + 'done', error) : console.log(prefix + 'done');
          return done(error);
        }, context);
      };
    };
  }

  function dumpToLoggerOperator(prefix, logger) {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(function (value) {
          logger(prefix + 'next', value);
          return next(value);
        }, function (error) {
          error ? logger(prefix + 'done', error) : logger(prefix + 'done');
          return done(error);
        }, context);
      };
    };
  }

  function dumpOperator(prefix, logger) {
    return isFunction$1(prefix) ? dumpToLoggerOperator('', prefix) : isFunction$1(logger) ? dumpToLoggerOperator(prefix, logger) : isNothing(prefix) ? dumpToConsoleOperator('') : dumpToConsoleOperator(prefix);
  }

  function everyOperator(condition) {
    var predicate = undefined;

    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;

      case REGEXP:
        predicate = function predicate(value) {
          return condition.test(value);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(value) {
          return !!value;
        };

        break;

      default:
        predicate = function predicate(value) {
          return value === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var idle = true,
            result = true;
        context = context.spawn();
        emitter(function (value) {
          idle = false;
          if (predicate(value)) return true;
          return result = false;
        }, function (error) {
          if (isNothing(error)) next(result && !idle);
          return done(error);
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
        predicate = function predicate(value) {
          return condition.test(value);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(value) {
          return !!value;
        };

        break;

      default:
        predicate = function predicate(value) {
          return value === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          return !predicate(value, index++, context.data) || next(value);
        }, done, context);
      };
    };
  }

  function groupOperator(selectors) {
    selectors = selectors.length ? selectors.map(function (selector) {
      return isFunction$1(selector) ? selector : constant(selector);
    }) : [constant()];
    var limit = selectors.length - 1;
    return function (emitter) {
      return function (next, done, context) {
        var groups = new Map();
        var index = 0;
        emitter(function (value) {
          var current = undefined,
              parent = groups;

          for (var i = -1; ++i <= limit;) {
            var key = selectors[i](value, index++, context.data);
            current = parent.get(key);

            if (!current) {
              current = i === limit ? [] : new Map();
              parent.set(key, current);
            }

            parent = current;
          }

          current.push(value);
          return true;
        }, function (error) {
          if (error) done(error);else {
            Array.from(groups).every(next);
            done();
          }
        }, context);
      };
    };
  }

  function joinOperator(separator, optional) {
    var joiner = isFunction$1(separator) ? separator : isNothing(separator) ? constant(',') : constant(separator);
    return (optional ? reduceOptionalOperator : reduceGeneralOperator)(function (result, value, index, data) {
      return result.length ? result + joiner(value, index, data) + value : value;
    }, '');
  }

  function mapOperator(mapping) {
    if (isNothing(mapping)) return identity;
    var mapper = isFunction$1(mapping) ? mapping : constant(mapping);
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          return next(mapper(value, index++, context.data));
        }, done, context);
      };
    };
  }

  function maxOperator() {
    return reduceAlongOperator(function (maximum, value) {
      return value > maximum ? value : maximum;
    });
  }

  function toArrayOperator() {
    return function (emitter) {
      return function (next, done, context) {
        var result = [];
        emitter(function (value) {
          result.push(value);
          return true;
        }, function (error) {
          if (isNothing(error)) next(result);
          return done(error);
        }, context);
      };
    };
  }

  function meanOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (values) {
          if (!values.length) return;
          values.sort();
          next(values[mathFloor(values.length / 2)]);
        }, done, context);
      };
    };
  }

  function minOperator() {
    return reduceAlongOperator(function (minimum, value) {
      return value < minimum ? value : minimum;
    });
  }

  function reverseOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (value) {
          for (var index = value.length; index--;) {
            next(value[index]);
          }

          return false;
        }, done, context);
      };
    };
  }

  function skipAllOperator() {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(noop, done, context);
      };
    };
  }

  function skipFirstOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        var index = -1;
        emitter(function (value) {
          return ++index < count || next(value);
        }, done, context);
      };
    };
  }

  function skipLastOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (values) {
          var limit = mathMax(values.length - count, 0);
          var index = -1;

          while (++index < limit && next(values[index])) {}

          done();
        }, done, context);
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

      default:
        return condition ? skipAllOperator() : identity;
    }
  }

  function someOperator(condition) {
    var predicate = undefined;

    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;

      case REGEXP:
        predicate = function predicate(value) {
          return condition.test(value);
        };

        break;

      case UNDEFINED:
        predicate = function predicate(value) {
          return !!value;
        };

        break;

      default:
        predicate = function predicate(value) {
          return value === condition;
        };

        break;
    }

    return function (emitter) {
      return function (next, done, context) {
        var result = false;
        context = context.spawn();
        emitter(function (value) {
          if (!predicate(value)) return true;
          result = true;
          return false;
        }, function (error) {
          if (isNothing(error)) next(result);
          return done(error);
        }, context);
      };
    };
  }

  function sumOperator() {
    return function (emitter) {
      return reduceGeneralOperator(function (result, value) {
        return result + value;
      }, 0);
    };
  }

  function takeFirstOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        var index = -1;
        emitter(function (value) {
          return ++index < count && next(value);
        }, done, context);
      };
    };
  }

  function takeLastOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (values) {
          var limit = values.length;
          var index = mathMax(limit - count - 1, 0);

          while (++index < limit && next(values[index])) {}

          done();
        }, done, context);
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
        return condition > 0 ? takeFirstOperator(condition) : condition < 0 ? takeLastOperator(-condition) : emptyEmitter();

      case FUNCTION:
        return takeWhileOperator(condition);

      default:
        return condition ? identity : emptyEmitter();
    }
  }

  function tapOperator(callback) {
    return function (emitter) {
      return isFunction$1(callback) ? function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          callback(value, index++, context.data);
          return next(value);
        }, done, context);
      } : emitter;
    };
  }

  function timestampOperator() {
    return function (emitter) {
      return function (next, done, context) {
        var past = dateNow();
        emitter(function (value) {
          var current = dateNow(),
              result = next({
            timedelta: current - past,
            timestamp: dateNow,
            value: value
          });
          past = current;
          return result;
        }, done, context);
      };
    };
  }

  function toMapOperator(keyTransformation, valueTransformation) {
    var keyTransformer = isNothing(keyTransformation) ? identity : isFunction$1(keyTransformation) ? keyTransformation : constant(keyTransformation);
    var valueTransformer = isNothing(valueTransformation) ? identity : isFunction$1(valueTransformation) ? valueTransformation : constant(valueTransformation);
    return function (emitter) {
      return function (next, done, context) {
        var index = 0,
            result = new Map();
        emitter(function (value) {
          result.set(keyTransformer(value, index++, context.data), valueTransformer(value, index++, context.data));
          return true;
        }, function (error) {
          if (isNothing(error)) next(result);
          return done(error);
        }, context);
      };
    };
  }

  function toSetOperator() {
    return function (emitter) {
      return function (next, done, context) {
        var result = new Set();
        emitter(function (value) {
          result.add(value);
          return true;
        }, function (error) {
          if (isNothing(error)) next(result);
          return done(error);
        }, context);
      };
    };
  }

  var Aeroflow = function Aeroflow(emitter, sources) {
    _classCallCheck(this, Aeroflow);

    objectDefineProperties(this, {
      emitter: {
        value: emitter
      },
      sources: {
        value: sources
      }
    });
  };

  function append() {
    for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }

    return new Aeroflow(this.emitter, this.sources.concat(sources));
  }

  function bind() {
    for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      sources[_key2] = arguments[_key2];
    }

    return new Aeroflow(this.emitter, sources);
  }

  function chain(operator) {
    return new Aeroflow(operator(this.emitter), this.sources);
  }

  function count(optional) {
    return this.chain(countOperator(optional));
  }

  function delay(condition) {
    return this.chain(delayOperator(condition));
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

  function group() {
    for (var _len3 = arguments.length, selectors = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      selectors[_key3] = arguments[_key3];
    }

    return this.chain(groupOperator(selectors));
  }

  function join(condition, optional) {
    return this.chain(joinOperator(condition, optional));
  }

  function map(mapping) {
    return this.chain(mapOperator(mapping));
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

  function prepend() {
    for (var _len4 = arguments.length, sources = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      sources[_key4] = arguments[_key4];
    }

    return new Aeroflow(this.emitter, sources.concat(this.sources));
  }

  function reduce(reducer, seed, optional) {
    return this.chain(reduceOperator(reducer, seed, optional));
  }

  function reverse() {
    return this.chain(reverseOperator());
  }

  function run(next, done, data) {
    if (!isFunction$1(done)) done = noop;
    if (!isFunction$1(next)) next = noop;
    var context = objectDefineProperties({}, {
      data: {
        value: data
      },
      flow: {
        value: this
      }
    });
    setImmediate(function () {
      context.flow.emitter(function (value) {
        return false !== next(value, data);
      }, function (error) {
        return done(error, data);
      }, context);
    });
    return this;
  }

  function skip(condition) {
    return this.chain(skipOperator(condition));
  }

  function some(condition) {
    return this.chain(someOperator(condition));
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

  function timestamp() {
    return this.chain(timestampOperator());
  }

  function toArray() {
    return this.chain(toArrayOperator());
  }

  function toMap(keyTransformation, valueTransformation) {
    return this.chain(toMapOperator(keyTransformation, valueTransformation));
  }

  function toSet() {
    return this.chain(toSetOperator());
  }

  var operators = objectCreate(Object[PROTOTYPE], {
    count: {
      value: count,
      writable: true
    },
    delay: {
      value: delay,
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
    reverse: {
      value: reverse,
      writable: true
    },
    skip: {
      value: skip,
      writable: true
    },
    some: {
      value: some,
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
    timestamp: {
      value: timestamp,
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
    }
  });
  Aeroflow[PROTOTYPE] = objectCreate(operators, (_objectCreate = {}, _defineProperty(_objectCreate, CLASS, {
    value: AEROFLOW
  }), _defineProperty(_objectCreate, 'append', {
    value: append
  }), _defineProperty(_objectCreate, 'bind', {
    value: bind
  }), _defineProperty(_objectCreate, 'chain', {
    value: chain
  }), _defineProperty(_objectCreate, 'prepend', {
    value: prepend
  }), _defineProperty(_objectCreate, 'run', {
    value: run
  }), _objectCreate));
  var adapters = objectCreate(null, (_objectCreate2 = {}, _defineProperty(_objectCreate2, ARRAY, {
    value: arrayEmitter,
    writable: true
  }), _defineProperty(_objectCreate2, BOOLEAN, {
    value: valueEmitter,
    writable: true
  }), _defineProperty(_objectCreate2, DATE, {
    value: valueEmitter,
    writable: true
  }), _defineProperty(_objectCreate2, FUNCTION, {
    value: functionEmitter,
    writable: true
  }), _defineProperty(_objectCreate2, NUMBER, {
    value: valueEmitter,
    writable: true
  }), _defineProperty(_objectCreate2, PROMISE, {
    value: promiseEmitter,
    writable: true
  }), _defineProperty(_objectCreate2, REGEXP, {
    value: valueEmitter,
    writable: true
  }), _objectCreate2));

  function adapt(source) {
    if (isNothing(source)) return valueEmitter(source);
    var sourceClass = classOf(source);
    if (sourceClass === AEROFLOW) return source.emitter;
    var adapter = adapters[sourceClass];
    if (isFunction$1(adapter)) return adapter(source);

    switch (sourceClass) {
      case BOOLEAN:
      case NUMBER:
      case SYMBOL:
        return valueEmitter(source);

      default:
        var iterate = source[ITERATOR];
        if (isFunction$1(iterate)) return function (next, done, context) {
          var iterator = iterate();

          while (context.active) {
            var iteration = iterator.next();
            if (iteration.done) break;
            next(iteration.value);
          }

          done();
        };
        return valueEmitter(source);
    }
  }

  function emit(next, done, context) {
    var sources = context.flow.sources;
    var limit = sources.length,
        index = -1;
    !function proceed(error) {
      if (isNothing(error) && ++index < limit) adapt(sources[index])(next, proceed, context);else done(error);
    }();
  }

  function aeroflow() {
    for (var _len5 = arguments.length, sources = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      sources[_key5] = arguments[_key5];
    }

    return new Aeroflow(emit, sources);
  }

  function create(emitter) {
    return new Aeroflow(customEmitter(emitter));
  }

  function expand(expander, seed) {
    return new Aeroflow(expandEmitter(expander, seed));
  }

  function just(value) {
    return new Aeroflow(valueEmitter(value));
  }

  function random(min, max) {
    return new Aeroflow(randomEmitter(min, max));
  }

  function range(start, end, step) {
    return new Aeroflow(rangeEmitter(start, end, step));
  }

  function repeat(value) {
    return new Aeroflow(repeatEmitter(value));
  }

  function timer(interval) {
    return new Aeroflow(timerEmitter(interval));
  }

  objectDefineProperties(aeroflow, {
    adapters: {
      get: function get() {
        return adapters;
      }
    },
    create: {
      value: create
    },
    empty: {
      enumerable: true,
      value: new Aeroflow(emptyEmitter())
    },
    expand: {
      value: expand
    },
    just: {
      value: just
    },
    operators: {
      get: function get() {
        return operators;
      }
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
    timer: {
      value: timer
    }
  });
  exports.default = aeroflow;
  module.exports = exports['default'];
});
