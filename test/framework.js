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


export {assert, equals, finish, test_set_name};


let testset_name     = "";
let successful_tests = 0;
let failed_tests     = 0;


function test_set_name(name) {
	testset_name = name;
}

function assert(ass, who_this) {
	let func = ass ? console.log : console.warn;
	let str  = ass ? "👌" : "👎";

	func.call(console, `${str} ${testset_name}.${who_this}`)

	successful_tests += ass;
	failed_tests += !ass;
}

/// Solution stolen from https://stackoverflow.com/a/11039915/2851815
function equals(lhs, rhs) {
	function _equals(lhs, rhs) {
		let clone    = jQuery_extend(true, {}, lhs);
		let cloneStr = JSON.stringify(clone);
		return cloneStr === JSON.stringify(jQuery_extend(true, clone, rhs));
	}

	return _equals(lhs, rhs) && _equals(rhs, lhs);
}

function finish() {
	let test_count = successful_tests + failed_tests;

	console.log("");
	console.log(`${testset_name}: ${successful_tests}/${test_count} ≃ ${Math.round((successful_tests / test_count) * 100)}%`);
	phantom.exit(failed_tests);
}


// Just exit when run
if(window.require("system").args[0].indexOf("framework.js") != -1)
	phantom.exit(0);


let jQuery_extend = function() {
	/*!
	 * (extracted from)
	 * jQuery JavaScript Library v2.0.3
	 * http://jquery.com/
	 *
	 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2013-07-03T13:30Z
	 */
	let class2type = {
		"[object Boolean]": "boolean",
		"[object Number]": "number",
		"[object String]": "string",
		"[object Function]": "function",
		"[object Array]": "array",
		"[object Date]": "date",
		"[object RegExp]": "regexp",
		"[object Object]": "object",
		"[object Error]": "error"
	};

	let core_toString = class2type.toString, core_hasOwn = class2type.hasOwnProperty;

	let isFunction = function(obj) {
		return type(obj) === "function";
	};

	let isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};

	let type = function(obj) {
		if(obj == null)
			return String(obj);
		return typeof obj === "object" || typeof obj === "function" ? class2type[core_toString.call(obj)] || "object" : typeof obj;
	};

	let isPlainObject = function(obj) {
		if(type(obj) !== "object" || obj.nodeType || isWindow(obj))
			return false;

		try {
			if(obj.constructor && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))
				return false;
		} catch(e) {
			return false;
		}

		return true;
	};

	let extend = function() {
		var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

		if(typeof target === "boolean") {
			deep   = target;
			target = arguments[1] || {};
			i      = 2;
		}

		if(typeof target !== "object" && !isFunction(target))
			target = {};

		if(length === i) {
			target = this;
			--i;
		}

		for(; i < length; i++) {
			if((options = arguments[i]) != null) {
				for(name in options) {
					src  = target[name];
					copy = options[name];

					if(target === copy)
						continue;

					if(deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
						if(copyIsArray) {
							copyIsArray = false;
							clone       = src && Array.isArray(src) ? src : [];
						} else
							clone = src && isPlainObject(src) ? src : {};

						target[name] = extend(deep, clone, copy);

					} else if(copy !== undefined)
						target[name] = copy;
				}
			}
		}

		return target;
	};

	return extend;
}();
