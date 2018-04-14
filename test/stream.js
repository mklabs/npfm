const fs = require('fs');
const argv = process.argv.slice(2);
const [ filename ] = argv;

// According PFM method: https://sourceforge.net/p/packfilemanager/code/HEAD/tree/trunk/Common/PackFileCodec.cs#l98
const slashed = (str) => str.replace(/\//g, '\\');
console.log('Generate Packfile to %s', filename);
const stream = fs.createWriteStream(filename || './test.pack');

// Create PackFile at the given path with a default header of type Mod and type PFH3.
stream.write(Buffer.from('PFH5', 'ascii'));

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
