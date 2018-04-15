# npfm

node experiments around [PFM](https://sourceforge.net/projects/packfilemanager/) modding tool.

[![Build Status](https://travis-ci.org/mklabs/twmods.svg?branch=npfm)](https://travis-ci.org/mklabs/twmods)

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

TODO
