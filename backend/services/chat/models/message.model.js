import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: String,
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
