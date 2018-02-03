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

			var requests = logo_options.map(function (_ref, idx) {
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
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEtBQWQ7QUFDQSxZQUFRLGdCQUFSLENBQXlCLGtCQUF6QixFQUE2QyxZQUFNO0FBQ2xELFNBQUcsQ0FBQyxPQUFELElBQVksa0JBQWtCLENBQTlCLElBQW1DLFFBQVEsVUFBUixJQUFzQixlQUFlLGdCQUEzRSxFQUE2RjtBQUM1RixnQkFBVSxJQUFWOztBQUVBLFVBQUksU0FBUyxRQUFRLE1BQVIsR0FBaUIsQ0FBOUI7O0FBRUEsY0FBUSxLQUFSO0FBQ0EsUUFBRSxhQUFGOztBQUVBLFVBQUcsVUFBVSxHQUFWLElBQWlCLFNBQVMsR0FBN0IsRUFBa0M7QUFDakMsdUJBQWdCLENBQUMsQ0FBakI7QUFDQSxnQkFBUyxPQUFULENBQWlCO0FBQUEsZUFBSyxFQUFFLEtBQUYsRUFBTDtBQUFBLFFBQWpCO0FBQ0EsZ0JBQVMsR0FBVDtBQUNBLE9BSkQsTUFJTyxJQUFHLGtCQUFrQixDQUFyQixFQUNOLFNBQVMsSUFBVDtBQUNEO0FBQ0QsS0FoQkQ7QUFpQkEsWUFBUSxJQUFSOztBQUVBLFdBQU8sT0FBUDtBQUNBLElBNUJjLENBQWY7O0FBOEJBLFVBQU8sSUFBUDtBQUNBLEdBckNELE1Bc0NDLE9BQU8sS0FBUDtBQUNEIiwiZmlsZSI6InN0ZG91dCIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAxOCBuYWJpamFjemxld2VsaVxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbi8vIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuLy8gU09GVFdBUkUuXG5cblxuaW1wb3J0IHtjYXJ0ZXNpYW59IGZyb20gXCIuL3V0aWxcIjtcblxuXG5jb25zdCBFWFRSQUNUX1NMVUdfUkVHRVggPSAvXig/Oig/Oig/Oig/Oig/Omh0dHAoPzpzKT86KT9cXC9cXC8pP2dpdGh1YlxcLmNvbVxcLyk/KXxcXD8pKFthLXpBLVowLTktXy5dKylcXC8oW2EtekEtWjAtOS1fLl0rKS4qL2k7XG5jb25zdCBHSVRIVUJfQVBJX0FDQ0VQVCAgPSBcImFwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMranNvblwiO1xuXG4vLyBSZW1lbWJlciB0byB1cGRhdGUgaW4gUkVBRE1FLm1kXG5jb25zdCBMT0dPX1NFQVJDSF9QQVRIUyA9IFtcIlwiLCBcImFzc2V0cy9cIl07XG5jb25zdCBMT0dPX1NFQVJDSF9OQU1FUyA9IFtcImxvZ29cIiwgXCJpY29uXCJdO1xuY29uc3QgTE9HT19FWFRFTlNJT05TICAgPSBbXCJwbmdcIiwgXCJqcGdcIl07XG5cblxuLy8vIEdldCByZXBvc2l0b3J5IHNsdWcgaW5mb3JtYXRpb24gZnJvbSB0aGUgc3VwcGxpZWQgc3RyaW5nIOKAkyBzb21ldGhpbmcgYSB1c2VyIG1pZ2h0IHBhc3RlIGluLCBvciBhbiB1bmZpbHRlcmVkIHF1ZXJ5IHN0cmluZy5cbi8vL1xuLy8vIEFyZ3VtZW50czogYGRhdGFgOiBgc3RyaW5nYCDigJMgd2hlcmVpbiB0aGUgcmVwb3NpdG9yeSBzbHVnIGlzIGNvbnRhaW5lZC5cbi8vL1xuLy8vIFJldHVybnM6IGBvYmplY3RgIOKAkyBge25hbWUsIHJlcG99OiB7c3RyaW5nPywgc3RyaW5nP31gLCB3aGVyZSBib3RoIGBuYW1lYCBhbmQgYHJlcG9gIGFyZSB0aGUgcmVzcGVjdGl2ZSBwYXJ0cyBvZiB0aGUgcmVwb3NpdG9yeSBzbHVnIG9yIGBudWxsYCwgaWYgbm90XG4vLy8gZm91bmQuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdF9zbHVnKGRhdGEpIHtcblx0bGV0IHNvdWdodCA9IEVYVFJBQ1RfU0xVR19SRUdFWC5leGVjKGRhdGEpIHx8IFtdO1xuXHRzb3VnaHQuc2hpZnQoKTsgIC8vIERyb3Agd2hvbGUgc3RyaW5nXG5cblx0cmV0dXJuIHtcblx0XHRuYW1lOiBzb3VnaHRbMF0gfHwgbnVsbCxcblx0XHRyZXBvOiBzb3VnaHRbMV0gfHwgbnVsbCxcblx0fTtcbn1cblxuLy8vIEdldCByZXBvc2l0b3J5IHNsdWcgc3RyaW5nIGZyb20gdGhlIHJlc3BlY3RpdmUgb2JqZWN0LFxuLy8vXG4vLy8gQXJndW1lbnRzOiBgb2JqZWN0YCDigJMgYHtuYW1lLCByZXBvfToge3N0cmluZywgc3RyaW5nfWAsIHdoZXJlIGJvdGggYG5hbWVgIGFuZCBgcmVwb2AgYXJlIHRoZSByZXNwZWN0aXZlIHBhcnRzIG9mIHRoZSByZXBvc2l0b3J5IHNsdWcuXG4vLy9cbi8vLyBSZXR1cm5zOiBgc3RyaW5nP2AsIHJlcHJlc2VudGluZyB0aGUgbm9ybWFsaXNlZCBmb3JtIG9mIHRoZSByZXBvIHNsdWcsIG9yIGBudWxsYCwgaWYgc3VwcGxpZWQgb2JqZWN0IHdhcyBpbnZhbGlkLlxuZXhwb3J0IGZ1bmN0aW9uIGZ1bGxfbmFtZShzbHVnKSB7XG5cdGlmKHNsdWcgJiYgc2x1Zy5uYW1lICYmIHNsdWcucmVwbylcblx0XHRyZXR1cm4gYCR7c2x1Zy5uYW1lfS8ke3NsdWcucmVwb31gO1xuXHRlbHNlXG5cdFx0cmV0dXJuIG51bGw7XG59XG5cbi8vLyBBY3F1aXJlIHRoZSBsYXRlc3QgcmVsZWFzZSBkYXRhIGZyb20gdGhlIHNwZWNpZmllZCByZXBvc2l0b3J5LlxuLy8vXG4vLy8gQXJndW1lbnRzOlxuLy8vICAgKiBgc2x1Z2Ag4oCTIGBvYmplY3RgIOKAkyBge25hbWUsIHJlcG99OiB7c3RyaW5nLCBzdHJpbmd9YCwgd2hlcmUgYm90aCBgbmFtZWAgYW5kIGByZXBvYCBhcmUgdGhlIHJlc3BlY3RpdmUgcGFydHMgb2YgdGhlIHJlcXVlc3RlZCByZXBvc2l0b3J5IHNsdWcuXG4vLy8gICAqIGBjYWxsYmFja2Ag4oCTIGBmdW5jdGlvbihzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IG9iamVjdClgIOKAk1xuLy8vICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgcmVxdWVzdCBpcyBmaW5pc2hlZCwgd2hlcmUgYHN0YXR1c2AgaXMgdGhlIHJlc3BvbnNlIHN0YXR1cyAoYDIwMGAvYDQwNGAvZXRjLiksXG4vLy8gICAgICAgICAgICAgICAgICAgYW5kIGByZXNwb25zZWAgaXMgYW4gb2JqZWN0IGluIHRoZSBmb3JtYXQgcmV0dXJuZWQgYnkgdGhlXG4vLy8gICAgICAgICAgICAgICAgICAgW0dpdEh1YiBBUEkgdjNdKGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcmVsZWFzZXMvI2dldC10aGUtbGF0ZXN0LXJlbGVhc2UpLlxuLy8vXG4vLy8gUmV0dXJuczogYGJvb2xlYW5gLCByZXByZXNlbnRpbmcgd2hldGhlciB0aGUgcmVxdWVzdCB3YXMgbWFkZS5cbmV4cG9ydCBmdW5jdGlvbiBsYXRlc3RfcmVsZWFzZShzbHVnLCBjYWxsYmFjaykge1xuXHRpZihjYWxsYmFjayAmJiBzbHVnICYmIHNsdWcubmFtZSAmJiBzbHVnLnJlcG8pIHtcblx0XHRsZXQgdXJsID0gYC8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfS9yZWxlYXNlcy9sYXRlc3RgO1xuXG5cdFx0bGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsKTtcblx0XHQvLyBVc2luZyBVc2VyLUFnZW50IGZyb20gYnJvd3NlcnMgZG9lc24ndCB3b3JrIGFwcGFyZW50bHkgOnZcblx0XHQvLyByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJVc2VyLUFnZW50XCIsIGByZWxlYXNlLWZyb250L1JFTEVBU0VfRlJPTlRfVkVSU0lPTl9TVFJgKTtcblx0XHRyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgR0lUSFVCX0FQSV9BQ0NFUFQpO1xuXHRcdHJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL2pzb25cIik7XG5cblx0XHRyZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsICgpID0+IHtcblx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuXHRcdFx0XHQvLyBGRiBkb2Vzbid0IHNlZW0gdG8gYXV0by1kZWNvZGUgSlNPTlxuXHRcdFx0XHRsZXQgcmVzcG9uc2UgPSB0eXBlb2YgcmVxdWVzdC5yZXNwb25zZSA9PT0gXCJzdHJpbmdcIiA/IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZSkgOiByZXF1ZXN0LnJlc3BvbnNlO1xuXHRcdFx0XHRjYWxsYmFjayhyZXF1ZXN0LnN0YXR1cywgcmVzcG9uc2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZWxzZVxuXHRcdHJldHVybiBmYWxzZTtcbn1cblxuLy8vIFNlYXJjaCBmb3IgYSBsb2dvIGZpbGUgaW4gdGhlIHJlcG9zaXRvcnkgdW5kZXIgdGhlIHNwZWNpZmllZCBjb21taXRpc2guXG4vLy9cbi8vLyBBcmd1bWVudHM6XG4vLy8gICAqIGBzbHVnYCDigJMgYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmcsIHN0cmluZ31gLCB3aGVyZSBib3RoIGBuYW1lYCBhbmQgYHJlcG9gIGFyZSB0aGUgcmVzcGVjdGl2ZSBwYXJ0cyBvZiB0aGUgcmVxdWVzdGVkIHJlcG9zaXRvcnkgc2x1Zy5cbi8vLyAgICogYGNvbW1pdGlzaGAg4oCTIGBzdHJpbmdgIOKAkyB0YWcvY29tbWl0L2JyYW5jaCB0byBsb29rIGluLlxuLy8vICAgKiBgY2FsbGJhY2tgIOKAkyBgZnVuY3Rpb24odXJsOiBzdHJpbmc/KWAg4oCTXG4vLy8gICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gY2FsbGVkXG4vLy8gICAgICAgICAgICAgICAgICAgKGEpIHdpdGggdGhlIGxvZ28gdXJsIHdoZW4gZWl0aGVyIGEgbG9nbyB3YXMgZm91bmQgb3Jcbi8vLyAgICAgICAgICAgICAgICAgICAoYikgd2l0aCBgbnVsbGAgd2hlbiBhbGwgc2VhcmNoIHBhdGhzIGVycm9yZWQuXG4vLy9cbi8vLyBSZXR1cm5zOiBgYm9vbGVhbmAsIHJlcHJlc2VudGluZyB3aGV0aGVyIHRoZSByZXF1ZXN0cyB3ZXJlIG1hZGUuXG5leHBvcnQgZnVuY3Rpb24gZmluZF9sb2dvKHNsdWcsIGNvbW1pdGlzaCwgY2FsbGJhY2spIHtcblx0aWYoY2FsbGJhY2sgJiYgY29tbWl0aXNoICYmIHNsdWcgJiYgc2x1Zy5uYW1lICYmIHNsdWcucmVwbykge1xuXHRcdGxldCB1cmxfYmFzZSA9IGAvL2Nkbi5yYXdnaXQuY29tLyR7c2x1Zy5uYW1lfS8ke3NsdWcucmVwb30vJHtjb21taXRpc2h9YDtcblxuXHRcdGxldCBsb2dvX29wdGlvbnMgID0gY2FydGVzaWFuKExPR09fU0VBUkNIX1BBVEhTLCBMT0dPX1NFQVJDSF9OQU1FUywgTE9HT19FWFRFTlNJT05TKTtcblx0XHRsZXQgcmVxdWVzdHNfbGVmdCA9IGxvZ29fb3B0aW9ucy5sZW5ndGg7XG5cblx0XHRsZXQgcmVxdWVzdHMgPSBsb2dvX29wdGlvbnMubWFwKChbcGF0aCwgbmFtZSwgZXh0ZW5zaW9uXSwgaWR4KSA9PiB7XG5cdFx0XHRsZXQgdXJsICAgICA9IGAke3VybF9iYXNlfS8ke3BhdGh9JHtuYW1lfS4ke2V4dGVuc2lvbn1gO1xuICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwpO1xuXHRcdFx0Ly8gVXNpbmcgVXNlci1BZ2VudCBmcm9tIGJyb3dzZXJzIGRvZXNuJ3Qgd29yayBhcHBhcmVudGx5IDp2XG5cdFx0XHQvLyByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJVc2VyLUFnZW50XCIsIGByZWxlYXNlLWZyb250L1JFTEVBU0VfRlJPTlRfVkVSU0lPTl9TVFJgKTtcblxuXHRcdFx0bGV0IGFib3J0ZWQgPSBmYWxzZTtcblx0XHRcdHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgKCkgPT4ge1xuXHRcdFx0XHRpZighYWJvcnRlZCAmJiByZXF1ZXN0c19sZWZ0ICE9PSAwICYmIHJlcXVlc3QucmVhZHlTdGF0ZSA+PSBYTUxIdHRwUmVxdWVzdC5IRUFERVJTX1JFQ0VJVkVEKSB7XG5cdFx0XHRcdFx0YWJvcnRlZCA9IHRydWU7ICAvLyBkbyB0aGlzIEFTQVBcblxuXHRcdFx0XHRcdGxldCBzdGF0dXMgPSByZXF1ZXN0LnN0YXR1cyB8IDA7ICAvLyB8IDAgdG8gbWFrZSBhIGNvcHlcblxuXHRcdFx0XHRcdHJlcXVlc3QuYWJvcnQoKTtcblx0XHRcdFx0XHQtLXJlcXVlc3RzX2xlZnQ7XG5cblx0XHRcdFx0XHRpZihzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCkge1xuXHRcdFx0XHRcdFx0cmVxdWVzdHNfbGVmdCA9IC0xOyAgLy8gRG9uJ3QgYWxsb3cgYW55IG90aGVyIHRocmVhZHMgdG8gdHJpZ2dlciBgbnVsbGAgY2FzZVxuXHRcdFx0XHRcdFx0cmVxdWVzdHMuZm9yRWFjaChfID0+IF8uYWJvcnQoKSk7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayh1cmwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0c19sZWZ0ID09PSAwKVxuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmVxdWVzdC5zZW5kKCk7XG5cblx0XHRcdHJldHVybiByZXF1ZXN0O1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZWxzZVxuXHRcdHJldHVybiBmYWxzZTtcbn1cbiJdfQ==
