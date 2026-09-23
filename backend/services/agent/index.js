import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import agentRouter from "./routes/agent.route.js";
import routerRoutes from "./routes/router.route.js";

const app = express();
const port = process.env.PORT || 9003;

app.use(express.json());
app.use("/", agentRouter);
app.use("/", routerRoutes);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Agent server running on port - ${port}`);
    });
  })
  .catch((err) => {
    console.error("Agent Server Error - ", err);
  });
