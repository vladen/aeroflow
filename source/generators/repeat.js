import { isDefined, toDelay, toFunction } from '../utilites';
import { unsync } from '../unsync';

export function repeatDeferredGenerator(repeater, delayer) {
  return (next, done, context) => {
    let index = -1;
    !function proceed(result) {
      setTimeout(() => {
        if (!unsync(next(repeater(index, context.data)), proceed, done)) proceed();
      }, toDelay(delayer(++index, context.data), 1000));
    }();
  };
}

export function repeatImmediateGenerator(repeater) {
  return (next, done, context) => {
    let index = 0;
    !function proceed() {
      while (!unsync(next(repeater(index++, context.data)), proceed, done));
    }();
  };
}

export function repeatGenerator(value, interval) {
  const repeater = toFunction(value);
  return isDefined(interval)
    ? repeatDeferredGenerator(repeater, toFunction(interval))
    : repeatImmediateGenerator(repeater);
}
