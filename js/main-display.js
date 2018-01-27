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
		var DOWNLOAD_BUTTON = document.getElementsByClassName("main-button");

		var REPO_NAME_CONTAINERS = document.getElementsByClassName("main-repo-name");
		var LATEST_LINK_CONTAINERS = document.getElementsByClassName("main-latest-link");
		var VERSION_CONTAINERS = document.getElementsByClassName("main-version");
		var PLATFORM_CONTAINERS = document.getElementsByClassName("main-platform");

		var slug = (0, _url.extract_slug)(window.location.search);

		var pform = (0, _platformDetect.platform_string)();
		Array.from(PLATFORM_CONTAINERS).forEach(function (_) {
			return _.innerText = pform;
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

			if (release.tag_name) Array.from(VERSION_CONTAINERS).forEach(function (_) {
				return _.innerText = release.tag_name;
			});

			console.log(release.assets);
			console.log("platform_is_windows", (0, _platformDetect.is_windows)());
		});
	});
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9qcy9tYWluLWRpc3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLFFBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBTTtBQUNyQyxNQUFNLGtCQUFrQixTQUFTLHNCQUFULENBQWdDLGFBQWhDLENBQXhCOztBQUVBLE1BQU0sdUJBQXlCLFNBQVMsc0JBQVQsQ0FBZ0MsZ0JBQWhDLENBQS9CO0FBQ0EsTUFBTSx5QkFBeUIsU0FBUyxzQkFBVCxDQUFnQyxrQkFBaEMsQ0FBL0I7QUFDQSxNQUFNLHFCQUF5QixTQUFTLHNCQUFULENBQWdDLGNBQWhDLENBQS9CO0FBQ0EsTUFBTSxzQkFBeUIsU0FBUyxzQkFBVCxDQUFnQyxlQUFoQyxDQUEvQjs7QUFFQSxNQUFJLE9BQU8sdUJBQWEsT0FBTyxRQUFQLENBQWdCLE1BQTdCLENBQVg7O0FBRUEsTUFBSSxRQUFRLHNDQUFaO0FBQ0EsUUFBTSxJQUFOLENBQVcsbUJBQVgsRUFBZ0MsT0FBaEMsQ0FBd0M7QUFBQSxVQUFLLEVBQUUsU0FBRixHQUFjLEtBQW5CO0FBQUEsR0FBeEM7O0FBRUEsTUFBSSxZQUFZLG9CQUFVLElBQVYsQ0FBaEI7QUFDQSxNQUFHLFNBQUgsRUFDQyxNQUFNLElBQU4sQ0FBVyxvQkFBWCxFQUFpQyxPQUFqQyxDQUF5QztBQUFBLFVBQUssRUFBRSxTQUFGLEdBQWMsU0FBbkI7QUFBQSxHQUF6Qzs7QUFFRCwyQkFBZSxJQUFmLEVBQXFCLFVBQUMsTUFBRCxFQUFTLE9BQVQsRUFBcUI7QUFDekMsT0FBRyxTQUFTLEdBQVQsSUFBZ0IsVUFBVSxHQUE3QixFQUVDOztBQUVELE9BQUcsUUFBUSxRQUFYLEVBQ0MsTUFBTSxJQUFOLENBQVcsc0JBQVgsRUFBbUMsT0FBbkMsQ0FBMkM7QUFBQSxXQUFLLEVBQUUsSUFBRixHQUFTLFFBQVEsUUFBdEI7QUFBQSxJQUEzQzs7QUFFRCxPQUFHLFFBQVEsUUFBWCxFQUNDLE1BQU0sSUFBTixDQUFXLGtCQUFYLEVBQStCLE9BQS9CLENBQXVDO0FBQUEsV0FBSyxFQUFFLFNBQUYsR0FBYyxRQUFRLFFBQTNCO0FBQUEsSUFBdkM7O0FBRUQsV0FBUSxHQUFSLENBQVksUUFBUSxNQUFwQjtBQUNBLFdBQVEsR0FBUixDQUFZLHFCQUFaLEVBQW1DLGlDQUFuQztBQUNBLEdBYkQ7QUFjQSxFQS9CRCIsImZpbGUiOiJzdGRvdXQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbi8vXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTggbmFiaWphY3psZXdlbGlcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG5cbmltcG9ydCB7cGxhdGZvcm1fc3RyaW5nLCBpc193aW5kb3dzIGFzIHBsYXRmb3JtX2lzX3dpbmRvd3N9IGZyb20gXCIuL3BsYXRmb3JtLWRldGVjdFwiO1xuaW1wb3J0IHtleHRyYWN0X3NsdWcsIGZ1bGxfbmFtZSwgbGF0ZXN0X3JlbGVhc2V9IGZyb20gXCIuL3VybFwiO1xuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG5cdGNvbnN0IERPV05MT0FEX0JVVFRPTiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJtYWluLWJ1dHRvblwiKTtcblxuXHRjb25zdCBSRVBPX05BTUVfQ09OVEFJTkVSUyAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1haW4tcmVwby1uYW1lXCIpO1xuXHRjb25zdCBMQVRFU1RfTElOS19DT05UQUlORVJTID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1haW4tbGF0ZXN0LWxpbmtcIik7XG5cdGNvbnN0IFZFUlNJT05fQ09OVEFJTkVSUyAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibWFpbi12ZXJzaW9uXCIpO1xuXHRjb25zdCBQTEFURk9STV9DT05UQUlORVJTICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1haW4tcGxhdGZvcm1cIik7XG5cblx0bGV0IHNsdWcgPSBleHRyYWN0X3NsdWcod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5cblx0bGV0IHBmb3JtID0gcGxhdGZvcm1fc3RyaW5nKCk7XG5cdEFycmF5LmZyb20oUExBVEZPUk1fQ09OVEFJTkVSUykuZm9yRWFjaChfID0+IF8uaW5uZXJUZXh0ID0gcGZvcm0pO1xuXG5cdGxldCBzbHVnX25hbWUgPSBmdWxsX25hbWUoc2x1Zyk7XG5cdGlmKHNsdWdfbmFtZSlcblx0XHRBcnJheS5mcm9tKFJFUE9fTkFNRV9DT05UQUlORVJTKS5mb3JFYWNoKF8gPT4gXy5pbm5lclRleHQgPSBzbHVnX25hbWUpO1xuXG5cdGxhdGVzdF9yZWxlYXNlKHNsdWcsIChzdGF0dXMsIHJlbGVhc2UpID0+IHtcblx0XHRpZihzdGF0dXMgPCAyMDAgfHwgc3RhdHVzID49IDMwMClcblx0XHRcdC8vIFRPRE86IHdoYXQgZG8gaGVyZT9cblx0XHRcdHJldHVybjtcblxuXHRcdGlmKHJlbGVhc2UuaHRtbF91cmwpXG5cdFx0XHRBcnJheS5mcm9tKExBVEVTVF9MSU5LX0NPTlRBSU5FUlMpLmZvckVhY2goXyA9PiBfLmhyZWYgPSByZWxlYXNlLmh0bWxfdXJsKTtcblxuXHRcdGlmKHJlbGVhc2UudGFnX25hbWUpXG5cdFx0XHRBcnJheS5mcm9tKFZFUlNJT05fQ09OVEFJTkVSUykuZm9yRWFjaChfID0+IF8uaW5uZXJUZXh0ID0gcmVsZWFzZS50YWdfbmFtZSk7XG5cblx0XHRjb25zb2xlLmxvZyhyZWxlYXNlLmFzc2V0cyk7XG5cdFx0Y29uc29sZS5sb2coXCJwbGF0Zm9ybV9pc193aW5kb3dzXCIsIHBsYXRmb3JtX2lzX3dpbmRvd3MoKSk7XG5cdH0pO1xufSk7XG4iXX0=
