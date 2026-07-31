const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connectDB");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Agent Server" });
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Database connection Established !!");
      console.log(`Agent server running on port - ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected !!", err);
  });
