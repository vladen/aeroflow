import { unsync } from '../unsync';

export function valueAdapter(value) {
  return (next, done) => {
    if (!unsync(next(value), done, done)) done(true);
  };
}
