import { NextFunction, Request, Response } from "express";
import { Games } from "../../db";

export const canPlayerDraw = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const gameId = parseInt(request.params.gameId, 10);
    // @ts-expect-error TODO: Define the session type for the user object
    const { id: userId } = request.session.user;

    const { turn: currentGameTurn } = await Games.getTurn(gameId);
    const { last_draw_turn: lastDrawTurn } = await Games.getLastDrawTurn(
        gameId,
        userId,
    );
    const socket = request.app.get("io");

    if (currentGameTurn === lastDrawTurn) {
        response.status(401);

        socket.to(`user-${userId}`).emit(`message:${gameId}`, {
            message: "You have already drawn a card this turn",
            sender: "system",
            gravatar: "123456789?d=robohash",
            timestamp: new Date(),
        });

        return;
    } else {
        next();
    }
};
