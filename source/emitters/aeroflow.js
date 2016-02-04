'use strict';

import { Context } from '../context';

export function aeroflowEmitter(source) {
  return (next, done, context) => source.emitter(next, done, new Context(context.data, source));
}
