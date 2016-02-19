import { toFunction } from '../utilites';
import { reduceOperator } from './reduce';

export function toStringOperator(separator) {
  separator = toFunction(separator, separator || ',');
  return reduceOperator((string, result, index, data) =>
    string.length
      ? string + separator(result, index, data) + result
      : '' + result,
    '',
    true);
}
