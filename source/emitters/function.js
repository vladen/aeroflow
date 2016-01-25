'use strict';

export function functionEmitter(source) {
  return (next, done, context) => {
  	next(source(context.data));
  	done();
  };
}
