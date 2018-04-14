const fs = require('graceful-fs');
const path = require('path');
const mkdirp = require('fs-mkdirp-stream/mkdirp');
const through = require('through2');

const writeFile = (file, enc, done) => {
  console.log('write file', file.path);
  return mkdirp(path.dirname(file.path), (err) => {
    if (err) {
      return done(err);
    }

    return fs.writeFile(file.path, file.contents, function(err) {
      if (err) {
        console.log('fok', file.path);
        return done(err);
      }

      return done(null, file)
    });
  })
};

const writeDirectory = (file, enc, done) => {
  console.log('write dir', file.path);
  return mkdirp(file.path, done)
};

module.exports = function writeContents(options) {
  return through.obj((file, enc, callback) => {
    // Write it as a symlink
    if (file.isSymbolic()) {
      console.log('symbolic =>', file.path);
      return done(null, file);
    }

    // Stream it to disk yo
    if (file.isStream()) {
      console.log('stream =>', file.path);
      return done(null, file);
    }

    // If directory then mkdirp it
    if (file.isDirectory()) {
      console.log('dir =>', file.path);
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
      if (err) return callback(err);
      callback(null, file);
    }
  });
}
