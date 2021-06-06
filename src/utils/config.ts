import * as dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const SERVER_DB = process.env.SERVER_DB;
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_DEFAULT = process.env.DB_DEFAULT;
export const PORT_TEST = process.env.PORT_TEST;