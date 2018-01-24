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
//# Preload-remote "https://cdn.rawgit.com/mathiasbynens/String.prototype.endsWith/master/endswith.js"
//# Preload-remote "https://cdn.rawgit.com/mathiasbynens/String.prototype.startsWith/master/startswith.js"
//# Preload-remote "https://cdn.rawgit.com/es-shims/get-own-property-symbols/master/build/get-own-property-symbols.max.js"
//# Preload-remote "https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.5/platform.js"
//# Preload "../../../../js/lib/node-enum.js"
//# Preload "../../../../js/platform-detect.js"
//# Preload "../../../../js/assets.js"
//# Preload "../../framework.js"

let fs = window.require("fs");
import {Platform} from "../../../../js/platform-detect";
import {rank_assets} from "../../../../js/assets";
import {assert, equals, finish, test_set_name} from "../../framework";


test_set_name("assets.rank_assets.good_input");


let cargo_update = [
	"v1.4.1", "nabijaczleweli", "cargo-update", (() => {
	  let scores               = {};
	  scores[Platform.Windows] = [-1, 2, 0, -1];
	  scores[Platform.Mac]     = [-1, 0, 0, -1];
	  scores[Platform.Linux]   = [1, 0, 2, 1];
	  return scores;
	})()
];

[cargo_update].forEach(([tag_name, owner, repo_name, scores]) => {
	let assets = JSON.parse(fs.read(`test-data/assets/${owner}_${repo_name}-${tag_name}.json`, {mode: "r", charset: "utf-8"}));

	for(let pform of Platform.all)
		assert(equals(rank_assets(repo_name, tag_name, assets, pform), assets.map((data, idx) => ({score: scores[pform][idx], data}))),
		       `${repo_name}.${Platform.name(pform).toLowerCase()}`);
});


finish();
