import { isError, mathMax, mathMin, maxInteger, tie, toNumber } from '../utilites';
import unsync from '../unsync';

export default function sliceOperator(begin, end) {
  begin = toNumber(begin, 0);
  end = toNumber(end, maxInteger);
  return begin < 0 || end < 0
    ? emitter => (next, done, context) => {
        const buffer = [];
        emitter(
          result => {
            buffer.push(result);
            return true;
          },
          result => {
            if (isError(result)) done(result);
            else {
              let index = mathMax(0, begin > 0 ? begin : buffer.length + begin),
                  limit = mathMax(end > 0 ? mathMin(buffer.length, end) : buffer.length + end);
              done = tie(done, result);
              !function proceed() {
                while (index < limit) if (unsync(next(buffer[index++]), proceed, done)) return;
                done();
              }();
            }
          },
          context);
      }
    : emitter => (next, done, context) => {
        let index = -1;
        emitter(
          value => ++index < begin || (index < end && next(value)),
          done,
          context);
      };
}
