/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./src-client/$.ts":
/*!*************************!*\
  !*** ./src-client/$.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DomUtil)\n/* harmony export */ });\nclass DomUtil {\n    static element(tagName) {\n        return new DomUtil(document.createElement(tagName));\n    }\n    static text(text) {\n        return new DomUtil(document.createTextNode(text));\n    }\n    static resolveArray(child) {\n        const nodes = [];\n        for (const grandchild of child)\n            nodes.push(...DomUtil.resolve(grandchild));\n        return nodes;\n    }\n    static resolve(child) {\n        if (child instanceof Node)\n            return [child];\n        if (child instanceof DomUtil)\n            return [child.node];\n        if (typeof child === 'string')\n            return [document.createTextNode(child)];\n        if (typeof child === 'number')\n            return [document.createTextNode(String(child))];\n        if (typeof child === 'boolean') {\n            if (!child)\n                return [];\n            return [document.createTextNode('string')];\n        }\n        if (Array.isArray(child))\n            return DomUtil.resolveArray(child);\n        if (child === undefined || child === null)\n            return [];\n        if (typeof child === 'object') {\n            try {\n                return [document.createTextNode(JSON.stringify(child))];\n            }\n            catch {\n                return [document.createElement(String(child))];\n            }\n        }\n        return [];\n    }\n    node;\n    constructor(node) {\n        this.node = node;\n    }\n    text(text) {\n        this.node.textContent = text;\n        return this;\n    }\n    on(eventName, onFired, options) {\n        this.node.addEventListener(eventName, onFired, options);\n        return this;\n    }\n    add(...children) {\n        const nodes = DomUtil.resolveArray(children);\n        for (const node of nodes)\n            this.node.appendChild(node);\n        return this;\n    }\n}\n\n\n//# sourceURL=webpack:///./src-client/$.ts?");

/***/ }),

/***/ "./src-client/index.ts":
/*!*****************************!*\
  !*** ./src-client/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _$__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\n\nclass StateWrapper {\n    state;\n    #bindings = [];\n    constructor(state) {\n        this.state = state;\n    }\n    text(getValue) {\n        const binding = new TextBinding(this, getValue);\n        this.#bindings.push(binding);\n        return binding.node;\n    }\n    onUpdated(keys) {\n        for (const binding of this.#bindings)\n            binding.onUpdated(keys);\n    }\n    update(update) {\n        const transaction = new StateTransaction(this);\n        update(transaction.proxy);\n        this.state = { ...transaction.state };\n        this.onUpdated([...transaction.sets]);\n    }\n}\nclass Binding {\n    stateWrapper;\n    dependencies = [];\n    constructor(stateWrapper) {\n        this.stateWrapper = stateWrapper;\n    }\n    onUpdated(keys) {\n        if (this.check(keys))\n            this.apply();\n    }\n    check(keys) {\n        for (const key of keys)\n            for (const dependency of this.dependencies)\n                if (key === dependency)\n                    return true;\n        return false;\n    }\n    apply() { }\n}\nclass TextBinding extends Binding {\n    node = null;\n    getValue;\n    constructor(stateWrapper, getValue) {\n        super(stateWrapper);\n        this.getValue = getValue;\n        const transaction = new StateTransaction(stateWrapper);\n        const value = getValue(transaction.proxy);\n        this.dependencies = [...transaction.gets];\n        this.node = document.createTextNode(value);\n    }\n    apply() {\n        const transaction = new StateTransaction(this.stateWrapper);\n        const value = this.getValue(transaction.proxy);\n        this.dependencies = [...transaction.gets];\n        this.node.nodeValue = value;\n    }\n}\nclass StateTransaction {\n    state;\n    proxy;\n    gets = [];\n    sets = [];\n    constructor(stateWrapper) {\n        this.state = { ...stateWrapper.state };\n        this.proxy = new Proxy(this.state, {\n            set: (target, name, value, receiver) => {\n                if (typeof name === 'string' &&\n                    value !== target[name] &&\n                    !this.sets.includes(name))\n                    this.sets.push(name);\n                return Reflect.set(target, name, value, receiver);\n            },\n            get: (target, name, receiver) => {\n                if (typeof name === 'string' &&\n                    !this.gets.includes(name))\n                    this.gets.push(name);\n                return Reflect.get(target, name, receiver);\n            }\n        });\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ $: _$__WEBPACK_IMPORTED_MODULE_0__[\"default\"], StateWrapper });\n\n\n//# sourceURL=webpack:///./src-client/index.ts?");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = __webpack_require__("./src-client/index.ts");
/******/ var __webpack_exports__default = __webpack_exports__["default"];
/******/ export { __webpack_exports__default as default };
/******/ 
