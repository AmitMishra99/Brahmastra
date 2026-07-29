const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
    },
    content: String,
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
