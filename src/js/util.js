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


/// Adapted from https://stackoverflow.com/a/43053803/2851815
export function cartesian(a, b, ...c) {
	function cartesian_hilfer(a, b) {
		return [].concat(...a.map(d => b.map(e => [].concat(d, e))))
	}

	return b ? cartesian(cartesian_hilfer(a, b), ...c) : a;
}

/// Based on https://stackoverflow.com/a/1145525/2851815
///
/// Arguments:
///   * `whom` – `string` – the string to replace in
///   * `what` – `string` – the string to replace
///   * `wit` – `string` – the string to replace with
///
/// Returns: `string` – `whom` with all instances of `what` replaced with `wit`
export function replace_all(whom, what, wit) {
	return whom.split(what).join(wit);
}
