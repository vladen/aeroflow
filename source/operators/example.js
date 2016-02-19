import aeroflow from '../aeroflow';

// example extension
aeroflow.operators.test = function() {
  return this.chain(emitter => (next, done, context) => emitter(
    value => next('test:' + value),
    done,
    context));
}