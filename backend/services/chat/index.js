const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connectDB");
const router = require("./routes/chat.routes");

const app = express();
app.use("/", router);

app.get("/", (req, res) => {
  res.send({ message: "Chat Server is working very well !!" });
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Database connection Established !!");
      console.log(`Chat server running on port - ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected !!", err);
  });
