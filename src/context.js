'use strict';

import { isFunction, objectDefineProperties } from './utilities';

// Creates new flow execution context
function createContext(flow, data) {
  let active = true
    , callbacks = []
    , context = () => active
    , end = () => {
        if (active) {
          active = false;
          callbacks.forEach(callback => callback());
        }
        return false;
      }
    , onend = callback => {
        if (isFunction(callback)) active ? callbacks.push(callback) : callback();
        return callback;
      }
    , spawn = () => onend(createContext(flow, data).end); // test this
  return defineProperties(context, {
    data: { value: data }
  , flow: { value: flow }
  , end: { value: end }
  , onend: { value: onend }
  , spawn: { value: spawn }
  });
}

export default createContext; //todo: turn into class and export by name
