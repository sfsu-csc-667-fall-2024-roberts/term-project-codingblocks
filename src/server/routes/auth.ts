import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// for ejs connection ~
// https://stackoverflow.com/a/36226334/17123405

// when we use a middleware this will be
// ("/login", session, (req.... res))
router.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    // todo: for now ima just return some dummy json
    if (email && password) {
        res.json({
            success: true,
            message: "logged-in",
            token: "some",
        });
    } else {
        res.status(401).json({
            success: false,
            message: "unauthorized",
        });
    }
});

// when we use a middleware this will be
// ("/signup", session, (req.... res))
router.post("/signup", (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    // todo: for now ima just return some dummy json
    if (email && password && username) {
        res.json({
            success: true,
            message: "user created",
            token: "some",
            user: { email, username },
        });
    } else {
        res.status(400).json({
            success: false,
            message: "email + password + username pls",
        });
    }
});

export default router;
