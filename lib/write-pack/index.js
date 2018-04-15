const through = require('through2');
const debug = require('debug')('vinyl-pack');
const writeFile = require('./write-file');
const writeDirectory = require('./write-directory');

module.exports = (options) => through.obj((file, enc, done) => {
  // debug('got a file', file);
  // Write it as a symlink
  if (file.isSymbolic()) {
    debug('got symb file', file);
    return done(null, file);
  }

  // Stream it to disk yo
  if (file.isStream()) {
    debug('got stream file', file);
    return done(null, file);
  }

  // If directory then mkdirp it
  if (file.isDirectory()) {
    debug('got directory', file);
    return writeDirectory(file, options, done);
  }

  // Write it like normal
  if (file.isBuffer()) {
    debug('got buffer', file);
    return writeFile(file, options, done);
  }

  // If no contents then do nothing
  if (file.isNull()) {
    debug('got null', file);
    return done();
  }
});
