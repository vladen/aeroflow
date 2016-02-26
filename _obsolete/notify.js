import { classOf, identity, primitives } from './utilites';
import { notifiers } from './notifiers/index';

export function notify(target, parameters) {
  const targetClass = classOf(target);
  let notifier;
  if (!primitives.has(targetClass))
    for (let i = -1, l = notifiers.length; !notifier && ++i < l;) {
      notifier = notifiers[i](target, targetClass, parameters));
      if (isFunction(notifier.done) && isFunction(notifier.next)) break;
      else notifier = null;
    }
  return notifier
    ? emitter => (next, done, context) => emitter(notifier.next, notifier.done, context)
    : identity;
}
