import { FUNCTION, NUMBER, STRING, SYMBOL } from './symbols';
import { classOf, isFunction, objectDefineProperties } from './utilites';

export default function registry() {
  const list = [];
  return objectDefineProperties(list, {
    get: { value: get },
    use: { value: use }
  });
  function get(target, ...parameters) {
    const builder = list[classOf(target)];
    if (isFunction(builder)) return builder(target, ...parameters);
    for (let i = list.length; i--;) {
      const instance = list[i](target, ...parameters);
      if (instance) return instance;
    }
  }
  function use(key, builder) {
    switch (classOf(key)) {
      case FUNCTION:
        list.push(key);
        break;
      case NUMBER:
        if (isFunction(builder)) list.splice(key, 0, builder);
        else list.splice(key, 1);
        break;
      case STRING:
      case SYMBOL:
        if (isFunction(builder)) list[key] = builder;
        else delete list[key];
        break;
    }
    return list;
  }
}
