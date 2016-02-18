'use strict';

import { identity, maxInteger, toNumber } from '../utilites';
import { adapt } from '../adapt';

export function flattenOperator(depth) {
  depth = toNumber(depth, maxInteger);
  if (depth < 1) return identity;
  return emitter => (next, done, context) => {
    let level = 0;
    const flatten = result => {
      if (level === depth) return next(result);
      const adapter = adapt(result, true);
      if (adapter) {
        level++;
        return new Promise(resolve => adapter(
          flatten,
          adapterResult => {
            level--;
            resolve(adapterResult);
          },
          context));
      }
      else return next(result);
    };
    emitter(flatten, done, context);
  };
}
