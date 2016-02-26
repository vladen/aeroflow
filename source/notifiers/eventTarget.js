'use strict';

import { isFunction, isObject } from '../utilites';

export function eventTargetNotifier(target, nextEventName = 'next', doneEventName = 'done') {
  if (!isObject(target) || !isFunction(target.dispatchEvent)) return;
  const dispatch = eventName => detail => target.dispatchEvent(new CustomEvent(eventName, { detail }));
  return {
    done: dispatch(doneEventName),
    next: dispatch(nextEventName)
  };
}
