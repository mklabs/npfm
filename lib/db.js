const { promisify } = require('util');
const fs            = require('fs');
const uuid          = require('uuid/v4');
const path          = require('path');
const glob          = promisify(require('glob'));
const debug         = require('debug')('npfm:db');
const read          = promisify(fs.readFile);
const write         = promisify(fs.writeFile);
const xml2js        = require('xml2js');
const xml           = promisify(xml2js.parseString);
const stat           = promisify(fs.stat);

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

  async create({ table, row, primary, prompt }) {
    const data = await this.table(table);
    if (!data) throw new Error(`Unable to retrieve data from ${table}`);
    let rows = data.dataroot[table];
    if (!rows) throw new Error(`Unable to retrieve rows from ${table}`);

    if (!primary) throw new Error(`You must provide a primary record key in ${table}`);
    const record_key = row[primary.name];
    if (!record_key) throw new Error(`Cannot determine record key from primary key in ${table}`);

    const attributes = {
      record_uuid: `{${uuid()}}`,
      record_timestamp: (Date.now() + ''),
      record_key
    };

    console.log('\n  Adding %s row to %s table', record_key, table);
    console.log(row);

    const { response } = await prompt([{
      type: 'confirm',
      name: 'response',
      message: 'It it ok ?',
      default: true
    }])

    if (!response) {
      console.log('Okay! Not doing anything');
      return;
    }

    const record = { '$': attributes, ...row };
    data.dataroot[table].push(record);

    const builder = new xml2js.Builder();
    const newXml = builder.buildObject(data);

    // TODO: validate generated XML before saving
    await write(path.join(this.filepath, `${table}.xml`), newXml);
    debug('Created a new record entry (%s) in %s', record_key, table);

    // add the according update command to keep track of changes in the
    // assembly kit (when hitting "Display Changes")
    const updateCommandsFile = path.join(this.filepath, `update_commands.txt`);
    const exists = await stat(updateCommandsFile)
    const updateCommands = fs.createWriteStream(updateCommandsFile, { flags: 'a', encoding: 'utf8' });
    updateCommands.write(this.generateUpdateCommand(record).trim(), 'utf8');
    debug('Added a new update command in %s', path.join(this.filepath, 'update_commands.txt'), table);
  }

  generateUpdateCommand(record) {
    debug('Generating update command based on', record);
    const uid = record['$'].record_uuid;
    let fields = [
      `add_record@@command_uuid:{${uuid()}}`,
      `@@table:battle_set_pieces`,
      `@@uuid:${uid}`
    ];

    fields = fields.concat(Object.keys(record).map((field) => {
      if (field === '$') return '';
      // TODO: handle field_dependency_uuid
      return `@@field_name:${field}@@field_data:${record[field]}`;
    }));

    return fields.join('');
  }
}

const db = new RawDataXML({});
db.generateUpdateCommand({
  '$': {
    record_uuid: `{${uuid()}}`,
    record_timestamp: (Date.now() + ''),
    record_key: uuid()
  },

  battle_name: 'foobar'
});

module.exports = RawDataXML;
