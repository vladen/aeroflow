'use strict';

import {
  BOOLEAN, DATE, ERROR, NUMBER, NULL, PROMISE, STRING, SYMBOL, UNDEFINED
} from './symbols';

export const primitives = new Set([
  BOOLEAN, NULL, NUMBER, STRING, SYMBOL, UNDEFINED
]);

export const dateNow = Date.now;
export const mathFloor = Math.floor;
export const mathPow = Math.pow;
export const mathRandom = Math.random;
export const mathMax = Math.max;
export const mathMin = Math.min;
export const maxInteger = Number.MAX_SAFE_INTEGER;
export const minInteger = Number.MIN_SAFE_INTEGER;
export const objectCreate = Object.create;
export const objectDefineProperties = Object.defineProperties;
export const objectDefineProperty = Object.defineProperty;
export const objectToString = Object.prototype.toString;

export const compare = (left, right, direction) => left < right
  ? -direction
  : left > right
    ? direction
    : 0;
export const constant = value => () => value;
export const identity = value => value;
export const noop = () => {};

export const classOf = value => objectToString.call(value).slice(8, -1);
export const classIs = className => value => classOf(value) === className;

export const isBoolean = value => value === true || value === false;
export const isDefined = value => value !== undefined;
export const isError = classIs(ERROR);
export const isFunction = value => typeof value == 'function';
export const isInteger = Number.isInteger;
export const isPromise = classIs(PROMISE);
export const isUndefined = value => value === undefined;

export const tie = (func, ...args) => () => func(...args);

export const falsey = () => false;
export const truthy = () => true;

export const toDelay = (value, def) => {
  switch (classOf(value)) {
    case DATE:
      value = value - dateNow();
      break;
    case NUMBER:
      break;
    default:
      value = +value;
      break;
  }
  return isNaN(value) ? def : value < 0 ? 0 : value;
}

export const toFunction = (value, def) => isFunction(value)
  ? value
  : isDefined(def)
    ? isFunction(def)
      ? def
      : constant(def)
    : constant(value);

export const toNumber = (value, def) => {
  value = +value;
  return isNaN(value) ? def : value;
};

export const toError = value => isError(value)
  ? value
  : new Error(value);
