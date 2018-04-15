# npfm

Modding tools, CLI and vinyl adapter to generate CA modding pack for Total War
Warhammer II.

[![Build Status](https://travis-ci.org/mklabs/npfm.svg?branch=npfm)](https://travis-ci.org/mklabs/twmods)

## Installation

    # CLI installed globally
    npm install npfm -g

    # as a lib
    npm install npfm

## Usage

```js
const pack = require('npfm');
pack.src('./working_data/**/*').pipe(pack.dest('data/retail.mod.pack'));
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
