import { objectDefineProperties } from './utilites';
import { adapters } from './adapters/index';
import { create, empty, expand, random, range, repeat } from './generators/index';
import { notifiers } from './notifiers/index';
import { operators } from './operators/index';
import { instance } from './instance';

/**
Creates new flow emitting values extracted from every provided data source in series.
If no data sources provided, creates empty flow emitting "done" event only.

@alias aeroflow

@param {any} [sources]
Data sources to extract values from.

@return {Flow}

@property {Adapters} adapters
Mixed array/map of adapters for various types of data sources.
As a map matches the type of a data source to adapter function (e.g. Promise -> promiseAdapter).
As an array contains functions performing arbitrary (more complex than type matching) testing
of a data source (e.g. some iterable -> iterableAdapter).
When aeroflow adapts particular data source, direct type mapping is attempted first.
Then, if mapping attempt did not return an adapter function,
array is enumerated in reverse order, from last indexed adapter to first,
until a function is returned.
This returned function is used as adapter and called with single argument: the data source being adapted.
Expected that adapter function being called with data source returns an emitter function accepting 2 arguments:
next callback, done callback and execution context.
If no adapter function has been found, the data source is treated as scalar value and emitted as is.
See examples to find out how to create and register custom adapters.

@property {object} operators
Map of operators available for use with every flow.
See examples to find out how to create and register custom operators.

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
aeroflow.adapters.use('String', aeroflow.adapters['Array']);
aeroflow("test").dump().run();
// next t
// next e
// next s
// next t
// done true
aeroflow.operators.test = function() {
  return this.chain(emitter => (next, done, context) => emitter(
    value => next('test:' + value),
    done,
    context));
}
aeroflow(42).test().dump().run();
// next test:42
// done true
*/
export function factory(...sources) {
  return instance((next, done, context) => {
    let index = -1;
    !function proceed(result) {
      if (result !== true || ++index >= context.sources.length) done(result);
      else try {
        const source = context.sources[index];
        let adapter = adapters.get(source);
        if (!adapter) adapter = adapters.def(source);
        adapter(next, proceed, context);
      }
      catch (error) {
        done(error);
      }
    }(true);
  }, sources);
}

/**
Returns new flow emitting the provided source as is.

@alias aeroflow.just

@param {any} source
The source to emit as is.

@return {Flow}
The new flow emitting provided value.

@example
aeroflow.just([1, 2, 3]).dump().run();
// next [1, 2, 3]
// done
*/
// TODO: multiple arguments
function just(source) {
  return instance(adapters.def(source));
}

objectDefineProperties(factory, {
  adapters: { value: adapters },
  create: { value: create },
  empty: { enumerable: true, value: empty },
  expand: { value: expand },
  just: { value: just },
  notifiers: { value: notifiers },
  operators: { value: operators },
  random: { value: random },
  range: { value: range },
  repeat: { value: repeat }
});
