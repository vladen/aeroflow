'use strict';

import { isError, isFunction, noop } from '../utilites';

export function customConsumer(parameters) {
  const next = parameters[0];
  if (!isFunction(next)) return;
  parameters.shift();
  const done = isFunction(parameters[0])
    ? parameters.shift()
    : result => {
        if (isError(result)) throw result;
      };
  return { done, next };
}
