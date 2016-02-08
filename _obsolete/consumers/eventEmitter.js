'use strict';

import { isFunction } from '../utilites';

export function eventEmitterConsumer(parameters) {
  const eventEmitter = parameters[0];
  if (!isFunction(eventEmitter.emit)) return;
  parameters.shift();
  return {
    next: fire('next'),
    done: fire('done')
  };
  function fire(event) {
    return result => {
      eventEmitter.emit(event, result);
      return true;
    }
  }
}
