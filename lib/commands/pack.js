const path = require('path');
const packer = require('../packer');
const debug = require('debug')('npfm');

const pack = module.exports = async (argv) => {
  if (argv.help || argv.h) return console.log(`
  Usage: npfm pack [destination] [options]

  Options:
    -s, --src     Source files (default: **/*)
    --glob[s]     Alias for src
    --cwd         Working directory (default: ./working_data)

  Example:
    # next to your working_data/ directory
    npfm pack --glob "**/*" data/retail/mod.pack

    # if not, or if your files live in another directory structure
    npfm pack --glob "script/**/*" --cwd "src/awesome_mod/"  retail/data/awesome_mod.pack
  `);

  const globs = argv.src || argv.s || argv.glob || argv.globs || '**/*';
  const cwd = argv.cwd || path.resolve('working_data');
  const output = argv._[1];
  if (!output) return new Error('You must supply an output destination for your pack');

  debug('Creating pack at %s', output);
  return await packer.createWithPfm({ output, globs, cwd });
};

