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

### CLI

TODO
