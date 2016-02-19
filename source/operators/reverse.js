import { unsync } from '../unsync';
import { toArrayOperator } from './toArray';

export function reverseOperator() {
  return emitter => (next, done, context) => toArrayOperator()(emitter)(
    result => new Promise(resolve => {
      let index = result.length;
      !function proceed() {
        while (--index >= 0 && !unsync(next(result[index]), proceed, resolve));
        resolve(true);
      }();
    }),
    done,
    context);
}
