/*!
 * release-front <https://github.com/nabijaczleweli/release-front>
 * Copyright 2018 nabijaczleweli <https://nabijaczleweli.xyz>
 * Available under MIT license <https://opensource.org/licenses/mit>
 */
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "./platform-detect", "./util"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("./platform-detect"), require("./util"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.platformDetect, global.util);
		global.url = mod.exports;
	}
})(this, function (exports, _platformDetect, _util) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.extract_slug = extract_slug;
	exports.full_name = full_name;
	exports.latest_release = latest_release;
	exports.find_logo = find_logo;
	exports.get_config = get_config;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var _slicedToArray = function () {
		function sliceIterator(arr, i) {
			var _arr = [];
			var _n = true;
			var _d = false;
			var _e = undefined;

			try {
				for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
					_arr.push(_s.value);

					if (i && _arr.length === i) break;
				}
			} catch (err) {
				_d = true;
				_e = err;
			} finally {
				try {
					if (!_n && _i["return"]) _i["return"]();
				} finally {
					if (_d) throw _e;
				}
			}

			return _arr;
		}

		return function (arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				return sliceIterator(arr, i);
			} else {
				throw new TypeError("Invalid attempt to destructure non-iterable instance");
			}
		};
	}();

	var EXTRACT_SLUG_REGEX = /^(?:(?:(?:(?:(?:http(?:s)?:)?\/\/)?github\.com\/)?)|\?)([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+).*/i;
	var GITHUB_API_ACCEPT = "application/vnd.github.v3+json";

	var LOGO_SEARCH_PATHS = ["", "assets/"];
	var LOGO_SEARCH_NAMES = ["logo", "icon"];
	var LOGO_EXTENSIONS = ["png", "jpg"];

	function extract_slug(data) {
		var sought = EXTRACT_SLUG_REGEX.exec(data) || [];
		sought.shift();

		return {
			name: sought[0] || null,
			repo: sought[1] || null
		};
	}

	function full_name(slug) {
		if (slug && slug.name && slug.repo) return slug.name + "/" + slug.repo;else return null;
	}

	function latest_release(slug, callback) {
		if (callback && slug && slug.name && slug.repo) {
			var url = "//api.github.com/repos/" + slug.name + "/" + slug.repo + "/releases/latest";

			var request = new XMLHttpRequest();
			request.open("GET", url);

			request.setRequestHeader("Accept", GITHUB_API_ACCEPT);
			request.overrideMimeType("application/json");

			request.addEventListener("readystatechange", function () {
				if (request.readyState === XMLHttpRequest.DONE) {
					var response = typeof request.response === "string" ? JSON.parse(request.response) : request.response;
					callback(request.status, response);
				}
			});
			request.send();

			return true;
		} else return false;
	}

	function find_logo(slug, commitish, callback) {
		if (callback && commitish && slug && slug.name && slug.repo) {
			var url_base = "//rawcdn.githack.com/" + slug.name + "/" + slug.repo + "/" + commitish;

			var logo_options = (0, _util.cartesian)(LOGO_SEARCH_PATHS, LOGO_SEARCH_NAMES, LOGO_EXTENSIONS);
			var requests_left = logo_options.length;

			var requests = logo_options.map(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 3),
				    path = _ref2[0],
				    name = _ref2[1],
				    extension = _ref2[2];

				var url = url_base + "/" + path + name + "." + extension;
				var request = new XMLHttpRequest();
				request.open("GET", url);


				var aborted = false;
				request.addEventListener("readystatechange", function () {
					if (!aborted && requests_left !== 0 && request.readyState >= XMLHttpRequest.HEADERS_RECEIVED) {
						aborted = true;

						var status = request.status | 0;

						request.abort();
						--requests_left;

						if (status >= 200 && status < 300) {
							requests_left = -1;
							requests.forEach(function (_) {
								return _.abort();
							});
							callback(url);
						} else if (requests_left === 0) callback(null);
					}
				});
				request.send();

				return request;
			});

			return true;
		} else return false;
	}

	function get_config(slug, commitish, callback) {
		if (callback && commitish && slug && slug.name && slug.repo) {
			var url = "//rawcdn.githack.com/" + slug.name + "/" + slug.repo + "/" + commitish + "/release-front.json";
			var request = new XMLHttpRequest();
			request.open("GET", url);


			request.addEventListener("readystatechange", function () {
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status >= 200 && request.status < 300) {
						var response = typeof request.response === "string" ? JSON.parse(request.response) : request.response;
						if ((typeof response === "undefined" ? "undefined" : _typeof(response)) === "object") {
							var logo_url = response.logo || response.logo_url;
							if (typeof logo_url === "string" && logo_url.length !== 0) {
								if (logo_url.indexOf("//") === -1) logo_url = "//rawcdn.githack.com/" + slug.name + "/" + slug.repo + "/" + commitish + "/" + logo_url;
							} else logo_url = null;

							var platform_name_override = null;
							var asset_spec = null;
							var universal = response.universal;
							if (universal === true) platform_name_override = "universal";else if ((typeof universal === "undefined" ? "undefined" : _typeof(universal)) === "object" && universal !== null) {
								platform_name_override = (0, _util.string_or)(universal.name, universal.platform, universal.pseudo_platform);

								var ass = universal.asset || universal.asset_spec;
								if (typeof ass === "string" && ass.length !== 0) {
									asset_spec = {};
									var _iteratorNormalCompletion = true;
									var _didIteratorError = false;
									var _iteratorError = undefined;

									try {
										for (var _iterator = _platformDetect.Platform.keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
											var pname = _step.value;

											asset_spec[pname] = ass;
										}
									} catch (err) {
										_didIteratorError = true;
										_iteratorError = err;
									} finally {
										try {
											if (!_iteratorNormalCompletion && _iterator.return) {
												_iterator.return();
											}
										} finally {
											if (_didIteratorError) {
												throw _iteratorError;
											}
										}
									}
								}
							}

							if (asset_spec === null) {
								asset_spec = response.assets || response.asset_spec || null;
								if ((typeof asset_spec === "undefined" ? "undefined" : _typeof(asset_spec)) === "object" && asset_spec !== null) for (var key in asset_spec) {
										if (typeof asset_spec[key] === "string" && asset_spec[key].length !== 0) {
											var key_lcase = key.toLowerCase();
											if (key !== key_lcase) {
												asset_spec[key_lcase] = asset_spec[key];
												delete asset_spec[key];
											}
										} else if (asset_spec[key] !== null) delete asset_spec[key];else asset_spec = null;
									}
							}

							callback(logo_url, asset_spec, platform_name_override);
							return;
						}
					}

					callback(null, null, null);
				}
			});

			request.send();

			return true;
		} else return false;
	}
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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REQ7QUFGK0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUkvQztBQUNEOztBQUVELFdBQUcsZUFBZSxJQUFsQixFQUF3QjtBQUN2QixxQkFBYSxTQUFTLE1BQVQsSUFBbUIsU0FBUyxVQUE1QixJQUEwQyxJQUF2RDtBQUNBLFlBQUcsUUFBTyxVQUFQLHlDQUFPLFVBQVAsT0FBc0IsUUFBdEIsSUFBa0MsZUFBZSxJQUFwRCxFQUNDLEtBQUksSUFBSSxHQUFSLElBQWUsVUFBZjtBQUNDLGNBQUcsT0FBTyxXQUFXLEdBQVgsQ0FBUCxLQUEyQixRQUEzQixJQUF1QyxXQUFXLEdBQVgsRUFBZ0IsTUFBaEIsS0FBMkIsQ0FBckUsRUFBd0U7QUFDdkUsZUFBSSxZQUFZLElBQUksV0FBSixFQUFoQjtBQUNBLGVBQUcsUUFBUSxTQUFYLEVBQXNCO0FBQ3JCLHVCQUFXLFNBQVgsSUFBd0IsV0FBVyxHQUFYLENBQXhCO0FBQ0EsbUJBQU8sV0FBVyxHQUFYLENBQVA7QUFDQTtBQUNELFdBTkQsTUFNTyxJQUFHLFdBQVcsR0FBWCxNQUFvQixJQUF2QixFQUNOLE9BQU8sV0FBVyxHQUFYLENBQVAsQ0FETSxLQUdOLGFBQWEsSUFBYjtBQVZGO0FBV0Q7O0FBRUQsZ0JBQVMsUUFBVCxFQUFtQixVQUFuQixFQUErQixzQkFBL0I7QUFDQTtBQUNBO0FBQ0Q7O0FBRUQsY0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQixJQUFyQjtBQUNBO0FBQ0QsSUFwREQ7O0FBc0RBLFdBQVEsSUFBUjs7QUFFQSxVQUFPLElBQVA7QUFDQSxHQWhFRCxNQWlFQyxPQUFPLEtBQVA7QUFDRCIsImZpbGUiOiJzdGRvdXQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbi8vXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTggbmFiaWphY3psZXdlbGlcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG5cbmltcG9ydCB7UGxhdGZvcm19IGZyb20gXCIuL3BsYXRmb3JtLWRldGVjdFwiO1xuaW1wb3J0IHtjYXJ0ZXNpYW4sIHN0cmluZ19vcn0gZnJvbSBcIi4vdXRpbFwiO1xuXG5cbmNvbnN0IEVYVFJBQ1RfU0xVR19SRUdFWCA9IC9eKD86KD86KD86KD86KD86aHR0cCg/OnMpPzopP1xcL1xcLyk/Z2l0aHViXFwuY29tXFwvKT8pfFxcPykoW2EtekEtWjAtOS1fLl0rKVxcLyhbYS16QS1aMC05LV8uXSspLiovaTtcbmNvbnN0IEdJVEhVQl9BUElfQUNDRVBUICA9IFwiYXBwbGljYXRpb24vdm5kLmdpdGh1Yi52Mytqc29uXCI7XG5cbi8vIFJlbWVtYmVyIHRvIHVwZGF0ZSBpbiBSRUFETUUubWRcbmNvbnN0IExPR09fU0VBUkNIX1BBVEhTID0gW1wiXCIsIFwiYXNzZXRzL1wiXTtcbmNvbnN0IExPR09fU0VBUkNIX05BTUVTID0gW1wibG9nb1wiLCBcImljb25cIl07XG5jb25zdCBMT0dPX0VYVEVOU0lPTlMgICA9IFtcInBuZ1wiLCBcImpwZ1wiXTtcblxuXG4vLy8gR2V0IHJlcG9zaXRvcnkgc2x1ZyBpbmZvcm1hdGlvbiBmcm9tIHRoZSBzdXBwbGllZCBzdHJpbmcg4oCTIHNvbWV0aGluZyBhIHVzZXIgbWlnaHQgcGFzdGUgaW4sIG9yIGFuIHVuZmlsdGVyZWQgcXVlcnkgc3RyaW5nLlxuLy8vXG4vLy8gQXJndW1lbnRzOiBgZGF0YWA6IGBzdHJpbmdgIOKAkyB3aGVyZWluIHRoZSByZXBvc2l0b3J5IHNsdWcgaXMgY29udGFpbmVkLlxuLy8vXG4vLy8gUmV0dXJuczogYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmc/LCBzdHJpbmc/fWAsIHdoZXJlIGJvdGggYG5hbWVgIGFuZCBgcmVwb2AgYXJlIHRoZSByZXNwZWN0aXZlIHBhcnRzIG9mIHRoZSByZXBvc2l0b3J5IHNsdWcgb3IgYG51bGxgLCBpZiBub3Rcbi8vLyBmb3VuZC5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0X3NsdWcoZGF0YSkge1xuXHRsZXQgc291Z2h0ID0gRVhUUkFDVF9TTFVHX1JFR0VYLmV4ZWMoZGF0YSkgfHwgW107XG5cdHNvdWdodC5zaGlmdCgpOyAgLy8gRHJvcCB3aG9sZSBzdHJpbmdcblxuXHRyZXR1cm4ge1xuXHRcdG5hbWU6IHNvdWdodFswXSB8fCBudWxsLFxuXHRcdHJlcG86IHNvdWdodFsxXSB8fCBudWxsLFxuXHR9O1xufVxuXG4vLy8gR2V0IHJlcG9zaXRvcnkgc2x1ZyBzdHJpbmcgZnJvbSB0aGUgcmVzcGVjdGl2ZSBvYmplY3QsXG4vLy9cbi8vLyBBcmd1bWVudHM6IGBvYmplY3RgIOKAkyBge25hbWUsIHJlcG99OiB7c3RyaW5nLCBzdHJpbmd9YCwgd2hlcmUgYm90aCBgbmFtZWAgYW5kIGByZXBvYCBhcmUgdGhlIHJlc3BlY3RpdmUgcGFydHMgb2YgdGhlIHJlcG9zaXRvcnkgc2x1Zy5cbi8vL1xuLy8vIFJldHVybnM6IGBzdHJpbmc/YCwgcmVwcmVzZW50aW5nIHRoZSBub3JtYWxpc2VkIGZvcm0gb2YgdGhlIHJlcG8gc2x1Zywgb3IgYG51bGxgLCBpZiBzdXBwbGllZCBvYmplY3Qgd2FzIGludmFsaWQuXG5leHBvcnQgZnVuY3Rpb24gZnVsbF9uYW1lKHNsdWcpIHtcblx0aWYoc2x1ZyAmJiBzbHVnLm5hbWUgJiYgc2x1Zy5yZXBvKVxuXHRcdHJldHVybiBgJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfWA7XG5cdGVsc2Vcblx0XHRyZXR1cm4gbnVsbDtcbn1cblxuLy8vIEFjcXVpcmUgdGhlIGxhdGVzdCByZWxlYXNlIGRhdGEgZnJvbSB0aGUgc3BlY2lmaWVkIHJlcG9zaXRvcnkuXG4vLy9cbi8vLyBBcmd1bWVudHM6XG4vLy8gICAqIGBzbHVnYCDigJMgYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmcsIHN0cmluZ31gLCB3aGVyZSBib3RoIGBuYW1lYCBhbmQgYHJlcG9gIGFyZSB0aGUgcmVzcGVjdGl2ZSBwYXJ0cyBvZiB0aGUgcmVxdWVzdGVkIHJlcG9zaXRvcnkgc2x1Zy5cbi8vLyAgICogYGNhbGxiYWNrYCDigJMgYGZ1bmN0aW9uKHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogb2JqZWN0KWAg4oCTXG4vLy8gICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSByZXF1ZXN0IGlzIGZpbmlzaGVkLCB3aGVyZSBgc3RhdHVzYCBpcyB0aGUgcmVzcG9uc2Ugc3RhdHVzIChgMjAwYC9gNDA0YC9ldGMuKSxcbi8vLyAgICAgICAgICAgICAgICAgICBhbmQgYHJlc3BvbnNlYCBpcyBhbiBvYmplY3QgaW4gdGhlIGZvcm1hdCByZXR1cm5lZCBieSB0aGVcbi8vLyAgICAgICAgICAgICAgICAgICBbR2l0SHViIEFQSSB2M10oaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9yZWxlYXNlcy8jZ2V0LXRoZS1sYXRlc3QtcmVsZWFzZSkuXG4vLy9cbi8vLyBSZXR1cm5zOiBgYm9vbGVhbmAsIHJlcHJlc2VudGluZyB3aGV0aGVyIHRoZSByZXF1ZXN0IHdhcyBtYWRlLlxuZXhwb3J0IGZ1bmN0aW9uIGxhdGVzdF9yZWxlYXNlKHNsdWcsIGNhbGxiYWNrKSB7XG5cdGlmKGNhbGxiYWNrICYmIHNsdWcgJiYgc2x1Zy5uYW1lICYmIHNsdWcucmVwbykge1xuXHRcdGxldCB1cmwgPSBgLy9hcGkuZ2l0aHViLmNvbS9yZXBvcy8ke3NsdWcubmFtZX0vJHtzbHVnLnJlcG99L3JlbGVhc2VzL2xhdGVzdGA7XG5cblx0XHRsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwpO1xuXHRcdC8vIFVzaW5nIFVzZXItQWdlbnQgZnJvbSBicm93c2VycyBkb2Vzbid0IHdvcmsgYXBwYXJlbnRseSA6dlxuXHRcdC8vIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIlVzZXItQWdlbnRcIiwgYHJlbGVhc2UtZnJvbnQvUkVMRUFTRV9GUk9OVF9WRVJTSU9OX1NUUmApO1xuXHRcdHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBHSVRIVUJfQVBJX0FDQ0VQVCk7XG5cdFx0cmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKTtcblxuXHRcdHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgKCkgPT4ge1xuXHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG5cdFx0XHRcdC8vIEZGIGRvZXNuJ3Qgc2VlbSB0byBhdXRvLWRlY29kZSBKU09OXG5cdFx0XHRcdGxldCByZXNwb25zZSA9IHR5cGVvZiByZXF1ZXN0LnJlc3BvbnNlID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlKSA6IHJlcXVlc3QucmVzcG9uc2U7XG5cdFx0XHRcdGNhbGxiYWNrKHJlcXVlc3Quc3RhdHVzLCByZXNwb25zZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmVxdWVzdC5zZW5kKCk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlXG5cdFx0cmV0dXJuIGZhbHNlO1xufVxuXG4vLy8gU2VhcmNoIGZvciBhIGxvZ28gZmlsZSBpbiB0aGUgcmVwb3NpdG9yeSB1bmRlciB0aGUgc3BlY2lmaWVkIGNvbW1pdGlzaC5cbi8vL1xuLy8vIEFyZ3VtZW50czpcbi8vLyAgICogYHNsdWdgIOKAkyBgb2JqZWN0YCDigJMgYHtuYW1lLCByZXBvfToge3N0cmluZywgc3RyaW5nfWAsIHdoZXJlIGJvdGggYG5hbWVgIGFuZCBgcmVwb2AgYXJlIHRoZSByZXNwZWN0aXZlIHBhcnRzIG9mIHRoZSByZXF1ZXN0ZWQgcmVwb3NpdG9yeSBzbHVnLlxuLy8vICAgKiBgY29tbWl0aXNoYCDigJMgYHN0cmluZ2Ag4oCTIHRhZy9jb21taXQvYnJhbmNoIHRvIGxvb2sgaW4uXG4vLy8gICAqIGBjYWxsYmFja2Ag4oCTIGBmdW5jdGlvbih1cmw6IHN0cmluZz8pYCDigJNcbi8vLyAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjYWxsZWRcbi8vLyAgICAgICAgICAgICAgICAgICAoYSkgd2l0aCB0aGUgbG9nbyB1cmwgd2hlbiBlaXRoZXIgYSBsb2dvIHdhcyBmb3VuZCBvclxuLy8vICAgICAgICAgICAgICAgICAgIChiKSB3aXRoIGBudWxsYCB3aGVuIGFsbCBzZWFyY2ggcGF0aHMgZXJyb3JlZC5cbi8vL1xuLy8vIFJldHVybnM6IGBib29sZWFuYCwgcmVwcmVzZW50aW5nIHdoZXRoZXIgdGhlIHJlcXVlc3RzIHdlcmUgbWFkZS5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2xvZ28oc2x1ZywgY29tbWl0aXNoLCBjYWxsYmFjaykge1xuXHRpZihjYWxsYmFjayAmJiBjb21taXRpc2ggJiYgc2x1ZyAmJiBzbHVnLm5hbWUgJiYgc2x1Zy5yZXBvKSB7XG5cdFx0bGV0IHVybF9iYXNlID0gYC8vcmF3Y2RuLmdpdGhhY2suY29tLyR7c2x1Zy5uYW1lfS8ke3NsdWcucmVwb30vJHtjb21taXRpc2h9YDtcblxuXHRcdGxldCBsb2dvX29wdGlvbnMgID0gY2FydGVzaWFuKExPR09fU0VBUkNIX1BBVEhTLCBMT0dPX1NFQVJDSF9OQU1FUywgTE9HT19FWFRFTlNJT05TKTtcblx0XHRsZXQgcmVxdWVzdHNfbGVmdCA9IGxvZ29fb3B0aW9ucy5sZW5ndGg7XG5cblx0XHRsZXQgcmVxdWVzdHMgPSBsb2dvX29wdGlvbnMubWFwKChbcGF0aCwgbmFtZSwgZXh0ZW5zaW9uXSkgPT4ge1xuXHRcdFx0bGV0IHVybCAgICAgPSBgJHt1cmxfYmFzZX0vJHtwYXRofSR7bmFtZX0uJHtleHRlbnNpb259YDtcbiAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsKTtcblx0XHRcdC8vIFVzaW5nIFVzZXItQWdlbnQgZnJvbSBicm93c2VycyBkb2Vzbid0IHdvcmsgYXBwYXJlbnRseSA6dlxuXHRcdFx0Ly8gcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKFwiVXNlci1BZ2VudFwiLCBgcmVsZWFzZS1mcm9udC9SRUxFQVNFX0ZST05UX1ZFUlNJT05fU1RSYCk7XG5cblx0XHRcdGxldCBhYm9ydGVkID0gZmFsc2U7XG5cdFx0XHRyZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsICgpID0+IHtcblx0XHRcdFx0aWYoIWFib3J0ZWQgJiYgcmVxdWVzdHNfbGVmdCAhPT0gMCAmJiByZXF1ZXN0LnJlYWR5U3RhdGUgPj0gWE1MSHR0cFJlcXVlc3QuSEVBREVSU19SRUNFSVZFRCkge1xuXHRcdFx0XHRcdGFib3J0ZWQgPSB0cnVlOyAgLy8gZG8gdGhpcyBBU0FQXG5cblx0XHRcdFx0XHRsZXQgc3RhdHVzID0gcmVxdWVzdC5zdGF0dXMgfCAwOyAgLy8gfCAwIHRvIG1ha2UgYSBjb3B5XG5cblx0XHRcdFx0XHRyZXF1ZXN0LmFib3J0KCk7XG5cdFx0XHRcdFx0LS1yZXF1ZXN0c19sZWZ0O1xuXG5cdFx0XHRcdFx0aWYoc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDApIHtcblx0XHRcdFx0XHRcdHJlcXVlc3RzX2xlZnQgPSAtMTsgIC8vIERvbid0IGFsbG93IGFueSBvdGhlciB0aHJlYWRzIHRvIHRyaWdnZXIgYG51bGxgIGNhc2Vcblx0XHRcdFx0XHRcdHJlcXVlc3RzLmZvckVhY2goXyA9PiBfLmFib3J0KCkpO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sodXJsKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdHNfbGVmdCA9PT0gMClcblx0XHRcdFx0XHRcdGNhbGxiYWNrKG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJlcXVlc3Quc2VuZCgpO1xuXG5cdFx0XHRyZXR1cm4gcmVxdWVzdDtcblx0XHR9KTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGVsc2Vcblx0XHRyZXR1cm4gZmFsc2U7XG59XG5cbi8vLyBHZXQgYW5kIGRlY29uc3RydWN0IHRoZSByZXBvJ3MgY29uZmlndXJhdGlvbiwgaWYgYW55LlxuLy8vXG4vLy8gQXJndW1lbnRzOlxuLy8vICAgKiBgc2x1Z2Ag4oCTIGBvYmplY3RgIOKAkyBge25hbWUsIHJlcG99OiB7c3RyaW5nLCBzdHJpbmd9YCwgd2hlcmUgYm90aCBgbmFtZWAgYW5kIGByZXBvYCBhcmUgdGhlIHJlc3BlY3RpdmUgcGFydHMgb2YgdGhlIHJlcXVlc3RlZCByZXBvc2l0b3J5IHNsdWcuXG4vLy8gICAqIGBjb21taXRpc2hgIOKAkyBgc3RyaW5nYCDigJMgdGFnL2NvbW1pdC9icmFuY2ggdG8gbG9vayBpbi5cbi8vLyAgICogYGNhbGxiYWNrYCDigJMgYGZ1bmN0aW9uKGxvZ29fdXJsOiBzdHJpbmc/LCBhc3NldF9zcGVjOiBvYmplY3Q/LCBwbGF0Zm9ybV9uYW1lX292ZXJyaWRlOiBzdHJpbmc/KWAsIGBhc3NldF9zcGVjOiB7W3BsYXRmb3JtIG5hbWU6IHRlbXBsYXRlIHN0cmluZ119YCDigJNcbi8vLyAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjYWxsZWQgd2hlbiByZXF1ZXN0IGlzIGNvbXBsZXRlLlxuLy8vICAgICAgICAgICAgICAgICAgIElmIHRoZSByZXF1ZXN0IHJldHVybnMgYW4gZXJyb3IgYm90aCBhcmd1bWVudHMgYXJlIGBudWxsYC5cbi8vLyAgICAgICAgICAgICAgICAgICBPdGhlcndpc2UsIHRoZSBhcHByb3ByaWF0ZSBlbnRyaWVzIGluIHRoZSBjb25maWcgZmlsZSBhcmUgcGFyc2VkIGFuZCBwYXNzZWQgYWNjb3JkaW5nbHkgKGlmIGV4aXN0YW50KS5cbi8vL1xuLy8vIFJldHVybnM6IGBib29sZWFuYCwgcmVwcmVzZW50aW5nIHdoZXRoZXIgdGhlIHJlcXVlc3Qgd2FzIG1hZGUuXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2NvbmZpZyhzbHVnLCBjb21taXRpc2gsIGNhbGxiYWNrKSB7XG5cdGlmKGNhbGxiYWNrICYmIGNvbW1pdGlzaCAmJiBzbHVnICYmIHNsdWcubmFtZSAmJiBzbHVnLnJlcG8pIHtcblx0XHRsZXQgdXJsICAgICA9IGAvL3Jhd2Nkbi5naXRoYWNrLmNvbS8ke3NsdWcubmFtZX0vJHtzbHVnLnJlcG99LyR7Y29tbWl0aXNofS9yZWxlYXNlLWZyb250Lmpzb25gO1xuICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHVybCk7XG5cdFx0Ly8gVXNpbmcgVXNlci1BZ2VudCBmcm9tIGJyb3dzZXJzIGRvZXNuJ3Qgd29yayBhcHBhcmVudGx5IDp2XG5cdFx0Ly8gcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKFwiVXNlci1BZ2VudFwiLCBgcmVsZWFzZS1mcm9udC9SRUxFQVNFX0ZST05UX1ZFUlNJT05fU1RSYCk7XG5cblx0XHRyZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsICgpID0+IHtcblx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA+PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgPCAzMDApIHtcblx0XHRcdFx0XHQvLyBGRiBkb2Vzbid0IHNlZW0gdG8gYXV0by1kZWNvZGUgSlNPTlxuXHRcdFx0XHRcdGxldCByZXNwb25zZSA9IHR5cGVvZiByZXF1ZXN0LnJlc3BvbnNlID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlKSA6IHJlcXVlc3QucmVzcG9uc2U7XG5cdFx0XHRcdFx0aWYodHlwZW9mIHJlc3BvbnNlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHRsZXQgbG9nb191cmwgPSByZXNwb25zZS5sb2dvIHx8IHJlc3BvbnNlLmxvZ29fdXJsO1xuXHRcdFx0XHRcdFx0aWYodHlwZW9mIGxvZ29fdXJsID09PSBcInN0cmluZ1wiICYmIGxvZ29fdXJsLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRpZihsb2dvX3VybC5pbmRleE9mKFwiLy9cIikgPT09IC0xKVxuXHRcdFx0XHRcdFx0XHRcdGxvZ29fdXJsID0gYC8vcmF3Y2RuLmdpdGhhY2suY29tLyR7c2x1Zy5uYW1lfS8ke3NsdWcucmVwb30vJHtjb21taXRpc2h9LyR7bG9nb191cmx9YDtcblx0XHRcdFx0XHRcdH0gZWxzZVxuXHRcdFx0XHRcdFx0XHRsb2dvX3VybCA9IG51bGw7XG5cblx0XHRcdFx0XHRcdGxldCBwbGF0Zm9ybV9uYW1lX292ZXJyaWRlID0gbnVsbDtcblx0XHRcdFx0XHRcdGxldCBhc3NldF9zcGVjICAgICAgICAgICAgID0gbnVsbDtcblx0XHRcdFx0XHRcdGxldCB1bml2ZXJzYWwgICAgICAgICAgICAgID0gcmVzcG9uc2UudW5pdmVyc2FsO1xuXHRcdFx0XHRcdFx0aWYodW5pdmVyc2FsID09PSB0cnVlKVxuXHRcdFx0XHRcdFx0XHRwbGF0Zm9ybV9uYW1lX292ZXJyaWRlID0gXCJ1bml2ZXJzYWxcIjtcblx0XHRcdFx0XHRcdGVsc2UgaWYodHlwZW9mIHVuaXZlcnNhbCA9PT0gXCJvYmplY3RcIiAmJiB1bml2ZXJzYWwgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0cGxhdGZvcm1fbmFtZV9vdmVycmlkZSA9IHN0cmluZ19vcih1bml2ZXJzYWwubmFtZSwgdW5pdmVyc2FsLnBsYXRmb3JtLCB1bml2ZXJzYWwucHNldWRvX3BsYXRmb3JtKVxuXG5cdFx0XHRcdFx0XHRcdCAgICBsZXQgYXNzID0gdW5pdmVyc2FsLmFzc2V0IHx8IHVuaXZlcnNhbC5hc3NldF9zcGVjO1xuXHRcdFx0XHRcdFx0XHRpZih0eXBlb2YgYXNzID09PSBcInN0cmluZ1wiICYmIGFzcy5sZW5ndGggIT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRhc3NldF9zcGVjID0ge307XG5cdFx0XHRcdFx0XHRcdFx0Zm9yKGxldCBwbmFtZSBvZiBQbGF0Zm9ybS5rZXlzKVxuXHRcdFx0XHRcdFx0XHRcdFx0YXNzZXRfc3BlY1twbmFtZV0gPSBhc3M7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYoYXNzZXRfc3BlYyA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRhc3NldF9zcGVjID0gcmVzcG9uc2UuYXNzZXRzIHx8IHJlc3BvbnNlLmFzc2V0X3NwZWMgfHwgbnVsbDtcblx0XHRcdFx0XHRcdFx0aWYodHlwZW9mIGFzc2V0X3NwZWMgPT09IFwib2JqZWN0XCIgJiYgYXNzZXRfc3BlYyAhPT0gbnVsbCkgIC8vIEJlY2F1c2UgbnVsbCBpcyBhbiBvYmplY3QsIG9idmlvdXNseVxuXHRcdFx0XHRcdFx0XHRcdGZvcihsZXQga2V5IGluIGFzc2V0X3NwZWMpXG5cdFx0XHRcdFx0XHRcdFx0XHRpZih0eXBlb2YgYXNzZXRfc3BlY1trZXldID09PSBcInN0cmluZ1wiICYmIGFzc2V0X3NwZWNba2V5XS5sZW5ndGggIT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGtleV9sY2FzZSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihrZXkgIT09IGtleV9sY2FzZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFzc2V0X3NwZWNba2V5X2xjYXNlXSA9IGFzc2V0X3NwZWNba2V5XTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgYXNzZXRfc3BlY1trZXldO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYoYXNzZXRfc3BlY1trZXldICE9PSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgYXNzZXRfc3BlY1trZXldO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhc3NldF9zcGVjID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobG9nb191cmwsIGFzc2V0X3NwZWMsIHBsYXRmb3JtX25hbWVfb3ZlcnJpZGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhbGxiYWNrKG51bGwsIG51bGwsIG51bGwpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmVxdWVzdC5zZW5kKCk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlXG5cdFx0cmV0dXJuIGZhbHNlO1xufVxuIl19
