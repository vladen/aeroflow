'use strict';

import { isFunction, objectDefineProperties, objectDefineProperty } from './utilites';

const CALLBACKS = Symbol('callbacks');
const COMPLETED = Symbol('completed');

class Context {
  constructor(flow, data) {
    objectDefineProperties(this, {
      [CALLBACKS]: { value: [] },
      data: { value: data },
      flow: { value: flow }
    });
  }
  get active() {
    return !this[COMPLETED];
  }
  done() {
    if (this[COMPLETED]) return false;
    objectDefineProperty(this[COMPLETED], { value: true});
    const callbacks = this[CALLBACKS];
    callbacks.forEach(callback => callback());
    this[CALLBACKS].length = 0;
    return true;
  }
  spawn() {
    if (this[COMPLETED]) return;
    const context = new Context(this.flow, this.data);
    this[CALLBACKS].push(() => context.done());
    return context;
  }
  track(callback) {
    if (!isFunction(callback)) return;
    if (this[COMPLETED]) callback();
    else this[CALLBACKS].push(callback);
  }
}

export { Context };
