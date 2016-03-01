// FIX: ambiguity with context
function shareOperator() {
  return emitter => {
    const consumers = [];
    let started = false;
    return (next, done, context) => {
      consumers.push({ next, done });
      if (started) return;
      started = true;
      emitter(
        result => {
          // TODO: need of special buffering mechanism per consumer, like customGenerator
        },
        result => {

          started = false;
        },
        context);
    };
  };
}