import { Sequelize } from "sequelize-typescript";
import { config } from "./config/config";

const { username, password, database, host } = config.dev;

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
    database,
    dialect: "postgres",
    username,
    password,
    storage: ":memory:",
    host,
});
