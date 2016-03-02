import reduceOperator from './reduce';

export default function maxOperator () {
  return reduceOperator((maximum, result) => maximum < result ? result : maximum);
}
