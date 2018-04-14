const fs = require('fs');
const through = require('through2');

module.exports = function readContents(options) {
  return through.obj((file, encoding, done) => {
    return fs.stat(file.from, (err, stat) => {
      if (err) return done(err);
      if (stat.isDirectory()) return done(null, file);
      return fs.readFile(file.from, (err, contents) => {
        if (err) return done(null, file);
        file.contents = contents;
        done(null, file);
      });
    });
  });
}
