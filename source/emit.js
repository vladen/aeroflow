import adapters, { valueAdapter } from './adapters/index';

export default function emit(...sources) {
  return (next, done, context) => {
    let index = -1;
    !function proceed(result) {
      if (result !== true || ++index >= sources.length) done(result);
      else try {
        const source = sources[index];
        (adapters.get(source) || valueAdapter(source))(next, proceed, context);
      }
      catch (error) {
        done(error);
      }
    }(true);
  }
}
