import { Router, Response } from "express";
import { FeedRouter } from "./feed/routes/feed.router";
import { UserRouter } from "./users/routes/user.router";

const router = Router();

router.use("/feed", FeedRouter);
router.use("/users", UserRouter);

// [ /api/v0/ ]:
router.get("/", async (_, res: Response) => {
    res.send(`V0`);
});

export { router as IndexRouter };
