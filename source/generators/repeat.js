import { isDefined, toDelay, toFunction } from '../utilites';
import unsync from '../unsync';

export function repeatDeferredGenerator(repeater, delayer) {
  return (next, done, context) => {
    let index = 0;
    !function proceed(result) {
      setTimeout(() => {
        if (!unsync(next(repeater(index++)), proceed, done)) proceed();
      }, toDelay(delayer(index), 1000));
    }();
  };
}

export function repeatImmediateGenerator(repeater) {
  return (next, done, context) => {
    let index = 0;
    !function proceed() {
      while (!unsync(next(repeater(index++)), proceed, done));
    }();
  };
}

export default function repeatGenerator(repeater, delayer) {
  repeater = toFunction(repeater);
  return isDefined(delayer)
    ? repeatDeferredGenerator(repeater, toFunction(delayer))
    : repeatImmediateGenerator(repeater);
}
