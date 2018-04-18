const fs = require('fs');
const path = require('path');
const glob = require('glob');
const debug = require('debug')('npfm:packer');
const PackedFile = require('./PackedFile');
const pfm = require('./pfm');
const { promisify } = require('util');
const wd = path.join(__dirname, '../.pfm/working_directory');
const cpr = promisify(require('cpr'));
const cpy = require('cpy');
const read = promisify(fs.readFile);
const exists = promisify(fs.exists);
const minimatch = require('minimatch');

// packer
const packer = module.exports = (options) => pack = new PackedFile(options);
packer.PackedFile = PackedFile;

packer.createWithPfm = async ({ output, globs, cwd }) => {
  // debug('Create pack from %s files in %s to %s', pattern, cwd, output);
  cwd = cwd || path.resolve('working_data');
  globs = globs || '**/*';

  console.log('npfm', globs, cwd);
  let files = await packer.glob({ pattern: globs, cwd, fileOnly: true });
  // TODO: extract into its own utility file
  const npfmignore = await exists(path.resolve('.npfmignore')) ? await read(path.resolve('.npfmignore'), 'utf8') : '';
  const ignorelist = npfmignore.split(/\r?\n/);

  // handle ignore list, yo!
  const toPack = ignorelist.reduce((files, ignore) => {
    return files.filter((file) => !minimatch(file, ignore));
  }, files);

  debug('Ignored %d based on .npfmignore file', files.length - toPack.length);

  const actions = {
    list: `u ${output}`,
    create: `c ${output}`,
    extract: `x ${output}`,
    update: `u ${output} ${toPack.join(' ')}`,
    add: `u ${output} ${toPack.join(' ')}`
  };

  // create pack

  // first copy files to staging directory, and run the executable within
  debug('Copying files to staging directory');
  await cpr(cwd, wd, { deleteFirst: true });
  debug('Creating pack with pfm executable. %d files to add.', toPack.length);
  await packer.cmd(actions.create);
  debug('pack %s created', output);
  if (toPack.length) await packer.cmd(actions.update);
  if (toPack.length) debug('pack %s udpated with %d files', output, toPack.length);
  debug('Copying staging mod file to %s', output);
  await cpy(path.join(wd, output), path.resolve('.'));
  debug('Pack succefully created at %s', output);
};

packer.cmd = async (cmd) => {
  const args = cmd.split(' ');
  return pfm({ args, cwd: wd });
};

packer.create = async ({ globs, output, cwd }) => {
  // debug('Create pack from %s files in %s to %s', pattern, cwd, output);
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

packer.glob = async ({ pattern, cwd, fileOnly }) => {
  const files = await promisify(glob)(pattern, { cwd });
  if (!fileOnly) return files;
  return files.filter((file) => {
    const filename = path.join(cwd, file);
    // TODO: sync for now
    const stat = fs.statSync(filename);
    return !stat.isDirectory();
  });
};

packer.createPackFromFiles = async ({ cwd, globs, output }) => {
  const files = await packer.glob({ pattern: globs, cwd, fileOnly: true })
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
  return pack;
}
