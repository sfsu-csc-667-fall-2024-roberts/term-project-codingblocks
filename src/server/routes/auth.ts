import express from "express";
import { Request, Response } from "express";

import { Users } from "../db";

const router = express.Router();

router.get("/login", (req: Request, res: Response) => {
    res.render("auth/login", { title: "Login", userLoggedIn: false });
});

router.get("/register", (req: Request, res: Response) => {
    res.render("auth/register", { title: "Register", userLoggedIn: false });
});

router.post("/register", async (request, response) => {
    const { username, email, password } = request.body;
    try {
        const user = await Users.register(username, email, password);
        // @ts-expect-error TODO: Define the session type for the user object
        request.session.user = user;
        response.redirect("/lobby");
    } catch (error) {
        console.error(error);
        request.flash("error", "Failed to register user");
        response.redirect("/auth/register");
    }
});

router.post("/login", async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await Users.login(email, password);
        // @ts-expect-error TODO: Define the session type for the user object
        request.session.user = user;
        response.redirect("/lobby");
    } catch (error) {
        console.error(error);
        request.flash("error", error as string);
        response.redirect("/auth/login");
    }
});

router.get("/logout", (request, response) => {
    request.session.destroy(() => {
        response.redirect("/");
    });
});

export default router;
