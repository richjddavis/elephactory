"use strict";

var Elephactory = require('../elephactory');

function _objectCreate(oPrototype) {
	function F() {}
	F.prototype = oPrototype;
	return new F();
}

function Elephactory_CrossBrowser(oDocument, aTags) {
	Elephactory.call(this, oDocument, aTags);
}
Elephactory_CrossBrowser.prototype = _objectCreate(Elephactory.prototype);

// Overrides
//---------------------------------------------------------------------------//
var _oIETypeBugTags = {'input':'input', 'button':'button'};
Elephactory_CrossBrowser.prototype._createElement = function (sTag, oAttributes) {
	var oElement;

	// oldIE doesn't like changing input and button types after creation
	if (sTag in _oIETypeBugTags && 'type' in oAttributes && typeof oAttributes.type === 'string') {
		try {
			return this.oDocument.createElement('<' + sTag + ' type="' + oAttributes.type + '" />');
		} catch (oException) {/* noop */}
	}
	return this.oDocument.createElement(sTag);
};

Elephactory_CrossBrowser.prototype._setAttribute = function (oElement, sAttribute, mValue) {
	// oldIE doesn't like changing input and button types after creation
	if (oElement.nodeName.toLowerCase() in _oIETypeBugTags && sAttribute === 'type') {
		// Ignore, as this has already been handled elsewhere
		return;
	}
	// Pass through to base implementation
	return Elephactory.prototype._setAttribute.call(this, oElement, sAttribute, mValue);
};

Elephactory_CrossBrowser.prototype._addEventListener = function (oElement, sEvent, fnHandler) {
	if ('attachEvent' in oElement) {
		oElement.attachEvent(sEvent, fnHandler);
	} else {
		oElement.addEventListener(sEvent, fnHandler, false);
	}
};

// "Factories"
//---------------------------------------------------------------------------//
Elephactory_CrossBrowser.create = function (oDocument) {
	var oInstance = new Elephactory_CrossBrowser(oDocument, Elephactory._aHTML5Elements);

	return oInstance;
};
var _oMemoised = {
	aDocuments : [],
	aInstances : []
};
Elephactory_CrossBrowser.get = function (oDocument) {
	var oInstance,
		i, l;
	// Check if it's already memoised
	for (i = 0, l = _oMemoised.aDocuments.length; i < l; i++) {
		if (_oMemoised.aDocuments[i] === oDocument) {
			return _oMemoised.aInstances[i];
		}
	}
	// Instantiate, cache, return
	oInstance = Elephactory_CrossBrowser.create(oDocument);
	_oMemoised.aDocuments.push(oDocument);
	_oMemoised.aInstances.push(oInstance);
	return oInstance;
};

// EXPORTS
module.exports = Elephactory_CrossBrowser;