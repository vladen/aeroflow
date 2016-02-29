import { registry } from '../registry';
import { eventEmitterNotifier } from './eventEmitter';
import { eventTargetNotifier } from './eventTarget';
import { observerNotifier } from './observer';

export const notifiers = registry()
  .use(observerNotifier)
  .use(eventTargetNotifier)
  .use(eventEmitterNotifier);
