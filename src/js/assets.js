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


const PACK_EXTENSIONS = [".tar", ".tgz", ".tgz2", ".tbz2", ".xz", ".zip"];

const WINDOWS_REGEXES = [/\.exe$/];
const LINUX_REGEXES   = [/\.out$/, /^[^.]+$/];
const MAC_REGEXES     = [/\.dmg$/];

const MANUAL_REGEX        = /man/i;
const DOCUMENTATION_REGEX = /doc/i;

const PLATFORMS_REGEXES             = {};
PLATFORMS_REGEXES[Platform.Windows] = WINDOWS_REGEXES;
PLATFORMS_REGEXES[Platform.Linux]   = LINUX_REGEXES;
PLATFORMS_REGEXES[Platform.Mac]     = MAC_REGEXES;


/// Rank the specified assets according to their suitability for the specified platform and project.
///
/// If an asset matches one of the excutable regexes for the platform, it's granted 2 points.
///
/// If an asset contains the name of the platform, it's granted 1 point.
///
/// If an asset matches the manual regex and the project name does not, it's substracted 1 point.
///
/// If an asset matches the documentation regex and the project name does not, it's substracted 1 point.
///
/// Arguments:
///   * `project_name`: `string` – the name of the project w/o the owner,
///   * `tag_name`: `string` – the name of the current tag,
///   * `assets`: `[object]` – array of assets acquired from the GitHub API,
///   * `platform`: `∈ Platform` – the platform to rank for.
///
/// Returns: `[object]`: `{score, data}` where score is the rank, higher the better, and data is the original asset object.
export function rank_assets(project_name, tag_name, assets, platform) {
	if(Platform.all.indexOf(platform) !== -1 && Array.isArray(assets) && tag_name && project_name) {
		let project_man         = MANUAL_REGEX.test(project_name);
		let project_doc         = DOCUMENTATION_REGEX.test(project_name);
		let platform_name       = Platform.name(platform);
		let platform_name_regex = new RegExp(platform_name, "i");

		return assets.map(data => {
			let data_name_reduced = data.name;
			for(let ext = ""; ext !== undefined; ext = PACK_EXTENSIONS.find(_ => data_name_reduced.endsWith(_)))
				data_name_reduced = data_name_reduced.substr(0, data_name_reduced.length - ext.length);
			data_name_reduced = data_name_reduced.replace(tag_name, "");
			if(tag_name.startsWith("v"))
				data_name_reduced = data_name_reduced.replace(tag_name.substr(1), "");

			let score = 0;

			if(PLATFORMS_REGEXES[platform].some(_ => _.test(data_name_reduced)))
				score += 2;

			if(platform_name_regex.test(data_name_reduced))
				score += 1;

			if(!project_man && MANUAL_REGEX.test(data_name_reduced))
				score -= 1;

			if(!project_doc && DOCUMENTATION_REGEX.test(data_name_reduced))
				score -= 1;

			return {score, data};
		});
	} else
		return [];
}
