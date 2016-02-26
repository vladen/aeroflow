'use strict';

import { isFunction, isObject } from '../utilites';

export function eventEmitterNotifier(target, nextEventName = 'next', doneEventName = 'done') {
  if (!isObject(target) || !isFunction(target.emit)) return;
  const emit = eventName => result => target.emit(eventName, result);
  return {
    done: emit(doneEventName),
    next: emit(nextEventName)
  };
}
