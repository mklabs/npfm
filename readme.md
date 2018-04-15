# npfm

Modding tools, CLI and vinyl adapter to generate CA modding pack for Total War
Warhammer II.

[![Build Status](https://travis-ci.org/mklabs/npfm.svg?branch=master)](https://travis-ci.org/mklabs/npfm)

## Installation

    # CLI installed globally
    npm install npfm -g

    # as a lib
    npm install npfm

## Usage

```js
const path = require('path');
const packer = require('npfm/lib/packer');
const output = 'foo.pack';
const pattern = '**/*';

(async () => {
  const pack = await packer.create({ output, pattern, cwd: path.resolve('working_data') });
  debug('Pack created at %s', pack.output);
})();
```

Note: Only works with raw files such as script and assets (images, text file
etc.). Other binary files expected by PFM (like DB tables) needs to be
converted from XML to binary format first (or use bob / pfm's output).

### CLI

```
npfm v1.0.2 - https://mklabs.github.io/npfm

Usage: npfm [command] [options]

Example:
      npfm [watch|serve|init] [options]

Commands
  create      - run a given create template
  init        - run the init template
  serve       - start a development server with watch mode enabled
  pack        - generate a pack file

Options
  -h, --help
```

Create a mod pack from a given directory tree structure with `npfm pack`.

```
Usage: npfm pack [destination] [options]

Options:
  -s, --src     Source files (default: working_data/**/*)

Example:
  npfm pack --src "src/script/**/*" data/retail/mod.pack
```

### Credits

Huge thanks to [PackFileManager authors and
maintainers](https://sourceforge.net/projects/packfilemanager/). I just ported
the main save function from PackFileCode class into a nodejs library. All the
heavy lifting of putting exact bytes at the correct position have been done
by PFM developpers.
