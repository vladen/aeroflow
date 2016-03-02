import { toFunction } from '../utilites';
import unsync from '../unsync';

export default function expandGenerator(expander, seed) {
  expander = toFunction(expander);
  return (next, done, context) => {
    let index = 0, value = seed;
    !function proceed() {
      while (!unsync(next(value = expander(value, index++)), proceed, done));
    }();
  };
}
