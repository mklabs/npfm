const debug = require('debug')('npfm:pfm')
const path = require('path');
const { pfm } = require('../pfm');

const action = module.exports = async(options) => {
  const argv = process.argv.slice(3);
  const args = argv.length ? `${argv.join(' ')}`.split(' ') : [];
  const { exe } = pfm;
  return await pfm({ exe, args });
};
