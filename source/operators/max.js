import { reduceOperator } from './reduce';

export function maxOperator () {
  return reduceOperator((maximum, result) => maximum < result ? result : maximum);
}
