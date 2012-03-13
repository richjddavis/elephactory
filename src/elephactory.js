
// List of elements taken from http://joshduck.com/periodic-table.html
var _aElements = ['html', 'col', 'table', 'head', 'span', 'div', 'fieldset', 'form', 'body', 'h1', 'section', 'colgroup', 'tr', 'title', 'a', 'pre', 'meter', 'select', 'aside', 'h2', 'header', 'caption', 'td', 'meta', 'rt', 'dfn', 'em', 'i', 'small', 'ins', 's', 'br', 'p', 'blockquote', 'legend', 'optgroup', 'address', 'h3', 'nav', 'menu', 'th', 'base', 'rp', 'abbr', 'time', 'b', 'strong', 'del', 'kbd', 'hr', 'ol', 'dl', 'label', 'option', 'datalist', 'h4', 'article', 'command', 'tbody', 'link', 'noscript', 'q', 'var', 'sub', 'mark', 'bdi', 'wbr', 'figcaption', 'ul', 'dt', 'input', 'output', 'keygen', 'h5', 'footer', 'summary', 'thead', 'style', 'script', 'cite', 'samp', 'sup', 'ruby', 'bdo', 'code', 'figure', 'li', 'dd', 'textarea', 'button', 'progress', 'h6', 'hgroup', 'details', 'tfoot', 'img', 'area', 'map', 'embed', 'object', 'param', 'source', 'iframe', 'canvas', 'track', 'audio', 'video'];

var _isAttributesObject = function (oObject) {
	return (oObject !== null && typeof oObject === 'object' && !_isDOMNode(oObject));
};
var _isDOMNode = function (mNode) {
	return ('nodeName' in mNode && 'nodeType' in mNode);
};
var _addEventListener = function (sEvent, fnCallback) {
	// TODO: Should we normalise the event handlers, or leave it up to the dev to do this?
	if ('addEventListener' in this) {
		return this.addEventListener(sEvent, fnCallback, false);
	} else if ('attachEvent' in this) {
		return this.attachEvent(sEvent, fnCallback);
	} else {
		throw new Error('No recognised event binding method found');
	}
};
var _createElement = function (sTag, oAttributes) {
	// TODO: Old IEs have issues with input elements and certain attributes being set after creation
	var oElement;

	oElement = this.createElement(sTag);
	_setAttributes.call(oElement, oAttributes);

	return oElement;
};
var _setAttributes = function (oAttributes) {
	var sAttribute,
		mValue,
		aMatches,
		aHandlers,
		i, l;
	// TODO: Old IEs have issues with elements and certain attributes being set after creation
	// http://webbugtrack.blogspot.com.au/2007/08/bug-242-setattribute-doesnt-always-work.html
	for (sAttribute in oAttributes) {
		mValue = oAttributes[sAttribute];
		if (oAttributes.hasOwnProperty(sAttribute)) {
			aMatches = sAttribute.match(/^on([a-z]+)$/);
			if (aMatches) {
				// Event Handlers (Array or single function)
				aHandlers = Array.isArray(mValue) ? mValue : [mValue];
				for (i = 0, l = mValue.length; i < l; i++) {
					if (typeof mValue[i] === 'function') {
						_addEventListener.call(this, aMatches[0], mValue);
					}
				}
			} else if (mValue === true) {
				// Boolean TRUE: emulate XHTML behaviour
				this.setAttribute(sAttribute, sAttribute);
			} else if (mValue === false || mValue === null) {
				// Boolean FALSE or NULL: treat as removal
				this.removeAttribute(sAttribute);
			} else {
				// Anything else
				// FIXME: http://webbugtrack.blogspot.com.au/2007/08/bug-242-setattribute-doesnt-always-work.html
				this.setAttribute(sAttribute, mValue);
			}
		}
	}
};
var _toDOMNode = function (mNode) {
	// TODO: Add in a way to add custom handlers
	if (_isDOMNode(mNode)) { // DOM Node
		return mNode;
	} else if (typeof mNode === 'string' || typeof mNode === 'number') { // Anything else that's useful to display
		return this.createTextNode(mNode);
	}
	return null;
};

// Element Factory
var _elementFactory = function (sTag, oAttributes) {
	var oElement, aChildren;
	if (_isAttributesObject(oAttributes)) {
		aChildren = Array.prototype.slice.call(arguments, 2);
	} else {
		oAttributes = {};
		aChildren = Array.prototype.slice.call(arguments, 1);
	}

	// Create our Element
	oElement = _createElement.call(this, sTag, oAttributes);

	// Set attributes
	_setAttributes.call(oElement, oAttributes);

	// Append children
	var i, l, oChildNode;
	for (i = 0, l = aChildren.length; i < l; i++) {
		oChildNode = _toDOMNode.call(this, aChildren[i]);
		if (oChildNode) {
			oElement.appendChild(oChildNode);
		}
	}

	return oElement;
};

// DOM Fragment Factory
var _fragmentFactory = function () {
	var aChildren = Array.prototype.slice.call(arguments, 0),
		oFragment = this.createDocumentFragment();

	// Append children
	var i, l, oChildNode;
	for (i = 0, l = aChildren.length; i < l; i++) {
		oChildNode = _toDOMNode.call(this, aChildren[i]);
		if (oChildNode) {
			oElement.appendChild(oChildNode);
		}
	}

	return oFragment;
};

// EXPORTS
exports.for = function (oDocument) {
	// TODO: Do we want to memoise?
	var oInstance = {
		fragment : _fragmentFactory.bind(oDocument),
		factory : _elementFactory.bind(oDocument)
	};

	var i, l;
	for (i = 0, l = _aElements.length; i < l; i++) {
		oInstance[_aElements[i]] = _elementFactory.bind(oDocument, _aElements[i]);
	}

	return oInstance;
};