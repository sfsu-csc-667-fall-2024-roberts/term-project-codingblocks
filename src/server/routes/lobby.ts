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

//returns lobby page after login.
router.get("/", (_req: Request, res: Response) => {
    res.render("games/lobby", {
        message: "Games lobby after the login.",
        userLoggedIn: true,
    });
});

export default router;
