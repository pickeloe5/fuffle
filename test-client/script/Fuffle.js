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

/***/ "./src-client/NodeWrapper.ts":
/*!***********************************!*\
  !*** ./src-client/NodeWrapper.ts ***!
  \***********************************/
/***/ ((module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass NodeWrapper {\n    static text(text) {\n        return new TextNodeWrapper(text);\n    }\n    node;\n    constructor(node) {\n        this.node = node;\n    }\n}\nmodule.exports = NodeWrapper;\nclass TextNodeWrapper extends NodeWrapper {\n    constructor(text = '') {\n        super(document.createTextNode(text));\n    }\n    bind(stateReference) {\n        stateReference.bind((value) => {\n            this.node.nodeValue = value;\n        });\n    }\n}\n\n\n//# sourceURL=webpack://Fuffle/./src-client/NodeWrapper.ts?");

/***/ }),

/***/ "./src-client/StateReference.ts":
/*!**************************************!*\
  !*** ./src-client/StateReference.ts ***!
  \**************************************/
/***/ ((module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass StateReference {\n    stateWrapper;\n    resolve;\n    constructor(stateWrapper, resolve) {\n        this.stateWrapper = stateWrapper;\n        this.resolve = resolve;\n    }\n    bind(callback) {\n        this.stateWrapper.bind(this, callback);\n    }\n}\nmodule.exports = StateReference;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/StateReference.ts?");

/***/ }),

/***/ "./src-client/StateWrapper.ts":
/*!************************************!*\
  !*** ./src-client/StateWrapper.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet StateReference;\nclass StateWrapper {\n    state;\n    listeners = [];\n    constructor(state) {\n        this.state = state;\n    }\n    bind(stateReference, callback) {\n        function listener(state) {\n            callback(stateReference.resolve(state));\n        }\n        this.listeners.push(listener);\n        listener(this.state);\n    }\n    get(listener) {\n        return new StateReference(this, listener);\n    }\n    set(state) {\n        this.state = state;\n        for (const listener of this.listeners)\n            listener(state);\n    }\n}\nmodule.exports = StateWrapper;\nStateReference = __webpack_require__(/*! ./StateReference */ \"./src-client/StateReference.ts\");\n\n\n//# sourceURL=webpack://Fuffle/./src-client/StateWrapper.ts?");

/***/ }),

/***/ "./src-client/index.ts":
/*!*****************************!*\
  !*** ./src-client/index.ts ***!
  \*****************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst NodeWrapper = __webpack_require__(/*! ./NodeWrapper */ \"./src-client/NodeWrapper.ts\");\nconst StateReference = __webpack_require__(/*! ./StateReference */ \"./src-client/StateReference.ts\");\nconst StateWrapper = __webpack_require__(/*! ./StateWrapper */ \"./src-client/StateWrapper.ts\");\nconst Fuffle = { NodeWrapper, StateReference, StateWrapper };\nmodule.exports = Fuffle;\n\n\n//# sourceURL=webpack://Fuffle/./src-client/index.ts?");

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