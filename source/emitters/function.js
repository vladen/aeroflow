'use strict';

export function functionEmitter(source) {
  return (next, done, context) => {
    try {
      next(source(context.data));
      return done();
    }
  	catch(error) {
    	return done(error);
    }
  };
}
