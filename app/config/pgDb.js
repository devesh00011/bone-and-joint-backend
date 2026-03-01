import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DB,
  port: process.env.PG_PORT,
  max: process.env.PG_MAX_CONNECTION,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log(`Connected to PostgresSQL`);
});

pool.on("error", (err) => {
  console.log("Unexpected DB error", err);
  process.exit(-1);
});

export default pool;
