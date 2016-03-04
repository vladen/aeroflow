import { DONE, NEXT } from '../symbols';
import { isError, isFunction, isObject } from '../utilites';

export default function consoleNotifier(target, prefix = '') {
  if (!isObject(target)) return;
  const { log, error } = target;
  if (!isFunction(log)) return;
  return {
    [DONE]: result => (isError(result) && isFunction(error) ? error : log).call(target, prefix + 'done', result),
    [NEXT]: result => log.call(target, prefix + 'next', result)
  };
}
