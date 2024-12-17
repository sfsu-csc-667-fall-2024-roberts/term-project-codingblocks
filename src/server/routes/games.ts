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
        const { gameDetails, players, playerHand, communityCards } = gameState;
        const canStart =
            players.length >= 1 && gameDetails.current_stage === "waiting";

        res.render("games/game", {
            title: `Game ${gameId}`,
            gameId,
            gameDetails,
            players,
            playerHand,
            canStart,
            communityCards,
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
    async (req, res, next) => {
        const { gameId } = req.params;

        try {
            await Games.dealCards(Number(gameId));
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to start game" });
            return;
        }
    },
    broadcastGameUpdate,
    async (req, res) => {
        const { gameId } = req.params;
        res.redirect(`/games/${gameId}`);
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

            let betAmount = Number(amount) || 0;
            if (action === "call") {
                const highestBet = await Games.getHighestBet(Number(gameId));
                const playerState = (
                    await Games.getPlayers(Number(gameId))
                ).find((p) => p.id === userId);

                if (!playerState) {
                    _res.status(400).json({ error: "Player not found" });
                    return;
                }

                betAmount = highestBet.highest_bet - playerState.current_bet;
            }

            await Games.playerAction(
                Number(gameId),
                userId,
                dbAction,
                betAmount,
            );

            await Games.nextPlayer(Number(gameId));

            const hasWinner = await Games.checkWinner(Number(gameId));
            if (hasWinner) {
                _res.redirect(`/games/${gameId}/winner`);
                return;
            }

            const roundComplete = await Games.isRoundComplete(Number(gameId));
            if (roundComplete) {
                const currentStage = (
                    await Games.getGameDetails(Number(gameId))
                ).current_stage;
                const stageProgression: { [index: string]: any } = {
                    preflop: "flop",
                    flop: "turn",
                    turn: "river",
                    river: "showdown",
                };

                if (currentStage in stageProgression) {
                    const nextStage = stageProgression[currentStage];
                    await Games.updateGameState(Number(gameId), nextStage);

                    if (nextStage === "showdown") {
                        _res.redirect(`/games/${gameId}/winner`);
                        return;
                    }

                    if (nextStage !== "showdown") {
                        await Games.dealCommunityCards(
                            Number(gameId),
                            nextStage,
                        );
                    }
                }
            }
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

// should technically come redirect here if games is over
router.get("/:gameId/winner", isPlayerInGame, async (req, res) => {
    const { gameId } = req.params;
    // @ts-expect-error
    const { id: userId } = req.session.user;

    try {
        const gameState = await Games.get(Number(gameId), userId);
        const { gameDetails, players, communityCards } = gameState;
        console.log(gameDetails);

        const winner = players.find((p) => p.id === gameDetails.winner_id);
        if (!winner) {
            throw new Error("Winner not found");
        }

        const winningHand = await Games.getPlayerHand(
            Number(gameId),
            winner.id,
        );

        res.render("games/winner", {
            title: `Game ${gameId} Winner`,
            gameId,
            gameDetails,
            winner,
            winningHand,
            players,
            communityCards,
            userLoggedIn: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", {
            message: "Failed to load winner page",
            error: { status: 500 },
        });
    }
});

export default router;
