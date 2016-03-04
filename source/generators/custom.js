import { isFunction, isUndefined } from '../utilites';
import valueAdapter from '../adapters/value';
import emptyGenerator from './empty';
import retard from '../retard';

export default function customGenerator(generator) {
  if (isUndefined(generator)) return emptyGenerator(true);
  if (!isFunction(generator)) return valueAdapter(generator);
  return (next, done, context) => {
    const finalizer = generator(retard(
      next,
      result => {
        if (isFunction(finalizer)) setImmediate(finalizer);
        done(result);
      },
      context));
  };
}
