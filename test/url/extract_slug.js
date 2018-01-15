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

import {extract_slug} from "../../../js/url";
import {assert, equals, finish, test_set_name} from "../framework";


test_set_name("url.extract_slug");


let good_result = {name: "nabijaczleweli", repo: "release-front"};
let null_result = {name: null, repo: null};


assert(equals(extract_slug("nabijaczleweli/release-front"), good_result), "raw_slug");

assert(equals(extract_slug("github.com/nabijaczleweli/release-front"), good_result), "github");
assert(equals(extract_slug("//github.com/nabijaczleweli/release-front"), good_result), "github_double_slash");
assert(equals(extract_slug("http://github.com/nabijaczleweli/release-front"), good_result), "github_http");
assert(equals(extract_slug("https://github.com/nabijaczleweli/release-front"), good_result), "github_https");

assert(equals(extract_slug("github.com/nabijaczleweli/release-front/issues/"), good_result), "garbage.github");
assert(equals(extract_slug("//github.com/nabijaczleweli/release-front/pulls/69"), good_result), "garbage.github_double_slash");
assert(equals(extract_slug("http://github.com/nabijaczleweli/release-front/releases"), good_result), "garbage.github_http");
assert(equals(extract_slug("https://github.com/nabijaczleweli/release-front/issues/new?title=%22Henlo Zbingiew\""), good_result), "garbage.github_https");

assert(equals(extract_slug("?nabijaczleweli/release-front"), good_result), "query");
assert(equals(extract_slug("?nabijaczleweli/release-front&henlo=zbingiew"), good_result), "garbage.query");


assert(equals(extract_slug("nabijaczleweli"), null_result), "just_username");
assert(equals(extract_slug("/release-front"), null_result), "empty_username");
assert(equals(extract_slug(""), null_result), "empty");
assert(equals(extract_slug("/"), null_result), "both_empty");
assert(equals(extract_slug("github.com/"), null_result), "just_github");
assert(equals(extract_slug("?"), null_result), "just_query");

assert(equals(extract_slug("nabijaczleweli et al."), null_result), "garbage.just_username");
assert(equals(extract_slug("/release-front/issues"), null_result), "garbage.empty_username");
assert(equals(extract_slug("&amp;"), null_result), "garbage.empty");
assert(equals(extract_slug("/; So, anyway…"), null_result), "garbage.both_empty");
assert(equals(extract_slug("github.com/?context=deleted"), null_result), "garbage.just_github");
assert(equals(extract_slug("?&help=unneeded"), null_result), "garbage.just_query");


finish();
