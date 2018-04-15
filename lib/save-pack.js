const through = require('through2');
const debug = require('debug')('vinyl-pack:save-pack');

const transform = (file, enc, done) => {
  debug('Passing through %s file', file.path);
  return done(null, file);
};

module.exports = (options) => {
  const { pack } = options;

  if (!pack) throw new Error('No pack to save');

  return through.obj(transform, (done) => {
      debug('Flusing content to disk');
      pack.stream.on('finish', () => done());
      pack.save();
  });
};
