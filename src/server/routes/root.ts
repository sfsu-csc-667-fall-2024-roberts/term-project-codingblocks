import express from "express";

const router = express.Router();

router.get("/", (_req: express.Request, res: express.Response) => {
    res.status(200)
    res.json({ title: "coding block's site" });
});

export default router;