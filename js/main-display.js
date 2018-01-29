/*!
 * release-front <https://github.com/nabijaczleweli/release-front>
 * Copyright 2018 nabijaczleweli <https://nabijaczleweli.xyz>
 * Available under MIT license <https://opensource.org/licenses/mit>
 */
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["./platform-detect", "./url"], factory);
	} else if (typeof exports !== "undefined") {
		factory(require("./platform-detect"), require("./url"));
	} else {
		var mod = {
			exports: {}
		};
		factory(global.platformDetect, global.url);
		global.mainDisplay = mod.exports;
	}
})(this, function (_platformDetect, _url) {
	"use strict";

	window.addEventListener("load", function () {
		var DOWNLOAD_BUTTON = document.getElementById("main-button");
		var LOGO = document.getElementById("main-logo");

		var REPO_NAME_CONTAINERS = document.getElementsByClassName("main-repo-name");
		var LATEST_LINK_CONTAINERS = document.getElementsByClassName("main-latest-link");
		var VERSION_CONTAINERS = document.getElementsByClassName("main-version");
		var PLATFORM_CONTAINERS = document.getElementsByClassName("main-platform");

		var slug = (0, _url.extract_slug)(window.location.search);

		var platform = _platformDetect.Platform.from_platform();
		Array.from(PLATFORM_CONTAINERS).forEach(function (_) {
			return _.innerText = _platformDetect.Platform.name(platform);
		});

		var slug_name = (0, _url.full_name)(slug);
		if (slug_name) Array.from(REPO_NAME_CONTAINERS).forEach(function (_) {
			return _.innerText = slug_name;
		});

		(0, _url.latest_release)(slug, function (status, release) {
			if (status < 200 || status >= 300) return;

			if (release.html_url) Array.from(LATEST_LINK_CONTAINERS).forEach(function (_) {
				return _.href = release.html_url;
			});

			if (release.tag_name) {
				Array.from(VERSION_CONTAINERS).forEach(function (_) {
					return _.innerText = release.tag_name;
				});
				(0, _url.find_logo)(slug, release.tag_name, function (logo_url) {
					if (logo_url) {
						LOGO.src = logo_url;
						LOGO.classList.remove("hidden");
					}
				});
			}

			console.log(release.assets);
			console.log("platform_is_windows", (0, _platformDetect.is_windows)());
		});
	});
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9qcy9tYWluLWRpc3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLFFBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBTTtBQUNyQyxNQUFNLGtCQUFrQixTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBeEI7QUFDQSxNQUFNLE9BQWtCLFNBQVMsY0FBVCxDQUF3QixXQUF4QixDQUF4Qjs7QUFFQSxNQUFNLHVCQUF5QixTQUFTLHNCQUFULENBQWdDLGdCQUFoQyxDQUEvQjtBQUNBLE1BQU0seUJBQXlCLFNBQVMsc0JBQVQsQ0FBZ0Msa0JBQWhDLENBQS9CO0FBQ0EsTUFBTSxxQkFBeUIsU0FBUyxzQkFBVCxDQUFnQyxjQUFoQyxDQUEvQjtBQUNBLE1BQU0sc0JBQXlCLFNBQVMsc0JBQVQsQ0FBZ0MsZUFBaEMsQ0FBL0I7O0FBRUEsTUFBSSxPQUFPLHVCQUFhLE9BQU8sUUFBUCxDQUFnQixNQUE3QixDQUFYOztBQUVBLE1BQUksV0FBVyx5QkFBUyxhQUFULEVBQWY7QUFDQSxRQUFNLElBQU4sQ0FBVyxtQkFBWCxFQUFnQyxPQUFoQyxDQUF3QztBQUFBLFVBQUssRUFBRSxTQUFGLEdBQWMseUJBQVMsSUFBVCxDQUFjLFFBQWQsQ0FBbkI7QUFBQSxHQUF4Qzs7QUFFQSxNQUFJLFlBQVksb0JBQVUsSUFBVixDQUFoQjtBQUNBLE1BQUcsU0FBSCxFQUNDLE1BQU0sSUFBTixDQUFXLG9CQUFYLEVBQWlDLE9BQWpDLENBQXlDO0FBQUEsVUFBSyxFQUFFLFNBQUYsR0FBYyxTQUFuQjtBQUFBLEdBQXpDOztBQUVELDJCQUFlLElBQWYsRUFBcUIsVUFBQyxNQUFELEVBQVMsT0FBVCxFQUFxQjtBQUN6QyxPQUFHLFNBQVMsR0FBVCxJQUFnQixVQUFVLEdBQTdCLEVBRUM7O0FBRUQsT0FBRyxRQUFRLFFBQVgsRUFDQyxNQUFNLElBQU4sQ0FBVyxzQkFBWCxFQUFtQyxPQUFuQyxDQUEyQztBQUFBLFdBQUssRUFBRSxJQUFGLEdBQVMsUUFBUSxRQUF0QjtBQUFBLElBQTNDOztBQUVELE9BQUcsUUFBUSxRQUFYLEVBQXFCO0FBQ3BCLFVBQU0sSUFBTixDQUFXLGtCQUFYLEVBQStCLE9BQS9CLENBQXVDO0FBQUEsWUFBSyxFQUFFLFNBQUYsR0FBYyxRQUFRLFFBQTNCO0FBQUEsS0FBdkM7QUFDQSx3QkFBVSxJQUFWLEVBQWdCLFFBQVEsUUFBeEIsRUFBa0Msb0JBQVk7QUFDN0MsU0FBRyxRQUFILEVBQWE7QUFDWixXQUFLLEdBQUwsR0FBVyxRQUFYO0FBQ0EsV0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixRQUF0QjtBQUNBO0FBQ0QsS0FMRDtBQU1BOztBQUVELFdBQVEsR0FBUixDQUFZLFFBQVEsTUFBcEI7QUFDQSxXQUFRLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxpQ0FBbkM7QUFDQSxHQXBCRDtBQXFCQSxFQXZDRCIsImZpbGUiOiJzdGRvdXQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbi8vXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTggbmFiaWphY3psZXdlbGlcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG5cbmltcG9ydCB7aXNfd2luZG93cyBhcyBwbGF0Zm9ybV9pc193aW5kb3dzLCBQbGF0Zm9ybX0gZnJvbSBcIi4vcGxhdGZvcm0tZGV0ZWN0XCI7XG5pbXBvcnQge2V4dHJhY3Rfc2x1ZywgZmluZF9sb2dvLCBmdWxsX25hbWUsIGxhdGVzdF9yZWxlYXNlfSBmcm9tIFwiLi91cmxcIjtcblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuXHRjb25zdCBET1dOTE9BRF9CVVRUT04gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tYnV0dG9uXCIpO1xuXHRjb25zdCBMT0dPICAgICAgICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbG9nb1wiKTtcblxuXHRjb25zdCBSRVBPX05BTUVfQ09OVEFJTkVSUyAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1haW4tcmVwby1uYW1lXCIpO1xuXHRjb25zdCBMQVRFU1RfTElOS19DT05UQUlORVJTID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1haW4tbGF0ZXN0LWxpbmtcIik7XG5cdGNvbnN0IFZFUlNJT05fQ09OVEFJTkVSUyAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibWFpbi12ZXJzaW9uXCIpO1xuXHRjb25zdCBQTEFURk9STV9DT05UQUlORVJTICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1haW4tcGxhdGZvcm1cIik7XG5cblx0bGV0IHNsdWcgPSBleHRyYWN0X3NsdWcod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5cblx0bGV0IHBsYXRmb3JtID0gUGxhdGZvcm0uZnJvbV9wbGF0Zm9ybSgpO1xuXHRBcnJheS5mcm9tKFBMQVRGT1JNX0NPTlRBSU5FUlMpLmZvckVhY2goXyA9PiBfLmlubmVyVGV4dCA9IFBsYXRmb3JtLm5hbWUocGxhdGZvcm0pKTtcblxuXHRsZXQgc2x1Z19uYW1lID0gZnVsbF9uYW1lKHNsdWcpO1xuXHRpZihzbHVnX25hbWUpXG5cdFx0QXJyYXkuZnJvbShSRVBPX05BTUVfQ09OVEFJTkVSUykuZm9yRWFjaChfID0+IF8uaW5uZXJUZXh0ID0gc2x1Z19uYW1lKTtcblxuXHRsYXRlc3RfcmVsZWFzZShzbHVnLCAoc3RhdHVzLCByZWxlYXNlKSA9PiB7XG5cdFx0aWYoc3RhdHVzIDwgMjAwIHx8IHN0YXR1cyA+PSAzMDApXG5cdFx0XHQvLyBUT0RPOiB3aGF0IGRvIGhlcmU/XG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZihyZWxlYXNlLmh0bWxfdXJsKVxuXHRcdFx0QXJyYXkuZnJvbShMQVRFU1RfTElOS19DT05UQUlORVJTKS5mb3JFYWNoKF8gPT4gXy5ocmVmID0gcmVsZWFzZS5odG1sX3VybCk7XG5cblx0XHRpZihyZWxlYXNlLnRhZ19uYW1lKSB7XG5cdFx0XHRBcnJheS5mcm9tKFZFUlNJT05fQ09OVEFJTkVSUykuZm9yRWFjaChfID0+IF8uaW5uZXJUZXh0ID0gcmVsZWFzZS50YWdfbmFtZSk7XG5cdFx0XHRmaW5kX2xvZ28oc2x1ZywgcmVsZWFzZS50YWdfbmFtZSwgbG9nb191cmwgPT4ge1xuXHRcdFx0XHRpZihsb2dvX3VybCkge1xuXHRcdFx0XHRcdExPR08uc3JjID0gbG9nb191cmw7XG5cdFx0XHRcdFx0TE9HTy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRjb25zb2xlLmxvZyhyZWxlYXNlLmFzc2V0cyk7XG5cdFx0Y29uc29sZS5sb2coXCJwbGF0Zm9ybV9pc193aW5kb3dzXCIsIHBsYXRmb3JtX2lzX3dpbmRvd3MoKSk7XG5cdH0pO1xufSk7XG4iXX0=
