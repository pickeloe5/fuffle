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
/******/ 	var __webpack_modules__ = ({

/***/ "./src-client/$.ts":
/*!*************************!*\
  !*** ./src-client/$.ts ***!
  \*************************/
/***/ ((module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass DomUtil {\n    static element(tagName) {\n        return new DomUtil(document.createElement(tagName));\n    }\n    static text(text) {\n        return new DomUtil(document.createTextNode(text));\n    }\n    static resolveArray(child) {\n        const nodes = [];\n        for (const grandchild of child)\n            nodes.push(...DomUtil.resolve(grandchild));\n        return nodes;\n    }\n    static resolve(child) {\n        if (child instanceof Node)\n            return [child];\n        if (child instanceof DomUtil)\n            return [child.node];\n        if (typeof child === 'string')\n            return [document.createTextNode(child)];\n        if (typeof child === 'number')\n            return [document.createTextNode(String(child))];\n        if (typeof child === 'boolean') {\n            if (!child)\n                return [];\n            return [document.createTextNode('string')];\n        }\n        if (Array.isArray(child))\n            return DomUtil.resolveArray(child);\n        if (child === undefined || child === null)\n            return [];\n        if (typeof child === 'object') {\n            try {\n                return [document.createTextNode(JSON.stringify(child))];\n            }\n            catch {\n                return [document.createElement(String(child))];\n            }\n        }\n        return [];\n    }\n    node;\n    constructor(node) {\n        this.node = node;\n    }\n    attribute(name, value) {\n        const { node } = this;\n        if (!(node instanceof Element))\n            throw new Error('Cannot set attribute of non element');\n        node.setAttribute(name, value);\n        return this;\n    }\n    attr(name, value) {\n        return this.attribute(name, value);\n    }\n    text(text) {\n        this.node.textContent = text;\n        return this;\n    }\n    on(eventName, onFired, options) {\n        this.node.addEventListener(eventName, onFired, options);\n        return this;\n    }\n    add(...children) {\n        const nodes = DomUtil.resolveArray(children);\n        for (const node of nodes)\n            this.node.appendChild(node);\n        return this;\n    }\n}\nmodule.exports = DomUtil;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/$.ts?");

/***/ }),

/***/ "./src-client/ArrayElement.ts":
/*!************************************!*\
  !*** ./src-client/ArrayElement.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Binding = __webpack_require__(/*! ./state/Binding */ \"./src-client/state/Binding.ts\");\nclass FuffleArrayElement extends HTMLElement {\n    #state;\n    #renderItem;\n    #length = 0;\n    #children = [];\n    constructor(state, renderItem) {\n        super();\n        this.#state = state;\n        this.#renderItem = renderItem;\n    }\n    connectedCallback() {\n        const listener = () => {\n            const state = this.#state;\n            if (this.#length < state.length) {\n                const nodes = [];\n                for (; this.#length < state.length; this.#length++) {\n                    const childNodes = this.#renderItem(this.#state.getChild(this.#length));\n                    nodes.push(...childNodes);\n                    this.#children.push(childNodes);\n                }\n                this.append(...nodes);\n            }\n            if (this.#length > state.length) {\n                for (; this.#length > state.length; this.#length--) {\n                    const nodes = this.#children.pop();\n                    for (const node of nodes)\n                        node.parentNode.removeChild(node);\n                }\n            }\n        };\n        this.#state.root.bindings.push(new Binding(listener, [[...this.#state.path, 'length']]));\n        listener();\n    }\n}\ncustomElements.define('fuffle-array', FuffleArrayElement);\nmodule.exports = FuffleArrayElement;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/ArrayElement.ts?");

/***/ }),

/***/ "./src-client/index.ts":
/*!*****************************!*\
  !*** ./src-client/index.ts ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const $ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\nconst state = __webpack_require__(/*! ./state */ \"./src-client/state/index.ts\");\nmodule.exports = { $, state };\n\n\n//# sourceURL=webpack://Fuffle/./src-client/index.ts?");

/***/ }),

/***/ "./src-client/state/ArrayStateWrapper.ts":
/*!***********************************************!*\
  !*** ./src-client/state/ArrayStateWrapper.ts ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst BaseStateWrapper = __webpack_require__(/*! ./BaseStateWrapper */ \"./src-client/state/BaseStateWrapper.ts\");\nconst ArrayElement = __webpack_require__(/*! ../ArrayElement */ \"./src-client/ArrayElement.ts\");\nclass ArrayStateWrapper extends BaseStateWrapper {\n    get length() {\n        return this.state.length;\n    }\n    map(renderItem) {\n        return new ArrayElement(this, renderItem);\n    }\n    push(item) {\n        this.state.push(item);\n        this.root.onSet([[...this.path, 'length']]);\n    }\n    pop() {\n        this.state.pop();\n        this.root.onSet([[...this.path, 'length']]);\n    }\n}\nmodule.exports = ArrayStateWrapper;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/state/ArrayStateWrapper.ts?");

/***/ }),

/***/ "./src-client/state/BaseStateWrapper.ts":
/*!**********************************************!*\
  !*** ./src-client/state/BaseStateWrapper.ts ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet ArrayStateWrapper;\nlet ObjectStateWrapper;\nclass BaseStateWrapper {\n    state;\n    root;\n    path;\n    constructor(state, root = null, path = []) {\n        this.state = state;\n        this.root = root;\n        this.path = path;\n    }\n    getChild(key) {\n        const child = this.state[key];\n        if (Array.isArray(child))\n            return new ArrayStateWrapper(child, this.root, [...this.path, key]);\n        if (typeof child === 'object' && child !== null && child !== undefined)\n            return new ObjectStateWrapper(child, this.root, [...this.path, key]);\n        return child;\n    }\n    update(key, value) {\n        this.state[key] = value;\n        this.root.onSet([[...this.path, key]]);\n    }\n}\nmodule.exports = BaseStateWrapper;\nArrayStateWrapper = __webpack_require__(/*! ./ArrayStateWrapper */ \"./src-client/state/ArrayStateWrapper.ts\");\nObjectStateWrapper = __webpack_require__(/*! ./ObjectStateWrapper */ \"./src-client/state/ObjectStateWrapper.ts\");\n\n\n//# sourceURL=webpack://Fuffle/./src-client/state/BaseStateWrapper.ts?");

/***/ }),

/***/ "./src-client/state/Binding.ts":
/*!*************************************!*\
  !*** ./src-client/state/Binding.ts ***!
  \*************************************/
/***/ ((module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Binding {\n    listener;\n    dependencies;\n    constructor(listener, dependencies) {\n        this.listener = listener;\n        this.dependencies = dependencies;\n    }\n}\nmodule.exports = Binding;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/state/Binding.ts?");

/***/ }),

/***/ "./src-client/state/ObjectStateWrapper.ts":
/*!************************************************!*\
  !*** ./src-client/state/ObjectStateWrapper.ts ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst BaseStateWrapper = __webpack_require__(/*! ./BaseStateWrapper */ \"./src-client/state/BaseStateWrapper.ts\");\nconst Binding = __webpack_require__(/*! ./Binding */ \"./src-client/state/Binding.ts\");\nclass ObjectStateWrapper extends BaseStateWrapper {\n    read(key, listener) {\n        this.root.bindings.push(new Binding(() => {\n            listener(this.state[key]);\n        }, [[...this.path, key]]));\n        listener(this.state[key]);\n    }\n}\nmodule.exports = ObjectStateWrapper;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/state/ObjectStateWrapper.ts?");

/***/ }),

/***/ "./src-client/state/RootStateWrapper.ts":
/*!**********************************************!*\
  !*** ./src-client/state/RootStateWrapper.ts ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst ArrayStateWrapper = __webpack_require__(/*! ./ArrayStateWrapper */ \"./src-client/state/ArrayStateWrapper.ts\");\nconst { compareStatePaths } = __webpack_require__(/*! ./util */ \"./src-client/state/util.ts\");\nconst ObjectStateWrapper = __webpack_require__(/*! ./ObjectStateWrapper */ \"./src-client/state/ObjectStateWrapper.ts\");\nconst BaseStateWrapper = __webpack_require__(/*! ./BaseStateWrapper */ \"./src-client/state/BaseStateWrapper.ts\");\nclass RootStateWrapper extends BaseStateWrapper {\n    bindings = [];\n    constructor(state) {\n        super(state);\n    }\n    get length() {\n        return this.#asArray().length;\n    }\n    onSet(paths) {\n        for (const binding of this.bindings) {\n            if (binding.dependencies.some(dependency => paths.some(path => compareStatePaths(path, dependency))))\n                binding.listener();\n        }\n    }\n    map(renderItem) {\n        return this.#asArray().map(renderItem);\n    }\n    push(item) {\n        this.#asArray().push(item);\n    }\n    pop() {\n        this.#asArray().pop();\n    }\n    getChild(key) {\n        return this.#asObject().getChild(key);\n    }\n    #asObject() {\n        const { state } = this;\n        if (typeof state !== 'object' ||\n            state === null ||\n            state === undefined)\n            throw new Error('Expected state to be an object');\n        return new ObjectStateWrapper(state, this, []);\n    }\n    #asArray() {\n        const { state } = this;\n        if (!Array.isArray(state))\n            throw new Error('Expected state to be an array');\n        return new ArrayStateWrapper(state, this, []);\n    }\n}\nmodule.exports = RootStateWrapper;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/state/RootStateWrapper.ts?");

/***/ }),

/***/ "./src-client/state/index.ts":
/*!***********************************!*\
  !*** ./src-client/state/index.ts ***!
  \***********************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst RootStateWrapper = __webpack_require__(/*! ./RootStateWrapper */ \"./src-client/state/RootStateWrapper.ts\");\nmodule.exports = function state(value) {\n    return new RootStateWrapper(value);\n};\n\n\n//# sourceURL=webpack://Fuffle/./src-client/state/index.ts?");

/***/ }),

/***/ "./src-client/state/util.ts":
/*!**********************************!*\
  !*** ./src-client/state/util.ts ***!
  \**********************************/
/***/ ((module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nmodule.exports = {\n    compareStatePaths(path1, path2) {\n        const commonLength = Math.min(path1.length, path2.length);\n        for (let i = 0; i < commonLength; i++)\n            if (path1[i] !== path2[i])\n                return false;\n        return true;\n    }\n};\n\n\n//# sourceURL=webpack://Fuffle/./src-client/state/util.ts?");

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