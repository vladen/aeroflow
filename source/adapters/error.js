export function errorAdapter(error) {
  return (next, done) => {
    done(error);
  };
}
