import express from "express";
import { Request, Response } from "express";
import { createGame, joinGame, get } from "../db/games/";

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

        // screw it just join immediately after.... for now
        // TODO:
        const game = await createGame();
        await joinGame(game.id, userId);

        res.json({
            success: true,
            message: "Game lobby created",
            lobby: {
                id: game.id,
                name,
                maxPlayers: maxPlayers || 4,
                players: [],
            },
        });
    } catch (err) {
        console.error("failed to create lobby", err);
        res.status(500).json({
            success: false,
            message: "somehow failed to create game",
        });
    }
});

// returns lobby info
router.get("/:gameId", async (req: Request, res: Response) => {
    const { id } = req.params;

    // @ts-expect-error
    const { id: userId } = req.session.user;

    const game = await get(parseInt(id, 10), userId);

    res.json({
        title: `Game ${id}`,
        id,
        game,
        userId,
    });
});

//returns lobby page after login.
router.get("/", (req: Request, res: Response) => {
    res.render("games/lobby", {
        message: "Game lobby after the login.",
        userLoggedIn: true,
    });
});

export default router;
