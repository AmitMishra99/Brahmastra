import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();
const port = process.env.PORT || 9002;

app.use(express.json());
app.use("/", chatRouter);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Chat server running on port - ${port}`);
    });
  })
  .catch((err) => {
    console.error("Chat Server Error - ", err);
  });
