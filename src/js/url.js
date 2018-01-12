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


export {extract_slug};


const EXTRACT_SLUG_REGEX = /(?:(?:(?:http(?:s)?:)?\/\/)?github\.com\/)?([^\/]+)\/([^\/]+).*/i;


/// Get repository slug information from the supplied string – something a user might paste in.
///
/// Arguments: `data`: `string` – wherein the repository slug is contained
///
/// Returns: `object` – `{name, repo}`, where both `name` and `repo` are the respective parts of the repository slug or `null`, if not found.
function extract_slug(data) {
	let sought = EXTRACT_SLUG_REGEX.exec(data) || [];
	sought.shift();  // Drop whole string

	return {
		name: sought[0] || null,
		repo: sought[1] || null,
	};
}

// TODO: add tests
