import { FUNCTION, NUMBER } from '../symbols';
import { classOf, falsey, identity, isBoolean, isError, isPromise, tie } from '../utilites';
import { arrayAdapter } from '../adapters/array';
import { emptyGenerator } from '../generators/empty';

export function takeFirstOperator(count) {
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      result => {
        if (++index < count) return next(result);
        result = next(result);
        if (isBoolean(result)) return false;
        if (isPromise(result)) return result.then(falsey);
        return result;
      },
      done,
      context);
  };
}

export function takeLastOperator(count) {
  return emitter => (next, done, context) => {
    let buffer = [];
    emitter(
      result => {
        if (buffer.length >= count) buffer.shift();
        buffer.push(result);
        return true;
      },
      result => {
        if (isError(result)) done(result);
        else arrayAdapter(buffer)(next, done, context);
      },
      context)
  };
}

export function takeWhileOperator(predicate) {
  return emitter => (next, done, context) => {
    let index = 0;
    emitter(
      value => predicate(value, index++, context.data) && next(value),
      done,
      context);
  };
}

export function takeOperator(condition) {
  switch (classOf(condition)) {
    case NUMBER:
      return condition > 0
        ? takeFirstOperator(condition)
        : condition < 0
          ? takeLastOperator(-condition)
          : tie(emptyGenerator, false)
    case FUNCTION:
      return takeWhileOperator(condition);
    default:
      return condition
        ? identity
        : tie(emptyGenerator, false);
  }
}
