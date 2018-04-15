process.env.DEBUG = process.env.DEBUG || 'vinyl*'

// const pack = require('npfm');
const pack = require('./');
pack.src('./working_data/**/*').pipe(pack.dest('mod.pack'));
