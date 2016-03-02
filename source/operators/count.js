import reduceOperator from './reduce';

export default function countOperator() {
  return reduceOperator(count => count + 1, 0, true);
}
