/*
 * https://github.com/gfx/require-simple.js
 *
 * AUTHOR: Fuji, Goro (gfx) <gfuji@cpan.org>
 * LICENSE: The MIT License
 *
 * Usage:
 *     <script src="require-simple.js"></script>
 *     <script>
 *         require.paths.unshift("assets/js");
 *         var Foo = require("foo");
 *     </script>
 */

function require(name) {
	"use strict";
	if(!require.modules) {
		require.modules = {};
	}
	if(require.modules[name]) {
		if(require.debug) {
			console.log("require: \"" + name + "\" is already loaded");
		}
		return require.modules[name].exports;
	}

	function findModule(paths, name) {
		for(var i = 0; i < paths.length; ++i) {
			var url = paths[i]+ "/" + name + ".js";

			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, false);
			xhr.send(null);
			
			if(require.debug) {
				console.log("require: " + xhr.status + " " + url);
			}

			if(xhr.status === 200) {
				return xhr.responseText;
			}

			if(xhr.status !== 404 || (i+1) === paths.length) {
				throw new Error("Cannot load module \"" + name + "\": " +
								xhr.status);
			}
		}
	}

	var src = findModule(require.paths, name);

	/*jslint evil: true */
	var f = new Function("module", "exports", src);

	var module = require.modules[name] = {
		id: name,
		exports: {}
	};
	f(module, module.exports);
	return module.exports;
}

require.debug = false;
require.paths = ["."];

