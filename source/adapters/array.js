import unsync from '../unsync';

export default function arrayAdapter(source) {
  return (next, done, context) => {
    let index = -1;
    !function proceed() {
      while (++index < source.length) if (unsync(next(source[index]), proceed, done)) return;
      done(true);
    }();
  };
}
