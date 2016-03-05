import { NEXT, DONE } from './symbols';
import { tie } from './utilites';
import unsync from './unsync';

export default function resync(next, done) {
  let busy = false, idle = false, queue = [], signal = true;
  function resend() {
    busy = false;
    while (queue.length) {
      const state = unsync(queue.pop()(), resend, redone);
      switch (state) {
        case false:
          signal = true;
          continue;
        case true:
          signal = false;
          return;
        default:
          busy = true;
          signal = state;
          return;
      }
    }
  }
  function redone(result) {
    if (idle) return false;
    idle = true;
    queue.push(tie(done, result));
    if (!busy) resend();
  }
  function renext(result) {
    if (idle) return false;
    queue.push(tie(next, result));
    if (!busy) resend();
    return signal;
  }
  return {
    [DONE]: redone,
    [NEXT]: renext
  }
}
