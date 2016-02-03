'use strict';

import { DATE, ERROR, FUNCTION, NUMBER, PROMISE } from './symbols';

export const dateNow = Date.now;
export const mathFloor = Math.floor;
export const mathPow = Math.pow;
export const mathRandom = Math.random;
export const mathMax = Math.max;
export const maxInteger = Number.MAX_SAFE_INTEGER;
export const objectCreate = Object.create;
export const objectDefineProperties = Object.defineProperties;
export const objectToString = Object.prototype.toString;

export const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
export const constant = value => () => value;
export const identity = value => value;
export const noop = () => {};

export const classOf = value => objectToString.call(value).slice(8, -1);
export const classIs = className => value => classOf(value) === className;

export const isDate = classIs(DATE);
export const isError = classIs(ERROR);
export const isFunction = classIs(FUNCTION);
export const isInteger = Number.isInteger;
export const isNumber = classIs(NUMBER);
export const isPromise = classIs(PROMISE);
export const isUndefined = value => value === undefined;

export const tie = (func, ...args) => () => func(...args);

export const toNumber = (value, def) => {
  if (!isNumber(value)) {
    value = +value;
    if (isNaN(value)) return def;
  }
  return value;
};
