/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var Fuffle;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src-client/$.ts":
/*!*************************!*\
  !*** ./src-client/$.ts ***!
  \*************************/
/***/ ((module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass DomUtil {\n    static element(tagName) {\n        return new DomUtil(document.createElement(tagName));\n    }\n    static div(...classNames) {\n        return new DomUtil(document.createElement('div')).class(...classNames);\n    }\n    static text(text) {\n        return new DomUtil(document.createTextNode(text));\n    }\n    static resolveArray(child) {\n        const nodes = [];\n        for (const grandchild of child)\n            nodes.push(...DomUtil.resolve(grandchild));\n        return nodes;\n    }\n    static resolve(child) {\n        if (child instanceof Node)\n            return [child];\n        if (child instanceof DomUtil)\n            return [child.node];\n        if (typeof child === 'string')\n            return [document.createTextNode(child)];\n        if (typeof child === 'number')\n            return [document.createTextNode(String(child))];\n        if (typeof child === 'boolean') {\n            if (!child)\n                return [];\n            return [document.createTextNode('string')];\n        }\n        if (Array.isArray(child))\n            return DomUtil.resolveArray(child);\n        if (child === undefined || child === null)\n            return [];\n        if (typeof child === 'object') {\n            try {\n                return [document.createTextNode(JSON.stringify(child))];\n            }\n            catch {\n                return [document.createTextNode(String(child))];\n            }\n        }\n        return [child];\n    }\n    node;\n    constructor(node) {\n        this.node = node;\n    }\n    class(...names) {\n        const { node } = this;\n        if (node instanceof Element)\n            for (const name of names)\n                node.classList.toggle(name, true);\n        return this;\n    }\n    attribute(name, value) {\n        const { node } = this;\n        if (!(node instanceof Element))\n            throw new Error('Cannot set attribute of non element');\n        node.setAttribute(name, value);\n        return this;\n    }\n    attr(name, value) {\n        return this.attribute(name, value);\n    }\n    text(text) {\n        this.node.textContent = text;\n        return this;\n    }\n    on(eventName, onFired, options) {\n        this.node.addEventListener(eventName, onFired, options);\n        return this;\n    }\n    add(...children) {\n        const nodes = DomUtil.resolveArray(children);\n        for (const node of nodes)\n            this.node.appendChild(node);\n        return this;\n    }\n    removeAll() {\n        const nodes = [...this.node.childNodes];\n        for (const node of nodes)\n            node.remove();\n        return this;\n    }\n}\nmodule.exports = DomUtil;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/$.ts?");

/***/ }),

/***/ "./src-client/ArrayElement.ts":
/*!************************************!*\
  !*** ./src-client/ArrayElement.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet $;\nclass FuffleArrayElement extends HTMLElement {\n    #stateWrapper;\n    #render;\n    #$ = new $(this);\n    #nodes = [];\n    constructor(stateWrapper, render) {\n        super();\n        this.#stateWrapper = stateWrapper;\n        this.#render = render;\n    }\n    connectedCallback() {\n        this.#stateWrapper.getChild('length').bind(length => {\n            while (this.#nodes.length < length) {\n                const nodes = $.resolve(this.#render(this.#stateWrapper.getChild(this.#nodes.length).proxy));\n                this.#nodes.push(nodes);\n                this.#$.add(nodes);\n            }\n            while (this.#nodes.length > length) {\n                const nodes = this.#nodes.pop();\n                for (const node of nodes)\n                    node.parentNode.removeChild(node);\n            }\n        });\n    }\n}\ncustomElements.define('fuffle-array', FuffleArrayElement);\nmodule.exports = FuffleArrayElement;\n$ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\n\n\n//# sourceURL=webpack://Fuffle/./src-client/ArrayElement.ts?");

/***/ }),

/***/ "./src-client/IfElement.ts":
/*!*********************************!*\
  !*** ./src-client/IfElement.ts ***!
  \*********************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet $;\nclass FuffleIfElement extends HTMLElement {\n    static else(instance, render) {\n        instance.#renderElse = render;\n        return instance;\n    }\n    #stateWrapper;\n    #render;\n    #renderElse = null;\n    #$ = new $(this);\n    #showing = false;\n    constructor(stateWrapper, render) {\n        super();\n        this.#stateWrapper = stateWrapper;\n        this.#render = render;\n    }\n    connectedCallback() {\n        this.#stateWrapper.bind(state => {\n            if (state) {\n                if (!this.#showing) {\n                    if (this.#renderElse)\n                        this.#$.removeAll();\n                    this.#$.add(this.#render());\n                    this.#showing = true;\n                }\n            }\n            else if (this.#showing) {\n                this.#$.removeAll();\n                if (this.#renderElse)\n                    this.#$.add(this.#renderElse());\n                this.#showing = false;\n            }\n        });\n    }\n}\ncustomElements.define('fuffle-if', FuffleIfElement);\nmodule.exports = FuffleIfElement;\n$ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\n\n\n//# sourceURL=webpack://Fuffle/./src-client/IfElement.ts?");

/***/ }),

/***/ "./src-client/IfUtil.ts":
/*!******************************!*\
  !*** ./src-client/IfUtil.ts ***!
  \******************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet FuffleIfElement;\nlet $;\n$ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\nclass IfUtil extends $ {\n    else(render) {\n        FuffleIfElement.else(this.node, render);\n        return this;\n    }\n}\nmodule.exports = IfUtil;\nFuffleIfElement = __webpack_require__(/*! ./IfElement */ \"./src-client/IfElement.ts\");\n\n\n//# sourceURL=webpack://Fuffle/./src-client/IfUtil.ts?");

/***/ }),

/***/ "./src-client/StateWrapper.ts":
/*!************************************!*\
  !*** ./src-client/StateWrapper.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet FuffleArrayElement;\nclass StateWrapper {\n    state;\n    proxy;\n    children = {};\n    listeners = [];\n    parent;\n    key;\n    constructor(state, parent, key) {\n        this.state = state;\n        this.parent = parent;\n        this.key = key;\n        this.proxy = new Proxy(() => this, {\n            get: (target, property, receiver) => {\n                if (typeof property === 'symbol')\n                    return Reflect.get(target, property, receiver);\n                return this.proxyGet(property);\n            },\n            set: (target, property, value, receiver) => {\n                if (typeof property === 'symbol')\n                    return Reflect.set(target, property, value, receiver);\n                this.state[property] = value;\n                this.getChild(property).set(value);\n                return true;\n            }\n        });\n    }\n    proxyGetImpl(key) {\n        return this.getChild(key).proxy;\n    }\n    proxyGet(key) {\n        return this.proxyGetImpl(key);\n    }\n    bind(callback) {\n        this.listeners.push(callback);\n        callback(this.state);\n    }\n    set(state) {\n        this.state = state;\n        this.#onSet();\n    }\n    #onSet() {\n        for (const listener of this.listeners)\n            listener(this.state);\n    }\n    getChild(key) {\n        if (key in this.children)\n            return this.children[key];\n        const value = this.state[key];\n        if (Array.isArray(value))\n            return this.children[key] = new ArrayStateWrapper(value, this, key);\n        return (this.children[key] = new StateWrapper(value, this, key));\n    }\n}\nclass ArrayStateWrapper extends StateWrapper {\n    proxyGet(key) {\n        if (key === 'push')\n            return ((it) => { this.push(it); });\n        if (key === 'pop')\n            return (() => this.pop());\n        if (key === 'map')\n            return ((render) => {\n                return new FuffleArrayElement(this, render);\n            });\n    }\n    push(it) {\n        this.state.push(it);\n        this.getChild('length').set(this.state.length);\n    }\n    pop() {\n        const it = this.state.pop();\n        this.getChild('length').set(this.state.length);\n        return it;\n    }\n}\nmodule.exports = StateWrapper;\nFuffleArrayElement = __webpack_require__(/*! ./ArrayElement */ \"./src-client/ArrayElement.ts\");\n\n\n//# sourceURL=webpack://Fuffle/./src-client/StateWrapper.ts?");

/***/ }),

/***/ "./src-client/index.ts":
/*!*****************************!*\
  !*** ./src-client/index.ts ***!
  \*****************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet StateWrapper;\nlet FuffleIfElement;\nlet FuffleArrayElement;\nlet IfUtil;\nlet $;\n$ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\nclass BoundDomUtil extends $ {\n    bindAttr(name, stateProxy) {\n    }\n}\nmodule.exports = {\n    $,\n    state(value) {\n        return new StateWrapper(value, null, null).proxy;\n    },\n    if(stateProxy, render) {\n        return new IfUtil(new FuffleIfElement(stateProxy(), render));\n    },\n    set(stateProxy, value) {\n        stateProxy().set(value);\n    },\n    setter(stateProxy, getValue) {\n        const stateWrapper = stateProxy();\n        stateWrapper.set(getValue(stateWrapper.state));\n    },\n    map(stateProxy, render) {\n        return new FuffleArrayElement(stateProxy(), render);\n    },\n    push(stateProxy, it) {\n        stateProxy().push(it);\n    },\n    pop(stateProxy) {\n        return stateProxy().pop();\n    },\n    text(stateProxy) {\n        const node = document.createTextNode('');\n        stateProxy().bind(state => {\n            if (typeof state === 'string')\n                node.nodeValue = state;\n            else if (typeof state === 'number')\n                node.nodeValue = String(state);\n            else\n                node.nodeValue = '';\n        });\n        return node;\n    }\n};\nStateWrapper = __webpack_require__(/*! ./StateWrapper */ \"./src-client/StateWrapper.ts\");\nFuffleIfElement = __webpack_require__(/*! ./IfElement */ \"./src-client/IfElement.ts\");\nFuffleArrayElement = __webpack_require__(/*! ./ArrayElement */ \"./src-client/ArrayElement.ts\");\nIfUtil = __webpack_require__(/*! ./IfUtil */ \"./src-client/IfUtil.ts\");\n\n\n//# sourceURL=webpack://Fuffle/./src-client/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src-client/index.ts");
/******/ 	Fuffle = __webpack_exports__;
/******/ 	
/******/ })()
;