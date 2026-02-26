import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

const dbUrl = process.env.MYSQL_DATABASE_URL;
if (!dbUrl) {
  console.error("Warning: MYSQL_DATABASE_URL is not set. Database features will not work.");
}

export const pool = dbUrl ? mysql.createPool({
  uri: dbUrl,
  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 10000,
}) : null;

export const db = pool ? drizzle(pool, { schema, mode: "default" }) : null;
