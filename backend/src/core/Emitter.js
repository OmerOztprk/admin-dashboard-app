const { EventEmitter } = require("events");

class Emitter {
  constructor() {
    if (!Emitter.instance) {
      this.emitters = {};
      Emitter.instance = this;
    }
    return Emitter.instance;
  }

  addEmitter(name) {
    if (!this.emitters[name]) {
      this.emitters[name] = new EventEmitter();
    }
  }

  getEmitter(name) {
    return this.emitters[name];
  }
}

const instance = new Emitter();
Object.freeze(instance);

module.exports = instance;
