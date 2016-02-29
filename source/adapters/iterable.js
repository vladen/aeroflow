import { ITERATOR } from '../symbols';
import { isObject } from '../utilites';
import { unsync } from '../unsync';

export function iterableAdapter(source) {
  if (isObject(source) && ITERATOR in source) return (next, done, context) => {
    let iterator = source[ITERATOR]();
    !function proceed() {
      let iteration;
      while (!(iteration = iterator.next()).done)
        if (unsync(next(iteration.value), proceed, done))
          return;
      done(true);
    }();
  };
}
