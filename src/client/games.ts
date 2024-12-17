import { updateGame } from "./games/index";

const gameId = window.location.pathname.split("/").pop();

window.socket.on(`game:${gameId}:updated`, (game) => {
    updateGame(game);
});
