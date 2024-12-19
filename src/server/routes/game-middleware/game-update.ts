import { NextFunction, Request, Response } from "express";
import { Games } from "../../db";

export const broadcastGameUpdate = async (
    request: Request,
    _response: Response,
    next: NextFunction,
) => {
    const gameId = parseInt(request.params.gameId, 10);

    const playerData = await Games.getPlayers(gameId);
    const gameDetails = await Games.getGameDetails(gameId);
    const communityCards = await Games.getCommunityCards(
        gameId,
        gameDetails.current_stage,
    );

    const socket = request.app.get("io");

    for (const player of playerData) {
        const playerHand = await Games.getPlayerHand(gameId, player.id);

        socket.to(`user-${player.id}`).emit(`game:${gameId}:updated`, {
            gameDetails,
            communityCards,
            players: playerData.filter((p) => p.id !== player.id),
            player: {
                ...playerData.find((p) => p.id === player.id),
                hand: playerHand,
            },
        });
    }

    next();
};
