import { isFunction, isObject } from '../utilites';

export default function eventEmitterListener(target, eventName = 'next') {
  if (isObject(target) && isFunction(target.addListener) && isFunction(target.removeListener)) return next => {
    target.addListener(eventName, next);
    return () => target.removeListener(eventName, next);
  };
}
