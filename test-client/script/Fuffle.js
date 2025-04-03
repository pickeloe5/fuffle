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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DomUtil)\n/* harmony export */ });\nclass DomUtil {\n    static element(tagName) {\n        return new DomUtil(document.createElement(tagName));\n    }\n    static text(text) {\n        return new DomUtil(document.createTextNode(text));\n    }\n    static resolveArray(child) {\n        const nodes = [];\n        for (const grandchild of child)\n            nodes.push(...DomUtil.resolve(grandchild));\n        return nodes;\n    }\n    static resolve(child) {\n        if (child instanceof Node)\n            return [child];\n        if (child instanceof DomUtil)\n            return [child.node];\n        if (typeof child === 'string')\n            return [document.createTextNode(child)];\n        if (typeof child === 'number')\n            return [document.createTextNode(String(child))];\n        if (typeof child === 'boolean') {\n            if (!child)\n                return [];\n            return [document.createTextNode('string')];\n        }\n        if (Array.isArray(child))\n            return DomUtil.resolveArray(child);\n        if (child === undefined || child === null)\n            return [];\n        if (typeof child === 'object') {\n            try {\n                return [document.createTextNode(JSON.stringify(child))];\n            }\n            catch {\n                return [document.createElement(String(child))];\n            }\n        }\n        return [];\n    }\n    node;\n    constructor(node) {\n        this.node = node;\n    }\n    attribute(name, value) {\n        const { node } = this;\n        if (!(node instanceof Element))\n            throw new Error('Cannot set attribute of non element');\n        node.setAttribute(name, value);\n        return this;\n    }\n    attr(name, value) {\n        return this.attribute(name, value);\n    }\n    text(text) {\n        this.node.textContent = text;\n        return this;\n    }\n    on(eventName, onFired, options) {\n        this.node.addEventListener(eventName, onFired, options);\n        return this;\n    }\n    add(...children) {\n        const nodes = DomUtil.resolveArray(children);\n        for (const node of nodes)\n            this.node.appendChild(node);\n        return this;\n    }\n}\n\n\n//# sourceURL=webpack:///./src-client/$.ts?");

/***/ }),

/***/ "./src-client/index.ts":
/*!*****************************!*\
  !*** ./src-client/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _$__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./$ */ \"./src-client/$.ts\");\n/* harmony import */ var _state_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state/index */ \"./src-client/state/index.ts\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ $: _$__WEBPACK_IMPORTED_MODULE_0__[\"default\"], state: _state_index__WEBPACK_IMPORTED_MODULE_1__[\"default\"], objectState: _state_index__WEBPACK_IMPORTED_MODULE_1__.objectState });\n\n\n//# sourceURL=webpack:///./src-client/index.ts?");

/***/ }),

/***/ "./src-client/state/ObjectStateWrapper/ObjectStateObserver.ts":
/*!********************************************************************!*\
  !*** ./src-client/state/ObjectStateWrapper/ObjectStateObserver.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ObjectStateObserver)\n/* harmony export */ });\n/* harmony import */ var _ObjectStatePath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectStatePath */ \"./src-client/state/ObjectStateWrapper/ObjectStatePath.ts\");\n\nclass ObjectStateObserver {\n    proxy;\n    gets = [];\n    sets = [];\n    revokes = [];\n    constructor(state) {\n        this.proxy = this.#makeProxy(state, new _ObjectStatePath__WEBPACK_IMPORTED_MODULE_0__[\"default\"]([]));\n    }\n    #onGet(path) {\n        this.gets = path.join(this.gets);\n    }\n    #onSet(path) {\n        this.sets = path.join(this.sets);\n    }\n    #makeProxy(value, path) {\n        const { proxy, revoke } = Proxy.revocable(value, {\n            get: (target, key, receiver) => {\n                const child = Reflect.get(target, key, receiver);\n                if (typeof key !== 'string')\n                    return child;\n                this.#onGet(path.getChild(key));\n                if (typeof child === 'object')\n                    return this.#makeProxy(child, path.getChild(key));\n                return child;\n            },\n            set: (target, key, child, receiver) => {\n                if (typeof key === 'string' && child !== value[key])\n                    this.#onSet(path.getChild(key));\n                return Reflect.set(target, key, child, receiver);\n            }\n        });\n        this.revokes.push(revoke);\n        return proxy;\n    }\n    stop() {\n        for (const revoke of this.revokes)\n            revoke();\n    }\n}\n\n\n//# sourceURL=webpack:///./src-client/state/ObjectStateWrapper/ObjectStateObserver.ts?");

/***/ }),

/***/ "./src-client/state/ObjectStateWrapper/ObjectStatePath.ts":
/*!****************************************************************!*\
  !*** ./src-client/state/ObjectStateWrapper/ObjectStatePath.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ObjectStatePath)\n/* harmony export */ });\nclass ObjectStatePath {\n    keys;\n    length;\n    constructor(keys) {\n        this.keys = keys;\n        this.length = keys.length;\n    }\n    compare(path) {\n        const commonLength = Math.min(this.length, path.length);\n        for (let i = 0; i < commonLength; i++)\n            if (path[i] !== this[i])\n                return false;\n        return true;\n    }\n    join(paths) {\n        const result = [];\n        for (const path of paths) {\n            if (this.compare(path)) {\n                if (path.length <= this.length)\n                    return paths; // This existing path covers the new path\n                continue; // This existing path is covered by the new path\n            }\n            result.push(path);\n        }\n        result.push(this);\n        return result;\n    }\n    getChild(key) {\n        return new ObjectStatePath([...this.keys, key]);\n    }\n}\n\n\n//# sourceURL=webpack:///./src-client/state/ObjectStateWrapper/ObjectStatePath.ts?");

/***/ }),

/***/ "./src-client/state/ObjectStateWrapper/ObjectStateReader.ts":
/*!******************************************************************!*\
  !*** ./src-client/state/ObjectStateWrapper/ObjectStateReader.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ObjectStateReader)\n/* harmony export */ });\n/* harmony import */ var _ObjectStateObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectStateObserver */ \"./src-client/state/ObjectStateWrapper/ObjectStateObserver.ts\");\n\nclass ObjectStateReader {\n    #stateWrapper;\n    #callback;\n    #dependencies = [];\n    constructor(stateWrapper, callback) {\n        this.#stateWrapper = stateWrapper;\n        this.#callback = callback;\n    }\n    read() {\n        const observer = new _ObjectStateObserver__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({ ...this.#stateWrapper.state });\n        this.#callback(observer.proxy);\n        observer.stop();\n        this.#dependencies = [...observer.gets];\n    }\n    checkDependencies(paths) {\n        return paths.some(path1 => this.#dependencies.some(path2 => path1.compare(path2)));\n    }\n}\n\n\n//# sourceURL=webpack:///./src-client/state/ObjectStateWrapper/ObjectStateReader.ts?");

/***/ }),

/***/ "./src-client/state/ObjectStateWrapper/index.ts":
/*!******************************************************!*\
  !*** ./src-client/state/ObjectStateWrapper/index.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ObjectStateWrapper)\n/* harmony export */ });\n/* harmony import */ var _StateWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../StateWrapper */ \"./src-client/state/StateWrapper.ts\");\n/* harmony import */ var _ObjectStateReader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ObjectStateReader */ \"./src-client/state/ObjectStateWrapper/ObjectStateReader.ts\");\n/* harmony import */ var _ObjectStateObserver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ObjectStateObserver */ \"./src-client/state/ObjectStateWrapper/ObjectStateObserver.ts\");\n/* harmony import */ var _ObjectStatePath__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ObjectStatePath */ \"./src-client/state/ObjectStateWrapper/ObjectStatePath.ts\");\n\n\n\n\nclass ObjectStateWrapper extends _StateWrapper__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    readers = [];\n    constructor(state) {\n        super();\n        this.state = state;\n    }\n    read(callback) {\n        const reader = new _ObjectStateReader__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this, callback);\n        this.readers.push(reader);\n        reader.read();\n    }\n    write(state) {\n        const paths = this.#compareState(this.state, state, new _ObjectStatePath__WEBPACK_IMPORTED_MODULE_3__[\"default\"]([]));\n        this.state = { ...state };\n        this.#onSet(paths);\n    }\n    update(callback) {\n        const state = { ...this.state };\n        const observer = new _ObjectStateObserver__WEBPACK_IMPORTED_MODULE_2__[\"default\"](state);\n        callback(observer.proxy);\n        observer.stop();\n        this.state = { ...state };\n        this.#onSet([...observer.sets]);\n    }\n    #onSet(paths) {\n        for (const reader of this.readers)\n            if (reader.checkDependencies(paths))\n                reader.read();\n    }\n    #compareState(before, after, path) {\n        const paths = [];\n        for (const key in before) {\n            const beforeValue = before[key];\n            const afterValue = after[key];\n            if (typeof beforeValue === 'object' &&\n                beforeValue !== null &&\n                beforeValue !== undefined &&\n                typeof afterValue === 'object' &&\n                afterValue !== null &&\n                afterValue !== undefined) {\n                paths.push(...this.#compareState(beforeValue, afterValue, path.getChild(key)));\n                continue;\n            }\n            if (after[key] !== before[key])\n                paths.push(path.getChild(key));\n        }\n        for (const key in after)\n            if (!(key in before))\n                paths.push(path.getChild(key));\n        return paths;\n    }\n}\n\n\n//# sourceURL=webpack:///./src-client/state/ObjectStateWrapper/index.ts?");

/***/ }),

/***/ "./src-client/state/SimpleStateWrapper.ts":
/*!************************************************!*\
  !*** ./src-client/state/SimpleStateWrapper.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SimpleStateWrapper)\n/* harmony export */ });\n/* harmony import */ var _StateWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateWrapper */ \"./src-client/state/StateWrapper.ts\");\n\nclass SimpleStateWrapper extends _StateWrapper__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    #listeners = [];\n    constructor(state) {\n        super();\n        this.state = state;\n    }\n    read(callback) {\n        this.#listeners.push(callback);\n        callback(this.state);\n    }\n    write(state) {\n        this.state = state;\n        for (const listener of this.#listeners)\n            listener(state);\n    }\n    update(callback) {\n        callback(this.state);\n        for (const listener of this.#listeners)\n            listener(this.state);\n    }\n}\n\n\n//# sourceURL=webpack:///./src-client/state/SimpleStateWrapper.ts?");

/***/ }),

/***/ "./src-client/state/StateWrapper.ts":
/*!******************************************!*\
  !*** ./src-client/state/StateWrapper.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ StateWrapper)\n/* harmony export */ });\nclass StateWrapper {\n    state;\n    read(_callback) { }\n    write(_state) { }\n    update(_callback) { }\n    text(callback = defaultTextCallback) {\n        const node = document.createTextNode('');\n        this.read((state) => {\n            const value = callback(state);\n            node.nodeValue = value;\n        });\n        return node;\n    }\n}\nconst defaultTextCallback = (state) => {\n    if (typeof state === 'string')\n        return state;\n    if (typeof state === 'number')\n        return String(state);\n    return '';\n};\n\n\n//# sourceURL=webpack:///./src-client/state/StateWrapper.ts?");

/***/ }),

/***/ "./src-client/state/index.ts":
/*!***********************************!*\
  !*** ./src-client/state/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ state),\n/* harmony export */   objectState: () => (/* binding */ objectState)\n/* harmony export */ });\n/* harmony import */ var _SimpleStateWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SimpleStateWrapper */ \"./src-client/state/SimpleStateWrapper.ts\");\n/* harmony import */ var _ObjectStateWrapper_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ObjectStateWrapper/index */ \"./src-client/state/ObjectStateWrapper/index.ts\");\n\n\nfunction state(value) {\n    return new _SimpleStateWrapper__WEBPACK_IMPORTED_MODULE_0__[\"default\"](value);\n}\nfunction objectState(value) {\n    return new _ObjectStateWrapper_index__WEBPACK_IMPORTED_MODULE_1__[\"default\"](value);\n}\n\n\n//# sourceURL=webpack:///./src-client/state/index.ts?");

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
