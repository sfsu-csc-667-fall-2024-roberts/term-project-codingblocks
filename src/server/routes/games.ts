import express from "express";

const router = express.Router();

router.get("/:gameId", (req, res) => {
    const { gameId } = req.params;

    res.render("games/game", { title: `Game ${gameId}`, gameId });
});

router.get("/:gameId/lobby", (req, res) => {
    const { gameId } = req.params;

    res.render("games/lobby", { title: "Game lobby", gameId });
});

export default router;
