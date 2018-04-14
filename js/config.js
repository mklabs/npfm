const config = module.exports = {}

config.src = {
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

config.dest = {
  cwd: {
    type: 'string',
    default: process.cwd,
  },
  mode: {
    type: 'number',
    default: function(file) {
      return file.stat ? file.stat.mode : null;
    },
  },
  dirMode: {
    type: 'number',
  },
  overwrite: {
    type: 'boolean',
    default: true,
  },
  append: {
    type: 'boolean',
    default: false,
  },
  sourcemaps: {
    type: ['string', 'boolean'],
    default: false,
  },
  // Symlink options
  relativeSymlinks: {
    type: 'boolean',
    default: false,
  },
  // This option is ignored on non-Windows platforms
  useJunctions: {
    type: 'boolean',
    default: true,
  },
};

config.folder = {
  output: (file) => typeof file === 'string'
};
