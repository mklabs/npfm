const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));
const debug = require('debug')('npfm:db');
const read = promisify(require('fs').readFile);
const xml2js = promisify(require('xml2js').parseString);

class RawDataXML {
  constructor({ filepath }) {
    // debug('Init new db to %s filepath', filepath);
    this.filepath = filepath;
  }

  async table(name) {
    const filename = await this.files().then(files => files.find(file => file === `${name}.xml`));
    if (!filename) throw new Error(`Cannot find a "${name}" table`);

    // debug('Loading xml file %s in %s', filename, this.filepath);
    const xmlFilepath = path.join(path.join(this.filepath, filename));
    const file = await read(xmlFilepath, 'utf8');
    const data = await xml2js(file);
    const rows = data.dataroot[name];
    return rows || [];
  }

  async files(pattern = '**/*.xml') {
    return await glob(pattern, { cwd: this.filepath })
  }

  async dependsOn(dependency) {
    const [ table, column ] = dependency.split(':');
    const rows = await this.table(table);
    return rows.reduce((prev, row) => {
      if (!row) return prev;
      return prev.concat(row[column][0]);
    }, []);
  }
}

module.exports = RawDataXML;
