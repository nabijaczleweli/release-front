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


//# Preload-remote "https://cdn.rawgit.com/jsPolyfill/Array.prototype.find/master/find.js"
//# Preload-remote "https://cdn.rawgit.com/mathiasbynens/String.prototype.startsWith/master/startswith.js"
//# Preload-remote "https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.5/platform.js"
//# Preload "../../../../js/lib/node-enum.js"
//# Preload "../../../../js/platform-detect.js"
//# Preload "../../../../js/string.js"
//# Preload "../../../../js/assets.js"
//# Preload "../../framework.js"

let fs = window.require("fs");
import {Platform} from "../../../../js/platform-detect";
import {extract_asset_for} from "../../../../js/assets";
import {assert, finish, equals, test_set_name} from "../../framework";


test_set_name("assets.extract_asset_for.good_input");


let cargo_update_assets  = JSON.parse(fs.read("test-data/assets/nabijaczleweli_cargo-update-v1.4.1.json", {mode: "r", charset: "utf-8"}));
let cargo_update_spec_v1 = {
	WiNdoWS: "cargo-install-update-${TAG_NAME}.exe",
	mAc: null,
	LInux: "cargo-install-update-${TAG_NAME}.tbz2",
};
let cargo_update_spec_v2 = {
	WiNdoWS: "cargo-install-update-${TAG_NAME}.exe",
	LInux: "cargo-install-update-${TAG_NAME}.tbz2",
};

let patchwork_assets = JSON.parse(fs.read("test-data/assets/ssbc_patchwork-v3.8.6.json", {mode: "r", charset: "utf-8"}));
let patchwork_spec   = {
  WiNdoWS: "Patchwork-${TAG_NAME_REDUCED}-windows.exe",
  mAc: "Patchwork-${TAG_NAME_REDUCED}-mac.dmg",
  LInux: "Patchwork-${TAG_NAME_REDUCED}-linux-x86_64.AppImage",
};


[cargo_update_spec_v1, cargo_update_spec_v2].forEach((cargo_update_spec, idx) => {
	assert(equals(extract_asset_for(cargo_update_spec, Platform.Windows, cargo_update_assets, "v1.4.1"), cargo_update_assets[1]),
	       `cargo_update.v${idx + 1}.windows`);
	assert(equals(extract_asset_for(cargo_update_spec, Platform.Mac, cargo_update_assets, "v1.4.1"), null), `cargo_update.v${idx + 1}.mac`);
	assert(equals(extract_asset_for(cargo_update_spec, Platform.Linux, cargo_update_assets, "v1.4.1"), cargo_update_assets[2]), `cargo_update.v${idx + 1}.linux`);
});

assert(equals(extract_asset_for(patchwork_spec, Platform.Windows, patchwork_assets, "v3.8.6"), patchwork_assets[2]), "patchwork.windows");
assert(equals(extract_asset_for(patchwork_spec, Platform.Mac, patchwork_assets, "v3.8.6"), patchwork_assets[1]), "patchwork.mac");
assert(equals(extract_asset_for(patchwork_spec, Platform.Linux, patchwork_assets, "v3.8.6"), patchwork_assets[0]), "patchwork.linux");


finish();
