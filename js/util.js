/*!
 * release-front <https://github.com/nabijaczleweli/release-front>
 * Copyright 2018 nabijaczleweli <https://nabijaczleweli.xyz>
 * Available under MIT license <https://opensource.org/licenses/mit>
 */
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.util = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.cartesian = cartesian;
	exports.replace_all = replace_all;

	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}

			return arr2;
		} else {
			return Array.from(arr);
		}
	}

	function cartesian(a, b) {
		function cartesian_hilfer(a, b) {
			var _ref;

			return (_ref = []).concat.apply(_ref, _toConsumableArray(a.map(function (d) {
				return b.map(function (e) {
					return [].concat(d, e);
				});
			})));
		}

		for (var _len = arguments.length, c = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			c[_key - 2] = arguments[_key];
		}

		return b ? cartesian.apply(undefined, [cartesian_hilfer(a, b)].concat(c)) : a;
	}

	function replace_all(whom, what, wit) {
		return whom.split(what).join(wit);
	}
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9qcy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQXdCZ0IsUyxHQUFBLFM7U0FnQkEsVyxHQUFBLFc7Ozs7Ozs7Ozs7Ozs7O0FBaEJULFVBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUErQjtBQUNyQyxXQUFTLGdCQUFULENBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDO0FBQUE7O0FBQy9CLFVBQU8sWUFBRyxNQUFILGdDQUFhLEVBQUUsR0FBRixDQUFNO0FBQUEsV0FBSyxFQUFFLEdBQUYsQ0FBTTtBQUFBLFlBQUssR0FBRyxNQUFILENBQVUsQ0FBVixFQUFhLENBQWIsQ0FBTDtBQUFBLEtBQU4sQ0FBTDtBQUFBLElBQU4sQ0FBYixFQUFQO0FBQ0E7O0FBSG9DLG9DQUFILENBQUc7QUFBSCxJQUFHO0FBQUE7O0FBS3JDLFNBQU8sSUFBSSw0QkFBVSxpQkFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBVixTQUFxQyxDQUFyQyxFQUFKLEdBQThDLENBQXJEO0FBQ0E7O0FBVU0sVUFBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQzVDLFNBQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxFQUFpQixJQUFqQixDQUFzQixHQUF0QixDQUFQO0FBQ0EiLCJmaWxlIjoic3Rkb3V0Iiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDE4IG5hYmlqYWN6bGV3ZWxpXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuLy8gY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4vLyBTT0ZUV0FSRS5cblxuXG4vLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80MzA1MzgwMy8yODUxODE1XG5leHBvcnQgZnVuY3Rpb24gY2FydGVzaWFuKGEsIGIsIC4uLmMpIHtcblx0ZnVuY3Rpb24gY2FydGVzaWFuX2hpbGZlcihhLCBiKSB7XG5cdFx0cmV0dXJuIFtdLmNvbmNhdCguLi5hLm1hcChkID0+IGIubWFwKGUgPT4gW10uY29uY2F0KGQsIGUpKSkpXG5cdH1cblxuXHRyZXR1cm4gYiA/IGNhcnRlc2lhbihjYXJ0ZXNpYW5faGlsZmVyKGEsIGIpLCAuLi5jKSA6IGE7XG59XG5cbi8vLyBCYXNlZCBvbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTE0NTUyNS8yODUxODE1XG4vLy9cbi8vLyBBcmd1bWVudHM6XG4vLy8gICAqIGB3aG9tYCDigJMgYHN0cmluZ2Ag4oCTIHRoZSBzdHJpbmcgdG8gcmVwbGFjZSBpblxuLy8vICAgKiBgd2hhdGAg4oCTIGBzdHJpbmdgIOKAkyB0aGUgc3RyaW5nIHRvIHJlcGxhY2Vcbi8vLyAgICogYHdpdGAg4oCTIGBzdHJpbmdgIOKAkyB0aGUgc3RyaW5nIHRvIHJlcGxhY2Ugd2l0aFxuLy8vXG4vLy8gUmV0dXJuczogYHN0cmluZ2Ag4oCTIGB3aG9tYCB3aXRoIGFsbCBpbnN0YW5jZXMgb2YgYHdoYXRgIHJlcGxhY2VkIHdpdGggYHdpdGBcbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlX2FsbCh3aG9tLCB3aGF0LCB3aXQpIHtcblx0cmV0dXJuIHdob20uc3BsaXQod2hhdCkuam9pbih3aXQpO1xufVxuIl19
