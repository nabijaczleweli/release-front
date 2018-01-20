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


import {is_windows as platform_is_windows, Platform} from "./platform-detect";
import {extract_slug, full_name, latest_release} from "./url";


window.addEventListener("load", () => {
	const DOWNLOAD_BUTTON = document.getElementsByClassName("main-button");

	const REPO_NAME_CONTAINERS   = document.getElementsByClassName("main-repo-name");
	const LATEST_LINK_CONTAINERS = document.getElementsByClassName("main-latest-link");
	const VERSION_CONTAINERS     = document.getElementsByClassName("main-version");
	const PLATFORM_CONTAINERS    = document.getElementsByClassName("main-platform");

	let slug = extract_slug(window.location.search);

	let platform = Platform.from_platform();
	Array.from(PLATFORM_CONTAINERS).forEach(_ => _.innerText = Platform.name(platform));

	let slug_name = full_name(slug);
	if(slug_name)
		Array.from(REPO_NAME_CONTAINERS).forEach(_ => _.innerText = slug_name);

	latest_release(slug, (status, release) => {
		if(status < 200 || status >= 300)
			// TODO: what do here?
			return;

		if(release.html_url)
			Array.from(LATEST_LINK_CONTAINERS).forEach(_ => _.href = release.html_url);

		if(release.tag_name)
			Array.from(VERSION_CONTAINERS).forEach(_ => _.innerText = release.tag_name);

		console.log(release.assets);
		console.log("platform_is_windows", platform_is_windows());
	});
});
