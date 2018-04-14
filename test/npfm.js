
const fs = require('fs')
const path = require('path');
const assert = require('assert');

describe('npfm', () => {

  before(() => {
    // for now, generated with npm run pretest
    console.log('Generate pack here with the API');
  });

  it('Generates identical .pack files', () => {
    const npfmPack = fs.readFileSync(path.join(__dirname, '../data/retail/npfm.pack'));
    const pfmPack = fs.readFileSync(path.join(__dirname, '../data/retail/pfm.pack'));
    assert.equal(Buffer.compare(npfmPack, pfmPack), 0, 'Packs are the same!');
  });
});
