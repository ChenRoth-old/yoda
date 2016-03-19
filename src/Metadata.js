'use strict';
const promisify = require("promisify-node");


module.exports = class Metadata {

  constructor(fields) {
    this.fields = fields || {};
  }

  prepare(field, solution) {

    // parse args if available
    let args = [];
    if (arguments.length > 2) {
      args = Array.prototype.slice.call(arguments, 2);
    }

    let promise = null;
    if (solution instanceof Function) {
      // if the solution is a function, it must be a node callback style
      let promise = promisify(solution);
      this.fields[field] = promise.apply(this, args);
    } else {
      // if the solution is not a function, simply use it as is
      this.fields[field] = solution;
    }
  }

  ready(cb) {

    if (this._ready) {
      return _ready;
    }

    let fieldNames = Object.keys(this.fields);
    let fieldsList = [];
    for (let fieldName of fieldNames) {
      fieldsList.push(this.fields[fieldName]);
    }
    let self = this;
    this._ready = Promise.all(fieldsList).then(function(values) {
      for (let i = 0; i < values.length; i++) {
        let fieldName = fieldNames[i];
        let value = values[i];
        self.fields[fieldName] = value;
      }
      cb && cb(self.fields);
    });
    return this._ready;
  }
}
