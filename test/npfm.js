
const fs = require('fs')
const path = require('path');
const assert = require('assert');

describe('npfm', () => {

  before(() => {
    // for now, generated with npm run pretest
    console.log('Generate pack here with the API');
  });

  it('Generates identical .pack files', () => {
    const testPack = fs.readFileSync(path.join(__dirname, '../test.pack'));
    const pfmPack = fs.readFileSync(path.join(__dirname, '../t.pack'));
    assert.equal(Buffer.compare(testPack, pfmPack), 0, 'Packs are the same!');
  });
});
