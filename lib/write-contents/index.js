const fs = require('graceful-fs');
const path = require('path');
const mkdirp = require('fs-mkdirp-stream/mkdirp');
const through = require('through2');

const writeFile = (file, enc, done) => {
  return mkdirp(path.dirname(file.path), (err) => {
    if (err) {
      return done(err);
    }

    return fs.writeFile(file.path, file.contents, function(err) {
      if (err) {
        return done(err);
      }

      return done(null, file)
    });
  })
};

const writeDirectory = (file, enc, done) => {
  return mkdirp(file.path, done)
};

module.exports = function writeContents(options) {
  return through.obj((file, enc, done) => {
    // Write it as a symlink
    if (file.isSymbolic()) {
      return done(null, file);
    }

    // Stream it to disk yo
    if (file.isStream()) {
      return done(null, file);
    }

    // If directory then mkdirp it
    if (file.isDirectory()) {
      return writeDirectory(file, options, onWritten);
    }

    // Write it like normal
    if (file.isBuffer()) {
      return writeFile(file, options, onWritten);
    }

    // If no contents then do nothing
    if (file.isNull()) {
      return onWritten();
    }

    // This is invoked by the various writeXxx modules when they've finished
    // writing the contents.
    function onWritten(err) {
      if (err) return done(err);
      done(null, file);
    }
  });
}
