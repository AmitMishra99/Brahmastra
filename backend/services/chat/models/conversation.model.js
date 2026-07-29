const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "New Chat",
    },
    userID: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Conversation = new mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
