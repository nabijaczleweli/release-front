/*!
 * release-front <https://github.com/nabijaczleweli/release-front>
 * Copyright 2018 nabijaczleweli <https://nabijaczleweli.xyz>
 * Available under MIT license <https://opensource.org/licenses/mit>
 */
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "./util"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("./util"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.util);
		global.url = mod.exports;
	}
})(this, function (exports, _util) {
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
			var url_base = "//cdn.rawgit.com/" + slug.name + "/" + slug.repo + "/" + commitish;

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
			var url = "//cdn.rawgit.com/" + slug.name + "/" + slug.repo + "/" + commitish + "/release-front.json";
			var request = new XMLHttpRequest();
			request.open("GET", url);


			request.addEventListener("readystatechange", function () {
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status >= 200 && request.status < 300) {
						var response = typeof request.response === "string" ? JSON.parse(request.response) : request.response;
						if ((typeof response === "undefined" ? "undefined" : _typeof(response)) === "object") {
							var logo_url = response.logo || response.logo_url;
							if (typeof logo_url === "string") {
								if (logo_url.indexOf("//") === -1) logo_url = "//cdn.rawgit.com/" + slug.name + "/" + slug.repo + "/" + commitish + "/" + logo_url;
							} else logo_url = null;

							var asset_spec = response.assets || response.asset_spec;
							if ((typeof asset_spec === "undefined" ? "undefined" : _typeof(asset_spec)) === "object" && asset_spec !== null) for (var key in asset_spec) {
									if (typeof asset_spec[key] === "string" && asset_spec[key].length !== 0) {
										var key_lcase = key.toLowerCase();
										if (key !== key_lcase) {
											asset_spec[key_lcase] = asset_spec[key];
											delete asset_spec[key];
										}
									} else if (asset_spec[key] !== null) delete asset_spec[key];else asset_spec = null;
								}callback(logo_url, asset_spec);
							return;
						}
					}

					callback(null, null);
				}
			});

			request.send();

			return true;
		} else return false;
	}
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9qcy91cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBeUNnQixZLEdBQUEsWTtTQWVBLFMsR0FBQSxTO1NBaUJBLGMsR0FBQSxjO1NBb0NBLFMsR0FBQSxTO1NBcURBLFUsR0FBQSxVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeEloQixLQUFNLHFCQUFxQixnR0FBM0I7QUFDQSxLQUFNLG9CQUFxQixnQ0FBM0I7O0FBR0EsS0FBTSxvQkFBb0IsQ0FBQyxFQUFELEVBQUssU0FBTCxDQUExQjtBQUNBLEtBQU0sb0JBQW9CLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBMUI7QUFDQSxLQUFNLGtCQUFvQixDQUFDLEtBQUQsRUFBUSxLQUFSLENBQTFCOztBQVNPLFVBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QjtBQUNsQyxNQUFJLFNBQVMsbUJBQW1CLElBQW5CLENBQXdCLElBQXhCLEtBQWlDLEVBQTlDO0FBQ0EsU0FBTyxLQUFQOztBQUVBLFNBQU87QUFDTixTQUFNLE9BQU8sQ0FBUCxLQUFhLElBRGI7QUFFTixTQUFNLE9BQU8sQ0FBUCxLQUFhO0FBRmIsR0FBUDtBQUlBOztBQU9NLFVBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QjtBQUMvQixNQUFHLFFBQVEsS0FBSyxJQUFiLElBQXFCLEtBQUssSUFBN0IsRUFDQyxPQUFVLEtBQUssSUFBZixTQUF1QixLQUFLLElBQTVCLENBREQsS0FHQyxPQUFPLElBQVA7QUFDRDs7QUFZTSxVQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsUUFBOUIsRUFBd0M7QUFDOUMsTUFBRyxZQUFZLElBQVosSUFBb0IsS0FBSyxJQUF6QixJQUFpQyxLQUFLLElBQXpDLEVBQStDO0FBQzlDLE9BQUksa0NBQWdDLEtBQUssSUFBckMsU0FBNkMsS0FBSyxJQUFsRCxxQkFBSjs7QUFFQSxPQUFJLFVBQVUsSUFBSSxjQUFKLEVBQWQ7QUFDQSxXQUFRLElBQVIsQ0FBYSxLQUFiLEVBQW9CLEdBQXBCOztBQUdBLFdBQVEsZ0JBQVIsQ0FBeUIsUUFBekIsRUFBbUMsaUJBQW5DO0FBQ0EsV0FBUSxnQkFBUixDQUF5QixrQkFBekI7O0FBRUEsV0FBUSxnQkFBUixDQUF5QixrQkFBekIsRUFBNkMsWUFBTTtBQUNsRCxRQUFHLFFBQVEsVUFBUixLQUF1QixlQUFlLElBQXpDLEVBQStDO0FBRTlDLFNBQUksV0FBVyxPQUFPLFFBQVEsUUFBZixLQUE0QixRQUE1QixHQUF1QyxLQUFLLEtBQUwsQ0FBVyxRQUFRLFFBQW5CLENBQXZDLEdBQXNFLFFBQVEsUUFBN0Y7QUFDQSxjQUFTLFFBQVEsTUFBakIsRUFBeUIsUUFBekI7QUFDQTtBQUNELElBTkQ7QUFPQSxXQUFRLElBQVI7O0FBRUEsVUFBTyxJQUFQO0FBQ0EsR0FwQkQsTUFxQkMsT0FBTyxLQUFQO0FBQ0Q7O0FBYU0sVUFBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCLFNBQXpCLEVBQW9DLFFBQXBDLEVBQThDO0FBQ3BELE1BQUcsWUFBWSxTQUFaLElBQXlCLElBQXpCLElBQWlDLEtBQUssSUFBdEMsSUFBOEMsS0FBSyxJQUF0RCxFQUE0RDtBQUMzRCxPQUFJLGlDQUErQixLQUFLLElBQXBDLFNBQTRDLEtBQUssSUFBakQsU0FBeUQsU0FBN0Q7O0FBRUEsT0FBSSxlQUFnQixxQkFBVSxpQkFBVixFQUE2QixpQkFBN0IsRUFBZ0QsZUFBaEQsQ0FBcEI7QUFDQSxPQUFJLGdCQUFnQixhQUFhLE1BQWpDOztBQUVBLE9BQUksV0FBVyxhQUFhLEdBQWIsQ0FBaUIsZ0JBQTZCO0FBQUE7QUFBQSxRQUEzQixJQUEyQjtBQUFBLFFBQXJCLElBQXFCO0FBQUEsUUFBZixTQUFlOztBQUM1RCxRQUFJLE1BQWEsUUFBYixTQUF5QixJQUF6QixHQUFnQyxJQUFoQyxTQUF3QyxTQUE1QztBQUNHLFFBQUksVUFBVSxJQUFJLGNBQUosRUFBZDtBQUNILFlBQVEsSUFBUixDQUFhLEtBQWIsRUFBb0IsR0FBcEI7OztBQUlBLFFBQUksVUFBVSxLQUFkO0FBQ0EsWUFBUSxnQkFBUixDQUF5QixrQkFBekIsRUFBNkMsWUFBTTtBQUNsRCxTQUFHLENBQUMsT0FBRCxJQUFZLGtCQUFrQixDQUE5QixJQUFtQyxRQUFRLFVBQVIsSUFBc0IsZUFBZSxnQkFBM0UsRUFBNkY7QUFDNUYsZ0JBQVUsSUFBVjs7QUFFQSxVQUFJLFNBQVMsUUFBUSxNQUFSLEdBQWlCLENBQTlCOztBQUVBLGNBQVEsS0FBUjtBQUNBLFFBQUUsYUFBRjs7QUFFQSxVQUFHLFVBQVUsR0FBVixJQUFpQixTQUFTLEdBQTdCLEVBQWtDO0FBQ2pDLHVCQUFnQixDQUFDLENBQWpCO0FBQ0EsZ0JBQVMsT0FBVCxDQUFpQjtBQUFBLGVBQUssRUFBRSxLQUFGLEVBQUw7QUFBQSxRQUFqQjtBQUNBLGdCQUFTLEdBQVQ7QUFDQSxPQUpELE1BSU8sSUFBRyxrQkFBa0IsQ0FBckIsRUFDTixTQUFTLElBQVQ7QUFDRDtBQUNELEtBaEJEO0FBaUJBLFlBQVEsSUFBUjs7QUFFQSxXQUFPLE9BQVA7QUFDQSxJQTVCYyxDQUFmOztBQThCQSxVQUFPLElBQVA7QUFDQSxHQXJDRCxNQXNDQyxPQUFPLEtBQVA7QUFDRDs7QUFhTSxVQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsU0FBMUIsRUFBcUMsUUFBckMsRUFBK0M7QUFDckQsTUFBRyxZQUFZLFNBQVosSUFBeUIsSUFBekIsSUFBaUMsS0FBSyxJQUF0QyxJQUE4QyxLQUFLLElBQXRELEVBQTREO0FBQzNELE9BQUksNEJBQThCLEtBQUssSUFBbkMsU0FBMkMsS0FBSyxJQUFoRCxTQUF3RCxTQUF4RCx3QkFBSjtBQUNFLE9BQUksVUFBVSxJQUFJLGNBQUosRUFBZDtBQUNGLFdBQVEsSUFBUixDQUFhLEtBQWIsRUFBb0IsR0FBcEI7OztBQUlBLFdBQVEsZ0JBQVIsQ0FBeUIsa0JBQXpCLEVBQTZDLFlBQU07QUFDbEQsUUFBRyxRQUFRLFVBQVIsS0FBdUIsZUFBZSxJQUF6QyxFQUErQztBQUM5QyxTQUFHLFFBQVEsTUFBUixJQUFrQixHQUFsQixJQUF5QixRQUFRLE1BQVIsR0FBaUIsR0FBN0MsRUFBa0Q7QUFFakQsVUFBSSxXQUFXLE9BQU8sUUFBUSxRQUFmLEtBQTRCLFFBQTVCLEdBQXVDLEtBQUssS0FBTCxDQUFXLFFBQVEsUUFBbkIsQ0FBdkMsR0FBc0UsUUFBUSxRQUE3RjtBQUNBLFVBQUcsUUFBTyxRQUFQLHlDQUFPLFFBQVAsT0FBb0IsUUFBdkIsRUFBaUM7QUFDaEMsV0FBSSxXQUFXLFNBQVMsSUFBVCxJQUFpQixTQUFTLFFBQXpDO0FBQ0EsV0FBRyxPQUFPLFFBQVAsS0FBb0IsUUFBdkIsRUFBaUM7QUFDaEMsWUFBRyxTQUFTLE9BQVQsQ0FBaUIsSUFBakIsTUFBMkIsQ0FBQyxDQUEvQixFQUNDLGlDQUErQixLQUFLLElBQXBDLFNBQTRDLEtBQUssSUFBakQsU0FBeUQsU0FBekQsU0FBc0UsUUFBdEU7QUFDRCxRQUhELE1BSUMsV0FBVyxJQUFYOztBQUVELFdBQUksYUFBYSxTQUFTLE1BQVQsSUFBbUIsU0FBUyxVQUE3QztBQUNBLFdBQUcsUUFBTyxVQUFQLHlDQUFPLFVBQVAsT0FBc0IsUUFBdEIsSUFBa0MsZUFBZSxJQUFwRCxFQUNDLEtBQUksSUFBSSxHQUFSLElBQWUsVUFBZjtBQUNDLGFBQUcsT0FBTyxXQUFXLEdBQVgsQ0FBUCxLQUEyQixRQUEzQixJQUF1QyxXQUFXLEdBQVgsRUFBZ0IsTUFBaEIsS0FBMkIsQ0FBckUsRUFBd0U7QUFDdkUsY0FBSSxZQUFZLElBQUksV0FBSixFQUFoQjtBQUNBLGNBQUcsUUFBUSxTQUFYLEVBQXNCO0FBQ3JCLHNCQUFXLFNBQVgsSUFBd0IsV0FBVyxHQUFYLENBQXhCO0FBQ0Esa0JBQU8sV0FBVyxHQUFYLENBQVA7QUFDQTtBQUNELFVBTkQsTUFNTyxJQUFHLFdBQVcsR0FBWCxNQUFvQixJQUF2QixFQUNOLE9BQU8sV0FBVyxHQUFYLENBQVAsQ0FETSxLQUdSLGFBQWEsSUFBYjtBQVZBLFNBWUQsU0FBUyxRQUFULEVBQW1CLFVBQW5CO0FBQ0E7QUFDQTtBQUNEOztBQUVELGNBQVMsSUFBVCxFQUFlLElBQWY7QUFDQTtBQUNELElBbENEOztBQW9DQSxXQUFRLElBQVI7O0FBRUEsVUFBTyxJQUFQO0FBQ0EsR0E5Q0QsTUErQ0MsT0FBTyxLQUFQO0FBQ0QiLCJmaWxlIjoic3Rkb3V0Iiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDE4IG5hYmlqYWN6bGV3ZWxpXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuLy8gY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4vLyBTT0ZUV0FSRS5cblxuXG5pbXBvcnQge2NhcnRlc2lhbn0gZnJvbSBcIi4vdXRpbFwiO1xuXG5cbmNvbnN0IEVYVFJBQ1RfU0xVR19SRUdFWCA9IC9eKD86KD86KD86KD86KD86aHR0cCg/OnMpPzopP1xcL1xcLyk/Z2l0aHViXFwuY29tXFwvKT8pfFxcPykoW2EtekEtWjAtOS1fLl0rKVxcLyhbYS16QS1aMC05LV8uXSspLiovaTtcbmNvbnN0IEdJVEhVQl9BUElfQUNDRVBUICA9IFwiYXBwbGljYXRpb24vdm5kLmdpdGh1Yi52Mytqc29uXCI7XG5cbi8vIFJlbWVtYmVyIHRvIHVwZGF0ZSBpbiBSRUFETUUubWRcbmNvbnN0IExPR09fU0VBUkNIX1BBVEhTID0gW1wiXCIsIFwiYXNzZXRzL1wiXTtcbmNvbnN0IExPR09fU0VBUkNIX05BTUVTID0gW1wibG9nb1wiLCBcImljb25cIl07XG5jb25zdCBMT0dPX0VYVEVOU0lPTlMgICA9IFtcInBuZ1wiLCBcImpwZ1wiXTtcblxuXG4vLy8gR2V0IHJlcG9zaXRvcnkgc2x1ZyBpbmZvcm1hdGlvbiBmcm9tIHRoZSBzdXBwbGllZCBzdHJpbmcg4oCTIHNvbWV0aGluZyBhIHVzZXIgbWlnaHQgcGFzdGUgaW4sIG9yIGFuIHVuZmlsdGVyZWQgcXVlcnkgc3RyaW5nLlxuLy8vXG4vLy8gQXJndW1lbnRzOiBgZGF0YWA6IGBzdHJpbmdgIOKAkyB3aGVyZWluIHRoZSByZXBvc2l0b3J5IHNsdWcgaXMgY29udGFpbmVkLlxuLy8vXG4vLy8gUmV0dXJuczogYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmc/LCBzdHJpbmc/fWAsIHdoZXJlIGJvdGggYG5hbWVgIGFuZCBgcmVwb2AgYXJlIHRoZSByZXNwZWN0aXZlIHBhcnRzIG9mIHRoZSByZXBvc2l0b3J5IHNsdWcgb3IgYG51bGxgLCBpZiBub3Rcbi8vLyBmb3VuZC5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0X3NsdWcoZGF0YSkge1xuXHRsZXQgc291Z2h0ID0gRVhUUkFDVF9TTFVHX1JFR0VYLmV4ZWMoZGF0YSkgfHwgW107XG5cdHNvdWdodC5zaGlmdCgpOyAgLy8gRHJvcCB3aG9sZSBzdHJpbmdcblxuXHRyZXR1cm4ge1xuXHRcdG5hbWU6IHNvdWdodFswXSB8fCBudWxsLFxuXHRcdHJlcG86IHNvdWdodFsxXSB8fCBudWxsLFxuXHR9O1xufVxuXG4vLy8gR2V0IHJlcG9zaXRvcnkgc2x1ZyBzdHJpbmcgZnJvbSB0aGUgcmVzcGVjdGl2ZSBvYmplY3QsXG4vLy9cbi8vLyBBcmd1bWVudHM6IGBvYmplY3RgIOKAkyBge25hbWUsIHJlcG99OiB7c3RyaW5nLCBzdHJpbmd9YCwgd2hlcmUgYm90aCBgbmFtZWAgYW5kIGByZXBvYCBhcmUgdGhlIHJlc3BlY3RpdmUgcGFydHMgb2YgdGhlIHJlcG9zaXRvcnkgc2x1Zy5cbi8vL1xuLy8vIFJldHVybnM6IGBzdHJpbmc/YCwgcmVwcmVzZW50aW5nIHRoZSBub3JtYWxpc2VkIGZvcm0gb2YgdGhlIHJlcG8gc2x1Zywgb3IgYG51bGxgLCBpZiBzdXBwbGllZCBvYmplY3Qgd2FzIGludmFsaWQuXG5leHBvcnQgZnVuY3Rpb24gZnVsbF9uYW1lKHNsdWcpIHtcblx0aWYoc2x1ZyAmJiBzbHVnLm5hbWUgJiYgc2x1Zy5yZXBvKVxuXHRcdHJldHVybiBgJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfWA7XG5cdGVsc2Vcblx0XHRyZXR1cm4gbnVsbDtcbn1cblxuLy8vIEFjcXVpcmUgdGhlIGxhdGVzdCByZWxlYXNlIGRhdGEgZnJvbSB0aGUgc3BlY2lmaWVkIHJlcG9zaXRvcnkuXG4vLy9cbi8vLyBBcmd1bWVudHM6XG4vLy8gICAqIGBzbHVnYCDigJMgYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmcsIHN0cmluZ31gLCB3aGVyZSBib3RoIGBuYW1lYCBhbmQgYHJlcG9gIGFyZSB0aGUgcmVzcGVjdGl2ZSBwYXJ0cyBvZiB0aGUgcmVxdWVzdGVkIHJlcG9zaXRvcnkgc2x1Zy5cbi8vLyAgICogYGNhbGxiYWNrYCDigJMgYGZ1bmN0aW9uKHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogb2JqZWN0KWAg4oCTXG4vLy8gICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSByZXF1ZXN0IGlzIGZpbmlzaGVkLCB3aGVyZSBgc3RhdHVzYCBpcyB0aGUgcmVzcG9uc2Ugc3RhdHVzIChgMjAwYC9gNDA0YC9ldGMuKSxcbi8vLyAgICAgICAgICAgICAgICAgICBhbmQgYHJlc3BvbnNlYCBpcyBhbiBvYmplY3QgaW4gdGhlIGZvcm1hdCByZXR1cm5lZCBieSB0aGVcbi8vLyAgICAgICAgICAgICAgICAgICBbR2l0SHViIEFQSSB2M10oaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9yZWxlYXNlcy8jZ2V0LXRoZS1sYXRlc3QtcmVsZWFzZSkuXG4vLy9cbi8vLyBSZXR1cm5zOiBgYm9vbGVhbmAsIHJlcHJlc2VudGluZyB3aGV0aGVyIHRoZSByZXF1ZXN0IHdhcyBtYWRlLlxuZXhwb3J0IGZ1bmN0aW9uIGxhdGVzdF9yZWxlYXNlKHNsdWcsIGNhbGxiYWNrKSB7XG5cdGlmKGNhbGxiYWNrICYmIHNsdWcgJiYgc2x1Zy5uYW1lICYmIHNsdWcucmVwbykge1xuXHRcdGxldCB1cmwgPSBgLy9hcGkuZ2l0aHViLmNvbS9yZXBvcy8ke3NsdWcubmFtZX0vJHtzbHVnLnJlcG99L3JlbGVhc2VzL2xhdGVzdGA7XG5cblx0XHRsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwpO1xuXHRcdC8vIFVzaW5nIFVzZXItQWdlbnQgZnJvbSBicm93c2VycyBkb2Vzbid0IHdvcmsgYXBwYXJlbnRseSA6dlxuXHRcdC8vIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIlVzZXItQWdlbnRcIiwgYHJlbGVhc2UtZnJvbnQvUkVMRUFTRV9GUk9OVF9WRVJTSU9OX1NUUmApO1xuXHRcdHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBHSVRIVUJfQVBJX0FDQ0VQVCk7XG5cdFx0cmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKTtcblxuXHRcdHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgKCkgPT4ge1xuXHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG5cdFx0XHRcdC8vIEZGIGRvZXNuJ3Qgc2VlbSB0byBhdXRvLWRlY29kZSBKU09OXG5cdFx0XHRcdGxldCByZXNwb25zZSA9IHR5cGVvZiByZXF1ZXN0LnJlc3BvbnNlID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlKSA6IHJlcXVlc3QucmVzcG9uc2U7XG5cdFx0XHRcdGNhbGxiYWNrKHJlcXVlc3Quc3RhdHVzLCByZXNwb25zZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmVxdWVzdC5zZW5kKCk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlXG5cdFx0cmV0dXJuIGZhbHNlO1xufVxuXG4vLy8gU2VhcmNoIGZvciBhIGxvZ28gZmlsZSBpbiB0aGUgcmVwb3NpdG9yeSB1bmRlciB0aGUgc3BlY2lmaWVkIGNvbW1pdGlzaC5cbi8vL1xuLy8vIEFyZ3VtZW50czpcbi8vLyAgICogYHNsdWdgIOKAkyBgb2JqZWN0YCDigJMgYHtuYW1lLCByZXBvfToge3N0cmluZywgc3RyaW5nfWAsIHdoZXJlIGJvdGggYG5hbWVgIGFuZCBgcmVwb2AgYXJlIHRoZSByZXNwZWN0aXZlIHBhcnRzIG9mIHRoZSByZXF1ZXN0ZWQgcmVwb3NpdG9yeSBzbHVnLlxuLy8vICAgKiBgY29tbWl0aXNoYCDigJMgYHN0cmluZ2Ag4oCTIHRhZy9jb21taXQvYnJhbmNoIHRvIGxvb2sgaW4uXG4vLy8gICAqIGBjYWxsYmFja2Ag4oCTIGBmdW5jdGlvbih1cmw6IHN0cmluZz8pYCDigJNcbi8vLyAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjYWxsZWRcbi8vLyAgICAgICAgICAgICAgICAgICAoYSkgd2l0aCB0aGUgbG9nbyB1cmwgd2hlbiBlaXRoZXIgYSBsb2dvIHdhcyBmb3VuZCBvclxuLy8vICAgICAgICAgICAgICAgICAgIChiKSB3aXRoIGBudWxsYCB3aGVuIGFsbCBzZWFyY2ggcGF0aHMgZXJyb3JlZC5cbi8vL1xuLy8vIFJldHVybnM6IGBib29sZWFuYCwgcmVwcmVzZW50aW5nIHdoZXRoZXIgdGhlIHJlcXVlc3RzIHdlcmUgbWFkZS5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2xvZ28oc2x1ZywgY29tbWl0aXNoLCBjYWxsYmFjaykge1xuXHRpZihjYWxsYmFjayAmJiBjb21taXRpc2ggJiYgc2x1ZyAmJiBzbHVnLm5hbWUgJiYgc2x1Zy5yZXBvKSB7XG5cdFx0bGV0IHVybF9iYXNlID0gYC8vY2RuLnJhd2dpdC5jb20vJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfS8ke2NvbW1pdGlzaH1gO1xuXG5cdFx0bGV0IGxvZ29fb3B0aW9ucyAgPSBjYXJ0ZXNpYW4oTE9HT19TRUFSQ0hfUEFUSFMsIExPR09fU0VBUkNIX05BTUVTLCBMT0dPX0VYVEVOU0lPTlMpO1xuXHRcdGxldCByZXF1ZXN0c19sZWZ0ID0gbG9nb19vcHRpb25zLmxlbmd0aDtcblxuXHRcdGxldCByZXF1ZXN0cyA9IGxvZ29fb3B0aW9ucy5tYXAoKFtwYXRoLCBuYW1lLCBleHRlbnNpb25dKSA9PiB7XG5cdFx0XHRsZXQgdXJsICAgICA9IGAke3VybF9iYXNlfS8ke3BhdGh9JHtuYW1lfS4ke2V4dGVuc2lvbn1gO1xuICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwpO1xuXHRcdFx0Ly8gVXNpbmcgVXNlci1BZ2VudCBmcm9tIGJyb3dzZXJzIGRvZXNuJ3Qgd29yayBhcHBhcmVudGx5IDp2XG5cdFx0XHQvLyByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJVc2VyLUFnZW50XCIsIGByZWxlYXNlLWZyb250L1JFTEVBU0VfRlJPTlRfVkVSU0lPTl9TVFJgKTtcblxuXHRcdFx0bGV0IGFib3J0ZWQgPSBmYWxzZTtcblx0XHRcdHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgKCkgPT4ge1xuXHRcdFx0XHRpZighYWJvcnRlZCAmJiByZXF1ZXN0c19sZWZ0ICE9PSAwICYmIHJlcXVlc3QucmVhZHlTdGF0ZSA+PSBYTUxIdHRwUmVxdWVzdC5IRUFERVJTX1JFQ0VJVkVEKSB7XG5cdFx0XHRcdFx0YWJvcnRlZCA9IHRydWU7ICAvLyBkbyB0aGlzIEFTQVBcblxuXHRcdFx0XHRcdGxldCBzdGF0dXMgPSByZXF1ZXN0LnN0YXR1cyB8IDA7ICAvLyB8IDAgdG8gbWFrZSBhIGNvcHlcblxuXHRcdFx0XHRcdHJlcXVlc3QuYWJvcnQoKTtcblx0XHRcdFx0XHQtLXJlcXVlc3RzX2xlZnQ7XG5cblx0XHRcdFx0XHRpZihzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCkge1xuXHRcdFx0XHRcdFx0cmVxdWVzdHNfbGVmdCA9IC0xOyAgLy8gRG9uJ3QgYWxsb3cgYW55IG90aGVyIHRocmVhZHMgdG8gdHJpZ2dlciBgbnVsbGAgY2FzZVxuXHRcdFx0XHRcdFx0cmVxdWVzdHMuZm9yRWFjaChfID0+IF8uYWJvcnQoKSk7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayh1cmwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0c19sZWZ0ID09PSAwKVxuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmVxdWVzdC5zZW5kKCk7XG5cblx0XHRcdHJldHVybiByZXF1ZXN0O1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZWxzZVxuXHRcdHJldHVybiBmYWxzZTtcbn1cblxuLy8vIEdldCBhbmQgZGVjb25zdHJ1Y3QgdGhlIHJlcG8ncyBjb25maWd1cmF0aW9uLCBpZiBhbnkuXG4vLy9cbi8vLyBBcmd1bWVudHM6XG4vLy8gICAqIGBzbHVnYCDigJMgYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmcsIHN0cmluZ31gLCB3aGVyZSBib3RoIGBuYW1lYCBhbmQgYHJlcG9gIGFyZSB0aGUgcmVzcGVjdGl2ZSBwYXJ0cyBvZiB0aGUgcmVxdWVzdGVkIHJlcG9zaXRvcnkgc2x1Zy5cbi8vLyAgICogYGNvbW1pdGlzaGAg4oCTIGBzdHJpbmdgIOKAkyB0YWcvY29tbWl0L2JyYW5jaCB0byBsb29rIGluLlxuLy8vICAgKiBgY2FsbGJhY2tgIOKAkyBgZnVuY3Rpb24obG9nb191cmw6IHN0cmluZz8sIGFzc2V0X3NwZWM6IG9iamVjdD8pYCwgYGFzc2V0X3NwZWM6IHtbcGxhdGZvcm0gbmFtZTogdGVtcGxhdGUgc3RyaW5nXX1gIOKAk1xuLy8vICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHJlcXVlc3QgaXMgY29tcGxldGUuXG4vLy8gICAgICAgICAgICAgICAgICAgSWYgdGhlIHJlcXVlc3QgcmV0dXJucyBhbiBlcnJvciBib3RoIGFyZ3VtZW50cyBhcmUgYG51bGxgLlxuLy8vICAgICAgICAgICAgICAgICAgIE90aGVyd2lzZSwgdGhlIGFwcHJvcHJpYXRlIGVudHJpZXMgaW4gdGhlIGNvbmZpZyBmaWxlIGFyZSBwYXJzZWQgYW5kIHBhc3NlZCBhY2NvcmRpbmdseSAoaWYgZXhpc3RhbnQpLlxuLy8vXG4vLy8gUmV0dXJuczogYGJvb2xlYW5gLCByZXByZXNlbnRpbmcgd2hldGhlciB0aGUgcmVxdWVzdCB3YXMgbWFkZS5cbmV4cG9ydCBmdW5jdGlvbiBnZXRfY29uZmlnKHNsdWcsIGNvbW1pdGlzaCwgY2FsbGJhY2spIHtcblx0aWYoY2FsbGJhY2sgJiYgY29tbWl0aXNoICYmIHNsdWcgJiYgc2x1Zy5uYW1lICYmIHNsdWcucmVwbykge1xuXHRcdGxldCB1cmwgICAgID0gYC8vY2RuLnJhd2dpdC5jb20vJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfS8ke2NvbW1pdGlzaH0vcmVsZWFzZS1mcm9udC5qc29uYDtcbiAgICBsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwpO1xuXHRcdC8vIFVzaW5nIFVzZXItQWdlbnQgZnJvbSBicm93c2VycyBkb2Vzbid0IHdvcmsgYXBwYXJlbnRseSA6dlxuXHRcdC8vIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIlVzZXItQWdlbnRcIiwgYHJlbGVhc2UtZnJvbnQvUkVMRUFTRV9GUk9OVF9WRVJTSU9OX1NUUmApO1xuXG5cdFx0cmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLCAoKSA9PiB7XG5cdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcblx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPj0gMjAwICYmIHJlcXVlc3Quc3RhdHVzIDwgMzAwKSB7XG5cdFx0XHRcdFx0Ly8gRkYgZG9lc24ndCBzZWVtIHRvIGF1dG8tZGVjb2RlIEpTT05cblx0XHRcdFx0XHRsZXQgcmVzcG9uc2UgPSB0eXBlb2YgcmVxdWVzdC5yZXNwb25zZSA9PT0gXCJzdHJpbmdcIiA/IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZSkgOiByZXF1ZXN0LnJlc3BvbnNlO1xuXHRcdFx0XHRcdGlmKHR5cGVvZiByZXNwb25zZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdFx0bGV0IGxvZ29fdXJsID0gcmVzcG9uc2UubG9nbyB8fCByZXNwb25zZS5sb2dvX3VybDtcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiBsb2dvX3VybCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdFx0XHRpZihsb2dvX3VybC5pbmRleE9mKFwiLy9cIikgPT09IC0xKVxuXHRcdFx0XHRcdFx0XHRcdGxvZ29fdXJsID0gYC8vY2RuLnJhd2dpdC5jb20vJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfS8ke2NvbW1pdGlzaH0vJHtsb2dvX3VybH1gO1xuXHRcdFx0XHRcdFx0fSBlbHNlXG5cdFx0XHRcdFx0XHRcdGxvZ29fdXJsID0gbnVsbDtcblxuXHRcdFx0XHRcdFx0bGV0IGFzc2V0X3NwZWMgPSByZXNwb25zZS5hc3NldHMgfHwgcmVzcG9uc2UuYXNzZXRfc3BlYztcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiBhc3NldF9zcGVjID09PSBcIm9iamVjdFwiICYmIGFzc2V0X3NwZWMgIT09IG51bGwpICAvLyBCZWNhdXNlIG51bGwgaXMgYW4gb2JqZWN0LCBvYnZpb3VzbHlcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBrZXkgaW4gYXNzZXRfc3BlYylcblx0XHRcdFx0XHRcdFx0XHRpZih0eXBlb2YgYXNzZXRfc3BlY1trZXldID09PSBcInN0cmluZ1wiICYmIGFzc2V0X3NwZWNba2V5XS5sZW5ndGggIT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBrZXlfbGNhc2UgPSBrZXkudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKGtleSAhPT0ga2V5X2xjYXNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFzc2V0X3NwZWNba2V5X2xjYXNlXSA9IGFzc2V0X3NwZWNba2V5XTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGFzc2V0X3NwZWNba2V5XTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYoYXNzZXRfc3BlY1trZXldICE9PSBudWxsKVxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIGFzc2V0X3NwZWNba2V5XTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0YXNzZXRfc3BlYyA9IG51bGw7XG5cblx0XHRcdFx0XHRcdGNhbGxiYWNrKGxvZ29fdXJsLCBhc3NldF9zcGVjKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYWxsYmFjayhudWxsLCBudWxsKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZWxzZVxuXHRcdHJldHVybiBmYWxzZTtcbn1cbiJdfQ==
