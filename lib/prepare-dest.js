const fs = require('graceful-fs');
const path = require('path');
const vinyl = require('vinyl');
const through = require('through2');

module.exports = function prepareWrite(options) {
  if (!options) {
    throw new Error('Invalid output');
  }

  function normalize(file, enc, cb) {
    if (!vinyl.isVinyl(file)) {
      return cb(new Error('Received a non-vinyl object in `dest()`'));
    }

    const output = options.output;
    if (!output) {
      return cb(new Error('Invalid output destination'));
    }

    const cwd = path.resolve(options.cwd || '');
    const basePath = path.resolve(cwd, output);
    const writePath = path.resolve(basePath, file.relative);

    // Wire up new properties
    file.cwd = cwd;
    file.base = basePath;
    file.from = file.path;
    file.path = writePath;

    cb(null, file);
  }

  return through.obj(normalize);
}
