const path = require('path');
const packer = require('../lib/packer');
const output = 'foo.pack';
const pattern = '**/*';

(async () => {
  const pack = await packer.create({ output, pattern, cwd: path.resolve('working_data') });
  debug('Pack created at %s', pack.output);
})();






