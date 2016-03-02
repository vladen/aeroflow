import { toFunction } from '../utilites';
import reduceOperator from './reduce';

export default function toStringOperator(separator) {
  separator = toFunction(separator, separator || ',');
  return reduceOperator((string, result, index) =>
    string.length
      ? string + separator(result, index) + result
      : '' + result,
    '',
    true);
}
