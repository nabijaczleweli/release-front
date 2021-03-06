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


//# Preload "../../../js/util.js"
//# Preload "../framework.js"

import {replace_all} from "../../../js/util";
import {assert, finish, test_set_name} from "../framework";


test_set_name("util.replace_all");


assert(replace_all("Test abc test test abc test test test abc test test abc", "abc", "$") === "Test $ test test $ test test test $ test test $", "simple");
assert(replace_all("Test test test test test test test test", "abc", "$") === "Test test test test test test test test", "no_matches");
assert(replace_all("Test. test test. test test test. test test.", ".", "$") === "Test$ test test$ test test test$ test test$", "special_chars");


finish();
