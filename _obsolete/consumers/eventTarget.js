'use strict';

import { isFunction } from '../utilites';

export function eventTargetConsumer(parameters) {
  const eventTarget = parameters[0];
  if (!isFunction(eventTarget.dispatchEvent)) return;
  parameters.shift();
  return {
    next: fire('next'),
    done: fire('done')
  };
  function fire(event) {
    return result => {
      eventTarget.dispatchEvent(new CustomEvent(event, { detail: result }));
      return true;
    }
  }
}
