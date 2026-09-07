import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use("/", chatRouter);

app.get("/", (req, res) => {
  res.send({ message: "Chat Server" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("MongoDB Connected !!");
      console.log(`Chat server running on port - ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Chat Server Error - ", err);
  });
