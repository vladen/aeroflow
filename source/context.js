'use strict';

import { isFunction, objectDefineProperties, objectDefineProperty } from './utilites';

const CALLBACKS = Symbol('callbacks'), DONE = Symbol('done');

export class Context {
  constructor(flow, data) {
    objectDefineProperties(this, {
      data: { value: data },
      flow: { value: flow }
    });
  }
  get active() {
    return !this[DONE];
  }
  done() {
    if (this[DONE]) return false;
    objectDefineProperty(this, DONE, { value: true });
    const callbacks = this[CALLBACKS];
    if (callbacks) {
      callbacks.forEach(callback => callback());
      callbacks.length = 0;
    }
    return true;
  }
  spawn() {
    const context = new Context(this.flow, this.data);
    this.track(() => context.done());
    return context;
  }
  track(callback) {
    if (!isFunction(callback)) return;
    if (this[DONE]) callback();
    else {
      const callbacks = this[CALLBACKS];
      if (callbacks) callbacks.push(callback);
      else objectDefineProperty(this, CALLBACKS, { value: [callback] });
    }
  }
}
