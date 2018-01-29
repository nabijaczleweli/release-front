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
		global.url = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.extract_slug = extract_slug;
	exports.full_name = full_name;
	exports.latest_release = latest_release;
	exports.find_logo = find_logo;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var EXTRACT_SLUG_REGEX = /^(?:(?:(?:(?:(?:http(?:s)?:)?\/\/)?github\.com\/)?)|\?)([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+).*/i;
	var GITHUB_API_ACCEPT = "application/vnd.github.v3+json";
	var LOGO_SEARCH_SUBPATHS = ["logo", "assets/logo"];
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
			var _ret = function () {
				var url_base = "//cdn.rawgit.com/" + slug.name + "/" + slug.repo + "/" + commitish;

				var logo_options_count = LOGO_SEARCH_SUBPATHS.length * LOGO_EXTENSIONS.length;
				var finished_requests = 0;
				var finish = false;

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = LOGO_SEARCH_SUBPATHS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var subpath = _step.value;

						var _loop = function _loop(extension) {
							var url = url_base + "/" + subpath + "." + extension;
							var request = new XMLHttpRequest();
							request.open("GET", url);


							request.addEventListener("readystatechange", function () {
								if (finish) {
									request.abort();
									return;
								}

								if (request.readyState >= XMLHttpRequest.HEADERS_RECEIVED) {
									var status = request.status + 0;

									++finished_requests;
									request.abort();

									if (status >= 200 && status < 300) {
										finish = true;
										callback(url);
									} else if (finished_requests === logo_options_count) callback(null);
								}
							});
							request.send();
						};

						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = LOGO_EXTENSIONS[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var extension = _step2.value;

								_loop(extension);
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}
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

				return {
					v: true
				};
			}();

			if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
		} else return false;
	}
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxFQUEwRDtBQUN6RCxhQUFJLFNBQVMsUUFBUSxNQUFSLEdBQWlCLENBQTlCOztBQUVBLFdBQUUsaUJBQUY7QUFDQSxpQkFBUSxLQUFSOztBQUVBLGFBQUcsVUFBVSxHQUFWLElBQWlCLFNBQVMsR0FBN0IsRUFBa0M7QUFDakMsbUJBQVMsSUFBVDtBQUNBLG1CQUFTLEdBQVQ7QUFDQSxVQUhELE1BR08sSUFBRyxzQkFBc0Isa0JBQXpCLEVBQ04sU0FBUyxJQUFUO0FBQ0Q7QUFDRCxRQWxCRDtBQW1CQSxlQUFRLElBQVI7QUEzQkY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0MsNkJBQXFCLGVBQXJCLG1JQUFzQztBQUFBLFlBQTlCLFNBQThCOztBQUFBLGNBQTlCLFNBQThCO0FBMkJyQztBQTVCRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFQMkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFxQzNEO0FBQUEsUUFBTztBQUFQO0FBckMyRDs7QUFBQTtBQXNDM0QsR0F0Q0QsTUF1Q0MsT0FBTyxLQUFQO0FBQ0QiLCJmaWxlIjoic3Rkb3V0Iiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDE4IG5hYmlqYWN6bGV3ZWxpXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuLy8gY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4vLyBTT0ZUV0FSRS5cblxuXG5jb25zdCBFWFRSQUNUX1NMVUdfUkVHRVggICA9IC9eKD86KD86KD86KD86KD86aHR0cCg/OnMpPzopP1xcL1xcLyk/Z2l0aHViXFwuY29tXFwvKT8pfFxcPykoW2EtekEtWjAtOS1fLl0rKVxcLyhbYS16QS1aMC05LV8uXSspLiovaTtcbmNvbnN0IEdJVEhVQl9BUElfQUNDRVBUICAgID0gXCJhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzK2pzb25cIjtcbmNvbnN0IExPR09fU0VBUkNIX1NVQlBBVEhTID0gW1wibG9nb1wiLCBcImFzc2V0cy9sb2dvXCJdO1xuY29uc3QgTE9HT19FWFRFTlNJT05TICAgICAgPSBbXCJwbmdcIiwgXCJqcGdcIl07XG5cblxuLy8vIEdldCByZXBvc2l0b3J5IHNsdWcgaW5mb3JtYXRpb24gZnJvbSB0aGUgc3VwcGxpZWQgc3RyaW5nIOKAkyBzb21ldGhpbmcgYSB1c2VyIG1pZ2h0IHBhc3RlIGluLCBvciBhbiB1bmZpbHRlcmVkIHF1ZXJ5IHN0cmluZy5cbi8vL1xuLy8vIEFyZ3VtZW50czogYGRhdGFgOiBgc3RyaW5nYCDigJMgd2hlcmVpbiB0aGUgcmVwb3NpdG9yeSBzbHVnIGlzIGNvbnRhaW5lZC5cbi8vL1xuLy8vIFJldHVybnM6IGBvYmplY3RgIOKAkyBge25hbWUsIHJlcG99OiB7c3RyaW5nPywgc3RyaW5nP31gLCB3aGVyZSBib3RoIGBuYW1lYCBhbmQgYHJlcG9gIGFyZSB0aGUgcmVzcGVjdGl2ZSBwYXJ0cyBvZiB0aGUgcmVwb3NpdG9yeSBzbHVnIG9yIGBudWxsYCwgaWYgbm90XG4vLy8gZm91bmQuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdF9zbHVnKGRhdGEpIHtcblx0bGV0IHNvdWdodCA9IEVYVFJBQ1RfU0xVR19SRUdFWC5leGVjKGRhdGEpIHx8IFtdO1xuXHRzb3VnaHQuc2hpZnQoKTsgIC8vIERyb3Agd2hvbGUgc3RyaW5nXG5cblx0cmV0dXJuIHtcblx0XHRuYW1lOiBzb3VnaHRbMF0gfHwgbnVsbCxcblx0XHRyZXBvOiBzb3VnaHRbMV0gfHwgbnVsbCxcblx0fTtcbn1cblxuLy8vIEdldCByZXBvc2l0b3J5IHNsdWcgc3RyaW5nIGZyb20gdGhlIHJlc3BlY3RpdmUgb2JqZWN0LFxuLy8vXG4vLy8gQXJndW1lbnRzOiBgb2JqZWN0YCDigJMgYHtuYW1lLCByZXBvfToge3N0cmluZywgc3RyaW5nfWAsIHdoZXJlIGJvdGggYG5hbWVgIGFuZCBgcmVwb2AgYXJlIHRoZSByZXNwZWN0aXZlIHBhcnRzIG9mIHRoZSByZXBvc2l0b3J5IHNsdWcuXG4vLy9cbi8vLyBSZXR1cm5zOiBgc3RyaW5nP2AsIHJlcHJlc2VudGluZyB0aGUgbm9ybWFsaXNlZCBmb3JtIG9mIHRoZSByZXBvIHNsdWcsIG9yIGBudWxsYCwgaWYgc3VwcGxpZWQgb2JqZWN0IHdhcyBpbnZhbGlkLlxuZXhwb3J0IGZ1bmN0aW9uIGZ1bGxfbmFtZShzbHVnKSB7XG5cdGlmKHNsdWcgJiYgc2x1Zy5uYW1lICYmIHNsdWcucmVwbylcblx0XHRyZXR1cm4gYCR7c2x1Zy5uYW1lfS8ke3NsdWcucmVwb31gO1xuXHRlbHNlXG5cdFx0cmV0dXJuIG51bGw7XG59XG5cbi8vLyBBY3F1aXJlIHRoZSBsYXRlc3QgcmVsZWFzZSBkYXRhIGZyb20gdGhlIHNwZWNpZmllZCByZXBvc2l0b3J5LlxuLy8vXG4vLy8gQXJndW1lbnRzOlxuLy8vICAgKiBgc2x1Z2Ag4oCTIGBvYmplY3RgIOKAkyBge25hbWUsIHJlcG99OiB7c3RyaW5nLCBzdHJpbmd9YCwgd2hlcmUgYm90aCBgbmFtZWAgYW5kIGByZXBvYCBhcmUgdGhlIHJlc3BlY3RpdmUgcGFydHMgb2YgdGhlIHJlcXVlc3RlZCByZXBvc2l0b3J5IHNsdWcuXG4vLy8gICAqIGBjYWxsYmFja2Ag4oCTIGBmdW5jdGlvbihzdGF0dXM6IG51bWJlciwgcmVzcG9uc2U6IG9iamVjdClgIOKAk1xuLy8vICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgcmVxdWVzdCBpcyBmaW5pc2hlZCwgd2hlcmUgYHN0YXR1c2AgaXMgdGhlIHJlc3BvbnNlIHN0YXR1cyAoYDIwMGAvYDQwNGAvZXRjLiksXG4vLy8gICAgICAgICAgICAgICAgICAgYW5kIGByZXNwb25zZWAgaXMgYW4gb2JqZWN0IGluIHRoZSBmb3JtYXQgcmV0dXJuZWQgYnkgdGhlXG4vLy8gICAgICAgICAgICAgICAgICAgW0dpdEh1YiBBUEkgdjNdKGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcmVsZWFzZXMvI2dldC10aGUtbGF0ZXN0LXJlbGVhc2UpLlxuLy8vXG4vLy8gUmV0dXJuczogYGJvb2xlYW5gLCByZXByZXNlbnRpbmcgd2hldGhlciB0aGUgcmVxdWVzdCB3YXMgbWFkZS5cbmV4cG9ydCBmdW5jdGlvbiBsYXRlc3RfcmVsZWFzZShzbHVnLCBjYWxsYmFjaykge1xuXHRpZihjYWxsYmFjayAmJiBzbHVnICYmIHNsdWcubmFtZSAmJiBzbHVnLnJlcG8pIHtcblx0XHRsZXQgdXJsID0gYC8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfS9yZWxlYXNlcy9sYXRlc3RgO1xuXG5cdFx0bGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsKTtcblx0XHQvLyBVc2luZyBVc2VyLUFnZW50IGZyb20gYnJvd3NlcnMgZG9lc24ndCB3b3JrIGFwcGFyZW50bHkgOnZcblx0XHQvLyByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJVc2VyLUFnZW50XCIsIGByZWxlYXNlLWZyb250L1JFTEVBU0VfRlJPTlRfVkVSU0lPTl9TVFJgKTtcblx0XHRyZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgR0lUSFVCX0FQSV9BQ0NFUFQpO1xuXHRcdHJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL2pzb25cIik7XG5cblx0XHRyZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsICgpID0+IHtcblx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuXHRcdFx0XHQvLyBGRiBkb2Vzbid0IHNlZW0gdG8gYXV0by1kZWNvZGUgSlNPTlxuXHRcdFx0XHRsZXQgcmVzcG9uc2UgPSB0eXBlb2YgcmVxdWVzdC5yZXNwb25zZSA9PT0gXCJzdHJpbmdcIiA/IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZSkgOiByZXF1ZXN0LnJlc3BvbnNlO1xuXHRcdFx0XHRjYWxsYmFjayhyZXF1ZXN0LnN0YXR1cywgcmVzcG9uc2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJlcXVlc3Quc2VuZCgpO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZWxzZVxuXHRcdHJldHVybiBmYWxzZTtcbn1cblxuLy8vIFNlYXJjaCBmb3IgYSBsb2dvIGZpbGUgaW4gdGhlIHJlcG9zaXRvcnkgdW5kZXIgdGhlIHNwZWNpZmllZCBjb21taXRpc2guXG4vLy9cbi8vLyBBcmd1bWVudHM6XG4vLy8gICAqIGBzbHVnYCDigJMgYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmcsIHN0cmluZ31gLCB3aGVyZSBib3RoIGBuYW1lYCBhbmQgYHJlcG9gIGFyZSB0aGUgcmVzcGVjdGl2ZSBwYXJ0cyBvZiB0aGUgcmVxdWVzdGVkIHJlcG9zaXRvcnkgc2x1Zy5cbi8vLyAgICogYGNvbW1pdGlzaGAg4oCTIGBzdHJpbmdgIOKAkyB0YWcvY29tbWl0L2JyYW5jaCB0byBsb29rIGluLlxuLy8vICAgKiBgY2FsbGJhY2tgIOKAkyBgZnVuY3Rpb24odXJsOiBzdHJpbmc/KWAg4oCTXG4vLy8gICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gY2FsbGVkXG4vLy8gICAgICAgICAgICAgICAgICAgKGEpIHdpdGggdGhlIGxvZ28gdXJsIHdoZW4gZWl0aGVyIGEgbG9nbyB3YXMgZm91bmQgb3Jcbi8vLyAgICAgICAgICAgICAgICAgICAoYikgd2l0aCBgbnVsbGAgd2hlbiBhbGwgc2VhcmNoIHBhdGhzIGVycm9yZWQuXG4vLy9cbi8vLyBSZXR1cm5zOiBgYm9vbGVhbmAsIHJlcHJlc2VudGluZyB3aGV0aGVyIHRoZSByZXF1ZXN0cyB3ZXJlIG1hZGUuXG5leHBvcnQgZnVuY3Rpb24gZmluZF9sb2dvKHNsdWcsIGNvbW1pdGlzaCwgY2FsbGJhY2spIHtcblx0aWYoY2FsbGJhY2sgJiYgY29tbWl0aXNoICYmIHNsdWcgJiYgc2x1Zy5uYW1lICYmIHNsdWcucmVwbykge1xuXHRcdGxldCB1cmxfYmFzZSA9IGAvL2Nkbi5yYXdnaXQuY29tLyR7c2x1Zy5uYW1lfS8ke3NsdWcucmVwb30vJHtjb21taXRpc2h9YDtcblxuXHRcdGxldCBsb2dvX29wdGlvbnNfY291bnQgPSBMT0dPX1NFQVJDSF9TVUJQQVRIUy5sZW5ndGggKiBMT0dPX0VYVEVOU0lPTlMubGVuZ3RoO1xuXHRcdGxldCBmaW5pc2hlZF9yZXF1ZXN0cyAgPSAwO1xuXHRcdGxldCBmaW5pc2ggICAgICAgICAgICAgPSBmYWxzZTtcblxuXHRcdGZvcihsZXQgc3VicGF0aCBvZiBMT0dPX1NFQVJDSF9TVUJQQVRIUylcblx0XHRcdGZvcihsZXQgZXh0ZW5zaW9uIG9mIExPR09fRVhURU5TSU9OUykge1xuXHRcdFx0XHRsZXQgdXJsICAgICA9IGAke3VybF9iYXNlfS8ke3N1YnBhdGh9LiR7ZXh0ZW5zaW9ufWA7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwpO1xuXHRcdFx0XHQvLyBVc2luZyBVc2VyLUFnZW50IGZyb20gYnJvd3NlcnMgZG9lc24ndCB3b3JrIGFwcGFyZW50bHkgOnZcblx0XHRcdFx0Ly8gcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKFwiVXNlci1BZ2VudFwiLCBgcmVsZWFzZS1mcm9udC9SRUxFQVNFX0ZST05UX1ZFUlNJT05fU1RSYCk7XG5cblx0XHRcdFx0cmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLCAoKSA9PiB7XG5cdFx0XHRcdFx0aWYoZmluaXNoKSB7XG5cdFx0XHRcdFx0XHRyZXF1ZXN0LmFib3J0KCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlID49IFhNTEh0dHBSZXF1ZXN0LkhFQURFUlNfUkVDRUlWRUQpIHtcblx0XHRcdFx0XHRcdGxldCBzdGF0dXMgPSByZXF1ZXN0LnN0YXR1cyArIDA7XG5cblx0XHRcdFx0XHRcdCsrZmluaXNoZWRfcmVxdWVzdHM7XG5cdFx0XHRcdFx0XHRyZXF1ZXN0LmFib3J0KCk7XG5cblx0XHRcdFx0XHRcdGlmKHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwKSB7XG5cdFx0XHRcdFx0XHRcdGZpbmlzaCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKHVybCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYoZmluaXNoZWRfcmVxdWVzdHMgPT09IGxvZ29fb3B0aW9uc19jb3VudClcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sobnVsbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmVxdWVzdC5zZW5kKCk7XG5cdFx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlXG5cdFx0cmV0dXJuIGZhbHNlO1xufVxuIl19
