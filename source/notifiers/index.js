import { FUNCTION } from '../symbols';
import { classOf, identity, isFunction, isObject, objectDefineProperties } from '../utilites';
import { customNotifier } from './custom';
import { eventEmitterNotifier } from './eventEmitter';
import { eventTargetNotifier } from './eventTarget';
import { observerNotifier } from './observer';

export const notifiers = [
  eventEmitterNotifier,
  eventTargetNotifier,
  observerNotifier
];

objectDefineProperties(notifiers, {
  [FUNCTION]: { configurable: true, value: customNotifier, writable: true }
});

const isNotifier = notifier => isObject(notifier) && isFunction(notifier.done) && isFunction(notifier.next);

export function selectNotifier(target, parameters) {
  let notifier = notifiers[classOf(target)];
  if (notifier) notifier = notifier(target, ...parameters);
  if (!isNotifier(notifier)) for (let i = -1, l = notifiers.length; ++i < l;) {
    notifier = notifiers[i](target, ...parameters);
    if (isNotifier(notifier)) break;
    else notifier = null;
  }
  return notifier
    ? emitter =>
      (next, done, context) => {
        let index = 0;
        emitter(
          result => {
            notifier.next(result, index++, context.data);
            return next(result);
          },
          result => {
            notifier.done(result, context.data);
            return done(result);
          },
          context)
      }
    : identity;
}