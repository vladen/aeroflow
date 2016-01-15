import { CLASS_DATE, CLASS_ERROR, CLASS_FUNCTION, CLASS_NUMBER, CLASS_PROMISE, CLASS_REG_EXP } from './classes';

const
  classOf = value => Object.prototype.toString.call(value).slice(8, -1)
, classIs = className => value => classOf(value) === className
, compare = (left, right) => left < right ? -1 : left > right ? 1 : 0
, constant = value => () => value
, dateNow = Date.now
, identity = value => value
, isArray = Array.isArray
, isDate = classIs(CLASS_DATE)
, isError = classIs(CLASS_ERROR)
, isFunction = classIs(CLASS_FUNCTION)
, isInteger = Number.isInteger
, isNothing = value => value == null
, isNumber = classIs(CLASS_NUMBER)
, isObject = Object.isObject
, isPromise = classIs(CLASS_PROMISE)
, isRegExp = classIs(CLASS_REG_EXP)
, isSomething = value => value != null
, mathFloor = Math.floor
, mathRandom = Math.random
, maxInteger = Number.MAX_SAFE_INTEGER
, noop = () => {}
, objectDefineProperties = Object.defineProperties
, objectDefineProperty = Object.defineProperty
, throwError = error => { throw isError(error) ? error : new Error(error); };

export {
  classOf, classIs, compare, constant, defineProperties, defineProperty, floor, identity
, isArray, isDate, isError, isFunction, isInteger, isNothing, isNumber, isObject, isPromise, isRegExp, isSomething
, maxInteger, noop, now, throwError
};
