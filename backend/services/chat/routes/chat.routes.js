import express from "express";
const chatRouter = express.Router();
import {
  createConversation,
  updateConversation,
  getConversations,
  getMessages,
  saveMessage,
} from "../controller/chat.controller.js";

chatRouter.get("/create-conversation", createConversation);
chatRouter.get("/get-conversations", getConversations);
chatRouter.get("/update-conversation", updateConversation);
chatRouter.get("/save-message", saveMessage);
chatRouter.get("/get-messages/:conversationId", getMessages);

export default chatRouter;
