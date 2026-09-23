import express from "express";
const routerRoutes = express.Router();

import { createRouterLog , getAgent } from "../controllers/router.controller.js";

routerRoutes.post("/save-agent", createRouterLog);
routerRoutes.post("/get-agent", getAgent);

export default routerRoutes;
