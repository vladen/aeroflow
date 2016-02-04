'use strict';

import { isError, maxInteger, toNumber } from '../utilites';
import { arrayEmitter } from '../emitters/array';
import { toArrayOperator } from './toArray';

function sliceFromStartOperator(begin, end) {
  return emitter => (next, done, context) => {
    let index = -1;
    emitter(
      value => ++index < begin || (index <= end && next(value)),
      done,
      context);
  };
}

function sliceFromEndOperator(begin, end) {
  return emitter => (next, done, context) => {
    let array;
    toArrayOperator()(emitter)(
      result => {
        array = result;
        return false;
      },
      result => {
        if (isError(result)) done(result);
        else arrayEmitter(array.slice(begin, end))(next, done, context);
      },
      context);
  }
}

export function sliceOperator(begin, end) {
  begin = toNumber(begin, 0);
  end = toNumber(end, maxInteger);
  return begin < 0 || end < 0
    ? sliceFromEndOperator(begin, end)
    : sliceFromStartOperator(begin, end);
}
