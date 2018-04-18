# User guide

This guide is based off [Steam Workshop General User Guide for Shogun
2](http://wiki.totalwar.com/w/Steam_Workshop_General_Usage_Guide_(TWS2))

## Contents

1 Disclaimer
2 Introduction
3 User Created Maps Process
3.1 About editing files
3.2 Creating a map in TEd
3.3 Additional Images
3.4 Map Information
3.4.1 Historical Battles
3.4.2 Multiplayer Battles
3.5 Adding your map to the Steam Workshop
3.6 Updating your map on the Steam Workshop
3.7 Subscribing to other maps
4 Assembly Kit Process
4.1 modding.zip
4.2 TWeak
4.2.1 DaVE
4.2.2 Unit Editor
4.2.3 BOB
4.3 mod.pack
4.4 Mod Manager

# Introduction

This document will outline the process from start to finish, point you in the
right direction for mod creation and lua scripting, as well as the whole
process and workflow for creating a mod with the Assembly Kit and npfm.

## About editing files

Many of the files that make up a scripted battle are text-editable, such as XML
and lua script files. It is recommended to get a feature-rich text editor such
as Notepad++, SublimeText, VSCode or Atom.

## Creating a map in Terry

If you’re interested in using the new tool Terry to create map, check out the following documentation:

- http://wiki.totalwar.com/w/Total_War_WARHAMMER_Assembly_Kit_Terry
- http://wiki.totalwar.com/w/TWW_Assembly_Kit_Terry_Quest_Battle

## Assembly Kit Process

**NOTE** Changing any data that is read by the game could cause the game to
crash. It is your responsibility to make sure that any data you change causes
the game to work correctly!

It is advised before doing any change to backup your `raw_data/` and
`working_data/`. To do so, the simplest way is to probably zip it to a
`backup/` folder, and archive them. This way, you'll get several backup points
you can use whenever you get an unstable state, or would like to create new
mods or work on several mods at a time.

> todo: add command to backup raw/working data. use git to track changes in an
> internal bare repository.

### Getting the Assembly Kit

The first step in order to create your very own mod is to launch Steam,
navigate to the TOOLS section in your games library and launch Total War:
Warhammer 2 – Assembly Kit BETA.

The Assembly Kit will usually be installed usually in the `C:\Program Files
(x86)\Steam\steamapps\common\Total War WARHAMMER II\assembly_kit` folder.

Inside this folder you will find some sub-folders:

- binaries
- raw_data
- working_data

> todo complete the workflow description
