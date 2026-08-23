import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import http from "node:http";
import cors from "cors";
import "./models/db.js";
import { connectToServer } from "./controllers/socketManager.js";
import userRouter from "./routes/users.routes.js";

const app = express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));
app.use("/api/v1/users", userRouter);
const io = connectToServer(server);

app.get("/", (req, res) => {
  res.json({ message: "HELLO!!" });
});

const start = async () => {
  server.listen(port, () => {
    console.log(`server listening to port -> ${port}`);
  });
};

start();
