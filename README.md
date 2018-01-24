# [release-front](https://releases.nabijaczleweli.xyz) [![Build Status](https://travis-ci.org/nabijaczleweli/release-front.svg?branch=master)](https://travis-ci.org/nabijaczleweli/release-front) [![Licence](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
A generic front-end to the GitHub releases system, akin to [the Patchwork one](http://dinosaur.is/patchwork-downloader).

## [Live](https://releases.nabijaczleweli.xyz)

## Usage

### Quickstart

If you just want to check it out, see [this live version](https://releases.nabijaczleweli.xyz), always up-to-date with `master`.
Alternatively, use Rawgit to see any older version under `https://cdn.rawgit.com/nabijaczleweli/release-front/<COMMIT HASH>/index.html`.

To display a release for a specific repo query the repo slug in the form of `?owner/repo` or put the slug in the input box.
(TODO: can I do that/does that work?)

### Overview

The contents of the project release page itself depend on the contents of the repo and the latest tag.

If the repo contains no tags, the latest commit to the default branch is used instead.

If the repo at the latest tag contains a logo image in a Findable Spot (TODO: concretify where we look), it's displayed at the top-center,
	otherwise, only a heading with the repo name is used.

// TODO: concretify detexion of system, system-specific (or not) release binaries, etc

### Self-hosting

Just copy the contents of the `gh-pages` branch or build the page yourself and slam it (the branch, or the contents of the `out` folder)
	in any static server under any access path and it should Just Work.
