import unsync from '../unsync';

export default function functionAdapter(source) {
  return (next, done, context) => {
    if (!unsync(next(source()), done, done)) done(true);
  };
}
