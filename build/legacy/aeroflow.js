(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.aeroflow = mod.exports;
  }
})(this, function (exports) {
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
  var CLASS = Symbol.toStringTag;
  var DATE = 'Date';
  var EMITTER = Symbol('emitter');
  var FUNCTION = 'Function';
  var ITERATOR = Symbol.iterator;
  var PROMISE = 'Promise';
  var PROTOTYPE = 'prototype';

  var classOf = function classOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };

  var classIs = function classIs(className) {
    return function (value) {
      return classOf(value) === className;
    };
  };

  var dateNow = Date.now;
  var isDate = classIs(DATE);
  var isFunction$1 = classIs(FUNCTION);
  var isInteger = Number.isInteger;

  var isNothing = function isNothing(value) {
    return value == null;
  };

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

  function valueEmitter(value) {
    return function (next, done) {
      next(value);
      done();
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

  function countOperator() {
    return function (emitter) {
      return reduceGeneralOperator(emitter, function (result) {
        return result + 1;
      }, 0);
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

  function delayDynamicOperator(emitter, selector) {
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

  function delayStaticOperator(emitter, interval) {
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

  function dumpOperator(prefix, logger) {
    return arguments.length === 0 ? dumpToConsoleEmitter('') : arguments.length === 1 ? isFunction$1(prefix) ? dumpToLoggerEmitter('', prefix) : dumpToConsoleEmitter('') : isFunction$1(logger) ? isNothing(prefix) ? dumpToLoggerEmitter('', logger) : dumpToLoggerEmitter(prefix, logger) : dumpToConsoleEmitter(prefix);
  }

  function expandEmitter(expander, seed) {
    return function (next, done, context) {
      var index = 0,
          value = seed;

      while (context.active) {
        next(value = expander(value, index++, context.data));
      }

      done();
    };
  }

  function functionEmitter(source) {
    return function (next, done, context) {
      return next(source(context.data));
    };
  }

  function iterableEmitter(source) {
    return function (next, done, context) {
      var iterator = source[ITERATOR]();
      var iteration = undefined;

      while (context.active && !(iteration = iterator.next()).done) {
        next(iteration.value);
      }

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

  var CALLBACKS = Symbol('callbacks');
  var COMPLETED = Symbol('completed');

  var Context = function () {
    function Context(flow, data) {
      var _objectDefineProperti;

      _classCallCheck(this, Context);

      objectDefineProperties(this, (_objectDefineProperti = {}, _defineProperty(_objectDefineProperti, CALLBACKS, {
        value: []
      }), _defineProperty(_objectDefineProperti, 'data', {
        value: data
      }), _defineProperty(_objectDefineProperti, 'flow', {
        value: flow
      }), _objectDefineProperti));
    }

    _createClass(Context, [{
      key: 'done',
      value: function done() {
        if (this[COMPLETED]) return false;
        objectDefineProperty(this[COMPLETED], {
          value: true
        });
        var callbacks = this[CALLBACKS];
        callbacks.forEach(function (callback) {
          return callback();
        });
        this[CALLBACKS].length = 0;
        return true;
      }
    }, {
      key: 'spawn',
      value: function spawn() {
        if (this[COMPLETED]) return;
        var context = new Context(this.flow, this.data);
        this[CALLBACKS].push(function () {
          return context.done();
        });
        return context;
      }
    }, {
      key: 'track',
      value: function track(callback) {
        if (!isFunction$1(callback)) return;
        if (this[COMPLETED]) callback();else this[CALLBACKS].push(callback);
      }
    }, {
      key: 'active',
      get: function get() {
        return !this[COMPLETED];
      }
    }]);

    return Context;
  }();

  var Aeroflow = function Aeroflow(emitter) {
    _classCallCheck(this, Aeroflow);

    objectDefineProperty(this, EMITTER, {
      value: emitter
    });
  };

  function append() {
    for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }

    return aeroflow.apply(undefined, [this].concat(sources));
  }

  function chain(operator) {
    return new Aeroflow(operator(this[EMITTER]));
  }

  function count() {
    return this.chain(countOperator());
  }

  function delay(condition) {
    return this.chain(delayOperator(condition));
  }

  function dump(prefix, logger) {
    return dumpOperator(prefix, logger);
  }

  function prepend() {
    for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      sources[_key2] = arguments[_key2];
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
        emitter = this[EMITTER];
    setImmediate(function () {
      var index = 0;
      emitter(function (value) {
        return next(value, index++, context);
      }, function (error) {
        context.done();
        done(error, index, context);
      }, context);
    });
    return this;
  }

  var operators = objectCreate(null);
  Aeroflow[PROTOTYPE] = objectCreate(operators, (_objectCreate = {}, _defineProperty(_objectCreate, CLASS, {
    value: AEROFLOW
  }), _defineProperty(_objectCreate, 'append', {
    configurable: true,
    value: append,
    writable: true
  }), _defineProperty(_objectCreate, 'chain', {
    value: chain
  }), _defineProperty(_objectCreate, 'count', {
    configurable: true,
    value: count,
    writable: true
  }), _defineProperty(_objectCreate, 'dump', {
    configurable: true,
    value: dump,
    writable: true
  }), _defineProperty(_objectCreate, 'prepend', {
    configurable: true,
    value: prepend,
    writable: true
  }), _defineProperty(_objectCreate, 'reduce', {
    configurable: true,
    value: reduce,
    writable: true
  }), _defineProperty(_objectCreate, 'run', {
    value: run
  }), _objectCreate));
  var adapters = objectCreate(null, (_objectCreate2 = {}, _defineProperty(_objectCreate2, ARRAY, {
    configurable: true,
    value: arrayEmitter,
    writable: true
  }), _defineProperty(_objectCreate2, FUNCTION, {
    configurable: true,
    value: functionEmitter,
    writable: true
  }), _defineProperty(_objectCreate2, PROMISE, {
    configurable: true,
    value: promiseEmitter,
    writable: true
  }), _objectCreate2));

  function emit() {
    for (var _len3 = arguments.length, sources = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      sources[_key3] = arguments[_key3];
    }

    switch (sources.length) {
      case 0:
        return emptyEmitter();

      case 1:
        var source = sources[0],
            sourceClass = classOf(source);
        if (sourceClass === AEROFLOW) return source[EMITTER];
        var adapter = adapters[sourceClass];
        if (isFunction$1(adapter)) return adapter(source);
        if (source && ITERATOR in source) return iterableEmitter(source);
        return valueEmitter(source);

      default:
        return function (next, done, context) {
          var index = -1;

          var limit = sources.length,
              proceed = function proceed() {
            return context.active && ++index < limit ? emit(sources[index])(next, proceed, context) : done();
          };

          proceed();
        };
    }
  }

  function aeroflow() {
    return new Aeroflow(emit.apply(undefined, arguments));
  }

  function create(emitter) {
    return new Aeroflow(customEmitter(emitter));
  }

  function expand(expander, seed) {
    return new Aeroflow(expandEmitter(expander, seed));
  }

  function just(value) {
    return new Aeroflow(just(value));
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
  exports.delay = delay;
  exports.default = aeroflow;
});
