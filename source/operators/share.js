import { NEXT, DONE } from '../symbols';
import resync from '../resync';

export default function shareOperator() {
  return emitter => {
    const shares = new WeakMap;
    return (next, done, context) => {
      let share = shares.get(context);
      if (share)
        if (share.result) done(share.result);
        else share.callbacks.push(resync(next, done));
      else {
        shares.set(context, share = { callbacks: [resync(next, done)] });
        emitter(
          result => {
            const callbacks = share.callbacks;
            for (let i = -1, l = callbacks.length; ++i < l;)
              callbacks[i][NEXT](result);
          },
          result => {
            share.result = result;
            const callbacks = share.callbacks;
            for (let i = -1, l = callbacks.length; ++i < l;)
              callbacks[i][DONE](result);
          },
          context);
      }
    };
  };
}
