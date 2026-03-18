import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import indexRouter from "./app/modules/indexRouter.js";
import pool from "./app/config/pgDb.js";
import bcrypt from "bcrypt";

const app = express();
import cors from 'cors'
app.use(cors())
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.boneandjointhospital.co.in",
  "https://admin.boneandjointhospital.co.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  })
);

//primary router (index)
app.use("/web", indexRouter);



// universal route for checking
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bone and Joint Hospital Backend is running",
    timestamp: new Date(),
  });
});



const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected ✔");

    // 1️⃣ Create table
    await pool.query(`

      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


  CREATE TABLE IF NOT EXISTS admin_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email VARCHAR(150) UNIQUE NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    otp BIGINT CHECK (otp >= 100000 AND otp <= 999999),
    otp_expire BIGINT CHECK (otp_expire > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

    // 2️⃣ Check admin exist
    const adminCheck = await pool.query(
      "SELECT * FROM admin_user WHERE admin_email=$1",
      ["Deveshsolanki05@gmail.com"]
    );

    if (adminCheck.rows.length === 0) {

      // bcrypt hash
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await pool.query(
        "INSERT INTO admin_user (admin_email, admin_password) VALUES ($1,$2)",
        ["Deveshsolanki05@gmail.com", hashedPassword]
      );

      console.log("Default admin created ✔");
    }

    console.log("Admin table verified ✔");

    const server = http.createServer(app);

    server.listen(process.env.PORT, () => {
      console.log(`Server running on PORT : ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("DB connection failed", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
