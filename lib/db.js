const { promisify } = require('util');
const uuid          = require('uuid/v4');
const path          = require('path');
const glob          = promisify(require('glob'));
const debug         = require('debug')('npfm:db');
const read          = promisify(require('fs').readFile);
const write         = promisify(require('fs').writeFile);
const xml2js        = require('xml2js');
const xml           = promisify(xml2js.parseString);

class RawDataXML {
  constructor({ filepath }) {
    this.filepath = filepath;
  }

  async table(name) {
    const filename = await this.files().then(files => files.find(file => file === `${name}.xml`));
    if (!filename) throw new Error(`Cannot find a "${name}" table`);

    const xmlFilepath = path.join(path.join(this.filepath, filename));
    return await xml(await read(xmlFilepath, 'utf8'));
    const rows = data.dataroot[name];
    return rows || [];
  }

  async files(pattern = '**/*.xml') {
    return await glob(pattern, { cwd: this.filepath })
  }

  async dependsOn(dependency) {
    const [ table, column ] = dependency.split(':');
    const data = await this.table(table);
    const rows = data.dataroot[table] || [];
    return rows.reduce((prev, row) => {
      if (!row) return prev;
      return prev.concat(row[column][0]);
    }, []);
  }

  async create({ table, row, primary }) {
    const data = await this.table(table);
    if (!data) throw new Error(`Unable to retrieve data from ${table}`);
    let rows = data.dataroot[table];
    if (!rows) throw new Error(`Unable to retrieve rows from ${table}`);

    if (!primary) throw new Error(`You must provide a primary record key in ${table}`);
    const record_key = row[primary.name];
    if (!record_key) throw new Error(`Cannot determine record key from primary key in ${table}`);

    const attributes = {
      record_uui: `{${uuid()}}`,
      record_timestamp: (Date.now() + ''),
      record_key
    };

    debug('Adding %s row to table %s', record_key, table, row);
    const record = { '$': attributes, ...row };
    data.dataroot[table].push(record);

    const builder = new xml2js.Builder();
    const newXml = builder.buildObject(data);

    // TODO: validate generated XML before saving
    await write(path.join(this.filepath, `${table}.xml`), newXml);
    debug('Created a new record entry (%s) in %s', record_key, table);
  }
}

module.exports = RawDataXML;
