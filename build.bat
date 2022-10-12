@echo off
echo. &&^
echo Building library as ES6 module &&^
webpack --config ./webpack-module.config.js &&^
echo. &&^
echo Building library as global variable &&^
webpack --config ./webpack-global.config.js
