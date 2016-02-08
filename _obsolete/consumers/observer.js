'use strict';

import { isFunction } from '../utilites';

export function observerConsumer(parameters) {
  const observer = parameters[0];
  if (!isFunction(observer.onNext) || !isFunction(observer.onError) || !isFunction(observer.onCompleted))
    return;
  parameters.shift();
  return {
    done: result => {
      (isError(result) ? observer.onError : observer.onCompleted)(result);
      return true;
    },
    next: result => {
      observer.onNext(result);
      return true;
    }
  };
}
