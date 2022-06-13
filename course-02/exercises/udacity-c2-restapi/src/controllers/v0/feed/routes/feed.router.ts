import { Router, Request, Response } from "express";

import { FeedItem } from "../models/FeedItem";
import { requireAuth } from "../../users/routes/auth.router";
import { getGetSignedURL, getPutSignedURL } from "../../../../aws";

const router = Router();

// [ /api/v0/feed/ ]:
// Get all feed items:

router.get("/", async (_, res: Response) => {
    const items = await FeedItem.findAndCountAll({ order: [["id", "DESC"]] });

    items.rows.map((item) => {
        if (item.url) {
            item.url = getGetSignedURL(item.url);
        }
    });

    res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send("Invalid / No ID entered.");
    }

    const item = await FeedItem.findAll({ where: { id } });
    if (item.length === 0) return res.status(404).send("Item not found.");
    return res.status(200).send(item);
});

// [ /api/v0/feed/:id ]:
// update a specific resource:

router.patch("/:id", requireAuth, async (req: Request, res: Response) => {
    //@TODO try it yourself
    const { caption, url }: { caption: string; url: string } = req.body;
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send("Invalid / No ID entered.");
    }

    const result = await FeedItem.update({ caption, url }, { where: { id }, returning: true });

    if (result[0] === 0) {
        return res.status(404).send("Item not found.");
    }

    const updatedItem = result[1][0];
    updatedItem.url = getGetSignedURL(updatedItem.url);
    return res.status(200).send(updatedItem);
});

// [ /api/v0/feed/signed-url/:fileName ]:
// Get a signed url to put a new item in the bucket:

router.get("/signed-url/:fileName", requireAuth, async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = getPutSignedURL(fileName);
    res.status(201).send({ url: url });
});

// [ /api/v0/feed/ ]:
// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};

router.post("/", requireAuth, async (req: Request, res: Response) => {
    const { caption, url: fileName }: { caption: string, url: string } = req.body;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: "Caption is required or malformed" });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: "File url is required" });
    }

    const item = new FeedItem({
        caption,
        url: fileName,
    });

    const saved_item = await item.save();

    saved_item.url = getGetSignedURL(saved_item.url);
    res.status(201).send(saved_item);
});

export { router as FeedRouter };
