import { DONE, NEXT } from '../symbols';
import { isFunction, toFunction } from '../utilites';
import registry from '../registry';
import resync from '../resync';
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
        const { [DONE]: redone, [NEXT]: renext } = resync(next, done), end = toFunction(instance(
          result => {
            if (false !== renext(result)) return;
            redone(false);
            end();
          },
          result => {
            redone(false);
            end();
          }));
      }
    : emptyGenerator(true);
}

export default listeners;
