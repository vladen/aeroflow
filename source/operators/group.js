'use strict';

import { constant, isFunction } from '../utilites';

export function groupOperator(selectors) {
  selectors = selectors.length
    ? selectors.map(selector => isFunction(selector)
      ? selector
      : constant(selector))
    : [constant()];
  const limit = selectors.length - 1;
  return emitter => (next, done, context) => {
    const groups = new Map;
    let index = 0;
    emitter(
      value => {
        let current, parent = groups;
        for (let i = -1; ++i <= limit;) {
          const key = selectors[i](value, index++, context.data);
          current = parent.get(key);
          if (!current) {
            current = i === limit ? [] : new Map;
            parent.set(key, current);
          }
          parent = current;
        }
        current.push(value);
        return true;
      },
      error => {
        if (error) done(error);
        else {
          Array.from(groups).every(next);
          done();
        }
      },
      context);
  };
}
