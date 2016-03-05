import { NEXT, DONE } from '../symbols';
import { isFunction, isUndefined, toFunction } from '../utilites';
import resync from '../resync';
import valueAdapter from '../adapters/value';
import emptyGenerator from './empty';

export default function customGenerator(generator) {
  if (isUndefined(generator)) return emptyGenerator(true);
  if (!isFunction(generator)) return valueAdapter(generator);
  return (next, done, context) => {
    const { [DONE]: redone, [NEXT]: renext } = resync(next, done, context), end = toFunction(generator(
      renext,
      result => {
        redone(isUndefined(result) ? true : result);
        end();
      }));
  };
}
