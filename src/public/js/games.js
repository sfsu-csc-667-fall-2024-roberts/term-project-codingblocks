/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ var __webpack_modules__ = {
        /***/ "./src/client/games.ts":
            /*!*****************************!*\
  !*** ./src/client/games.ts ***!
  \*****************************/
            /***/ (__unused_webpack_module, exports, __webpack_require__) => {
                eval(
                    '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst index_1 = __webpack_require__(/*! ./games/index */ "./src/client/games/index.ts");\nconst gameId = window.location.pathname.split("/").pop();\nwindow.socket.on(`game:${gameId}:updated`, (game) => {\n    (0, index_1.updateGame)(game);\n});\n\n\n//# sourceURL=webpack://codingblocks/./src/client/games.ts?',
                );

                /***/
            },

        /***/ "./src/client/games/index.ts":
            /*!***********************************!*\
  !*** ./src/client/games/index.ts ***!
  \***********************************/
            /***/ (__unused_webpack_module, exports, __webpack_require__) => {
                eval(
                    '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.updateGame = void 0;\nvar update_game_1 = __webpack_require__(/*! ./update-game */ "./src/client/games/update-game.ts");\nObject.defineProperty(exports, "updateGame", ({ enumerable: true, get: function () { return update_game_1.updateGame; } }));\n\n\n//# sourceURL=webpack://codingblocks/./src/client/games/index.ts?',
                );

                /***/
            },

        /***/ "./src/client/games/update-game.ts":
            /*!*****************************************!*\
  !*** ./src/client/games/update-game.ts ***!
  \*****************************************/
            /***/ (__unused_webpack_module, exports) => {
                eval(
                    '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.updateGame = void 0;\nconst updateGame = (game) => {\n    console.log(game);\n};\nexports.updateGame = updateGame;\n\n\n//# sourceURL=webpack://codingblocks/./src/client/games/update-game.ts?',
                );

                /***/
            },

        /******/
    };
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = (__webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {},
            /******/
        });
        /******/
        /******/ // Execute the module function
        /******/ __webpack_modules__[moduleId](
            module,
            module.exports,
            __webpack_require__,
        );
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/
    }
    /******/
    /************************************************************************/
    /******/
    /******/ // startup
    /******/ // Load entry module and return exports
    /******/ // This entry module can't be inlined because the eval devtool is used.
    /******/ var __webpack_exports__ = __webpack_require__(
        "./src/client/games.ts",
    );
    /******/
    /******/
})();
