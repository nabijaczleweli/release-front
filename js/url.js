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
			var _ret = function () {
				var url_base = "//cdn.rawgit.com/" + slug.name + "/" + slug.repo + "/" + commitish;

				var logo_options_count = LOGO_SEARCH_PATHS.length * LOGO_SEARCH_NAMES.length * LOGO_EXTENSIONS.length;
				var finished_requests = 0;
				var finish = false;

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = LOGO_SEARCH_PATHS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var path = _step.value;
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = LOGO_SEARCH_NAMES[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var name = _step2.value;

								var _loop = function _loop(extension) {
									var url = url_base + "/" + path + name + "." + extension;
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

								var _iteratorNormalCompletion3 = true;
								var _didIteratorError3 = false;
								var _iteratorError3 = undefined;

								try {
									for (var _iterator3 = LOGO_EXTENSIONS[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
										var extension = _step3.value;

										_loop(extension);
									}
								} catch (err) {
									_didIteratorError3 = true;
									_iteratorError3 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion3 && _iterator3.return) {
											_iterator3.return();
										}
									} finally {
										if (_didIteratorError3) {
											throw _iteratorError3;
										}
									}
								}
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXBCOzs7QUFJQSxpQkFBUSxnQkFBUixDQUF5QixrQkFBekIsRUFBNkMsWUFBTTtBQUNsRCxjQUFHLE1BQUgsRUFBVztBQUNWLG1CQUFRLEtBQVI7QUFDQTtBQUNBOztBQUVELGNBQUcsUUFBUSxVQUFSLElBQXNCLGVBQWUsZ0JBQXhDLEVBQTBEO0FBQ3pELGVBQUksU0FBUyxRQUFRLE1BQVIsR0FBaUIsQ0FBOUI7O0FBRUEsYUFBRSxpQkFBRjtBQUNBLG1CQUFRLEtBQVI7O0FBRUEsZUFBRyxVQUFVLEdBQVYsSUFBaUIsU0FBUyxHQUE3QixFQUFrQztBQUNqQyxxQkFBUyxJQUFUO0FBQ0EscUJBQVMsR0FBVDtBQUNBLFlBSEQsTUFHTyxJQUFHLHNCQUFzQixrQkFBekIsRUFDTixTQUFTLElBQVQ7QUFDRDtBQUNELFVBbEJEO0FBbUJBLGlCQUFRLElBQVI7QUEzQkY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0MsK0JBQXFCLGVBQXJCLG1JQUFzQztBQUFBLGNBQTlCLFNBQThCOztBQUFBLGdCQUE5QixTQUE4QjtBQTJCckM7QUE1QkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUDJEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBc0MzRDtBQUFBLFFBQU87QUFBUDtBQXRDMkQ7O0FBQUE7QUF1QzNELEdBdkNELE1Bd0NDLE9BQU8sS0FBUDtBQUNEIiwiZmlsZSI6InN0ZG91dCIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAxOCBuYWJpamFjemxld2VsaVxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbi8vIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuLy8gU09GVFdBUkUuXG5cblxuY29uc3QgRVhUUkFDVF9TTFVHX1JFR0VYID0gL14oPzooPzooPzooPzooPzpodHRwKD86cyk/Oik/XFwvXFwvKT9naXRodWJcXC5jb21cXC8pPyl8XFw/KShbYS16QS1aMC05LV8uXSspXFwvKFthLXpBLVowLTktXy5dKykuKi9pO1xuY29uc3QgR0lUSFVCX0FQSV9BQ0NFUFQgID0gXCJhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzK2pzb25cIjtcbmNvbnN0IExPR09fU0VBUkNIX1BBVEhTICA9IFtcIlwiLCBcImFzc2V0cy9cIl07XG5jb25zdCBMT0dPX1NFQVJDSF9OQU1FUyAgPSBbXCJsb2dvXCIsIFwiaWNvblwiXTtcbmNvbnN0IExPR09fRVhURU5TSU9OUyAgICA9IFtcInBuZ1wiLCBcImpwZ1wiXTtcblxuXG4vLy8gR2V0IHJlcG9zaXRvcnkgc2x1ZyBpbmZvcm1hdGlvbiBmcm9tIHRoZSBzdXBwbGllZCBzdHJpbmcg4oCTIHNvbWV0aGluZyBhIHVzZXIgbWlnaHQgcGFzdGUgaW4sIG9yIGFuIHVuZmlsdGVyZWQgcXVlcnkgc3RyaW5nLlxuLy8vXG4vLy8gQXJndW1lbnRzOiBgZGF0YWA6IGBzdHJpbmdgIOKAkyB3aGVyZWluIHRoZSByZXBvc2l0b3J5IHNsdWcgaXMgY29udGFpbmVkLlxuLy8vXG4vLy8gUmV0dXJuczogYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmc/LCBzdHJpbmc/fWAsIHdoZXJlIGJvdGggYG5hbWVgIGFuZCBgcmVwb2AgYXJlIHRoZSByZXNwZWN0aXZlIHBhcnRzIG9mIHRoZSByZXBvc2l0b3J5IHNsdWcgb3IgYG51bGxgLCBpZiBub3Rcbi8vLyBmb3VuZC5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0X3NsdWcoZGF0YSkge1xuXHRsZXQgc291Z2h0ID0gRVhUUkFDVF9TTFVHX1JFR0VYLmV4ZWMoZGF0YSkgfHwgW107XG5cdHNvdWdodC5zaGlmdCgpOyAgLy8gRHJvcCB3aG9sZSBzdHJpbmdcblxuXHRyZXR1cm4ge1xuXHRcdG5hbWU6IHNvdWdodFswXSB8fCBudWxsLFxuXHRcdHJlcG86IHNvdWdodFsxXSB8fCBudWxsLFxuXHR9O1xufVxuXG4vLy8gR2V0IHJlcG9zaXRvcnkgc2x1ZyBzdHJpbmcgZnJvbSB0aGUgcmVzcGVjdGl2ZSBvYmplY3QsXG4vLy9cbi8vLyBBcmd1bWVudHM6IGBvYmplY3RgIOKAkyBge25hbWUsIHJlcG99OiB7c3RyaW5nLCBzdHJpbmd9YCwgd2hlcmUgYm90aCBgbmFtZWAgYW5kIGByZXBvYCBhcmUgdGhlIHJlc3BlY3RpdmUgcGFydHMgb2YgdGhlIHJlcG9zaXRvcnkgc2x1Zy5cbi8vL1xuLy8vIFJldHVybnM6IGBzdHJpbmc/YCwgcmVwcmVzZW50aW5nIHRoZSBub3JtYWxpc2VkIGZvcm0gb2YgdGhlIHJlcG8gc2x1Zywgb3IgYG51bGxgLCBpZiBzdXBwbGllZCBvYmplY3Qgd2FzIGludmFsaWQuXG5leHBvcnQgZnVuY3Rpb24gZnVsbF9uYW1lKHNsdWcpIHtcblx0aWYoc2x1ZyAmJiBzbHVnLm5hbWUgJiYgc2x1Zy5yZXBvKVxuXHRcdHJldHVybiBgJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfWA7XG5cdGVsc2Vcblx0XHRyZXR1cm4gbnVsbDtcbn1cblxuLy8vIEFjcXVpcmUgdGhlIGxhdGVzdCByZWxlYXNlIGRhdGEgZnJvbSB0aGUgc3BlY2lmaWVkIHJlcG9zaXRvcnkuXG4vLy9cbi8vLyBBcmd1bWVudHM6XG4vLy8gICAqIGBzbHVnYCDigJMgYG9iamVjdGAg4oCTIGB7bmFtZSwgcmVwb306IHtzdHJpbmcsIHN0cmluZ31gLCB3aGVyZSBib3RoIGBuYW1lYCBhbmQgYHJlcG9gIGFyZSB0aGUgcmVzcGVjdGl2ZSBwYXJ0cyBvZiB0aGUgcmVxdWVzdGVkIHJlcG9zaXRvcnkgc2x1Zy5cbi8vLyAgICogYGNhbGxiYWNrYCDigJMgYGZ1bmN0aW9uKHN0YXR1czogbnVtYmVyLCByZXNwb25zZTogb2JqZWN0KWAg4oCTXG4vLy8gICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSByZXF1ZXN0IGlzIGZpbmlzaGVkLCB3aGVyZSBgc3RhdHVzYCBpcyB0aGUgcmVzcG9uc2Ugc3RhdHVzIChgMjAwYC9gNDA0YC9ldGMuKSxcbi8vLyAgICAgICAgICAgICAgICAgICBhbmQgYHJlc3BvbnNlYCBpcyBhbiBvYmplY3QgaW4gdGhlIGZvcm1hdCByZXR1cm5lZCBieSB0aGVcbi8vLyAgICAgICAgICAgICAgICAgICBbR2l0SHViIEFQSSB2M10oaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9yZWxlYXNlcy8jZ2V0LXRoZS1sYXRlc3QtcmVsZWFzZSkuXG4vLy9cbi8vLyBSZXR1cm5zOiBgYm9vbGVhbmAsIHJlcHJlc2VudGluZyB3aGV0aGVyIHRoZSByZXF1ZXN0IHdhcyBtYWRlLlxuZXhwb3J0IGZ1bmN0aW9uIGxhdGVzdF9yZWxlYXNlKHNsdWcsIGNhbGxiYWNrKSB7XG5cdGlmKGNhbGxiYWNrICYmIHNsdWcgJiYgc2x1Zy5uYW1lICYmIHNsdWcucmVwbykge1xuXHRcdGxldCB1cmwgPSBgLy9hcGkuZ2l0aHViLmNvbS9yZXBvcy8ke3NsdWcubmFtZX0vJHtzbHVnLnJlcG99L3JlbGVhc2VzL2xhdGVzdGA7XG5cblx0XHRsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCB1cmwpO1xuXHRcdC8vIFVzaW5nIFVzZXItQWdlbnQgZnJvbSBicm93c2VycyBkb2Vzbid0IHdvcmsgYXBwYXJlbnRseSA6dlxuXHRcdC8vIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIlVzZXItQWdlbnRcIiwgYHJlbGVhc2UtZnJvbnQvUkVMRUFTRV9GUk9OVF9WRVJTSU9OX1NUUmApO1xuXHRcdHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBHSVRIVUJfQVBJX0FDQ0VQVCk7XG5cdFx0cmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKTtcblxuXHRcdHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgKCkgPT4ge1xuXHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG5cdFx0XHRcdC8vIEZGIGRvZXNuJ3Qgc2VlbSB0byBhdXRvLWRlY29kZSBKU09OXG5cdFx0XHRcdGxldCByZXNwb25zZSA9IHR5cGVvZiByZXF1ZXN0LnJlc3BvbnNlID09PSBcInN0cmluZ1wiID8gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlKSA6IHJlcXVlc3QucmVzcG9uc2U7XG5cdFx0XHRcdGNhbGxiYWNrKHJlcXVlc3Quc3RhdHVzLCByZXNwb25zZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmVxdWVzdC5zZW5kKCk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlXG5cdFx0cmV0dXJuIGZhbHNlO1xufVxuXG4vLy8gU2VhcmNoIGZvciBhIGxvZ28gZmlsZSBpbiB0aGUgcmVwb3NpdG9yeSB1bmRlciB0aGUgc3BlY2lmaWVkIGNvbW1pdGlzaC5cbi8vL1xuLy8vIEFyZ3VtZW50czpcbi8vLyAgICogYHNsdWdgIOKAkyBgb2JqZWN0YCDigJMgYHtuYW1lLCByZXBvfToge3N0cmluZywgc3RyaW5nfWAsIHdoZXJlIGJvdGggYG5hbWVgIGFuZCBgcmVwb2AgYXJlIHRoZSByZXNwZWN0aXZlIHBhcnRzIG9mIHRoZSByZXF1ZXN0ZWQgcmVwb3NpdG9yeSBzbHVnLlxuLy8vICAgKiBgY29tbWl0aXNoYCDigJMgYHN0cmluZ2Ag4oCTIHRhZy9jb21taXQvYnJhbmNoIHRvIGxvb2sgaW4uXG4vLy8gICAqIGBjYWxsYmFja2Ag4oCTIGBmdW5jdGlvbih1cmw6IHN0cmluZz8pYCDigJNcbi8vLyAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjYWxsZWRcbi8vLyAgICAgICAgICAgICAgICAgICAoYSkgd2l0aCB0aGUgbG9nbyB1cmwgd2hlbiBlaXRoZXIgYSBsb2dvIHdhcyBmb3VuZCBvclxuLy8vICAgICAgICAgICAgICAgICAgIChiKSB3aXRoIGBudWxsYCB3aGVuIGFsbCBzZWFyY2ggcGF0aHMgZXJyb3JlZC5cbi8vL1xuLy8vIFJldHVybnM6IGBib29sZWFuYCwgcmVwcmVzZW50aW5nIHdoZXRoZXIgdGhlIHJlcXVlc3RzIHdlcmUgbWFkZS5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kX2xvZ28oc2x1ZywgY29tbWl0aXNoLCBjYWxsYmFjaykge1xuXHRpZihjYWxsYmFjayAmJiBjb21taXRpc2ggJiYgc2x1ZyAmJiBzbHVnLm5hbWUgJiYgc2x1Zy5yZXBvKSB7XG5cdFx0bGV0IHVybF9iYXNlID0gYC8vY2RuLnJhd2dpdC5jb20vJHtzbHVnLm5hbWV9LyR7c2x1Zy5yZXBvfS8ke2NvbW1pdGlzaH1gO1xuXG5cdFx0bGV0IGxvZ29fb3B0aW9uc19jb3VudCA9IExPR09fU0VBUkNIX1BBVEhTLmxlbmd0aCAqIExPR09fU0VBUkNIX05BTUVTLmxlbmd0aCAqIExPR09fRVhURU5TSU9OUy5sZW5ndGg7XG5cdFx0bGV0IGZpbmlzaGVkX3JlcXVlc3RzICA9IDA7XG5cdFx0bGV0IGZpbmlzaCAgICAgICAgICAgICA9IGZhbHNlO1xuXG5cdFx0Zm9yKGxldCBwYXRoIG9mIExPR09fU0VBUkNIX1BBVEhTKVxuXHRcdFx0Zm9yKGxldCBuYW1lIG9mIExPR09fU0VBUkNIX05BTUVTKVxuXHRcdFx0XHRmb3IobGV0IGV4dGVuc2lvbiBvZiBMT0dPX0VYVEVOU0lPTlMpIHtcblx0XHRcdFx0XHRsZXQgdXJsICAgICA9IGAke3VybF9iYXNlfS8ke3BhdGh9JHtuYW1lfS4ke2V4dGVuc2lvbn1gO1xuICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHVybCk7XG5cdFx0XHRcdFx0Ly8gVXNpbmcgVXNlci1BZ2VudCBmcm9tIGJyb3dzZXJzIGRvZXNuJ3Qgd29yayBhcHBhcmVudGx5IDp2XG5cdFx0XHRcdFx0Ly8gcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKFwiVXNlci1BZ2VudFwiLCBgcmVsZWFzZS1mcm9udC9SRUxFQVNFX0ZST05UX1ZFUlNJT05fU1RSYCk7XG5cblx0XHRcdFx0XHRyZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsICgpID0+IHtcblx0XHRcdFx0XHRcdGlmKGZpbmlzaCkge1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0LmFib3J0KCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlID49IFhNTEh0dHBSZXF1ZXN0LkhFQURFUlNfUkVDRUlWRUQpIHtcblx0XHRcdFx0XHRcdFx0bGV0IHN0YXR1cyA9IHJlcXVlc3Quc3RhdHVzICsgMDtcblxuXHRcdFx0XHRcdFx0XHQrK2ZpbmlzaGVkX3JlcXVlc3RzO1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0LmFib3J0KCk7XG5cblx0XHRcdFx0XHRcdFx0aWYoc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDApIHtcblx0XHRcdFx0XHRcdFx0XHRmaW5pc2ggPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrKHVybCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZihmaW5pc2hlZF9yZXF1ZXN0cyA9PT0gbG9nb19vcHRpb25zX2NvdW50KVxuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrKG51bGwpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJlcXVlc3Quc2VuZCgpO1xuXHRcdFx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlXG5cdFx0cmV0dXJuIGZhbHNlO1xufVxuIl19
