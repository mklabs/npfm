const debug = require('debug')('npfm:lib:pfm')
const { promisify } = require('util');
const { spawn } = require('child_process');
const path = require('path');

const run = async (bin, args, options) => {
  return new Promise((resolve, reject) => {
    const sh = spawn(bin, args, options, (err) => {
      if (err) return reject(err);
      resolve();
    });

    sh.on('close', (code) => resolve(null, code))
  });
};

const pfm = async ({ exe, args, cwd }) => {
  exe = exe || pfm.exe;
  return await run(exe, args, {
    stdio: 'inherit',
    cwd
  });
};

module.exports = pfm;
pfm.run = run;
pfm.pfm = pfm;
pfm.exe = path.join(__dirname, '../.pfm/pfm/pfm.exe');

