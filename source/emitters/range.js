'use strict';

import { isNumber, maxInteger, toNumber } from '../utilites';
import { valueEmitter } from './value';

export function rangeEmitter(start, end, step) {
  end = toNumber(end, maxInteger);
  start = toNumber(start, 0);
  if (start === end) return valueEmitter(start);
  if (start < end) {
    step = toNumber(step, 1);
    if (step < 1) return valueEmitter(start);
    return (next, done, context) => {
      let value = start;
      while (next(value) && (value += step) <= end);
      done();
    };
  }
  step = toNumber(step, -1);
  if (step > -1) return valueEmitter(start);
  return (next, done, context) => {
    let value = start;
    while (next(value) && (value += step) >= end);
    done();
  };
}
