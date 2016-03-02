import { FUNCTION, NUMBER, STRING, SYMBOL } from './symbols';
import { classOf, isFunction, objectDefineProperties } from './utilites';

export default function registry() {
  const list = [];
  return objectDefineProperties(list, {
    get: { value: get },
    use: { value: use }
  });
  function get(target, ...parameters) {
    let functor = list[classOf(target)];
    if (isFunction(functor)) return functor(target, ...parameters);
    for (let i = list.length; i--;) {
      functor = list[i](target, ...parameters);
      if (isFunction(functor)) return functor;
    }
  }
  function use(key, functor) {
    switch (classOf(key)) {
      case FUNCTION:
        list.push(key);
        break;
      case NUMBER:
        if (isFunction(functor)) list.splice(key, 0, functor);
        else list.splice(key, 1);
        break;
      case STRING:
      case SYMBOL:
        if (isFunction(functor)) list[key] = functor;
        else delete list[key];
        break;
    }
    return list;
  }
}
