const fs           = require('fs');
const path         = require('path');
const debug        = require('debug')('npfm:vinyl-pack:pack');
const bufferHelper = require('./buffer');
const through      = require('through2');
const slashed = (str) => str.replace(/\//g, '\\');

module.exports = class PackedFile {
  constructor(options = {}) {
    debug('Creating packedfile', options);
    const { output } = options;

    this.options = options;
    this.stream = fs.createWriteStream(output || 'mod.pack');
    this.files = options.files ? Array.from(options.files) : [];
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
    debug('Adding file %s to pack %s', file.relative, this.options.output);
    this.files.push({
      file,
      relative: file.relative
    });
    return this;
  }

  addDirectory(dir) {
    debug('Add directory', dir);
    this.directories.push(dir);
    return this;
  }

  async save(done) {
    debug('Saving');
    const bh = bufferHelper;
    const stream = this.stream;
    const files = this.files;

    // Create PackFile at the given path with a default header of type Mod and type PFH3.
    debug('Writing header');
    stream.write(Buffer.from('PFH5', 'ascii'));

    // precedence byte
    debug('Writing precedence byte');
    const precedenceByte = Buffer.alloc(4);
    precedenceByte.writeInt32LE(3);
    stream.write(precedenceByte);

    // version
    debug('Writing version');
    const version = Buffer.alloc(4);
    version.writeInt32LE(0);
    stream.write(version);

    // toWriteCount
    debug('Writing toWriteCount');
    stream.write(Buffer.alloc(4));
    const toWriteCount = Buffer.alloc(4);
    toWriteCount.writeInt32LE(files.length);
    stream.write(toWriteCount);

    debug('Computing index size');
    let indexSize = 0;
    for (const file of files) {
      indexSize = indexSize + file.relative.length + 6;
    }

    debug('Writing index size');
    let buffer = Buffer.alloc(4);
    buffer.writeInt32LE(indexSize);
    stream.write(buffer);

    // Set "Unknown" byte (TODO: That unknown byte is causing trouble)
    debug('Set Unknown byte');
    stream.write(Buffer.alloc(4));
    const unknown = Buffer.alloc(1);
    unknown.writeIntLE(0xF6);;
    stream.write(unknown);

    debug('Set Unknown byte 2');
    const unknown2 = Buffer.alloc(1);
    unknown2.writeIntLE(0x29);
    stream.write(unknown2);

    debug('Set offset 2');
    stream.write(Buffer.alloc(2));

    // pack entries are stored alphabetically in pack files
    debug('Sort entries');
    files.sort((a, b) => a.relative > b.relative)

    debug('Set offset 1');
    stream.write(Buffer.alloc(1));

    // Write file list
    let count = 0;
    debug('Write file list');
    for (const file of files) {
      count = count + 1;
      debug('Writing relative file: %s', file.relative);
      stream.write(Buffer.from(slashed(file.relative), 'ascii'));

      if (count !== files.length) {
        debug('Adding offset betwen filenames', file.relative);
        stream.write(Buffer.alloc(1));
        stream.write(Buffer.alloc(1, 0x07));
        stream.write(Buffer.alloc(4));
      }
    }

    debug('Set offset 1');
    stream.write(Buffer.alloc(1));

    debug('Set write function');
    const write = (file) => {
      return new Promise((resolve, reject) => {
        debug('write()', file.relative);
        return file.stream
          .pipe(through(function(chunk, encoding, done) {
            this.push(chunk);
            done();
          }))
          .on('end', () => resolve())
          .pipe(stream, { end: false });
      });
    }

    debug('Writing file contents for', files.length);
    for (const file of files) {
      debug('Writing file %s content', file.relative);
      await write(file);
      debug('Wrote file %s content', file.relative);
    }

    debug('end loop');
    stream.end();
  }
}
