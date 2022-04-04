var push = [].push;

var
	support,
	Expr,
	isXML,
	tokenize,
	select,

	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	contains,

	expando = 'sizzle' + 1 * new Date(),
	preferredDoc = window.document,

	booleans = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',

	whitespace = '[\\x20\\t\\r\\n\\f]',

	identifier = '(?:\\\\.|[\\w-]|[^\0-\\xa0])+',

	attributes = '\\[' + whitespace + '*(' + identifier + ')(?:' + whitespace +

		'*([*^$|!~]?=)' + whitespace +

		'*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' + identifier + '))|)' + whitespace +
		'*\\]',

	pseudos = ':(' + identifier + ')(?:\\((' +

		'(\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|' +

		'((?:\\\\.|[^\\\\()[\\]]|' + attributes + ')*)|' +

		'.*' +
		')\\)|)',

	rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g'),

	matchExpr = {
		'ID': new RegExp('^#(' + identifier + ')'),
		'CLASS': new RegExp('^\\.(' + identifier + ')'),
		'TAG': new RegExp('^(' + identifier + '|[*])'),
		'ATTR': new RegExp('^' + attributes),
		'PSEUDO': new RegExp('^' + pseudos),
		'CHILD': new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' + whitespace +
			'*(even|odd|(([+-]|)(\\d*)n|)' + whitespace + '*(?:([+-]|)' + whitespace +
			'*(\\d+)|))' + whitespace + '*\\)|)', 'i'),
		'bool': new RegExp('^(?:' + booleans + ')$', 'i'),

		'needsContext': new RegExp('^' + whitespace + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' +
			whitespace + '*((?:-\\d)?\\d*)' + whitespace + '*\\)|)(?=[^-]|$)', 'i'),
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	runescape = new RegExp('\\\\([\\da-f]{1,6}' + whitespace + '?|(' + whitespace + ')|.)', 'ig');

function Sizzle(selector, context, results, seed){
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		nodeType = context ? context.nodeType : 9;

	results = results || [];

	if (typeof selector !== 'string' || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

		return results;
	}

	if (!seed) {

		if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
			setDocument(context);
		}
		context = context || document;

		if (documentIsHTML) {

			if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

				if ((m = match[1])) {

					if (nodeType === 9) {
						if ((elem = context.getElementById(m))) {

							if (elem.id === m) {
								results.push(elem);
								return results;
							}
						} else {
							return results;
						}

					} else {

						if (newContext && (elem = newContext.getElementById(m)) &&
							contains(context, elem) &&
							elem.id === m) {

							results.push(elem);
							return results;
						}
					}

				} else if (match[2]) {
					push.apply(results, context.getElementsByTagName(selector));
					return results;

				} else if ((m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName) {

					push.apply(results, context.getElementsByClassName(m));
					return results;
				}
			}

			if (support.qsa &&
				!compilerCache[selector + ' '] &&
				(!rbuggyQSA || !rbuggyQSA.test(selector))) {

				if (nodeType !== 1) {
					newContext = context;
					newSelector = selector;

				} else if (context.nodeName.toLowerCase() !== 'object') {

					if ((nid = context.getAttribute('id'))) {
						nid = nid.replace(rcssescape, fcssescape);
					} else {
						context.setAttribute('id', (nid = expando));
					}

					groups = tokenize(selector);
					i = groups.length;
					while (i--) {
						groups[i] = '#' + nid + ' ' + toSelector(groups[i]);
					}
					newSelector = groups.join(',');

					newContext = rsibling.test(selector) && testContext(context.parentNode) ||
						context;
				}

				if (newSelector) {
					try {
						push.apply(results,
							newContext.querySelectorAll(newSelector),
						);
						return results;
					} catch (qsaError) {
					} finally {
						if (nid === expando) {
							context.removeAttribute('id');
						}
					}
				}
			}
		}
	}

	return select(selector.replace(rtrim, '$1'), context, results, seed);
}

function assert(fn){
	var el = document.createElement('fieldset');

	try {
		return !!fn(el);
	} catch (e) {
		return false;
	} finally {

		if (el.parentNode) {
			el.parentNode.removeChild(el);
		}

		el = null;
	}
}

function testContext(context){
	return context && typeof context.getElementsByTagName !== 'undefined' && context;
}

support = Sizzle.support = {};

isXML = Sizzle.isXML = function (elem){

	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== 'HTML' : false;
};

setDocument = Sizzle.setDocument = function (node){
	var subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
		return document;
	}

	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML(document);

	if (preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow) {

		if (subWindow.addEventListener) {
			subWindow.addEventListener('unload', unloadHandler, false);

		} else if (subWindow.attachEvent) {
			subWindow.attachEvent('onunload', unloadHandler);
		}
	}

	support.attributes = assert(function (el){
		el.className = 'i';
		return !el.getAttribute('className');
	});

	support.getElementsByTagName = assert(function (el){
		el.appendChild(document.createComment(''));
		return !el.getElementsByTagName('*').length;
	});

	support.getElementsByClassName = rnative.test(document.getElementsByClassName);

	support.getById = assert(function (el){
		docElem.appendChild(el).id = expando;
		return !document.getElementsByName || !document.getElementsByName(expando).length;
	});

	if (support.getById) {
		Expr.filter['ID'] = function (id){
			var attrId = id.replace(runescape, funescape);
			return function (elem){
				return elem.getAttribute('id') === attrId;
			};
		};
		Expr.find['ID'] = function (id, context){
			if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
				var elem = context.getElementById(id);
				return elem ? [elem] : [];
			}
		};
	} else {
		Expr.filter['ID'] = function (id){
			var attrId = id.replace(runescape, funescape);
			return function (elem){
				var node = typeof elem.getAttributeNode !== 'undefined' &&
					elem.getAttributeNode('id');
				return node && node.value === attrId;
			};
		};

		Expr.find['ID'] = function (id, context){
			if (typeof context.getElementById !== 'undefined' && documentIsHTML) {
				var node, i, elems,
					elem = context.getElementById(id);

				if (elem) {

					node = elem.getAttributeNode('id');
					if (node && node.value === id) {
						return [elem];
					}

					elems = context.getElementsByName(id);
					i = 0;
					while ((elem = elems[i++])) {
						node = elem.getAttributeNode('id');
						if (node && node.value === id) {
							return [elem];
						}
					}
				}

				return [];
			}
		};
	}

	Expr.find['TAG'] = support.getElementsByTagName ?
		function (tag, context){
			if (typeof context.getElementsByTagName !== 'undefined') {
				return context.getElementsByTagName(tag);

			} else if (support.qsa) {
				return context.querySelectorAll(tag);
			}
		} :

		function (tag, context){
			var elem,
				tmp = [],
				i = 0,

				results = context.getElementsByTagName(tag);

			if (tag === '*') {
				while ((elem = results[i++])) {
					if (elem.nodeType === 1) {
						tmp.push(elem);
					}
				}

				return tmp;
			}
			return results;
		};

	Expr.find['CLASS'] = support.getElementsByClassName && function (className, context){
		if (typeof context.getElementsByClassName !== 'undefined' && documentIsHTML) {
			return context.getElementsByClassName(className);
		}
	};

	rbuggyMatches = [];

	rbuggyQSA = [];

	rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'));
	rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join('|'));

	contains = function (a, b){
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!(bup && bup.nodeType === 1 && (
			adown.contains ?
				adown.contains(bup) :
				a.compareDocumentPosition && a.compareDocumentPosition(bup)&16
		));
	};

	return document;
};

Sizzle.contains = function (context, elem){

	return contains(context, elem);
};

Expr = Sizzle.selectors = {

	match: matchExpr,

	attrHandle: {},

	find: {},

	filter: {},

	pseudos: {},
};

export default Sizzle;
