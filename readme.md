# ~ Aeroflow ~

Truly lazily computed reactive data flows with rich set of pure functional operators and async support.

Inspired by [Reactive Extensions](http://reactivex.io/) but much more simplier, compact and completely ES6 based.

Aeroflow is extremely simple and blazingly fast. Internally it does nothing special but combines emitters and operators, keeps reference to this combination and invokes it when activated.

Emitter is just a function which emits values from a data source amd accepts following argument:
* next - function to emit next value from the source;
* done - function to signal that no more values can be emitter because source has been depleted or an error has happened (in this case the error object can be passed to done function and will be transfered to the consumer of current flow).

Aeroflow originally provides standard set of most usefull emitters, particularly for:
* arrays,
* functions,
* iterables,
* promises.

Conceptual array emitter might look like this:
```js

const arraySource = [1, 2, 3];
const arrayEmitter => (next, done) => {
  let index = -1;
  while (++index < arraySource.length)
    next(arraySource[index]);
  done();
};
```

Promise emitter just as simple:
```js
const promiseSource = Promise.resolve('test');
const promiseEmitter = (next, done) =>
  promiseSource.then(
    value => next(value),
    error => done(error));
```

Operator is a function similar to emitter. The only difference between emitter and operator is their position in the flow: 
* emitter always goes first, extracts value from corresponding data source and then emits this value,
* operator never goes first because it takes already emitted value, performs necessary logic and pass the value to the next operator in the chain.

Assuming that abstract emitter already exists, conceptual operator might look then like this:
```js
const mapper = value => String(value);
const mapOperator => (next, done) => {
  let index = 0;
  abstractEmitter(
    value => next(mapper(value, index++)),
    done);
};
```

Obviously all the example code wont produce any practial result except some declarations. Here's the essense of its laziness. To make the flow actually work very special operator (aka runner) is needed:
```js
mapOperator(
  value => console.log('next', value),
  error => error ? console.log('error', error) : console.log('done'));
```

But, where's the emitter-operators chain? Now runner just calls operator which calls emitter and there's no magic at all. This is jusy because the basic idea of lazy functional reactive data flow is extremely simple. And equally easy implement chaining. 

For elegant implicit chaining emitters and operators should be created by appropriate factories:
```js
const emitterFactory = arraySource => (next, done) => {
  let index = -1;
  while (++index < arraySource.length)
    next(arraySource[index]);
  done();
};
const operatorFactory = (emitter, mapper) => (next, done) => {
  let index = 0;
  abstractEmitter(
    value => next(mapper(value, index++)),
    done);
};
```
Now emitter and operator can be chained into single function and then activated via runner:
```js
const chain = operatorFactory(emitterFactory([1, 2, 3]), value => String(value));
chain(
  value => console.log('next', value),
  error => error ? console.log('error', error) : console.log('done'));
```
This looks a bit cumbersome, isn't?

That's why aeroflow is awesome! It wraps emitter-operators chain into handy object with rich set of fluent factory methods and provides very usable universal runner:
```
aeroflow([1, 2, 3]).map(value => String(value)).run(
  value => console.log('next', value),
  error => console.log('done'));
```
> continuation pending...
