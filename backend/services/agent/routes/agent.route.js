import express from "express";
const agentRouter = express.Router();

import { agent } from "../controllers/agent.controller.js";

agentRouter.post("/chat", agent);

export default agentRouter;
