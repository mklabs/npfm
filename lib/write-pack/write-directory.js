const debug  = require('debug')('vinyl-pack:write-pack:writeDirectory');

const writeDirectory = module.exports = (dir, options, done) => {
  const { pack } = options;
  debug('Add directory', dir);
  pack.add('directory', dir);
  done(null, dir);
};
