# npfm

Modding toolbox for Total War Warhammer II.


[![Build Status](https://travis-ci.org/mklabs/npfm.svg?branch=master)](https://travis-ci.org/mklabs/npfm)

## Installation

    # CLI installed globally
    npm install npfm -g

    # as a lib
    npm install npfm

## Description

This package aims to provide a companion CLI app to the [Assembly
Kit](http://wiki.totalwar.com/w/Official_CA_modding_tips_and_tutorials) for
Warhammer II.

## Documentation

- [General User Guide](./docs)

### CLI

```
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
