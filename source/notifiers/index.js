import registry from '../registry';
import { eventEmitterNotifier } from './eventEmitter';
import { eventTargetNotifier } from './eventTarget';
import { observerNotifier } from './observer';

const notifiers = registry()
  .use(observerNotifier)
  .use(eventTargetNotifier)
  .use(eventEmitterNotifier);

export {
  eventEmitterNotifier, eventTargetNotifier, observerNotifier
};

export default notifiers;
