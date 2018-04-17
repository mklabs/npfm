const fs = require('fs')
const path = require('path')
const { promisify } = require('util');
const mkdirp = promisify(require('mkdirp'));
const nugget = promisify(require('nugget'));
const decompress = require('decompress');
const rimraf = promisify(require('rimraf'));

// TODO: handle executable on osx, unix ?
const version = require('../package.json').config.pfmversion;
const url = (version) => `https://sourceforge.net/projects/packfilemanager/files/Release/Pack%20File%20Manager%20${version}.zip/download`;
const temp = path.join(__dirname, '../.cache');

const run = async () => {
  const target = path.join(temp, 'pfm.zip');
  const downloadUrl = url(version);
  console.log(' ... Creating cache directory');
  await mkdirp(temp);

  console.log(' ... Downloading %s url to %s', downloadUrl, target);
  await nugget(downloadUrl, { target });

  console.log(' ... Unzipping %s to bin/pfm', target);
  await decompress(target, path.join(__dirname, '../bin'), {
    filter: (file) => path.basename(file.path) === 'pfm.exe'
  });

  console.log('... Cleaning cache directory ...');
  await rimraf(temp);

  console.log('... Done ...');
};

try {
  run();
} catch(e) {
  console.error('Error:');
  console.error(e);
}
