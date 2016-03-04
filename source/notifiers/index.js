import { DONE, NEXT } from '../symbols';
import { isFunction, isObject } from '../utilites';
import registry from '../registry';
import consoleNotifier from './console';
import eventEmitterNotifier from './eventEmitter';
import eventTargetNotifier from './eventTarget';

const notifiers = registry()
  .use(consoleNotifier)
  .use(eventTargetNotifier)
  .use(eventEmitterNotifier);

export function notifier(target, parameters) {
  return emitter => (next, done, context) => {
    const instance = notifiers.get(target, ...parameters);
    if (isObject(instance)) {
      const { [DONE]: notifyDone, [NEXT]: notifyNext } = instance;
      if (isFunction(notifyNext)) return emitter(
        result => {
          notifyNext(result);
          return next(result);
        },
        result => {
          if (isFunction(notifyDone)) notifyDone(result);
          return done(result);
        },
        context);
    }
    emitter(next, done, context);
  }
}

export default notifiers;
