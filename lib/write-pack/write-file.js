const debug  = require('debug')('vinyl-pack:write-pack:writeFile');

const writeFile = module.exports = (file, options, done) => {
  const { pack } = options;
  debug('Add file %s into pack', file, pack);
  pack.add('file', file);
  done(null, file);
};
