'use strict';

import { isError } from '../utilites';
import { arrayEmitter } from '../emitters/array';
import { adapterEmitter } from '../emitters/adapter';
import { toArrayOperator } from './toArray';

export function joinOperator(right, predicate) {
  let array = [], source;

  return emitter => (next, done, context) => {
  let source, array = [];
  var rightEmitter = adapterEmitter(right, true);
  toArrayOperator()(rightEmitter)(
      result => {
        source = result;
        return false;
      },
      result => {        
        if (isError(result)) done(result);
        else {          
          context.flow.run(value => {
              source
                .filter(x => !predicate || predicate(x, value))
                .map(x => array.push([x, value]));
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
