const debug = require('debug')('npfm:pfm')
const { promisify } = require('util');
const { spawn } = require('child_process');
const path = require('path');

const run = (bin, args) => {
  return new Promise((resolve, reject) => {
    const sh = spawn(bin, args, { stdio: 'inherit' }, (err) => {
      if (err) return reject(err);
      resolve();
    });

    sh.on('close', (code) => resolve(null, code))
  });
};

const action = module.exports = async(options) => {
  const argv = process.argv.slice(3);
  const args = argv.length ? `${argv.join(' ')}`.split(' ') : [];
  const pfm = path.join(__dirname, '../../bin/pfm.exe');

  await run(pfm, args, {
    stdio: 'inherit'
  });
};
