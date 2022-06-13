import { Router, Response } from "express";
import { FeedRouter } from "./feed/routes/feed.router";
import { UserRouter } from "./users/routes/user.router";

const router = Router();

router.use("/feed", FeedRouter);
router.use("/users", UserRouter);

export { router as IndexRouter };
