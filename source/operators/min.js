import reduceOperator from './reduce';

export default function minOperator() {
  return reduceOperator((minimum, result) => minimum > result ? result : minimum);
}
