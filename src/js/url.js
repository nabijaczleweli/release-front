// The MIT License (MIT)
//
// Copyright (c) 2018 nabijaczleweli
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


import {Platform} from "./platform-detect";
import {cartesian, string_or} from "./util";


const EXTRACT_SLUG_REGEX = /^(?:(?:(?:(?:(?:http(?:s)?:)?\/\/)?github\.com\/)?)|\?)([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+).*/i;
const GITHUB_API_ACCEPT  = "application/vnd.github.v3+json";

// Remember to update in README.md
const LOGO_SEARCH_PATHS = ["", "assets/"];
const LOGO_SEARCH_NAMES = ["logo", "icon"];
const LOGO_EXTENSIONS   = ["png", "jpg"];


/// Get repository slug information from the supplied string – something a user might paste in, or an unfiltered query string.
///
/// Arguments: `data`: `string` – wherein the repository slug is contained.
///
/// Returns: `object` – `{name, repo}: {string?, string?}`, where both `name` and `repo` are the respective parts of the repository slug or `null`, if not
/// found.
export function extract_slug(data) {
	let sought = EXTRACT_SLUG_REGEX.exec(data) || [];
	sought.shift();  // Drop whole string

	return {
		name: sought[0] || null,
		repo: sought[1] || null,
	};
}

/// Get repository slug string from the respective object,
///
/// Arguments: `object` – `{name, repo}: {string, string}`, where both `name` and `repo` are the respective parts of the repository slug.
///
/// Returns: `string?`, representing the normalised form of the repo slug, or `null`, if supplied object was invalid.
export function full_name(slug) {
	if(slug && slug.name && slug.repo)
		return `${slug.name}/${slug.repo}`;
	else
		return null;
}

/// Acquire the latest release data from the specified repository.
///
/// Arguments:
///   * `slug` – `object` – `{name, repo}: {string, string}`, where both `name` and `repo` are the respective parts of the requested repository slug.
///   * `callback` – `function(status: number, response: object)` –
///                   function to call when the request is finished, where `status` is the response status (`200`/`404`/etc.),
///                   and `response` is an object in the format returned by the
///                   [GitHub API v3](https://developer.github.com/v3/repos/releases/#get-the-latest-release).
///
/// Returns: `boolean`, representing whether the request was made.
export function latest_release(slug, callback) {
	if(callback && slug && slug.name && slug.repo) {
		let url = `//api.github.com/repos/${slug.name}/${slug.repo}/releases/latest`;

		let request = new XMLHttpRequest();
		request.open("GET", url);
		// Using User-Agent from browsers doesn't work apparently :v
		// request.setRequestHeader("User-Agent", `release-front/RELEASE_FRONT_VERSION_STR`);
		request.setRequestHeader("Accept", GITHUB_API_ACCEPT);
		request.overrideMimeType("application/json");

		request.addEventListener("readystatechange", () => {
			if(request.readyState === XMLHttpRequest.DONE) {
				// FF doesn't seem to auto-decode JSON
				let response = typeof request.response === "string" ? JSON.parse(request.response) : request.response;
				callback(request.status, response);
			}
		});
		request.send();

		return true;
	} else
		return false;
}

/// Search for a logo file in the repository under the specified commitish.
///
/// Arguments:
///   * `slug` – `object` – `{name, repo}: {string, string}`, where both `name` and `repo` are the respective parts of the requested repository slug.
///   * `commitish` – `string` – tag/commit/branch to look in.
///   * `callback` – `function(url: string?)` –
///                   function called
///                   (a) with the logo url when either a logo was found or
///                   (b) with `null` when all search paths errored.
///
/// Returns: `boolean`, representing whether the requests were made.
export function find_logo(slug, commitish, callback) {
	if(callback && commitish && slug && slug.name && slug.repo) {
		let url_base = `//cdn.rawgit.com/${slug.name}/${slug.repo}/${commitish}`;

		let logo_options  = cartesian(LOGO_SEARCH_PATHS, LOGO_SEARCH_NAMES, LOGO_EXTENSIONS);
		let requests_left = logo_options.length;

		let requests = logo_options.map(([path, name, extension]) => {
			let url     = `${url_base}/${path}${name}.${extension}`;
      let request = new XMLHttpRequest();
			request.open("GET", url);
			// Using User-Agent from browsers doesn't work apparently :v
			// request.setRequestHeader("User-Agent", `release-front/RELEASE_FRONT_VERSION_STR`);

			let aborted = false;
			request.addEventListener("readystatechange", () => {
				if(!aborted && requests_left !== 0 && request.readyState >= XMLHttpRequest.HEADERS_RECEIVED) {
					aborted = true;  // do this ASAP

					let status = request.status | 0;  // | 0 to make a copy

					request.abort();
					--requests_left;

					if(status >= 200 && status < 300) {
						requests_left = -1;  // Don't allow any other threads to trigger `null` case
						requests.forEach(_ => _.abort());
						callback(url);
					} else if(requests_left === 0)
						callback(null);
				}
			});
			request.send();

			return request;
		});

		return true;
	} else
		return false;
}

/// Get and deconstruct the repo's configuration, if any.
///
/// Arguments:
///   * `slug` – `object` – `{name, repo}: {string, string}`, where both `name` and `repo` are the respective parts of the requested repository slug.
///   * `commitish` – `string` – tag/commit/branch to look in.
///   * `callback` – `function(logo_url: string?, asset_spec: object?, platform_name_override: string?)`, `asset_spec: {[platform name: template string]}` –
///                   function called when request is complete.
///                   If the request returns an error both arguments are `null`.
///                   Otherwise, the appropriate entries in the config file are parsed and passed accordingly (if existant).
///
/// Returns: `boolean`, representing whether the request was made.
export function get_config(slug, commitish, callback) {
	if(callback && commitish && slug && slug.name && slug.repo) {
		let url     = `//cdn.rawgit.com/${slug.name}/${slug.repo}/${commitish}/release-front.json`;
    let request = new XMLHttpRequest();
		request.open("GET", url);
		// Using User-Agent from browsers doesn't work apparently :v
		// request.setRequestHeader("User-Agent", `release-front/RELEASE_FRONT_VERSION_STR`);

		request.addEventListener("readystatechange", () => {
			if(request.readyState === XMLHttpRequest.DONE) {
				if(request.status >= 200 && request.status < 300) {
					// FF doesn't seem to auto-decode JSON
					let response = typeof request.response === "string" ? JSON.parse(request.response) : request.response;
					if(typeof response === "object") {
						let logo_url = response.logo || response.logo_url;
						if(typeof logo_url === "string" && logo_url.length !== 0) {
							if(logo_url.indexOf("//") === -1)
								logo_url = `//cdn.rawgit.com/${slug.name}/${slug.repo}/${commitish}/${logo_url}`;
						} else
							logo_url = null;

						let platform_name_override = null;
						let asset_spec             = null;
						let universal              = response.universal;
						if(universal === true)
							platform_name_override = "universal";
						else if(typeof universal === "object" && universal !== null) {
							platform_name_override = string_or(universal.name, universal.platform, universal.pseudo_platform)

							    let ass = universal.asset || universal.asset_spec;
							if(typeof ass === "string" && ass.length !== 0) {
								asset_spec = {};
								for(let pname of Platform.keys)
									asset_spec[pname] = ass;
							}
						}

						if(asset_spec === null) {
							asset_spec = response.assets || response.asset_spec || null;
							if(typeof asset_spec === "object" && asset_spec !== null)  // Because null is an object, obviously
								for(let key in asset_spec)
									if(typeof asset_spec[key] === "string" && asset_spec[key].length !== 0) {
										let key_lcase = key.toLowerCase();
										if(key !== key_lcase) {
											asset_spec[key_lcase] = asset_spec[key];
											delete asset_spec[key];
										}
									} else if(asset_spec[key] !== null)
										delete asset_spec[key];
									else
										asset_spec = null;
						}

						callback(logo_url, asset_spec, platform_name_override);
						return;
					}
				}

				callback(null, null, null);
			}
		});

		request.send();

		return true;
	} else
		return false;
}
