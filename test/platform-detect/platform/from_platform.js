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
//# Preload "../../framework.js"

let fs = window.require("fs");
import platform_js from "platform";
import {Platform} from "../../../js/platform-detect";
import {assert, finish, equals, test_set_name} from "../framework";


test_set_name("platform-detect.Platform.from_platform");


let windows_useragents = [
	["Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1", "phantomjs_2_1_1"],
].concat(JSON.parse(fs.read("test-data/windows_useragents.json", {mode: "r", charset: "utf-8"})));

let mac_useragents = JSON.parse(fs.read("test-data/mac_useragents.json", {mode: "r", charset: "utf-8"}));

let linux_useragents = [
	["Mozilla/5.0 (Unknown; Linux x86_64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.3-dev-release Safari/538.1", "phantomjs_2_1_3_dev_release"],
].concat(JSON.parse(fs.read("test-data/non_windows_non_mac_useragents.json", {mode: "r", charset: "utf-8"})));


[[windows_useragents, Platform.Windows, "windows"], [mac_useragents, Platform.Mac, "mac"], [linux_useragents, Platform.Linux, "linux"]].forEach(
    ([uas, type, ltype]) => uas.forEach(([ua, name]) => assert(equals(Platform.from_platform(platform_js.parse(ua)), type), `${ltype}.${name}`)));


finish();
