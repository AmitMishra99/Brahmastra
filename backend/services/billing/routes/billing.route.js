import express from "express";
const billingRouter = express.Router();

import {
  createOrder,
  verifyPayment,
} from "../controllers/billing.controller.js";

billingRouter.post("/create-order", createOrder);
billingRouter.post("/verify-payment", verifyPayment);

export default billingRouter;
