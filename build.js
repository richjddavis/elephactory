
var fs = require('fs');

var sModule = __dirname + '/src/elephactory.js';

// Find build modules in ./build/
var aBuildModules = fs.readdirSync(__dirname + '/build/'),
	oBuildModule,
	i, il;
for (i = 0, il = aBuildModules.length; i < il; i++) {
	// Match *.js files
	if (aBuildModules[i].test(/.+\.js$/)) {
		// Require + build
		// TODO: Allow commandline arguments to restrict build scripts
		require(aBuildModules[i]).build();
	}
}