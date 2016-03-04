import { DONE, NEXT } from '../symbols';
import { isError, isFunction, isObject } from '../utilites';

export default function observerNotifier(target) {
  if (!isObject(target) || !isFunction(target.onNext) || !isFunction(target.onError) || !isFunction(target.onCompleted)) return;
  return {
    [DONE]: result => (isError(result) ? target.onError : target.onCompleted)(result),
    [NEXT]: result => target.onNext(result)
  };
}
