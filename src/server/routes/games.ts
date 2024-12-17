import express from "express";
import { Games } from "../db";
import {
    broadcastGameUpdate,
    isPlayerInGame,
    isPlayersTurn,
} from "./game-middleware/";

const router = express.Router();

// Route to render the game view
router.get("/:gameId", isPlayerInGame, async (req, res) => {
    const { gameId } = req.params;
    // @ts-expect-error
    const { id: userId } = req.session.user;

    try {
        const gameState = await Games.get(Number(gameId), userId);
        const { gameDetails, players, playerHand } = gameState;
        const canStart =
            players.length >= 1 && gameDetails.current_stage === "waiting";

        res.render("games/game", {
            title: `Game ${gameId}`,
            gameId,
            gameDetails,
            players,
            playerHand,
            canStart,
            userLoggedIn: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to load game",
            error: { status: 500 },
        });
    }
});

// for getting a joinr equeest
router.get("/:gameId/join", async (req, res) => {
    const { gameId } = req.params;
    try {
        const gameDetails = await Games.getGameDetails(Number(gameId));

        res.render("games/join", {
            title: `Join Game ${gameId}`,
            gameId,
            gameDetails,
            userLoggedIn: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to load join page",
            error: { status: 500 },
        });
    }
});

// joining
router.post("/:gameId/join", async (req, res) => {
    const { gameId } = req.params;
    // @ts-expect-error
    const { id: userId } = req.session.user;

    try {
        const game = Number(gameId);
        await Games.joinGame(game, userId);
        res.redirect(`/games/${game}`);
    } catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to join game",
            error: { status: 500 },
        });
    }
});

// starting
router.post(
    "/:gameId/start",
    isPlayerInGame,
    async (req, res) => {
        const { gameId } = req.params;

        try {
            await Games.dealCards(Number(gameId));
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to start game" });
        }
    },
    broadcastGameUpdate,
    async (req, res) => {
        const { gameId } = req.params;
        // @ts-expect-error
        const { id: userId } = req.session.user;
        const gameState = await Games.get(Number(gameId), userId);
        res.json(gameState);
    },
);

// actions bet, check, raise, call, allin, fold
router.post(
    "/:gameId/action",
    isPlayerInGame,
    isPlayersTurn,
    async (req, _res, next) => {
        const { gameId } = req.params;
        // @ts-expect-error
        const { id: userId } = req.session.user;
        const { action, amount } = req.body;

        // validate -> execuite -> nextplayer
        try {
            const actionMapping: { [index: string]: any } = {
                fold: "folded",
                check: "active",
                call: "active",
                bet: "active",
                raise: "active",
                allin: "allin",
            };

            const dbAction = actionMapping[action];
            const validActions = ["active", "folded", "allin"];
            if (!validActions.includes(dbAction)) {
                _res.status(400).json({ error: "Invalid action" });
                return;
            }

            await Games.playerAction(
                Number(gameId),
                userId,
                dbAction,
                Number(amount) || 0,
            );

            await Games.nextPlayer(Number(gameId));
            next();
        } catch (error) {
            console.error(error);
            _res.status(500).json({ error: "Failed to process action" });
        }
    },
    broadcastGameUpdate,
    async (req, res) => {
        const { gameId } = req.params;
        res.redirect(`/games/${gameId}`);
    },
);

export default router;
