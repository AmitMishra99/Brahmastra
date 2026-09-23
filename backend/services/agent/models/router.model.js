import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    prompt: {
      type: String,
      required: true,
    },

    agent: {
      type: String,
      enum: ["chat", "search", "coding", "pdf", "ppt", "image"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Router = mongoose.model("Router", agentSchema);

export default Router;
