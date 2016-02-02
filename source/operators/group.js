'use strict';

import { constant, isFunction } from '../utilites';
import { iterableEmitter } from '../emitters/iterable';

export function groupOperator(selectors) {
  selectors = selectors.length
    ? selectors.map(selector => isFunction(selector)
      ? selector
      : constant(selector))
    : [constant()];
  const limit = selectors.length - 1;
  return emitter => (next, done, context) => {
    let groups = new Map, index = 0;
    emitter(
      value => {
        let current, parent = groups;
        for (let i = -1; ++i <= limit;) {
          let key = selectors[i](value, index++, context.data);
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
      result => {
        if (isError(result)) done(result);
        else iterableEmitter(groups)(next, done, context);
      },
      context);
  };
}
