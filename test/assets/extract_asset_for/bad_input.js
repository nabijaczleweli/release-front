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


//# Preload-remote "https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.5/platform.js"
//# Preload "../../../../js/lib/node-enum.js"
//# Preload "../../../../js/platform-detect.js"
//# Preload "../../../../js/util.js"
//# Preload "../../../../js/assets.js"
//# Preload "../../framework.js"

let fs = window.require("fs");
import {Platform} from "../../../../js/platform-detect";
import {extract_asset_for} from "../../../../js/assets";
import {assert, finish, test_set_name} from "../../framework";


test_set_name("assets.extract_asset_for.bad_input");


let assets = JSON.parse(fs.read("test-data/assets/nabijaczleweli_cargo-update-v1.4.1.json", {mode: "r", charset: "utf-8"}));


assert(extract_asset_for({}, Platform.Mac, assets, null) === null, "tag_name");

assert(extract_asset_for({}, 420, {}, "v1.4.1") === null, "assets.object");
assert(extract_asset_for({}, 420, null, "v1.4.1") === null, "assets.null");
assert(extract_asset_for({}, 420, "[]", "v1.4.1") === null, "assets.string");

assert(extract_asset_for({}, 420, assets, "v1.4.1") === null, "platform");

assert(extract_asset_for("windows_mac_linux", Platform.Mac, assets, "v1.4.1") === null, "asset_spec.string");
assert(extract_asset_for(69, Platform.Mac, assets, "v1.4.1") === null, "asset_spec.number");
assert(extract_asset_for(null, Platform.Mac, assets, "v1.4.1") === null, "asset_spec.null");


finish();
