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
//# Preload "../../../js/platform-detect.js"
//# Preload "../framework.js"

let fs = window.require("fs");
import platform_js from "platform";
import {is_windows} from "../../../js/platform-detect";
import {assert, finish, test_set_name} from "../framework";


test_set_name("platform-detect.is_windows");


let windows_useragents = [
	["Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1", "phantomjs_2_1_1"],
].concat(JSON.parse(fs.read("test/platform-detect/windows_useragents.json", {mode: "r", charset: "utf-8"})));

let non_windows_useragents = [
	["Mozilla/5.0 (compatible; U; ABrowse 0.6; Syllable) AppleWebKit/420+ (KHTML, like Gecko)", "abrowse_0_6"],
].concat(JSON.parse(fs.read("test/platform-detect/non_windows_useragents.json", {mode: "r", charset: "utf-8"})));


[[windows_useragents, true], [non_windows_useragents, false]].forEach(
    ([uas, windows]) => uas.forEach(([ua, name]) => assert(is_windows(platform_js.parse(ua)) === windows, `${windows ? "" : "non_"}windows.${name}`)));


finish();
