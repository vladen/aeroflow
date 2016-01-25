'use strict';

import { AEROFLOW } from './symbols';
import { classOf } from './utilites';
import { emptyEmitter } from './emitters/empty';
import { iterableEmitter } from './emitters/iterable';
import { valueEmitter } from './emitters/value';
import { adapters } from './adapters';

export function emit(sources) {
  switch (sources.length) {
    case 0: return emptyEmitter();
    case 1:
      const source = sources[0], sourceClass = classOf(source);
      if (sourceClass === AEROFLOW) return source.emitter;
      const emitter = adapters[sourceClass];
      if (isFunction(emitter)) return emitter(source);
      if (source && ITERATOR in source) return iterableEmitter(source);
      return valueEmitter(source);
    default:
      return (next, done, context) => {
        let index = -1;
        const limit = sources.length, proceed = () => context.active && ++index < limit
          ? emit(sources[index])(next, proceed, context)
          : done();
        proceed();
      };
  }
}
