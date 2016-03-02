import reduceOperator from './reduce';

export default function sumOperator() {
  return reduceOperator((sum, result) => +result + sum, 0);
}
