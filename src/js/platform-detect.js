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


import Enum from "enum";            // Provided via "node-enum" library
import platform_js from "platform"; // Provided via "platform.js" library


export const Platform = Enum("Windows", "Linux", "Mac");

/// Convert platform back to string representation.
Platform.name = _ => Platform.keys[_] || "Unknown";

/// Get  who the specified or current platform is.
///
/// Valid return values: `"Windows"`, `"Mac"`, `"Linux"`.
///
/// Arguments: `pform`: `object?` – platform to check, defaults to the current detected one.
///
/// Returns: `number` from the `Platform` enum.
Platform.from_platform = (pform = platform_js) => {
	if(is_windows(pform))
		return Platform.Windows;
	else if(is_mac(pform))
		return Platform.Mac;
	else
		return Platform.Linux;  // Please.
};

if(Object.freeze)
	Object.freeze(Platform);


function check_platform(pform, cases) {
	if(!Array.isArray(cases))
		cases = [cases];

	return cases.concat(cases.map(_ => _.toLowerCase()))
	    .concat(cases.map(_ => _.toUpperCase()))
	    .some(_ => (pform.os && pform.os.family && pform.os.family.indexOf(_) !== -1) || pform.ua.indexOf(_) !== -1);
}

/// Check whether the specified or current platform are Windowsy.
///
/// Arguments: `pform`: `object?` – platform to check, defaults to the current detected one.
///
/// Returns: `boolean`.
export function is_windows(pform = platform_js) {
	return check_platform(pform, "Windows")
}

/// Check whether the specified or current platform are Apply.
///
/// Arguments: `pform`: `object?` – platform to check, defaults to the current detected one.
///
/// Returns: `boolean`.
export function is_mac(pform = platform_js) {
	return check_platform(pform, ["iOS", "Darwin", "Mac"]);
}
