/**
 * @fileoverview 指示書作成のためのJavaScriptライブラリ<br>
 * @author Copyright (C) FUJIFILM Business Innovation Corp. 2021
 * @version 2.0.1
 * @lang ja
 */
/**
 * @fileoverview JavaScript Library for creating Job Flow Sheets.<br>
 * @author Copyright (C) FUJIFILM Business Innovation Corp. 2021
 * @version 2.0.1
 * @lang en
 */

(function() {
	var _JSheepXMLIF = {};
	_JSheepXMLIF.xml = new XMLLib.XMLSOAP();

	_JSheepXMLIF.createElementNS = function(elementName, namespace) {
		if (namespace === undefined) {
			namespace = XMLLib.NS.JT;
		}
		return this.xml.createElementNS(namespace, elementName);
	};

	_JSheepXMLIF.createElementNSwithText = function(elementName, text, namespace) {
		if (namespace === undefined) {
			namespace = XMLLib.NS.JT;
		}
		return this.xml.createElementNSwithText(namespace, elementName, text);
	};

	_JSheepXMLIF.setAttributeNS = function(node, attrName, attrValue, namespace) {
		if (namespace === undefined) {
			namespace = XMLLib.NS.JT;
		}
		this.xml.setAttributeNS(node, namespace, attrName, attrValue);
	};

	_JSheepXMLIF.appendChild = function(parentNode, childNode) {
		parentNode.appendChild(childNode);
		return childNode;
	};

	_JSheepXMLIF.createSOAPEnvelope = function() {
		return this.xml.createSOAPEnvelope();
	};

	_JSheepXMLIF.XMLToString = function(node) {
		return XMLLib.XMLToString(node);
	};

	_JSheepXMLIF.addNSDeclaration = function(namespace, node , force) {
		this.xml.addNSDeclaration(namespace, node , force);
	};

	_JSheepXMLIF.addRootElementToDocumentNode = function(rootElement) {
		this.xml.xmlDoc.documentElement.appendChild(rootElement);
	};

	_JSheepXMLIF.removeRootElementFromDocumentNode = function(rootElement) {
		this.xml.xmlDoc.documentElement.removeChild(rootElement);
	};

	_JSheepXMLIF.setTextNode = function(node, text) {
		var textNode;
		
		if (node.childNodes[0]) {
			textNode = node.childNodes[0];
			textNode.nodeValue = text;
		} else {
			textNode = this.xml.createTextNode(text);
			node.appendChild(textNode);
		}
	};

	_JSheepXMLIF.getText = function(node) {
		var text = "";
		
		if (node.childNodes[0]) {
			text = node.childNodes[0].nodeValue;
		}
		
		return text;
	};

	_JSheepXMLIF.removeNode = function(node) {
		node.parentNode.removeChild(node); 
	};

	_JSheepXMLIF.removeAttributeNS = function(node, attrName, namespace) {
		if (namespace === undefined) {
			namespace = XMLLib.NS.JT;
		}
		attrName = this.xml.nss.getPrefix(namespace) + ":" + attrName;
		return node.removeAttribute(attrName);
	};


	_JSheepXMLIF.createXMLObject = function(xmlText) 
	{
		return XMLLib.createXMLObject(xmlText);
	};



	var JSheep = function () {

		_JSheepXMLIF.xml = new XMLLib.XMLSOAP();

		this.jobTemplateHeader = null;
		this.jobTemplate = null;
	};

	JSheep._getNameInfo = function(str) {

		var index = str.lastIndexOf(":");

		if (index == -1) {
			return {namespacePrefix: null, nodeName: str};
		} else {
			return {namespacePrefix: str.slice(0, index), nodeName: str.slice(index + 1)};
		}
	};

	JSheep._analyseNode = function(objParent, objElement) {

		var i;
		var nodeNameInfo;

		nodeNameInfo = JSheep._getNameInfo(objElement.nodeName);
		if (nodeNameInfo.namespacePrefix == null) {
			return null;
		}


		var objNode;

		if (objParent === undefined) {
			objNode = new JSheep.Node(objParent, nodeNameInfo.nodeName, undefined, objElement.namespaceURI);
		} else {
			objNode = objParent.add(nodeNameInfo.nodeName, undefined, objElement.namespaceURI);
		}
		
		if ((nodeNameInfo.nodeName == "Envelope") && (objElement.namespaceURI == XMLLib.NS.SOAP)) {
			_JSheepXMLIF.addNSDeclaration(XMLLib.NS.SOAP, objNode.fElement, true);
			_JSheepXMLIF.addNSDeclaration(XMLLib.NS.JT, objNode.fElement, true);
 		} else if ((nodeNameInfo.nodeName == "Header") && (objElement.namespaceURI == XMLLib.NS.SOAP)) {
			_JSheepXMLIF.addNSDeclaration(XMLLib.NS.SOAP, objNode.fElement, true);
 		} else if ((nodeNameInfo.nodeName == "JobTemplate") && (objElement.namespaceURI == XMLLib.NS.JT)) {
			_JSheepXMLIF.addNSDeclaration(XMLLib.NS.JT, objNode.fElement, true);
		}

		var objAttributes = objElement.attributes;
		for (i = 0; i < objAttributes.length; i++) {

			var eachAttrNode = objAttributes[i];
			var attrNameInfo = JSheep._getNameInfo(eachAttrNode.nodeName);

			if (attrNameInfo.namespacePrefix == "xmlns") {
				continue;
			}

			objNode.setAttr(attrNameInfo.nodeName, eachAttrNode.nodeValue, eachAttrNode.namespaceURI);
		}

		var objChildren = objElement.childNodes;
		for (i = 0; i < objChildren.length; i++) {

			var eachChildNode = objChildren[i];

			switch (eachChildNode.nodeType) {

				case 1:
					JSheep._analyseNode(objNode, eachChildNode);
					break;

				case 3:

					var nodeValue = eachChildNode.nodeValue;

					for (var j = 0; j < objChildren.length; j++) {
						if (objChildren[j].nodeType == 1) {
							nodeValue = nodeValue.split(/\s+/).join('');
							break;
						}
					}

					if (nodeValue !== '') {
						objNode.setValue(nodeValue);
					}
					break;

				default:
					break;
			}

		}

		return objNode;

	};

	JSheep._searchNode = function(foundArray, objParent, nodeName) {

		if (typeof foundArray != "object") {
			JSheep._log("[Error] JSheep._searchNode: ", 'typeof foundArray != "object"');
			return null;
		}

		if (!foundArray) {
			JSheep._log("[Error] JSheep._searchNode: ", '!foundArray');
			return null;
		}

		if (typeof objParent != "object") {
			JSheep._log("[Error] JSheep._searchNode: ", 'typeof objParent != "object"');
			return null;
		}

		if (!objParent) {
			JSheep._log("[Error] JSheep._searchNode: ", '!objParent');
			return null;
		}

		var objChildren = objParent.fChildren;
		var i;
			
		for (i = 0; i < objChildren.length; i++) {

			var objNode = objChildren[i];

			if (objNode.fName === nodeName) {
				foundArray.push(objNode);
			} else {
				JSheep._searchNode(foundArray, objNode, nodeName);
			}
		}

	};

	JSheep.prototype.import = function(str) {

	 	var doc = _JSheepXMLIF.createXMLObject(str);
		var rootElement = doc.documentElement;

		var root = JSheep._analyseNode(undefined, rootElement);

		var objRootNode = new JSheep.RootNode(root);

		if (objRootNode.fError) {
			JSheep._log("[Error] JSheep.import: ", "objRootNode.fError");
			return null;
		}

		return objRootNode;

	};

	JSheep.RootNode = function (root) {

		this.fError = true;

		if(typeof root != "object") {
			JSheep._log("[Error] JSheep.RootNode: ", "typeof root != object");
			return;
		}
		
		this.fRootNode = root;

		this.fError = false;
	};

	JSheep.RootNode.prototype.getTemplateType = function () {

		var foundArray = [];

		JSheep._searchNode(foundArray, this.fRootNode, "DocumentProcess");

		if (foundArray.length != 1) {
			JSheep._log("[Error] JSheep.RootNode.getTemplateTypee: ", "foundArray.length != 1", "foundArray.length = ", foundArray.length);
			return null;
		}

		var objDocumentProcess = foundArray[0];
		var ret;
		
		if (objDocumentProcess.get("Copy") != null) {
			
			ret = JSheep.TEMPLATETYPE.COPY;
			
		} else if (objDocumentProcess.get("StreamIn") != null) {

			ret = JSheep.TEMPLATETYPE.FAX;

		} else if (objDocumentProcess.get("Report") != null) {

			ret = JSheep.TEMPLATETYPE.REPORT;

		} else if (objDocumentProcess.get("Acquire") != null) {

			var objAcquire = objDocumentProcess.get("Acquire");
			
			if (objAcquire.get("Scanner") != null) {
				ret = JSheep.TEMPLATETYPE.SCAN;
			} else	if (objAcquire.get("Mailbox") != null) {
				ret = JSheep.TEMPLATETYPE.MAILBOX;
			} else {
				ret = JSheep.TEMPLATETYPE.PRINT;
			}

		} else {

			ret = JSheep.TEMPLATETYPE.WITHOUTDOC;

		} 

		return ret;
	};


	JSheep.RootNode.prototype.getContentList = function () {

		var foundArray = [];

		JSheep._searchNode(foundArray, this.fRootNode, "DocumentProcess");

		if (foundArray.length != 1) {
			JSheep._log("[Error] JSheep.RootNode.getContentList: ", "foundArray.length != 1", "foundArray.length = ", foundArray.length);
			return null;
		}

		var objDocumentProcess = foundArray[0];
		var retArray = [];

		for (var prop in JSheep.CONTENTTYPE) {

			var objContentType = JSheep.CONTENTTYPE[prop];
			var foundArray2 = [];

			JSheep._searchNode(foundArray2, objDocumentProcess, objContentType.elementName);

			for (var i = 0; i < foundArray2.length; i++) {

				var objNode = foundArray2[i];
				var found = false;
				var j;

				if (objContentType.father) {

					for (j = 0; j < objContentType.father.length; j++) {
						if (objNode.fParent.fName == objContentType.father[j]) {
							found = true;
							break;
						}
					}

				} else if (objContentType.grandfather) {

					for (j = 0; j < objContentType.grandfather.length; j++) {
						if (objNode.fParent.fParent.fName == objContentType.grandfather[j]) {
							found = true;
							break;
						}
					}

				} else {
					found = true;
				}

				if (found) {
					retArray.push(objContentType);
				}

			}

		}

		return retArray;
		
	};


	JSheep.RootNode.prototype.getContent = function(objContentType, index) {

		if (typeof objContentType != "object") {
			JSheep._log("[Error] JSheep.getContent: ", 'typeof objContentType != "object"');
			return null;
		}

		if (!objContentType) {
			JSheep._log("[Error] JSheep.getContent: ", '!objContentType');
			return null;
		}

		if (index === undefined) {
			index = 0;
		}

		var foundArray = [];

		JSheep._searchNode(foundArray, this.fRootNode, "DocumentProcess");

		if (foundArray.length != 1) {
			JSheep._log("[Error] JSheep.RootNode.getContent: ", "foundArray.length != 1", "foundArray.length = ", foundArray.length);
			return null;
		}

		var objDocumentProcess = foundArray[0];
		var foundArray2 = [];

		JSheep._searchNode(foundArray2, objDocumentProcess, objContentType.elementName);

		for (var i = 0; i < foundArray2.length; i++) {

			var objNode = foundArray2[i];
			var found = false;
			var j;

			if (objContentType.father) {

				for (j = 0; j < objContentType.father.length; j++) {
					if (objNode.fParent.fName == objContentType.father[j]) {
						found = true;
						break;
					}
				}

			} else if (objContentType.grandfather) {

				for (j = 0; j < objContentType.grandfather.length; j++) {
					if (objNode.fParent.fParent.fName == objContentType.grandfather[j]) {
						found = true;
						break;
					}
				}

			} else {
				found = true;
			}

			if (found) {

				if (index === 0) {

					switch (objContentType.category) {

						case JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE:
						case JSheep._CONTENTTYPE_CATERGORY.STREAMOUT:
							return objNode.fParent.fParent;

						default:
							return objNode;

					}

				} else {
					index--;
				}
				
			}

		}

		JSheep._log("[Error] JSheep.getContent: ", 'not found');
		return null;

	};

	JSheep.RootNode.prototype.getHeaderContent = function() {

		var foundArray = [];

		JSheep._searchNode(foundArray, this.fRootNode, "Header");

		if (foundArray.length != 1) {
			JSheep._log("[Error] JSheep.RootNode.getHeaderContent: ", "foundArray.length != 1", "foundArray.length = ", foundArray.length);
			return null;
		}

		return foundArray[0];

	};

	JSheep.prototype.serializeFromNode = function (objRootNode) {

		this.jobTemplateHeader = null;
		this.jobTemplate = null;

		if (typeof objRootNode != "object") {
			JSheep._log("[Error] JSheep.serializeFromNode: ", 'typeof objRootNode != "object"');
			return false;
		}

		if (!objRootNode) {
			JSheep._log("[Error] JSheep.serializeFromNode: ", '!objRootNode');
			return false;
		}

		var foundArray = [];

		JSheep._searchNode(foundArray, objRootNode.fRootNode, "JobTemplate");
		
		this.jobTemplateHeader = (foundArray.length == 1) ? foundArray[0].fElement : null;
		this.jobTemplate = objRootNode.fRootNode.fElement;

		return true;

	};

	
	JSheep.prototype.serialize = function (obj) {

		this.jobTemplateHeader = null;
		this.jobTemplate = null;

		if (typeof obj != "object") {
			JSheep._log("[Error] JSheep.serialize: ", 'typeof obj != "object"');
			return false;
		}

		if (!obj) {
			JSheep._log("[Error] JSheep.serialize: ", '!obj');
			return false;
		}

		var templateType = obj.templateType;
		var headerNode = obj.headerNode;
		var setupNode = obj.setupNode;
		var contentNodeArray = obj.contentNodeArray;
		var option = obj.option;

		var found = false;

		for (var prop in JSheep.TEMPLATETYPE) {
			if (JSheep.TEMPLATETYPE[prop] === templateType) {
				found = true;
				break;
			}
		}

		if (found === false) {
			JSheep._log("[Error] JSheep.serialize: ", "found === false", "obj.templateType =", obj.templateType);
			return false;
		}

		if (typeof headerNode != "object") {
			JSheep._log("[Error] JSheep.serialize: ", 'typeof headerNode != "object"');
			return false;
		}

		if (typeof contentNodeArray != "object") {
			JSheep._log("[Error] JSheep.serialize: ", 'typeof contentNodeArray != "object"');
			return false;
		}


		var objEnvelope = new JSheep.Node(undefined, "Envelope", undefined, XMLLib.NS.SOAP);

		var optionResult = JSheep._handleOption(option, objEnvelope.fName);
		for (var i = 0; i < optionResult.value_infoOfParentAttr.length; i++) {
			var eachParentAttr = optionResult.value_infoOfParentAttr[i];

			for (var nameOfParentAttr in eachParentAttr) {
				objEnvelope.setAttr(nameOfParentAttr, eachParentAttr[nameOfParentAttr], null);
			}
		}

		_JSheepXMLIF.addNSDeclaration(XMLLib.NS.SOAP, objEnvelope.fElement, true);
		_JSheepXMLIF.addNSDeclaration(XMLLib.NS.JT, objEnvelope.fElement, true);

		if (headerNode && (headerNode.constructor === JSheep.HeaderNode)) {
			_JSheepXMLIF.appendChild(objEnvelope.fElement, headerNode.fHeaderNode.fElement);
		}
		
		var objBody = objEnvelope.add("Body", undefined, XMLLib.NS.SOAP);
		var objProcessRequestNode = objBody.add("ProcessRequest");
		if (setupNode) {
			_JSheepXMLIF.appendChild(objProcessRequestNode.fElement, setupNode.fElement);
		}
		
		var objDocumentProcessNode = objProcessRequestNode.add("DocumentProcess");
		JSheep._handleTemplateType(templateType, contentNodeArray, objDocumentProcessNode, option);
		
		if (headerNode && (headerNode.constructor === JSheep.HeaderNode)) {
			this.jobTemplateHeader = headerNode.fHeaderNode.get("JobTemplate").fElement;
		}
		this.jobTemplate = objEnvelope.fElement;

		return true;

	};

	JSheep._handleEachOption = function (eachOption, value_nameOfParentNode, optionResult) {

		if (eachOption.method == "setAttr") {
			if (eachOption.target.Node == value_nameOfParentNode) {
				var obj = {};
				obj[eachOption.name] = eachOption.value;
				optionResult.value_infoOfParentAttr.push(obj);
			}
		}
	};

	JSheep._handleOption = function (option, value_nameOfParentNode) {

		var optionResult = {value_infoOfParentAttr: []};

		if (option) {

			if (option.length === undefined) {

				JSheep._handleEachOption(option, value_nameOfParentNode, optionResult);

			} else {
			
				for (var i = 0; i < option.length; i++) {

					JSheep._handleEachOption(option[i], value_nameOfParentNode, optionResult);
				}
			}
		}

		return optionResult;
	};
	
	JSheep._getRootNode_Copy = function (objDocumentProcessNode, option) {

		var objRootNode = objDocumentProcessNode.add("Copy");

		objRootNode.setAttr("container", "Document");

		var optionResult = JSheep._handleOption(option, "Copy");

		for (var i = 0; i < optionResult.value_infoOfParentAttr.length; i++) {
			var eachParentAttr = optionResult.value_infoOfParentAttr[i];

			for (var nameOfParentAttr in eachParentAttr) {
				objRootNode.setAttr(nameOfParentAttr, eachParentAttr[nameOfParentAttr]);
			}
		}

		return objRootNode;
	};

	JSheep._getParentNode_Copy = function (objContentNode, isFirstContentNode, option) {

		var value_nameOfParentNode = null;
		var value_needSetContainer = false;
		var value_canDisplay = true;

		return {nameOfParentNode: value_nameOfParentNode, infoOfParentAttr : [], needSetContainer: value_needSetContainer, canDisplay : value_canDisplay};
	};


	JSheep._getRootNode_Print = function (objDocumentProcessNode, option) {

		return objDocumentProcessNode;
	};

	JSheep._getParentNode_Print  = function (objContentNode, isFirstContentNode, option) {

		var value_nameOfParentNode = null;
		var value_needSetContainer = false;
		var value_canDisplay = true;

		if (isFirstContentNode) {

			value_nameOfParentNode = "Acquire";
			value_needSetContainer = true;

		} else if (objContentNode.fElementName == "LocalPrint" || objContentNode.fElementName == "RemotePrint") {

			value_nameOfParentNode = "Print";

		}

		var optionResult = JSheep._handleOption(option, value_nameOfParentNode);

		return {nameOfParentNode: value_nameOfParentNode, infoOfParentAttr : optionResult.value_infoOfParentAttr, needSetContainer: value_needSetContainer, canDisplay : value_canDisplay};
	};


	JSheep._getRootNode_Fax = function (objDocumentProcessNode, option) {

		return objDocumentProcessNode;
	};

	JSheep._getParentNode_Fax= function (objContentNode, isFirstContentNode, option) {

		var value_nameOfParentNode = null;
		var value_needSetContainer = false;
		var value_canDisplay = true;

		if (isFirstContentNode) {

			value_nameOfParentNode = "StreamIn";
			value_needSetContainer = true;
			
		}
		
		var optionResult = JSheep._handleOption(option, value_nameOfParentNode);

		return {nameOfParentNode: value_nameOfParentNode, infoOfParentAttr : optionResult.value_infoOfParentAttr, needSetContainer: value_needSetContainer, canDisplay : value_canDisplay};
	};


	JSheep._getRootNode_Report = function (objDocumentProcessNode, option) {

		return objDocumentProcessNode;
	};

	JSheep._getParentNode_Report= function (objContentNode, isFirstContentNode, option) {

		var value_nameOfParentNode = null;
		var value_needSetContainer = false;
		var value_canDisplay = true;

		if (isFirstContentNode) {

			value_nameOfParentNode = "Report";
			value_needSetContainer = true;
			
		} else if (objContentNode.fElementName == "LocalPrint" || objContentNode.fElementName == "RemotePrint") {

			value_nameOfParentNode = "Print";
			
		}

		var optionResult = JSheep._handleOption(option, value_nameOfParentNode);

		return {nameOfParentNode: value_nameOfParentNode, infoOfParentAttr : optionResult.value_infoOfParentAttr, needSetContainer: value_needSetContainer, canDisplay : value_canDisplay};
	};


	JSheep._getRootNode_WithoutDoc = function (objDocumentProcessNode, option) {

		return objDocumentProcessNode;
	};

	JSheep._getParentNode_WithoutDoc = function (objContentNode, isFirstContentNode, option) {

		var value_nameOfParentNode = null;
		var value_needSetContainer = false;
		var value_canDisplay = true;

		if (isFirstContentNode) {
			
			value_canDisplay = false;
			
		}

		var optionResult = JSheep._handleOption(option, value_nameOfParentNode);

		return {nameOfParentNode: value_nameOfParentNode, infoOfParentAttr : optionResult.value_infoOfParentAttr, needSetContainer: value_needSetContainer, canDisplay : value_canDisplay};
	};


	JSheep.TEMPLATETYPE = {
		COPY : {func_getRootNode: JSheep._getRootNode_Copy, func_getParentNode: JSheep._getParentNode_Copy},
		PRINT : {func_getRootNode: JSheep._getRootNode_Print, func_getParentNode: JSheep._getParentNode_Print},
		FAX : {func_getRootNode: JSheep._getRootNode_Fax, func_getParentNode: JSheep._getParentNode_Fax},
		SCAN : {func_getRootNode: JSheep._getRootNode_Print, func_getParentNode: JSheep._getParentNode_Print},
		REPORT : {func_getRootNode: JSheep._getRootNode_Report, func_getParentNode: JSheep._getParentNode_Report},
		MAILBOX : {func_getRootNode: JSheep._getRootNode_Print, func_getParentNode: JSheep._getParentNode_Print},
		WITHOUTDOC : {func_getRootNode: JSheep._getRootNode_WithoutDoc, func_getParentNode: JSheep._getParentNode_WithoutDoc},
	};

	JSheep.version = "1.0.0";

	JSheep._handleContent = function (objRootNode, infoOfParentNode, objContentNode, indexOfConcurrence, numOfConcurrence) {

		var objTempNode1;
		var objTempNode2;

		if (indexOfConcurrence == 1) {
			objTempNode1 = objRootNode.add("Concurrence");
		} else if (indexOfConcurrence >= 2) {
			objTempNode1 = objRootNode.get("Concurrence", numOfConcurrence - 1);
		} else {
			objTempNode1 = objRootNode;
		}

		if (infoOfParentNode.nameOfParentNode) {
			objTempNode2 = objTempNode1.add(infoOfParentNode.nameOfParentNode);

			if (infoOfParentNode.needSetContainer) {
				objTempNode2.setAttr("container", "Document");
			}

			for (var i = 0; i < infoOfParentNode.infoOfParentAttr.length; i++) {
				var eachParentAttr = infoOfParentNode.infoOfParentAttr[i];

				for (var nameOfParentAttr in eachParentAttr) {
					objTempNode2.setAttr(nameOfParentAttr, eachParentAttr[nameOfParentAttr]);
				}
			}
		} else {
			objTempNode2 = objTempNode1;
		}

		if (infoOfParentNode.canDisplay) {
			_JSheepXMLIF.appendChild(objTempNode2.fElement, objContentNode.fElement);				
		}

	};

	JSheep._handleTemplateType = function (templateType, contentNodeArray, objDocumentProcessNode, option) {

		if (contentNodeArray) {

			var objRootNode = templateType.func_getRootNode(objDocumentProcessNode, option);
			var numOfConcurrence = 0;

			for (var i = 0; i < contentNodeArray.length; i++) {
				
				if (contentNodeArray[i]) {

					var infoOfParentNode;
					var objContentNode;
					var indexOfConcurrence = 0;
					var isFirstContentNode = false;

					if (contentNodeArray[i].length !== undefined) {

						numOfConcurrence++;

						for (var j = 0; j < contentNodeArray[i].length; j++) {

							isFirstContentNode = ((i === 0) && (j === 0)) ? true : false;
							objContentNode = contentNodeArray[i][j];
							infoOfParentNode = templateType.func_getParentNode(objContentNode, isFirstContentNode, option);
							indexOfConcurrence = j + 1;

							JSheep._handleContent(objRootNode, infoOfParentNode, objContentNode, indexOfConcurrence, numOfConcurrence);
						}


					} else {

							isFirstContentNode = (i === 0) ? true : false;
							objContentNode = contentNodeArray[i];
							infoOfParentNode = templateType.func_getParentNode(objContentNode, isFirstContentNode, option);

							JSheep._handleContent(objRootNode, infoOfParentNode, objContentNode, indexOfConcurrence, numOfConcurrence);

					}

				}
			}
		}

	};

	

	JSheep.prototype.Content = function(objContentType) {

		if (typeof objContentType != "object") {
			JSheep._log("[Error] JSheep.Content: ", 'typeof objContentType != "object"');
			return null;
		}

		if (!objContentType) {
			JSheep._log("[Error] JSheep.Content: ", '!objContentType');
			return null;
		}

		var objNode;

		switch (objContentType.category) {

			case JSheep._CONTENTTYPE_CATERGORY.STARTINGPOINT:
			case JSheep._CONTENTTYPE_CATERGORY.OUTPUT:
			case JSheep._CONTENTTYPE_CATERGORY.OTHER:
				objNode = new JSheep.Node(undefined, objContentType.elementName);

				if (objNode.fError) {
					JSheep._log("[Error] JSheep.Content: ", "objNode.fError", "objContentType.category =", objContentType.category, "objContentType.elementName =", objContentType.elementName);
					return null;
				}
				
				break;

			case JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE:

				objNode = new JSheep.Node(undefined, "Distribute");

				if (objNode.fError) {
					JSheep._log("[Error] JSheep.Content: ", "objNode.fError", "objContentType.category =", objContentType.category, "objContentType.elementName =", objContentType.elementName);
					return null;
				}

				objNode.add("Serialization");
				objNode.add("Destinations").add(objContentType.elementName);

				break;

			case JSheep._CONTENTTYPE_CATERGORY.STREAMOUT:

				objNode = new JSheep.Node(undefined, "StreamOut");

				if (objNode.fError) {
					JSheep._log("[Error] JSheep.Content: ", "objNode.fError", "objContentType.category =", objContentType.category, "objContentType.elementName =", objContentType.elementName);
					return null;
				}

				objNode.add("Destinations").add(objContentType.elementName);

				break;

			default:
				JSheep._log("[Error] JSheep.Content: ", "objContentType.category is out of range", "objContentType.category =", objContentType.category, "objContentType.elementName =", objContentType.elementName);
				return null;

		}
		
		objNode.fElementName = objContentType.elementName;
		objNode.fCategory = objContentType.category;

		return objNode;
	};

	JSheep._CONTENTTYPE_CATERGORY = {
		STARTINGPOINT : 1,
		DISTRIBUTE : 2,
		STREAMOUT : 3,
		OUTPUT : 4,
		OTHER : 5,
	};
		
	JSheep.CONTENTTYPE = {
		SCANNER : {elementName: "Scanner", category: JSheep._CONTENTTYPE_CATERGORY.STARTINGPOINT},
		MAILBOX : {elementName: "Mailbox", category: JSheep._CONTENTTYPE_CATERGORY.STARTINGPOINT, father: ["Acquire", "StreamIn"] },
		MEDIA : {elementName: "Media", category: JSheep._CONTENTTYPE_CATERGORY.STARTINGPOINT, father: ["Acquire"]},
		REPORT : {elementName: "ReportType", category: JSheep._CONTENTTYPE_CATERGORY.STARTINGPOINT},

		MAILBOXTRANSFER : {elementName: "Mailbox", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE, grandfather: ["Distribute"]},
		FILETRANSFER : {elementName: "FileTransfer", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE},
		FAXTRANSFER : {elementName: "Fax", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE, grandfather: ["Distribute"]},
		IPFAXTRANSFER : {elementName: "SIPFax", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE, grandfather: ["Distribute"]},
		INTERNETFAXTRANSFER : {elementName: "IFax", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE},
		SMTPTRANSFER : {elementName: "Smtp", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE},
		PLUGINTRANSFER : {elementName: "PluginTransfer", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE},
		MEDIATRANSFER : {elementName: "Media", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE, grandfather: ["Distribute"]},
		WEBDAVTRANSFER : {elementName: "WebDAV", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE},
		WSDTRANSFER : {elementName: "WSDTransfer", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE},
		AIRPRINTRANSFER : {elementName: "AirPrintTransfer", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE},
		MYFOLDERTRANSFER : {elementName: "MyFolderTransfer", category: JSheep._CONTENTTYPE_CATERGORY.DISTRIBUTE},
			
		FAX : {elementName: "Fax", category: JSheep._CONTENTTYPE_CATERGORY.STREAMOUT, grandfather: ["StreamOut"]},
		IPFAX : {elementName: "SIPFax", category: JSheep._CONTENTTYPE_CATERGORY.STREAMOUT, grandfather: ["StreamOut"]},

		LOCALPRINT : {elementName: "LocalPrint", category: JSheep._CONTENTTYPE_CATERGORY.OUTPUT},
		REMOTEPRINT : {elementName: "RemotePrint", category: JSheep._CONTENTTYPE_CATERGORY.OUTPUT},
		INVOKE : {elementName: "Invoke", category: JSheep._CONTENTTYPE_CATERGORY.OUTPUT},

		SETUP : {elementName: "Setup", category: JSheep._CONTENTTYPE_CATERGORY.OTHER},
		NOTIFICATION : {elementName: "Notification", category: JSheep._CONTENTTYPE_CATERGORY.OTHER},
		ASSIGN : {elementName: "Assign", category: JSheep._CONTENTTYPE_CATERGORY.OTHER},
		MESSAGE : {elementName: "Message", category: JSheep._CONTENTTYPE_CATERGORY.OTHER},
		WORKSPACE : {elementName: "Workspace", category: JSheep._CONTENTTYPE_CATERGORY.OTHER},
		TRANSFORM : {elementName: "Transform", category: JSheep._CONTENTTYPE_CATERGORY.OTHER},
	};		


	JSheep.prototype.HeaderContent = function() {

		var objHeaderNode = new JSheep.HeaderNode();

		if (objHeaderNode.fError) {
			JSheep._log("[Error] JSheep.HeaderContent: ", "objHeaderNode.fError");
			return null;
		}

		return objHeaderNode;
	};

	JSheep.HeaderNode = function () {
		
		this.fError = true;

		this.fHeaderNode = new JSheep.Node(undefined, "Header", undefined, XMLLib.NS.SOAP);

		if (this.fHeaderNode.fError) {
			JSheep._log("[Error] JSheep.HeaderNode: ", "this.fHeaderNode.fError");
			return;
		}

		var strDateTime = JSheep._getDateTime();
		
		var objNode_JobTemplate = this.fHeaderNode.add("JobTemplate");
		objNode_JobTemplate.setAttr("version", "6.0.0");
		objNode_JobTemplate.setAttr("profile", "0");
		objNode_JobTemplate.add("Description");
		objNode_JobTemplate.add("Copyright");
		objNode_JobTemplate.add("Author");
		var objNode_CreatedBy = objNode_JobTemplate.add("CreatedBy");
		objNode_CreatedBy.setAttr("identifier", "0");
		objNode_JobTemplate.add("CreationDateTime", strDateTime);
		objNode_JobTemplate.add("ModificationDateTime", strDateTime);
		objNode_JobTemplate.add("TargetInterpreters").add("MachineOID", "1.3.6.1.4.1");
		var objNode_ExecutionHints = objNode_JobTemplate.add("ExecutionHints");
		objNode_ExecutionHints.add("Resources");
		objNode_ExecutionHints.add("JobAttributes").add("Framework", "StandardJob");
		objNode_JobTemplate.add("Keywords").add("Keyword");

		this.fError = false;
		
	};
	
	JSheep.HeaderNode.prototype.setName = function (name) {
		
		if (typeof name != "string") {
			JSheep._log("[Error] JSheep.HeaderNode.prototype.setName: ", "typeof name != string", "name =", name);
			return null;
		}

		var objNode_JobTemplate = this.fHeaderNode.get("JobTemplate");

		if (objNode_JobTemplate.get("Name") != null) {
			JSheep._log("[Error] JSheep.HeaderNode.prototype.setName: ", 'objNode_JobTemplate.get("Name") != null', "name =", name);
			return null;
		}

		var objNode_Name = objNode_JobTemplate.add("Name", name);

		return objNode_Name;

	};

	JSheep.HeaderNode.prototype.addResource = function (arrayResource) {
		
		if (typeof arrayResource != "object") {
			JSheep._log("[Error] JSheep.HeaderNode.prototype.addResource: ", 'typeof arrayResource != "object"');
			return null;
		}

		if (!arrayResource) {
			JSheep._log("[Error] JSheep.HeaderNode.prototype.addResource: ", '!arrayResource');
			return null;
		}

		if (arrayResource.length === 0) {
			JSheep._log("[Error] JSheep.HeaderNode.prototype.addResource: ", 'arrayResource.length === 0');
			return null;
		}

		
		var objNode_Resources = this.fHeaderNode.get("JobTemplate").get("ExecutionHints").get("Resources");

		for (var i = 0; i < arrayResource.length; i++) {

			if (typeof arrayResource[i] != "string") {
				JSheep._log("[Error] JSheep.HeaderNode.prototype.addResource: ", 'typeof eachResource != "string"', "eachResource =", arrayResource[i]);
				return null;
			}

			objNode_Resources.add("Resource", arrayResource[i]);

		}

		return objNode_Resources;

	};

	JSheep.HeaderNode.prototype.getJobTemplateNode = function () {
		
		return this.fHeaderNode.get("JobTemplate");

	};


	JSheep.Node = function (parent, name, value, namespace) {
		
		this.fError = true;

		if(typeof name != "string") {
			JSheep._log("[Error] JSheep.Node: ", "typeof name != string", "name =", name, "value =", value);
			return;
		}
		
		this.fParent = parent;
		this.fName = name;
		this.fChildren = [];
		this.fAttrArray = [];

		if (value === undefined) {
			this.fElement = _JSheepXMLIF.createElementNS(name, namespace);
		} else {
			this.fElement = _JSheepXMLIF.createElementNSwithText(name, value, namespace);
		}

		if (namespace !== null && namespace !== undefined && namespace.length > 0 && namespace != XMLLib.NS.JT && namespace != XMLLib.NS.SOAP){
			_JSheepXMLIF.addNSDeclaration(namespace, this.fElement, true);
		}

		if(parent) {
			
			var childNodeOfParent = parent.fElement.childNodes[0];
			
			if (childNodeOfParent && (childNodeOfParent.nodeType === 3)) {
				JSheep._log("[Error] JSheep.Node: ", "childNodeOfParent && (childNodeOfParent.nodeType === 3)", "childNodeOfParent.nodeType =", childNodeOfParent.nodeType);
				return;
			}

			_JSheepXMLIF.appendChild(parent.fElement, this.fElement);
		}

		this.fError = false;
		
	};

	JSheep.Node.prototype.add = function (name, value, namespace) {
		
		var objNode = new JSheep.Node(this, name, value, namespace);

		if (objNode.fError) {
			JSheep._log("[Error] JSheep.Node.prototype.add: ", "objNode.fError", "name =", name, "value =", value);
			return null;
		}
		
		this.fChildren.push(objNode);

		return objNode;
	};

	JSheep.Node.prototype.get = function (name, index) {
		
		if (typeof name != "string") {
			JSheep._log("[Error] JSheep.Node.prototype.get: ", "typeof name != string", "name =", name, "index =", index);
			return null;
		}

		var retArray = [];
		
		for (var i = 0; i < this.fChildren.length; i++) {

			var objNode = this.fChildren[i];
			
			if(objNode.fName === name) {
				retArray.push(objNode);
			}
		}

		if (retArray.length === 0) {
			return null;
		}

		if (index === undefined) {
			index = 0;
		}
		
		if (index >= retArray.length) {
			JSheep._log("[Error] JSheep.Node.prototype.get: ", "index >= retArray.length", "name =", name, "index =", index, "retArray.length = ", retArray.length);
			return null;
		}

		return retArray[index];

	};

	JSheep.Node.prototype.del = function () {

		var i;
		var index;

		for (i = 0; i < this.fChildren.length; i++) {
			var objNode = this.fChildren[i];
			objNode.del();
		}
		delete this.fChildren;

		delete this.fAttrArray;	
		
		for (i = 0; i < this.fParent.fChildren.length; i++) {
			if (this == this.fParent.fChildren[i]) {
				index = i;
				break;
			}
		}	
		this.fParent.fChildren.splice(index, 1);
		
		_JSheepXMLIF.removeNode(this.fElement);
		
		return this.fParent;
	};

	JSheep.Node.prototype.setValue = function (value) {

		var childNode = this.fElement.childNodes[0];

		if (childNode && (childNode.nodeType !== 3)) {
			JSheep._log("[Error] JSheep.Node.prototype.setValue: ", "childNode && (childNode.nodeType !== 3)", "childNode.nodeType =", childNode.nodeType, "this.fName = ", this.fName, "value = ", value);
			return null;
		}

		_JSheepXMLIF.setTextNode(this.fElement, value);

		return this;
	};

	JSheep.Node.prototype.getValue = function () {
		
		var childNode = this.fElement.childNodes[0];

		if (!childNode) {
			JSheep._log("[Error] JSheep.Node.prototype.getValue: ", "!childNode");
			return null;
		}

		if (childNode.nodeType !== 3) {
			JSheep._log("[Error] JSheep.Node.prototype.getValue: ", "childNode.nodeType !== 3", "childNode.nodeType =", childNode.nodeType);
			return null;
		}

		return _JSheepXMLIF.getText(this.fElement);
	};


	JSheep.Node.prototype.setAttr = function (attrName, attrValue, namespace) {

		var objAttrNode = new JSheep.AttrNode(this, attrName, attrValue, namespace);

		if (objAttrNode.fError) {
			JSheep._log("[Error] JSheep.Node.prototype.setAttr: ", "objAttrNode.fError", "attrName =", attrName, "attrValue =", attrValue);
			return null;
		}

		this.fAttrArray.push(objAttrNode);

		return objAttrNode;
	};

	JSheep.Node.prototype.getAttr = function (attrName) {
		
		for (var i = 0; i < this.fAttrArray.length; i++) {
			var objAttrNode = this.fAttrArray[i];
			
			if(attrName === objAttrNode.fAttrName) {
				return objAttrNode;
			}
		}

		return null;
	};


	JSheep.AttrNode = function (elementNode, attrName, attrValue, namespace) {
		
		this.fError = true;

		if (typeof attrName != "string") {
			JSheep._log("[Error] JSheep.AttrNode: ", "typeof attrName != string", "attrName =", attrName, "attrValue =", attrValue);
			return;
		}

		for (var i = 0; i < elementNode.fAttrArray.length; i++) {
			var objAttrNode = elementNode.fAttrArray[i];
			
			if(attrName === objAttrNode.fAttrName) {
				JSheep._log("[Error] JSheep.AttrNode: ", "attrName === objAttrNode.fAttrName", "attrName =", attrName, "attrValue =", attrValue);
				return;
			}
		}	

		if (namespace !== null && namespace !== undefined && namespace.length > 0 && namespace != XMLLib.NS.JT && namespace != XMLLib.NS.SOAP && namespace != XMLLib.NS.XML){
			_JSheepXMLIF.addNSDeclaration(namespace, elementNode.fElement, true);
		}

		this.fElementNode = elementNode;
		this.fAttrName = attrName;	
		this.fAttrValue = attrValue;	

		_JSheepXMLIF.setAttributeNS(this.fElementNode.fElement, this.fAttrName, attrValue, namespace);

		this.fError = false;

	};


	JSheep.AttrNode.prototype.setValue = function (attrValue, namespace) {

		_JSheepXMLIF.setAttributeNS(this.fElementNode.fElement, this.fAttrName, attrValue, namespace);
		this.fAttrValue = attrValue;	

		return this;
	};

	JSheep.AttrNode.prototype.getValue = function () {
		return this.fAttrValue;
	};

	JSheep.AttrNode.prototype.del = function () {

		var i;
		var index;
		
		for (i = 0; i < this.fElementNode.fAttrArray.length; i++) {
			if (this == this.fElementNode.fAttrArray[i]) {
				index = i;
				break;
			}
		}	
		this.fElementNode.fAttrArray.splice(index, 1);
		
		_JSheepXMLIF.removeAttributeNS(this.fElementNode.fElement, this.fAttrName);
		
		return this.fElementNode;
	};

	JSheep._getDateTime = function() {

		var date = new Date();

		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		month = JSheep._convertDateTime(month);
		
		var day = date.getDate();
		day = JSheep._convertDateTime(day);

		var hour = date.getHours();
		hour = JSheep._convertDateTime(hour);

		var minute = date.getMinutes();
		minute = JSheep._convertDateTime(minute);

		var second = date.getSeconds();
		second = JSheep._convertDateTime(second);
		
		var timeZone = date.getTimezoneOffset();
		var timeZone_Abs = (timeZone > 0) ? timeZone : -timeZone;

		var timeZone_minute = timeZone_Abs % 60;
		timeZone_minute = JSheep._convertDateTime(timeZone_minute);

		var timeZone_hour = (timeZone_Abs - timeZone_minute) / 60;
		timeZone_hour = JSheep._convertDateTime(timeZone_hour);

		
		var _val;
		_val = year.toString();		
		_val += "-" + month + "-" + day;
		_val += "T" + hour + ":" + minute + ":" + second;		
		_val += (timeZone > 0) ? "-" : "+";
		_val += timeZone_hour + ":" + timeZone_minute;
		
		return _val;
	};

	JSheep._convertDateTime = function(strDateTime) {
		if (strDateTime < 10) {
			return ("0" + strDateTime);
		} else {
			return strDateTime;
		}
	};

	JSheep._isEwb = function() {

		if (	(typeof BrowserExt !== "undefined") &&
				(window.navigator.userAgent.indexOf("browser.vxe") !== -1) &&
				(window.navigator.platform.indexOf("Win32") === -1)
		) {
			return true;
		} else {
			return false;
		}
		
	};

	var isEwb = JSheep._isEwb();

	JSheep._log = function() {
		
		var str = "";

		for (var i = 0; i < JSheep._log.arguments.length; i++) {
			str += JSheep._log.arguments[i];
			str += " ";
		}

		if (isEwb) {
			BrowserExt.NewSetLogMessage(BrowserExt.ringID.Jsheep, str, true);
		} else {
			window.console.log(str);
		}
	};

	window.JSheep = JSheep;
})();

