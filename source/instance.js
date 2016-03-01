import { AEROFLOW, CLASS, PROTOTYPE } from './symbols';
import { isError, isFunction, noop, objectDefineProperties, objectCreate } from './utilites';
import { operators } from './operators/index';

/**
@class

@property {function} emitter
@property {array} sources
*/
function Flow() { }

export function instance(emitter, sources) {
  return objectDefineProperties(new Flow, {
    emitter: { value: emitter },
    sources: { value: sources }
  });
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
  return instance(this.emitter, sources);
}

/**
@alias Flow#chain

@param {function} [operator]

@return {Flow}
*/
function chain(operator) {
  return instance(operator(this.emitter), this.sources);
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
  return instance(this.emitter, this.sources.concat(sources));
}

/**
Runs this flow.

@alias Flow#run

@param {function|any} [next]
Optional callback called for each data value emitted by this flow with 3 arguments:
1) the emitted value,
2) zero-based index of emitted value,
3) context data.
When passed something other than function, it considered as context data.
@param {function|any} [done]
Optional callback called after this flow has finished emission of data with 2 arguments:
1) the error thrown within this flow
or boolean value indicating lazy (false) or eager (true) enumeration of data sources,
2) context data.
When passed something other than function, it considered as context data.
@param {any} [data]
Arbitrary value passed as context data to each callback invoked by this flow as the last argument.

@return {Promise}
New promise,
resolving to the latest value emitted by this flow (for compatibility with ES7 await operator),
or rejecting to the error thrown within this flow.

@example
aeroflow('test').dump().run();
// next test
// done true
(async function() {
  var result = await aeroflow('test').dump().run();
  console.log(result);
})();
// test
aeroflow('test').run(
  (result, data) => console.log('next', result, data),
  (result, data) => console.log('done', result, data),
  'data');
// next test data
// done true data
aeroflow(data => console.log('source:', data))
  .map((result, index, data) => console.log('map:', data))
  .filter((result, index, data) => console.log('filter:', data))
  .run('data');
// source: data
// map: data
// filter: data
// done true
aeroflow(Promise.reject('test')).run();
// Uncaught (in promise) Error: test(…)
*/
function run(next, done, data) {
  if (!isFunction(next)) {
    data = next;
    done = next = noop;
  }
  else if (!isFunction(done)) {
    data = done;
    done = noop;
  }
  return new Promise((resolve, reject) => {
    let last;
    this.emitter(
      result => {
        last = result;
        return next(result, data) !== false;
      },
      result => {
        done(result, data);
        isError(result)
          ? reject(result)
          : resolve(last);
      },
      objectDefineProperties({}, {
        data: { value: data },
        sources: { value: this.sources }
      }));
  });
}

Flow[PROTOTYPE] = objectCreate(operators, {
  [CLASS]: { value: AEROFLOW },
  bind: { value: bind },
  chain: { value: chain },
  concat: { value: concat },
  run: { value: run }
});
