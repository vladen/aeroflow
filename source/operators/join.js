'use strict';

import { isError } from '../utilites';
import { arrayEmitter } from '../emitters/array';
import { toArrayOperator } from './toArray';

export function joinOperator(flow, predicate) {

  return emitter => (next, done, context) => {
  let source, array = [];
  toArrayOperator()(emitter)(
      result => {
        source = result;
        return false;
      },
      result => {        
        if (isError(result)) done(result);
        else {
          flow.run(value => {
              array.push(source
                .filter(x => !predicate || predicate(x, value))
                .map(x => {
                  return [x, value];
                }));
              }, 
            () => { 
              arrayEmitter(array)(next, done, context) 
            }
          );
        }
      },
      context
    );
  }
}
