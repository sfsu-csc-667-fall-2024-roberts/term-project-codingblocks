import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// for ejs connection ~
// https://stackoverflow.com/a/36226334/17123405

router.get("/", (_req: Request, res: Response) => {
    res.render("home", {
        title: "Home page",
        user: "User",
        userLoggedIn: false,
    });
});

export default router;
