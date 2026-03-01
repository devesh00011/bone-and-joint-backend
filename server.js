import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import indexRouter from "./app/modules/indexRouter.js";
import pool from "./app/config/pgDb.js";
const app = express();
import cors from 'cors'
app.use(cors())
app.use(express.json());

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
    console.log("postgreSQL connected ✔");
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
//start backend

export default app;
