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
import {replace_all} from "./string";


const PACK_EXTENSIONS = [".tar", ".tgz", ".tgz2", ".tbz2", ".xz", ".zip"];

// Remember to update in README.md
const WINDOWS_REGEXES = [/\.exe$/];
const LINUX_REGEXES   = [/\.out$/, /^[^.]+$/];
const MAC_REGEXES     = [/\.dmg$/];

const MANUAL_REGEX        = /man/i;
const DOCUMENTATION_REGEX = /doc/i;

const PLATFORMS_REGEXES             = {};
PLATFORMS_REGEXES[Platform.Windows] = WINDOWS_REGEXES;
PLATFORMS_REGEXES[Platform.Linux]   = LINUX_REGEXES;
PLATFORMS_REGEXES[Platform.Mac]     = MAC_REGEXES;

const PLATFORM_NAME_REGEXES = Platform.all.map(_ => new RegExp(Platform.name(_), "i"));


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
			data_name_reduced = replace_all(data_name_reduced, tag_name, "");
			if(tag_name.startsWith("v"))
				data_name_reduced = replace_all(data_name_reduced, tag_name.substr(1), "");

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

/// Check whether the specified `asset_spec` config subobject specifies an asset for the specified platform
///
/// Arguments:
///   * `config_asset_spec`: `object` – contains platform asset specifiers,
///   * `platform`: `∈ Platform` – the platform to rank for.
///
/// Returns: `boolean` – whether the specified spec defines what asset to use on the specified platform.
export function specifies_assets_for(config_asset_spec, platform) {
	if(Platform.all.indexOf(platform) !== -1 && typeof config_asset_spec === "object" && config_asset_spec !== null)
		return Object.keys(config_asset_spec).some(_ => PLATFORM_NAME_REGEXES[platform].test(_) && config_asset_spec[_] !== null);
	else
		return false;
}

/// Check whether the specified `asset_spec` config subobject specifies an asset for the specified platform
///
/// The filenames in `config_asset_spec` are templatable:
///   * all instances of `"${TAG_NAME}"` are replaced with `tag_name`,
///   * all instances of `"${TAG_NAME_REDUCED}"` are replaced with `tag_name` with `'v'` stripped off the front (if any).
///
/// Arguments:
///   * `config_asset_spec`: `object` – contains platform asset specifiers,
///   * `platform`: `∈ Platform` – the platform to rank for.
///   * `assets`: `[object]` – array of assets acquired from the GitHub API,
///   * `tag_name`: `string` – the name of the current tag,
///
/// Returns: `object?` – the extracted asset object, if any.
export function extract_asset_for(config_asset_spec, platform, assets, tag_name) {
	if(tag_name && Array.isArray(assets) && specifies_assets_for(config_asset_spec, platform)) {
		let template = Object.keys(config_asset_spec).find(_ => PLATFORM_NAME_REGEXES[platform].test(_));
		if(template === null || (template = config_asset_spec[template]) === null)
			return null;

		let tag_name_reduced = tag_name;
		if(tag_name_reduced.startsWith("v"))
			tag_name_reduced = tag_name_reduced.substr(1);

		template = replace_all(template, "${TAG_NAME}", tag_name);
		template = replace_all(template, "${TAG_NAME_REDUCED}", tag_name_reduced);

		return assets.find(_ => _.name === template) || null;
	} else
		return null;
}
