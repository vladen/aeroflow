import { isFunction, isObject } from '../utilites';
import notifiers from '../notifiers/index';

export default function notifyOperator(target, parameters) {
  return emitter => (next, done, context) => {
    const notifier = notifiers.get(target, ...parameters);
    if (isObject(notifier) && isFunction(notifier.next)) {
      let index = 0;
      emitter(
        result => {
          notifier.next(result, index++);
          return next(result);
        },
        result => {
          if (isFunction(notifier.done)) notifier.done(result);
          return done(result);
        },
        context);
    }
    else emitter(next, done, context);
  }
}
