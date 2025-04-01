/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src-client/$.ts":
/*!*************************!*\
  !*** ./src-client/$.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DomUtil)\n/* harmony export */ });\nclass DomUtil {\n    static element(tagName) {\n        return new DomUtil(document.createElement(tagName));\n    }\n    static resolveArray(child) {\n        const nodes = [];\n        for (const grandchild of child)\n            nodes.push(...DomUtil.resolve(grandchild));\n        return nodes;\n    }\n    static resolve(child) {\n        if (child instanceof Node)\n            return [child];\n        if (child instanceof DomUtil)\n            return [child.node];\n        if (typeof child === 'string')\n            return [document.createTextNode(child)];\n        if (typeof child === 'number')\n            return [document.createTextNode(String(child))];\n        if (typeof child === 'boolean') {\n            if (!child)\n                return [];\n            return [document.createTextNode('string')];\n        }\n        if (Array.isArray(child))\n            return DomUtil.resolveArray(child);\n        if (child === undefined || child === null)\n            return [];\n        if (typeof child === 'object') {\n            try {\n                return [document.createTextNode(JSON.stringify(child))];\n            }\n            catch {\n                return [document.createElement(String(child))];\n            }\n        }\n        return [];\n    }\n    node;\n    constructor(node) {\n        this.node = node;\n    }\n    text(text) {\n        this.node.textContent = text;\n        return this;\n    }\n    on(eventName, onFired, options) {\n        this.node.addEventListener(eventName, onFired, options);\n        return this;\n    }\n    add(...children) {\n        const nodes = DomUtil.resolveArray(children);\n        for (const node of nodes)\n            this.node.appendChild(node);\n        return this;\n    }\n}\n\n\n//# sourceURL=webpack:///./src-client/$.ts?");

/***/ }),

/***/ "./src-client/Part.ts":
/*!****************************!*\
  !*** ./src-client/Part.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _$__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\n\nclass Part {\n    static tagName = '';\n    static define() {\n        const PartImpl = this;\n        customElements.define(PartImpl.tagName, class extends PartElement {\n            constructor() {\n                super();\n                this.fufflePart = new PartImpl(this);\n            }\n        });\n    }\n    element;\n    state = {};\n    bindings = [];\n    constructor(element) {\n        this.element = element;\n    }\n    bindText(key) {\n        const node = document.createTextNode('');\n        const binding = new TextBinding(this, key, node);\n        binding.apply();\n        this.bindings.push(binding);\n        return node;\n    }\n    bindFunction(fun) {\n        return () => {\n            const initialState = { ...this.state };\n            fun();\n            const sideEffects = [];\n            for (const key in initialState)\n                if (this.state[key] !== initialState[key])\n                    sideEffects.push(key);\n            for (const binding of this.bindings)\n                if (binding.check(sideEffects))\n                    binding.apply();\n        };\n    }\n    render() {\n        return [];\n    }\n}\nclass Binding {\n    dependencies = [];\n    check(keys) {\n        for (const key of keys)\n            for (const dependency of this.dependencies)\n                if (dependency === key)\n                    return true;\n        return false;\n    }\n    apply() { }\n}\nclass TextBinding extends Binding {\n    #part;\n    #key;\n    #node;\n    constructor(part, key, node) {\n        super();\n        this.dependencies = [key];\n        this.#part = part;\n        this.#key = key;\n        this.#node = node;\n    }\n    apply() {\n        this.#node.nodeValue = this.#getValue();\n    }\n    #getValue() {\n        const value = this.#part.state[this.#key];\n        if (typeof value === 'string')\n            return value;\n        if (typeof value === 'number')\n            return String(value);\n        return '';\n    }\n}\nclass PartElement extends HTMLElement {\n    fufflePart = null;\n    $ = new _$__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this);\n    connectedCallback() {\n        this.$.add(...this.fufflePart.render());\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Part);\n\n\n//# sourceURL=webpack:///./src-client/Part.ts?");

/***/ }),

/***/ "./src-client/index.ts":
/*!*****************************!*\
  !*** ./src-client/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Part__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Part */ \"./src-client/Part.ts\");\n/* harmony import */ var _$__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ $: _$__WEBPACK_IMPORTED_MODULE_1__[\"default\"], Part: _Part__WEBPACK_IMPORTED_MODULE_0__[\"default\"] });\n\n\n//# sourceURL=webpack:///./src-client/index.ts?");

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src-client/index.ts");
/******/ 	
/******/ })()
;