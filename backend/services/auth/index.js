import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/", authRouter);

app.use("/", (req, res) => {
  res.json({ message: "Auth Server !!" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Auth server running on port - ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Auth server error - ${err}`);
  });
