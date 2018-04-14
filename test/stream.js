const fs = require('fs');

// According PFM method: https://sourceforge.net/p/packfilemanager/code/HEAD/tree/trunk/Common/PackFileCodec.cs#l98
const slashed = (str) => str.replace('/', '\\');
const stream = fs.createWriteStream('test.pack');

// Create PackFile at the given path with a default header of type Mod and type PFH3.
stream.write(Buffer.from('PFH5'));

const precedenceByte = Buffer.alloc(4);
precedenceByte.writeInt32LE(3);
stream.write(precedenceByte);

// version
const version = Buffer.alloc(4);
version.writeInt32LE(0);
stream.write(version);

// stream.write(Buffer.from('2'));

let indexSize = 0;
const files = [
  { path: 'mousillon.lua', content: 'MouMou' },
  { path: 'script/all_scripted.lua', content: 'all scripted content' }
];

for (const file of files) {
  console.log('adding entry', file.path);
  indexSize = indexSize + file.path.length + 6;
}

// toWriteCount
stream.write(Buffer.alloc(8));
stream.write(Buffer.from('0'));

// index size
let buffer = Buffer.alloc(4);
buffer.writeUInt32LE(indexSize);

// Set "Unknown" byte
stream.write(Buffer.alloc(7));
const unknown = Buffer.alloc(4);
unknown.writeInt32LE(0x06);
stream.write(unknown);


files.sort((a, b) => a.path > b.path)

stream.write(Buffer.alloc(1));

// Write file list
// TODO : handle additional info
let count = 0;
for (const file of files) {
  count = count + 1;
  // offset between filenames
  // writes the file path
  stream.write(Buffer.from(slashed(file.path)));
  if (count !== files.length) {
    stream.write(Buffer.alloc(6));
  }
}

stream.write(Buffer.alloc(1));

for (const file of files) {
  if (file.content.length > 0) {
    stream.write(Buffer.from(file.content));
  }
}

stream.end();
