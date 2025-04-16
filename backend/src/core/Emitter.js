const { EventEmitter } = require("events");

let instance = null;

class Emitter {
  constructor() {
    if (!instance) {
      this.emitters = {};
      instance = this;
    }
    return instance;
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

module.exports = new Emitter();
