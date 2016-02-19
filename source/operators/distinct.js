export function distinctOperator(untilChanged) {
  return emitter => untilChanged
    ? (next, done, context) => {
        let idle = true, last;
        emitter(
          result => {
            if (!idle && last === result) return true;
            idle = false;
            last = result;
            return next(result);
          },
          done,
          context);
      }
    : (next, done, context) => {
        let set = new Set;
        emitter(
          result => {
            if (set.has(result)) return true;
            set.add(result);
            return next(result);
          },
          done,
          context);
      };
} 
