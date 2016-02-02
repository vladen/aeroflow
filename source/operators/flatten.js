'use strict';

import { constant, identity, isNumber, isUndefined, maxInteger } from '../utilites';
import { emitterSelector } from '../emitters/selector';

/*
export function flattenOperator(depth) {
  if (isUndefined(depth)) depth = maxInteger;
  else {
    if (!isNumber(depth)) depth = +depth;
    if (isNaN(depth) || depth < 2) return identity;
  }
  return emitter => (next, done, context) => {
    let level = 0;
    const diver = value => ++level < depth ? flatten(value) : next(value);
    const flatten = value => {
      if (level === depth) return next(value);
      level++;
      const flattener = emitterSelector(value, false);
      if (isUndefined(flattener)) return next(value);
      else flattener(diver, continue!, context);
      level--;
    };
    emitter(flatten, done, context);
  };
}
*/