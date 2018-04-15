const fs           = require('fs');
const path         = require('path');
const debug        = require('debug')('vinyl-pack:pack');
const bufferHelper = require('./buffer');

// hold reference to internal packer instance for the pack API helpers.
let pack = null;

const slashed = (str) => str.replace(/\//g, '\\');

class PackedFile {
  constructor(options = {}) {
    debug('Creating packedfile', options);
    const { output } = options;

    this.options = options;
    this.stream = fs.createWriteStream(output || 'mod.pack');
    this.files = [];
    this.directories = [];
    this.header = options.header || 'PFH5';
    this.encoding = options.encoding || 'ascii';
  }

  add(type, file) {
    return (type === 'file') ? this.addFile(file) :
      (type === 'directory' || type == 'dir') ? this.addDirectory(file) :
      new Error(`${type} not supported`);
  }

  addFile(file) {
    debug('Add file', file);
    this.files.push(file);
    return this;
  }

  addDirectory(dir) {
    debug('Add directory', dir);
    this.directories.push(dir);
    return this;
  }

  save(stream = this.stream) {
    const bh = bufferHelper;

    // Create PackFile at the given path with a default header of type Mod and type PFH3.
    stream.write(bh(this.header, this.encoding));

    // precedence byte
    const precedenceByte = Buffer.alloc(4);
    precedenceByte.writeInt32LE(3);
    stream.write(precedenceByte);

    // version
    const version = Buffer.alloc(4);
    version.writeInt32LE(0);
    stream.write(version);

    let indexSize = 0;
    const files = [
      { path: 'script/mousillon.lua', content: 'MouMou\n' },
      { path: 'script/campaign/all_scripted.lua', content: 'all scripted content\n' }
    ];

    // toWriteCount
    stream.write(Buffer.alloc(4));
    const toWriteCount = Buffer.alloc(4);
    toWriteCount.writeInt32LE(files.length);
    stream.write(toWriteCount);

    // index size

    for (const file of files) {
      console.log('adding entry', file.path);
      indexSize = indexSize + file.path.length + 6;
    }

    let buffer = Buffer.alloc(4);
    buffer.writeInt32LE(indexSize);
    stream.write(buffer);

    // Set "Unknown" byte
    stream.write(Buffer.alloc(4));
    const unknown = Buffer.alloc(4);
    unknown.writeInt32LE(0x15);
    stream.write(unknown);

    // pack entries are stored alphabetically in pack files
    files.sort((a, b) => a.path > b.path)

    stream.write(Buffer.alloc(1));

    // Write file list
    // TODO : handle additional info
    let count = 0;
    for (const file of files) {
      count = count + 1;
      // offset between filenames
      // writes the file path
      stream.write(Buffer.from(slashed(file.path), 'ascii'));
      if (count !== files.length) {
        stream.write(Buffer.alloc(1));
        stream.write(Buffer.alloc(1, 0x07));
        stream.write(Buffer.alloc(4));
      }
    }

    stream.write(Buffer.alloc(1));

    for (const file of files) {
      if (file.content.length) {
        stream.write(Buffer.from(file.content, 'ascii'));
      }
    }

    stream.end();
  }
}


// API
const api = module.exports = (options) => pack = new PackedFile(options);
