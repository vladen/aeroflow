import { toDelay, toFunction } from '../utilites';
import unsync from '../unsync';

export default function delayOperator(interval) {
  const delayer = toFunction(interval);
  return emitter => (next, done, context) => {
    let index = 0;
    return emitter(
      result => new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            if (!unsync(next(result), resolve, reject)) resolve(true);
          }
          catch (error) {
            reject(error);
          }
        }, toDelay(delayer(result, index++), 0));
      }),
      done,
      context);
  }
}
