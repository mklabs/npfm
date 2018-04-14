const path = require('path');
const File = require('vinyl');
const through = require('through2');
const lead = require('lead');

const vfs = require('vinyl-fs');
const eyes = require('eyes');
const tothrough = require('to-through');
const pumpify = require('pumpify');
const gs = require('glob-stream');
const createResolver = require('resolve-options');
const mkdirpStream = require('fs-mkdirp-stream');

const srcReadContents = require('vinyl-fs/lib/src/read-contents')
const readContents = require('./read-contents')
const writeContents = require('./write-contents')
const prepareDest = require('./prepare-dest');

const wrap = () => {
  return through.obj((globfile, enc, callback) => {
    var file = new File(globfile);
    callback(null, file);
  });
};


const config = {
  buffer: {
    type: 'boolean',
    default: true,
  },
  read: {
    type: 'boolean',
    default: true,
  },
  since: {
    type: 'date',
  },
  removeBOM: {
    type: 'boolean',
    default: true,
  },
  sourcemaps: {
    type: 'boolean',
    default: false,
  },
  resolveSymlinks: {
    type: 'boolean',
    default: true,
  },
};

module.exports = {
  src: (glob, options) => {
    options = options || {};
    const optResolver = createResolver(config.src, options);

    var stream = pumpify.obj([
      gs(glob, options),
      wrap(optResolver),
      srcReadContents(optResolver)
    ]);

    return tothrough(stream);
  },

  dest: (output, options) => {
    var folderResolver = createResolver(config.folder, { output });

    var saveStream = pumpify.obj(
      prepareDest({ output }),
      // mkdirpStream.obj(path.dirname(output)),
      readContents({ output }),
      writeContents({ output })
    );

    // Sink the output stream to start flowing
    return lead(saveStream);
  }
};
