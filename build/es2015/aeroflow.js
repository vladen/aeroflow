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

const primitives = new Set([
  BOOLEAN, NULL, NUMBER, REGEXP, STRING, SYMBOL, UNDEFINED
]);

const dateNow = Date.now;
const mathFloor = Math.floor;
const mathPow = Math.pow;
const mathRandom = Math.random;
const mathMin = Math.min;
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

const isBoolean = value => value === true || value === false;
const isDefined = value => value !== undefined;
const isError = classIs(ERROR);
const isFunction = value => typeof value == 'function';
const isInteger = Number.isInteger;
const isNumber = classIs(NUMBER);
const isPromise = classIs(PROMISE);
const isUndefined = value => value === undefined;

const tie = (func, ...args) => () => func(...args);

const falsey = () => false;
const truthy = () => true;

const toDelay = (value, def) => {
  switch (classOf(value)) {
    case DATE:
      value = value - dateNow();
      break;
    case NUMBER:
      break;
    default:
      value = +value;
      break;
  }
  return isNaN(value) ? def : value < 0 ? 0 : value;
}

const toFunction = (value, def) => isFunction(value)
  ? value
  : isDefined(def)
    ? def
    : constant(value);

const toNumber = (value, def) => {
  if (!isNumber(value)) {
    value = +value;
    if (isNaN(value)) return def;
  }
  return value;
};

const toError = value => isError(value)
  ? value
  : new Error(value);

function unsync(result, next, done) {
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
          if (!unsync(promiseResult, next, done)) next(true);
        },
        promiseError => done(toError(promiseError)));
      break;
    case ERROR:
      done(result);
      break;
  }
  return true;
}

function arrayAdapter(source) {
  return (next, done, context) => {
    let index = -1;
    !function proceed() {
      while (++index < source.length) if (unsync(next(source[index]), proceed, done)) return;
      done(true);
    }();
  };
}

function errorAdapter(error) {
  return (next, done) => {
    done(error);
  };
}

function flowAdapter(flow) {
  return (next, done, context) => flow.emitter(
    next,
    done,
    objectDefineProperties({}, {
      data: { value: context.data },
      sources: { value: flow.sources }
    }));
}

function functionAdapter(source) {
  return (next, done, context) => {
    if (!unsync(next(source(context.data)), done, done)) done(true);
  };
}

function iterableAdapter(source, sourceClass) {
  if (!primitives.has(sourceClass) && ITERATOR in source)
    return (next, done, context) => {
      let iteration, iterator = iterator = source[ITERATOR]();
      !function proceed() {
        while (!(iteration = iterator.next()).done)
          if (unsync(next(iteration.value), proceed, done))
            return;
        done(true);
      }();
    };
}

function promiseAdapter(source) {
  return (next, done, context) => source.then(
    result => {
      if (!unsync(next(result), done, done))
        done(true);
    },
    result => done(toError(result)));
}

const adapters = objectDefineProperties([iterableAdapter], {
  [AEROFLOW]: { value: flowAdapter },
  [ARRAY]: { configurable: true, value: arrayAdapter, writable: true },
  [ERROR]: { configurable: true, value: errorAdapter, writable: true },
  [FUNCTION]: { configurable: true, value: functionAdapter, writable: true },
  [PROMISE]: { configurable: true, value: promiseAdapter, writable: true }
});

function adapterSelector(source, def) {
  const sourceClass = classOf(source);
  let adapter = adapters[sourceClass];
  if (isFunction(adapter)) return adapter(source);
  for (let i = -1, l = adapters.length; ++i < l;) {
    adapter = adapters[i](source, sourceClass);
    if (isFunction(adapter)) return adapter;
  }
  return def;
}

function valueAdapter(value) {
  return (next, done) => {
    if (!unsync(next(value), done, done)) done(true);
  };
}

function emptyGenerator(result) {
  return (next, done) => done(result);
}

function customGenerator(generator) {
  if (isUndefined(generator)) return emptyGenerator(true);
  if (!isFunction(generator)) return valueAdapter(generator);
  return (next, done, context) => {
    let buffer = [], busy = false, idle = false, finalizer;
    finalizer = generator(
      result => {
        if (idle) return false;
        buffer.push(result);
        if (!busy) proceed(true);
        return true;
      },
      result => {
        if (idle) return false;
        idle = true;
        buffer.result = isUndefined(result) || result;
        if (!busy) proceed(true);
        return true;
      },
      context.data);
    function complete(result) {
      idle = true;
      if (isFunction(finalizer)) setTimeout(finalizer, 0);
      done(result && buffer.result);
    }
    function proceed(result) {
      busy = false;
      if (result) while (buffer.length) if (unsync(next(buffer.shift()), proceed, complete)) {
        busy = true;
        return;
      }
      complete(result);
    }
  };
}

function expandGenerator(expander, seed) {
  expander = toFunction(expander);
  return (next, done, context) => {
    let index = 0, value = seed;
    !function proceed() {
      while (!unsync(next(value = expander(value, index++, context.data)), proceed, done));
    }();
  };
}

function randomGenerator(minimum, maximum) {
  maximum = toNumber(maximum, 1 - mathPow(10,-15));
  minimum = toNumber(minimum, 0);
  maximum -= minimum;
  const rounder = isInteger(minimum) && isInteger(maximum)
    ? mathFloor
    : identity;
  return (next, done) => {
    !function proceed() {
      while (!unsync(next(rounder(minimum + maximum * mathRandom())), proceed, done));
    }();
  };
}

function rangeGenerator(start, end, step) {
  end = toNumber(end, maxInteger);
  start = toNumber(start, 0);
  if (start === end) return valueAdapter(start);
  const down = start < end;
  if (down) {
    step = toNumber(step, 1);
    if (step < 1) return valueAdapter(start);
  }
  else {
    step = toNumber(step, -1);
    if (step > -1) return valueAdapter(start);
  }
  const limiter = down
    ? value => value <= end
    : value => value >= end;
  return (next, done, context) => {
    let value = start - step;
    !function proceed() {
      while (limiter(value += step))
        if (unsync(next(value), proceed, done))
          return;
      done(true);
    }();
  };
}

function repeatDeferredGenerator(repeater, delayer) {
  return (next, done, context) => {
    let index = -1;
    !function proceed(result) {
      setTimeout(() => {
        if (!unsync(next(repeater(index, context.data)), proceed, done)) proceed();
      }, toDelay(delayer(++index, context.data), 1000));
    }();
  };
}

function repeatImmediateGenerator(repeater) {
  return (next, done, context) => {
    let index = 0;
    !function proceed() {
      while (!unsync(next(repeater(index++, context.data)), proceed, done));
    }();
  };
}

function repeatGenerator(value, interval) {
  const repeater = toFunction(value);
  return isDefined(interval)
    ? repeatDeferredGenerator(repeater, toFunction(interval))
    : repeatImmediateGenerator(repeater);
}

function reduceOperator(reducer, seed, required) {
  if (isUndefined(reducer)) return tie(emptyGenerator, false);
  if (!isFunction(reducer)) return tie(valueAdapter, reducer);
  return emitter => (next, done, context) => {
    let empty = !required, index = 0, reduced = seed;
    emitter(
      result => {
        if (empty) {
          empty = false;
          if (isUndefined(reduced)) {
            reduced = result;
            return true;
          }
        }
        reduced = reducer(reduced, result, index++, context.data);
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(reduced), tie(done, result), done))
          done(result);
      },
      context);
  };
}

function averageOperator(required) {
  return reduceOperator(
    (average, result, index) => (average * index + result) / (index + 1), 0);
}

function catchOperator(alternative) {
  const regressor = isDefined(alternative) 
    ? adapterSelector(alternative, valueAdapter(alternative))
    : emptyGenerator(false);
  return emitter => (next, done, context) => emitter(
    next,
    result => isError(result)
      ? regressor(next, done, context)
      : done(result),
    context);
}

function countOperator() {
  return reduceOperator(count => count + 1, 0, true);
}

function delayOperator(interval) {
  const delayer = toFunction(interval);
  return emitter => (next, done, context) => {
    let index = 0;
    return emitter(
      result => new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            if (!unsync(next(result), resolve, reject)) resolve(true);
          }
          catch (error) {
            reject(error);
          }
        }, toDelay(delayer(result, index++, context.data), 1000));
      }),
      done,
      context);
  }
}

function distinctOperator(untilChanged) {
  return emitter => untilChanged
    ? (next, done, context) => {
        let idle = true, last;
        emitter(
          result => {
            if (!idle && last === result) return true;
            idle = false;
            last = result;
            return next(result);
          },
          done,
          context);
      }
    : (next, done, context) => {
        let set = new Set;
        emitter(
          result => {
            if (set.has(result)) return true;
            set.add(result);
            return next(result);
          },
          done,
          context);
      };
}

function dumpToConsoleOperator(prefix) {
  return emitter => (next, done, context) => emitter(
    result => {
      console.log(prefix + 'next', result);
      return next(result);
    },
    result => {
      console[isError(result) ? 'error' : 'log'](prefix + 'done', result);
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
        if (isError(result) || !unsync(next(every || empty), done, done)) done(result);
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
      const adapter = adapterSelector(result);
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
    ? selectors.map(toFunction)
    : [constant];
  const limit = selectors.length - 1;
  return emitter => (next, done, context) => {
    let groups = new Map, index = 0;
    emitter(
      value => {
        let ancestor = groups, descendant;
        for (let i = -1; ++i <= limit;) {
          let key = selectors[i](value, index++, context.data);
          descendant = ancestor.get(key);
          if (!descendant) {
            descendant = i === limit ? [] : new Map;
            ancestor.set(key, descendant);
          }
          ancestor = descendant;
        }
        descendant.push(value);
        return true;
      },
      result => {
        if (isError(result)) done(result);
        else iterableAdapter(groups)(next, tie(done, result), context);
      },
      context);
  };
}

function toArrayOperator(required) {
  return emitter => (next, done, context) => {
    let array = [], empty = !required;
    emitter(
      result => {
        empty = false;
        array.push(result);
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(array), tie(done, result), done))
          done(result);
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

function joinOperator(right, condition) {
  const
    comparer = toFunction(condition, truthy),
    toArray = toArrayOperator()(adapterSelector(right, valueAdapter(right)));
  return emitter => (next, done, context) => toArray(
    rightArray => new Promise(rightResolve => emitter(
      leftResult => new Promise(leftResolve => {
         const
          array = arrayAdapter(rightArray),
          filter = filterOperator(rightResult => comparer(leftResult, rightResult)),
          map = mapOperator(rightResult => [leftResult, rightResult]);
        return map(filter(array))(next, leftResolve, context);
      }),
      rightResolve,
      context)
    ),
    done,
    context);
}

function maxOperator (required) {
  return reduceOperator((maximum, result) => maximum < result ? result : maximum);
}

function meanOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    result => {
      if (!result.length) return true;
      result.sort();
      return next(result[mathFloor(result.length / 2)]);
    },
    done,
    context);
}

function minOperator() {
  return reduceOperator((minimum, result) => minimum > result ? result : minimum);
}

function replayOperator(interval, timing) {
  const delayer = toFunction(interval);
  return emitter => (next, done, context) => {
    let past = dateNow();
    const chronicles = [], chronicler = timing
      ? result => {
          const now = dateNow(), chronicle = { delay: now - past, result };
          past = now;
          return chronicle;
        }
      : result => ({ delay: 0, result });
    emitter(
      result => {
        chronicles.push(chronicler(result));
        return next(result);
      },
      result => {
        if (isError(result)) done(result);
        else {
          let index = -1;
          !function proceed(proceedResult) {
            if (unsync(proceedResult, proceed, tie(done, proceedResult))) return;
            index = (index + 1) % chronicles.length;
            const chronicle = chronicles[index];
            interval = index
              ? chronicle.delay
              : chronicle.delay + toNumber(delayer(context.data), 0);
            (interval ? setTimeout : setImmediate)(() => {
              if (!unsync(next(chronicle.result), proceed, proceed)) proceed(true);
            }, interval);
          }(true);
        }
      },
      context);
  };
}

function retryOperator(attempts) {
  attempts = toNumber(attempts, 1);
  if (!attempts) return identity;
  return emitter => (next, done, context) => {
    let attempt = 0;
    proceed();
    function proceed() {
      emitter(next, retry, context);
    }
    function retry(result) {
      if (++attempt <= attempts && isError(result)) proceed();
      else done(result);
    }
  }
}

function reverseOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    result => new Promise(resolve => {
      let index = result.length;
      !function proceed() {
        while (--index >= 0 && !unsync(next(result[index]), proceed, resolve));
        resolve(true);
      }();
    }),
    done,
    context);
}

function skipAllOperator() {
  return emitter => (next, done, context) => emitter(truthy, done, context);
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
    let buffer = [];
    emitter(
      result => {
        buffer.push(result);
        return true;
      },
      result => {
        if (isError(result)) done(result);
        else if (count >= buffer.length) done(result);
        else arrayAdapter(buffer.slice(0, -count))(next, done, context);
      },
      context)
  };
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

function sliceOperator(begin, end) {
  begin = toNumber(begin, 0);
  end = toNumber(end, maxInteger);
  return begin < 0 || end < 0
    ? emitter => (next, done, context) =>
        toArrayOperator()(emitter)(result => {
          let index = begin < 0 ? result.length + begin : begin,
            limit = end < 0 ? result.length + end : mathMin(result.length, end);
          if (index < 0) index = 0;
          if (limit < 0) limit = 0;
          return index >= limit || new Promise(resolve => {
            !function proceed() {
              while (!unsync(next(result[index++]), proceed, resolve) && index < limit);
              resolve(true);
            }();
          });
        },
        done,
        context)
    : emitter => (next, done, context) => {
        let index = -1;
        emitter(
          value => ++index < begin || (index < end && next(value)),
          done,
          context);
      };
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
  for (let i = -1, l = parameters.length; ++i < l;) {
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
        let selector = selectors[i];
        result = compare(selector(left), selector(right), directions[i]);
        if (result) break;
      }
      return result;
    }
    : (left, right) => compare(left, right, direction);
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    result => new Promise(resolve =>
      arrayAdapter(result.sort(comparer))(next, resolve, context)),
    done,
    context);
}

function sumOperator() {
  return reduceOperator((sum, result) => +result + sum, 0);
}

function takeFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      result => {
        if (++index < count) return next(result);
        result = next(result);
        if (isBoolean(result)) return false;
        if (isPromise(result)) return result.then(falsey);
        return result;
      },
      done,
      context);
  };
}

function takeLastOperator(count) {
  return emitter => (next, done, context) => {
    let buffer = [];
    emitter(
      result => {
        if (buffer.length >= count) buffer.shift();
        buffer.push(result);
        return true;
      },
      result => {
        if (isError(result)) done(result);
        else arrayAdapter(buffer)(next, done, context);
      },
      context)
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
          : tie(emptyGenerator, false)
    case FUNCTION:
      return takeWhileOperator(condition);
    default:
      return condition
        ? identity
        : tie(emptyGenerator, false);
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

function toMapOperator(keySelector, valueSelector, required) {
  keySelector = isUndefined(keySelector)
    ? identity
    : toFunction(keySelector);
  valueSelector = isUndefined(valueSelector)
    ? identity
    : toFunction(valueSelector);
  return emitter => (next, done, context) => {
    let empty = !required, index = 0, map = new Map;
    emitter(
      result => {
        empty = false;
        map.set(
          keySelector(result, index++, context.data),
          valueSelector(result, index++, context.data));
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(map), tie(done, result), done)) done(result);
      },
      context);
  };
}

function toSetOperator(required) {
  return emitter => (next, done, context) => {
    let empty = !required, set = new Set;
    emitter(
      result => {
        empty = false;
        set.add(result);
        return true;
      },
      result => {
        if (isError(result) || empty || !unsync(next(set), tie(done, result), done))
          done(result);
      },
      context);
  };
}

function toStringOperator(separator, required) {
  let joiner;
  /*eslint no-fallthrough: 0*/
  switch (classOf(separator)) {
    case FUNCTION:
      joiner = separator;
      break;
    case BOOLEAN:
      if (isUndefined(required)) required = separator;
    case UNDEFINED:
      separator = ',';
    default:
      joiner = constant(separator);
      break;
  }
  return reduceOperator((string, result, index, data) =>
    string.length
      ? string + joiner(result, index, data) + result
      : '' + result,
    '',
    required);
}

function emit(next, done, context) {
  let index = -1;
  !function proceed(result) {
    if (result !== true || ++index >= context.sources.length) done(result);
    else try {
      const source = context.sources[index];
      let adapter = adapterSelector(source, valueAdapter(source));
      adapter(next, proceed, context);
    }
    catch (err) {
      done(err);
    }
  }(true);
}

/**
Creates new flow emitting values extracted from all provided data sources in series.

@param {any} sources
Data sources.

@return {Flow}

@property {object} adapters
@property {array} consumers
@property {object} operators

@example
aeroflow().dump().run();
// done true
aeroflow(
  1,
  [2, 3],
  new Set([4, 5]),
  () => 6,
  Promise.resolve(7),
  new Promise(resolve => setTimeout(() => resolve(8), 500))
).dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5
// next 6
// next 7
// next 8 // after 500ms
// done true
aeroflow(new Error('test')).dump().run();
// done Error: test(…)
// Uncaught (in promise) Error: test(…)
aeroflow(() => { throw new Error }).dump().run();
// done Error: test(…)
// Uncaught (in promise) Error: test(…)
aeroflow("test").dump().run();
// next test
// done true
aeroflow.adapters['String'] = aeroflow.adapters['Array'];
aeroflow("test").dump().run();
// next t
// next e
// next s
// next t
// done true
*/
function aeroflow(...sources) {
  return new Flow(emit, sources);
}

/**
Creates programmatically controlled flow.

@memberof aeroflow
@static

@param {function|any} emitter
The emitter function taking three arguments:
next - the function emitting 'next' event,
done - the function emitting 'done' event,
context - the execution context.

@return {Flow}
The new flow emitting values generated by emitter function.

@example
aeroflow.create((next, done, context) => {
  next('test');
  done();
}).dump().run();
// next test
// done true
aeroflow.create((next, done, context) => {
  window.addEventListener('click', next);
  return () => window.removeEventListener('click', next);
}).take(2).dump().run();
// next MouseEvent {...}
// next MouseEvent {...}
// done false
*/
function create(emitter) {
  return new Flow(customGenerator(emitter));
}

/**
@alias aeroflow.expand

@param {function} expander
@param {any} [seed]

@return {Flow}

@example
aeroflow.expand(value => value * 2, 1).take(3).dump().run();
// next 2
// next 4
// next 8
// done false
*/
function expand(expander, seed) {
  return new Flow(expandGenerator(expander, seed));
}

/**
Creates new flow emitting the provided value only.

@alias aeroflow.just
@alias aeroflow.return

@param {any} value
The value to emit.

@return {Flow}
The new flow emitting provided value.

@example
aeroflow.just([1, 2, 3]).dump().run();
// next [1, 2, 3]
// done
*/
function just(value) {
  return new Flow(valueAdapter(value));
}

/**
Creates new flow emitting infinite sequence of random numbers.

@alias aeroflow.random

@param {number} [minimum]
@param {number} [maximum]

@return {Flow}
The new flow emitting random numbers.

@example
aeroflow.random().take(2).dump().run();
// next 0.07417976693250232
// next 0.5904422281309957
// done false
aeroflow.random(1, 9).take(2).dump().run();
// next 7
// next 2
// done false
aeroflow.random(1.1, 8.9).take(2).dump().run();
// next 4.398837305698544
// next 2.287970747705549
// done false
*/
function random(minimum, maximum) {
  return new Flow(randomGenerator(minimum, maximum));
}

/**
@alias aeroflow.range

@param {number} [start]
@param {number} [end]
@param {number} [step]

@return {Flow}

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
  return new Flow(rangeGenerator(start, end, step));
}

/**
Creates flow repeating provided value.

@alias aeroflow.repeat

@param {function|any} [value]
Arbitrary static value to repeat;
or function providing dynamic values and invoked with two arguments:
  index - index of the value being emitted,
  data - contextual data.
@param {number|function} [interval]

@return {Flow}
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
aeroflow.repeat('ping', 500).take(3).dump().run();
// next ping // after 500ms
// next ping // after 500ms
// next ping // after 500ms
// done false
aeroflow.repeat(index => index, index => 500 + 500 * index).take(3).dump().run();
// next ping // after 500ms
// next ping // after 1000ms
// next ping // after 1500ms
// done false
*/
function repeat(value, interval) {
  return new Flow(repeatGenerator(value, interval));
}

/**
@class

@property {function} emitter
@property {array} sources
*/
function Flow(emitter, sources) {
  objectDefineProperties(this, {
    emitter: { value: emitter },
    sources: { value: sources }
  });
}

/**
@alias Flow#average

@return {Flow}

@example
aeroflow().average().dump().run();
// done true
aeroflow('test').average().dump().run();
// next NaN
// done true
aeroflow(1, 2, 6).average().dump().run();
// next 3
// done true
*/
function average() {
  return this.chain(averageOperator());
}

/**
@alias Flow#bind

@param {any} [sources]

@return {Flow}

@example
aeroflow().dump().bind().run();
// done true
aeroflow().dump().bind(1, 2).run();
// next 1
// next 2
// done true
aeroflow(1, 2).dump().bind(4, 5).run();
// next 4
// next 5
// done true
*/
function bind(...sources) {
  return new Flow(this.emitter, sources);
}

/**
@alias Flow#catch

@param {any} [alternative]

@return {Flow}

@example
aeroflow(new Error('test')).catch().dump().run();
// done false
aeroflow(new Error('test')).dump('before ').catch('success').dump('after ').run();
// before done Error: test(…)
// after next success
// after done true
*/
function catch_(alternative) {
  return this.chain(catchOperator(alternative));
}

/**
@alias Flow#chain

@param {function} [operator]

@return {Flow}
*/
function chain(operator) {
  return new Flow(operator(this.emitter), this.sources);
}

/**
Returns new flow emitting values from this flow first 
and then from all provided sources in series.

@alias Flow#concat

@param {any} [sources]
Data sources to append to this flow.

@return {Flow}
New flow emitting all values emitted by this flow first
and then all provided values.

@example
aeroflow(1).concat(
  2,
  [3, 4],
  () => 5,
  Promise.resolve(6),
  new Promise(resolve => setTimeout(() => resolve(7), 500))
).dump().run();
// next 1
// next 2
// next 3
// next 4
// next 5
// next 6
// next 7 // after 500ms
// done
*/
function concat(...sources) {
  return new Flow(this.emitter, this.sources.concat(sources));
}

/**
Counts the number of values emitted by this flow, returns new flow emitting only this value.

@alias Flow#count

@return {Flow}

@example
aeroflow().count().dump().run();
// next 0
// done
aeroflow('a', 'b', 'c').count().dump().run();
// next 3
// done
*/
function count() {
  return this.chain(countOperator());
}

/**
Returns new flow delaying emission of each value accordingly provided condition.

@alias Flow#delay

@param {number|date|function} [interval]
The condition used to determine delay for each subsequent emission.
Number is threated as milliseconds interval (negative number is considered as 0).
Date is threated as is (date in past is considered as now).
Function is execute for each emitted value, with three arguments:
  value - The current value emitted by this flow
  index - The index of the current value
  context - The context object
The result of condition function will be converted to number and used as milliseconds interval.

@return {Flow}

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
// next 2 // after 1000ms
// done true
aeroflow(1, 2).delay(value => { throw new Error }).dump().run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
*/
function delay(interval) {
  return this.chain(delayOperator(interval));
}

/**
@alias Flow#distinct

@param {boolean} untilChanged

@return {Flow}

@example
aeroflow(1, 1, 2, 2, 1, 1).distinct().dump().run();
// next 1
// next 2
// done true
aeroflow(1, 1, 2, 2, 1, 1).distinct(true).dump().run();
// next 1
// next 2
// next 1
// done true
*/
function distinct(untilChanged) {
  return this.chain(distinctOperator(untilChanged));
}

/**
Dumps all events (next, done) emitted by this flow to the logger with optional prefix.

@alias Flow#dump

@param {string} [prefix='']
A string prefix to prepend to each event name.

@param {function} [logger=console.log]
Function to execute for each event emitted, taking two arguments:
name - The name of event emitted by this flow prepended with prefix.
value - The value of event emitted by this flow.

@return {Flow}

@example
aeroflow(1, 2).dump(console.info.bind(console)).run();
// next 1
// next 2
// done true
aeroflow(1, 2).dump('test ', console.info.bind(console)).run();
// test next 1
// test next 2
// test done true
aeroflow(1, 2).dump(event => { if (event === 'next') throw new Error }).dump().run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
*/
function dump(prefix, logger) {
  return this.chain(dumpOperator(prefix, logger));
}

/**
Tests whether all values emitted by this flow pass the provided test.

@alias Flow#every

@param {function|regexp|any} [predicate]
The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

@return {Flow}
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
aeroflow(1, 2).every(value => { throw new Error }).dump().run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
*/
function every(condition) {
  return this.chain(everyOperator(condition));
}

/**
Filters values emitted by this flow with the provided test.

@alias Flow#filter

@param {function|regexp|any} [predicate]
The predicate function or regular expression to test each emitted value with,
or scalar value to compare emitted values with.
If omitted, default (truthy) predicate is used.

@return {Flow}
New flow emitting only values passing the provided test.

@example
aeroflow().filter().dump().run();
// done true
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
aeroflow(1, 2).filter(value => { throw new Error }).dump().run();
// done Error: (…)
// Uncaught (in promise) Error: test(…)
*/
function filter(condition) {
  return this.chain(filterOperator(condition)); 
}

/**
@alias Flow#flatten

@param {number} [depth]

@return {Flow}

@example
aeroflow([[1, 2]]).flatten().dump().run();
// next 1
// next 2
// done true
aeroflow(() => [[1], [2]]).flatten(1).dump().run();
// next [1]
// next [2]
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
  .flatten().dump().run();
// next 1 // after 500ms
// next 2
// done true
aeroflow(new Promise(resolve => setTimeout(() => resolve(() => [1, 2]), 500)))
  .flatten(1).dump().run();
// next [1, 2] // after 500ms
// done true
*/
function flatten(depth) {
  return this.chain(flattenOperator(depth));
}

/**
@alias Flow#group

@param {function|any[]} [selectors]

@return {Flow}

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
@alias Flow#join

@param {any} right
@param {function} comparer

@return {Flow}

@example
aeroflow().join().dump().run();
// done true
aeroflow(1, 2).join().dump().run();
// next [1, undefined]
// next [2, undefined]
aeroflow(1, 2).join(0).dump().run();
// next [1, 0]
// next [2, 0]
// done true
aeroflow('a','b').join(1, 2).dump().run();
// next ["a", 1]
// next ["a", 2]
// next ["b", 1]
// next ["b", 2]
aeroflow([
  { country: 'USA', capital: 'Washington' },
  { country: 'Russia', capital: 'Moskow' }
]).join([
  { country: 'USA', currency: 'US Dollar' },
  { country: 'Russia', currency: 'Russian Ruble' }
], (left, right) => left.country === right.country)
.map(result => (
  { country: result[0].country, capital: result[0].capital, currency: result[1].currency }
))
.dump().run();
// next Object {country: "USA", capital: "Washington", currency: "US Dollar"}
// next Object {country: "Russia", capital: "Moskow", currency: "Russian Ruble"}
// done true
*/
function join(right, comparer) {
  return this.chain(joinOperator(right, comparer));
}

/**
@alias Flow#map

@param {function|any} [mapping]

@return {Flow}

@example
aeroflow().map().dump().run();
// done true
aeroflow(1, 2).map().dump().run();
// next 1
// next 2
// done true
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

@alias Flow#max

@return {Flow}
New flow emitting the maximum value only.

@example
aeroflow().max().dump().run();
// done true
aeroflow(3, 1, 2).max().dump().run();
// next 3
// done true
aeroflow('b', 'a', 'c').max().dump().run();
// next c
// done true
*/
function max() {
  return this.chain(maxOperator());
}

/**
Determines the mean value emitted by this flow.

@alias Flow#mean

@return {Flow}
New flow emitting the mean value only.

@example
aeroflow().mean().dump().run();
// done true
aeroflow(3, 1, 2).mean().dump().run();
// next 2
// done true
aeroflow('a', 'd', 'f', 'm').mean().dump().run();
// next f
// done true
*/
function mean() {
  return this.chain(meanOperator());
}

/**
Determines the minimum value emitted by this flow.

@alias Flow#min

@return {Flow}
New flow emitting the minimum value only.

@example
aeroflow().min().dump().run();
// done true
aeroflow(3, 1, 2).min().dump().run();
// next 1
// done true
aeroflow('b', 'a', 'c').min().dump().run();
// next a
// done true
*/
function min() {
  return this.chain(minOperator());
}

/**
Applies a function against an accumulator and each value emitted by this flow
to reduce it to a single value, returns new flow emitting the reduced value.

@alias Flow#reduce

@param {function|any} iteratee
Function to execute on each emitted value, taking four arguments:
  result - the value previously returned in the last invocation of the reducer, or seed, if supplied;
  value - the current value emitted by this flow;
  index - the index of the current value emitted by the flow;
  data - the data bound to current execution context.
  If is not a function, the returned flow will emit just the reducer value.
@param {any|boolean} [accumulator]
Value to use as the first argument to the first call of the reducer.
When boolean value is passed and no value defined for the 'required' argument,
the 'seed' argument is considered to be omitted.
@param {boolean} [required=false]
True to emit reduced result always, even if this flow is empty.
False to emit only 'done' event for empty flow.

@return {Flow}
New flow emitting reduced result only or no result at all if this flow is empty
and the 'required' argument is false.

@example
aeroflow().reduce().dump().run();
// done false
aeroflow(1, 2).reduce().dump().run();
// done false
aeroflow().reduce('test').dump().run();
// next test
// done true
aeroflow().reduce((product, value) => product * value).dump().run();
// done true
aeroflow().reduce((product, value) => product * value, true).dump().run();
// next undefined
// done true
aeroflow().reduce((product, value) => product * value, 1, true).dump().run();
// next 1
// done true
aeroflow(2, 4, 8).reduce((product, value) => product * value).dump().run();
// next 64
// done
aeroflow(2, 4, 8).reduce((product, value) => product * value, 2).dump().run();
// next 128
// done
aeroflow(['a', 'b', 'c'])
  .reduce((product, value, index) => product + value + index, '')
  .dump().run();
// next a0b1c2
// done
*/
function reduce(iteratee, accumulator, required) {
  return this.chain(reduceOperator(iteratee, accumulator, required));
}

/**
@alias Flow#replay

@param {number|function} delay
@param {boolean} timing

@return {Flow}

@example
aeroflow(1, 2).replay(1000).take(4).dump().run();
// next 1
// next 2
// next 1 // after 1000ms
// next 2
// done false
aeroflow(1, 2).delay(500).replay(1000).take(4).dump().run();
// next 1
// next 2 // after 500ms
// next 1 // after 1000ms
// next 2
// done false
aeroflow(1, 2).delay(500).replay(1000, true).take(4).dump().run();
// next 1
// next 2 // after 500ms
// next 1 // after 1000ms
// next 2 // after 500ms
// done false
*/
function replay(interval, timing) {
  return this.chain(replayOperator(interval, timing));
}

/**
@alias Flow#retry

@param {number} attempts

@return {Flow}

@example
var attempt = 0; aeroflow(() => {
  if (attempt++ % 2) return 'success';
  else throw new Error('error');
}).dump('before ').retry().dump('after ').run();
// before done Error: error(…)
// before next success
// after next success
// before done true
// after done true
*/
function retry(attempts) {
  return this.chain(retryOperator(attempts));
}

/**
@alias Flow#reverse

@return {Flow}

@example
aeroflow().reverse().dump().run();
// done true
aeroflow(1, 2, 3).reverse().dump().run();
// next 3
// next 2
// next 1
// done true
*/
function reverse() {
  return this.chain(reverseOperator());
}

/**
Runs this flow asynchronously, initiating source to emit values,
applying declared operators to emitted values and invoking provided callbacks.
If no callbacks provided, runs this flow for its side-effects only.

@alias Flow#run

@param {function} [next]
Callback to execute for each emitted value, taking two arguments: result, data.
@param {function} [done]
If next parameter is callback,
then callback to execute as emission is complete, taking two arguments: result, data.
Or data argument.
@param {function} [data]
Arbitrary value passed to each callback invoked by this flow as the last argument.

@return {Promise}
A promise resolving when this flow completes successfully or rejecting otherwise.

@example
aeroflow(1, 2, 3).run(
  result => console.log('next', result),
  result => console.log('done', result));
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).dump().run(() => false);
// next 1
// done false
aeroflow(Promise.reject('test')).dump().run();
// done Error: test(…)
// Uncaught (in promise) Error: test(…)
*/
function run(next, done, data) {
  if (isFunction(next)) {
    if (!isFunction(done)) {
      data = done;
      done = noop;
    }
  }
  else {
    data = next;
    done = next = noop;
  }
  const context = objectDefineProperties({}, {
    data: { value: data },
    sources: { value: this.sources }
  });
  return new Promise((resolve, reject) => this.emitter(
    result => false !== next(result, data),
    result => {
      try {
        done(result, data);
      }
      catch (err) {
        result = err;
      }
      (isError(result) ? reject : resolve)(result);
    },
    context));
}

/**
Skips some of the values emitted by this flow,
returns flow emitting remaining values.

@alias Flow#skip

@param {number|function|any} [condition] 
The number or predicate function used to determine how many values to skip.
  If omitted, returned flow skips all values emitting done event only.
  If zero, returned flow skips nothing.
  If positive number, returned flow skips this number of first emitted values.
  If negative number, returned flow skips this number of last emitted values.
  If function, returned flow skips emitted values while this function returns trythy value.

@return {Flow}
New flow emitting remaining values.

@example
aeroflow(1, 2, 3).skip().dump().run();
// done true
aeroflow(1, 2, 3).skip(1).dump().run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).skip(-1).dump().run();
// next 1
// next 2
// done true
aeroflow(1, 2, 3).skip(value => value < 3).dump().run();
// next 3
// done true
  */
function skip(condition) {
  return this.chain(skipOperator(condition));
}

/**
@alias Flow#slice

@param {number} [begin]
@param {number} [end]

@return {Flow}

@example
aeroflow(1, 2, 3).slice().dump().run();
// next 1
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1).dump().run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(1, 2).dump().run();
// next 2
// done false
aeroflow(1, 2, 3).slice(-2).dump().run();
// next 2
// next 3
// done true
aeroflow(1, 2, 3).slice(-3, -1).dump().run();
// next 1
// next 2
// done true
*/
function slice(begin, end) {
  return this.chain(sliceOperator(begin, end));
}

/**
Tests whether some value emitted by this flow passes the predicate test,
returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.

@alias Flow#some

@param {function|regexp|any} [predicate]
The predicate function or regular expression object used to test each emitted value.
Or scalar value to compare emitted values with.
If omitted, truthy predicate is used.

@return {Flow}
New flow that emits true or false.

@example
aeroflow().some().dump().run();
// next false
// done true
aeroflow(1, 2, 3).some(2).dump().run();
// next true
// done false
aeroflow(1, 2, 3).some(value => value % 2).dump().run();
// next true
// done false
aeroflow(1, 2, 3).some(value => { throw new Error }).dump().run();
// done Error(…)
// Uncaught (in promise) Error: test(…)
*/
function some(condition) {
  return this.chain(someOperator(condition));
}

/**
@alias Flow#sort

@param {function|boolean|'desc'[]} [parameters]

@return {Flow}

@return {Flow}

@example
aeroflow(3, 1, 2).sort().dump().run();
// next 1
// next 2
// next 3
// done true
aeroflow(2, 1, 3).sort('desc').dump().run();
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

/**
@alias Flow#sum

@param {boolean} [required=false]

@return {Flow}

@example
aeroflow().sum().dump().run();
// done true
aeroflow('test').sum().dump().run();
// next NaN
// done true
aeroflow(1, 2, 3).sum().dump().run();
// next 6
// done true
*/
function sum() {
  return this.chain(sumOperator());
}

/**
@alias Flow#take

@param {function|number} [condition]

@return {Flow}

@example
aeroflow(1, 2, 3).take().dump().run();
// done false
aeroflow(1, 2, 3).take(1).dump().run();
// next 1
// done false
aeroflow(1, 2, 3).take(-1).dump().run();
// next 3
// done true
*/
function take(condition) {
  return this.chain(takeOperator(condition));
}

/**
Executes provided callback once per each value emitted by this flow,
returns new tapped flow or this flow if no callback provided.

@alias Flow#tap

@param {function} [callback]
Function to execute for each value emitted, taking three arguments:
  value emitted by this flow,
  index of the value,
  context object.

@return {Flow}

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

@alias Flow#toArray

@return {Flow}
New flow emitting array containing all results emitted by this flow.

@example
aeroflow().toArray().dump().run();
// done true
aeroflow().toArray(true).dump().run();
// next []
// done true
aeroflow('test').toArray().dump().run();
// next ["test"]
// done true
aeroflow(1, 2, 3).toArray().dump().run();
// next [1, 2, 3]
// done true
*/
function toArray(required) {
  return this.chain(toArrayOperator(required));
}

/**
Collects all values emitted by this flow to ES6 map, returns flow emitting this map.

@alias Flow#toMap

@param {function|any} [keySelector]
The mapping function used to transform each emitted value to map key.
Or scalar value to use as map key.
@param {function|any} [valueSelector]
The mapping function used to transform each emitted value to map value,
Or scalar value to use as map value.

@return {Flow}
New flow emitting map containing all results emitted by this flow.

@example
aeroflow().toMap().dump().run();
// next Map {}
// done true
aeroflow('test').toMap().dump().run();
// next Map {"test" => "test"}
done true
aeroflow(1, 2, 3).toMap(v => 'key' + v, true).dump().run();
// next Map {"key1" => true, "key2" => true, "key3" => true}
// done true
aeroflow(1, 2, 3).toMap(v => 'key' + v, v => 10 * v).dump().run();
// next Map {"key1" => 10, "key2" => 20, "key3" => 30}
// done true
*/
function toMap(keySelector, valueSelector, required) {
   return this.chain(toMapOperator(keySelector, valueSelector));
}

/**
Collects all values emitted by this flow to ES6 set, returns flow emitting this set.

@alias Flow#toSet

@return {Flow}
New flow emitting set containing all results emitted by this flow.

@example
aeroflow().toSet().dump().run();
// done true
aeroflow().toSet(true).dump().run();
// next Set {}
// done true
aeroflow(1, 2, 3).toSet().dump().run();
// next Set {1, 2, 3}
// done true
*/
function toSet(required) {
  return this.chain(toSetOperator(required)); 
}

/**
Returns new flow joining all values emitted by this flow into a string
and emitting this string.

@alias Flow#toString

@param {string|function|boolean} [separator]
Optional. Specifies a string to separate each value emitted by this flow.
The separator is converted to a string if necessary.
If omitted, the array elements are separated with a comma.
If separator is an empty string, all values are joined without any characters in between them.
If separator is a boolean value, it is used instead a second parameter of this method.
@param {boolean} [required=false]
Optional. Defines whether to emit an empty string value from empty flow or not.
When false (default), an empty flow will emit 'done' event only.
When true, an empty flow will emit 'next' event with an empty result and then 'done' event.

@return {Flow}
New flow emitting string representation of this flow.

@example
aeroflow().toString().dump().run();
// done true
aeroflow().toString(true).dump().run();
// next
// done true
aeroflow('test').toString().dump().run();
// next test
// done true
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
/*eslint no-shadow: 0*/
function toString(separator, required) {
  return this.chain(toStringOperator(separator, required)); 
}

const operators = objectCreate(Object[PROTOTYPE], {
  average: { value: average, writable: true },
  catch: { value: catch_, writable: true },
  count: { value: count, writable: true },
  delay: { value: delay, writable: true },
  distinct: { value: distinct, writable: true },
  dump: { value: dump, writable: true },
  every: { value: every, writable: true },
  filter: { value: filter, writable: true },
  flatten: { value: flatten, writable: true },
  group: { value: group, writable: true },
  join: { value: join, writable: true },
  map: { value: map, writable: true },
  max: { value: max, writable: true },
  mean: { value: mean, writable: true },
  min: { value: min, writable: true },
  reduce: { value: reduce, writable: true },
  replay: { value: replay, writable: true },
  retry: { value: retry, writable: true },
  reverse: { value: reverse, writable: true },
  skip: { value: skip, writable: true },
  slice: { value: slice, writable: true },
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

Flow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  bind: { value: bind },
  chain: { value: chain },
  concat: { value: concat },
  run: { value: run }
});

objectDefineProperties(aeroflow, {
  adapters: { value: adapters },
  create: { value: create },
  empty: { enumerable: true, value: new Flow(emptyGenerator(true)) },
  expand: { value: expand },
  just: { value: just },
  operators: { value: operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat },
  return: { value: just }
});

export default aeroflow;