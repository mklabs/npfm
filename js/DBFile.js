const path = require('path');


module.exports = class DBFile {

  constructor(header, info) {
    this.header = header;
    this.info = info;
    this.entries = [];
  }

  GetNewEntry() {

  }


  import(dbFile) {


  }

  typeName(fullpath) {
    return path.basename(fullpath);
  }
}

