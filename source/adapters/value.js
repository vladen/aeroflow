import { unsync } from '../unsync';

export function valueAdapter(source) {
  return (next, done) => {
    if (!unsync(next(source), done, done)) done(true);
  };
}
