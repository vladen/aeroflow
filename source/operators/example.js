'use strict';

// example extension
aeroflow.operators.test = function() {
  return this.chain(emitter => (next, done, context) => emitter(
    value => next('test:' + value),
    done,
    context));
}