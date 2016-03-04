import { NEXT, DONE } from './symbols';
import { nothing, tie } from './utilites';
import unsync from './unsync';

export default function impede(next, done) {
  let busy = false, idle = false, queue = [], signal;
  function convey() {
    busy = false;
    while (queue.length) {
      signal = unsync(queue.pop()(), convey, finish);
      switch (signal) {
        case false:
          signal = true;
          continue;
        case true:
          return signal = false;
        default:
          return;
      }
    }
    if (idle) queue = nothing;
  }
  function finish(result) {
    idle = true;
    signal = false;
    queue = nothing;
    done(result);
  }
  return {
    [DONE]: result => {
      if (idle) return false;
      idle = true;
      queue.push(tie(done, result));
      if (!busy) convey();
    },
    [NEXT]: result => {
      if (idle) return false;
      queue.push(tie(next, result));
      if (!busy) convey();
      return signal;
    }
  }
}
