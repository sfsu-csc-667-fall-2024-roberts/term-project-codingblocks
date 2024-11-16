import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.post("/create", (req: Request, res: Response) => {
    const { name, maxPlayers } = req.body;

    // todo:

    if (name) {
        res.json({
            success: true,
            message: "lobby created",
            lobby: {
                id: Math.random().toString(36).substring(7),
                name,
                maxPlayers: maxPlayers || 4,
                players: [],
            },
        });
    } else {
        res.status(400).json({
            success: false,
            message: "failed to make lobyy",
        });
    }
});

// returns lobby info
router.get("/get/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    // todo:

    res.json({
        success: true,
        message: "lobby",
        lobby: {
            id,
            name: "1",
            maxPlayers: 4,
            players: [],
        },
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
