'use strict';

import { isFunction, objectDefineProperties, objectDefineProperty } from './utilites';

const CALLBACKS = Symbol('callbacks'), COMPLETED = Symbol('completed');

export class Context {
  constructor(source, data) {
    objectDefineProperties(this, {
      [CALLBACKS]: { value: [] },
      data: { value: data },
      source: { value: source }
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
    const context = new Context(this.source, this.data);
    this[CALLBACKS].push(() => context.done());
    return context;
  }
  track(callback) {
    if (!isFunction(callback)) return;
    if (this[COMPLETED]) callback();
    else this[CALLBACKS].push(callback);
  }
}
