import { NextFunction, Request, Response } from "express";
import { Games } from "../../db";

export const isPlayerInGame = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { gameId } = req.params;
    // @ts-expect-error
    const { id: userId } = req.session.user;

    try {
        const players = await Games.getPlayers(Number(gameId));
        const isPlayer = players.some((player) => player.id === userId);

        if (!isPlayer) {
            return res.redirect(`/games/${gameId}/join`);
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to verify player or not in game",
        });
    }
};
