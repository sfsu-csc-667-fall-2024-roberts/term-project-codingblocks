import { NextFunction, Request, Response } from "express";

const chatMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const gameIdMatch = request.headers.referer?.match(/\/games\/(\d+)/);
    const gameId = parseInt(gameIdMatch ? gameIdMatch[1] : "0");

    // @ts-expect-error TODO figure out the typing for session on request
    request.session.roomId = gameId;

    if (gameId !== undefined) {
        response.locals.roomId = gameId;
    } else {
        response.locals.roomId = 0;
    }

    next();
};

export default chatMiddleware;
