import express from "express";
const agentRouter = express.Router();

import { agent } from "../controllers/agent.controller";

agentRouter.post("/chat", agent);

export default agentRouter;
