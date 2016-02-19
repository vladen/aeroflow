import { isError, identity, toNumber } from '../utilites';

export function retryOperator(attempts) {
  attempts = toNumber(attempts, 1);
  if (!attempts) return identity;
  return emitter => (next, done, context) => {
    let attempt = 0;
    proceed();
    function proceed() {
      emitter(next, retry, context);
    }
    function retry(result) {
      if (++attempt <= attempts && isError(result)) proceed();
      else done(result);
    }
  }
} 
