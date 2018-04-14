const assert = require('assert');
var map = require('map-stream');
var vfs = require('vinyl-fs');
const vpack = require('./vinyl-pack');

const DBFile = require('./DBFile');
const DBFileHeader = require('./DBFileHeader')
const [ globparam ] = process.argv.slice(-2);

var log = function(file, cb) {
  // console.log(file.path);
  cb(null, file);
};

vpack.src('./test-script/**/*')
  .pipe(map(log))
  .pipe(vpack.dest('./output/modpack'));
