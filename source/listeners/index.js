import { DONE, NEXT } from '../symbols';
import { isFunction, toFunction } from '../utilites';
import retard from '../retard';
import registry from '../registry';
import emptyGenerator from '../generators/empty';
import eventEmitterListener from './eventEmitter';
import eventTargetListener from './eventTarget';

const listeners = registry()
  .use(eventEmitterListener)
  .use(eventTargetListener);

export function listener(source, parameters) {
  const instance = listeners.get(source, ...parameters);
  return isFunction(instance)
    ? (next, done, context) => {
        const { [DONE]: retardedDone, [NEXT]: retardedNext } = retard(next, done),
              finalizer = toFunction(instance(onNext, onDone));
        function onDone(result) {
          setImmediate(finalizer);
          retardedDone(false);
        }
        function onNext(result) {
          if (false === retardedNext(result)) onDone(false);
        }
      }
    : emptyGenerator(true);
}

export default listeners;
