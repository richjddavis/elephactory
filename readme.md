# Elephactory

Elephactory is a simple and expressive JavaScript library to create DOM Nodes in a way that looks like markup, but without messy HTML-in-strings.

Please note that Elephactory is currently in **alpha**, and is not ready for production use (or even to build, for that matter)!

## Usage
### Node.js/CommonJS
	// Use .create() to get a fresh instance every time, or .get() to get a memoised instance
	var E = require('elephactory').get(document);

	document.body.appendChild(E._fragment(
		E.header({id:'header'}),
		E.div({class:'content', onclick:function({alert('watch it!');})},
			'ohai, there!'
		)
	));

### Script Tag
	<script src='elephactory.js'></script>
	<script>
	document.addEventListener('DOMContentLoaded', function () {
		document.body.appendChild(E._fragment(
			E.header({id:'header'}),
			E.div({class:'content', onclick:function({alert('watch it!');})},
				'ohai, there!'
			)
		));
	});
	</script>

## Licence
Copyright (C) 2012 Rich Davis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.