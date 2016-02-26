import { classOf, isFunction } from './utilites';
import { adapters } from './adapters/index';
import { valueAdapter } from './adapters/value';

export function adapt(source, lazy) {
  const sourceClass = classOf(source);
  let adapter = adapters[sourceClass];
  if (isFunction(adapter)) return adapter(source);
  for (let i = -1, l = adapters.length; ++i < l;) {
    adapter = adapters[i](source, sourceClass);
    if (isFunction(adapter)) return adapter;
  }
  if (!lazy) return valueAdapter(source);
}
