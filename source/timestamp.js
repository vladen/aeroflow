'use strict';

import { Aeroflow } from './aeroflow';
import { EMITTER } from './symbols';
import { dateNow } from './utilites';

const timestampEmitter = emitter => (next, done, context) => {
  let past = dateNow();
  emitter(
    value => {
      let current = dateNow();
      next({
        timedelta: current - past,
        timestamp: dateNow,
        value
      });
      past = current;
    },
    done,
    context);
};

/*
  aeroflow.repeat().take(3).delay(10).timestamp().dump().run();
*/
function timestamp() {
  return new Aeroflow(timestampEmitter(this[EMITTER]));
}

export { timestamp, timestampEmitter };
