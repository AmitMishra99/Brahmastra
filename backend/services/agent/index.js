import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import agentRouter from "./routes/agent.route.js";

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());
app.use("/", agentRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Agent Server" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Agent server running on port - ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Agent Server Error - ", err);
  });
