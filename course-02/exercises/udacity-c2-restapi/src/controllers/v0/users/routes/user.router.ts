import { Router, Request, Response } from "express";

import { User } from "../models/User";
import { AuthRouter, requireAuth } from "./auth.router";

const router = Router();

router.use("/auth", AuthRouter);

router.get("/", async (_, res: Response) => {
    try {
        const users = await User.findAndCountAll({ order: [["email", "ASC"]] });
        return res.status(200).json(users);
    } catch (error) {
        throw error;
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const item = await User.findByPk(req.params.id);
    res.json(item);
});

export { router as UserRouter };
