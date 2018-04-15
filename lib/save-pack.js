const through = require('through2');
const debug = require('debug')('vinyl-pack:save-pack');

const transform = (file, enc, done) => {
  console.log('Passing through %s file', file.path);
  return done(null, file);
};

module.exports = (options) => {
  const { pack } = options;

  if (!pack) throw new Error('No pack to save');

  return through.obj(transform, (done) => {
      console.log('Flusing content to disk');

      pack.stream.on('finish', () => {
        console.log('pack stream finish');
        done()
      });

      pack.save();
  });
};
