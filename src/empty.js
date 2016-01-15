'use strict';

import { Aeroflow } from './aeroflow';
import { emitEmpty } from './emit';

export const empty = new Aeroflow(emitEmpty());
