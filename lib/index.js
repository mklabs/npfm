const fs              = require('graceful-fs');
const path            = require('path');
const File            = require('vinyl');
const gs              = require('glob-stream');
const vfs             = require('vinyl-fs');
const srcReadContents = require('vinyl-fs/lib/src/read-contents')
const lead            = require('lead');
const through         = require('through2');
const tothrough       = require('to-through');
const pumpify         = require('pumpify');
const mkdirpStream    = require('fs-mkdirp-stream');
const readContents    = require('./read-contents')
const writeContents   = require('./write-contents')
const writePack       = require('./write-pack')
const savePack        = require('./save-pack')
const prepareDest     = require('./prepare-dest');
const packer          = require('./packer');

const wrap = () => {
  return through.obj((globfile, enc, done) => {
    fs.stat(globfile.path, (err, stat) => {
      if (err) return done(err);
      var file = new File({
        stat,
        ...globfile
      });

      done(null, file);
    });
  });
};

module.exports = {
  src: (glob, options) => {
    options = options || {};
    var stream = pumpify.obj([
      gs(glob, options),
      wrap(),
      srcReadContents({
        resolve(key) {
          const config = {
            read: {
              type: 'boolean',
              default: true,
            }
          };

          const conf = config[key];
          if (!conf) return;

          if (typeof(conf) !== conf.type) return conf.default;
          return conf;
        }
      })
    ]);

    return tothrough(stream);
  },

  dest: (output, options) => {
    const pack = packer({
      output,
      ...options
    });

    var saveStream = pumpify.obj(
      prepareDest({ output }),
      readContents({ output }),
      // writeContents({ output }),
      writePack({ output, pack }),
      savePack({ output, pack })
    );

    return lead(saveStream);
  }
};
