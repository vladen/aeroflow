'use strict';

import { NUMBER } from '../symbols';
import { classOf } from '../utilites';
import { emptyEmitter } from '../emitters/empty';
import { toArrayOperator } from './toArray';

function sliceWithPositiveIndexes(start, end) {
	return emitter => (next, done, context) => {
    let curr = -1;
    emitter(
      value => ++curr < start ? true : (!end || curr <= end) && next(value),
      done,
      context);
  };
}

function sliceWithNegativeIndexes(start, end) {
	return emitter => (next, done, context) => {
    let array;
    toArrayOperator()(emitter)(
      result => {
        array = result;
        return false;
      },
      result => {        
        if (isError(result)) done(result);
        else arrayEmitter(array.slice(mathMax(values.length - count, 0)))(next, done, context);
      },
      context);
  }
}

export function sliceOperator(start, end) {
	if (classOf(start) !== NUMBER || (end && classOf(end) !== NUMBER)) return emptyEmitter;

  return start >= 0 && (!end || end >= 0) 
  	? sliceWithPositiveIndexes(start, end)
  	: sliceWithNegativeIndexes(start, end);
}