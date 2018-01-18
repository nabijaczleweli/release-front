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


//# Preload "../../../js/url.js"
//# Preload "../framework.js"

import {latest_release} from "../../../js/url";
import {assert, finish, test_set_name} from "../framework";


test_set_name("url.latest_release");


let default_callback = (status, response) => {};


assert(latest_release({name: "nabijaczleweli", repo: "release-front"}, null) === false, "error.no_callback");
assert(latest_release({name: "nabijaczleweli", repo: null}, default_callback) === false, "error.slug_no_repo");
assert(latest_release({name: null, repo: "release-front"}, default_callback) === false, "error.slug_no_name");
assert(latest_release({name: null, repo: null}, default_callback) === false, "error.slug_no_repo_name");
assert(latest_release(new XMLHttpRequest(), default_callback) === false, "error.slug_unrelated");
assert(latest_release(null, default_callback) === false, "error.no_slug");


finish();
