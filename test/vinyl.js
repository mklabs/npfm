process.env.DEBUG = process.env.DEBUG || 'vinyl-pack*';
const vpack = require('..');
var map = require('map-stream');

const debug = require('debug');
const inspect = require('eyes').inspector({ stream: null });
debug.formatters.y = (v) => {
  return inspect(v);
};

const filepath = 'data/retail/npfm.pack';
const log = debug('vinyl-pack:test');

log('Saving pack to %s', filepath);
vpack.src('./working_data/**/*')
  .pipe(map((file, done) => log(file.path) || done(null, file)))
  .pipe(vpack.dest(filepath));

