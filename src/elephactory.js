"use strict";

// CONSTRUCTOR
function Elephactory(oDocument, aTags) {
	this.oDocument = oDocument;

	var i, l;
	for (i = 0, l = aTags.length; i < l; i++) {
		this[aTags[i]] = this._element.bind(oDocument, aTags[i]);
	}
}

// UTILITIES (that we might want to monkeypatch)
Elephactory.prototype._isAttributesObject = function (oObject) {
	return (oObject !== null && typeof oObject === 'object' && !this._isDOMNode(oObject));
};
Elephactory.prototype._isDOMNode = function (mNode) {
	return ('nodeType' in mNode);
};
Elephactory.prototype._createElement = function (sTag, oAttributes) {
	return this.oDocument.createElement(sTag);
};
Elephactory.prototype._setAttributes = function (oElement, oAttributes) {
	var sAttribute;
	for (sAttribute in oAttributes) {
		if (oAttributes.hasOwnProperty(sAttribute)) {
			this._setAttribute(oElement, sAttribute, oAttributes[sAttribute]);
		}
	}
};
Elephactory.prototype._setAttribute = function (oElement, sAttribute, mValue) {
	var	aMatches,
		aHandlers,
		i, l;

	aMatches = sAttribute.match(/^on([a-z]+)$/);
	if (aMatches) {
		// Event Handlers (Array or single function)
		aHandlers = Array.isArray(mValue) ? mValue : [mValue];
		for (i = 0, l = mValue.length; i < l; i++) {
			if (typeof mValue[i] === 'function') {
				this._addEventListener(oElement, aMatches[0], mValue);
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
};
Elephactory.prototype._addEventListener = function (oElement, sEvent, fnHandler) {
	oElement.addEventListener(sEvent, fnHandler, false);
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
Elephactory.prototype._element = function (sTag, oAttributes) {
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

Elephactory.create = function (oDocument) {
	var oInstance = new Elephactory(oDocument, Elephactory._aHTML5Elements);

	return oInstance;
};
var _oMemoised = {
	aDocuments : [],
	aInstances : []
};
Elephactory.get = function (oDocument) {
	var oInstance,
		i, l;
	// Check if it's already memoised
	for (i = 0, l = _oMemoised.aDocuments.length; i < l; i++) {
		if (_oMemoised.aDocuments[i] === oDocument) {
			return _oMemoised.aInstances[i];
		}
	}
	// Instantiate, cache, return
	oInstance = Elephactory.create(oDocument);
	_oMemoised.aDocuments.push(oDocument);
	_oMemoised.aInstances.push(oInstance);
	return oInstance;
};

// List of elements taken from http://joshduck.com/periodic-table.html
Elephactory._aHTML5Elements = ['html', 'col', 'table', 'head', 'span', 'div', 'fieldset', 'form', 'body', 'h1', 'section', 'colgroup', 'tr', 'title', 'a', 'pre', 'meter', 'select', 'aside', 'h2', 'header', 'caption', 'td', 'meta', 'rt', 'dfn', 'em', 'i', 'small', 'ins', 's', 'br', 'p', 'blockquote', 'legend', 'optgroup', 'address', 'h3', 'nav', 'menu', 'th', 'base', 'rp', 'abbr', 'time', 'b', 'strong', 'del', 'kbd', 'hr', 'ol', 'dl', 'label', 'option', 'datalist', 'h4', 'article', 'command', 'tbody', 'link', 'noscript', 'q', 'var', 'sub', 'mark', 'bdi', 'wbr', 'figcaption', 'ul', 'dt', 'input', 'output', 'keygen', 'h5', 'footer', 'summary', 'thead', 'style', 'script', 'cite', 'samp', 'sup', 'ruby', 'bdo', 'code', 'figure', 'li', 'dd', 'textarea', 'button', 'progress', 'h6', 'hgroup', 'details', 'tfoot', 'img', 'area', 'map', 'embed', 'object', 'param', 'source', 'iframe', 'canvas', 'track', 'audio', 'video'];

// EXPORTS
module.exports = Elephactory;