export default function emptyGenerator(result) {
  return (next, done) => done(result);
}
