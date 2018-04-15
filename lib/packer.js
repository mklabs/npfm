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
    this.cwd = options.cwd || path.join(process.cwd(), 'working_data');
  }

  add(type, file) {
    return (type === 'file') ? this.addFile(file) :
      (type === 'directory' || type == 'dir') ? this.addDirectory(file) :
      new Error(`${type} not supported`);
  }

  addFile(file) {
    console.log('Add file', file.from, path.relative(this.cwd, file.from));
    this.files.push({
      path: path.relative(this.cwd, file.from),
      content: file.contents
    });
    return this;
  }

  addDirectory(dir) {
    debug('Add directory', dir);
    this.directories.push(dir);
    return this;
  }

  async save(stream = this.stream) {
    const bh = bufferHelper;

    // Create PackFile at the given path with a default header of type Mod and type PFH3.
    stream.write(Buffer.from('PFH5', 'ascii'));

    // precedence byte
    const precedenceByte = Buffer.alloc(4);
    precedenceByte.writeInt32LE(3);
    stream.write(precedenceByte);

    // version
    const version = Buffer.alloc(4);
    version.writeInt32LE(0);
    stream.write(version);

    let indexSize = 0;
    const files = this.files;

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

    // Set "Unknown" byte (TODO: That unknown byte is causing trouble)
    stream.write(Buffer.alloc(4));
    const unknown = Buffer.alloc(1);
    unknown.writeIntLE(0xF6);;
    stream.write(unknown);

    const unknown2 = Buffer.alloc(1);
    unknown2.writeIntLE(0x29);
    stream.write(unknown2);

    stream.write(Buffer.alloc(2));

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

    files.forEach(async (file) => {
      if (file.content.length) {
        function write(data, cb) {
          if (!stream.write(data)) {
            stream.once('drain', cb);
          } else {
            process.nextTick(cb);
          }
        }

        return new Promise((resolve, reject) => {
          // Wait for cb to be called before doing any other write.
          write(Buffer.from(file.content, 'ascii'), () => {
            console.log('write completed, do more writes now');
            resolve();
          });
        });
      }
    });

    stream.end();
  }
}


// API
const api = module.exports = (options) => pack = new PackedFile(options);
