import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import proxyWithHeader from "./utils/proxyWithHeaders.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { protect } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/me", protect, getCurrentUser);
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE));

app.listen(PORT, () => {
  console.log(`Gateway Server is listening on ${PORT}`);
});
