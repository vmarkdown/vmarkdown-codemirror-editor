(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VMarkDown"] = factory();
	else
		root["VMarkDown"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {const NodeUtil = __webpack_require__(2);
const Event = __webpack_require__(4);
const render = __webpack_require__(5);
const PromiseWorker = __webpack_require__(6);

const Worker = __webpack_require__(7);
const worker = new Worker();
const promiseWorker = new PromiseWorker(worker);

function workerParse(markdown, options) {
    return promiseWorker.postMessage({
        markdown: markdown,
        options: options
    });
}

class VMarkDown {

    constructor(options) {
        const self = this;

        self.options = Object.assign({
            rootClassName: 'markdown-body',
            rootTagName: 'main',
            hashid: true
        }, options?{
            rootClassName: options.rootClassName,
            rootTagName: options.rootTagName,
            hashid: options.hashid
        }:{});

        self.pluginManager = options.pluginManager;
        self.h = options.h || function (tagName, data, value) { return value };

        self.mdast = {};
        self.hast = {
            position:{
                start: {
                    line: -1,
                    column: 0
                },
                end: {
                    line: -1,
                    column: 0
                }
            }
        };
    }

    async refresh(value) {
        // const self = this;
        // const vdom = render(self.hast, {
        //     h: self.h
        // });
        // return vdom;

        return await process(value);
    }

    async render1(markdown = '', options) {
        const self = this;

        console.time('worker');
        const {mdast, hast, plugins} = await parse(markdown, {
            rootClassName: 'markdown-body',
            rootTagName: 'main',
            hashid: true
        });
        console.timeEnd('worker');

        console.log( mdast );
        console.log( hast );
        console.log( plugins );

        self.hast = hast;

        console.time('plugins');
        self.pluginManager && self.pluginManager.load(plugins, function () {
            console.timeEnd('plugins');
            self.$emit('refresh', hast);
        });

        console.time('render');
        const vdom = render(hast, options);
        console.timeEnd('render');

        return vdom;
    }

    static async parse(markdown, options) {

        console.time('worker');
        const {mdast, hast, plugins} = await workerParse(markdown, options);
        console.timeEnd('worker');

        console.log( mdast );
        console.log( hast );
        console.log( plugins );

        return {mdast, hast, plugins};
    }

    static render(hast, options) {
        console.time('render');
        const vdom = render(hast, options);
        console.timeEnd('render');
        return vdom;
    }

    async process(markdown = '', noDetect) {
        const self = this;

        const {mdast, hast, plugins} = await VMarkDown.parse(markdown,
            Object.assign({}, self.options, self.pluginManager?{
                plugins: self.pluginManager.getPlugins()
            }:{})
        );

        self.mdast = mdast;
        self.hast = hast;

        // console.time('plugins');
        // self.pluginManager && self.pluginManager.load(plugins, function () {
        //     console.timeEnd('plugins');
        //     self.$emit('refresh', hast);
        // });
        if( !noDetect && self.pluginManager && plugins.length > 0 ){
            self.pluginManager.load(plugins).then(function (loaded) {
                var isRefresh = loaded?loaded.length>0:false;
                if(isRefresh) {
                    self.$emit('refresh', markdown);
                }
            });
        }

        const vdom = VMarkDown.render(hast, {
            h: self.h
        });

        return vdom;
    }

    findNodeFromLine(line) {
        const self = this;
        const node = NodeUtil.findNodeFromLine(self.hast, line);
        return node;
    }

    findNodeByLine(line) {
        const self = this;
        const node = NodeUtil.findNodeByLine(self.hast, line);
        return node;
    }

    findNode(position) {
        const self = this;
        const node = NodeUtil.findNode(self.hast, position);
        return node;
    }
}

VMarkDown.PluginManager = render.PluginManager;

Event.mixin(VMarkDown);

module.exports = VMarkDown;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const findNode = __webpack_require__(3);

function _findNode(root, position) {
    let node = findNode(root, position);

    if(!node || node.type === 'root') {
        return null;
    }

    return node;
}


function findNodeByLine(root, line) {
    let node = findNode(root, {line: line,column: 1});

    if(!node || node.type === 'root') {
        return null;
    }

    return node;
}

function findNodeFromLine(root, line, maxNum = 10) {

    let node = findNode(root, {line: line,column: 1});

    if(!root.position || !root.position.end) {
        return null;
    }

    const lastLine = root.position.end.line;

    if(!node || node.type === 'root') {
        if(maxNum <=0 && line + 1 > lastLine) {
            return null;
        }
        return findNodeFromLine(root, line + 1, maxNum - 1);
    }

    return node;
}

module.exports = {
    findNodeByLine: findNodeByLine,
    findNodeFromLine: findNodeFromLine,
    findNode: _findNode
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

function compare(beforePos, afterPos) {
  if (afterPos.line > beforePos.line) {
    return true;
  } else if (afterPos.line === beforePos.line) {
    return afterPos.column >= beforePos.column;
  }
  return false;
}

function findNode(position, node, defaultNode, returnable) {
  let rootReturn = returnable(node, defaultNode);
  if (rootReturn === true) {
    return node;
  } else if (rootReturn === false) {
    return defaultNode;
  } else if (node.children) {
    for (const child of node.children) {
      if (
          child.position &&
        compare(child.position.start, position) &&
        compare(position, child.position.end)
      ) {
        return findNode(position, child, node, returnable);
      }
    }
  }
  return node;
}

function compose(returnable) {
  for (const f of returnable) {
    if (typeof f !== "function") {
      throw new Error(
        "returnable must be an Array of Functions, while it is passed an " +
          typeof f
      );
    }
  }

  return (node, defaultNode) => {
    for (const f of returnable) {
      let result = f(node, defaultNode);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  };
}

// null: continue search, discontinue the following search rules;
// null: if where no child exists, or all children out of position, return node
// false: return defaultNode;
// true: return node;
// undefined: continues search
const defaultReturnable = [
  (node, defaultNode) =>
    node.type === "paragraph" ? defaultNode.type === "root" : undefined,
  node => (node.type === "root" ? null : undefined),
  node => (node.type === "tableCell" ? true : undefined),
  node => (node.type === "heading" ? true : undefined),
  node => (node.type === "list" ? null : undefined),
  node => (node.type === "table" ? null : undefined),
  (node, defaultNode) =>
    defaultNode && defaultNode.type === "listItem" ? false : undefined,
  (node, defaultNode) => {
    if (
      [
        "text",
        "inlineCode",
        "emphasis",
        "strong",
        "delete",
        "link",
        "image",
        "linkReference",
        "imageReference"
      ].indexOf(node.type) > -1
    ) {
      return false;
    }
    return undefined;
  }
];

module.exports = function(node, position, returnable = []) {
  if (
      node.position &&
    compare(node.position.start, position) &&
    compare(position, node.position.end)
  ) {
    return findNode(
      position,
      node,
      null,
      compose([...returnable, ...defaultReturnable])
    );
  }
  return null;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var Event = function () {
};
Event.prototype = {
    $on: function (event, fct) {
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fct);
    },
    $off: function (event, fct) {
        this._events = this._events || {};
        if (event in this._events === false) return;
        this._events[event].splice(this._events[event].indexOf(fct), 1);
    },
    $emit: function (event /* , args... */) {
        this._events = this._events || {};
        if (event in this._events === false) return;
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
};
Event.mixin = function (destObject) {
    var props = ['$on', '$off', '$emit'];
    for (var i = 0; i < props.length; i++) {
        if (typeof destObject === 'function') {
            destObject.prototype[props[i]] = Event.prototype[props[i]];
        } else {
            destObject[props[i]] = Event.prototype[props[i]];
        }
    }
    return destObject;
};
module.exports = Event;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "vremark/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const toVDom = __webpack_require__(1);

// const PluginManager = require('./plugin-manager');

function render(hast, options) {
    return toVDom(hast, options);
}

// render.PluginManager = PluginManager;

module.exports = render;



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Parser = __webpack_require__(3);
// var data = require('./data');
module.exports = function toDom(node, options) {
    // data(node, options);
    var parser = new Parser(options);
    return parser.parse(node);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var mode = __webpack_require__(4);
var renderer = __webpack_require__(5);

function Parser(options) {
    this.options = options || {};
    this.dataFuc = null;
    this.h = this.options.h || function (tagName, properties, value) {
        return value;
    };
    // this.renderer = this.options.renderer || renderer;
    this.renderer = Object.assign(renderer, this.options.renderer || {});
}

Parser.prototype.parseNodes = function(nodes, parent) {
    if(!nodes || nodes.length === 0) return [];
    var vnodes = [];
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        node.index = i;
        node.parent = parent;
        var tempNode = this.parseNode(node);
        tempNode && vnodes.push(tempNode);
    }
    return vnodes;
};

Parser.prototype.parseNode = function(node, parent) {
    if(!node) return null;
    var children = this.parseNodes(node.children, node);
    var h = this.h;
    if(!this.renderer[node.type]){
        // throw new Error('renderer:'+node.type+' not found!');
        console.error('renderer:'+node.type+' not found!');
        return null;
    }
    return this.renderer[node.type].apply(null, [h, node, node.data, children, this.options]);

    /*
    var properties = {};
    if(!this.dataFuc){
        var data = mode(node, h, this.options.mode);
        if(data) {
            this.dataFuc = data;
        }
    }
    if(this.dataFuc){
        properties = this.dataFuc(node, this.options);
    }

    if(!this.renderer[node.type]){
        throw new Error('renderer:'+node.type+' not found!');
    }
    return this.renderer[node.type].apply(null, [h, node, properties, children, this.options]);*/
};

Parser.prototype.parse = function(root) {
    try {
        return this.parseNode(root);
    }
    catch (e) {
        console.error(e);
        return this.h?this.h('div', {}, 'error'):null;
    }
};

module.exports = Parser;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function isString(str) {
    return typeof str === 'string' || str instanceof String;
}

var defaultModes = {

    'vue': {
        test: function (h) {
            return h && h.toString().indexOf('vm') > -1;
        },
        data: function (node, options) {

            var props = node.data || {};

            props.attrs = props.attrs || {};

            Object.assign(props.attrs, node.properties);

            if(node.hasOwnProperty('hash')) {
                options.hashid && Object.assign(props.attrs, {
                    id: node.hash
                });

                Object.assign(props, {
                    key: node.hash
                });
            }

            return props;

        }
    },

    'preact': {
        test: function () {
            return false;
        },
        data: function (node) {
            return node.properties;
        }
    }

};

module.exports = function (node, h, mode) {

    if(mode) {
        if( isString(mode) && defaultModes.hasOwnProperty(mode) ) {
            return defaultModes[mode].data;
        }

        if( isFunction(mode) ) {
            return mode;
        }
    }

    var list = Object.keys(defaultModes);
    for (var i=0;i<list.length;i++) {
        var item = list[i];
        var m = defaultModes[item];
        if( m.test(h) ) {
            return m.data;
        }
    }

    return null;
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {

    root: function(h, node, data, children, options) {
        return h(node.tagName, data, children);
    },
    element: function(h, node, data, children, options) {
        return h(node.tagName, data, children);
    },
    text: function(h, node) {
        return node.value;
    },
    comment: function () {
        
    },
    // component: function (h, node, data) {
    //     return h(node.component, data);
    // },
    raw: function (h, node) {
        return node.value;
    }

};


/***/ })
/******/ ]);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var messageIds = 0

function onMessage (self, e) {
  var message = e.data
  if (!Array.isArray(message) || message.length < 2) {
    // Ignore - this message is not for us.
    return
  }
  var messageId = message[0]
  var error = message[1]
  var result = message[2]

  var callback = self._callbacks[messageId]

  if (!callback) {
    // Ignore - user might have created multiple PromiseWorkers.
    // This message is not for us.
    return
  }

  delete self._callbacks[messageId]
  callback(error, result)
}

function PromiseWorker (worker) {
  var self = this
  self._worker = worker
  self._callbacks = {}

  worker.addEventListener('message', function (e) {
    onMessage(self, e)
  })
}

PromiseWorker.prototype.postMessage = function (userMessage) {
  var self = this
  var messageId = messageIds++

  var messageToSend = [messageId, userMessage]

  return new Promise(function (resolve, reject) {
    self._callbacks[messageId] = function (error, result) {
      if (error) {
        return reject(new Error(error.message))
      }
      resolve(result)
    }

    /* istanbul ignore if */
    if (typeof self._worker.controller !== 'undefined') {
      // service worker, use MessageChannels because e.source is broken in Chrome < 51:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=543198
      var channel = new MessageChannel()
      channel.port1.onmessage = function (e) {
        onMessage(self, e)
      }
      self._worker.controller.postMessage(messageToSend, [channel.port2])
    } else {
      // web worker
      self._worker.postMessage(messageToSend)
    }
  })
}

module.exports = PromiseWorker


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return new Worker(__webpack_require__.p + "vmarkdown.worker.js");
};

/***/ })
/******/ ]);
});