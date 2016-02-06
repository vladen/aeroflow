'use strict';

import { Context } from '../context';

export function flowAdapter(flow) {
  return (next, done, context) => flow.emitter(
    next,
    done,
    objectDefineProperties({}, {
      data: { value: context.data },
      sources: { value: flow.sources }
    }));
}
