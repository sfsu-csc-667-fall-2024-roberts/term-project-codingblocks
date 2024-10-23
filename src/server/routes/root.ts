import express from "express";

const router = express.Router();

router.get("/", (_req: express.Request, res: express.Response) => {
    res.render("root", { name: "codingblocks site"});
});

export default router;