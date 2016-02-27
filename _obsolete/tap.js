import { isFunction } from '../utilites';

export function tapOperator(callback) {
  return emitter => isFunction(callback)
    ? (next, done, context) => {
      let index = 0;
      emitter(
        result => {
          callback(result, index++, context.data);
          return next(result);
        },
        done,
        context);
    }
    : emitter;
}
