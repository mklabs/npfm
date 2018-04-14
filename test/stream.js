const fs = require('fs');

const slashed = (str) => str.replace('/', '\\');
const stream = fs.createWriteStream('test.pack');

// var crypto = require('crypto');
// var fs = require('fs');
// var wstream = fs.createWriteStream('myBinaryFile');
// // creates random Buffer of 100 bytes
// var buffer = crypto.randomBytes(100);
// wstream.write(buffer);
// // create another Buffer of 100 bytes and write
// wstream.write(crypto.randomBytes(100));
// wstream.end();

// Create PackFile at the given path with a default header of type Mod and type PFH3.

const headerLength = 0x1C;

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

// Int64 fileTime = DateTime.Now.ToFileTimeUtc ();
// writer.Write (fileTime);


// toWrite.Sort (new PackedFileNameComparer ());

// foreach (PackedFile file in toWrite) {
//     writer.Write ((int)file.Size);
//     if (packFile.Header.HasAdditionalInfo) {
//         writer.Write(packFile.Header.AdditionalInfo);
//     }
//     // pack pathes use backslash, we replaced when reading
//     string packPath = file.FullPath.Replace (separatorString, "\\");
//     if (packFile.Header.PackIdentifier == "PFH5")
//     {
//         writer.Write((byte)0);
//     }
//     writer.Write (packPath.ToCharArray ());
//     writer.Write ('\0');
// }

// foreach (PackedFile file in toWrite) {
//     if (file.Size > 0) {
//         byte[] bytes = file.Data;
//         writer.Write (bytes);
//     }
// }

stream.end();
