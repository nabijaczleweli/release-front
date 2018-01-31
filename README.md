# [release-front](https://releases.nabijaczleweli.xyz) [![Build Status](https://travis-ci.org/nabijaczleweli/release-front.svg?branch=master)](https://travis-ci.org/nabijaczleweli/release-front) [![Licence](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
A generic front-end to the GitHub releases system, akin to [the Patchwork one](http://dinosaur.is/patchwork-downloader).

## [Live](https://releases.nabijaczleweli.xyz)

## Usage

### Quickstart

If you just want to check it out, see [this live version](https://releases.nabijaczleweli.xyz), always up-to-date with `master`.
Alternatively, use Rawgit to see any older version under `https://cdn.rawgit.com/nabijaczleweli/release-front/<COMMIT HASH>/index.html`.

To display a release for a specific repo query the repo slug in the form of `?owner/repo` or put the slug/GitHub URL to somewhere within the repo in the input box.

### Overview

The contents of the project release page itself depend on the contents of the repo and the latest tag.

If the repo contains no tags, an error is presented.

If the repo at the latest tag contains a logo image in a [Findable Spot™](#logo-search-paths), it's displayed at the top-center,
	otherwise, a heading with just the repo name is used.

The local system is guessed from the browser's user agent and divided into three categories: Windows, Mac, and Linux,
	where Linux is equivalent to "not Windows and not Mac".

The release's assets are ranked according to their names, the most significant is the extension – "exe" for Windows, "dmg" for Mac, and "out"/none for Linux.
For ranking details, see the [documentation of `assets::rank_assets()`](src/js/assets.js).

TODO: explicit "config" file

### Details

#### Logo search paths

First found file named any of: "logo", "icon" under: the repository root, "assets" folder extended with any of: "png", "jpg".<br />
Or, if you want to be very pedantic: first hit in `["", "assets/"]`×`["logo", "icon"]`×`[".png", ".jpg"]`.

### Self-hosting

Just copy the contents of the `gh-pages` branch or build the page yourself and slam it (the branch, or the contents of the `out` folder)
	in any static server under any access path and it should Just Work.
