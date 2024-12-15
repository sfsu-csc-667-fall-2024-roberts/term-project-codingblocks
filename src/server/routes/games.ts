import express from "express";
import { Games } from "../db";

const router = express.Router();

// Route to render the game view
router.get("/:gameId", async (req, res) => {
    const { gameId } = req.params;

    try {
        const gameData = await Games.getGameDetails(Number(gameId));
        res.render("games/game", {
            title: `Game ${gameId}`,
            gameId,
            pot: gameData.pot,
            currentTurn: gameData.currentTurn,
            playerHand: gameData.playerHand,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load game");
    }
});

// Deal cards to players
router.post("/api/games/:id/deal", async (req, res) => {
    const { id: gameId } = req.params;

    try {
        await Games.dealCards(Number(gameId));
        res.status(200).json({ message: "Cards dealt successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to deal cards" });
    }
});

// Play a card
router.post("/api/games/:id/play", async (req, res) => {
    const { id: gameId } = req.params;
    const { cardId } = req.body;

    try {
        await Games.playCard(Number(gameId), Number(cardId));
        res.status(200).json({ message: "Card played successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to play card" });
    }
});

// Get player's hand
router.get("/api/games/:id/hand", async (req, res) => {
    const { id: gameId } = req.params;

    try {
        const hand = await Games.getPlayerHand(
            Number(gameId),
            // @ts-expect-error
            req.session.user.id,
        );
        res.status(200).json(hand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve hand" });
    }
});

export default router;
