import { DONE, NEXT } from '../symbols';
import { isFunction, isObject } from '../utilites';

export default function eventEmitterNotifier(target, nextEventType = 'next', doneEventType = 'done') {
  if (!isObject(target) || !isFunction(target.emit)) return;
  const emit = eventName => result => target.emit(eventName, result);
  return {
    [DONE]: emit(doneEventType),
    [NEXT]: emit(nextEventType)
  };
}
