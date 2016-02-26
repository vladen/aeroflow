'use strict';

import { isError, isFunction, isObject } from '../utilites';

export function observerNotifier(target) {
  if (!isObject(target) || !isFunction(target.onNext) || !isFunction(target.onError) || !isFunction(target.onCompleted)) return;
  return {
    done: result => (isError(result) ? target.onError : target.onCompleted)(result),
    next: result => target.onNext(result)
  };
}
