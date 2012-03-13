
// List of elements taken from http://joshduck.com/periodic-table.html
var _aElements = ['html', 'col', 'table', 'head', 'span', 'div', 'fieldset', 'form', 'body', 'h1', 'section', 'colgroup', 'tr', 'title', 'a', 'pre', 'meter', 'select', 'aside', 'h2', 'header', 'caption', 'td', 'meta', 'rt', 'dfn', 'em', 'i', 'small', 'ins', 's', 'br', 'p', 'blockquote', 'legend', 'optgroup', 'address', 'h3', 'nav', 'menu', 'th', 'base', 'rp', 'abbr', 'time', 'b', 'strong', 'del', 'kbd', 'hr', 'ol', 'dl', 'label', 'option', 'datalist', 'h4', 'article', 'command', 'tbody', 'link', 'noscript', 'q', 'var', 'sub', 'mark', 'bdi', 'wbr', 'figcaption', 'ul', 'dt', 'input', 'output', 'keygen', 'h5', 'footer', 'summary', 'thead', 'style', 'script', 'cite', 'samp', 'sup', 'ruby', 'bdo', 'code', 'figure', 'li', 'dd', 'textarea', 'button', 'progress', 'h6', 'hgroup', 'details', 'tfoot', 'img', 'area', 'map', 'embed', 'object', 'param', 'source', 'iframe', 'canvas', 'track', 'audio', 'video'];

// CONSTRUCTOR
var Elephactory = function (oDocument) {
	this.oDocument = oDocument;
};

// UTILITIES (that we might want to monkeypatch)
Elephactory.prototype._isAttributesObject = function (oObject) {
	return (oObject !== null && typeof oObject === 'object' && !this._isDOMNode(oObject));
};
Elephactory.prototype._isDOMNode = function (mNode) {
	return ('nodeName' in mNode && 'nodeType' in mNode);
};
Elephactory.prototype._addEventListener = function (oElement, sEvent, fnCallback) {
	return oElement.addEventListener(sEvent, fnCallback);
};
Elephactory.prototype._createElement = function (sTag, oAttributes) {
	var oElement;

	oElement = this.createElement(sTag);
	this._setAttributes(oElement, oAttributes);

	return oElement;
};
Elephactory.prototype._setAttributes = function (oElement, oAttributes) {
	var sAttribute;
	for (sAttribute in oAttributes) {
		this._setAttribute(oElement, sAttribute, oAttributes[sAttribute]);
	}
};
Elephactory.prototype._setAttribute = function (oElement, sAttribute, mValue) {
	var	aMatches,
		aHandlers,
		i, l;
	if (oAttributes.hasOwnProperty(sAttribute)) {
		aMatches = sAttribute.match(/^on([a-z]+)$/);
		if (aMatches) {
			// Event Handlers (Array or single function)
			aHandlers = Array.isArray(mValue) ? mValue : [mValue];
			for (i = 0, l = mValue.length; i < l; i++) {
				if (typeof mValue[i] === 'function') {
					this._addEventListener(aMatches[0], mValue);
				}
			}
		} else if (mValue === true) {
			// Boolean TRUE: emulate XHTML behaviour
			oElement.setAttribute(sAttribute, sAttribute);
		} else if (mValue === false || mValue === null) {
			// Boolean FALSE or NULL: treat as removal
			oElement.removeAttribute(sAttribute);
		} else {
			// Anything else
			oElement.setAttribute(sAttribute, mValue);
		}
	}
};
Elephactory.prototype._toDOMNode = function (mNode) {
	// TODO: Add in a way to add custom handlers, or will monkeypatching provide this for us?
	if (this._isDOMNode(mNode)) { // DOM Node
		return mNode;
	} else if (typeof mNode === 'string' || typeof mNode === 'number') { // Anything else that's useful to display
		return this.oDocument.createTextNode(mNode);
	}
	return null;
};
Elephactory.prototype._appendChildren = function (oNode, aChildren) {
	var i, l, oChildNode;
	for (i = 0, l = aChildren.length; i < l; i++) {
		oChildNode = this._toDOMNode(aChildren[i]);
		if (oChildNode) {
			oNode.appendChild(oChildNode);
		}
	}
};

// FACTORIES
// Element Factory
Elephactory.prototype._element = function () {
	var oElement, aChildren;
	if (this._isAttributesObject(oAttributes)) {
		aChildren = Array.prototype.slice.call(arguments, 2);
	} else {
		oAttributes = {};
		aChildren = Array.prototype.slice.call(arguments, 1);
	}

	// Create our Element
	oElement = this._createElement(this, sTag, oAttributes);

	// Set attributes
	this._setAttributes(oElement, oAttributes);

	// Append children
	this._appendChildren(oElement, aChildren);

	return oElement;
};

// Fragment Factory
Elephactory.prototype._fragment = function () {
	var aChildren = Array.prototype.slice.call(arguments, 0),
		oFragment = this.oDocument.createDocumentFragment();

	// Append children
	this._appendChildren(oFragment, aChildren);

	return oFragment;
};

// EXPORTS
exports.for = function (oDocument) {
	// TODO: Do we want to memoise?
	var oInstance = new Elephactory(oDocument);

	var i, l;
	for (i = 0, l = _aElements.length; i < l; i++) {
		oInstance[_aElements[i]] = _elementFactory.bind(oDocument, _aElements[i]);
	}

	return oInstance;
};
exports.Elephactory = Elephactory;