import express from "express";
const chatRouter = express.Router();
import {
  createConversation,
  updateConversationTitle,
  getConversations,
  getMessages,
  createMessage,
} from "../controllers/chat.controller.js";

chatRouter.post("/create-conversation", createConversation);
chatRouter.get("/get-conversations", getConversations);
chatRouter.post("/create-message", createMessage);
chatRouter.get("/get-messages/:conversationId", getMessages);
chatRouter.patch("/update-conversation-title", updateConversationTitle);

export default chatRouter;
