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

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Parser = __webpack_require__(2);

module.exports = function toDom(node, options) {
    var parser = new Parser(options);
    return parser.parse(node);
};

// module.exports = function plugin(options) {
//     var parser = new Parser(options);
//     return function toDom(root) {
//         return parser.parse(root);
//     }
// };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var renderer = __webpack_require__(3);
var h = __webpack_require__(4);
var util = __webpack_require__(5);

function Parser(options) {
    this.options = options;
}

Parser.prototype.parseNodes = function(nodes, parent) {
    if(!nodes || nodes.length === 0) return [];
    var vnodes = [];
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        node.parent = parent;
        node.index = i;
        var tempNode = this.parseNode(node);
        tempNode && vnodes.push(tempNode);
    }

    // var hash = nodes.map(function (item) {
    //     return item.hash;
    // }).reduce(function (a, b) {
    //     var hash = [];
    //     if(a) hash.push(a);
    //     if(b) hash.push(b);
    //     return hash.join('-');
    // });
    //
    // parent.hash = util.hash(hash);
    // try {
    // }
    // catch (e) {
    //     debugger
    // }

    return vnodes;
};

Parser.prototype.parseNode = function(node) {
    if(!node) return null;

    // if(node.value) {
    //     node.hash = util.hash(node.value);
    // } else if(node.url) {
    //     node.hash = util.hash(node.url);
    // }

    var children = this.parseNodes(node.children, node);
    return renderer[node.type].apply(null, [h, node, children, this.options]);
};

Parser.prototype.parse = function(root) {
    try {
        return this.parseNode(root);
    }
    catch (e) {
        console.error(e);
        // return this.h?this.h('div', {}, 'error'):null;
        return document.createTextNode(e.message || 'error');
    }
};

module.exports = Parser;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Renderer
 *
 * extend mdast
 {
     "type": "heading",
     "depth": 1 <= number <= 6,
     "tagName": "a",
     "parent": parent,
     "properties": {
         "href": "http://alpha.com",
         "id": "bravo",
         "className": ["bravo"],
         "download": true
     },
     "children": []
 }
 */



module.exports = {


    root: function(h, node, children) {
        return h('div', node, children);
    },

    blockquote: function(h, node, children) {
        return h('blockquote', node, children);
    },

    heading: function(h, node, children) {
        return h('h'+node.depth, node, children);
    },

    thematicBreak : function(h, node) {
        return h('hr', node);
    },

    list : function(h, node, children) {
        return h(node.ordered?'ol':'ul', node, children);
    },

    listItem : function(h, node, children) {

        if(node.hasOwnProperty('checked') && node.checked !== null) {
            if(children && children.length>0 && children[0].children) {

                // children[0].children.unshift(
                    // h('input', {
                    //     'class': ['list-item-checkbox'],
                    //     attrs: {
                    //         type: 'checkbox',
                    //         checked: node.checked,
                    //         readonly: true,
                    //         disabled: true,
                    //     }
                    // })
                // );


                var d = document.createElement('input');
                d.setAttribute('type', 'checkbox');
                node.checked && d.setAttribute('checked', 'checked');
                d.setAttribute('disabled', 'disabled');

                // d.innerText = 'checkbox';
                children[0].insertBefore(d, children[0].firstChild);
            }
        }
        return h('li', node, children);
    },

    paragraph : function(h, node, children) {
        return h('p', node, children);
    },

    table : function(h, node, children) {
        return h('table', node, [
            h('tbody', {}, children)
        ]);
        // return h('table', node, children);
    },

    tableRow : function(h, node, children) {
        return h('tr', node, children);
    },

    tableCell : function(h, node, children) {
        // var tagName = (node.parent.index === 0)?'th':'td';
        return h('td', node, children);
    },

    strong : function(h, node, children) {
        return h('strong', node, children);
    },

    emphasis : function(h, node, children) {
        return h('em', node, children);
    },

    break : function(h, node) {
        return h('br', node);
    },

    delete : function(h, node, children) {
        return h('del', node, children);
    },

    link : function(h, node, children) {
        // return h('a', props(node, {
        //     attrs: {
        //         // target: '_blank',
        //         href: node.url,
        //         title: node.title
        //     }
        // }), children);

        // target="_blank"

        return h('a', node, children);
    },

    linkReference : function(h, node, children) {
        // return h('a', props(node, {
        //     attrs: {
        //         href: node.url,
        //         title: node.title
        //     }
        // }), children);
        return h('a', node, children);
    },

    definition : function(h, node, children) {
        // return null;
        // return h('div', props(node, {
        //         style: {
        //             height: 0,
        //             visibility: 'hidden'
        //         }
        //     }),
        //     h('a', {
        //         key: 0,
        //         href: node.url,
        //         'data-identifier': node.identifier
        //     }, [
        //         '['+node.identifier+']: ',
        //         node.url
        //     ])
        // );
    },

    image : function(h, node) {
        // return h('img', props(node, {
        //     attrs: {
        //         src: node.url,
        //         alt: node.alt,
        //         title: node.title
        //     }
        // }));

        return h('img', node);

    },

    imageReference: function(h, node, children) {

    },

    text : function(h, node) {
        // return h('span', node, node.value);
        // debugger
        return document.createTextNode(node.value);
    },

    inlineCode : function(h, node, children) {
        return h('code', node, node.value);
    },

    code : function(h, node, children) {
        var className = [];
        node.lang && className.push('language-'+node.lang);
        return h('pre', node, [
            h('code', {
                "properties": {
                    "className": className
                }
            }, node.value)
        ]);
    },

    yaml : function(h, node, children) {
        // return h('pre', props(node), h('code', {
        //     'class': 'language-yaml'
        // }, node.value));
    },

    math : function(h, node, children) {
        // return h('p', props(node, {
        //     domProps: {
        //         innerHTML: node.value
        //     }
        // }));
    },

    inlineMath : function(h, node, children) {
        // return h('span', props(node, {
        //     domProps: {
        //         innerHTML: node.value
        //     }
        // }));
    },

    html : function(h, node, children) {
        // return h('div', props(node, {
        //     domProps: {
        //         innerHTML: node.value
        //     }
        // }));
    },

    footnote : function(h, node, children) {
        return h('span', node, children);
    },

    footnoteReference : function(h, node, children) {
        // return h('a', props(node, {
        //     attrs: {
        //         id: node.ref,
        //         className: 'footnote-reference',
        //         href: '#'+node.def
        //     }
        // }), node.value);
    },

    footnoteDefinition : function(h, node, children) {
        // return h('div', props(node, {
        //     attrs: {
        //         id: node.def,
        //         className: 'footnote-definition'
        //     }
        // }), children);
    },


    /*
    root : function(node, children, options) {
        return h('div', node.properties, children);
    },

    text : function(node, children, options) {
        var dom = document.createTextNode(node.value);
        return dom;
    },

    inlineCode : function(node, children, options) {},

    blockquote : function(node, children, options) {},

    heading : function(node, children, options) {
        return h('h'+node.depth, node.properties, children);
    },

    thematicBreak : function(node, children, options) {},

    list : function(node, children, options) {},

    listItem : function(node, children, options) {},

    checkbox : function(node, children, options) {},

    paragraph : function(node, children, options) {},

    table : function(node, children, options) {},

    tableRow : function(node, children, options) {},

    tableCell : function(node, children, options) {},

    strong : function(node, children, options) {},

    emphasis : function(node, children, options) {},

    break : function(node, children, options) {},

    delete : function(node, children, options) {},

    link : function(node, children, options) {},

    linkReference : function(node, children, options) {},

    definition : function(node, children, options) {},

    image : function(node, children, options) {},

    imageReference : function(node, children, options) {},

    math : function(node, children, options) {},

    inlineMath : function(node, children, options) {},

    html : function(node, children, options) {},

    code : function(node, children, options) {},
    */


};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(5);

function appendChildren(parent, children) {

    if(!children){
        return parent;
    }

    if(!util.isArray(children)){
        parent.appendChild(document.createTextNode(children));
        return parent;
    }

    var container = document.createDocumentFragment();

    for (var i=0;i<children.length;i++) {
        container.appendChild(children[i]);
    }

    parent.appendChild(container);

    return parent;
}

function props(dom, node) {

    var properties = node.properties;
    if(properties) {
        Object.keys(properties).forEach(function (key) {
            var value = properties[key];

            if(key === 'className'){
                dom.setAttribute('class', value);
            }
            else{
                dom.setAttribute(key, value);
            }

        });
    }

    // if(node.align) {
    //     dom.setAttribute('align', node.align);
    // }

    if(node.type === "image") {
        if(node.url) {
            dom.setAttribute('src', node.url);
        }
    }
    else if(node.type === "link") {
        if(node.url) {
            dom.setAttribute('target', '_blank');
            dom.setAttribute('href', node.url);
        }
    }

    if(node.title) {
        dom.setAttribute('title', node.title);
    }




    // debugger
    // if(node.value) {
    //     dom.setAttribute('id', hash(node.value));
    // }

    if(node.hash) {
        dom.setAttribute('data-hash', node.hash);
    }



    // if(node.parent && node.parent.type==='root') {
    //
    //     var position = node.position;
    //
    //     if(position){
    //         // debugger
    //         dom.setAttribute('data-line', position.start.line);
    //         // dom.setAttribute('data-start-line', position.start.line);
    //         // dom.setAttribute('data-end-line', position.end.line);
    //     }
    //
    //
    // }

}

module.exports = function createElement(tagName, node, children) {
    var dom = document.createElement(node.tagName || tagName);
    props(dom, node);
    appendChildren(dom, children);
    return dom;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {
    hash: function hash(str) {
        str = String(str);
        var hash = 5381, i = str.length;
        while(i) {
            hash = (hash * 33) ^ str.charCodeAt(--i);
        }
        return hash >>> 0;
    },
    isArray: (function () {
        if(Array.isArray){return Array.isArray;}
        return function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        }
    })()
};


/***/ })
/******/ ]);