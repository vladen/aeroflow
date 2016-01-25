'use strict';

import { dateNow } from '../utilites';

export function timestampOperator() {
  return emitter => (next, done, context) => {
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
}
