import { NEXT, DONE } from '../symbols';
import retard from '../retard';

export default function shareOperator() {
  return emitter => {
    const shares = new WeakMap;
    return (next, done, context) => {
      let share = shares.get(context);
      if (share)
        if (share.result) done(share.result);
        else share.retarded.push(retard(next, done));
      else {
        shares.set(context, share = { retarded: [retard(next, done)] });
        emitter(
          result => {
            const retarded = share.retarded;
            for (let i = -1, l = retarded.length; ++i < l;)
              retarded[i][NEXT](result);
          },
          result => {
            share.result = result;
            const retarded = share.retarded;
            for (let i = -1, l = retarded.length; ++i < l;)
              retarded[i][DONE](result);
          },
          context);
      }
    };
  };
}
