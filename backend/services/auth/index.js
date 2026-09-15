import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";

const app = express();
const port = process.env.PORT || 9001;

app.use(express.json());
app.use("/", authRouter);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Auth server running on port - ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Auth server error - ${err}`);
  });
