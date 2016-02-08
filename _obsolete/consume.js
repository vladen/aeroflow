'use strict';

import { BOOLEAN, NULL, NUMBER, SYMBOL, UNDEFINED } from './symbols';
import { classOf, noop, objectDefineProperties } from './utilites';
import { customConsumer } from './consumers/custom';
import { eventEmitterConsumer } from './consumers/eventEmitter';
import { eventTargetConsumer } from './consumers/eventTarget';
import { observerConsumer } from './consumers/observer';

export const consumers = [
  customConsumer,
  eventEmitterConsumer,
  eventTargetConsumer,
  observerConsumer
];

export function consume(flow, parameters) {
  let consumer;
  switch (classOf(parameters[0])) {
    case BOOLEAN:
    case NULL:
    case NUMBER:
    case SYMBOL:
    case UNDEFINED:
      break;
    default:
      for (var i = -1, l = consumers.length; !consumer && ++i < l;)
        consumer = consumers[i](parameters);
      break;
  }
  if (!consumer) consumer = customConsumer([noop]);
  const context = objectDefineProperties({}, {
    data: { value: parameters[0] },
    sources: { value: flow.sources }
  });
  setImmediate(() => flow.emitter(
    result => false !== consumer.next(result, context.data),
    result => consumer.done(result, context.data),
    context));
}
