var FS = require('fs'),
	Path = require('path'),
	Uglify = require('uglify-js');

var sFileBaseName = Path.basename(__filename, 'js');
module.exports = {
	build : function (sModule) {
		var sModuleBaseName = Path.basename(sModule, 'js'),
			sContents = FS.readFileSync(sModule),
			sBuiltContents,
			sMinifiedContents;

		sBuiltContents = "(function (NS, bBindToNamespace) {\n" + sContents + "\n})(window, true);";
		sMinifiedContents = Uglify.uglify.gen_code(Uglify.uglify.ast_squeeze(Uglify.parser.parse(sBuiltContents)));

		FS.writeFileSync(__dirname + '/../dist/' + sFileBaseName + '/' + sModule + '.js', sBuiltContents);
		FS.writeFileSync(__dirname + '/../dist/' + sFileBaseName + '/' + sModule + '.min.js', sMinifiedContents);
	}
};