(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aeroflow = factory());
}(this, function () { 'use strict';

  const AEROFLOW = 'Aeroflow';
  const ARRAY = 'Array';
  const BOOLEAN = 'Boolean';
  const CLASS = Symbol.toStringTag;
  const DATE = 'Date';
  const ERROR = 'Error';
  const FUNCTION = 'Function';
  const ITERATOR = Symbol.iterator;
  const NULL = 'Null';
  const NUMBER = 'Number';
  const PROMISE = 'Promise';
  const PROTOTYPE = 'prototype';
  const REGEXP = 'RegExp';
  const STRING = 'String';
  const SYMBOL = 'Symbol';
  const UNDEFINED = 'Undefined';

  const dateNow = Date.now;
  const mathFloor = Math.floor;
  const mathPow = Math.pow;
  const mathRandom = Math.random;
  const mathMax = Math.max;
  const maxInteger = Number.MAX_SAFE_INTEGER;
  const objectCreate = Object.create;
  const objectDefineProperties = Object.defineProperties;
  const objectToString = Object.prototype.toString;

  const compare = (left, right, direction) => left < right
    ? -direction
    : left > right
      ? direction
      : 0;
  const constant = value => () => value;
  const identity = value => value;
  const noop = () => {};

  const classOf = value => objectToString.call(value).slice(8, -1);
  const classIs = className => value => classOf(value) === className;

  const isError$1 = classIs(ERROR);
  const isFunction = classIs(FUNCTION);
  const isInteger = Number.isInteger;
  const isNumber = classIs(NUMBER);
  const isUndefined = value => value === undefined;

  const tie = (func, ...args) => () => func(...args);

  const toNumber = (value, def) => {
    if (!isNumber(value)) {
      value = +value;
      if (isNaN(value)) return def;
    }
    return value;
  };

  const toError = value => isError$1(value)
    ? value
    : new Error(value);

  function emptyEmitter() {
    return (next, done) => done();
  }

  function unsync$1(result, next, done) {
    switch (result) {
      case true:
        return false;
      case false:
        done(false);
        return true;
    }
    switch (classOf(result)) {
      case PROMISE:
        result.then(
          promiseResult => {
            if (!unsync$1(promiseResult, next, done)) next(true);
          },
          promiseError => done(toError(promiseError)));
        break;
      case ERROR:
        done(result);
        break;
    }
    return true;
  }

  function scalarEmitter(value) {
    return (next, done) => {
      if (!unsync$1(next(value), done, done))
        done(true);
    };
  }

  function arrayEmitter$1(source) {
    return (next, done, context) => {
      let index = -1;
      !function proceed() {
        while (++index < source.length)
          if (unsync$1(next(source[index]), proceed, done))
            return;
        done(true);
      }();
    };
  }

  function functionEmitter(source) {
    return (next, done, context) => {
      try {
        if (!unsync$1(next(source(context.data)), done, done))
          done(true);
      }
      catch(error) {
        done(error);
      }
    };
  }

  function promiseEmitter(source) {
    return (next, done, context) => source.then(
      result => {
        if (!unsync$1(next(result), done, done))
          done(true);
      },
      result => done(toError(result)));
  }

  const adapters = objectCreate(null, {
    [ARRAY]: { value: arrayEmitter$1, writable: true },
    [FUNCTION]: { value: functionEmitter, writable: true },
    [PROMISE]: { value: promiseEmitter, writable: true }
  });

  function iterableEmitter(source) {
    return (next, done, context) => {
      let iteration, iterator = iterator = source[ITERATOR]();
      !function proceed() {
        while (!(iteration = iterator.next()).done)
          if (unsync$1(next(iteration.value), proceed, done))
            return;
        done(true);
      }();
    };
  }

  const primitives = new Set([BOOLEAN, NULL, NUMBER, STRING, SYMBOL, UNDEFINED]);

  function adapterEmitter(source, scalar) {
    const cls = classOf(source);
    if (cls === AEROFLOW)
      return source.emitter;
    const adapter = adapters[cls];
    if (isFunction(adapter))
      return adapter(source);
    if (!primitives.has(cls) && ITERATOR in source)
      return iterableEmitter(source);
    if (scalar)
      return scalarEmitter(source);
  }

  function customEmitter(emitter) {
    if (isUndefined(emitter))
      return emptyEmitter();
    if (!isFunction(emitter))
      return scalarEmitter(emitter);
    return (next, done, context) => {
      let buffer = [], completed = false, finalizer, waiting = false;
      finalizer = emitter(accept, finish, context);
      function accept(result) {
        buffer.push(result);
        proceed();
      }
      function finish(result) {
        if (completed) return;
        completed = true;
        if (isFunction(finalizer)) setTimeout(finalizer, 0);
        if (isUndefined(result)) result = true;
        done(result);
      }
      function proceed() {
        waiting = false;
        while (buffer.length) if (unsync$1(next(buffer.shift()), proceed, finish)) {
          waiting = true;
          return;
        }
      }
    };
  }

  function errorEmitter(message) {
    return (next, done) => done(isError$1(message)
      ? message
      : new Error(message));
  }

  function expandEmitter(expanding, seed) {
    const expander = isFunction(expanding)
      ? expanding
      : constant(expanding);
    return (next, done, context) => {
      let index = 0, value = seed;
      !function proceed() {
        while (!unsync$1(next(expander(value, index++, context.data))), proceed, done);
      }();
    };
  }

  function randomEmitter(minimum, maximum) {
    maximum = toNumber(maximum, 1 - mathPow(10,-15));
    minimum = toNumber(minimum, 0);
    maximum -= minimum;
    const rounder = isInteger(minimum) && isInteger(maximum)
      ? mathFloor
      : identity;
    return (next, done) => {
      !function proceed() {
        while (!unsync$1(next(rounder(minimum + maximum * mathRandom())), proceed, done));
      }();
    };
  }

  function rangeEmitter(start, end, step) {
    end = toNumber(end, maxInteger);
    start = toNumber(start, 0);
    if (start === end) return scalarEmitter(start);
    const down = start < end;
    if (down) {
      step = toNumber(step, 1);
      if (step < 1) return scalarEmitter(start);
    }
    else {
      step = toNumber(step, -1);
      if (step > -1) return scalarEmitter(start);
    }
    const limiter = down
      ? value => value <= end
      : value => value >= end;
    return (next, done, context) => {
      let value = start - step;
      !function proceed() {
        while (limiter(value += step))
          if (unsync$1(next(value), proceed, done))
            return;
        done(true);
      }();
    };
  }

  function repeatEmitter(value) {
    const repeater = isFunction(value)
      ? value
      : constant(value);
    return (next, done, context) => {
      let index = 0;
      !function proceed() {
        while (!unsync$1(next(repeater(index++, context.data)), proceed, done));
      }();
    };
  }

  function timerEmitter(interval) {
    if (!isFunction(interval)) interval = constant(interval);
    return (next, done, context) => {
      let index = 0;
      !function proceed(result) {
        setTimeout(() => {
          if (!unsync$1(next(new Date), proceed, done)) proceed();
        }, toNumber(interval(index++), 1000));
      }();
    };
  }

  function reduceAlongOperator(reducer) {
    return emitter => (next, done, context) => {
      let empty = true, index = 1, reduced;
      emitter(
        result => {
          if (empty) {
            empty = false;
            reduced = result;
          }
          else reduced = reducer(reduced, result, index++, context.data);
          return true;
        },
        result => {
          if (isError$1(result) || empty || !unsync$1(next(reduced), tie(done, result), done))
            done(result);
        },
        context);
    };
  }

  function reduceGeneralOperator(reducer, seed) {
    return emitter => (next, done, context) => {
      let index = 0, reduced = seed;
      emitter(
        result => {
          reduced = reducer(reduced, result, index++, context.data)
          return true;
        },
        result => {
          if (isError$1(result) || !unsync$1(next(reduced), tie(done, result), done))
            done(result);
        },
        context);
    };
  }

  function reduceOptionalOperator(reducer, seed) {
    return emitter => (next, done, context) => {
      let empty = true, index = 0, reduced = seed;
      emitter(
        result => {
          empty = false;
          reduced = reducer(reduced, result, index++, context.data);
          return true;
        },
        result => {
          if (isError$1(error) || empty || !unsync$1(next(reduced), tie(done, result), done))
            done(result);
        },
        context);
    };
  }

  function reduceOperator(reducer, seed, optional) {
    return isUndefined(reducer)
      ? emptyEmitter
      : !isFunction(reducer)
        ? () => scalarEmitter(reducer)
        : isUndefined(seed)
          ? reduceAlongOperator(reducer)
          : optional
            ? reduceOptionalOperator(reducer, seed)
            : reduceGeneralOperator(reducer, seed);
  }

  function countOperator(optional) {
    const reducer = optional
      ? reduceOptionalOperator
      : reduceGeneralOperator;
    return reducer(result => result + 1, 0);
  }

  function delayOperator(interval) {
    const delayer = isFunction(interval)
      ? interval
      : constant(interval);
    return emitter => (next, done, context) => {
      let index = 0;
      return emitter(
        result => {
          let interval = delayer(result, index++, context.data);
          switch (classOf(interval)) {
            case DATE:
              interval = interval - dateNow();
              break;
            case NUMBER:
              break;
            default:
              interval = +interval;
              break;
          }
          if (interval < 0) interval = 0;
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (!unsync$1(next(result), resolve, reject)) resolve(true);
            }, interval);
          });
        },
        done,
        context);
    }
  }

  function dumpToConsoleOperator(prefix) {
    return emitter => (next, done, context) => emitter(
      result => {
        console.log(prefix + 'next', result);
        return next(result);
      },
      result => {
        console[isError$1(result) ? 'error' : 'log'](prefix + 'done', result);
        done(result);
      },
      context);
  }

  function dumpToLoggerOperator(prefix, logger) {
    return emitter => (next, done, context) => emitter(
      result => {
        logger(prefix + 'next', result);
        return next(result);
      },
      result => {
        logger(prefix + 'done', result);
        done(result);
      },
      context);
  }

  function dumpOperator(prefix, logger) {
    return isFunction(prefix)
      ? dumpToLoggerOperator('', prefix)
      : isFunction(logger)
        ? dumpToLoggerOperator(prefix, logger)
        : isUndefined(prefix)
          ? dumpToConsoleOperator('')
          : dumpToConsoleOperator(prefix);
  }

  function everyOperator(condition) {
    let predicate;
    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;
      case REGEXP:
        predicate = result => condition.test(result);
        break;
      case UNDEFINED:
        predicate = result => !!result;
        break;
      default:
        predicate = result => result === condition;
        break;
    }
    return emitter => (next, done, context) => {
      let empty = true, every = true;
      emitter(
        result => {
          empty = false;
          if (predicate(result)) return true;
          every = false;
          return false;
        },
        result => {
          if (isError$1(result) || !unsync$1(next(every || empty), done, done)) done(result);
        },
        context);
    };
  }

  function filterOperator(condition) {
    let predicate;
    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;
      case REGEXP:
        predicate = result => condition.test(result);
        break;
      case UNDEFINED:
        predicate = result => !!result;
        break;
      default:
        predicate = result => result === condition
        break;
    }
    return emitter => (next, done, context) => {
      let index = 0;
      emitter(
        result => !predicate(result, index++, context.data) || next(result),
        done,
        context);
    };
  }

  function flattenOperator(depth) {
    depth = toNumber(depth, maxInteger);
    if (depth < 1) return identity;
    return emitter => (next, done, context) => {
      let level = 0;
      const flatten = result => {
        if (level === depth) return next(result);
        const adapter = adapterEmitter(result, false);
        if (adapter) {
          level++;
          return new Promise(resolve => adapter(
            flatten,
            adapterResult => {
              level--;
              resolve(adapterResult);
            },
            context));
        }
        else return next(result);
      };
      emitter(flatten, done, context);
    };
  }

  function groupOperator(selectors) {
    selectors = selectors.length
      ? selectors.map(selector => isFunction(selector)
        ? selector
        : constant(selector))
      : [constant()];
    const limit = selectors.length - 1;
    return emitter => (next, done, context) => {
      let groups = new Map, index = 0;
      emitter(
        value => {
          let current, parent = groups;
          for (let i = -1; ++i <= limit;) {
            let key = selectors[i](value, index++, context.data);
            current = parent.get(key);
            if (!current) {
              current = i === limit ? [] : new Map;
              parent.set(key, current);
            }
            parent = current;
          }
          current.push(value);
          return true;
        },
        result => {
          if (isError$1(result)) done(result);
          else iterableEmitter(groups)(next, tie(done, result), context);
        },
        context);
    };
  }

  function mapOperator(mapping) {
    if (isUndefined(mapping)) return identity;
    const mapper = isFunction(mapping)
      ? mapping
      : constant(mapping);
    return emitter => (next, done, context) => {
      let index = 0;
      emitter(
        value => next(mapper(value, index++, context.data)),
        done,
        context);
    };
  }

  function maxOperator () {
    return reduceAlongOperator((maximum, value) => value > maximum ? value : maximum);
  }

  function toArrayOperator() {
    return emitter => (next, done, context) => {
      let array = [];
      emitter(
        result => {
          array.push(result);
          return true;
        },
        result => {
          if (isError$1(result) || !unsync$1(next(array), tie(done, result), done)) 
            done(result);
        },
        context);
    };
  }

  function meanOperator() {
    return emitter => (next, done, context) => toArrayOperator()(emitter)(
      values => {
        if (!values.length) return;
        values.sort();
        next(values[mathFloor(values.length / 2)]);
      },
      done,
      context);
  }

  function minOperator() {
    return reduceAlongOperator((minimum, value) => value < minimum ? value : minimum);
  }

  function reverseOperator() {
    return emitter => (next, done, context) => toArrayOperator()(emitter)(
      value => {
        for (let index = value.length; index--;) next(value[index]);
        return false;
      },
      done,
      context);
  }

  function skipAllOperator() {
    return emitter => (next, done, context) => emitter(noop, done, context);
  }

  function skipFirstOperator(count) {
    return emitter => (next, done, context) => {
      let index = -1;
      emitter(
        result => ++index < count || next(result),
        done,
        context);
    };
  }

  function skipLastOperator(count) {
    return emitter => (next, done, context) => {
      let array;
      toArrayOperator()(emitter)(
        result => {
          array = result;
          return false;
        },
        result => {
          if (isError(result)) done(result);
          else arrayEmitter(array.slice(mathMax(values.length - count, 0)))(next, done, context);
        },
        context);
    }
  }

  function skipWhileOperator(predicate) {
    return emitter => (next, done, context) => {
      let index = 0, skipping = true;
      emitter(
        value => {
          if (skipping && !predicate(value, index++, context.data)) skipping = false;
          return skipping || next(value);
        },
        done,
        context);
    };
  }

  function skipOperator(condition) {
    switch (classOf(condition)) {
      case NUMBER:
        return condition > 0
          ? skipFirstOperator(condition)
          : condition < 0
            ? skipLastOperator(-condition)
            : identity;
      case FUNCTION:
        return skipWhileOperator(condition);
      case UNDEFINED:
        return skipAllOperator();
      default:
        return condition
          ? skipAllOperator()
          : identity;
    }
  }

  function someOperator(condition) {
    let predicate;
    switch (classOf(condition)) {
      case FUNCTION:
        predicate = condition;
        break;
      case REGEXP:
        predicate = result => condition.test(result);
        break;
      case UNDEFINED:
        predicate = result => !!result;
        break;
      default:
        predicate = result => result === condition;
        break;
    }
    return emitter => (next, done, context) => {
      let some = false;
      emitter(
        result => {
          if (!predicate(result)) return true;
          some = true;
          return false;
        },
        result => {
          if (isError(result) || !unsync(next(some), done, done)) done(result);
        },
        context);
    };
  }

  function sortOperator(parameters) {
    const directions = [], selectors = [];
    let direction = 1;
    for (var i = -1, l = parameters.length; ++i < l;) {
      let parameter = parameters[i];
      switch (classOf(parameter)) {
        case FUNCTION:
          selectors.push(parameter);
          directions.push(direction);
          continue;
        case NUMBER:
          parameter = parameter > 0 ? 1 : -1;
          break;
        case STRING:
          parameter = parameter.toLowerCase() === 'desc' ? -1 : 1;
          break;
        default:
          parameter = parameter ? 1 : -1;
          break;
      }
      if (directions.length) directions[directions.length - 1] = parameter;
      else direction = parameter;
    }
    const comparer = selectors.length
      ? (left, right) => {
        let result;
        for (let i = -1, l = selectors.length; ++i < l;) {
          const selector = selectors[i];
          result = compare(selector(left), selector(right), directions[i]);
          if (result) break;
        }
        return result;
      }
      : (left, right) => compare(left, right, direction);
    return emitter => (next, done, context) => {
      let array;
      toArrayOperator()(emitter)(
        result => {
          array = result;
          return true;
        },
        result => {
          if (isError$1(result)) done(result);
          else {
            array.sort(comparer);
            arrayEmitter$1(array)(next, done, context);
          }
        },
        context);
    };
  }

  function sumOperator() {
    return reduceGeneralOperator((result, value) => result + value, 0);
  }

  function takeFirstOperator(count) {
    return emitter => (next, done, context) => {
      let index = -1;
      emitter(
        result => ++index < count && next(result),
        done,
        context);
    };
  }

  function takeLastOperator(count) {
    return emitter => (next, done, context) => {
      let array;
      toArrayOperator()(emitter)(
        result => {
          array = result;
          return false;
        },
        result => {
          if (isError(result)) done(result);
          else arrayEmitter(array)(next, done, context);
        }, 
        context);
    };
  }

  function takeWhileOperator(predicate) {
    return emitter => (next, done, context) => {
      let index = 0;
      emitter(
        value => predicate(value, index++, context.data) && next(value),
        done,
        context);
    };
  }

  function takeOperator(condition) {
    switch (classOf(condition)) {
      case NUMBER:
        return condition > 0
          ? takeFirstOperator(condition)
          : condition < 0
            ? takeLastOperator(-condition)
            : emptyEmitter();
      case FUNCTION:
        return takeWhileOperator(condition);
      default:
        return condition
          ? identity
          : emptyEmitter();
    }
  }

  function tapOperator(callback) {
    return emitter => isFunction(callback)
      ? (next, done, context) => {
        let index = 0;
        emitter(
          result => {
            callback(result, index++, context.data);
            return next(result);
          },
          done,
          context);
      }
      : emitter;
  }

  function toMapOperator(keyTransformation, valueTransformation) {
    const keyTransformer = isUndefined(keyTransformation)
      ? identity
      : isFunction(keyTransformation)
        ? keyTransformation
        : constant(keyTransformation);
    const valueTransformer = isUndefined(valueTransformation)
      ? identity
      : isFunction(valueTransformation)
        ? valueTransformation
        : constant(valueTransformation);
    return emitter=> (next, done, context) => {
      let index = 0, map = new Map;
      emitter(
        result => {
          map.set(
            keyTransformer(result, index++, context.data),
            valueTransformer(result, index++, context.data));
          return true;
        },
        result => {
          if (isError$1(result) || !desync(next(map), tie(done, result), done))
            done(result);
        },
        context);
    };
  }

  function toSetOperator() {
    return emitter => (next, done, context) => {
      let set = new Set;
      emitter(
        result => {
          set.add(result);
          return true;
        },
        result => {
          if (isError$1(result) || !unsync$1(next(set), tie(done, result), done))
            done(result);
        },
        context);
    };
  }

  function toStringOperator(separator, optional) {
    const joiner = isUndefined(separator)
      ? constant(',')
      : isFunction(separator)
        ? separator
        : constant(separator);
    const reducer = optional
      ? reduceOptionalOperator
      : reduceGeneralOperator;
    return reducer((result, value, index, data) =>
      result.length
        ? result + joiner(value, index, data) + value
        : '' + value,
      '');
  }

  /**
  Aeroflow class.

  @public @class @alias Aeroflow
  */
  class Aeroflow {
    constructor(emitter, sources) {
      objectDefineProperties(this, {
        emitter: { value: emitter },
        sources: { value: sources }
      });
    }
  }
  /**
  Returns new flow emitting values from this flow first 
  and then from all provided sources without interleaving them.

  @alias Aeroflow#append

  @param {...any} [sources] Data sources to append to this flow.

  @return {Aeroflow}
  New flow emitting all values emitted by this flow first
  and then all provided values.

  @example
  aeroflow(1).append(2, [3, 4], new Promise(resolve => setTimeout(() => resolve(5), 500))).dump().run();
  // next 1
  // next 2
  // next 3
  // next 4
  // next 5 // after 500ms
  // done
  */
  function append(...sources) {
    return new Aeroflow(this.emitter, this.sources.concat(sources));
  }
  /**
  @alias Aeroflow#bind

  @example
  aeroflow().dump().bind(1, 2, 3).run();
  // next 1
  // next 2
  // next 3
  // done true
  aeroflow([1, 2, 3]).dump().bind([4, 5, 6]).run();
  // next 4
  // next 5
  // next 6
  // done true
  */
  function bind(...sources) {
    return new Aeroflow(this.emitter, sources);
  }
  function chain(operator) {
    return new Aeroflow(operator(this.emitter), this.sources);
  }
  /**
  Counts the number of values emitted by this flow, returns new flow emitting only this value.

  @alias Aeroflow#count

  @example
  aeroflow().count().dump().run();
  // next 0
  // done
  aeroflow(['a', 'b', 'c']).count().dump().run();
  // next 3
  // done
  */
  function count(optional) {
    return this.chain(countOperator(optional));
  }
  /**
  Returns new flow delaying emission of each value accordingly provided condition.

  @alias Aeroflow#delay

  @param {number|date|function} [interval]
  The condition used to determine delay for each subsequent emission.
  Number is threated as milliseconds interval (negative number is considered as 0).
  Date is threated as is (date in past is considered as now).
  Function is execute for each emitted value, with three arguments:
    value - The current value emitted by this flow
    index - The index of the current value
    context - The context object
  The result of condition function will be converted nu number and used as milliseconds interval.

  @example:
  aeroflow(1, 2).delay(500).dump().run();
  // next 1 // after 500ms
  // next 2 // after 500ms
  // done true // after 500ms
  aeroflow(1, 2).delay(new Date(Date.now() + 500)).dump().run();
  // next 1 // after 500ms
  // next 2
  // done true
  aeroflow(1, 2).delay((value, index) => 500 + 500 * index).dump().run();
  // next 1 // after 500ms
  // next 2 // after 1500ms
  // done true
    */
  function delay(interval) {
    return this.chain(delayOperator(interval));
  }
  /**
  Dumps all events (next, done) emitted by this flow to the logger with optional prefix.

  @alias Aeroflow#dump

  @param {string} [prefix='']
  A string prefix to prepend to each event name.

  @param {function} [logger=console.log]
  Function to execute for each event emitted, taking two arguments:
  name - The name of event emitted by this flow prepended with prefix.
  value - The value of event emitted by this flow.

  @example
  aeroflow(1, 2).dump('test ', console.info.bind(console)).run();
  // test next 1
  // test next 2
  // test done true
  */
  function dump(prefix, logger) {
    return this.chain(dumpOperator(prefix, logger));
  }
  /**
  Tests whether all values emitted by this flow pass the provided test.

  @alias Aeroflow#every

  @param {function|regexp|any} [predicate]
  The predicate function or regular expression to test each emitted value with,
  or scalar value to compare emitted values with.
  If omitted, default (truthy) predicate is used.

  @return {Aeroflow}
  New flow emitting true if all emitted values pass the test; otherwise, false.

  @example
  aeroflow().every().dump().run();
  // next true
  // done true
  aeroflow('a', 'b').every('a').dump().run();
  // next false
  // done false
  aeroflow(1, 2).every(value => value > 0).dump().run();
  // next true
  // done true
  */
  function every(condition) {
    return this.chain(everyOperator(condition));
  }
  /**
  Filters values emitted by this flow with the provided test.

  @alias Aeroflow#filter

  @param {function|regexp|any} [predicate]
  The predicate function or regular expression to test each emitted value with,
  or scalar value to compare emitted values with.
  If omitted, default (truthy) predicate is used.

  @return {Aeroflow}
  New flow emitting only values passing the provided test.

  @example
  aeroflow(0, 1).filter().dump().run();
  // next 1
  // done true
  aeroflow('a', 'b', 'a').filter('a').dump().run();
  // next "a"
  // next "a"
  // done true
  aeroflow('a', 'b', 'a').filter(/a/).dump().run();
  // next "b"
  // next "b"
  // done true
  aeroflow(1, 2, 3, 4, 5).filter(value => (value % 2) === 0).dump().run();
  // next 2
  // next 4
  // done true
  */
  function filter(condition) {
    return this.chain(filterOperator(condition)); 
  }
  /*
  @alias Aeroflow#group

  @example
  aeroflow.range(1, 10).group(value => (value % 2) ? 'odd' : 'even').dump().run();
  // next ["odd", Array[5]]
  // next ["even", Array[5]]
  // done true
  aeroflow(
    { country: 'Belarus', city: 'Brest' },
    { country: 'Poland', city: 'Krakow' },
    { country: 'Belarus', city: 'Minsk' },
    { country: 'Belarus', city: 'Grodno' },
    { country: 'Poland', city: 'Lodz' }
  ).group(value => value.country, value => value.city).dump().run();
  // next ["Belarus", {{"Brest" => Array[1]}, {"Minsk" => Array[1]}, {"Grodno" => Array[1]}}]
  // next ["Poland", {{"Krakow" => Array[1]}, {"Lodz" => Array[1]}}]
  // done
  */
  function group(...selectors) {
    return this.chain(groupOperator(selectors));
  }
  /**
  @example
  aeroflow([[1, 2]]).flatten().dump().run();
  // next 1
  // next 2
  // done true
  aeroflow(() => [[1], [2]]).flatten(1).dump().run();
  // next [1]
  // next [2]
  // done true
  aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500))).flatten().dump().run();
  // next 1 // after 500ms
  // next 2
  // done true
  aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500))).flatten(1).dump().run();
  // next [1, 2]
  // done true
  */
  function flatten(depth) {
    return this.chain(flattenOperator(depth));
  }
  /**
  aeroflow(1, 2).map('test').dump().run();
  // next test
  // next test
  // done true
  aeroflow(1, 2).map(value => value * 10).dump().run();
  // next 10
  // next 20
  // done true
  */
  function map(mapping) {
    return this.chain(mapOperator(mapping));
  }
  /**
  Determines the maximum value emitted by this flow.

  @alias Aeroflow#max

  @return
  New flow emitting the maximum value only.

  @example
  aeroflow([1, 3, 2]).max().dump().run();
  // next 3
  // done
    */
  function max() {
    return this.chain(maxOperator());
  }
  /**
  Determines the mean value emitted by this flow.

  @alias Aeroflow#mean

  @return
  New flow emitting the mean value only.

  @example
  aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
  // next 3
  // done
    */
  function mean() {
    return this.chain(meanOperator());
  }
  /**
  Determines the minimum value emitted by this flow.

  @alias Aeroflow#min

  @return
  New flow emitting the minimum value only.

  @example
  aeroflow([2, 1, 3]).min().dump().run();
  // next 1
  // done
    */
  function min() {
    return this.chain(minOperator());
  }
  /**
  Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.

  @alias Aeroflow#prepend

  @param {...any} [sources] Values to concatenate with this flow.

  @example
  aeroflow(1).prepend(2, [3, 4], new Promise(resolve => setTimeout(() => resolve(5), 500))).dump().run();
  // next 2
  // next 3
  // next 4
  // next 5 // after 500ms
  // next 1
  // done
  */
  function prepend(...sources) {
    return new Aeroflow(this.emitter, sources.concat(this.sources));
  }
  /**
  Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,
  returns new flow emitting reduced value.

  @alias Aeroflow#reduce

  @param {function|any} reducer Function to execute on each emitted value, taking four arguments:
    result - the value previously returned in the last invocation of the reducer, or seed, if supplied
    value - the current value emitted by this flow
    index - the index of the current value emitted by the flow
    context.data.
    If is not a function, a flow emitting just reducer value will be returned.
  @param {any} initial Value to use as the first argument to the first call of the reducer.

  @example
  aeroflow([2, 4, 8]).reduce((product, value) => product value, 1).dump().run();
  // next 64
  // done
  aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
  // next a0b1c2
  // done
  */
  function reduce(reducer, seed, optional) {
    return this.chain(reduceOperator(reducer, seed, optional));
  }
  /**
  @alias Aeroflow#reverse

   @example
   aeroflow(1, 2, 3).reverse().dump().run()
   // next 3
   // next 2
   // next 1
   // done
   aeroflow.range(1, 3).reverse().dump().run()
   // next 3
   // next 2
   // next 1
   // done
   */
  function reverse() {
    return this.chain(reverseOperator());
  }
  /**
  Runs this flow asynchronously, initiating source to emit values,
  applying declared operators to emitted values and invoking provided callbacks.
  If no callbacks provided, runs this flow for its side-effects only.

  @alias Aeroflow#run

  @param {function} [next] Callback to execute for each emitted value, taking two arguments: value, context.
  @param {function} [done] Callback to execute as emission is complete, taking two arguments: error, context.
  @param {function} [data] Arbitrary value passed to each callback invoked by this flow as context.data.

  @example
  aeroflow(1, 2, 3).run(value => console.log('next', value), error => console.log('done', error));
  // next 1
  // next 2
  // next 3
  // done true
  aeroflow(1, 2, 3).dump().run(() => false);
  // next 1
  // done false
  aeroflow(Promise.reject('test')).dump().run();
  // done Error: test(…)
  // Unhandled promise rejection Error: test(…)
  aeroflow(Promise.reject('test')).dump().run(() => {}, () => {});
  // done Error: test(…)
   */
  function run(next, done, data) {
    if (!isFunction(done)) done = result => {
      if (isError$1(result)) throw result;
    };
    if (!isFunction(next)) next = noop;
    const context = objectDefineProperties({}, {
      data: { value: data },
      flow: { value: this }
    });
    setImmediate(() => {
      try {
        context.flow.emitter(
          result => false !== next(result, data),
          result => done(result, data),
          context);
      }
      catch(err) {
        done(toError(err), data);
      }  
    });
    return this;
  }
  /**
  Skips some of the values emitted by this flow,
  returns flow emitting remaining values.

  @alias Aeroflow#skip

  @param {number|function|any} [condition] The number or predicate function used to determine how many values to skip.
    If omitted, returned flow skips all values emitting done event only.
    If zero, returned flow skips nothing.
    If positive number, returned flow skips this number of first emitted values.
    If negative number, returned flow skips this number of last emitted values.
    If function, returned flow skips emitted values while this function returns trythy value.
  @return {Aeroflow} new flow emitting remaining values.
    *
  @example
  aeroflow([1, 2, 3]).skip().dump().run();
  // done
  aeroflow([1, 2, 3]).skip(1).dump().run();
  // next 2
  // next 3
  // done
  aeroflow([1, 2, 3]).skip(-1).dump().run();
  // next 1
  // next 2
  // done
  aeroflow([1, 2, 3]).skip(value => value < 3).dump().run();
  // next 3
  // done
    */
  function skip(condition) {
    return this.chain(skipOperator(condition));
  }
  /**
  Tests whether some value emitted by this flow passes the predicate test,
  returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.

  @alias Aeroflow#some

  @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
    or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.

  @return {Aeroflow} New flow that emits true or false.

  @example
  aeroflow(0).some().dump().run();
  // next false
  // done
  aeroflow.range(1, 3).some(2).dump().run();
  // next true
  // done
  aeroflow.range(1, 3).some(value => value % 2).dump().run();
  // next true
  // done
  */
  function some(condition) {
    return this.chain(someOperator(condition));
  }
  /**
  @example
  aeroflow(3, 2, 1).sort().dump().run();
  // next 1
  // next 2
  // next 3
  // done true
  aeroflow(1, 2, 3).sort('desc').dump().run();
  // next 3
  // next 2
  // next 1
  // done true
  aeroflow(
    { country: 'Belarus', city: 'Brest' },
    { country: 'Poland', city: 'Krakow' },
    { country: 'Belarus', city: 'Minsk' },
    { country: 'Belarus', city: 'Grodno' },
    { country: 'Poland', city: 'Lodz' }
  ).sort(value => value.country, value => value.city, 'desc').dump().run();
  // next Object {country: "Belarus", city: "Minsk"}
  // next Object {country: "Belarus", city: "Grodno"}
  // next Object {country: "Belarus", city: "Brest"}
  // next Object {country: "Poland", city: "Lodz"}
  // next Object {country: "Poland", city: "Krakow"}
  // done true
  */
  function sort(...parameters) {
    return this.chain(sortOperator(parameters));
  }
  /*
  @alias Aeroflow#sum

  @example
  aeroflow([1, 2, 3]).sum().dump().run();
  */
  function sum() {
    return this.chain(sumOperator());
  }
  function take(condition) {
    return this.chain(takeOperator(condition));
  }
  /**
  Executes provided callback once per each value emitted by this flow,
  returns new tapped flow or this flow if no callback provided.

  @alias Aeroflow#tap

  @param {function} [callback] Function to execute for each value emitted, taking three arguments:
    value emitted by this flow,
    index of the value,
    context object.

  @example
  aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();
  // value: 1 index: 0
  // value: 2 index: 1
  // value: 3 index: 2
  */
  function tap(callback) {
    return this.chain(tapOperator(callback));
  }
  /**
  Collects all values emitted by this flow to array, returns flow emitting this array.

  @alias Aeroflow#toArray

  @return {Aeroflow} New flow that emits an array.

  @example
  aeroflow(1, 2, 3).toArray().dump().run();
  // next [1, 2, 3]
  // done
    */
  function toArray() {
    return this.chain(toArrayOperator());
  }
  /**
  Collects all values emitted by this flow to ES6 map, returns flow emitting this map.

  @alias Aeroflow#toMap

  @param {function|any} [keyTransformation] The mapping function used to transform each emitted value to map key,
    or scalar value to use as map key.
  @param {function|any} [valueTransformation] The mapping function used to transform each emitted value to map value,
    or scalar value to use as map value.
  @return {Aeroflow} New flow that emits a map.

  @example
  aeroflow(1, 2, 3).toMap(v => 'key' + v, true).dump().run();
  // next Map {"key1" => true, "key2" => true, "key3" => true}
  // done
  aeroflow(1, 2, 3).toMap(v => 'key' + v, v => v 10).dump().run();
  // next Map {"key1" => 10, "key2" => 20, "key3" => 30}
  // done
    */
  function toMap(keyTransformation, valueTransformation) {
     return this.chain(toMapOperator(keyTransformation, valueTransformation));
  }
  /**
  Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

  @alias Aeroflow#toSet

  @return {Aeroflow} New flow that emits a set.

  @example
  aeroflow(1, 2, 3).toSet().dump().run();
  // next Set {1, 2, 3}
  // done true
    */
  function toSet() {
    return this.chain(toSetOperator()); 
  }
  /**
  @example
  aeroflow(1, 2, 3).toString().dump().run();
  // next 1,2,3
  // done true
  aeroflow(1, 2, 3).toString(';').dump().run();
  // next 1;2;3
  // done true
  aeroflow(1, 2, 3).toString((value, index) => '-'.repeat(index + 1)).dump().run();
  // next 1--2---3
  // done true
  */
  function toString(condition, optional) {
    return this.chain(toStringOperator(condition, optional)); 
  }
  const operators = objectCreate(Object[PROTOTYPE], {
    count: { value: count, writable: true },
    delay: { value: delay, writable: true },
    dump: { value: dump, writable: true },
    every: { value: every, writable: true },
    filter: { value: filter, writable: true },
    flatten: { value: flatten, writable: true },
    group: { value: group, writable: true },
    map: { value: map, writable: true },
    max: { value: max, writable: true },
    mean: { value: mean, writable: true },
    min: { value: min, writable: true },
    reduce: { value: reduce, writable: true },
    reverse: { value: reverse, writable: true },
    skip: { value: skip, writable: true },
    some: { value: some, writable: true },
    sort: { value: sort, writable: true },
    sum: { value: sum, writable: true },
    take: { value: take, writable: true },
    tap: { value: tap, writable: true },
    toArray: { value: toArray, writable: true },
    toMap: { value: toMap, writable: true },
    toSet: { value: toSet, writable: true },
    toString: { value: toString, writable: true }
  });
  Aeroflow[PROTOTYPE] = objectCreate(operators, {
    [CLASS]: { value: AEROFLOW },
    append: { value: append },
    bind: { value: bind },
    chain: { value: chain },
    prepend: { value: prepend },
    run: { value: run }
  });

  function emit(next, done, context) {
    const sources = context.flow.sources, limit = sources.length;
    let index = -1;
    !function proceed(result) {
      if (result !== true || ++index >= limit) done(result);
      else adapterEmitter(sources[index], true)(next, proceed, context);
    }(true);
  }

  /**
  Creates new flow emitting values from all provided data sources.

  @alias aeroflow

  @param {any} sources
  Data sources.

  @example
  aeroflow().dump().run();
  // done true
  aeroflow(1, [2, 3], () => 4, new Promise(resolve => setTimeout(() => resolve(5), 500)))).dump().run();
  // next 1
  // next 2
  // next 3
  // next 4
  // next 5 // after 500ms
  // done true
  */
  function aeroflow(...sources) {
    return new Aeroflow(emit, sources);
  }
  /**
  Creates programmatically controlled flow.

  @alias aeroflow.create

  @param {function|any} emitter
  The emitter function taking three arguments:
  next - the function emitting 'next' event,
  done - the function emitting 'done' event,
  context - the execution context.

  @return {Aeroflow}
  The new flow emitting values generated by emitter function.

  @example
  aeroflow.create((next, done, context) => {
    next(1);
    next(2);
    done();
  }).dump().run();
  // next 1
  // next 2
  // done true
  */
  function create(emitter) {
    return new Aeroflow(customEmitter(emitter));
  }
  /**
  @alias aeroflow.error

  @example
  aeroflow.error('test').run();
  // Uncaught Error: test
  */
  function error$1(message) {
    return new Aeroflow(errorEmitter(message));
  }
  /**
  @alias aeroflow.expand
  */
  function expand(expander, seed) {
    return new Aeroflow(expandEmitter(expander, seed));
  }
  /**
  Creates new flow emitting the provided value only.

  @alias aeroflow.just

  @param {any} value
  The value to emit.

  @return {Aeroflow}
  The new flow emitting provided value.

  @example
  aeroflow.just([1, 2, 3]).dump().run();
  // next [1, 2, 3]
  // done
    */
  function just(value) {
    return new Aeroflow(scalarEmitter(value));
  }
  /**
  Creates new flow emitting infinite sequence of random numbers.

  @alias aeroflow.random

  @return {Aeroflow}
  The new flow emitting random numbers.

  @example
  aeroflow.random().take(3).dump().run();
  // next 0.07417976693250232
  // next 0.5904422281309957
  // next 0.792132444214075
  // done false
  aeroflow.random(1, 9).take(3).dump().run();
  // next 7
  // next 2
  // next 8
  // done false
  aeroflow.random(1.1, 8.9).take(3).dump().run();
  next 4.398837305698544
  // next 2.287970747705549
  // next 3.430788825778291
  // done false
    */
  function random(minimum, maximum) {
    return new Aeroflow(randomEmitter(minimum, maximum));
  }
  /**
  @alias aeroflow.range

  @example
  aeroflow.range().take(3).dump().run();
  // next 0
  // next 1
  // next 2
  // done false
  aeroflow.range(-3).take(3).dump().run();
  // next -3
  // next -2
  // next -1
  // done false
  aeroflow.range(1, 1).dump().run();
  // next 1
  // done true
  aeroflow.range(0, 5, 2).dump().run();
  // next 0
  // next 2
  // next 4
  // done true
  aeroflow.range(5, 0, -2).dump().run();
  // next 5
  // next 3
  // next 1
  // done true
  */
  function range(start, end, step) {
    return new Aeroflow(rangeEmitter(start, end, step));
  }
  /**
  Creates flow repeating provided value.

  @alias aeroflow.repeat

  @param {function|any} value
  Arbitrary static value to repeat;
  or function providing dynamic values and invoked with two arguments:
  index - index of the value being emitted,
   data - contextual data.

  @return {Aeroflow}
  The new flow emitting repeated values.

  @example
  aeroflow.repeat(Math.random()).take(2).dump().run();
  // next 0.7492001398932189
  // next 0.7492001398932189
  // done false
  aeroflow.repeat(() => Math.random()).take(2).dump().run();
  // next 0.46067174314521253
  // next 0.7977648684754968
  // done false
  aeroflow.repeat(index => Math.pow(2, index)).take(3).dump().run();
  // next 1
  // next 2
  // next 4
  // done false
    */
  function repeat(value) {
    return new Aeroflow(repeatEmitter(value));
  }
  /**
  @alias aeroflow.timer

  @example
  aeroflow.timer().take(3).dump().run();
  // next Wed Feb 03 2016 02:35:45 ... // after 1s
  // next Wed Feb 03 2016 02:35:46 ... // after 2s
  // next Wed Feb 03 2016 02:35:47 ... // after 2s
  // done false
  aeroflow.timer(index => 500 + index * 500).take(3).dump().run();
  // next Wed Feb 03 2016 02:37:36 ... // after 500ms
  // next Wed Feb 03 2016 02:37:37 ... // after 1000ms
  // next Wed Feb 03 2016 02:37:38 ... // after 1500ms
  // done false
  */
  function timer(interval) {
    return new Aeroflow(timerEmitter(interval));
  }
  objectDefineProperties(aeroflow, {
    adapters: { get: () => adapters },
    create: { value: create },
    empty: { enumerable: true, value: new Aeroflow(emptyEmitter()) },
    error: { value: error$1 },
    expand: { value: expand },
    just: { value: just },
    operators: { get: () => operators },
    random: { value: random },
    range: { value: range },
    repeat: { value: repeat },
    timer: { value: timer }
  });

  return aeroflow;

}));