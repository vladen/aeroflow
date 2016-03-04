import { DONE, NEXT } from '../symbols';
import { isFunction, isObject } from '../utilites';

export default function eventTargetNotifier(target, nextEventType = 'next', doneEventType = 'done') {
  if (!isObject(target) || !isFunction(target.dispatchEvent)) return;
  const dispatch = eventName => detail => target.dispatchEvent(new CustomEvent(eventName, { detail }));
  return {
    [DONE]: dispatch(doneEventType),
    [NEXT]: dispatch(nextEventType)
  };
}
