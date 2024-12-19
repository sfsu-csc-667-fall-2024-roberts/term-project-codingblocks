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
            /***/ function (
                __unused_webpack_module,
                exports,
                __webpack_require__,
            ) {
                eval(
                    '\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst index_1 = __webpack_require__(/*! ./games/index */ "./src/client/games/index.ts");\nconst gameId = window.location.pathname.split("/").pop();\nwindow.socket.on(`game:${gameId}:updated`, (game) => {\n    (0, index_1.updateGame)(game);\n});\n// todo i dont want a form maybe?\ndocument.addEventListener("DOMContentLoaded", () => {\n    const actionForm = document.querySelector(".action-form");\n    if (actionForm) {\n        actionForm.addEventListener("submit", ((e) => __awaiter(void 0, void 0, void 0, function* () {\n            e.preventDefault();\n            // so muchyhhh casttiiinnhngggt\n            const submitEvent = e;\n            const form = submitEvent.target;\n            const formData = new FormData(form);\n            const submitter = submitEvent.submitter;\n            const action = submitter === null || submitter === void 0 ? void 0 : submitter.value;\n            const amount = formData.get("amount")\n                ? Number(formData.get("amount"))\n                : 0;\n            console.log({\n                action,\n                amount,\n                submitter,\n            });\n            try {\n                const response = yield fetch(`/games/${gameId}/action`, {\n                    method: "POST",\n                    headers: {\n                        "Content-Type": "application/json",\n                    },\n                    body: JSON.stringify({\n                        action,\n                        amount,\n                    }),\n                });\n                if (!response.ok) {\n                    const errorData = yield response.json();\n                    throw new Error(errorData.error || "Action failed");\n                }\n                const result = yield response.json();\n                if (result.redirect) {\n                    window.location.href = result.redirect;\n                }\n            }\n            catch (error) {\n                console.error("Error:", error);\n                if (error instanceof Error) {\n                    alert(error.message);\n                }\n            }\n        })));\n    }\n});\n\n\n//# sourceURL=webpack://codingblocks/./src/client/games.ts?',
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
                    '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.updateGame = void 0;\nconst updateGame = (gameState) => {\n    const { players, player, gameDetails, communityCards } = gameState;\n    if (gameDetails.current_stage === "showdown") {\n        window.location.href = `/games/${window.location.pathname.split("/").pop()}/winner`;\n        return;\n    }\n    const gameInfo = document.querySelector(".game-info");\n    if (gameInfo) {\n        const allParagraphs = gameInfo.querySelectorAll("p");\n        if (gameDetails && allParagraphs.length >= 2) {\n            allParagraphs[0].textContent = `Current Stage: ${gameDetails.current_stage}`;\n            allParagraphs[1].textContent = `Pot: $${gameDetails.pot}`;\n        }\n        const startForm = gameInfo.querySelector("form");\n        if (startForm) {\n            startForm.style.display =\n                gameDetails.current_stage === "waiting" ? "block" : "none";\n        }\n    }\n    const communityCardsSection = document.querySelector(".community-cards");\n    if (communityCardsSection) {\n        const noCardsMessage = communityCardsSection.querySelector("p");\n        if (!communityCards || communityCards.length === 0) {\n            if (!noCardsMessage) {\n                communityCardsSection.innerHTML = `\n                    <h2>Community Cards</h2>\n                    <p>No community cards yet</p>\n                `;\n            }\n        }\n        else {\n            communityCardsSection.innerHTML = `\n                <h2>Community Cards</h2>\n                <div class="cards">\n                    ${communityCards\n                .map((card) => `\n                    <div class="card">${card.value} of ${card.suit}</div>\n                    `)\n                .join("")}\n                </div>\n            `;\n        }\n    }\n    const playersList = document.querySelector(".players-list");\n    if (playersList) {\n        const allPlayers = [...players, player];\n        playersList.innerHTML = allPlayers\n            .map((p) => `\n                <div class="player ${p.is_current ? "current-turn" : ""}">\n                    <p>Player: ${p.username}</p>\n                    <p>Chips: $${p.chips}</p>\n                    <p>Status: ${p.status}</p>\n                    ${p.current_bet > 0 ? `<p>Current Bet: $${p.current_bet}</p>` : ""}\n                </div>\n            `)\n            .join("");\n    }\n    const playerHandSection = document.querySelector(".player-hand");\n    if (playerHandSection) {\n        if (!player.hand || player.hand.length === 0) {\n            playerHandSection.innerHTML = `\n                <h2>Your Hand</h2>\n                <p>Waiting for cards to be dealt...</p>\n            `;\n        }\n        else {\n            playerHandSection.innerHTML = `\n                <h2>Your Hand</h2>\n                <div class="cards">\n                    ${player.hand\n                .map((card) => `\n                    <div class="card">${card.value} of ${card.suit}</div>\n                    `)\n                .join("")}\n                </div>\n            `;\n        }\n    }\n    const playerActions = document.querySelector(".player-actions");\n    if (playerActions && gameDetails) {\n        const shouldShowActions = gameDetails.current_stage !== "waiting" &&\n            gameDetails.current_stage !== "showdown";\n        playerActions.style.display = shouldShowActions ? "block" : "none";\n        if (shouldShowActions) {\n            const betButton = playerActions.querySelector(\'button[value="bet"]\');\n            const raiseButton = playerActions.querySelector(\'button[value="raise"]\');\n            if (betButton && raiseButton) {\n                if (gameDetails.current_bet === 0) {\n                    betButton.style.display = "inline";\n                    raiseButton.style.display = "none";\n                }\n                else {\n                    betButton.style.display = "none";\n                    raiseButton.style.display = "inline";\n                }\n            }\n        }\n    }\n};\nexports.updateGame = updateGame;\n\n\n//# sourceURL=webpack://codingblocks/./src/client/games/update-game.ts?',
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
        /******/ __webpack_modules__[moduleId].call(
            module.exports,
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
    /******/ // This entry module is referenced by other modules so it can't be inlined
    /******/ var __webpack_exports__ = __webpack_require__(
        "./src/client/games.ts",
    );
    /******/
    /******/
})();
