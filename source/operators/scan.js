import { toFunction } from '../utilites';

export default function scanOperator(scanner) {
  scanner = toFunction(scanner);
  return emitter => (next, done, context) => {
    let accumulator, index = -1;
    emitter(
      result => ++index
        ? next(accumulator = scanner(accumulator, result, index))
        : next(accumulator = result),
      done,
      context);
  };
}
