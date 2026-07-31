const express = require("express");
const app = express();
const proxy = require("express-http-proxy");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const protect = require("./middleware/auth.middleware");
const getCurrentUser = require("./controller/user.controller");
const proxyWithHeader = require("./utils/proxyWithHeaders");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/api/me", protect, getCurrentUser);
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat", protect, proxy(proxyWithHeader(process.env.CHAT_SERVICE)));
app.use("/api/agent", protect, proxy(process.env.AGENT_SERVICE));

app.use("/", (req, res) => {
  res.json({ message: "Gatway Server !!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on ${process.env.PORT}`);
});
