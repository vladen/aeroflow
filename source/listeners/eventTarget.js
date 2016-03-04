import { isFunction, isObject } from '../utilites';

export default function eventTargetListener(target, eventName = 'next', useCapture = false) {
  if (isObject(target) && isFunction(target.addEventListener) && isFunction(target.removeEventListener)) return next => {
    target.addEventListener(eventName, next, useCapture);
    return () => target.removeEventListener(eventName, next, useCapture);
  };
}
