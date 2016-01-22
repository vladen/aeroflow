/*
    var i = 0;
    aeroflow.repeat(() => ++i).take(3).share(2000).delay(1000).dump().run(
      null
      , (error, context) => context.flow.run(
        null
        , (error, context) => context.flow.run()));
  * /
  share(expiration) {
    return arguments.length
      ? isFunction(expiration)
        ? shareExtended(this, expiration)
        : isNumber(expiration)
          ? expiration <= 0
            ? this
            : shareExtended(this, () => expiration)
          : expiration
            ? share(this)
            : this
      : share(this);
  }
  */
/*
function share(flow) {
  let cache = [], cached = false;
  return new Aeroflow((next, done, context) => {
    if (cached) {
      cache.forEach(next);
      done();
    } 
    else flow[SYMBOL_EMITTER](
      value => {
        cache.push(value);
        next(value);
      },
      error => {
        cached = true;
        done(error);
      },
      context);
  });
}
function shareExtended(flow, selector) {
  let cache = [], cached = false;
  return new Aeroflow((next, done, context) => {
    if (cached) {
      cache.forEach(next);
      done();
    }
    else flow[SYMBOL_EMITTER](
      value => {
        cache.push(value);
        next(value);
      },
      error => {
        setTimeout(() => {
          cache = [];
          cached = false
        }, selector(context.data));
        done(error);
      },
      context);
  });
}