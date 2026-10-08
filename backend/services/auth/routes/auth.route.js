import express from "express";
const authRouter = express.Router();

import {
  login,
  logout,
  updateUserPlan,
  deductCredits,
} from "../controllers/auth.controller.js";

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/update-plan", updateUserPlan);
authRouter.post("/deduct-credits", deductCredits);

export default authRouter;
