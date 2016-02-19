import { reduceOperator } from './reduce';

export function countOperator() {
  return reduceOperator(count => count + 1, 0, true);
}
