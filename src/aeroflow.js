/**
  * Lazily computed async reactive data flow.
  * @module aeroflow
  * @author Denis Vlassenko <denis_vlassenko@epam.com>
  */

'use strict';

/*
  -------------
    constants
  -------------
*/

const
  AEROFLOW = 'Aeroflow'
, EMITTER = Symbol('emitter');

/*
  -------------
    shortcuts
  -------------
*/

const
  classof = Object.classof
, defineProperties = Object.defineProperties
, floor = Math.floor
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
, isAeroflow = value => AEROFLOW === classof(value)
, isArray = value => 'Array' === classof(value)
, isDate = value => 'Date' === classof(value)
, isError = value => 'Error' === classof(value)
, isFunction = value => 'Function' === classof(value)
, isInteger = Number.isInteger
, isIterable = value => Object.isObject(value) && Symbol.iterator in value
, isNothing = value => value == null
, isNumber = value => 'Number' === classof(value)
, isPromise = value => 'Promise' === classof(value)
, isRegExp = value => 'RegExp' === classof(value)
, noop = () => {}
, throwError = error => {
    throw isError(error) ? error : new Error(error);
  };

let empty;

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
    , spawn = () => onend(createContext(flow, data))
    ;
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
      if (isAeroflow(source)) return source[EMITTER];
      if (isArray(source)) return emitArray(source);
      if (isFunction(source)) return emitFunction(source);
      if (isPromise(source)) return emitPromise(source);
      if (isIterable(source)) return emitIterable(source);
      return emitValue(source);
    default:
      return (next, done, context) => {
        let limit = sources.length, index = -1;
        !function proceed() {
          ++index < limit
            ? emit(sources[index])(next, proceed, context)
            : done();
        }();
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
  return (next, done) => done();
}
// Returns function emitting value returned by source function.
function emitFunction(source) {
  return (next, done, context) => emit(source())(next, done, context);
}
// Returns function emitting values returned by source iterable object.
function emitIterable(source) {
  return (next, done, context) => {
    let iterator = source[Symbol.iterator]();
    while (context()) {
      let result = iterator.next();
      if (result.done) break;
      else next(result.value);
    }
    done();
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
// Returns function emitting scalar value.
function emitValue(value) {
  return (next, done) => {
    next(value);
    done();
  };
}

/*
  -----------
    classes
  -----------
*/

/** Class */
class Aeroflow {
  constructor(emitter) {
    defineProperties(this, {
      [EMITTER]: {value: emitter}
    , [Symbol.toStringTag]: {value: AEROFLOW}
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
    return reduce(this, result => result + 1, 0);
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
    return isFunction(condition)
      ? delayExtended(this, condition)
      : isDate(condition)
        ? delayExtended(this, () => condition - new Date)
        : delay(this, +condition || 0);
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
    switch (arguments.length) {
      case 0: return dumpToConsole(this, '');
      case 1: return isFunction(prefix)
        ? dump(this, '', prefix)
        : dumpToConsole(this, '');
      default: return isFunction(logger)
        ? isNothing(prefix)
          ? dump(this, '', logger)
          : dump(this, prefix, logger)
        : dumpToConsole(this, prefix);
    }
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
    return every(this, isNothing(predicate)
      ? value => !!value
      : isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate);
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
    return filter(this, isNothing(predicate)
      ? value => !!value
      : isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate);
  }

  join(separator) {
    return join(this, arguments.length
      ? isFunction(separator)
        ? separator
        : () => '' + separator
      : () => ',');
  }

  map(mapper) {
    return arguments.length
      ? map(this, isFunction(mapper)
        ? mapper
        : () => mapper)
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
    return reduceAlong(this, (max, value) => value > max ? value : max);
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
    let array = toArray(this);
    return new Aeroflow((next, done, context) => array[EMITTER](
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
    return reduceAlong(this, (min, value) => value < min ? value : min);
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
        ? reduceAlong(this, reducer)
        : just(reducer)
      default: return isFunction(reducer)
        ? reduce(this, reducer, seed)
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
      this
    , isFunction(next) ? next : noop
    , isFunction(done) ? done : noop
    , createContext(this, data)));
    return this;
  }

  /*
    var i = 0;
    aeroflow.repeat(() => ++i).take(3).share(2000).delay(1000).dump().run(
      null
      , (error, context) => context.flow.run(
        null
        , (error, context) => context.flow.run()));
  */
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
    return arguments.length
      ? isNumber(condition)
        ? condition === 0
          ? this
          : condition > 0
            ? skipFirst(this, condition)
            : skipLast(this, condition)
        : isFunction(condition)
          ? skipWhile(this, condition)
          : condition
            ? skipAll(this)
            : this
      : skipAll(this);
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
    return some(this, arguments.length
      ? isFunction(predicate)
        ? predicate
        : isRegExp(predicate)
          ? value => predicate.test(value)
          : value => value === predicate
      : value => !!value);
  }

  /*
    aeroflow([4, 2, 5, 3, 1]).sort().dump().run();
  */
  sort(order, ...comparers) {
    return sort(this, order, ...comparers);
  }

  /*
    aeroflow([1, 2, 3]).sum().dump().run();
  */
  sum() {
    return reduce(this, (result, value) => result + value, 0);
  }

  take(condition) {
    return arguments.length
      ? isNumber(condition)
        ? condition === 0
          ? empty
          : condition > 0
            ? takeFirst(this, condition)
            : takeLast(this, condition)
        : isFunction(condition)
          ? takeWhile(this, condition)
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
      ? tap(this, callback)
      : this;
  }

  /*
    aeroflow.repeat().take(3).delay(10).timedelta().dump().run();
  */
  timedelta() {
    return new Aeroflow((next, done, context) => {
      let past = now();
      this[EMITTER](
        value => {
          let current = now();
          next({ timedelta: current - past, value });
          past = current;
        }
      , done
      , context);
    });
  }

  /*
    aeroflow.repeat().take(3).delay(10).timestamp().dump().run();
  */
  timestamp() {
    return new Aeroflow((next, done, context) =>
      this[EMITTER](
        value => next({ timestamp: now(), value })
      , done
      , context));
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
    return arguments.length
      ? isFunction(mapper)
        ? toArrayExtended(this, mapper)
        : toArrayExtended(this, constant(mapper))
      : toArray(this);
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
    switch (arguments.length) {
      case 0: return toMap(this);
      case 1: return toMapExtended(
        this
      , isFunction(keyMapper)
        ? keyMapper
        : constant(keyMapper)
      , identity);
      default: return toMapExtended(
        this
      , isFunction(keyMapper)
        ? keyMapper
        : constant(keyMapper)
      , isFunction(valueMapper)
        ? keyMapper
        : constant(valueMapper));
    }
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
    return arguments.length
      ? isFunction(mapper)
        ? toSetExtended(this, mapper)
        : toSetExtended(this, constant(mapper))
      : toSet(this);
  }

  /*
    aeroflow([1, 2, 2, 1]).unique().dump().run();
    todo: custom comparer support
  */
  unique() {
    return new Aeroflow((next, done, context) => {
      let values = new Set;
      this[EMITTER](
        value => {
          let size = values.size;
          values.add(value);
          if (size < values.size) next(value);
        },
        done,
        context);
    });
  }
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

/*
  aeroflow.expand(value => value * 2, 1).take(3).dump().run();
  aeroflow.expand(value => new Date(+value + 1000 * 60), new Date).take(3).dump().run();
*/
function expand(expander, seed) {
  return isFunction(expander)
    ? new Aeroflow((next, done, context) => {
        let index = 0, value = seed;
        while (context()) next(value = expander(value, index++, context.data));
        done();
      })
    : repeatStatic(expander);
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
  return new Aeroflow(emitValue(value));
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
function range(start, end, step) {
  end = +end || maxInteger;
  start = +start || 0;
  step = +step || (start < end ? 1 : -1);
  return start === end
    ? just(start)
    : new Aeroflow((next, done, context) => {
        let i = start - step;
        if (start < end) while (context() && (i += step) <= end) next(i);
        else while (context() && (i += step) >= end) next(i);
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
  return isFunction(value)
    ? repeatDynamic(value)
    : repeatStatic(value);
}
function repeatDynamic(repeater) {
  return new Aeroflow((next, done, context) => {
    let index = 0;
    proceed();
    function complete(error) {
      if (error) {
        done();
        throwError(error);
      }
      else if (context()) setImmediate(proceed);
      else done();
    }
    function proceed() {
      let result = context() && repeater(index, context.data);
      if (result === false) done();
      else emit(result)(next, complete, context);
    }
  });
}
function repeatStatic(value) {
  return new Aeroflow((next, done, context) => {
    while(context()) next(value);
    done();
  });
}

/*
  -------------
    operators
  -------------
*/

function delay(flow, interval) {
  return new Aeroflow((next, done, context) => flow[EMITTER](
    value => setTimeout(() => next(value), Math.max(interval, 0)),
    error => setTimeout(() => done(error), Math.max(interval, 0)),
    context));
}
function delayExtended(flow, selector) {
  return new Aeroflow((next, done, context) => {
    let completition = now(), index = 0;
    flow[EMITTER](
      value => {
        let interval = selector(value, index++, context.data), estimation;
        if (isDate(interval)) {
          estimation = interval;
          interval = interval - now();
        }
        else estimation = now() + interval;
        if (completition < estimation) completition = estimation;
        interval < 0
          ? setImmediate(() => next(value)) 
          : setTimeout(() => next(value), interval);
      },
      error => {
        completition -= now();
        completition < 0
          ? setImmediate(() => done(error))
          : setTimeout(() => done(error), completition);
      },
      context);
  });
}

function dump(flow, prefix, logger) {
  return new Aeroflow((next, done, context) => flow[EMITTER](
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
    context));
}

function dumpToConsole(flow, prefix) {
  return new Aeroflow((next, done, context) => flow[EMITTER](
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
    context));
}

function every(predicate) {
  return new Aeroflow((next, done, context) => {
    let idle = true, result = true;
    context = context.spawn();
    this[EMITTER](
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
  });
}

function filter(flow, predicate) {
  return new Aeroflow((next, done, context) => {
    let index = 0;
    flow[EMITTER](
      value => predicate(value, index++, context.data)
        ? next(value)
        : false
    , done
    , context);
  });
}

function join(flow, joiner) {
  return reduceOptional(
    flow
  , (result, value, index, data) => result.length
      ? result + joiner(value, index, data) + value 
      : value
  , '');
}

function map(flow, mapper) {
  return new Aeroflow((next, done, context) => {
    let index = 0;
    flow[EMITTER](
      value => next(mapper(value, index++, context.data))
    , done
    , context);
  });
}

function reduce(flow, reducer, seed) {
  return new Aeroflow((next, done, context) => {
    let index = 0, result = seed;
    flow[EMITTER](
      value => result = reducer(result, value, index++, context.data),
      error => {
        next(result);
        done(error);
      },
      context);
  });
}
function reduceAlong(flow, reducer) {
  return new Aeroflow((next, done, context) => {
    let idle = true, index = 0, result;
    flow[EMITTER](
      value => {
        if (empty) {
          idle = false;
          index++;
          result = value;
        }
        else result = reducer(result, value, index++, context.data);
      },
      error => {
        if (!idle) next(result);
        done(error);
      },
      context);
  });
}
function reduceOptional(flow, reducer, seed) {
  return new Aeroflow((next, done, context) => {
    let idle = true, index = 0, result = seed;
    flow[EMITTER](
      value => {
        idle = false;
        result = reducer(result, value, index++, context.data);
      },
      error => {
        if (!idle) next(result);
        done(error);
      },
      context);
  });
}

function run(flow, next, done, context) {
  flow[EMITTER](
    value => next(value, context),
    error => {
      context.end();
      done(error, context);
    },
    context);
}

function share(flow) {
  let cache = [], cached = false;
  return new Aeroflow((next, done, context) => {
    if (cached) {
      cache.forEach(next);
      done();
    } 
    else flow[EMITTER](
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
    else flow[EMITTER](
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

function skipAll(flow) {
  return new Aeroflow((next, done, context) => flow[EMITTER](noop, done, context));
}
function skipFirst(flow, count) {
  return new Aeroflow((next, done, context) => {
    let index = -1;
    flow[EMITTER](
      value => ++index < count ? false : next(value),
      done,
      context);
  });
}
function skipLast(flow, count) {
  let array = toArray(flow);
  return new Aeroflow((next, done, context) => array[EMITTER](
    value => {
      for (let index = 0, limit = value.length - count; index < limit; index++) next(value[index]);
    },
    done,
    context));
}
function skipWhile(flow, predicate) {
  return new Aeroflow((next, done, context) => {
    let index = 0, skipping = true;
    flow[EMITTER](
      value => {
        if (skipping && !predicate(value, index++, context.data)) skipping = false;
        if (!skipping) next(value);
      },
      done,
      context);
  });
}

function some(flow, predicate) {
  return new Aeroflow((next, done, context) => {
    let result = false;
    context = context.spawn();
    flow[EMITTER](
      value => {
        if (!predicate(value)) return;
        result = true;
        context.end();
      }
    , error => {
        next(result);
        done(error);
      }
    , context);
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
    array[EMITTER](
      values => order === 1
        ? values.sort().forEach(next)
        : values.sort().reverse().forEach(next)
      , done
      , context));
}
function sortWithSelector(flow, order, selector) {
  let array = toArray(flow)
    , comparer = (left, right) => order * compare(selector(left), selector(right));
  return new Aeroflow((next, done, context) => array[EMITTER](
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
    array[EMITTER](
      values => values.sort(comparer).forEach(next)
    , done
    , context));
}

function takeFirst(flow, count) {
  return new Aeroflow((next, done, context) => {
    let index = 1;
    context = context.spawn();
    flow[EMITTER](
      value => {
        next(value);
        if (count <= index++) context.end();
      }
    , done
    , context);
  });
}
function takeLast(flow, count) {
  let array = toArray(flow);
  return new Aeroflow((next, done, context) => {
    array[EMITTER](
      value => {
        let limit = value.length
          , index = Math.max(length - 1 - count, 0);
        while (index < limit) next(value[index++]);
      }
    , done
    , context);
  });
}
function takeWhile(flow, predicate) {
  return new Aeroflow((next, done, context) => {
    let index = 0;
    context = context.spawn();
    flow[EMITTER](
      value => predicate(value, index++, context.data)
        ? next(value)
        : context.end()
    , done
    , context);
  });
}

function tap(flow, callback) {
  return new Aeroflow((next, done, context) => {
    let index = 0;
    flow[EMITTER](
      value => {
        callback(value, index++, context.data);
        next(value);
      }
    , done
    , context);
  });
}

function toArray(flow) {
  return new Aeroflow((next, done, context) => {
    let result = [];
    flow[EMITTER](
      value => result.push(value)
    , error => {
        next(result);
        done(error);
      }
    , context);
  });
}
function toArrayExtended(flow, mapper) {
  return new Aeroflow((next, done, context) => {
    let index = 0
      , result = [];
    flow[EMITTER](
      value => result.push(mapper(value, index++, context.data))
    , error => {
        next(result);
        done(error);
      }
    , context);
  });
}

function toMap(flow) {
  return new Aeroflow((next, done, context) => {
    let result = new Map;
    flow[EMITTER](
      value => result.set(value, value)
    , error => {
        next(result);
        done(error);
      }
    , context);
  });
}
function toMapExtended(flow, keyMapper, valueMapper) {
  return new Aeroflow((next, done, context) => {
    let index = 0
      , result = new Map;
    flow[EMITTER](
      value => result.set(keyMapper(value, index++, context.data), valueMapper(value, index++, context.data))
    , error => {
        next(result);
        done(error);
      }
    , context);
  });
}

function toSet(flow) {
  return new Aeroflow((next, done, context) => {
    let result = new Set;
    flow[EMITTER](
      value => result.add(value)
    , error => {
        next(result);
        done(error);
      }
    , context);
  });
}
function toSetExtended(flow, mapper) {
  return new Aeroflow((next, done, context) => {
    let index = 0
      , result = new Set;
    flow[EMITTER](
      value => result.add(mapper(value, index++, context.data))
    , error => {
        next(result);
        done(error);
      }
    , context);
  });
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