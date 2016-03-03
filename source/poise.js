import { NEXT, DONE } from './symbols';
import { nothing, tie } from './utilites';

export default function poise(next, done) {
  let busy = false, idle = false, queue = [];
  function pass() {
    busy = false;
    while (queue.length) if (unsync(queue.pop()(), pass, stop)) {
      busy = true;
      return;
    }
    if (idle) queue = nothing;
  }
  function stop(result) {
    idle = true;
    queue = nothing;
    done(result);
  }
  return {
    [DONE](result) {
      if (idle) return false;
      idle = true;
      queue.push(tie(done, result));
      if (!busy) pass();
    },
    [NEXT](result) {
      if (idle) return false;
      queue.push(tie(next, result));
      if (!busy) pass();
    }
  }
}
