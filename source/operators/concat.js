import { identity } from '../utilites';
import { adapter } from '../adapters/index';

export default function concatOperator(sources) {
  return sources.length
    ? emitter => (next, done, context) => {
      emitter(
        next,
        result => {
          if (result === true) adapter(sources)(next, done, context);
        },
        context);
    }
    : identity;
}
