const fs = require('fs');
const path = require('path');
const glob = require('glob');
const debug = require('debug')('npfm:packer');
const PackedFile = require('./PackedFile');

// packer
const packer = module.exports = (options) => pack = new PackedFile(options);
packer.PackedFile = PackedFile;
packer.create = async (options = {}) => {
  let { globs, output, cwd } = options;
  // debug('Create pack from %s files in %s to %s', pattern, cwd, output);
  console.log('options', options);
  cwd = cwd || path.resolve('working_data');
  globs = globs || '**/*';

  const pack = await packer.createPackFromFiles({
    cwd,
    output,
    globs
  });

  debug('Pack created %s', output);
  debug('Saving');
  await pack.save();
  debug('Saved');
  return pack;
};

packer.createPackFromFiles = ({ cwd, globs, output }) => {
  return new Promise((resolve, reject) => {
    glob(globs, { cwd }, (err, files) => {
      files = files
        // filter out directories
        .filter((file) => {
          const filename = path.join(cwd, file);
          // todo: sync for now
          const stat = fs.statSync(filename);
          return !stat.isDirectory();
        })
        // map some additional props and transform into expected format
        .map((file) => {
          const relative = file;
          const base = path.resolve(process.cwd(), output);
          const writePath = path.resolve(base, relative);
          const stream = fs.createReadStream(path.join(cwd, file))

          return {
            file,
            base,
            stream,
            relative,
            writePath
          };
        })

      const pack = new PackedFile({ output, files });
      debug('Created packfile with %d files, to be generated in %s', pack.files.length, output);
      resolve(pack);
    });
  });
}
