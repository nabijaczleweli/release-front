// The MIT License (MIT)
// 
// Copyright (c) 2013 tolgaek
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("enum", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global._enum = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Enum;

  function Enum() {
    var v = arguments,
        s = { all: [], keys: v };for (var i = v.length; i--;) {
      s[v[i]] = s.all[i] = i;
    }return s;
  }
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm91dC9idWlsZC9ub2RlLWVudW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUFlLEk7O0FBQ2YsV0FBUyxJQUFULEdBQWU7QUFBQyxRQUFJLElBQUUsU0FBTjtBQUFBLFFBQWdCLElBQUUsRUFBQyxLQUFJLEVBQUwsRUFBUSxNQUFLLENBQWIsRUFBbEIsQ0FBa0MsS0FBSSxJQUFJLElBQUUsRUFBRSxNQUFaLEVBQW1CLEdBQW5CO0FBQXdCLFFBQUUsRUFBRSxDQUFGLENBQUYsSUFBUSxFQUFFLEdBQUYsQ0FBTSxDQUFOLElBQVMsQ0FBakI7QUFBeEIsS0FBMkMsT0FBTyxDQUFQO0FBQVUiLCJmaWxlIjoic3Rkb3V0Iiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgRW51bTtcbmZ1bmN0aW9uIEVudW0oKXtsZXQgdj1hcmd1bWVudHMscz17YWxsOltdLGtleXM6dn07Zm9yKGxldCBpPXYubGVuZ3RoO2ktLTspc1t2W2ldXT1zLmFsbFtpXT1pO3JldHVybiBzO31cbiJdfQ==
