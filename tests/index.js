import instanceTests from './instance/index';
import staticTests from './static/index';

export default (aeroflow, expect, sinon) => {
  const error = new Error('test');
  function fail() {
    throw error;
  }
  function noop() {}
  function spy(result) {
    return sinon.spy(typeof result === 'function' ? result : () => result);
  }
  class Context {
    get done() {
      return this._done || (this._done = spy());
    }
    set done(result) {
      this._done = spy(result);
    }
    get next() {
      return this._next || (this._next = spy());
    }
    set next(result) {
      this._next = spy(result);
    }
  }
  Object.defineProperties(Context.prototype, {
    error: { value: error },
    fail: { value: fail },
    noop: { value: noop },
    spy: { value: spy }
  });
  function execute(arrange, act, assert) {
    if (arguments.length < 3) {
      assert = act;
      act = arrange;
      arrange = null;
    }
    const context = new Context;
    if (arrange) arrange(context);
    return Promise
      .resolve(act(context))
      .catch(Function())
      .then(result => {
        context.result = result;
        assert(context);
      });
  }
  [...staticTests, ...instanceTests].forEach(test => test(aeroflow, execute, expect, sinon));
}
