import express from "express";
const authRouter = express.Router();

import {
  login,
  logout,
  updateUserPlan,
} from "../controllers/auth.controller.js";

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/update-plan", updateUserPlan);

export default authRouter;
