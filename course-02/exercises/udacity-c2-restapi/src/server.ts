import express, { NextFunction, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "./sequelize";
import { IndexRouter } from "./controllers/v0/index.router";
import { V0MODELS } from "./controllers/v0/model.index";

sequelize.addModels(V0MODELS);
sequelize.sync();

const app = express();
const port = process.env.PORT || 8080; // default port to listen

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS Should be restricted
app.use((_, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    next();
});

app.use("/api/v0/", IndexRouter);

// Start the Server
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
});
