'use strict';

import { constant, isError, tie, toFunction } from '../utilites';
import { iterableAdapter } from '../adapters/iterable';

export function groupOperator(selectors) {
  selectors = selectors.length
    ? selectors.map(toFunction)
    : [constant];
  const limit = selectors.length - 1;
  return emitter => (next, done, context) => {
    let groups = new Map, index = 0;
    emitter(
      value => {
        let ancestor = groups, descendant;
        for (let i = -1; ++i <= limit;) {
          let key = selectors[i](value, index++, context.data);
          descendant = ancestor.get(key);
          if (!descendant) {
            descendant = i === limit ? [] : new Map;
            ancestor.set(key, descendant);
          }
          ancestor = descendant;
        }
        descendant.push(value);
        return true;
      },
      result => {
        if (isError(result)) done(result);
        else iterableAdapter(groups)(next, tie(done, result), context);
      },
      context);
  };
}
