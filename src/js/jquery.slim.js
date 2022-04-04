'use strict';
import Sizzle from './Sizzle';

var arr = [];

var document = window.document;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var support = {};

var isFunction = function isFunction(obj){

	return typeof obj === 'function' && typeof obj.nodeType !== 'number';
};

var isWindow = function isWindow(obj){
	return obj != null && obj === obj.window;
};

var preservedScriptAttributes = {
	type: true,
	src: true,
	noModule: true,
};

function DOMEval(code, doc, node){
	doc = doc || document;

	var i,
		script = doc.createElement('script');

	script.text = code;
	if (node) {
		for (i in preservedScriptAttributes) {
			if (node[i]) {
				script[i] = node[i];
			}
		}
	}
	doc.head.appendChild(script).parentNode.removeChild(script);
}

function toType(obj){
	if (obj == null) {
		return obj + '';
	}

	return typeof obj === 'object' || typeof obj === 'function' ?
		class2type[toString.call(obj)] || 'object' :
		typeof obj;
}

var
	version = '3.3.1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/Tween,-effects/animatedSelector',

	jQuery = function (selector, context){

		return new jQuery.fn.init(selector, context);
	};

jQuery.fn = jQuery.prototype = {

	jquery: version,

	constructor: jQuery,

	length: 0,

	pushStack: function (elems){

		var ret = jQuery.merge(this.constructor(), elems);

		ret.prevObject = this;

		return ret;
	},

	each: function (callback){
		return jQuery.each(this, callback);
	},

};

jQuery.extend = jQuery.fn.extend = function (){
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	if (typeof target === 'boolean') {
		deep = target;

		target = arguments[i] || {};
		i++;
	}

	if (typeof target !== 'object' && !isFunction(target)) {
		target = {};
	}

	if (i === length) {
		target = this;
		i--;
	}

	for (; i < length; i++) {

		if ((options = arguments[i]) != null) {

			for (name in options) {
				src = target[name];
				copy = options[name];

				if (target === copy) {
					continue;
				}

				if (deep && copy && (jQuery.isPlainObject(copy) ||
					(copyIsArray = Array.isArray(copy)))) {

					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					target[name] = jQuery.extend(deep, clone, copy);

				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	return target;
};

jQuery.extend({

	expando: 'jQuery' + (version + Math.random()).replace(/\D/g, ''),

	isReady: true,

	each: function (obj, callback){
		var length, i = 0;

		if (isArrayLike(obj)) {
			length = obj.length;
			for (; i < length; i++) {
				if (callback.call(obj[i], i, obj[i]) === false) {
					break;
				}
			}
		} else {
			for (i in obj) {
				if (callback.call(obj[i], i, obj[i]) === false) {
					break;
				}
			}
		}

		return obj;
	},

	makeArray: function (arr, results){
		var ret = results || [];

		if (arr != null) {
			if (isArrayLike(Object(arr))) {
				jQuery.merge(ret,
					typeof arr === 'string' ?
						[arr] : arr,
				);
			} else {
				push.call(ret, arr);
			}
		}

		return ret;
	},

	inArray: function (elem, arr, i){
		return arr == null ? -1 : indexOf.call(arr, elem, i);
	},

	merge: function (first, second){
		var len = +second.length,
			j = 0,
			i = first.length;

		for (; j < len; j++) {
			first[i++] = second[j];
		}

		first.length = i;

		return first;
	},

	map: function (elems, callback, arg){
		var length, value,
			i = 0,
			ret = [];

		if (isArrayLike(elems)) {
			length = elems.length;
			for (; i < length; i++) {
				value = callback(elems[i], i, arg);

				if (value != null) {
					ret.push(value);
				}
			}

		} else {
			for (i in elems) {
				value = callback(elems[i], i, arg);

				if (value != null) {
					ret.push(value);
				}
			}
		}

		return concat.apply([], ret);
	},

	guid: 1,

	support: support,
});

if (typeof Symbol === 'function') {
	jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
}

function isArrayLike(obj){

	var length = !!obj && 'length' in obj && obj.length,
		type = toType(obj);

	if (isFunction(obj) || isWindow(obj)) {
		return false;
	}

	return type === 'array' || length === 0 ||
		typeof length === 'number' && length > 0 && (length - 1) in obj;
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

jQuery.expr[':'] = jQuery.expr.pseudos;
jQuery.contains = Sizzle.contains;

var rneedsContext = jQuery.expr.match.needsContext;

function nodeName(elem, name){

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = (/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i);

function winnow(elements, qualifier, not){
	if (isFunction(qualifier)) {
		return jQuery.grep(elements, function (elem, i){
			return !!qualifier.call(elem, i, elem) !== not;
		});
	}

	if (qualifier.nodeType) {
		return jQuery.grep(elements, function (elem){
			return (elem === qualifier) !== not;
		});
	}

	if (typeof qualifier !== 'string') {
		return jQuery.grep(elements, function (elem){
			return (indexOf.call(qualifier, elem) > -1) !== not;
		});
	}

	return jQuery.filter(qualifier, elements, not);
}

jQuery.filter = function (expr, elems, not){
	var elem = elems[0];

	if (not) {
		expr = ':not(' + expr + ')';
	}

	if (elems.length === 1 && elem.nodeType === 1) {
		return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
	}

	return jQuery.find.matches(expr, jQuery.grep(elems, function (elem){
		return elem.nodeType === 1;
	}));
};

jQuery.fn.extend({
	find: function (selector){
		var i, ret,
			len = this.length,
			self = this;

		if (typeof selector !== 'string') {
			return this.pushStack(jQuery(selector).filter(function (){
				for (i = 0; i < len; i++) {
					if (jQuery.contains(self[i], this)) {
						return true;
					}
				}
			}));
		}

		ret = this.pushStack([]);

		for (i = 0; i < len; i++) {
			jQuery.find(selector, self[i], ret);
		}

		return len > 1 ? jQuery.uniqueSort(ret) : ret;
	},
	filter: function (selector){
		return this.pushStack(winnow(this, selector || [], false));
	},
	not: function (selector){
		return this.pushStack(winnow(this, selector || [], true));
	},
	is: function (selector){
		return !!winnow(
			this,

			typeof selector === 'string' && rneedsContext.test(selector) ?
				jQuery(selector) :
				selector || [],
			false,
		).length;
	},
});

var rootjQuery,

	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function (selector, context, root){
		var match, elem;

		if (!selector) {
			return this;
		}

		root = root || rootjQuery;

		if (typeof selector === 'string') {
			if (selector[0] === '<' &&
				selector[selector.length - 1] === '>' &&
				selector.length >= 3) {

				match = [null, selector, null];

			} else {
				match = rquickExpr.exec(selector);
			}

			if (match && (match[1] || !context)) {

				if (match[1]) {
					context = context instanceof jQuery ? context[0] : context;

					jQuery.merge(this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true,
					));

					if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
						for (match in context) {

							if (isFunction(this[match])) {
								this[match](context[match]);

							} else {
								this.attr(match, context[match]);
							}
						}
					}

					return this;

				} else {
					elem = document.getElementById(match[2]);

					if (elem) {

						this[0] = elem;
						this.length = 1;
					}
					return this;
				}

			} else if (!context || context.jquery) {
				return (context || root).find(selector);

			} else {
				return this.constructor(context).find(selector);
			}

		} else if (selector.nodeType) {
			this[0] = selector;
			this.length = 1;
			return this;

		} else if (isFunction(selector)) {
			return root.ready !== undefined ?
				root.ready(selector) :

				selector(jQuery);
		}

		return jQuery.makeArray(selector, this);
	};

init.prototype = jQuery.fn;

rootjQuery = jQuery(document);

jQuery.fn.extend({
	has: function (target){
		var targets = jQuery(target, this),
			l = targets.length;

		return this.filter(function (){
			var i = 0;
			for (; i < l; i++) {
				if (jQuery.contains(this, targets[i])) {
					return true;
				}
			}
		});
	},

	closest: function (selectors, context){
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== 'string' && jQuery(selectors);

		if (!rneedsContext.test(selectors)) {
			for (; i < l; i++) {
				for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

					if (cur.nodeType < 11 && (targets ?
						targets.index(cur) > -1 :

						cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors))) {

						matched.push(cur);
						break;
					}
				}
			}
		}

		return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
	},

	index: function (elem){

		if (!elem) {
			return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
		}

		if (typeof elem === 'string') {
			return indexOf.call(jQuery(elem), this[0]);
		}

		return indexOf.call(this,

			elem.jquery ? elem[0] : elem,
		);
	},

	add: function (selector, context){
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge(this.get(), jQuery(selector, context)),
			),
		);
	},

	addBack: function (selector){
		return this.add(selector == null ?
			this.prevObject : this.prevObject.filter(selector),
		);
	},
});

var rnothtmlwhite = (/[^\x20\t\r\n\f]+/g);

function createOptions(options){
	var object = {};
	jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag){
		object[flag] = true;
	});
	return object;
}

jQuery.Callbacks = function (options){

	options = typeof options === 'string' ?
		createOptions(options) :
		jQuery.extend({}, options);

	var
		firing,

		memory,

		fired,

		locked,

		list = [],

		queue = [],

		firingIndex = -1,

		fire = function (){

			locked = locked || options.once;

			fired = firing = true;
			for (; queue.length; firingIndex = -1) {
				memory = queue.shift();
				while (++firingIndex < list.length) {

					if (list[firingIndex].apply(memory[0], memory[1]) === false &&
						options.stopOnFalse) {

						firingIndex = list.length;
						memory = false;
					}
				}
			}

			if (!options.memory) {
				memory = false;
			}

			firing = false;

			if (locked) {

				if (memory) {
					list = [];

				} else {
					list = '';
				}
			}
		},

		self = {

			add: function (){
				if (list) {

					if (memory && !firing) {
						firingIndex = list.length - 1;
						queue.push(memory);
					}

					(function add(args){
						jQuery.each(args, function (_, arg){
							if (isFunction(arg)) {
								if (!options.unique || !self.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && toType(arg) !== 'string') {

								add(arg);
							}
						});
					})(arguments);

					if (memory && !firing) {
						fire();
					}
				}
				return this;
			},

			fireWith: function (context, args){
				if (!locked) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					queue.push(args);
					if (!firing) {
						fire();
					}
				}
				return this;
			},
		};

	return self;
};

jQuery.extend({

	Deferred: function (func){
		var tuples = [

				['notify', 'progress', jQuery.Callbacks('memory'),
					jQuery.Callbacks('memory'), 2],
				['resolve', 'done', jQuery.Callbacks('once memory'),
					jQuery.Callbacks('once memory'), 0, 'resolved'],
				['reject', 'fail', jQuery.Callbacks('once memory'),
					jQuery.Callbacks('once memory'), 1, 'rejected'],
			],
			state = 'pending',
			promise = {
				state: function (){
					return state;
				},
				always: function (){
					deferred.done(arguments).fail(arguments);
					return this;
				},
				'catch': function (fn){
					return promise.then(null, fn);
				},

				pipe: function ( /* fnDone, fnFail, fnProgress */){
					var fns = arguments;

					return jQuery.Deferred(function (newDefer){
						jQuery.each(tuples, function (i, tuple){

							var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];

							deferred[tuple[1]](function (){
								var returned = fn && fn.apply(this, arguments);
								if (returned && isFunction(returned.promise)) {
									returned.promise()
										.progress(newDefer.notify)
										.done(newDefer.resolve)
										.fail(newDefer.reject);
								} else {
									newDefer[tuple[0] + 'With'](
										this,
										fn ? [returned] : arguments,
									);
								}
							});
						});
						fns = null;
					}).promise();
				},
				then: function (onFulfilled, onRejected, onProgress){
					var maxDepth = 0;

					function resolve(depth, deferred, handler, special){
						return function (){
							var that = this,
								args = arguments,
								mightThrow = function (){
									var returned, then;

									if (depth < maxDepth) {
										return;
									}

									returned = handler.apply(that, args);

									if (returned === deferred.promise()) {
										throw new TypeError('Thenable self-resolution');
									}

									then = returned &&

										(typeof returned === 'object' ||
											typeof returned === 'function') &&
										returned.then;

									if (isFunction(then)) {

										if (special) {
											then.call(
												returned,
												resolve(maxDepth, deferred, Identity, special),
												resolve(maxDepth, deferred, Thrower, special),
											);

										} else {

											maxDepth++;

											then.call(
												returned,
												resolve(maxDepth, deferred, Identity, special),
												resolve(maxDepth, deferred, Thrower, special),
												resolve(maxDepth, deferred, Identity,
													deferred.notifyWith),
											);
										}

									} else {

										if (handler !== Identity) {
											that = undefined;
											args = [returned];
										}

										(special || deferred.resolveWith)(that, args);
									}
								},

								process = special ?
									mightThrow :
									function (){
										try {
											mightThrow();
										} catch (e) {

											if (jQuery.Deferred.exceptionHook) {
												jQuery.Deferred.exceptionHook(e,
													process.stackTrace);
											}

											if (depth + 1 >= maxDepth) {

												if (handler !== Thrower) {
													that = undefined;
													args = [e];
												}

												deferred.rejectWith(that, args);
											}
										}
									};

							if (depth) {
								process();
							} else {

								if (jQuery.Deferred.getStackHook) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout(process);
							}
						};
					}

					return jQuery.Deferred(function (newDefer){

						tuples[0][3].add(
							resolve(
								0,
								newDefer,
								isFunction(onProgress) ?
									onProgress :
									Identity,
								newDefer.notifyWith,
							),
						);

						tuples[1][3].add(
							resolve(
								0,
								newDefer,
								isFunction(onFulfilled) ?
									onFulfilled :
									Identity,
							),
						);

						tuples[2][3].add(
							resolve(
								0,
								newDefer,
								isFunction(onRejected) ?
									onRejected :
									Thrower,
							),
						);
					}).promise();
				},

				promise: function (obj){
					return obj != null ? jQuery.extend(obj, promise) : promise;
				},
			},
			deferred = {};

		jQuery.each(tuples, function (i, tuple){
			var list = tuple[2],
				stateString = tuple[5];

			promise[tuple[1]] = list.add;

			if (stateString) {
				list.add(
					function (){

						state = stateString;
					},

					tuples[3 - i][2].disable,

					tuples[3 - i][3].disable,

					tuples[0][2].lock,

					tuples[0][3].lock,
				);
			}

			list.add(tuple[3].fire);

			deferred[tuple[0]] = function (){
				deferred[tuple[0] + 'With'](this === deferred ? undefined : this, arguments);
				return this;
			};

			deferred[tuple[0] + 'With'] = list.fireWith;
		});

		promise.promise(deferred);

		if (func) {
			func.call(deferred, deferred);
		}

		return deferred;
	},

});

var readyList = jQuery.Deferred();

jQuery.fn.ready = function (fn){

	readyList
		.then(fn)

		.catch(function (error){
			jQuery.readyException(error);
		});

	return this;
};

jQuery.extend({

	isReady: false,

	readyWait: 1,

	ready: function (wait){

		if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
			return;
		}

		jQuery.isReady = true;

		if (wait !== true && --jQuery.readyWait > 0) {
			return;
		}

		readyList.resolveWith(document, [jQuery]);
	},
});

jQuery.ready.then = readyList.then;

function completed(){
	document.removeEventListener('DOMContentLoaded', completed);
	window.removeEventListener('load', completed);
	jQuery.ready();
}

if (document.readyState === 'complete' ||
	(document.readyState !== 'loading' && !document.documentElement.doScroll)) {

	window.setTimeout(jQuery.ready);

} else {

	document.addEventListener('DOMContentLoaded', completed);

	window.addEventListener('load', completed);
}

var access = function (elems, fn, key, value, chainable, emptyGet, raw){
	var i = 0,
		len = elems.length,
		bulk = key == null;

	if (toType(key) === 'object') {
		chainable = true;
		for (i in key) {
			access(elems, fn, i, key[i], true, emptyGet, raw);
		}

	} else if (value !== undefined) {
		chainable = true;

		if (!isFunction(value)) {
			raw = true;
		}

		if (bulk) {

			if (raw) {
				fn.call(elems, value);
				fn = null;

			} else {
				bulk = fn;
				fn = function (elem, key, value){
					return bulk.call(jQuery(elem), value);
				};
			}
		}

		if (fn) {
			for (; i < len; i++) {
				fn(
					elems[i], key, raw ?
						value :
						value.call(elems[i], i, fn(elems[i], key)),
				);
			}
		}
	}

	if (chainable) {
		return elems;
	}

	if (bulk) {
		return fn.call(elems);
	}

	return len ? fn(elems[0], key) : emptyGet;
};

var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

function fcamelCase(all, letter){
	return letter.toUpperCase();
}

function camelCase(string){
	return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
}

var acceptData = function (owner){

	return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
};

function Data(){
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function (owner){

		var value = owner[this.expando];

		if (!value) {
			value = {};

			if (acceptData(owner)) {

				if (owner.nodeType) {
					owner[this.expando] = value;

				} else {
					Object.defineProperty(owner, this.expando, {
						value: value,
						configurable: true,
					});
				}
			}
		}

		return value;
	},
	set: function (owner, data, value){
		var prop,
			cache = this.cache(owner);

		if (typeof data === 'string') {
			cache[camelCase(data)] = value;

		} else {

			for (prop in data) {
				cache[camelCase(prop)] = data[prop];
			}
		}
		return cache;
	},
	get: function (owner, key){
		return key === undefined ?
			this.cache(owner) :

			owner[this.expando] && owner[this.expando][camelCase(key)];
	},
	access: function (owner, key, value){

		if (key === undefined ||
			((key && typeof key === 'string') && value === undefined)) {

			return this.get(owner, key);
		}

		this.set(owner, key, value);

		return value !== undefined ? value : key;
	},
	remove: function (owner, key){
		var i,
			cache = owner[this.expando];

		if (cache === undefined) {
			return;
		}

		if (key !== undefined) {

			if (Array.isArray(key)) {

				key = key.map(camelCase);
			} else {
				key = camelCase(key);

				key = key in cache ?
					[key] :
					(key.match(rnothtmlwhite) || []);
			}

			i = key.length;

			while (i--) {
				delete cache[key[i]];
			}
		}

		if (key === undefined || jQuery.isEmptyObject(cache)) {

			if (owner.nodeType) {
				owner[this.expando] = undefined;
			} else {
				delete owner[this.expando];
			}
		}
	},
	hasData: function (owner){
		var cache = owner[this.expando];
		return cache !== undefined && !jQuery.isEmptyObject(cache);
	},
};
var dataPriv = new Data();

var dataUser = new Data();

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData(data){
	if (data === 'true') {
		return true;
	}

	if (data === 'false') {
		return false;
	}

	if (data === 'null') {
		return null;
	}

	if (data === +data + '') {
		return +data;
	}

	if (rbrace.test(data)) {
		return JSON.parse(data);
	}

	return data;
}

function dataAttr(elem, key, data){
	var name;

	if (data === undefined && elem.nodeType === 1) {
		name = 'data-' + key.replace(rmultiDash, '-$&').toLowerCase();
		data = elem.getAttribute(name);

		if (typeof data === 'string') {
			try {
				data = getData(data);
			} catch (e) {}

			dataUser.set(elem, key, data);
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function (elem){
		return dataUser.hasData(elem) || dataPriv.hasData(elem);
	},

	data: function (elem, name, data){
		return dataUser.access(elem, name, data);
	},

	removeData: function (elem, name){
		dataUser.remove(elem, name);
	},

	_data: function (elem, name, data){
		return dataPriv.access(elem, name, data);
	},

	_removeData: function (elem, name){
		dataPriv.remove(elem, name);
	},
});

jQuery.fn.extend({
	data: function (key, value){
		var i, name, data,
			elem = this[0],
			attrs = elem && elem.attributes;

		if (key === undefined) {
			if (this.length) {
				data = dataUser.get(elem);

				if (elem.nodeType === 1 && !dataPriv.get(elem, 'hasDataAttrs')) {
					i = attrs.length;
					while (i--) {

						if (attrs[i]) {
							name = attrs[i].name;
							if (name.indexOf('data-') === 0) {
								name = camelCase(name.slice(5));
								dataAttr(elem, name, data[name]);
							}
						}
					}
					dataPriv.set(elem, 'hasDataAttrs', true);
				}
			}

			return data;
		}

		if (typeof key === 'object') {
			return this.each(function (){
				dataUser.set(this, key);
			});
		}

		return access(this, function (value){
			var data;

			if (elem && value === undefined) {

				data = dataUser.get(elem, key);
				if (data !== undefined) {
					return data;
				}

				data = dataAttr(elem, key);
				if (data !== undefined) {
					return data;
				}

				return;
			}

			this.each(function (){

				dataUser.set(this, key, value);
			});
		}, null, value, arguments.length > 1, null, true);
	},

	removeData: function (key){
		return this.each(function (){
			dataUser.remove(this, key);
		});
	},
});

jQuery.extend({
	queue: function (elem, type, data){
		var queue;

		if (elem) {
			type = (type || 'fx') + 'queue';
			queue = dataPriv.get(elem, type);

			if (data) {
				if (!queue || Array.isArray(data)) {
					queue = dataPriv.access(elem, type, jQuery.makeArray(data));
				} else {
					queue.push(data);
				}
			}
			return queue || [];
		}
	},

	dequeue: function (elem, type){
		type = type || 'fx';

		var queue = jQuery.queue(elem, type),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks(elem, type),
			next = function (){
				jQuery.dequeue(elem, type);
			};

		if (fn === 'inprogress') {
			fn = queue.shift();
			startLength--;
		}

		if (fn) {

			if (type === 'fx') {
				queue.unshift('inprogress');
			}

			delete hooks.stop;
			fn.call(elem, next, hooks);
		}

		if (!startLength && hooks) {
			hooks.empty.fire();
		}
	},

	_queueHooks: function (elem, type){
		var key = type + 'queueHooks';
		return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
			empty: jQuery.Callbacks('once memory').add(function (){
				dataPriv.remove(elem, [type + 'queue', key]);
			}),
		});
	},
});

jQuery.fn.extend({
	queue: function (type, data){
		var setter = 2;

		if (typeof type !== 'string') {
			data = type;
			type = 'fx';
			setter--;
		}

		if (arguments.length < setter) {
			return jQuery.queue(this[0], type);
		}

		return data === undefined ?
			this :
			this.each(function (){
				var queue = jQuery.queue(this, type, data);

				jQuery._queueHooks(this, type);

				if (type === 'fx' && queue[0] !== 'inprogress') {
					jQuery.dequeue(this, type);
				}
			});
	},
	dequeue: function (type){
		return this.each(function (){
			jQuery.dequeue(this, type);
		});
	},
	clearQueue: function (type){
		return this.queue(type || 'fx', []);
	},

	promise: function (type, obj){
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function (){
				if (!(--count)) {
					defer.resolveWith(elements, [elements]);
				}
			};

		if (typeof type !== 'string') {
			obj = type;
			type = undefined;
		}
		type = type || 'fx';

		while (i--) {
			tmp = dataPriv.get(elements[i], type + 'queueHooks');
			if (tmp && tmp.empty) {
				count++;
				tmp.empty.add(resolve);
			}
		}
		resolve();
		return defer.promise(obj);
	},
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var rcssNum = new RegExp('^(?:([+-])=|)(' + pnum + ')([a-z%]*)$', 'i');

var cssExpand = ['Top', 'Right', 'Bottom', 'Left'];

function adjustCSS(elem, prop, valueParts, tween){
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function (){
				return tween.cur();
			} :
			function (){
				return jQuery.css(elem, prop, '');
			},
		initial = currentValue(),
		unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? '' : 'px'),

		initialInUnit = (jQuery.cssNumber[prop] || unit !== 'px' && +initial) &&
			rcssNum.exec(jQuery.css(elem, prop));

	if (initialInUnit && initialInUnit[3] !== unit) {

		initial = initial / 2;

		unit = unit || initialInUnit[3];

		initialInUnit = +initial || 1;

		while (maxIterations--) {

			jQuery.style(elem, prop, initialInUnit + unit);
			if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style(elem, prop, initialInUnit + unit);

		valueParts = valueParts || [];
	}

	if (valueParts) {
		initialInUnit = +initialInUnit || +initial || 0;

		adjusted = valueParts[1] ?
			initialInUnit + (valueParts[1] + 1) * valueParts[2] :
			+valueParts[2];
		if (tween) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}

var rtagName = (/<([a-z][^\/\0>\x20\t\r\n\f]+)/i);

var rscriptType = (/^$|^module$|\/(?:java|ecma)script/i);

var wrapMap = {

	option: [1, '<select multiple=\'multiple\'>', '</select>'],

	thead: [1, '<table>', '</table>'],
	col: [2, '<table><colgroup>', '</colgroup></table>'],
	tr: [2, '<table><tbody>', '</tbody></table>'],
	td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],

	_default: [0, '', ''],
};

wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll(context, tag){

	var ret;

	if (typeof context.getElementsByTagName !== 'undefined') {
		ret = context.getElementsByTagName(tag || '*');

	} else if (typeof context.querySelectorAll !== 'undefined') {
		ret = context.querySelectorAll(tag || '*');

	} else {
		ret = [];
	}

	if (tag === undefined || tag && nodeName(context, tag)) {
		return jQuery.merge([context], ret);
	}

	return ret;
}

var rhtml = /<|&#?\w+;/;

function buildFragment(elems, context, scripts, selection, ignored){
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for (; i < l; i++) {
		elem = elems[i];

		if (elem || elem === 0) {

			if (toType(elem) === 'object') {

				jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

			} else if (!rhtml.test(elem)) {
				nodes.push(context.createTextNode(elem));

			} else {
				tmp = tmp || fragment.appendChild(context.createElement('div'));

				tag = (rtagName.exec(elem) || ['', ''])[1].toLowerCase();
				wrap = wrapMap[tag] || wrapMap._default;
				tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

				j = wrap[0];
				while (j--) {
					tmp = tmp.lastChild;
				}

				jQuery.merge(nodes, tmp.childNodes);

				tmp = fragment.firstChild;

				tmp.textContent = '';
			}
		}
	}

	fragment.textContent = '';

	i = 0;
	while ((elem = nodes[i++])) {

		if (selection && jQuery.inArray(elem, selection) > -1) {
			if (ignored) {
				ignored.push(elem);
			}
			continue;
		}

		contains = jQuery.contains(elem.ownerDocument, elem);

		tmp = getAll(fragment.appendChild(elem), 'script');

		if (contains) {
			setGlobalEval(tmp);
		}

		if (scripts) {
			j = 0;
			while ((elem = tmp[j++])) {
				if (rscriptType.test(elem.type || '')) {
					scripts.push(elem);
				}
			}
		}
	}

	return fragment;
}

var documentElement = document.documentElement;

var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnFalse(){
	return false;
}

function safeActiveElement(){
	try {
		return document.activeElement;
	} catch (err) { }
}

function on(elem, types, selector, data, fn, one){
	var origFn, type;

	if (typeof types === 'object') {

		if (typeof selector !== 'string') {

			data = data || selector;
			selector = undefined;
		}
		for (type in types) {
			on(elem, type, selector, data, types[type], one);
		}
		return elem;
	}

	if (data == null && fn == null) {

		fn = selector;
		data = selector = undefined;
	} else if (fn == null) {
		if (typeof selector === 'string') {

			fn = data;
			data = undefined;
		} else {

			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if (fn === false) {
		fn = returnFalse;
	} else if (!fn) {
		return elem;
	}

	if (one === 1) {
		origFn = fn;
		fn = function (event){

			jQuery().off(event);
			return origFn.apply(this, arguments);
		};

		fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
	}
	return elem.each(function (){
		jQuery.event.add(this, types, fn, data, selector);
	});
}

jQuery.event = {

	global: {},

	add: function (elem, types, handler, data, selector){

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get(elem);

		if (!elemData) {
			return;
		}

		if (handler.handler) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		if (selector) {
			jQuery.find.matchesSelector(documentElement, selector);
		}

		if (!handler.guid) {
			handler.guid = jQuery.guid++;
		}

		if (!(events = elemData.events)) {
			events = elemData.events = {};
		}
		if (!(eventHandle = elemData.handle)) {
			eventHandle = elemData.handle = function (e){

				return typeof jQuery !== 'undefined' && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply(elem, arguments) : undefined;
			};
		}

		types = (types || '').match(rnothtmlwhite) || [''];
		t = types.length;
		while (t--) {
			tmp = rtypenamespace.exec(types[t]) || [];
			type = origType = tmp[1];
			namespaces = (tmp[2] || '').split('.').sort();

			if (!type) {
				continue;
			}

			special = jQuery.event.special[type] || {};

			type = (selector ? special.delegateType : special.bindType) || type;

			special = jQuery.event.special[type] || {};

			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test(selector),
				namespace: namespaces.join('.'),
			}, handleObjIn);

			if (!(handlers = events[type])) {
				handlers = events[type] = [];
				handlers.delegateCount = 0;

				if (!special.setup ||
					special.setup.call(elem, data, namespaces, eventHandle) === false) {

					if (elem.addEventListener) {
						elem.addEventListener(type, eventHandle);
					}
				}
			}

			if (special.add) {
				special.add.call(elem, handleObj);

				if (!handleObj.handler.guid) {
					handleObj.handler.guid = handler.guid;
				}
			}

			if (selector) {
				handlers.splice(handlers.delegateCount++, 0, handleObj);
			} else {
				handlers.push(handleObj);
			}

			jQuery.event.global[type] = true;
		}

	},

	dispatch: function (nativeEvent){

		var event = jQuery.event.fix(nativeEvent);

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array(arguments.length),
			handlers = (dataPriv.get(this, 'events') || {})[event.type] || [],
			special = jQuery.event.special[event.type] || {};

		args[0] = event;

		for (i = 1; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		event.delegateTarget = this;

		if (special.preDispatch && special.preDispatch.call(this, event) === false) {
			return;
		}

		handlerQueue = jQuery.event.handlers.call(this, event, handlers);

		i = 0;
		while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
			event.currentTarget = matched.elem;

			j = 0;
			while ((handleObj = matched.handlers[j++]) &&
			!event.isImmediatePropagationStopped()) {

				if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ((jQuery.event.special[handleObj.origType] || {}).handle ||
						handleObj.handler).apply(matched.elem, args);

					if (ret !== undefined) {
						if ((event.result = ret) === false) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		if (special.postDispatch) {
			special.postDispatch.call(this, event);
		}

		return event.result;
	},
	handlers: function (event, handlers){
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		if (delegateCount &&

			cur.nodeType &&

			!(event.type === 'click' && event.button >= 1)) {

			for (; cur !== this; cur = cur.parentNode || this) {

				if (cur.nodeType === 1 && !(event.type === 'click' && cur.disabled === true)) {
					matchedHandlers = [];
					matchedSelectors = {};
					for (i = 0; i < delegateCount; i++) {
						handleObj = handlers[i];

						sel = handleObj.selector + ' ';

						if (matchedSelectors[sel] === undefined) {
							matchedSelectors[sel] = handleObj.needsContext ?
								jQuery(sel, this).index(cur) > -1 :
								jQuery.find(sel, this, null, [cur]).length;
						}
						if (matchedSelectors[sel]) {
							matchedHandlers.push(handleObj);
						}
					}
					if (matchedHandlers.length) {
						handlerQueue.push({ elem: cur, handlers: matchedHandlers });
					}
				}
			}
		}

		cur = this;
		if (delegateCount < handlers.length) {
			handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
		}

		return handlerQueue;
	},

	addProp: function (name, hook){
		Object.defineProperty(jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction(hook) ?
				function (){
					if (this.originalEvent) {
						return hook(this.originalEvent);
					}
				} :
				function (){
					if (this.originalEvent) {
						return this.originalEvent[name];
					}
				},

			set: function (value){
				Object.defineProperty(this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value,
				});
			},
		});
	},

	fix: function (originalEvent){
		return originalEvent[jQuery.expando] ?
			originalEvent :
			new jQuery.Event(originalEvent);
	},

	special: {
		load: {

			noBubble: true,
		},
		focus: {

			trigger: function (){
				if (this !== safeActiveElement() && this.focus) {
					this.focus();
					return false;
				}
			},
			delegateType: 'focusin',
		},
		blur: {
			trigger: function (){
				if (this === safeActiveElement() && this.blur) {
					this.blur();
					return false;
				}
			},
			delegateType: 'focusout',
		},
		click: {

			trigger: function (){
				if (this.type === 'checkbox' && this.click && nodeName(this, 'input')) {
					this.click();
					return false;
				}
			},

			_default: function (event){
				return nodeName(event.target, 'a');
			},
		},

		beforeunload: {
			postDispatch: function (event){

				if (event.result !== undefined && event.originalEvent) {
					event.originalEvent.returnValue = event.result;
				}
			},
		},
	},
};

jQuery.Event = function (src, props){

	if (!(this instanceof jQuery.Event)) {
		return new jQuery.Event(src, props);
	}

	if (src && src.type) {
		this.originalEvent = src;
		this.type = src.type;

		this.target = (src.target && src.target.nodeType === 3) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	} else {
		this.type = src;
	}

	if (props) {
		jQuery.extend(this, props);
	}

	this[jQuery.expando] = true;
};

jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
};

jQuery.each({
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	'char': true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function (event){
		var button = event.button;

		if (event.which == null && rkeyEvent.test(event.type)) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
			if (button&1) {
				return 1;
			}

			if (button&2) {
				return 3;
			}

			if (button&4) {
				return 2;
			}

			return 0;
		}

		return event.which;
	},
}, jQuery.event.addProp);

jQuery.each({
	mouseenter: 'mouseover',
	mouseleave: 'mouseout',
	pointerenter: 'pointerover',
	pointerleave: 'pointerout',
}, function (orig, fix){
	jQuery.event.special[orig] = {
		delegateType: fix,
		bindType: fix,

		handle: function (event){
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			if (!related || (related !== target && !jQuery.contains(target, related))) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply(this, arguments);
				event.type = fix;
			}
			return ret;
		},
	};
});

jQuery.fn.extend({
	on: function (types, selector, data, fn){
		return on(this, types, selector, data, fn);
	},
});

var

	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

function manipulationTarget(elem, content){
	if (nodeName(elem, 'table') &&
		nodeName(content.nodeType !== 11 ? content : content.firstChild, 'tr')) {

		return jQuery(elem).children('tbody')[0] || elem;
	}

	return elem;
}

function disableScript(elem){
	elem.type = (elem.getAttribute('type') !== null) + '/' + elem.type;
	return elem;
}

function restoreScript(elem){
	if ((elem.type || '').slice(0, 5) === 'true/') {
		elem.type = elem.type.slice(5);
	} else {
		elem.removeAttribute('type');
	}

	return elem;
}

function domManip(collection, args, callback, ignored){

	args = concat.apply([], args);

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[0],
		valueIsFunction = isFunction(value);

	if (valueIsFunction ||
		(l > 1 && typeof value === 'string' &&
			!support.checkClone && rchecked.test(value))) {
		return collection.each(function (index){
			var self = collection.eq(index);
			if (valueIsFunction) {
				args[0] = value.call(this, index, self.html());
			}
			domManip(self, args, callback, ignored);
		});
	}

	if (l) {
		fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
		first = fragment.firstChild;

		if (fragment.childNodes.length === 1) {
			fragment = first;
		}

		if (first || ignored) {
			scripts = jQuery.map(getAll(fragment, 'script'), disableScript);
			hasScripts = scripts.length;

			for (; i < l; i++) {
				node = fragment;

				if (i !== iNoClone) {
					node = jQuery.clone(node, true, true);

					if (hasScripts) {

						jQuery.merge(scripts, getAll(node, 'script'));
					}
				}

				callback.call(collection[i], node, i);
			}

			if (hasScripts) {
				doc = scripts[scripts.length - 1].ownerDocument;

				jQuery.map(scripts, restoreScript);

				for (i = 0; i < hasScripts; i++) {
					node = scripts[i];
					if (rscriptType.test(node.type || '') &&
						!dataPriv.access(node, 'globalEval') &&
						jQuery.contains(doc, node)) {

						if (node.src && (node.type || '').toLowerCase() !== 'module') {

							if (jQuery._evalUrl) {
								jQuery._evalUrl(node.src);
							}
						} else {
							DOMEval(node.textContent.replace(rcleanScript, ''), doc, node);
						}
					}
				}
			}
		}
	}

	return collection;
}

jQuery.extend({
	htmlPrefilter: function (html){
		return html.replace(rxhtmlTag, '<$1></$2>');
	},
});

jQuery.fn.extend({

	append: function (){
		return domManip(this, arguments, function (elem){
			if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
				var target = manipulationTarget(this, elem);
				target.appendChild(elem);
			}
		});
	},

	prepend: function (){
		return domManip(this, arguments, function (elem){
			if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
				var target = manipulationTarget(this, elem);
				target.insertBefore(elem, target.firstChild);
			}
		});
	},

});

jQuery.each({
	appendTo: 'append',
	prependTo: 'prepend',
	insertBefore: 'before',
	insertAfter: 'after',
	replaceAll: 'replaceWith',
}, function (name, original){
	jQuery.fn[name] = function (selector){
		var elems,
			ret = [],
			insert = jQuery(selector),
			last = insert.length - 1,
			i = 0;

		for (; i <= last; i++) {
			elems = i === last ? this : this.clone(true);
			jQuery(insert[i])[original](elems);

			push.apply(ret, elems.get());
		}

		return this.pushStack(ret);
	};
});
var rnumnonpx = new RegExp('^(' + pnum + ')(?!px)[a-z%]+$', 'i');

var getStyles = function (elem){

	var view = elem.ownerDocument.defaultView;

	if (!view || !view.opener) {
		view = window;
	}

	return view.getComputedStyle(elem);
};

var rboxStyle = new RegExp(cssExpand.join('|'), 'i');

(function (){

	function computeStyleTests(){

		if (!div) {
			return;
		}

		container.style.cssText = 'position:absolute;left:-11111px;width:60px;' +
			'margin-top:1px;padding:0;border:0';
		div.style.cssText =
			'position:relative;display:block;box-sizing:border-box;overflow:scroll;' +
			'margin:auto;border:1px;padding:1px;' +
			'width:60%;top:1%';
		documentElement.appendChild(container).appendChild(div);

		var divStyle = window.getComputedStyle(div);
		pixelPositionVal = divStyle.top !== '1%';

		reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;

		div.style.right = '60%';
		pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;

		boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;

		div.style.position = 'absolute';
		scrollboxSizeVal = div.offsetWidth === 36 || 'absolute';

		documentElement.removeChild(container);

		div = null;
	}

	function roundPixelMeasures(measure){
		return Math.round(parseFloat(measure));
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement('div'),
		div = document.createElement('div');

	jQuery.extend(support, {
		boxSizingReliable: function (){
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function (){
			computeStyleTests();
			return pixelBoxStylesVal;
		},

	});
})();

function curCSS(elem, name, computed){
	var width, minWidth, maxWidth, ret,

		style = elem.style;

	computed = computed || getStyles(elem);

	if (computed) {
		ret = computed.getPropertyValue(name) || computed[name];

		if (ret === '' && !jQuery.contains(elem.ownerDocument, elem)) {
			ret = jQuery.style(elem, name);
		}

		if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {

			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		ret + '' :
		ret;
}

var

	rcustomProp = /^--/,
	cssNormalTransform = {
		letterSpacing: '0',
		fontWeight: '400',
	},

	cssPrefixes = ['Webkit', 'Moz', 'ms'],
	emptyStyle = document.createElement('div').style;

function vendorPropName(name){

	if (name in emptyStyle) {
		return name;
	}

	var capName = name[0].toUpperCase() + name.slice(1),
		i = cssPrefixes.length;

	while (i--) {
		name = cssPrefixes[i] + capName;
		if (name in emptyStyle) {
			return name;
		}
	}
}

function finalPropName(name){
	var ret = jQuery.cssProps[name];
	if (!ret) {
		ret = jQuery.cssProps[name] = vendorPropName(name) || name;
	}
	return ret;
}

jQuery.extend({

	cssHooks: {
		opacity: {
			get: function (elem, computed){
				if (computed) {

					var ret = curCSS(elem, 'opacity');
					return ret === '' ? '1' : ret;
				}
			},
		},
	},

	cssNumber: {
		'animationIterationCount': true,
		'columnCount': true,
		'fillOpacity': true,
		'flexGrow': true,
		'flexShrink': true,
		'fontWeight': true,
		'lineHeight': true,
		'opacity': true,
		'order': true,
		'orphans': true,
		'widows': true,
		'zIndex': true,
		'zoom': true,
	},

	cssProps: {},

	style: function (elem, name, value, extra){

		if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
			return;
		}

		var ret, type, hooks,
			origName = camelCase(name),
			isCustomProp = rcustomProp.test(name),
			style = elem.style;

		if (!isCustomProp) {
			name = finalPropName(origName);
		}

		hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

		if (value !== undefined) {
			type = typeof value;

			if (type === 'string' && (ret = rcssNum.exec(value)) && ret[1]) {
				value = adjustCSS(elem, name, ret);

				type = 'number';
			}

			if (value == null || value !== value) {
				return;
			}

			if (type === 'number') {
				value += ret && ret[3] || (jQuery.cssNumber[origName] ? '' : 'px');
			}

			if (!support.clearCloneStyle && value === '' && name.indexOf('background') === 0) {
				style[name] = 'inherit';
			}

			if (!hooks || !('set' in hooks) ||
				(value = hooks.set(elem, value, extra)) !== undefined) {

				if (isCustomProp) {
					style.setProperty(name, value);
				} else {
					style[name] = value;
				}
			}

		} else {

			if (hooks && 'get' in hooks &&
				(ret = hooks.get(elem, false, extra)) !== undefined) {

				return ret;
			}

			return style[name];
		}
	},

	css: function (elem, name, extra, styles){
		var val, num, hooks,
			origName = camelCase(name),
			isCustomProp = rcustomProp.test(name);

		if (!isCustomProp) {
			name = finalPropName(origName);
		}

		hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

		if (hooks && 'get' in hooks) {
			val = hooks.get(elem, true, extra);
		}

		if (val === undefined) {
			val = curCSS(elem, name, styles);
		}

		if (val === 'normal' && name in cssNormalTransform) {
			val = cssNormalTransform[name];
		}

		if (extra === '' || extra) {
			num = parseFloat(val);
			return extra === true || isFinite(num) ? num || 0 : val;
		}

		return val;
	},
});

jQuery.fn.extend({
	css: function (name, value){
		return access(this, function (elem, name, value){
			var styles, len,
				map = {},
				i = 0;

			if (Array.isArray(name)) {
				styles = getStyles(elem);
				len = name.length;

				for (; i < len; i++) {
					map[name[i]] = jQuery.css(elem, name[i], false, styles);
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style(elem, name, value) :
				jQuery.css(elem, name);
		}, name, value, arguments.length > 1);
	},
});

jQuery.fn.delay = function (time, type){
	time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
	type = type || 'fx';

	return this.queue(type, function (next, hooks){
		var timeout = window.setTimeout(next, time);
		hooks.stop = function (){
			window.clearTimeout(timeout);
		};
	});
};

function stripAndCollapse(value){
	var tokens = value.match(rnothtmlwhite) || [];
	return tokens.join(' ');
}

function getClass(elem){
	return elem.getAttribute && elem.getAttribute('class') || '';
}

function classesToArray(value){
	if (Array.isArray(value)) {
		return value;
	}
	if (typeof value === 'string') {
		return value.match(rnothtmlwhite) || [];
	}
	return [];
}

jQuery.fn.extend({
	addClass: function (value){
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if (isFunction(value)) {
			return this.each(function (j){
				jQuery(this).addClass(value.call(this, j, getClass(this)));
			});
		}

		classes = classesToArray(value);

		if (classes.length) {
			while ((elem = this[i++])) {
				curValue = getClass(elem);
				cur = elem.nodeType === 1 && (' ' + stripAndCollapse(curValue) + ' ');

				if (cur) {
					j = 0;
					while ((clazz = classes[j++])) {
						if (cur.indexOf(' ' + clazz + ' ') < 0) {
							cur += clazz + ' ';
						}
					}

					finalValue = stripAndCollapse(cur);
					if (curValue !== finalValue) {
						elem.setAttribute('class', finalValue);
					}
				}
			}
		}

		return this;
	},
});

jQuery.fn.extend({
	offset: function (options){

		if (arguments.length) {
			return options === undefined ?
				this :
				this.each(function (i){
					jQuery.offset.setOffset(this, options, i);
				});
		}

		var rect, win,
			elem = this[0];

		if (!elem) {
			return;
		}

		if (!elem.getClientRects().length) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset,
		};
	},
});

jQuery.each({ Height: 'height', Width: 'width' }, function (name, type){
	jQuery.each({ padding: 'inner' + name, content: type, '': 'outer' + name },
		function (defaultExtra, funcName){

			jQuery.fn[funcName] = function (margin, value){
				var chainable = arguments.length && (defaultExtra || typeof margin !== 'boolean'),
					extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');

				return access(this, function (elem, type, value){
					var doc;

					if (isWindow(elem)) {

						return funcName.indexOf('outer') === 0 ?
							elem['inner' + name] :
							elem.document.documentElement['client' + name];
					}

					if (elem.nodeType === 9) {
						doc = elem.documentElement;

						return Math.max(
							elem.body['scroll' + name], doc['scroll' + name],
							elem.body['offset' + name], doc['offset' + name],
							doc['client' + name],
						);
					}

					return value === undefined ?

						jQuery.css(elem, type, extra) :

						jQuery.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable);
			};
		});
});

window.$ = jQuery;
export default jQuery;
