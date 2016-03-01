import { AEROFLOW, ARRAY, ERROR, FUNCTION, PROMISE } from '../symbols';
import { objectDefineProperty } from '../utilites';
import { registry } from '../registry';
import { arrayAdapter } from './array';
import { errorAdapter } from './error';
import { flowAdapter } from './flow';
import { functionAdapter } from './function';
import { iterableAdapter } from './iterable';
import { promiseAdapter } from './promise';
import { valueAdapter } from './value';

export const adapters = registry()
  .use(iterableAdapter)
  .use(AEROFLOW, flowAdapter)
  .use(ARRAY, arrayAdapter)
  .use(ERROR, errorAdapter)
  .use(FUNCTION, functionAdapter)
  .use(PROMISE, promiseAdapter);

objectDefineProperty(adapters, 'def', { value: valueAdapter });
