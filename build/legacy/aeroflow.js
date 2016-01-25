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

  var _createClass = function () {
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
  }();

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

  var classOf = function classOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };

  var classIs = function classIs(className) {
    return function (value) {
      return classOf(value) === className;
    };
  };

  var constant = function constant(value) {
    return function () {
      return value;
    };
  };

  var dateNow = Date.now;

  var identity$1 = function identity$1(value) {
    return value;
  };

  var isDate = classIs(DATE);
  var isFunction$1 = classIs(FUNCTION);
  var isInteger = Number.isInteger;

  var isNothing$1 = function isNothing$1(value) {
    return value == null;
  };

  var isNumber = classIs(NUMBER);
  var isRegExp = classIs(REGEXP);
  var mathFloor = Math.floor;
  var mathRandom = Math.random;
  var mathMax = Math.max;

  var noop = function noop() {};

  var objectCreate = Object.create;
  var objectDefineProperties = Object.defineProperties;
  var objectDefineProperty = Object.defineProperty;

  function arrayEmitter(source) {
    return function (next, done, context) {
      var index = -1;

      while (context.active && ++index < source.length) {
        next(source[index]);
      }

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
      next(source(context.data));
      done();
    };
  }

  function promiseEmitter(source) {
    return function (next, done, context) {
      return source.then(function (value) {
        return next(value);
      }, function (error) {
        return done(error);
      });
    };
  }

  function valueEmitter(value) {
    return function (next, done) {
      next(value);
      done();
    };
  }

  function customEmitter(emitter) {
    return arguments.length ? isFunction$1(emitter) ? function (next, done, context) {
      return context.track(emitter(function (value) {
        if (context.active) next();
      }, function (error) {
        if (!context.active) return;
        done();
        context.done();
      }, context));
    } : valueEmitter(emitter) : emptyEmitter();
  }

  function expandEmitter(expanding, seed) {
    var expander = isFunction$1(expanding) ? expanding : constant(expanding);
    return function (next, done, context) {
      var index = 0,
          value = seed;

      while (context.active) {
        next(value = expander(value, index++, context.data));
      }

      done();
    };
  }

  function randomDecimalEmitter(inclusiveMin, exclusiveMax) {
    return function (next, done, context) {
      while (context.active) {
        next(inclusiveMin + exclusiveMax * mathRandom());
      }

      done();
    };
  }

  function randomIntegerEmitter(inclusiveMin, exclusiveMax) {
    return function (next, done, context) {
      while (context.active) {
        next(mathFloor(inclusiveMin + exclusiveMax * mathRandom()));
      }

      done();
    };
  }

  function randomEmitter(inclusiveMin, exclusiveMax) {
    inclusiveMin = +inclusiveMin || 0;
    exclusiveMax = +exclusiveMax || 1;
    exclusiveMax -= inclusiveMin;
    return isInteger(inclusiveMin) && isInteger(exclusiveMax) ? randomIntegerEmitter(inclusiveMin, exclusiveMax) : randomDecimalEmitter(inclusiveMin, exclusiveMax);
  }

  function rangeEmitter(inclusiveStart, inclusiveEnd, step) {
    return function (next, done, context) {
      var i = inclusiveStart - step;
      if (inclusiveStart < inclusiveEnd) while (context.active && (i += step) <= inclusiveEnd) {
        next(i);
      } else while (context.active && (i += step) >= inclusiveEnd) {
        next(i);
      }
      done();
    };
  }

  function repeatDynamicEmitter(repeater) {
    return function (next, done, context) {
      var index = 0,
          result = undefined;

      while (context.active && false !== (result = repeater(index++, context.data))) {
        next(result);
      }

      done();
    };
  }

  function repeatStaticEmitter(value) {
    return function (next, done, context) {
      while (context.active) {
        next(value);
      }

      done();
    };
  }

  function repeatEmitter(value) {
    return isFunction(value) ? repeatDynamicEmitter(value) : repeatStaticEmitter(value);
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
        }, function (error) {
          if (!idle) next(result);
          done(error);
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
          return result = reducer(result, value, index++, context.data);
        }, function (error) {
          next(result);
          done(error);
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
        }, function (error) {
          if (!idle) next(result);
          done(error);
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

  function delayDynamicOperator(selector) {
    return function (emitter) {
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
          setTimeout(function () {
            return resolve(next(value));
          }, mathMax(interval, 0));
        }, function (error) {
          completition -= dateNow();
          setTimeout(function () {
            return resolve(done(error));
          }, mathMax(completition, 0));
        }, context);
      };
    };
  }

  function delayStaticOperator(interval) {
    return function (emitter) {
      return function (next, done, context) {
        return emitter(function (value) {
          return setTimeout(function () {
            return next(value);
          }, interval);
        }, function (error) {
          return setTimeout(function () {
            return done(error);
          }, interval);
        }, context);
      };
    };
  }

  function delayOperator(condition) {
    return isFunction$1(condition) ? delayDynamicOperator(condition) : isDate(condition) ? delayDynamicOperator(function () {
      return mathMax(condition - new Date(), 0);
    }) : delayStaticOperator(mathMax(+condition || 0, 0));
  }

  function dumpToConsoleOperator(prefix) {
    return function (emitter) {
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
  }

  function dumpToLoggerOperator(prefix, logger) {
    return function (emitter) {
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
  }

  function dumpOperator(prefix, logger) {
    return isFunction$1(prefix) ? dumpToLoggerOperator('', prefix) : isFunction$1(logger) ? dumpToLoggerOperator(prefix, logger) : isNothing$1(prefix) ? dumpToConsoleOperator('') : dumpToConsoleOperator(prefix);
  }

  function everyOperator(condition) {
    var predicate = isFunction$1(condition) ? condition : isRegExp(condition) ? function (value) {
      return condition.test(value);
    } : function (value) {
      return value === condition;
    };
    return function (emitter) {
      return function (next, done, context) {
        var idle = true,
            result = true;
        context = context.spawn();
        emitter(function (value) {
          idle = false;
          if (!predicate(value)) return;
          result = false;
          context.done();
        }, function (error) {
          next(result && !idle);
          done(error);
        }, context);
      };
    };
  }

  function filterOperator(condition) {
    var predicate = isFunction$1(condition) ? condition : isRegExp(condition) ? function (value) {
      return condition.test(value);
    } : isNothing$1(condition) ? function (value) {
      return !!value;
    } : function (value) {
      return value === condition;
    };
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        emitter(function (value) {
          if (predicate(value, index++, context.data)) next(value);
        }, done, context);
      };
    };
  }

  function joinOperator(separator, optional) {
    var joiner = isFunction$1(separator) ? separator : isNothing$1(separator) ? function () {
      return ',';
    } : function () {
      return separator;
    };
    return (optional ? reduceOptionalOperator : reduceGeneralOperator)(function (result, value, index, data) {
      return result.length ? result + joiner(value, index, data) + value : value;
    }, '');
  }

  function mapOperator(mapping) {
    if (isNothing$1(mapping)) return identity$1;
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
          return result.push(value);
        }, function (error) {
          next(result);
          done(error);
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
          if (++index >= count) next(value);
        }, done, context);
      };
    };
  }

  function skipLastOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (value) {
          for (var index = -1, limit = value.length - count; ++index < limit;) {
            next(value[index]);
          }
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
          if (!skipping) next(value);
        }, done, context);
      };
    };
  }

  function skipOperator(condition) {
    return arguments.length ? isNumber(condition) ? condition === 0 ? identity : condition > 0 ? skipFirstOperator(condition) : skipLastOperator(-condition) : isFunction$1(condition) ? skipWhileOperator(condition) : condition ? skipAllOperator() : identity : skipAllOperator();
  }

  function someOperator(condition) {
    var predicate = isFunction$1(condition) ? condition : isRegExp(condition) ? function (value) {
      return condition.test(value);
    } : function (value) {
      return value === condition;
    };
    return function (emitter) {
      return function (next, done, context) {
        var result = false;
        context = context.spawn();
        emitter(function (value) {
          if (!predicate(value)) return;
          result = true;
          context.done();
        }, function (error) {
          next(result);
          done(error);
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
        var index = 1;
        context = context.spawn();
        emitter(function (value) {
          next(value);
          if (count <= index++) context.done();
        }, done, context);
      };
    };
  }

  function takeLastOperator(count) {
    return function (emitter) {
      return function (next, done, context) {
        return toArrayOperator()(emitter)(function (value) {
          var limit = value.length;
          var index = mathMax(limit - 1 - count, 0);

          while (index < limit) {
            next(value[index++]);
          }
        }, done, context);
      };
    };
  }

  function takeWhileOperator(predicate) {
    return function (emitter) {
      return function (next, done, context) {
        var index = 0;
        context = context.spawn();
        emitter(function (value) {
          if (predicate(value, index++, context.data)) next(value);else context.done();
        }, done, context);
      };
    };
  }

  function takeOperator(condition) {
    return arguments.length ? isNumber(condition) ? condition === 0 ? emptyEmitter() : condition > 0 ? takeFirstOperator(condition) : takeLastOperator(condition) : isFunction$1(condition) ? takeWhileOperator(condition) : condition ? identity$1 : emptyEmitter() : identity$1;
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
  }

  function toMapOperator(keyTransformation, valueTransformation) {
    var keyTransformer = isNothing(keyTransformation) ? identity$1 : isFunction$1(keyTransformation) ? keyTransformation : constant(keyTransformation);
    var valueTransformer = isNothing(valueTransformation) ? identity$1 : isFunction$1(valueTransformation) ? valueTransformation : constant(valueTransformation);
    return function (emitter) {
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
  }

  function toSetOperator() {
    return function (emitter) {
      return function (next, done, context) {
        var result = new Set();
        emitter(function (value) {
          result.add(value);
        }, function (error) {
          next(result);
          done(error);
        }, context);
      };
    };
  }

  var CALLBACKS = Symbol('callbacks');
  var DONE = Symbol('done');

  var Context = function () {
    function Context(flow, data) {
      _classCallCheck(this, Context);

      objectDefineProperties(this, {
        data: {
          value: data
        },
        flow: {
          value: flow
        }
      });
    }

    _createClass(Context, [{
      key: 'done',
      value: function done() {
        if (this[DONE]) return false;
        objectDefineProperty(this, DONE, {
          value: true
        });
        var callbacks = this[CALLBACKS];

        if (callbacks) {
          callbacks.forEach(function (callback) {
            return callback();
          });
          callbacks.length = 0;
        }

        return true;
      }
    }, {
      key: 'spawn',
      value: function spawn() {
        var context = new Context(this.flow, this.data);
        this.track(function () {
          return context.done();
        });
        return context;
      }
    }, {
      key: 'track',
      value: function track(callback) {
        if (!isFunction$1(callback)) return;
        if (this[DONE]) callback();else {
          var callbacks = this[CALLBACKS];
          if (callbacks) callbacks.push(callback);else objectDefineProperty(this, CALLBACKS, {
            value: [callback]
          });
        }
      }
    }, {
      key: 'active',
      get: function get() {
        return !this[DONE];
      }
    }]);

    return Context;
  }();

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

    return aeroflow.apply(undefined, [this].concat(sources));
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
    for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      sources[_key3] = arguments[_key3];
    }

    return aeroflow.apply(undefined, sources.concat([this]));
  }

  function reduce(reducer, seed, optional) {
    return this.chain(reduceOperator(reducer, seed, optional));
  }

  function run(next, done, data) {
    if (!isFunction$1(done)) done = noop;
    if (!isFunction$1(next)) next = noop;
    var context = new Context(this, data),
        emitter = this.emitter;
    setImmediate(function () {
      var index = 0;
      emitter(function (value) {
        next(value, index++, context);
      }, function (error) {
        context.done();
        done(error, index, context);
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

  var operators = objectCreate(null, {
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
    if (isNothing$1(source)) return valueEmitter(source);
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

    for (var i = -1, l = sources.length; context.active && ++i < l;) {
      adapt(sources[i])(next, noop, context);
    }

    done();
  }

  function aeroflow() {
    for (var _len4 = arguments.length, sources = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      sources[_key4] = arguments[_key4];
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

  function random(inclusiveMin, exclusiveMax) {
    return new Aeroflow(randomEmitter(inclusiveMin, exclusiveMax));
  }

  function range(inclusiveStart, inclusiveEnd, step) {
    return new Aeroflow(rangeEmitter(inclusiveStart, inclusiveEnd, step));
  }

  function repeat(value) {
    return new Aeroflow(repeatEmitter(value));
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
    }
  });
  exports.default = aeroflow;
  module.exports = exports['default'];
});
