import { reduceOperator } from './reduce';

export function minOperator() {
  return reduceOperator((minimum, result) => minimum > result ? result : minimum);
}
