const fs   = require('fs');
const uuid = require('uuid/v4');
const glob = require('glob');
const path = require('path');

const schemas = glob.sync(path.join(__dirname, '*.js'))
  .map(file => path.basename(file).replace(path.extname(file), ''))
  .filter(file => file !== 'index.js');

class Adapter {
  constructor(record) {
    this.record = record;
  }

  data() {
    return this.record.data();
  }
}

class Record {
  constructor(schema, adapter) {
    this.name = schema;
    this.schema = require(`./${schema}.js`);
    this.adapter = adapter || new Adapter(this);
    this._data = {};
  }

  read() {}
  create() {}
  update() {}
  delete() {}

  data() {
    return Object.assign({}, this._data);
  }
}

const records = module.exports = schemas.map(schema => new Record(schema));
records.Record = Record;
