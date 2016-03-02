import reduceOperator from './reduce';

export default function averageOperator(forced) {
  return reduceOperator((average, result, index) => (average * index + result) / (index + 1), 0);
}
