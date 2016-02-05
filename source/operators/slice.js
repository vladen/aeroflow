'use strict';

import { mathMin, maxInteger, toNumber } from '../utilites';
import { unsync } from '../unsync';
import { toArrayOperator } from './toArray';

export function sliceOperator(begin, end) {
  begin = toNumber(begin, 0);
  end = toNumber(end, maxInteger);
  return begin < 0 || end < 0
    ? emitter => (next, done, context) =>
        toArrayOperator()(emitter)(result => {
          let length = result.length,
              index = begin < 0 ? length + begin : begin,
              limit = end < 0 ? length + end : mathMin(length, end);
          if (index < 0) index = 0;
          if (limit < 0) limit = 0;
          return index >= limit || new Promise(resolve => {
            !function proceed() {
              while (!unsync(next(result[index++]), proceed, resolve) && index < limit);
              resolve(true);
            }();
          });
        },
        done,
        context)
    : emitter => (next, done, context) => {
        let index = -1;
        emitter(
          value => ++index < begin || (index < end && next(value)),
          done,
          context);
      };
}
