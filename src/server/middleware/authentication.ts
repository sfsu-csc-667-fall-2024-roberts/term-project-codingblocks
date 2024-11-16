import { NextFunction, Request, Response } from "express";

const authenticationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    // @ts-expect-error TODO: Define the session type for the user object
    if (!request.session.user) {
        response.redirect("/auth/login");
    } else {
        // @ts-expect-error TODO: Define the session type for the user object
        response.locals.user = request.session.user;
        next();
    }
};
export default authenticationMiddleware;
