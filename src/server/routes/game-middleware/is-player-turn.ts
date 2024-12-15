import { NextFunction, Request, Response } from "express";
import { Games } from "../../db";

export const isPlayersTurn = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const gameId = parseInt(request.params.gameId, 10);

    if (!gameId) {
        response.sendStatus(400);
        return;
    }

    // @ts-expect-error TODO: Define the session type for the user object
    const { id: userId } = request.session.user;
    const socket = request.app.get("io");

    const { is_current_player: isCurrentPlayer } = await Games.isCurrentPlayer(
        gameId,
        userId,
    );

    if (!isCurrentPlayer) {
        response.sendStatus(401);

        socket.to(`user-${userId}`).emit(`message:${gameId}`, {
            message: "You can not play when it is not your turn",
            sender: "system",
            gravatar: "123456789?d=robohash",
            timestamp: new Date(),
        });

        return;
    } else {
        next();
    }
};
