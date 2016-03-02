import { isFunction, isUndefined } from '../utilites';
import valueAdapter from '../adapters/value';
import emptyGenerator from './empty';
import unsync from '../unsync';

export default function customGenerator(generator) {
  if (isUndefined(generator)) return emptyGenerator(true);
  if (!isFunction(generator)) return valueAdapter(generator);
  return (next, done, context) => {
    let buffer = [], conveying = false, finalizer, finished = false;
    finalizer = generator(
      result => {
        if (finished) return false;
        buffer.push(result);
        if (!conveying) convey(true);
        return true;
      },
      result => {
        if (finished) return false;
        finished = true;
        buffer.result = isUndefined(result) || result;
        if (!conveying) convey(true);
        return true;
      });
    function convey(result) {
      conveying = false;
      if (result) while (buffer.length)
        if (unsync(next(buffer.shift()), convey, finish)) {
          conveying = true;
          return;
        }
      if (finished) finish(result);
    }
    function finish(result) {
      finished = true;
      if (isFunction(finalizer)) setImmediate(finalizer);
      done(result && buffer.result);
    }
  };
}
