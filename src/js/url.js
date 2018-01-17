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


export {extract_slug, full_name, latest_release};


const EXTRACT_SLUG_REGEX = /^(?:(?:(?:(?:(?:http(?:s)?:)?\/\/)?github\.com\/)?)|\?)([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+).*/i;
const GITHUB_API_ACCEPT  = "application/vnd.github.v3+json";


/// Get repository slug information from the supplied string – something a user might paste in, or an unfiltered query string.
///
/// Arguments: `data`: `string` – wherein the repository slug is contained.
///
/// Returns: `object` – `{name, repo}: {string?, string?}`, where both `name` and `repo` are the respective parts of the repository slug or `null`, if not
/// found.
function extract_slug(data) {
	let sought = EXTRACT_SLUG_REGEX.exec(data) || [];
	sought.shift();  // Drop whole string

	return {
		name: sought[0] || null,
		repo: sought[1] || null,
	};
}

/// Get repository slug string from the respective object,
///
/// Arguments: `object` – `{name, repo}: {string?, string?}`, where both `name` and `repo` are the respective parts of the repository slug.
///
/// Returns: `string?`, representing the normalised form of the repo slug, or `null`, if supplied object was invalid.
function full_name(slug) {
	if(slug.name && slug.repo)
		return `${slug.name}/${slug.repo}`;
	else
		return null;
}

/// Get repository slug string from the respective object,
///
/// Arguments: `object` – `{name, repo}: {string?, string?}`, where both `name` and `repo` are the respective parts of the repository slug.
///
/// Returns: `string?`, representing the normalised form of the repo slug, or `null`, if supplied object was invalid.
function latest_release(slug, callback) {
	if(callback && slug.name && slug.repo) {
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


// TODO: tests for bottom two f()s
