'use strict';

import { DATE, ERROR, FUNCTION, NUMBER, PROMISE, REGEXP } from './symbols';

export const classOf = value => Object.prototype.toString.call(value).slice(8, -1);
export const classIs = className => value => classOf(value) === className;
export const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
export const constant = value => () => value;
export const dateNow = Date.now;
export const identity = value => value;
export const isArray = Array.isArray;
export const isDate = classIs(DATE);
export const isError = classIs(ERROR);
export const isFunction = classIs(FUNCTION);
export const isInteger = Number.isInteger;
export const isNothing = value => value == null;
export const isNumber = classIs(NUMBER);
export const isObject = Object.isObject;
export const isPromise = classIs(PROMISE);
export const isRegExp = classIs(REGEXP);
export const isSomething = value => value != null;
export const mathFloor = Math.floor;
export const mathRandom = Math.random;
export const maxInteger = Number.MAX_SAFE_INTEGER;
export const mathMax = Math.max;
export const noop = () => {};
export const objectDefineProperties = Object.defineProperties;
export const objectDefineProperty = Object.defineProperty;
export const throwError = error => {
  throw isError(error)
    ? error
    : new Error(error); 
};
