import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// for ejs connection ~
// https://stackoverflow.com/a/36226334/17123405

router.get("/", (req: Request, res: Response) => {
    // @ts-expect-error
    if (req.session.user) {
        return res.redirect("/lobby");
    }

    res.render("home", {
        title: "Welcome to Poker",
        userLoggedIn: false,
    });
});

export default router;
