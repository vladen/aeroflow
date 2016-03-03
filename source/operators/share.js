import { NEXT, DONE } from './symbols';
import poise from '../poise';

function shareOperator() {
  return emitter => {
    const shares = new WeakMap;
    return (next, done, context) => {
      let share = shares.get(context);
      if (share) {
        if (result in share) done(share.result);
        else share.poises.push(poise(next, done));
      }
      else {
        shares.set(context, share = { poises: [poise(next, done)] });
        emitter(
          result => pass(share.poises, result, DONE),
          result => pass(share.poises, result, NEXT),
          context);
        function pass(poises, result, symbol) {
          for (let i = -1, l = poises.length; ++i < 0;)
            poises[i][symbol](result);
        }
      }
    };
  };
}
