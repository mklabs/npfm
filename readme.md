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

It enables a workflow where most of your edits are done through Dave and your
text editors. Whenever a file changes, npfm will trigger an update in your
mod.pack

It acts as a bridge between the Assembly Kit and PackFileManager executable. It
does so thanks to `pfm.exe` found in PackFileManager, which is a little CLI to
manipulate mod packs.

You don't need to manually download PackFileManager, and won't interfere with
the one you might already have installed. On install, this package will
automatically download the latest PFM version, and put it in the `.pfm` folder.

**workflow**

```
With bob: Assembly Kit (Dave) => Export changes to binaries => bob => retail/data/mod.pack
With npfm: Assembly Kit (Dave) => Export changes to binaries => npfm => npfm_generated_mod.pack
```

npfm can effectively be use to feed PFM with the `working_data/` directory
structure and generate a pack out of it.

[![npfm pack](https://img.youtube.com/vi/Ri2dZ0XNpDo/0.jpg)](https://www.youtube.com/watch?v=Ri2dZ0XNpDo)

## Documentation

- [General User Guide (wip)](./docs)

### CLI

```
Usage: npfm [command] [options]

Example:
      npfm [watch|serve|init] [options]
      npfm [install|watch|serve|init] [options]

Commands
  init        - run the init template
  create      - run a given create template
  serve       - start a development server with watch mode enabled
  pack        - generate a pack file
  pfm         - forwards the arguments and options to pfm executable
  watch       - watch files for file changes using npm-watch

Options
  -h, --help
```

Create a mod pack from a given directory tree structure with `npfm pack`.

```
Usage: npfm pack [destination] [options]

Options:
  -s, --src     Source files (default: **/*)
  --glob[s]     Alias for src
  --cwd         Working directory (default: ./working_data)

Example:
  # next to your working_data/ directory
  npfm pack --glob "**/*" data/retail/mod.pack

  # if not, or if your files live in another directory structure
  npfm pack --glob "script/**/*" --cwd "src/awesome_mod/"  retail/data/awesome_mod.pack
```

The `src` and `cwd` can be changed to generate the proper directory structure within the mod.

## .npfmignore file

Similar to `.gitignore` or `.npmignore` files, you can setup a list of pattern
you'd like to exclude from the produced mod.pack.

To do so, create a `.npfmignore` file in the current working directory:

```
BattleTerrain/**/*
EditorBrushes/**/*
RigidModels/**/*
Terry/**/*
Weather/**/*
campaigns/**/*
rules.bob
```

These globs patterns have to be relative to the provided `--cwd` option.

## Starter Kit

> TODO create template to init a new project

### Credits

Huge thanks to [PackFileManager authors and
maintainers](https://sourceforge.net/projects/packfilemanager/).

All the heavy lifting of putting exact bytes at the correct position have been
done by PFM developpers.
