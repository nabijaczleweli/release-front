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

### Configuration

If you distribute your assets with a non-obvious naming scheme or your logo is in a non-["standard"](#logo-search-paths) place,
	you may wish to use an explicit configuration file to specify them for use with release-front.

To do so, create a file named "release-front.json" on the branch with content in the following format:

|     Property name     | Property type | Required? | Description |
|-----------------------|---------------|-----------|-------------|
|   `logo`/`logo_url`   |    `string`   |     No    | Either custom subpath to the logo (e.g. `"images/logo.jpeg2000"`), or a URL to one (e.g. `"//dinosaur.is/patchwork-downloader/images/invite-letterhead.jpg"`). Defaults to [the normal search](#logo-search-paths). |
| `assets`/`asset_spec` |    `object`   |     No    | If present, overrides default asset ranking. The object keys are, case-insensitive, all optional, any of `"Windows"`, `"Mac"`, `"Linux"` – values are [templated strings](#configuration-asset-names-templates) resolving to the names of the assets (e.g. `"cargo-install-update-${TAG_NAME}.exe"`). If a key for a platform is missing, or the value `null`, it is treated as if there were no assets for that platform. |

For example:

```json
{
	// This will use the specified path within the repo at the tag.
	"logo": "theobromines/images/big/1241.JPG",

	"asset_spec": {
		"Windows": "chemlab-3k-${TAG_NAME}.exe",   // e.g. for the tag "v0.3.1", this'd yield "chemlab-3k-v0.3.1.exe"
		"mac": null,                               // Might as well've been omitted.
		"LINUX": "chemlab3k_${TAG_NAME_REDUCED}",  // e.g. for the tag "v0.3.1", this'd yield "chemlab3k_0.3.1"
	}
}
```

### Details

#### Logo search paths

First found file named any of: "logo", "icon" under: the repository root, "assets" folder extended with any of: "png", "jpg".<br />
Or, if you want to be very pedantic: first hit in `["", "assets/"]`×`["logo", "icon"]`×`[".png", ".jpg"]`.

#### Configuration asset names' templates

All templates take the form of `"${TEMPNAME}"`, where `TEMPNAME` is one of the following:

|         Name         | Description |
|----------------------|-------------|
|     `"TAG_NAME"`     | Raw name of the release's tag (e.g. `"v0.3.1"`). |
| `"TAG_NAME_REDUCED"` | Name of the release's tag stripped mostly to just the numbers (IOW the front `'v'` is removed, if any; PRs/issues welcome) (e.g. `"0.3.1"` if the tag is `"v0.3.1"`). |

### Self-hosting

Just copy the contents of the `gh-pages` branch or build the page yourself and slam it (the branch, or the contents of the `out` folder)
	in any static server under any access path and it should Just Work.
