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


import {rank_assets} from "./assets";
import {Platform} from "./platform-detect";
import {extract_slug, find_logo, full_name, latest_release} from "./url";


window.addEventListener("load", () => {
	const DOWNLOAD_BUTTON = document.getElementById("main-button");
	const LOGO            = document.getElementById("main-logo");
	const REPO_LINE       = document.getElementById("main-repo-line");
	const LATEST_LINE     = document.getElementById("main-latest-line");
	const HEADING_LINK    = document.getElementById("main-heading-link");

	const REPO_NAME_CONTAINERS   = document.getElementsByClassName("main-repo-name");
	const LATEST_LINK_CONTAINERS = document.getElementsByClassName("main-latest-link");
	const VERSION_CONTAINERS     = document.getElementsByClassName("main-version");
	const PLATFORM_CONTAINERS    = document.getElementsByClassName("main-platform");

	let slug = extract_slug(window.location.search);

	let platform = Platform.from_platform();
	Array.from(PLATFORM_CONTAINERS).forEach(_ => _.innerText = Platform.name(platform));

	let slug_name = full_name(slug);
	if(slug_name) {
		HEADING_LINK.href = `//github.com/${slug_name}`;
		Array.from(REPO_NAME_CONTAINERS).forEach(_ => _.innerText = slug_name);
	}

	latest_release(slug, (status, release) => {
		if(status < 200 || status >= 300) {
			REPO_LINE.classList.add("hidden");
			LATEST_LINE.classList.add("hidden");
			DOWNLOAD_BUTTON.classList.add("error");
			DOWNLOAD_BUTTON.innerText = "No releases found";
			DOWNLOAD_BUTTON.addEventListener("click", () => window.location.search = "");
			return;
		}

		if(release.html_url)
			Array.from(LATEST_LINK_CONTAINERS).forEach(_ => _.href = release.html_url);

		if(release.tag_name) {
			Array.from(VERSION_CONTAINERS).forEach(_ => _.innerText = release.tag_name);
			find_logo(slug, release.tag_name, logo_url => {
				if(logo_url) {
					LOGO.src   = logo_url;
					LOGO.alt   = `${slug_name} logo`;
					LOGO.title = LOGO.alt;
					LOGO.classList.remove("hidden");
				}
			});

			let ranked_assets = rank_assets(slug.repo, release.tag_name, release.assets, platform);
			ranked_assets.sort((lhs, rhs) => rhs.score - lhs.score);  // biggest-to-smallest => [0] has best asset
			if(ranked_assets.length === 0) {
				DOWNLOAD_BUTTON.innerText = "No assets found";
				DOWNLOAD_BUTTON.href      = release.html_url;
			} else
				DOWNLOAD_BUTTON.href = ranked_assets[0].data.browser_download_url;
		}
	});
});
