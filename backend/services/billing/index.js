import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/connectDb.js";
import billingRouter from "./routes/billing.route.js";

const port = process.env.PORT || 8004;
const app = express();

app.use(express.json());

app.use("/", billingRouter);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Billing service is running on port - ${port}`);
    });
  })
  .catch((err) => {
    console.error("Billing Service Error - ", err);
  });
