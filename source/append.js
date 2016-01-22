'use strict';

import aeroflow from './aeroflow';

/**
* Returns new flow emitting values from this flow first and then from all provided sources without interleaving them.
* @alias Aeroflow#append
* @public @instance
*
* @param {...any} [sources] Value sources to append to this flow.
* @return {Aeroflow} new flow.
*
* @example
* aeroflow(1).concat(2, [3, 4], Promise.resolve(5), () => new Promise(resolve => setTimeout(() => resolve(6), 500))).dump().run();
* // next 1
* // next 2
* // next 3
* // next 4
* // next 5
* // next 6 // after 500ms
* // done
*/
function append(...sources) {
  return aeroflow(this, ...sources);
}

export { append };
