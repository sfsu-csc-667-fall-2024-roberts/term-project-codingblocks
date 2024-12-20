import express from "express";
import { Request, Response } from "express";
import { Games } from "../db";

const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
    const { name, maxPlayers } = req.body;

    if (!name) {
        res.status(400).json({
            success: false,
            message: "name required to make lobby",
        });
    }

    try {
        // @ts-expect-error
        const { id: userId } = req.session.user;

        // TODO: IMPLEMENT MAX PLAYERS IN createGame()
        const game = await Games.createGame();
        await Games.joinGame(game.id, userId);
        return res.redirect(`/games/${game.id}`);
    } catch (err) {
        console.error("failed to create lobby", err);
        res.status(500).json({
            success: false,
            message: "somehow failed to create game",
        });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        // @ts-expect-error
        const { user } = req.session;
        const page = parseInt(req.query.page as string) || 1;

        const { games, pagination } = await Games.getAvailableGames(page, 5);

        res.render("games/lobby", {
            title: "Game Lobby",
            user: user,
            userLoggedIn: true,
            games,
            pagination,
        });
    } catch (err) {
        console.error("Error loading lobby:", err);
        res.redirect("/");
    }
});

router.post("/join-random", async (req: Request, res: Response) => {
    try {
        // @ts-expect-error
        const { id: userId } = req.session.user;

        const gameId = await Games.getRandomGame();

        // perhaps dont create one?
        if (!gameId) {
            const game = await Games.createGame();
            await Games.joinGame(game.id, userId);
            return res.redirect(`/games/${game.id}`);
        }

        await Games.joinGame(gameId, userId);
        return res.redirect(`/games/${gameId}`);
    } catch (err) {
        console.error("somehow failed to join random game:", err);
        res.status(500).json({
            success: false,
            message: "somehow failed to join random game",
        });
    }
});

export default router;
