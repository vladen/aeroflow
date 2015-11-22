/**
  * Lazily computed async reactive data flow.
  * @module aeroflow
  */

'use strict';

/*
  -------------
    constants
  -------------
*/

const
  CLASS_AEROFLOW = 'Aeroflow'
, CLASS_ARRAY = 'Array'
, CLASS_DATE = 'Date'
, CLASS_ERROR = 'Error'
, CLASS_FUNCTION = 'Function'
, CLASS_NUMBER = 'Number'
, CLASS_PROMISE = 'Promise'
, CLASS_REG_EXP = 'RegExp'
, SYMBOL_CLASS = Symbol('class')
, SYMBOL_EMITTER = Symbol('emitter')
, SYMBOL_TO_STRING_TAG = Symbol.toStringTag;

/*
  -------------
    shortcuts
  -------------
*/

const
  classof = Object.classof
, defineProperties = Object.defineProperties
, floor = Math.floor
, isInteger = Number.isInteger
, maxInteger = Number.MAX_SAFE_INTEGER
, now = Date.now;

/*
  -------------
    utilities
  -------------
*/

const
  compare = (left, right) => left < right ? -1 : left > right ? 1 : 0
, constant = value => () => value
, identity = value => value
, isDate = value => CLASS_DATE === classof(value)
, isError = value => CLASS_ERROR === classof(value)
, isFunction = value => CLASS_FUNCTION === classof(value)
, isNothing = value => value == null
, isNumber = value => CLASS_NUMBER === classof(value)
, isPromise = value => CLASS_PROMISE === classof(value)
, isRegExp = value => CLASS_REG_EXP === classof(value)
, noop = () => {}
, throwError = error => {
    throw isError(error) ? error : new Error(error);
  };

let empty;

/*
  -----------
    classes
  -----------
*/

/** Class */
class Aeroflow {
  constructor(emitter) {
    defineProperties(this, {
      [SYMBOL_EMITTER]: {value: emitter}
    , [SYMBOL_TO_STRING_TAG]: {value: CLASS_AEROFLOW}
    });
  }

  /**
    * Returns new flow emitting values from this flow first and then from all provided sources without interleaving them.
    * @public @instance
    *
    * @param {...any} [sources] Value sources to append to this flow.
    * @return {Aeroflow} new flow.
    *
    * @example
    * aeroflow(1).concat(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
    * // next 1
    * // next 2
    * // next 3
    * // next 4
    * // next 5
    * // next 6 // after 500ms
    * // done
    */
  append(...sources) {
    return aeroflow(this, ...sources);
  }

  /**
    * Counts the number of values emitted by this flow, returns new flow emitting only this value.
    *
    * @example
    * aeroflow(['a', 'b', 'c']).count().dump().run();
    * // next 3
    * // done
    */
  count() {
    return new Aeroflow(reduce(this[SYMBOL_EMITTER], result => result + 1, 0));
  }

  /**
    * Returns new flow delaying emission of each value accordingly provided condition.
    *
    * @param {number|date|function} [condition] The condition used to determine delay for each subsequent emission.
    *   Number is threated as milliseconds interval (negative number is considered as 0).
    *   Date is threated as is (date in past is considered as now).
    *   Function is execute for each emitted value, with three arguments:
    *     value - The current value emitted by this flow
    *     index - The index of the current value
    *     context - The context object
    *   The result of condition function will be converted nu number and used as milliseconds interval.
    *
    * @example:
    * aeroflow(1).delay(500).dump().run();
    * // next 1 // after 500ms
    * // done
    * aeroflow(1, 2).delay(new Date + 500).dump().run();
    * // next 1 // after 500ms
    * // next 2
    * // done
    * aeroflow([1, 2, 3]).delay((value, index) => index * 500).dump().run();
    * // next 1
    * // next 2 // after 500ms
    * // next 3 // after 1000ms
    * // done
    */
  delay(condition) {
    return new Aeroflow(isFunction(condition)
      ? delayExtended(this[SYMBOL_EMITTER], condition)
      : isDate(condition)
        ? delayExtended(this[SYMBOL_EMITTER], () => Math.max(condition - new Date, 0))
        : delay(this[SYMBOL_EMITTER], Math.max(+condition || 0, 0)));
  }

  /**
    * Dumps each 'next' and final 'done' events emitted by this flow to the `logger` with optional prefix.
    *
    * @param {string} [prefix=''] A string prefix prepended to each event name.
    * @param {function} [logger=console.log] Function to execute for each event emitted, taking two arguments:
    *   event - The name of event emitted prepended with prefix (next or done).
    *   value - The value (next event) or error (done event) emitted by this flow.
    *
    * @example
    * aeroflow(1, 2, 3).dump('test ', console.info.bind(console)).run();
    * // test next 1
    * // test next 2
    * // test next 3
    * // test done
    */
  dump(prefix, logger) {
    let arity = arguments.length, emitter = this[SYMBOL_EMITTER];
    return new Aeroflow(arity === 0
      ? dumpToConsole(emitter, '')
      : arity === 1
        ? isFunction(prefix)
          ? dump(emitter, '', prefix)
          : dumpToConsole(emitter, '')
        : isFunction(logger)
          ? isNothing(prefix)
            ? dump(emitter, '', logger)
            : dump(emitter, prefix, logger)
          : dumpToConsole(emitter, prefix));
  }

  /**
    * Tests whether all values emitted by this flow pass the predicate test, returns flow emitting true if the predicate returns true for all emitted values; otherwise, false.
    *
    * @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
    *   or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.
    * @returns {Aeroflow} New flow that emits true or false.
    *
    * @example
    * aeroflow(1).every().dump().run();
    * // next true
    * // done
    * aeroflow.range(1, 3).every(2).dump().run();
    * // next false
    * // done
    * aeroflow.range(1, 3).every(value => value % 2).dump().run();
    * // next false
    * // done
    */
  every(predicate) {
    return new Aeroflow(
      every(this[SYMBOL_EMITTER],
      isNothing(predicate)
        ? value => !!value
        : isFunction(predicate)
          ? predicate
          : isRegExp(predicate)
            ? value => predicate.test(value)
            : value => value === predicate));
  }

  /**
    * Returns new from emitting inly values that pass the test implemented by the provided predicate.
    *
    * @param {function|regexp|any} [predicate] The test applied to each emitted value.
    *
    * @example
    * aeroflow(0, 1).filter().dump().run();
    * // next 1
    * // done
    * aeroflow('a', 'b', 'a').filter(/a/).dump().run();
    * // next "a"
    * // next "a"
    * // done
    * aeroflow('a', 'b', 'b').filter('b').dump().run();
    * // next "b"
    * // next "b"
    * // done
    */
  filter(predicate) {
    return new Aeroflow(
      filter(this[SYMBOL_EMITTER],
      isNothing(predicate)
        ? value => !!value
        : isFunction(predicate)
          ? predicate
          : isRegExp(predicate)
            ? value => predicate.test(value)
            : value => value === predicate));
  }

  join(separator) {
    return new Aeroflow(
      join(this[SYMBOL_EMITTER],
      arguments.length
        ? isFunction(separator)
          ? separator
          : () => '' + separator
        : () => ','));
  }

  map(mapper) {
    return arguments.length
      ? new Aeroflow(map(
        this[SYMBOL_EMITTER],
        isFunction(mapper)
          ? mapper
          : () => mapper))
      : this;
  }

  /**
    * Determines the maximum value emitted by this flow, returns new flow emitting only this value.
    *
    * @example
    * aeroflow([1, 2, 3]).max().dump().run();
    * // next 3
    * // done
    */
  max() {
    return new Aeroflow(
      reduceAlong(this[SYMBOL_EMITTER],
      (max, value) => value > max
        ? value
        : max));
  }

  /**
    * Determines the mean value emitted by this flow, returns new flow emitting only this value.
    *
    * @example
    * aeroflow([1, 1, 2, 3, 5, 7, 9]).mean().dump().run();
    * // next 3
    * // done
    */
  mean() {
    return new Aeroflow((next, done, context) => toArray(this[SYMBOL_EMITTER])(
      values => {
        if (!values.length) return;
        values.sort();
        next(values[floor(values.length / 2)]);
      },
      done,
      context));
  }

  /**
    * Determine the minimum value emitted by this flow, returns new flow emitting only this value.
    *
    * @example
    * aeroflow([1, 2, 3]).min().dump().run();
    * // next 1
    * // done
    */
  min() {
    return new Aeroflow(
      reduceAlong(this[SYMBOL_EMITTER],
      (min, value) => value < min
        ? value
        : min));
  }

  /**
  * Returns new flow emitting the emissions from all provided sources and then from this flow without interleaving them.
  * @param {...any} [sources] Values to concatenate with this flow.
  * @example
  * aeroflow(1).prepend(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
  * // next 2
  * // next 3
  * // next 4
  * // next 5
  * // next 6 // after 500ms
  * // next 1
  * // done
  */
  prepend(...sources) {
    return aeroflow(...sources, this);
  }

  /**
  * Applies a function against an accumulator and each value emitted by this flow to reduce it to a single value,
  * returns new flow emitting reduced value.
  *
  * @param {function|any} reducer Function to execute on each emitted value, taking four arguments:
  *   result - the value previously returned in the last invocation of the reducer, or seed, if supplied
  *   value - the current value emitted by this flow
  *   index - the index of the current value emitted by the flow
  *   context.data.
  *   If is not a function, a flow emitting just reducer value will be returned.
  * @param {any} initial Value to use as the first argument to the first call of the reducer.
  *
  * @example
  * aeroflow([2, 4, 8]).reduce((product, value) => product * value, 1).dump().run();
  * aeroflow(['a', 'b', 'c']).reduce((product, value, index) => product + value + index, '').dump().run();
  */
  reduce(reducer, seed) {
    switch (arguments.length) {
      case 0: return empty;
      case 1: return isFunction(reducer)
        ? new Aeroflow(reduceAlong(this[SYMBOL_EMITTER], reducer))
        : just(reducer)
      default: return isFunction(reducer)
        ? new Aeroflow(reduce(this[SYMBOL_EMITTER], reducer, seed))
        : just(reducer)
    }
  }

  /**
   * Runs this flow asynchronously, initiating source to emit values,
   * applying declared operators to emitted values and invoking provided callbacks.
   * If no callbacks provided, runs this flow for its side-effects only.
   *
   * @param {function} [next] Callback to execute for each emitted value, taking two arguments: value, context.
   * @param {function} [done] Callback to execute as emission is complete, taking two arguments: error, context.
   * @param {function} [data] Arbitrary value passed to each callback invoked by this flow as context.data argument.
   *
   * @example
   * aeroflow.range(1, 3).run(
   *   value => console.log('next', value)
   * , error => console.log('done', error));
   * // next 1
   * // next 2
   * // next 3
   * // done undefined
   */
  run(next, done, data) {
    setImmediate(() => run(
      this[SYMBOL_EMITTER],
      isFunction(next) ? next : noop,
      isFunction(done) ? done : noop,
      createContext(this, data)));
    return this;
  }

  /*
    var i = 0;
    aeroflow.repeat(() => ++i).take(3).share(2000).delay(1000).dump().run(
      null
      , (error, context) => context.flow.run(
        null
        , (error, context) => context.flow.run()));
  * /
  share(expiration) {
    return arguments.length
      ? isFunction(expiration)
        ? shareExtended(this, expiration)
        : isNumber(expiration)
          ? expiration <= 0
            ? this
            : shareExtended(this, () => expiration)
          : expiration
            ? share(this)
            : this
      : share(this);
  }
  */

  /**
    * Skips some of the values emitted by this flow,
    *   returns flow emitting remaining values.
    *
    * @param {number|function|any} [condition] The number or predicate function used to determine how many values to skip.
    *   If omitted, returned flow skips all values emitting done event only.
    *   If zero, returned flow skips nothing.
    *   If positive number, returned flow skips this number of first emitted values.
    *   If negative number, returned flow skips this number of last emitted values.
    *   If function, returned flow skips emitted values while this function returns trythy value.
    * @returns {Aeroflow} new flow emitting remaining values.
    *
    * @example
    * aeroflow([1, 2, 3]).skip().dump().run();
    * // done
    * aeroflow([1, 2, 3]).skip(1).dump().run();
    * // next 2
    * // next 3
    * // done
    * aeroflow([1, 2, 3]).skip(-1).dump().run();
    * // next 1
    * // next 2
    * // done
    * aeroflow([1, 2, 3]).some(value => value < 3).dump().run();
    * // next 3
    * // done
    */
  skip(condition) {
    let emitter = this[SYMBOL_EMITTER];
    return arguments.length
      ? isNumber(condition)
        ? condition === 0
          ? this
          : new Aeroflow(condition > 0
            ? skipFirst(emitter, condition)
            : skipLast(emitter, -condition))
        : isFunction(condition)
          ? new Aeroflow(skipWhile(emitter, condition))
          : condition
            ? new Aeroflow(skipAll(emitter))
            : this
      : new Aeroflow(skipAll(emitter));
  }

  /**
  * Tests whether some value emitted by this flow passes the predicate test,
    *   returns flow emitting true if the predicate returns true for any emitted value; otherwise, false.
    *
    * @param {function|regexp|any} [predicate] The predicate function or regular expression object used to test each emitted value,
    *   or scalar value to compare emitted values with. If omitted, default (truthy) predicate is used.
    * @returns {Aeroflow} New flow that emits true or false.
    *
    * @example
    * aeroflow(0).some().dump().run();
    * // next false
    * // done
    * aeroflow.range(1, 3).some(2).dump().run();
    * // next true
    * // done
    * aeroflow.range(1, 3).some(value => value % 2).dump().run();
    * // next true
    * // done
    */
  some(predicate) {
    return some(
      this[SYMBOL_EMITTER],
      arguments.length
        ? isFunction(predicate)
          ? predicate
          : isRegExp(predicate)
            ? value => predicate.test(value)
            : value => value === predicate
        : value => !!value);
  }

  /*
    aeroflow([4, 2, 5, 3, 1]).sort().dump().run();
  * /
  sort(order, ...comparers) {
    return sort(this, order, ...comparers);
  }
  */

  /*
    aeroflow([1, 2, 3]).sum().dump().run();
  */
  sum() {
    return reduce(this[SYMBOL_EMITTER], (result, value) => result + value, 0);
  }

  take(condition) {
    return arguments.length
      ? isNumber(condition)
        ? condition === 0
          ? empty
          : new Aeroflow(condition > 0
            ? takeFirst(this[SYMBOL_EMITTER], condition)
            : takeLast(this[SYMBOL_EMITTER], condition))
        : isFunction(condition)
          ? new Aeroflow(takeWhile(this[SYMBOL_EMITTER], condition))
          : condition
            ? this
            : empty
      : this;
  }

  /**
    * Executes provided callback once per each value emitted by this flow,
    * returns new tapped flow or this flow if no callback provided.
    *
    * @param {function} [callback] Function to execute for each value emitted, taking three arguments:
    *   value emitted by this flow,
    *   index of the value,
    *   context object.
    *
    * @example
    * aeroflow(1, 2, 3).tap((value, index) => console.log('value:', value, 'index:', index)).run();
    * // value: 1 index: 0
    * // value: 2 index: 1
    * // value: 3 index: 2
    */
  tap(callback) {
    return isFunction(callback)
      ? tap(this[SYMBOL_EMITTER], callback)
      : this;
  }

  /*
    aeroflow.repeat().take(3).delay(10).timestamp().dump().run();
  */
  timestamp() {
    return new Aeroflow(timestamp(this[SYMBOL_EMITTER]));
  }

  /**
    * Collects all values emitted by this flow to array, returns flow emitting this array.
    *
    * @param {function|any} [mapper] The mapping function used to transform each emitted value,
    *   or scalar value to fill array with ignoring source values.
    * @returns {Aeroflow} New flow that emits array.
    *
    * @example
    * aeroflow.range(1, 3).toArray().dump().run();
    * // next [1, 2, 3]
    * // done
    */
  toArray(mapper) {
    return new Aeroflow(arguments.length
      ? isFunction(mapper)
        ? toArrayExtended(this[SYMBOL_EMITTER], mapper)
        : toArrayExtended(this[SYMBOL_EMITTER], constant(mapper))
      : toArray(this[SYMBOL_EMITTER]));
  }

  /**
    * Collects all values emitted by this flow to ES6 map, returns flow emitting this map.
    *
    * @param {function|any} [keyMapper] The mapping function used to transform each emitted value to map key,
    *   or scalar value to use as map key.
    * @param {function|any} [valueMapper] The mapping function used to transform each emitted value to map value,
    *   or scalar value to use as map value.
    * @returns {Aeroflow} New flow that emits map.
    *
    * @example
    * aeroflow.range(1, 3).toMap(v => 'key' + v, true).dump().run();
    * // next Map {"key1" => true, "key2" => true, "key3" => true}
    * // done
    * aeroflow.range(1, 3).toMap(v => 'key' + v, v => v * 10).dump().run();
    * // next Map {"key1" => 10, "key2" => 20, "key3" => 30}
    * // done
    */
  toMap(keyMapper, valueMapper) {
    let arity = arguments.length, emitter = this[SYMBOL_EMITTER];
    return new Aeroflow(arity === 0
      ? toMap(emitter)
      : toMapExtended(
          emitter,
          isFunction(keyMapper)
            ? keyMapper
            : constant(keyMapper),
          arity === 1
            ? identity
            : isFunction(valueMapper)
              ? keyMapper
              : constant(valueMapper)));
  }

  /**
    * Collects all values emitted by this flow to ES6 set, returns flow emitting this set.
    *
    * @param {function|any} [mapper] The mapping function used to transform each emitted value to key,
    *   or scalar value to use as key.
    * @returns {Aeroflow} New flow that emits set.
    *
    * @example
    * aeroflow.range(1, 3).toSet().dump().run();
    * // next Set {1, 2, 3}
    * // done
    * aeroflow.range(1, 3).toSet(v => 'key' + v).dump().run();
    * // next Set {"key1", "key2", "key3"}
    * // done
    */
  toSet(mapper) {
    let emitter = this[SYMBOL_EMITTER];
    return new Aeroflow(arguments.length === 0
      ? toSet(emitter)
      : toSetExtended(
          emitter,
          isFunction(mapper)
          ? mapper
          : constant(mapper)));
  }

  /*
    aeroflow([1, 2, 2, 1]).unique().dump().run();
    todo: custom comparer support
  * /
  unique() {
    return new Aeroflow((next, done, context) => {
      let values = new Set;
      this[SYMBOL_EMITTER](
        value => {
          let size = values.size;
          values.add(value);
          if (size < values.size) next(value);
        },
        done,
        context);
    });
  }
  */
}

/*
  ------------
    creators
  ------------
*/

/**
  * Creates new flow emitting values from arbitrary sources.
  * @static
  *
  * @param {...any} [sources]
  *
  * @example
  * aeroflow(1, [2, 3], Promise.resolve(4), () => new Promise(resolve => setTimeout(() => resolve(5), 100)), new Set([6, 7])).dump().run();
  * // next 1
  * // next 2
  * // next 3
  * // next 4
  * // next 5 // after 100ms
  * // next 6
  * // next 7
  * // done
  */
function aeroflow(...sources) {
  return new Aeroflow(emit(...sources));
}

/**
  * Returns static empty flow emitting done event only.
  * @static
  *
  * @example
  * aeroflow.empty.dump().run();
  * // done
  */
empty = new Aeroflow(emitEmpty());

/**
  * Creates programmatically controlled flow.
  * @static
  *
  * @param {function|any} emitter The emitter function taking three arguments:
  *   next - the function emitting 'next' event,
  *   done - the function emitting 'done' event,
  *   context - current execution context.
  *
  * @example
  * aeroflow.create((next, done, context) => {
  *   next(1);
  *   next(new Promise(resolve => setTimeout(() => resolve(2), 500)));
  *   setTimeout(done, 1000);
  * }).dump().run();
  * // next 1 // after 500ms
  * // next 2 // after 1000ms
  * // done
  */
function create(emitter) {
  return arguments.length
    ? isFunction(emitter)
      ? new Aeroflow((next, done, context) => {
          let completed = false;
          context.onend(emitter(
            value => context() ? next() : false,
            error => {
              if (completed) return;
              completed = true;
              done();
              context.end();
            },
            context));
        })
      : just(emitter)
    : empty;
}

// Creates new flow execution context
function createContext(flow, data) {
  let active = true
    , callbacks = []
    , context = () => active
    , end = () => {
        if (active) {
          active = false;
          callbacks.forEach(callback => callback());
        }
        return false;
      }
    , onend = callback => {
        if (isFunction(callback)) active ? callbacks.push(callback) : callback();
        return callback;
      }
    , spawn = () => onend(createContext(flow, data));
  return defineProperties(context, {
    data: {value: data}
  , flow: {value: flow}
  , end: {value: end}
  , onend: {value: onend}
  , spawn: {value: spawn}
  });
}

/*
  ------------
    emitters
  ------------
*/

// Returns function emitting values from multiple arbitrary sources.
function emit(...sources) {
  switch (sources.length) {
    case 0:
      return emitEmpty(); // todo: Aeroplan
    case 1:
      let source = sources[0];
      switch (classof(source)) {
        case CLASS_AEROFLOW: return source[SYMBOL_EMITTER];
        case CLASS_ARRAY: return emitArray(source);
        case CLASS_FUNCTION: return emitFunction(source);
        case CLASS_PROMISE: return emitPromise(source);
        default:
          return Object.isObject(source) && Symbol.iterator in source
            ? emitIterable(source)
            : emitJust(source);
      }
      break;
    default:
      return (next, done, context) => {
        let limit = sources.length, index = -1, proceed = () => {
          ++index < limit
            ? emit(sources[index])(next, proceed, context)
            : done();
        };
        proceed();
      };
  }
}
// Returns function emitting values from array.
function emitArray(source) {
  return (next, done, context) => {
    let index = -1;
    while (context() && ++index < source.length) next(source[index]);
    done();
  };
}
// Returns function emitting done event only.
function emitEmpty() {
  return (next, done) => {
    done();
    return true;
  }
}
// Returns function emitting value returned by source function.
function emitFunction(source) {
  return (next, done, context) => emit(source(context.data))(next, done, context);
}
// Returns function emitting values returned by source iterable object.
function emitIterable(source) {
  return (next, done, context) => {
    let iteration, iterator = source[Symbol.iterator]();
    while (context() && !(iteration = iterator.next()).done) next(iteration.value);
    done();
  };
}
// Returns function emitting arbitrary value.
function emitJust(value) {
  return (next, done) => {
    let result = next(value);
    done();
    return result;
  };
}
// Returns function emitting value returned by promise.
function emitPromise(source) {
  return (next, done, context) => source.then(
    value => emit(value)(next, done, context),
    error => {
      done(error);
      throwError(error);
    });
}

/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
function expand(expander, seed) {
  return new Aeroflow(isFunction(expander)
    ? (next, done, context) => {
        let index = 0, value = seed;
        while (context()) next(value = expander(value, index++, context.data));
        done();
      }
    : repeatStatic(expander));
}

/**
  * Returns new flow emitting the provided value only.
  * @static
  * 
  * @param {any} value The value to emit.
  *
  * @example
  * aeroflow.just('test').dump().run();
  * // next "test"
  * // done
  * aeroflow.just(() => 'test').dump().run();
  * // next "test"
  * // done
  */
function just(value) {
  return new Aeroflow(emitJust(value));
}

/**
  * Returns new flow emitting random numbers.
  * @static
  *
  * @example
  * aeroflow.random().take(3).dump().run();
  * aeroflow.random(0.1).take(3).dump().run();
  * aeroflow.random(null, 0.1).take(3).dump().run();
  * aeroflow.random(1, 9).take(3).dump().run();
  */
function random(inclusiveMin, exclusiveMax) {
  inclusiveMin = +inclusiveMin || 0;
  exclusiveMax = +exclusiveMax || 1;
  exclusiveMax -= inclusiveMin;
  let generator = isInteger(inclusiveMin) && isInteger(exclusiveMax)
    ? () => floor(inclusiveMin + exclusiveMax * Math.random())
    : () => inclusiveMin + exclusiveMax * Math.random()
  return new Aeroflow((next, done, context) => {
      while(context()) next(generator());
      done();
    });
}

/*
  aeroflow.range().take(3).dump().run();
  aeroflow.range(-3).take(3).dump().run();
  aeroflow.range(1, 1).dump().run();
  aeroflow.range(0, 5, 2).dump().run();
  aeroflow.range(5, 0, -2).dump().run();
*/
function range(inclusiveStart, inclusiveEnd, step) {
  inclusiveEnd = +inclusiveEnd || maxInteger;
  inclusiveStart = +inclusiveStart || 0;
  step = +step || (inclusiveStart < inclusiveEnd ? 1 : -1);
  return inclusiveStart === inclusiveEnd
    ? just(inclusiveStart)
    : new Aeroflow((next, done, context) => {
        let i = inclusiveStart - step;
        if (inclusiveStart < inclusiveEnd) while (context() && (i += step) <= inclusiveEnd) next(i);
        else while (context() && (i += step) >= inclusiveEnd) next(i);
        done();
      });
}

/**
  * Creates flow of repeting values.
  * @static
  *
  * @param {function|any} repeater Arbitrary scalar value to repeat; or function invoked repeatedly with two arguments: 
  *   index - index of the value being emitted,
  *   data - contextual data.
  * @returns {Aeroflow} new flow.
  *
  * @example
  * aeroflow.repeat(new Date().getSeconds(), 3).dump().run();
  * // next 1
  * // next 1
  * // next 1
  * // done
  * aeroflow.repeat(() => new Date().getSeconds(), 3).delay((value, index) => index * 1000).dump().run();
  * // next 1
  * // next 2
  * // next 3
  * // done
  * aeroflow.repeat(index => Math.pow(2, index), 3).dump().run();
  * // next 1
  * // next 2
  * // next 4
  * // done
  */
function repeat(value) {
  return new Aeroflow(isFunction(value)
    ? repeatDynamic(value)
    : repeatStatic(value));
}
function repeatDynamic(repeater) {
  return (next, done, context) => {
    let index = 0, result;
    while (context() && false !== (result = repeater(index++, context.data))) next(result);
    done();
  };
}
function repeatStatic(value) {
  return (next, done, context) => {
    while(context()) next(value);
    done();
  };
}

/*
  -------------
    operators
  -------------
*/

function delay(emitter, interval) {
  return (next, done, context) => emitter(
    value => new Promise(resolve =>
      setTimeout(
        () => resolve(next(value)),
        interval)),
    error => new Promise(resolve =>
      setTimeout(
        () => resolve(done(error)),
        interval)),
    context);
}
function delayExtended(emitter, selector) {
  return (next, done, context) => {
    let completition = now(), index = 0;
    emitter(
      value => {
        let interval = selector(value, index++, context.data), estimation;
        if (isDate(interval)) {
          estimation = interval;
          interval = interval - now();
        }
        else estimation = now() + interval;
        if (completition < estimation) completition = estimation;
        return new Promise(resolve => setTimeout(
          () => resolve(next(value)),
          Math.max(interval, 0)));
      },
      error => {
        completition -= now();
        return new Promise(resolve => setTimeout(
          () => resolve(done(error)),
          Math.max(completition, 0)));
      },
      context);
  };
}

function dump(emitter, prefix, logger) {
  return (next, done, context) => emitter(
    value => {
      logger(prefix + 'next', value);
      next(value);
    },
    error => {
      error
        ? logger(prefix + 'done', error)
        : logger(prefix + 'done');
      done(error);
    },
    context);
}

function dumpToConsole(emitter, prefix) {
  return (next, done, context) => emitter(
    value => {
      console.log(prefix + 'next', value);
      next(value);
    },
    error => {
      error
        ? console.error(prefix + 'done', error)
        : console.log(prefix + 'done');
      done(error);
    },
    context);
}

function every(emitter, predicate) {
  return (next, done, context) => {
    let idle = true, result = true;
    context = context.spawn();
    emitter(
      value => {
        idle = false;
        if (!predicate(value)) return;
        result = false;
        context.end();
      },
      error => {
        next(result && !idle);
        done(error);
      },
      context);
  };
}

function filter(emitter, predicate) {
  return (next, done, context) => {
    let index = 0;
    emitter(
      value => predicate(value, index++, context.data)
        ? next(value)
        : true,
      done,
      context);
  };
}

function join(emitter, joiner) {
  return reduceOptional(
    emitter,
    (result, value, index, data) => result.length
      ? result + joiner(value, index, data) + value 
      : value,
    '');
}

function map(emitter, mapper) {
  return (next, done, context) => {
    let index = 0;
    emitter(
      value => next(mapper(value, index++, context.data)),
      done,
      context);
  };
}

function reduce(emitter, reducer, seed) {
  return (next, done, context) => {
    let index = 0, result = seed;
    emitter(
      value => result = reducer(result, value, index++, context.data),
      error => {
        next(result);
        done(error);
      },
      context);
  };
}
function reduceAlong(emitter, reducer) {
  return (next, done, context) => {
    let idle = true, index = 1, result;
    emitter(
      value => {
        if (idle) {
          idle = false;
          result = value;
        }
        else result = reducer(result, value, index++, context.data);
      },
      error => {
        if (!idle) next(result);
        done(error);
      },
      context);
  };
}
function reduceOptional(emitter, reducer, seed) {
  return (next, done, context) => {
    let idle = true, index = 0, result = seed;
    emitter(
      value => {
        idle = false;
        result = reducer(result, value, index++, context.data);
      },
      error => {
        if (!idle) next(result);
        done(error);
      },
      context);
  };
}

function run(emitter, next, done, context) {
  let index = 0;
  emitter(
    value => next(value, index++, context),
    error => {
      context.end();
      done(error, index, context);
    },
    context);
}

function skipAll(emitter) {
  return (next, done, context) => emitter(noop, done, context);
}
function skipFirst(emitter, count) {
  return (next, done, context) => {
    let index = -1;
    emitter(
      value => ++index < count ? false : next(value),
      done,
      context);
  };
}
function skipLast(emitter, count) {
  return (next, done, context) => toArray(emitter)(
    value => {
      for (let index = 0, limit = value.length - count; index < limit; index++) next(value[index]);
    },
    done,
    context);
}
function skipWhile(emitter, predicate) {
  return (next, done, context) => {
    let index = 0, skipping = true;
    emitter(
      value => {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        if (!skipping) next(value);
      },
      done,
      context);
  };
}

function some(emitter, predicate) {
  return (next, done, context) => {
    let result = false;
    context = context.spawn();
    emitter(
      value => {
        if (!predicate(value)) return;
        result = true;
        context.end();
      },
      error => {
        next(result);
        done(error);
      },
      context);
  };
}

function takeFirst(emitter, count) {
  return (next, done, context) => {
    let index = 1;
    context = context.spawn();
    emitter(
      value => {
        next(value);
        if (count <= index++) context.end();
      },
      done,
      context);
  };
}
function takeLast(emitter, count) {
  return (next, done, context) => toArray(emitter)(
    value => {
      let limit = value.length, index = Math.max(limit - 1 - count, 0);
      while (index < limit) next(value[index++]);
    },
    done,
    context);
}
function takeWhile(emitter, predicate) {
  return (next, done, context) => {
    let index = 0;
    context = context.spawn();
    emitter(
      value => predicate(value, index++, context.data)
        ? next(value)
        : context.end(),
      done,
      context);
  };
}

function tap(emitter, callback) {
  return (next, done, context) => {
    let index = 0;
    emitter(
      value => {
        callback(value, index++, context.data);
        return next(value);
      },
      done,
      context);
  };
}

function timestamp(emitter) {
  return new Aeroflow((next, done, context) => {
    let past = now();
    emitter(
      value => {
        let current = now();
        next({
          timedelta: current - past,
          timestamp: now, value
        });
        past = current;
      },
      done,
      context);
  });
}

function toArray(emitter) {
  return (next, done, context) => {
    let result = [];
    emitter(
      value => result.push(value),
      error => {
        next(result);
        done(error);
      },
      context);
  };
}
function toArrayExtended(emitter, mapper) {
  return (next, done, context) => {
    let index = 0, result = [];
    emitter(
      value => result.push(mapper(value, index++, context.data)),
      error => {
        next(result);
        done(error);
      },
      context);
  };
}

function toMap(emitter) {
  return (next, done, context) => {
    let result = new Map;
    emitter(
      value => result.set(value, value),
      error => {
        next(result);
        done(error);
      },
      context);
  };
}
function toMapExtended(emitter, keyMapper, valueMapper) {
  return (next, done, context) => {
    let index = 0, result = new Map;
    emitter(
      value =>
        result.set(keyMapper(value, index++, context.data), valueMapper(value, index++, context.data)),
      error => {
        next(result);
        done(error);
      },
      context);
  };
}

function toSet(emitter) {
  return (next, done, context) => {
    let result = new Set;
    emitter(
      value =>
        result.add(value),
      error => {
        next(result);
        done(error);
      },
      context);
  };
}
function toSetExtended(emitter, mapper) {
  return (next, done, context) => {
    let index = 0, result = new Set;
    emitter(
      value =>
        result.add(mapper(value, index++, context.data)),
      error => {
        next(result);
        done(error);
      },
      context);
  };
}

/*
  -----------
    exports
  -----------
*/

module.exports = defineProperties(aeroflow, {
  create: {value: create}
, empty: {value: empty}
, expand: {value: expand}
, just: {value: just}
, random: {value: random}
, range: {value: range}
, repeat: {value: repeat}
});

/*
function share(flow) {
  let cache = [], cached = false;
  return new Aeroflow((next, done, context) => {
    if (cached) {
      cache.forEach(next);
      done();
    } 
    else flow[SYMBOL_EMITTER](
      value => {
        cache.push(value);
        next(value);
      },
      error => {
        cached = true;
        done(error);
      },
      context);
  });
}
function shareExtended(flow, selector) {
  let cache = [], cached = false;
  return new Aeroflow((next, done, context) => {
    if (cached) {
      cache.forEach(next);
      done();
    }
    else flow[SYMBOL_EMITTER](
      value => {
        cache.push(value);
        next(value);
      },
      error => {
        setTimeout(() => {
          cache = [];
          cached = false
        }, selector(context.data));
        done(error);
      },
      context);
  });
}

function sort(flow, order, ...selectors) {
  if (isFunction(order)) {
    selectors.unshift(order);
    order = 1;
  }
  if(!selectors.every(isFunction)) throwError('Selector function expected.');
  switch (order) {
    case 'asc': case 1: case undefined: case null:
      order = 1;
      break;
    case 'desc': case -1:
      order = -1;
      break;
    default:
      order = order ? 1 : -1;
      break;
  }
  switch(selectors.length) {
    case 0: return sortStandard(flow, order);
    case 1: return sortWithSelector(flow, order, selectors[0]);
    default: return sortWithSelectors(flow, order, ...selectors);
  }
}
function sortStandard(flow, order) {
  let array = toArray(flow);
  return new Aeroflow((next, done, context) =>
    array[SYMBOL_EMITTER](
      values => order === 1
        ? values.sort().forEach(next)
        : values.sort().reverse().forEach(next)
      , done
      , context));
}
function sortWithSelector(flow, order, selector) {
  let array = toArray(flow)
    , comparer = (left, right) => order * compare(selector(left), selector(right));
  return new Aeroflow((next, done, context) => array[SYMBOL_EMITTER](
    values => values.sort(comparer).forEach(next)
  , done
  , context));
}
function sortWithSelectors(flow, order, ...selectors) {
  let array = toArray(flow)
    , count = selectors.length
    , comparer = (left, right) => {
        let index = -1;
        while (++index < count) {
          let selector = selectors[index]
            , result = order * compare(selector(left), selector(right));
          if (result) return result;
        }
        return 0;
      };
  return new Aeroflow((next, done, context) => 
    array[SYMBOL_EMITTER](
      values => values.sort(comparer).forEach(next)
    , done
    , context));
}
*/