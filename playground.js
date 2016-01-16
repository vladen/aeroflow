function isFunction(value) {
  return typeof value === 'function';
}

function emit() {
  'use strict';
  let done = false, index = -1;
  return {
    done: () => {
      done = true;
    },
    next: () => done
      ? { done: true }
      : {
          value: (++index % 2 === 0)
            ? new Promise(resolve => setTimeout(() => resolve(index), 1000))
            : index
        }
  }
}

function* generate() {
  'use strict';
  let index = -1;
  while (true) yield (++index % 2 === 0)
    ? new Promise(resolve => setTimeout(() => resolve(index), 1000))
    : index;
}

function iterate(iterable, next, done) {
  'use strict';
  let iterator;
  if (isFunction(iterable.next)) iterator = iterable;
  else if (Symbol.iterator in iterable) iterator = iterable[Symbol.iterator]();
  else throw new TypeError('An iterable object was expected.');
  let complete = () => {
        if (isFunction(iterator.done)) iterator.done();
        return done();
      }
    , onReject = error => {
        if (isFunction(iterator.done)) iterator.done();
        return done(error);
      }
    , onResolve = value => {
        if (false === next(value)) complete();
        else proceed();
      }
    , proceed = () => {
        while (true) {
          let result = iterator.next();
          if (result.done) return complete();
          let value = result.value;
          if (value instanceof Promise) return value.then(onResolve, onReject);
          else if (false === next(value)) return complete();
        }
      };
  proceed();
}

iterate(
  emit()
, value => { console.log(value); return value < 9; }
, () => console.log('done'));

iterate(
  generate()
, value => { console.log(value); return value < 9; }
, () => console.log('done'));



function iteration() {
    let isDone = false;
    function next() {
      console.log(this[PROMISES]);
      if (isDone) return { done: isDone };
      let messages = this[MESSAGES]
        , promises = this[PROMISES]
        , promise = undefined;
      if (messages.length) {
        let message = messages.shift();
        promise = Promise.resolve(message);
      } else {
        promise = new Promise();
        this[PROMISES].push( promise );
      }
      return {
        value: promise,
        done: isDone
      }
    };
    function done() {
      this[PROMISES].forEach(promise => promise.reject());
      this[PROMISES] = [];
      this[messages] = [];
      isDone = true;
    };
    return {
      next: next.bind(this),
      done: done.bind(this)
    }
  }

[Symbol.iterator] () {
  let done = false, messages = [], rejects = [], resolves = [], subscription = message => {
    if (resolves.length) resolves.shift()(message);
    else messages.push(message);
  };
  this.subscribe(subscription);
  return {
    done: () => {
      if (done) return;
      done = true;
      this.unsubscribe(subscription);
      rejects.forEach(reject => reject());
      rejects.length = 0;
    }
  , next: () => done
      ? { done: true }
      : { value: messages.length
          ? Promise.resolve(messages.shift())
          : new Promise((resolve, reject) => {
            rejects.push(reject);
            resolves.push(resolve);
          })
        }
  }
}